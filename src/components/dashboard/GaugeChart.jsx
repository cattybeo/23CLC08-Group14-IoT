import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { productService } from "@/services/product.service";

ChartJS.register(ArcElement, Tooltip);

const GaugeChart = () => {
  const [latestProduct, setLatestProduct] = useState(null);

  useEffect(() => {
    // Subscribe to sales_logs INSERT events
    const channel = productService.subscribeToSales(async (payload) => {
      console.log('Sale event received:', payload);

      const productId = payload.new?.product_id;
      if (!productId) return;

      // Fetch product details
      const { data, error } = await productService.fetchById(productId);

      if (error) {
        console.error('Error fetching product:', error);
        return;
      }

      console.log('Latest sold product:', data);
      setLatestProduct(data);
    });

    // Cleanup subscription on unmount
    return () => {
      channel?.unsubscribe();
    };
  }, []);

  // Calculate stock safety percentage
  const percentage = latestProduct
    ? ((latestProduct.current_stock / latestProduct.init_stock) * 100).toFixed(2)
    : 0;

  const productName = latestProduct?.name || "Waiting for sale...";

  // Determine color based on percentage
  const getGaugeColor = (percent) => {
    if (percent >= 50) return "hsl(142, 76%, 36%)"; // Green - ổn
    if (percent >= 20) return "hsl(48, 96%, 53%)"; // Yellow - mid
    return "hsl(0, 84%, 60%)"; // Red - thấp
  };

  const getTextColor = (percent) => {
    if (percent >= 50) return "text-success";
    if (percent >= 20) return "text-warning";
    return "text-destructive";
  };

  const gaugeColor = getGaugeColor(percentage);
  const textColor = getTextColor(percentage);

  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [gaugeColor, "hsl(220, 14%, 92%)"],
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
            <span className={`text-3xl font-bold ${textColor}`}>{percentage}%</span>
            <span className="text-sm text-muted-foreground">{productName}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GaugeChart;
