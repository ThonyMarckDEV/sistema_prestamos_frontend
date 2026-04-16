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
          flex flex-col flex-1 min-w-0 w-0 h-screen overflow-hidden relative
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'md:ml-20' : 'md:ml-72'}
          ${isMobileSidebarOpen ? 'pointer-events-none opacity-50 md:opacity-100 md:pointer-events-auto' : ''}
        `}
      >
        {/* LA CAMPANITA FLOTANTE  */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-[50]">
            <NotificacionBell />
        </div>

        {/* 3. Área de Contenido (Outlet) */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 pt-16 md:pt-20">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SidebarLayout;