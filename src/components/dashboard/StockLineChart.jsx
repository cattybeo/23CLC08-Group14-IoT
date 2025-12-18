import { useState, useEffect } from "react";
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
import { productService } from "@/services/product.service";

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
      display: false,
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
  const [latestProduct, setLatestProduct] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(options);

  useEffect(() => {
    console.log('[StockLineChart] Setting up sales subscription');

    const channel = productService.subscribeToSales(async (payload) => {
      console.log('[StockLineChart] Sale detected:', payload);
      const productId = payload.new.product_id;

      if (productId) {
        // Fetch product details
        const { data: product, error: productError } = await productService.fetchById(productId);
        if (productError) {
          console.error('[StockLineChart] Error fetching product:', productError);
          return;
        }
        console.log('[StockLineChart] Product fetched:', product);
        setLatestProduct(product);

        // Fetch chart data
        const { data: timeseriesData, error: chartError } = await productService.fetchProductChartData(productId);
        if (chartError) {
          console.error('[StockLineChart] Error fetching chart data:', chartError);
          return;
        }
        console.log('[StockLineChart] Chart data fetched:', timeseriesData);

        // Transform data for Chart.js
        if (timeseriesData && timeseriesData.length > 0) {
          const labels = timeseriesData.map(item => {
            const date = new Date(item.sale_day);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          });
          const values = timeseriesData.map(item => item.total_sold || 0);
          const maxValue = Math.max(...values);

          setChartData({
            labels,
            datasets: [
              {
                label: product.name,
                data: values,
                borderColor: "hsl(142, 71%, 45%)",
                backgroundColor: "hsla(142, 71%, 45%, 0.1)",
                fill: true,
                tension: 0.4,
              }
            ]
          });

          // Update chart options with dynamic y-axis
          setChartOptions({
            ...options,
            scales: {
              ...options.scales,
              y: {
                ...options.scales.y,
                min: 0,
                max: maxValue + Math.ceil(maxValue * 0.05), // Add 5% padding to max
              }
            }
          });
        }
      }
    });

    return () => {
      console.log('[StockLineChart] Cleaning up subscription');
      channel.unsubscribe();
    };
  }, []);

  return (
    <Card className="border-0 shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Real-time Sold
          {latestProduct && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              Product: {latestProduct.name}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        <div className="h-full min-h-[300px]">
          {chartData ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Waiting for sale data...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockLineChart;
