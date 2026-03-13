const svg = d3.select('.responsive-svg-container')
    .append('svg')
        .attr("viewBox", "0 0 500 600")
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
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.no_models)])
        .range([0, 500]);

    const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand))
        .range([0, 600])
        .padding(0.1);
    const barAndLabel = svg
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

    barAndLabel
        .append("rect")
        .attr("x", 200)
        .attr("class", data => {
            console.log(data);
            return `bar bar-${data.no_models}`;
        })
        .attr("y", data => yScale(data.brand))
        .attr("width", data => xScale(data.no_models))
        .attr("height", yScale.bandwidth())
        .attr("fill", "steelblue")
        .attr("padding", "5px");
    
    barAndLabel
        .append("text")
        .text(data => data.brand)
        .attr("x", 100)
        .attr("y", 15)
        .attr("text-anchor", "end")
        .style("font-family", "sans-serif")
        .style("font-size", "10px");
    barAndLabel
        .append("text")
        .text(data => data.no_models)
        .attr("x", data => 500 +  xScale(data.no_models) + 5)
        .attr("y", 20)
        .style("font-family", "sans-serif")
        .style("font-size", "13px");
    
    // svg.selectAll("rect")
    // .data(data)
    // .join("rect");
    // .attr("x", 0)
    // .attr("class", data => {
    //     console.log(data);
    //     return `bar bar-${data.no_models}`;
    // })
    // .attr("y", data => yScale(data.brand))
    // .attr("width", data => xScale(data.no_models))
    // .attr("height", yScale.bandwidth())
    // .attr("fill", "steelblue")
    // .attr("padding", "5px")
}