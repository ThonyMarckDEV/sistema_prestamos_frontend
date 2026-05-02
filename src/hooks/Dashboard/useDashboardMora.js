import { useState, useEffect, useCallback } from 'react';
import { getMoraDashboard } from 'services/dashboardService';

export const useDashboardMora = () => {
    const [loading,     setLoading]     = useState(true);
    const [data,        setData]        = useState(null);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin,    setFechaFin]    = useState('');

    const fetchData = useCallback(async (fi = '', ff = '') => {
        setLoading(true);
        try {
            const json = await getMoraDashboard({ fecha_inicio: fi, fecha_fin: ff });
            setData(json.data || json);
        } catch (e) {
            console.error('Error dashboard mora:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleFiltrar = () => fetchData(fechaInicio, fechaFin);
    const handleLimpiar = () => { setFechaInicio(''); setFechaFin(''); fetchData(); };

    return { loading, data, fechaInicio, setFechaInicio, fechaFin, setFechaFin, handleFiltrar, handleLimpiar };
};