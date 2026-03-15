const margin = { top: 40, right: 30, bottom: 50, left: 70 };
const width = 800;
const height = 400;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const barColor = "#606464";
const bodyBackgroundColor = "#fffaf0";
const defaultBinCount = 12;
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

const binGenerator = d3.bin()
    .value(d => d.energyConsumption);

const filters_screen = [
    { id: "all", label: "All", isActive: true },
    { id: "lcd", label: "LCD", isActive: false },
    { id: "led", label: "LED", isActive: false },
    { id: "oled", label: "OLED", isActive: false }
];

let filters_size = [
    { id: "all", label: "All Sizes", isActive: true },
    { id: "24", label: "24\"", isActive: false },
    { id: "32", label: "32\"", isActive: false },
    { id: "55", label: "55\"", isActive: false },
    { id: "65", label: "65\"", isActive: false },
    { id: "98", label: "98\"", isActive: false }
];