d3.csv("data/screentech_energy.csv", d => ({
    screen_tech: d.Screen_Tech,
    energy_consumption: +d.Energy_Consumption_per_Year_kW,
})).then(data => {
    console.log("Screen Technology and Energy Consumption Data:", data);
    if (typeof window.createDonutChart === "function") {
        window.createDonutChart(data);
    }
});

d3.csv("data/screen_sri.csv", d => ({
    screen_tech: d.screen_tech,
    sri: +d.star2,
    screen_size: d.screen_size,
    energy_consumption: +d.energy_consumpt,
})).then(data => {
    console.log("Screen Technology, SRI, Screen Size, and Energy Consumption Data:", data);
    if (typeof defineScales === "function") {
        defineScales(data);
    }
    if (typeof window.createScatterPlot === "function") {
        window.createScatterPlot(data);
    }
});





