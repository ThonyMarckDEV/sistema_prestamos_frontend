import { useState, useEffect, useCallback } from 'react';
import { getGruposAsesorDashboard } from 'services/dashboardService';

const formatDate = (d) => d.toISOString().split('T')[0];
const hoy          = new Date();
const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
const FECHA_INICIO_DEFAULT = formatDate(primerDiaMes);
const FECHA_FIN_DEFAULT    = formatDate(hoy);

export const useDashboardGruposAsesor = () => {
    const [loading,     setLoading]     = useState(true);
    const [data,        setData]        = useState(null);
    const [fechaInicio, setFechaInicio] = useState(FECHA_INICIO_DEFAULT);
    const [fechaFin,    setFechaFin]    = useState(FECHA_FIN_DEFAULT);
    const [asesoresSeleccionados, setAsesoresSeleccionados] = useState([]);

    const fetchData = useCallback(async (fi = FECHA_INICIO_DEFAULT, ff = FECHA_FIN_DEFAULT, asesorIds = []) => {
        setLoading(true);
        try {
            const filters = { fecha_inicio: fi, fecha_fin: ff };
            if (asesorIds.length > 0) filters.asesor_ids = asesorIds.join(',');
            const json = await getGruposAsesorDashboard(filters);
            setData(json.data || json);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(FECHA_INICIO_DEFAULT, FECHA_FIN_DEFAULT); }, [fetchData]);

    const handleFiltrar = () =>
        fetchData(fechaInicio, fechaFin, asesoresSeleccionados.map(a => a.id));

    const handleLimpiar = () => {
        setFechaInicio(FECHA_INICIO_DEFAULT);
        setFechaFin(FECHA_FIN_DEFAULT);
        setAsesoresSeleccionados([]);
        fetchData(FECHA_INICIO_DEFAULT, FECHA_FIN_DEFAULT, []);
    };

    const handleAgregarAsesor = (asesor) => {
        if (!asesor) return;
        setAsesoresSeleccionados(prev =>
            prev.find(a => a.id === asesor.id) ? prev : [
                ...prev,
                { id: asesor.id, nombre: asesor.nombre_completo ?? asesor.nombre ?? `Asesor #${asesor.id}` }
            ]
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
        handleFiltrar, handleLimpiar,
    };
};