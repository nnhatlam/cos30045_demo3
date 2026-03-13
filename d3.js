const svg = d3.select('.responsive-svg-container')
    .append('svg')
        .attr("viewBox", "0 0 500 1600")
        .style("border", "1px solid black")

svg
    .append('rect')

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

    svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", 0)
    .attr("class", data => {
        console.log(data);
        return `bar bar-${data.no_models}`;
    })
    .attr("y", (data, i) => i * 30)
    .attr("width", data => data.no_models * 10)
    .attr("height", 20)
    .attr("fill", "steelblue");
}