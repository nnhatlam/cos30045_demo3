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
    screen_size: +d.screensize,
    energy_consumption: +d.energy_consumpt,
})).then(data => {
    data.sort((a, b) => a.screen_size - b.screen_size);
    console.log("Screen Technology, SRI, Screen Size, and Energy Consumption Data:", data);
    if (typeof defineScales === "function") {
        defineScales(data, "screen_size", "energy_consumption");
    }
    if (typeof window.createScatterPlot === "function") {
        window.createScatterPlot(data);
    }
});

d3.csv("data/TV_prices.csv", d => ({
    qsl : +d.Queensland ,
    nsw : +d["New South Wales"],
    vic : +d.Victoria,
    sa : +d["South Australia"],
    tas : +d.Tasmania,
    snowy : +d.Snowy,
    average_price : +d["Average Price"],
    year : +d.Year
})).then(data => {
    console.log("TV Prices Data:", data);
    if (typeof window.createLineChart === "function") {
        window.createLineChart(data);
    }
}); 

d3.csv("data/55inch_energy_consumption.csv", d => ({
    screen_tech: d.Screen_Tech,
    energy_consumption: +d.Energy_Consumption_per_Year_kW
})).then(data => {
    console.log("55 inch TV Energy Consumption Data:", data);
    if (typeof window.createBarChart === "function") {
        window.createBarChart(data);
    }
});





