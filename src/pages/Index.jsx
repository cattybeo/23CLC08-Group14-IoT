import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "@/components/dashboard/Dashboard";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  useEffect(() => {
    const handleScroll = () => {
      const dashboardSection = document.getElementById('dashboard-section');
      const productsSection = document.getElementById('products-section');

      if (!dashboardSection || !productsSection) return;

      const dashboardRect = dashboardSection.getBoundingClientRect();
      const productsRect = productsSection.getBoundingClientRect();

      // Check which section is more visible in viewport
      const viewportMiddle = window.innerHeight / 2;

      // If products section top is above viewport middle, it's active
      if (productsRect.top < viewportMiddle && productsRect.bottom > 0) {
        setActiveNav('products');
      }
      // Otherwise dashboard is active
      else {
        setActiveNav('dashboard');
      }
    };

    // Initial check
    handleScroll();

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeItem={activeNav}
        onNavClick={setActiveNav}
      />
      <main className={`transition-all duration-300 ${sidebarCollapsed ? "pl-16" : "pl-52"}`}>
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Dashboard />
        </div>
      </main>
    </div>
  );
};

export default Index;
