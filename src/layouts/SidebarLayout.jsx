import React, { useState } from "react";
import Sidebar from "../components/Shared/SideBar";
import { Outlet } from "react-router-dom";
import NotificacionBell from "../components/Shared/Notificaciones/NotificacionBell";

const SidebarLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-50">
      {/* 1. Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
      />

      {/* 2. Contenedor Principal */}
      <main
        className={`
          flex flex-col flex-1 min-w-0 w-0 h-screen overflow-hidden
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'md:ml-20' : 'md:ml-72'}
          ${isMobileSidebarOpen ? 'pointer-events-none opacity-50 md:opacity-100 md:pointer-events-auto' : ''}
        `}
      >
        <header className="h-16 flex-shrink-0 flex items-center justify-end px-4 sm:px-6 z-40 sticky top-0 hidden md:flex">
            <NotificacionBell />
        </header>

        <header className="h-14 flex-shrink-0 flex items-center justify-between px-4 z-40 sticky top-0 md:hidden">
             <div className="w-8"></div> 
             <NotificacionBell />
        </header>

        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 relative">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SidebarLayout;