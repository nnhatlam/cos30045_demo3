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
        .text("Scatter plot of TV screen size vs energy consumption");
    svg.append("desc")
        .attr("id", "scatter-chart-desc")
        .text("A scatter plot showing the relationship between TV screen size (inches) and energy consumption (kW/year).");
    const group = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    group.append("g")
    // Add x-axis label + draw x-axis
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(10).tickFormat(d => `${d}"`))
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
        .text("Screen Size (inches)");
    // X-axis gridlines
    group.append("g")
        .attr("class", "x-grid")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(10).tickSize(-innerHeight).tickFormat(""))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line")
            .attr("stroke", "#e0e0e0")
            .attr("stroke-dasharray", "3,3"));
    group.append("g")
    // Add y-axis label
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale).ticks(8).tickFormat(d => `${d}`))
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
        .text("Energy Consumption (kW/year)");
    // Y-axis gridlines
    group.append("g")
        .attr("class", "y-grid")
        .call(d3.axisLeft(yScale).ticks(8).tickSize(-innerWidth).tickFormat(""))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line")
            .attr("stroke", "#e0e0e0")
            .attr("stroke-dasharray", "3,3")); //dash line
    group.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScale(d.screen_size))
        .attr("cy", d => yScale(d.energy_consumption))
        .attr("r", 6)
        .attr("fill", "#1E88E5")
        .attr("opacity", 0.7)
        .attr("tabindex", 0)
        .attr("aria-label", d => `Energy consumption of different screen sizes. ${d.screen_size} inches consumes ${d.energy_consumption} kilowatt-hours per year.`)
    
    if (typeof ScatterPointInteractions === "function") {
        ScatterPointInteractions();
    }
}

