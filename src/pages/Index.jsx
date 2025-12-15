import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "@/components/dashboard/Dashboard";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

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
