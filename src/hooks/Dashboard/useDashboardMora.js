import { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

export const useDashboardMora = () => {
    const [loading,      setLoading]      = useState(true);
    const [data,         setData]         = useState(null);
    const [fechaInicio,  setFechaInicio]  = useState('');
    const [fechaFin,     setFechaFin]     = useState('');

    const fetchData = useCallback(async (fi = '', ff = '') => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (fi) params.append('fecha_inicio', fi);
            if (ff) params.append('fecha_fin',    ff);
            const qs = params.toString();
            const res = await fetchWithAuth(
                `${API_BASE_URL}/api/dashboard/mora${qs ? '?' + qs : ''}`,
                { method: 'GET' }
            );
            const json = await handleResponse(res);
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