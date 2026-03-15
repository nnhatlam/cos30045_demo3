function createLineChart(data) {
    const legendHeight = 56;
    const svgHeight = height + legendHeight;
    const sortedData = [...data].sort((a, b) => a.year - b.year);
    const seriesList = formatLines.map(series => ({
        ...series,
        values: sortedData.map(row => ({
            year: row.year,
            value: row[series.id]
        }))
    }));
    const maxValue = d3.max(seriesList, series => d3.max(series.values, point => point.value)) || 0;

    const xScaleLocal = d3.scaleLinear()
        .domain(d3.extent(sortedData, d => d.year))
        .nice()
        .range([0, innerWidth]);

    const yScaleLocal = d3.scaleLinear()
        .domain([0, maxValue])
        .nice()
        .range([innerHeight, 0]);

    const lineGenerator = d3.line()
        .defined(d => Number.isFinite(d.value))
        .x(d => xScaleLocal(d.year))
        .y(d => yScaleLocal(d.value))
        .curve(d3.curveMonotoneX);

    const root = d3.select("#line-chart");
    root.selectAll("svg").remove();

    const svg = root
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${svgHeight}`)
        .attr("role", "img")
        .attr("focusable", "true")
        .attr("tabindex", 0)
        .attr("aria-labelledby", "line-chart-title line-chart-desc")
        .style("border", "0.5px solid grey")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", "auto");
    svg.append("title")
        .attr("id", "line-chart-title")
        .text("Average TV prices in Australia from 1998 to 2023");
    svg.append("desc")
        .attr("id", "line-chart-desc")
        .text("A line chart showing TV price trends in Australia from 1998 to 2023. Hover or focus on points for values, and click a line to isolate one state.");
    const group = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    group.append("text")
        .attr("x", innerWidth)
        .attr("y", -16)
        .attr("text-anchor", "end")
        .attr("fill", "#555")
        .style("font-family", "sans-serif")
        .style("font-size", "11px")
        .text("Click a line to isolate a state. Click it again to reset.");
    
    group.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        // write the text for x-axis label
        .call(d3.axisBottom(xScaleLocal).ticks(8).tickFormat(d3.format("d")))
        .call(g => g.selectAll(".tick text")
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .style("fill", "#333"))
        .call(g => g.selectAll(".tick line")
            .attr("y2", 6)
            .attr("stroke", "#555"))
        .call(g => g.select(".domain").attr("stroke", "#555"))
        .append("text")
        .attr("x", innerWidth / 2)
        .attr("y", 42)
        .attr("fill", "black")  
        .style("font-family", "sans-serif")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Year"); 
    // X-axis gridlines
    group.append("g")
        .attr("class", "x-grid")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScaleLocal).ticks(8).tickSize(-innerHeight).tickFormat(""))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line")
            .attr("stroke", "#e0e0e0")
            .attr("stroke-dasharray", "3,3"));
    group.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScaleLocal).ticks(8).tickFormat(d => `${d}`))
        // write the text for y-axis label
        .call(g => g.selectAll(".tick text")
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .style("fill", "#333"))
        .call(g => g.selectAll(".tick line")
            .attr("x2", -6)
            .attr("stroke", "#555"))
        .call(g => g.select(".domain").attr("stroke", "#555"))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -55)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Average Price (AUD)");

    group.append("g")
        .attr("class", "y-grid")
        .call(d3.axisLeft(yScaleLocal).ticks(8).tickSize(-innerWidth).tickFormat(""))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line")
            .attr("stroke", "#e0e0e0")
            .attr("stroke-dasharray", "3,3"));
    

    let activeSeriesId = null;

    const updateSeriesVisibility = () => {
        linePaths
            .attr("opacity", d => activeSeriesId === null || d.id === activeSeriesId ? 1 : 0.12)
            .attr("stroke-width", d => activeSeriesId === null
                ? (d.id === "average_price" ? 3 : 2)
                : (d.id === activeSeriesId ? 3.5 : 1.5));

        pointGroups
            .attr("display", d => activeSeriesId === null || d.id === activeSeriesId ? null : "none");

        legendItems
            .attr("opacity", d => activeSeriesId === null || d.id === activeSeriesId ? 1 : 0.35)
            .select("text")
            .style("font-weight", d => activeSeriesId === d.id ? "700" : "500");
    };

    const toggleSeries = (seriesId) => {
        activeSeriesId = activeSeriesId === seriesId ? null : seriesId;
        updateSeriesVisibility();
    };

    const linePaths = group.append("g")
        .attr("class", "line-series")
        .selectAll("path")
        .data(seriesList)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", d => d.color)
        .attr("stroke-width", d => d.id === "average_price" ? 3 : 2)
        .attr("tabindex", 0)
        .attr("role", "button")
        .attr("aria-keyshortcuts", "Enter Space")
        .attr("aria-label", d => `${d.label} line. Click to isolate this series.`)
        .style("cursor", "pointer")
        .attr("d", d => lineGenerator(d.values))
        .on("mouseenter", function (event, d) {
            showSeriesTooltip(d);
            positionTooltipFromPointer(event);
        })
        .on("mousemove", function (event) {
            positionTooltipFromPointer(event);
        })
        .on("mouseleave", hideTooltip)
        .on("focus", function (event, d) {
            showSeriesTooltip(d);
            positionTooltipFromElement(this);
        })
        .on("blur", hideTooltip)
        .on("click", function (event, d) {
            event.stopPropagation();
            toggleSeries(d.id);
        })
        .on("keydown", function (event, d) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleSeries(d.id);
                showSeriesTooltip(d);
                positionTooltipFromElement(this);
            }
            if (event.key === "Escape") {
                activeSeriesId = null;
                updateSeriesVisibility();
                hideTooltip();
            }
        });

    const pointGroups = group.append("g")
        .attr("class", "line-points")
        .selectAll("g")
        .data(seriesList)
        .join("g")
        .attr("data-series-id", d => d.id);

    pointGroups.selectAll("circle")
        .data(d => d.values.map(point => ({ ...point, seriesId: d.id, seriesLabel: d.label, color: d.color })))
        .join("circle")
        .attr("cx", d => xScaleLocal(d.year))
        .attr("cy", d => yScaleLocal(d.value))
        .attr("r", d => d.seriesId === "average_price" ? 4 : 3)
        .attr("fill", d => d.color)
        .attr("tabindex", 0)
        .attr("aria-label", d => `${d.seriesLabel}, year ${d.year}, price ${d.value} Australian dollars`)
        .on("mouseenter", function (event, d) {
            showPointTooltip({ label: d.seriesLabel }, d);
            positionTooltipFromPointer(event);
        })
        .on("mousemove", function (event) {
            positionTooltipFromPointer(event);
        })
        .on("mouseleave", hideTooltip)
        .on("focus", function (event, d) {
            showPointTooltip({ label: d.seriesLabel }, d);
            positionTooltipFromElement(this);
        })
        .on("blur", hideTooltip)
        .on("keydown", function (event, d) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                showPointTooltip({ label: d.seriesLabel }, d);
                positionTooltipFromElement(this);
            }
            if (event.key === "Escape") {
                hideTooltip();
            }
        });

    const legendColumns = 3;
    const legendItemWidth = innerWidth / legendColumns;
    const legendGroup = svg.append("g")
        .attr("class", "line-chart-legend")
        .attr("transform", `translate(${margin.left}, ${height + 10})`);

    const legendItems = legendGroup.selectAll("g")
        .data(seriesList)
        .join("g")
        .attr("transform", (d, i) => `translate(${(i % legendColumns) * legendItemWidth}, ${Math.floor(i / legendColumns) * 18})`);

    legendItems.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 15)
        .attr("y2", 0)
        .attr("stroke", d => d.color)
        .attr("stroke-width", d => d.id === "average_price" ? 3 : 2)
        .attr("stroke-linecap", "round");

    legendItems.append("text")
        .attr("x", 30)
        .attr("y", 4)
        .attr("fill", "#222")
        .style("font-family", "sans-serif")
        .style("font-size", "11px")
        .style("font-weight", "500")
        .text(d => d.label);

    svg.on("click", () => {
        activeSeriesId = null;
        updateSeriesVisibility();
        hideTooltip();
    });

    updateSeriesVisibility();
};