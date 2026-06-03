import { useState, useEffect, useCallback } from 'react';
import { getDesembolsoCapitalDashboard } from 'services/dashboardService';

export const useDashboardDesembolsoCapital = () => {
    const hoy = new Date();

    const [loading, setLoading] = useState(true);
    const [data,    setData]    = useState(null);
    const [asesoresSeleccionados, setAsesoresSeleccionados] = useState([]);
    const [mesVisible, setMesVisible] = useState({
        mes:  hoy.getMonth() + 1,
        anio: hoy.getFullYear(),
    });

    // Fetch solo por asesores — sin mes, trae toda la data de una
    const fetchData = useCallback(async (asesorIds = []) => {
        setLoading(true);
        try {
            const filters = {};
            if (asesorIds.length > 0) filters.asesor_ids = asesorIds.join(',');
            const json = await getDesembolsoCapitalDashboard(filters);
            setData(json.data || json);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleCambiarMes = useCallback((nuevoMes) => {
        setMesVisible(nuevoMes);
    }, []);

    const handleFiltrarAsesor = useCallback(() => {
        fetchData(asesoresSeleccionados.map(a => a.id));
    }, [asesoresSeleccionados, fetchData]);

    const handleLimpiar = useCallback(() => {
        setAsesoresSeleccionados([]);
        setMesVisible({ mes: hoy.getMonth() + 1, anio: hoy.getFullYear() });
        fetchData([]);
    }, [fetchData]); // eslint-disable-line react-hooks/exhaustive-deps

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
        mesVisible,
        asesoresSeleccionados,
        handleCambiarMes,
        handleAgregarAsesor, handleQuitarAsesor,
        handleFiltrarAsesor, handleLimpiar,
    };
};