import { useState, useEffect, useCallback } from 'react';
import { getPrestamosDashboard } from 'services/dashboardService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useDashboardPrestamos = () => {
    const [loading,         setLoading]        = useState(true);
    const [data,            setData]           = useState(null);
    const [alert,           setAlert]          = useState(null);
    const [fechaInicio,     setFechaInicio]    = useState('');
    const [fechaFin,        setFechaFin]       = useState('');
    
    // Estados para paginación
    const [activosPage,     setActivosPage]    = useState(1);
    const [anterioresPage,  setAnterioresPage] = useState(1);

    const fetch = useCallback(async (filters = {}) => {
        setLoading(true);
        setAlert(null);
        try {
            // Mandamos los filtros de fechas + las páginas actuales
            const res = await getPrestamosDashboard({ 
                ...filters, 
                activos_page: activosPage, 
                anteriores_page: anterioresPage 
            });
            setData(res.data || res);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    }, [activosPage, anterioresPage]); // Importante: dependencia para refrescar

    // Si cambia una fecha o una página, traemos los datos de nuevo
    useEffect(() => { 
        fetch({ fecha_inicio: fechaInicio, fecha_fin: fechaFin }); 
    }, [fetch, fechaInicio, fechaFin]);

    const handleFiltrar = () => {
        setActivosPage(1); // Reset a pagina 1 al filtrar
        setAnterioresPage(1);
        fetch({ fecha_inicio: fechaInicio, fecha_fin: fechaFin });
    };

    const handleLimpiar = () => { 
        setFechaInicio(''); 
        setFechaFin(''); 
        setActivosPage(1);
        setAnterioresPage(1);
        // El useEffect de arriba hará el fetch automático
    };

    return {
        loading, data, alert, setAlert,
        fechaInicio, setFechaInicio,
        fechaFin,    setFechaFin,
        handleFiltrar, handleLimpiar,
        activosPage, setActivosPage,
        anterioresPage, setAnterioresPage
    };
};