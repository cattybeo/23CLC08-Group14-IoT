import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dashboardStats } from "@/data/mockData";

const QuickStats = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="border-0 shadow-xs">
        <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-muted-foreground">Total Units</p>
          <p className="mt-1 text-2xl font-bold">{dashboardStats.totalUnits.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-xs">
        <CardContent className="p-4 text-center">
          <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
          <p className="mt-1 text-2xl font-bold text-destructive">{dashboardStats.outOfStock}</p>
          <Badge className="mt-1 bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs">
            Need attention
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;
