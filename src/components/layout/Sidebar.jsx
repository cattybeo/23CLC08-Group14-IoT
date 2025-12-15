import { LayoutDashboard, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "dashboard", label: "Dashboard", targetId: "dashboard-section" },
  { id: "products", label: "Products", targetId: "products-section" },
];

const Sidebar = ({ collapsed, onToggle, activeItem, onNavClick }) => {
  const handleNavClick = (item) => {
    onNavClick(item.id);
    const element = document.getElementById(item.targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 z-50",
        collapsed ? "w-16" : "w-52"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <Package className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">SmartStock</span>
            </div>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary mx-auto">
              <Package className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-card border border-border shadow-xs hover:bg-muted transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3 text-foreground" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-foreground" />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 mt-4">
          {navItems.map((item) => {
            const Icon = item.id === "dashboard" ? LayoutDashboard : Package;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
