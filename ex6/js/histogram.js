const applyScaleDomains = (bins) => {
    const minEng = bins[0]?.x0 ?? 0;
    const maxEng = bins[bins.length - 1]?.x1 ?? 1;
    const binsMaxLength = d3.max(bins, d => d.length) || 1;

    xScale.domain([minEng, maxEng]).range([0, innerWidth]);
    yScale.domain([0, binsMaxLength]).range([innerHeight, 0]);
};

const drawAxes = (innerChart, svg) => {
    innerChart
        .selectAll(".x-axis")
        .data([null])
        .join("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale));

    innerChart
        .selectAll(".y-axis")
        .data([null])
        .join("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale).ticks(5));

    svg
        .selectAll(".x-axis-label")
        .data([null])
        .join("text")
        .attr("class", "axis-label x-axis-label")
        .attr("x", width - 20)
        .attr("y", height - 5)
        .attr("text-anchor", "end")
        .text("Labeled Energy Consumption (kWh/year)");

    svg
        .selectAll(".y-axis-label")
        .data([null])
        .join("text")
        .attr("class", "axis-label y-axis-label")
        .attr("x", 24)
        .attr("y", 20)
        .text("Frequency");
};

const renderBars = (innerChart, bins, animate = true) => {
    const rects = innerChart
        .selectAll("rect")
        .data(bins, d => `${d.x0}-${d.x1}`)
        .join("rect")
        .attr("x", d => xScale(d.x0))
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
        .attr("fill", barColor)
        .attr("stroke", bodyBackgroundColor)
        .attr("stroke-width", 2);

    if (animate) {
        rects
            .transition()
            .duration(500)
            .ease(d3.easeCubicInOut)
            .attr("y", d => yScale(d.length))
            .attr("height", d => innerHeight - yScale(d.length));
    } else {
        rects
            .attr("y", d => yScale(d.length))
            .attr("height", d => innerHeight - yScale(d.length));
    }
};

const drawHistogram = (data) => {
    d3.select("#histogram").html("");

    const svg = d3.select("#histogram")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    const innerChart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const bins = binGenerator.thresholds(defaultBinCount)(data);
    applyScaleDomains(bins);
    renderBars(innerChart, bins, false);
    drawAxes(innerChart, svg);


};

const updateHistogram = (
    filterScreenId,
    data,
    filterSizeId = "all"
) => {
    const filteredByScreen = filterScreenId === "all"
        ? data
        : data.filter(d => d.screenTech.toLowerCase() === filterScreenId);

    const updatedData = filterSizeId === "all"
        ? filteredByScreen
        : filteredByScreen.filter(d => String(d.screenSize) === String(filterSizeId));

    const updatedBins = binGenerator.thresholds(defaultBinCount)(updatedData);
    applyScaleDomains(updatedBins);

    const svg = d3.select("#histogram svg");
    const innerChart = svg.select("g");

    renderBars(innerChart, updatedBins, true);
    drawAxes(innerChart, svg);
};