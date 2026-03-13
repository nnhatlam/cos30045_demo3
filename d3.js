const width = 1200;
const height = 600;
const margin = { top: 30, right: 30, bottom: 120, left: 80 };

const svg = d3
    .select(".responsive-svg-container")
    .append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("border", "1px solid #ddd");

const chart = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

function createBarChart(data) {
    // Keep it simple: show top 15 brands by model count.
    const topData = data
        .filter((d) => Number.isFinite(d.no_models))
        .sort((a, b) => b.no_models - a.no_models)
        .slice(0, 15);

    const x = d3
        .scaleBand()
        .domain(topData.map((d) => d.brand))
        .range([0, innerWidth])
        .padding(0.2);

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(topData, (d) => d.no_models)])
        .nice()
        .range([innerHeight, 0]);

    chart
        .selectAll("rect")
        .data(topData)
        .join("rect")
        .attr("x", (d) => x(d.brand))
        .attr("y", (d) => y(d.no_models))
        .attr("width", x.bandwidth())
        .attr("height", (d) => innerHeight - y(d.no_models))
        .attr("fill", "#1c71df");

    chart
        .append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-35)")
        .style("text-anchor", "end");

    chart.append("g").call(d3.axisLeft(y));

    chart
        .selectAll(".value-label")
        .data(topData)
        .join("text")
        .attr("class", "value-label")
        .attr("x", (d) => x(d.brand) + x.bandwidth() / 2)
        .attr("y", (d) => y(d.no_models) - 6)
        .attr("text-anchor", "middle")
        .attr("font-size", 11)
        .text((d) => d.no_models);
}

d3.csv("data/brand_model.csv", (d) => ({
    brand: d.Brand_Reg,
    no_models: +d.OCCURRENCE_COUNT
})).then(createBarChart)
  .catch((error) => console.error("Failed to load CSV:", error));