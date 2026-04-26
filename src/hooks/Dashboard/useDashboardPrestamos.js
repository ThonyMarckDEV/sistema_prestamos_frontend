import { useState, useEffect, useCallback } from 'react';
import { getPrestamosDashboard } from 'services/dashboardService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useDashboardPrestamos = () => {
    const [loading,     setLoading]     = useState(true);
    const [data,        setData]        = useState(null);
    const [alert,       setAlert]       = useState(null);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin,    setFechaFin]    = useState('');

    const fetch = useCallback(async (filters = {}) => {
        setLoading(true);
        setAlert(null);
        try {
            const res = await getPrestamosDashboard(filters);
            setData(res.data || res);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const handleFiltrar = () => fetch({ fecha_inicio: fechaInicio, fecha_fin: fechaFin });
    const handleLimpiar = () => { setFechaInicio(''); setFechaFin(''); fetch({}); };

    return {
        loading, data, alert, setAlert,
        fechaInicio, setFechaInicio,
        fechaFin,    setFechaFin,
        handleFiltrar, handleLimpiar,
    };
};