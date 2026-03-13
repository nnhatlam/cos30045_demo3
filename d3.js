const svg = d3.select('.responsive-svg-container')
    .append('svg')
        .attr("width", "100%")
        .attr("height", 600)
        .attr("viewBox", "0 0 500 600")
        .style("border", "1px solid black")

d3.csv("data/brand_model.csv").then(data => {console.log(data)});
d3.csv("data/brand_model.csv", d => {
    return {
        brand: d.Brand_Reg,
        no_models: +d.OCCURRENCE_COUNT // integer
    };
}).then(data => {
    console.log(data);
    console.log(data.length);
    console.log(d3.max(data, d => d.no_models));
    console.log(d3.min(data, d => d.no_models));
    console.log(d3.extent(data, d => d.no_models));
    createBarChart(data);
});
const createBarChart = (data) => {
    const chartTopY = 0;
    const chartBaseY = 1310;
    const chartLeftX = 0;
    const chartRightX = 500;
    const maxModels = d3.max(data, d => d.no_models) || 1;

    const xScale = d3.scaleLinear()
        .domain([0, maxModels])
        .range([chartLeftX, chartRightX]);

    const yScale = d3.scaleBand()
        .domain(data.map((d) => d.brand))
        .range([chartTopY, chartBaseY])
        .padding(0.2);

    svg
        .selectAll('.bar')
        .data(data)
        .join("rect")
        .attr("x", chartLeftX)
        .attr("y", (d, i) => yScale(i))
        .attr("width", d => xScale(d.no_models) - chartLeftX)
        .attr("height", yScale.bandwidth())
        .attr("fill", "#1c71df")
        .attr("class", data =>{
            console.log(data);
            return `bar bar-${data.no_models}`;
        })
}