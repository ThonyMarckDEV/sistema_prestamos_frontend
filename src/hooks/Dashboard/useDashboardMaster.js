import { useState, useEffect, useCallback } from 'react';
import { getMasterDashboard } from 'services/dashboardService';

// Reporte master = cartera completa por defecto (sin rango de fechas).
// El usuario puede filtrar por fecha de desembolso si lo desea.
export const useDashboardMaster = () => {
    const [loading,     setLoading]     = useState(true);
    const [data,        setData]        = useState(null);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin,    setFechaFin]    = useState('');
    const [asesoresSeleccionados, setAsesoresSeleccionados] = useState([]);

    const fetchData = useCallback(async (fi = '', ff = '', asesorIds = [], page = 1) => {
        setLoading(true);
        try {
            const filters = { page };
            if (fi) filters.fecha_inicio = fi;
            if (ff) filters.fecha_fin    = ff;
            if (asesorIds.length > 0) filters.asesor_ids = asesorIds.join(',');
            const json = await getMasterDashboard(filters);
            setData(json.data || json);
        } catch (e) {
            console.error('Error dashboard master:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleFiltrar = () =>
        fetchData(fechaInicio, fechaFin, asesoresSeleccionados.map(a => a.id), 1);

    const handlePageChange = (page) =>
        fetchData(fechaInicio, fechaFin, asesoresSeleccionados.map(a => a.id), page);

    const handleLimpiar = () => {
        setFechaInicio('');
        setFechaFin('');
        setAsesoresSeleccionados([]);
        fetchData('', '', [], 1);
    };

    const handleAgregarAsesor = (asesor) => {
        if (!asesor) return;
        setAsesoresSeleccionados(prev =>
            prev.find(a => a.id === asesor.id) ? prev : [...prev, { id: asesor.id, nombre: asesor.nombre_completo ?? asesor.nombre ?? `Asesor #${asesor.id}` }]
        );
    };

    const handleQuitarAsesor = (id) =>
        setAsesoresSeleccionados(prev => prev.filter(a => a.id !== id));

    return {
        loading, data,
        fechaInicio, setFechaInicio,
        fechaFin,    setFechaFin,
        asesoresSeleccionados,
        handleAgregarAsesor, handleQuitarAsesor,
        handleFiltrar, handleLimpiar, handlePageChange,
    };
};