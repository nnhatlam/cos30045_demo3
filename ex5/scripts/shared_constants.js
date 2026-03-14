const margin = { top: 50, right: 50, bottom: 60, left: 80 };
const width = 500;
const height = 400;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;


const formatsInfo = [
    {id: "lcd", label: "LCD", color: "#FFC107"},
    {id: "led", label: "LED", color: "#1E88E5"},
    {id: "oled", label: "OLED", color: "#D81B60"},
];

const filters = [
    {id: "all", label: "All", isActive: true},
    {id: "lcd", label: "LCD", isActive: false},
    {id: "led", label: "LED", isActive: false},
    {id: "oled", label: "OLED", isActive: false},
]

