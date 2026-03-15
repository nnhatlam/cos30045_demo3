let xScale;
let yScale;
const defineScales = (data, xField, yField) => {
    xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[xField]) || 0])
        .nice()
        .range([0, innerWidth]);

    yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[yField]) || 0])
        .nice()
        .range([innerHeight, 0]);

    return { xScale, yScale };
};
const colorScale = d3.scaleOrdinal()
    .domain(formatsInfo.map(d => d.id))
    .range(formatsInfo.map(d => d.color));