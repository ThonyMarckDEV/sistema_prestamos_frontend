import { useState, useEffect, useCallback } from 'react';
import { getSaldoCapitalDashboard } from 'services/dashboardService';

export const useDashboardSaldoCapital = () => {
    const [loading,     setLoading]     = useState(true);
    const [data,        setData]        = useState(null);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin,    setFechaFin]    = useState('');

    const fetchData = useCallback(async (fi = '', ff = '') => {
        setLoading(true);
        try {
            const json = await getSaldoCapitalDashboard({ fecha_inicio: fi, fecha_fin: ff });
            setData(json.data || json);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    return {
        loading, data, fechaInicio, setFechaInicio, fechaFin, setFechaFin,
        handleFiltrar: () => fetchData(fechaInicio, fechaFin),
        handleLimpiar: () => { setFechaInicio(''); setFechaFin(''); fetchData(); },
    };
};