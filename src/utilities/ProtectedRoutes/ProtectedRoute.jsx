import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const ProtectedRoute = ({ element, requiredPermission }) => {
    const { isAuthenticated, can, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white flex-col gap-3">
                <ArrowPathIcon className="w-8 h-8 animate-spin text-brand-red" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Verificando accesos...
                </span>
            </div>
        );
    }

    // 2. Si no está logueado, lo mandamos al Login
    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // 3. Si no tiene permisos, lo mandamos al 401
    if (requiredPermission && !can(requiredPermission)) {
        return <Navigate to="/401" replace />;
    }

    // 4. Todo ok, renderiza la vista
    return element ? element : <Outlet />;
};

export default ProtectedRoute;