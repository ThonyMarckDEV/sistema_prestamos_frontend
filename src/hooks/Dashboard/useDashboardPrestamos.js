import { useState, useEffect, useCallback } from 'react';
import { getPrestamosDashboard } from 'services/dashboardService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useDashboardPrestamos = () => {
    const [loading,        setLoading]        = useState(true);
    const [data,           setData]           = useState(null);
    const [alert,          setAlert]          = useState(null);
    const [fechaInicio,    setFechaInicio]    = useState('');
    const [fechaFin,       setFechaFin]       = useState('');
    const [activosPage,    setActivosPageSt]    = useState(1);
    const [anterioresPage, setAnterioresPageSt] = useState(1);
    const [proximasPage,   setProximasPageSt]   = useState(1);
    const [vencidasPage,   setVencidasPageSt]   = useState(1);

    const fetchData = useCallback(async (filters = {}, aPag = 1, antPag = 1, proxPag = 1, vencPag = 1) => {
        setLoading(true);
        setAlert(null);
        try {
            const res = await getPrestamosDashboard({
                ...filters,
                activos_page:    aPag,
                anteriores_page: antPag,
                proximas_page:   proxPag,
                vencidas_page:   vencPag,
            });
            setData(res.data || res);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const currentFilters = () => ({ fecha_inicio: fechaInicio, fecha_fin: fechaFin });

    const handleFiltrar = () => {
        setActivosPageSt(1); setAnterioresPageSt(1); setProximasPageSt(1); setVencidasPageSt(1);
        fetchData(currentFilters(), 1, 1, 1, 1);
    };

    const handleLimpiar = () => {
        setFechaInicio(''); setFechaFin('');
        setActivosPageSt(1); setAnterioresPageSt(1); setProximasPageSt(1); setVencidasPageSt(1);
        fetchData({}, 1, 1, 1, 1);
    };

    const setActivosPage    = p => { setActivosPageSt(p);    fetchData(currentFilters(), p,          anterioresPage, proximasPage,   vencidasPage); };
    const setAnterioresPage = p => { setAnterioresPageSt(p); fetchData(currentFilters(), activosPage, p,             proximasPage,   vencidasPage); };
    const setProximasPage   = p => { setProximasPageSt(p);   fetchData(currentFilters(), activosPage, anterioresPage, p,             vencidasPage); };
    const setVencidasPage   = p => { setVencidasPageSt(p);   fetchData(currentFilters(), activosPage, anterioresPage, proximasPage,   p); };

    return {
        loading, data, alert, setAlert,
        fechaInicio, setFechaInicio,
        fechaFin,    setFechaFin,
        setActivosPage, setAnterioresPage,
        setProximasPage, setVencidasPage,
        handleFiltrar, handleLimpiar,
    };
};