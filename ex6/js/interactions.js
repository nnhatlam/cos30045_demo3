const updateHistogramMeta = (data, screenId, sizeId) => {
    const activeScreen = filters_screen.find(filter => filter.id === screenId) || filters_screen[0];
    const activeSize = filters_size.find(filter => filter.id === sizeId) || filters_size[0];

    const filteredData = data.filter(item => {
        const screenMatch = screenId === "all" || item.screenTech.toLowerCase() === screenId;
        const sizeMatch = sizeId === "all" || String(item.screenSize) === String(sizeId);
        return screenMatch && sizeMatch;
    });

    const labelText = `Energy Consumption Distribution - Screen Technology: ${activeScreen.label}, Screen Size: ${activeSize.label}`;
    const descriptionText = `Showing ${filteredData.length} TV model(s) for ${activeScreen.label} screen technology and ${activeSize.label.toLowerCase()}. The bars show how many models fall into each labeled energy-consumption range.`;

    const label = d3.select("#histogram-label");
    if (label.empty()) {
        d3.select("#histogram")
            .append("div")
            .attr("id", "histogram-label")
            .attr("class", "chart-label")
            .text(labelText);
    } else {
        label.text(labelText);
    }

    const description = d3.select("#histogram-description");
    if (description.empty()) {
        d3.select("#histogram")
            .append("p")
            .attr("id", "histogram-description")
            .attr("class", "chart-description")
            .text(descriptionText);
    } else {
        description.text(descriptionText);
    }
};

const populateFilters = (data) => {
    d3.select("#filters_screen")
        .selectAll(".filter")
        .data(filters_screen)
        .join("button")
            .attr("class", d => `filter ${d.isActive ? "active" : ""}` )
            .text(d => d.label)
            .on("click", (event, d) => {
                filters_screen.forEach(filter => {
                    filter.isActive = d.id === filter.id;
                });

                d3.selectAll("#filters_screen .filter")
                    .classed("active", filter => filter.isActive);
                const activeSize = filters_size.find(filter => filter.isActive)?.id || "all";
                updateHistogram(d.id, data, activeSize);
                updateHistogramMeta(data, d.id, activeSize);
            });
}

const populateSizeFilters = (data) => {
    d3.select("#filters_size")
        .selectAll(".filter")
        .data(filters_size)
        .join("button")
            .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
            .text(d => d.label)
            .on("click", (event, d) => {
                filters_size.forEach(filter => {
                    filter.isActive = d.id === filter.id;
                });

                d3.selectAll("#filters_size .filter")
                    .classed("active", filter => filter.isActive);

                const activeScreen = filters_screen.find(filter => filter.isActive)?.id || "all";
                updateHistogram(activeScreen, data, d.id);
                updateHistogramMeta(data, activeScreen, d.id);
            });

    const activeScreen = filters_screen.find(filter => filter.isActive)?.id || "all";
    const activeSize = filters_size.find(filter => filter.isActive)?.id || "all";
    updateHistogramMeta(data, activeScreen, activeSize);
};
