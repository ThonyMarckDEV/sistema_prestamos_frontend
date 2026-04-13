import React, { useState } from "react";
import Sidebar from "../components/Shared/SideBar";
import { Outlet } from "react-router-dom";

const SidebarLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex overflow-hidden">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
      />

      <main
        className={`
          flex-1 min-w-0 w-0 overflow-x-hidden overflow-y-auto
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'md:ml-20' : 'md:ml-72'}
          ${isMobileSidebarOpen ? 'pointer-events-none' : ''}
        `}
        style={{ maxWidth: '100vw' }}
      >
        {/* mt-12 en móvil para el botón hamburguesa fijo */}
        <div className="mt-12 md:mt-0 min-w-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SidebarLayout;