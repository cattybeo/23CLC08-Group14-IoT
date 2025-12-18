import { Package, AlertTriangle, ShoppingCart } from "lucide-react";
import StatCard from "./StatCard";
import StockLineChart from "./StockLineChart";
import GaugeChart from "./GaugeChart";
import QuickStats from "./QuickStats";
import ProductsTable from "./ProductsTable";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

const Dashboard = () => {
  const { data: stats, isLoading } = useDashboardStats();

  const growthPercentage = stats?.growthPercentage || 0;
  const growthText = growthPercentage >= 0
    ? `+${growthPercentage.toFixed(2)}% vs yesterday`
    : `${growthPercentage.toFixed(2)}% vs yesterday`;
  const growthVariant = growthPercentage >= 0 ? "success" : "danger";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div id="dashboard-section">
        <h1 className="text-2xl font-bold tracking-tight">IoT Stock Controller</h1>
        <p className="text-muted-foreground">
          View all products, quantities and stock status in real time
        </p>
      </div>

      {/* Stats Cards - 3 columns on large screens */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <StatCard
          title="Total Products"
          value={stats?.totalProducts?.toLocaleString() || "0"}
          subtitle="All active SKUs in the database"
          icon={Package}
          variant="default"
        />
        <StatCard
          title="Low Stock Alert"
          value={stats?.lowStockAlert || 0}
          badgeText="Action required"
          icon={AlertTriangle}
          variant="danger"
        />
        <StatCard
          title="Sold Today"
          value={stats?.soldToday || 0}
          badgeText={growthText}
          icon={ShoppingCart}
          variant={growthVariant}
        />
      </div>

      {/* Charts Section - Line chart takes more space */}
      <div className="grid gap-4 grid-cols-1 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <StockLineChart />
        </div>
        <div className="xl:col-span-2 space-y-4">
          <GaugeChart />
          <QuickStats />
        </div>
      </div>

      {/* Products Table */}
      <ProductsTable />
    </div>
  );
};

export default Dashboard;
