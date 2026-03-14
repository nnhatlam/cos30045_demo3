function createScatterPlot(data) {
    const svg = d3.select('#scatter-plot')
        .append('svg')
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr("focusable", "true")
        .attr("tabindex", 0)
        .attr("aria-labelledby", "scatter-chart-title scatter-chart-desc")
        .style("border", "0.5px solid grey")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", "auto");
    svg.append("title")
        .attr("id", "scatter-chart-title")
        .text("Scatter plot of TV energy consumption vs star rating index");
    svg.append("desc")
        .attr("id", "scatter-chart-desc")
        .text("A scatter plot showing the relationship between TV energy consumption and star rating index.");
    const group = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    group.append("g")
    // Add x-axis label + draw x-axis
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(5))
        .append("text")
        .attr("x", innerWidth / 2)
        .attr("y", 40)
        .attr("fill", "black")  
        .style("font-family", "sans-serif")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Energy Consumption (kW/year)");
    group.append("g")
    // Add y-axis label + draw y-axis
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale).ticks(5))
        .append("text")
        .attr("x", -innerHeight / 2)
        .attr("y", -40)
        .attr("fill", "black")
        .style("font-family", "sans-serif")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Star Rating Index (SRI)");
    group.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScale(d.energy_consumption))
        .attr("cy", d => yScale(d.sri))
        .attr("r", 6)
        .attr("fill", "#1E88E5")
        .attr("opacity", 0.7)
        .attr("tabindex", 0)
        .attr("aria-label", d => `Energy consumption of ${d.energy_consumption} kilowatt-hours per year and a star rating index of ${d.sri}.`)
}
