import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardStats } from "@/data/mockData";

ChartJS.register(ArcElement, Tooltip);

const GaugeChart = () => {
  const percentage = dashboardStats.stockUtilization;

  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ["hsl(142, 76%, 36%)", "hsl(220, 14%, 92%)"],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
        cutout: "75%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <Card className="border-0 shadow-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Stock Safety</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[180px]">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
            <span className="text-3xl font-bold text-success">{percentage}%</span>
            <span className="text-sm text-muted-foreground">Stock utilization</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GaugeChart;
