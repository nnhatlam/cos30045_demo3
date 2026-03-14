const format = d3.format(".0%");

function createDonutChart(data) {
    const totalEnergy = d3.sum(data, d => d.energy_consumption);
    const highest = data.reduce(
        (max, item) => (item.energy_consumption > max.energy_consumption ? item : max),
        data[0]
    );
    const highestShare = totalEnergy > 0 ? highest.energy_consumption / totalEnergy : 0;

    const svg = d3.select("#donut-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr("focusable", "true")
        .attr("tabindex", 0)
        .attr("aria-labelledby", "donut-chart-title donut-chart-desc")
        .style("border", "0.5px solid grey")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", "auto");

    svg.append("title")
        .attr("id", "donut-chart-title")
        .text("Annual TV energy consumption by screen technology");

    svg.append("desc")
        .attr("id", "donut-chart-desc")
        .text(
            `${highest.screen_tech} has the highest share at ${d3.format(".1%")(highestShare)}. ` +
            "The donut chart compares LCD, LED, and OLED yearly energy consumption."
        );
    
    const group = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const chart_area = group.append("g")
        .attr("transform", `translate(${150 - innerWidth / 2}, ${150 - innerHeight / 2})`);

    const formattedData = data.map(d => ({
        screen_tech: d.screen_tech,
        value: d.energy_consumption
    }));

    const radius = Math.min(innerWidth, innerHeight) / 2;

    const pieGenerator = d3.pie()
        .value(d => d.value)
        .sort(null);

    const annotatedData = pieGenerator(formattedData);

    const arcGenerator = d3.arc()
        .innerRadius(radius * 0.3)
        .outerRadius(radius * 0.8);

    const getLabelColor = (hexColor) => {
        const normalized = (hexColor || "").replace("#", "");
        const fullHex = normalized.length === 3
            ? normalized.split("").map(ch => ch + ch).join("")
            : normalized;

        const r = parseInt(fullHex.substring(0, 2), 16) || 0;
        const g = parseInt(fullHex.substring(2, 4), 16) || 0;
        const b = parseInt(fullHex.substring(4, 6), 16) || 0;
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return luminance > 0.6 ? "#111" : "#fff";
    };

    const donutContainer = chart_area.append("g");
    const slicesGroup = donutContainer.append("g")
        .attr("class", "slices-group")
        .attr("role", "list")
        .attr("aria-label", "Donut chart slices");

    const labelsGroup = donutContainer.append("g")
        .attr("class", "labels-group")
        .attr("aria-hidden", "true");

    const legendsContainer = chart_area.append("g")
        .attr("role", "list")
        .attr("aria-label", "Legend")
        .attr("transform", `translate(${radius + 20}, ${-radius})`);

    legendsContainer.selectAll("rect")
        .data(formatsInfo)
        .join("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * 25)
        .attr("width", 20)
        .attr("height", 20)
        .attr("role", "listitem")
        .attr("aria-label", d => `${d.label} color key`)
        .attr("fill", d => d.color);

    legendsContainer.selectAll("text")
        .data(formatsInfo)
        .join("text")
        .text(d => d.label)
        .attr("x", 30)
        .attr("y", (d, i) => i * 25 + 15)
        .attr("aria-hidden", "true") // accessibility: hide from screen readers since color is already described in the rect's aria-label
        .style("font-family", "sans-serif")
        .style("font-size", "clamp(10px, 1.3vw, 14px)")
        .style("fill", "black");

    const slices = slicesGroup.selectAll("path")
        .data(annotatedData)
        .join("path")
        .attr("d", arcGenerator)
        .attr("role", "listitem")
        .attr("tabindex", 0)
        .attr("aria-label", d => {
            const share = totalEnergy > 0 ? d.data.value / totalEnergy : 0;
            return `${d.data.screen_tech}: ${d.data.value.toFixed(1)} kilowatt-hours per year, ${d3.format(".1%")(share)} of total.`;
        })
        .attr("fill", d => colorScale(d.data.screen_tech.toLowerCase()));

    if (typeof animateDonutSlices === "function") {
        animateDonutSlices(slices, arcGenerator);
    }

    if (typeof addDonutInteractions === "function") {
        addDonutInteractions(slices, arcGenerator);
    }

    labelsGroup.selectAll("text")
        .data(annotatedData)
        .join("text")
        .text(d => format((d.endAngle - d.startAngle) / (2 * Math.PI)))
        .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("pointer-events", "none") 
        .style("font-family", "sans-serif")
        .style("font-size", "clamp(10px, 1.3vw, 14px)")
        .style("font-weight", "700")
        .style("fill", d => {
            const sliceColor = colorScale(d.data.screen_tech.toLowerCase());
            return getLabelColor(sliceColor);
        });
    
}
