import { useState, useEffect, useCallback } from 'react';
import { getPagosDashboard } from 'services/dashboardService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useDashboardPagos = () => {
    const [loading,      setLoading]      = useState(true);
    const [data,         setData]         = useState(null);
    const [alert,        setAlert]        = useState(null);
    const [fechaInicio,  setFechaInicio]  = useState('');
    const [fechaFin,     setFechaFin]     = useState('');

    const fetch = useCallback(async (filters = {}) => {
        setLoading(true);
        setAlert(null);
        try {
            const res = await getPagosDashboard(filters);
            setData(res.data || res);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    }, []);

    // Carga inicial sin filtros
    useEffect(() => { fetch(); }, [fetch]);

    const handleFiltrar = () => {
        fetch({ fecha_inicio: fechaInicio, fecha_fin: fechaFin });
    };

    const handleLimpiar = () => {
        setFechaInicio('');
        setFechaFin('');
        fetch({});
    };

    return {
        loading, data, alert, setAlert,
        fechaInicio, setFechaInicio,
        fechaFin,    setFechaFin,
        handleFiltrar, handleLimpiar,
    };
};