function createBarChart(data) {
    const legendHeight = 44;
    const svgHeight = height + legendHeight;

    const orderedData = [...data].sort((a, b) => {
        const indexA = formatsInfo.findIndex(format => format.id === String(a.screen_tech).toLowerCase());
        const indexB = formatsInfo.findIndex(format => format.id === String(b.screen_tech).toLowerCase());
        return indexA - indexB;
    });

    const xScaleLocal = d3.scaleBand()
        .domain(orderedData.map(d => d.screen_tech))
        .range([0, innerWidth])
        .padding(0.25);

    const yScaleLocal = d3.scaleLinear()
        .domain([0, d3.max(orderedData, d => d.energy_consumption) || 0])
        .nice()
        .range([innerHeight, 0]);

    const root = d3.select("#bar-chart");
    root.selectAll("svg").remove();

    const svg = root.append("svg")
        .attr("viewBox", `0 0 ${width} ${svgHeight}`)
        .attr("role", "img")
        .attr("focusable", "true")
        .attr("tabindex", 0)
        .attr("aria-labelledby", "bar-chart-title bar-chart-desc")
        .style("border", "0.5px solid grey")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", "auto");

    svg.append("title")
        .attr("id", "bar-chart-title")
        .text("Energy consumption for 55-inch TVs by screen technology");

    svg.append("desc")
        .attr("id", "bar-chart-desc")
        .text("A bar chart comparing annual energy consumption for 55-inch LCD, LED, and OLED televisions in Australia.");

    const group = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    group.append("g")
        .attr("class", "x-grid")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScaleLocal).tickSize(-innerHeight).tickFormat(""))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line")
            .attr("stroke", "#e0e0e0")
            .attr("stroke-dasharray", "3,3"));

    group.append("g")
        .attr("class", "y-grid")
        .call(d3.axisLeft(yScaleLocal).ticks(6).tickSize(-innerWidth).tickFormat(""))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line")
            .attr("stroke", "#e0e0e0")
            .attr("stroke-dasharray", "3,3"));
// create dash lines for the chart background
    group.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScaleLocal))
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
        .text("Screen Technology");

    group.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScaleLocal).ticks(6).tickFormat(d => `${d}`))
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
        .text("Energy Consumption (kWh/year)");

    const getBarColor = (tech) => {
        const format = formatsInfo.find(item => item.id === String(tech).toLowerCase());
        return format ? format.color : "#1E88E5";
    };

    const fallbackTooltip = d3.select("body").select(".donut-tooltip").empty()
        ? d3.select("body")
            .append("div")
            .attr("class", "donut-tooltip")
            .style("position", "fixed")
            .style("pointer-events", "none")
            .style("z-index", "9999")
            .style("padding", "8px 10px")
            .style("border-radius", "8px")
            .style("font-family", "sans-serif")
            .style("font-size", "12px")
            .style("line-height", "1.4")
            .style("color", "#fff")
            .style("background", "rgba(17, 24, 39, 0.95)")
            .style("box-shadow", "0 8px 20px rgba(0,0,0,0.22)")
            .style("opacity", 0)
        : d3.select("body").select(".donut-tooltip");

    const showBarTooltip = (d) => {
        if (typeof tooltip !== "undefined") {
            tooltip
                .style("opacity", 1)
                .html(
                    `<strong>${d.screen_tech}</strong><br>` +
                    `Energy: ${d3.format(",.1f")(d.energy_consumption)} kWh/year`
                );
        } else {
            fallbackTooltip
                .style("opacity", 1)
                .html(
                    `<strong>${d.screen_tech}</strong><br>` +
                    `Energy: ${d3.format(",.1f")(d.energy_consumption)} kWh/year`
                );
        }
    };

    const hideBarTooltip = () => {
        if (typeof hideTooltip === "function") {
            hideTooltip();
        } else {
            fallbackTooltip.style("opacity", 0);
        }
    };

    const positionBarTooltipFromPointer = (event) => {
        if (typeof positionTooltipFromPointer === "function") {
            positionTooltipFromPointer(event);
        } else {
            fallbackTooltip
                .style("left", `${event.clientX + 14}px`)
                .style("top", `${event.clientY + 14}px`);
        }
    };

    const positionBarTooltipFromElement = (element) => {
        if (typeof positionTooltipFromElement === "function") {
            positionTooltipFromElement(element);
        } else {
            const rect = element.getBoundingClientRect();
            fallbackTooltip
                .style("left", `${rect.left + rect.width / 2 + 12}px`)
                .style("top", `${rect.top - 10}px`);
        }
    };

    group.selectAll("rect")
        .data(orderedData)
        .join("rect")
        .attr("x", d => xScaleLocal(d.screen_tech))
        .attr("y", d => yScaleLocal(d.energy_consumption))
        .attr("width", xScaleLocal.bandwidth())
        .attr("height", d => innerHeight - yScaleLocal(d.energy_consumption))
        .attr("fill", d => getBarColor(d.screen_tech))
        .attr("opacity", 0.9)
        .attr("tabindex", 0)
        .attr("role", "button")
        .attr("aria-label", d => `${d.screen_tech}: ${d3.format(",.1f")(d.energy_consumption)} kilowatt-hours per year`)
        .on("mouseenter", function (event, d) {
            d3.select(this).attr("opacity", 1);
            showBarTooltip(d);
            positionBarTooltipFromPointer(event);
        })
        .on("mousemove", function (event) {
            positionBarTooltipFromPointer(event);
        })
        .on("mouseleave", function () {
            d3.select(this).attr("opacity", 0.9);
            hideBarTooltip();
        })
        .on("focus", function (event, d) {
            d3.select(this).attr("opacity", 1);
            showBarTooltip(d);
            positionBarTooltipFromElement(this);
        })
        .on("blur", function () {
            d3.select(this).attr("opacity", 0.9);
            hideBarTooltip();
        })
        .on("keydown", function (event, d) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                showBarTooltip(d);
                positionBarTooltipFromElement(this);
            }
            if (event.key === "Escape") {
                hideBarTooltip();
            }
        });

    group.selectAll(".bar-label")
        .data(orderedData)
        .join("text")
        .attr("class", "bar-label")
        .attr("x", d => (xScaleLocal(d.screen_tech) || 0) + xScaleLocal.bandwidth() / 2)
        .attr("y", d => yScaleLocal(d.energy_consumption) - 8)
        .attr("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-size", "11px")
        .style("font-weight", "600")
        .style("fill", "#1f2937")
        .text(d => d3.format(",.1f")(d.energy_consumption));

    const legendGroup = svg.append("g")
        .attr("class", "bar-chart-legend")
        .attr("transform", `translate(${margin.left}, ${height + 14})`);

    const legendItems = legendGroup.selectAll("g")
        .data(orderedData)
        .join("g")
        .attr("transform", (d, i) => `translate(${i * 110}, 0)`);

    legendItems.append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("fill", d => getBarColor(d.screen_tech));

    legendItems.append("text")
        .attr("x", 18)
        .attr("y", 10)
        .style("font-family", "sans-serif")
        .style("font-size", "11px")
        .style("fill", "#222")
        .text(d => d.screen_tech);
}