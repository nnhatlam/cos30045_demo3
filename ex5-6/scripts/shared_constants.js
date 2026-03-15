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

const formatLines = [
    {id: "nsw", label: "New South Wales", color: "#1E88E5"},
    {id: "qsl", label: "Queensland", color: "#D81B60"},
    {id: "vic", label: "Victoria", color: "#FFC107"},
    {id: "sa", label: "South Australia", color: "#43A047"},
    {id: "tas", label: "Tasmania", color: "#6A1B9A"},
    {id: "snowy", label: "Snowy", color: "#00897B"},
    {id: "average_price", label: "Average Price", color: "#555555"}
];


const filters = [
    {id: "all", label: "All", isActive: true},
    {id: "lcd", label: "LCD", isActive: false},
    {id: "led", label: "LED", isActive: false},
    {id: "oled", label: "OLED", isActive: false},
    {id: "nsw", label: "New South Wales", isActive: false},
    {id: "qsl", label: "Queensland", isActive: false},
    {id: "vic", label: "Victoria", isActive: false},
    {id: "sa", label: "South Australia", isActive: false},
    {id: "tas", label: "Tasmania", isActive: false},
    {id: "snowy", label: "Snowy", isActive: false},
    {id: "average_price", label: "Average Price", isActive: false}
];

