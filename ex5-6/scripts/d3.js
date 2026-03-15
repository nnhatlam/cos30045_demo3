const svg = d3.select('.responsive-svg-container')
    .append('svg')
        .attr("viewBox", "0 0 600 600")
        .style("border", "0.5px solid grey")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", "auto");

svg
    .append('rect')

d3.csv("data/brand_model.csv").then(data => {console.log(data)});
d3.csv("data/brand_model.csv", d => {
    return {
        brand: d.Brand_Reg,
        no_models: +d.OCCURRENCE_COUNT // integer
    };
}).then(data => {
    const limitedData = data.slice(0, 20);  // limit to top 20 brands for better readability
    console.log(data);
    console.log(data.length);
    console.log(d3.max(data, d => d.no_models));
    console.log(d3.min(data, d => d.no_models));
    console.log(d3.extent(data, d => d.no_models));
    createBarChart(limitedData);
});
const createBarChart = (data) => {
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.no_models)])
        .range([0, 450]);
        
    const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand))
        .range([0, 600]) // height of the SVG
        .padding(0.1);
    const barAndLabel = svg
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

    barAndLabel
        .append("rect")
        .attr("x", 100)
        .attr("class", data => {
            console.log(data);
            return `bar bar-${data.no_models}`;
        })
        .attr("y", 0)
        .attr("width", data => xScale(data.no_models))
        .attr("height", yScale.bandwidth())
        .attr("fill", "steelblue")
        .attr("padding", "5px");
    
    barAndLabel
        .append("text")
        .text(data => data.brand)
        .attr("x", 90)
        .attr("y", 15)
        .attr("text-anchor", "end")
        .style("font-family", "sans-serif")
        .style("font-size", "clamp(4px, 1.2vw, 57px)"); // responsive font size using clamp
    barAndLabel
        .append("text")
        .text(data => data.no_models)
        .attr("x", data => 100 +  xScale(data.no_models) + 7) // position to the right of the bar
        .attr("y", 20)
        .style("font-family", "sans-serif")
        .style("font-size", "clamp(4px, 1.5vw, 57px)"); // responsive font size using clamp
}