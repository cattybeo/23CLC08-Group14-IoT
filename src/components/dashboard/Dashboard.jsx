import { Package, AlertTriangle, ShoppingCart } from "lucide-react";
import StatCard from "./StatCard";
import StockLineChart from "./StockLineChart";
import GaugeChart from "./GaugeChart";
import QuickStats from "./QuickStats";
import ProductsTable from "./ProductsTable";
import { dashboardStats } from "@/data/mockData";

const Dashboard = () => {
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
          value={dashboardStats.totalProducts.toLocaleString()}
          subtitle="All active SKUs in the database"
          icon={Package}
          variant="default"
        />
        <StatCard
          title="Low Stock Alert"
          value={dashboardStats.lowStockAlert}
          badgeText="Action required"
          icon={AlertTriangle}
          variant="danger"
        />
        <StatCard
          title="Sold Today"
          value={dashboardStats.soldToday}
          badgeText="+12% vs yesterday"
          icon={ShoppingCart}
          variant="success"
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
