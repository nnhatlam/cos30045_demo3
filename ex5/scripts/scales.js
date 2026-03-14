let xScale;
let yScale;

const defineScales = (data) => {
    xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.energy_consumption) || 0])
        .nice()
        .range([0, innerWidth]);

    yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.sri) || 0])
        .nice()
        .range([innerHeight, 0]);

    return { xScale, yScale };
};
const colorScale = d3.scaleOrdinal()
    .domain(formatsInfo.map(d => d.id))
    .range(formatsInfo.map(d => d.color));