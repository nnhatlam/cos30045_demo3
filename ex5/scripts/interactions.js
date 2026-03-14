const handleMouseOver = (event, d) => {
    if (!document.getElementById("tooltip-announcer")) {
        const announcer = document.createElement("div")
        announcer.id = "tooltip-announcer";
        announcer.setAttribute("role", "status");
        announcer.setAttribute("aria-live", "polite");
        announcer.style.position = "absolute";
        announcer.style.left = "-9999px";
        document.body.appendChild(announcer);
    }
};


const populateFilters = (data) => {
    d3.select("#filters")
        .selectAll(".filter")
        .data(filters)
        .join("button")
        .attr("class", d => `filter filter-${d.id} ${d.isActive ? "active" : ""}`)
        .text(d => d.label)
        .on("click", (event, d) => {
            filters.forEach(filter => filter.isActive = (filter.id === d.id));
            d3.selectAll("#filters .filter")
                .classed("active", filter => filter.isActive);  // Add, remove, toggle css classes on selected elements based on a condition
        updateBarChart(d.id, data);
        });

};

const getDonutTooltip = () => {
    let tooltip = d3.select("body").select(".donut-tooltip");

    if (tooltip.empty()) {
        tooltip = d3.select("body")
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
            .style("opacity", 0);
    }

    return tooltip;
};

const animateDonutSlices = (slices, arcGenerator) => {  //pop up
    slices
        .attr("d", d3.arc().innerRadius(0).outerRadius(0))
        .transition()
        .duration(850)
        .ease(d3.easeCubicOut)
        .attrTween("d", function (d) {
            const interpolateInner = d3.interpolate(0, arcGenerator.innerRadius()());
            const interpolateOuter = d3.interpolate(0, arcGenerator.outerRadius()());
            return function (t) {
                return d3.arc()
                    .innerRadius(interpolateInner(t))
                    .outerRadius(interpolateOuter(t))(d);
            };
        });
};

const addDonutInteractions = (slices, arcGenerator) => {
    const tooltip = getDonutTooltip();
    const expandedArc = d3.arc()
        .innerRadius(arcGenerator.innerRadius()())
        .outerRadius(arcGenerator.outerRadius()() + 10);

    const updateTooltipContent = (d) => {
        const percentage = (d.endAngle - d.startAngle) / (2 * Math.PI);
        const valueText = Number.isFinite(d.data.value)
            ? `${d.data.value.toFixed(1)} kW/year`
            : "N/A";

        tooltip
            .style("opacity", 1)
            .html(
                `<strong>${d.data.screen_tech}</strong><br>` +
                `Energy: ${valueText}<br>` +
                `Share: ${d3.format(".1%")(percentage)}`
            );
    };

    const positionTooltipFromPointer = (event) => {
        tooltip
            .style("left", `${event.clientX + 14}px`)
            .style("top", `${event.clientY + 14}px`);
    };

    const positionTooltipFromElement = (element) => {
        const rect = element.getBoundingClientRect();
        tooltip
            .style("left", `${rect.left + rect.width / 2 + 12}px`)
            .style("top", `${rect.top - 10}px`);
    };

    const activateSlice = (element, d) => {
        updateTooltipContent(d);

        d3.select(element)
            .raise()
            .interrupt()
            .transition()
            .duration(180)
            .attr("d", expandedArc);
    };

    const deactivateSlice = (element) => {
        tooltip.style("opacity", 0);

        d3.select(element)
            .interrupt()
            .transition()
            .duration(180)
            .attr("d", arcGenerator);
    };

    slices
        .style("cursor", "pointer")
        .attr("aria-keyshortcuts", "Enter Space")
        .on("mouseenter", function (event, d) {
            activateSlice(this, d);
            positionTooltipFromPointer(event);
        })
        .on("mousemove", function (event) {
            positionTooltipFromPointer(event);
        })
        .on("mouseleave", function () {
            deactivateSlice(this);
        })
        .on("focus", function (event, d) {
            activateSlice(this, d);
            positionTooltipFromElement(this);
        })
        .on("blur", function () {
            deactivateSlice(this);
        })
        .on("keydown", function (event, d) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                activateSlice(this, d);
                positionTooltipFromElement(this);
            }
            if (event.key === "Escape") {
                deactivateSlice(this);
            }
        });
    const tooltipAnnouncer = document.getElementById("tooltip-announcer");
    if (tooltipAnnouncer) {
        slices.on("click", function (event, d) {
            const percentage = (d.endAngle - d.startAngle) / (2 * Math.PI);
            const valueText = Number.isFinite(d.data.value)
                ? `${d.data.value.toFixed(1)} kilowatt-hours per year`
                : "N/A";
            tooltipAnnouncer.textContent = `${d.data.screen_tech}: ${valueText}, ${d3.format(".1%")(percentage)} of total.`;
        });
    }
};
const ScatterPointInteractions = () => {
    // Reuse the shared tooltip if available, otherwise create one
    const tooltip = typeof getDonutTooltip === "function"
        ? getDonutTooltip()
        : d3.select("body").select(".donut-tooltip").empty()
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

    const positionTooltipFromPointer = (event) => {
        tooltip
            .style("left", `${event.clientX + 14}px`)
            .style("top", `${event.clientY + 14}px`);
    };

    const positionTooltipFromElement = (element) => {
        const rect = element.getBoundingClientRect();
        tooltip
            .style("left", `${rect.left + rect.width / 2 + 12}px`)
            .style("top", `${rect.top - 10}px`);
    };

    const showTooltip = (d) => {
        tooltip
            .style("opacity", 1)
            .html(
                `<strong>${d.screen_tech}</strong><br>` +
                `Screen Size: ${d.screen_size} inches<br>` +
                `Energy Consumption: ${d.energy_consumption} kW/year<br>` +
                `SRI: ${d.sri}`
            );
    };
    d3.selectAll("#scatter-plot circle")
        .on("mouseenter", function (event, d) {
            showTooltip(d);
            positionTooltipFromPointer(event);
        })
        .on("mousemove", function (event) {
            positionTooltipFromPointer(event);
        })
        .on("mouseleave", function () {
            tooltip.style("opacity", 0);
        })
        .on("focus", function (event, d) {
            showTooltip(d);
            positionTooltipFromElement(this);
        })
        .on("blur", function () {
            tooltip.style("opacity", 0);
        })
        .on("keydown", function (event, d) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                showTooltip(d);
                positionTooltipFromElement(this);
            }
            if (event.key === "Escape") {
                tooltip.style("opacity", 0);
            }
        });
}

