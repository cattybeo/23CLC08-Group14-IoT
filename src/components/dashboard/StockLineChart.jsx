import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stockHistoryData } from "@/data/mockData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top",
      align: "end",
      labels: {
        usePointStyle: true,
        boxWidth: 8,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: "hsl(222, 47%, 11%)",
      titleFont: { size: 13 },
      bodyFont: { size: 12 },
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: { size: 11 },
        color: "hsl(220, 9%, 46%)",
      },
    },
    y: {
      grid: {
        color: "hsl(220, 13%, 91%)",
        drawBorder: false,
      },
      ticks: {
        font: { size: 11 },
        color: "hsl(220, 9%, 46%)",
      },
      min: 35,
      max: 90,
    },
  },
  elements: {
    line: {
      borderWidth: 2,
    },
    point: {
      radius: 4,
      hoverRadius: 6,
    },
  },
};

const StockLineChart = () => {
  return (
    <Card className="border-0 shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Real-time Sold</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        <div className="h-full">
          <Line data={stockHistoryData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StockLineChart;
