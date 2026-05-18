import { useState, useEffect, useCallback } from 'react';
import { getMoraDashboard } from 'services/dashboardService';

const hoy = new Date();

const primerDiaMes = new Date(
    hoy.getFullYear(),
    hoy.getMonth(),
    1
).toISOString().split('T')[0];

const fechaHoy = hoy.toISOString().split('T')[0];

export const useDashboardMora = () => {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    // Fechas por defecto
    const [fechaInicio, setFechaInicio] = useState(primerDiaMes);
    const [fechaFin, setFechaFin] = useState(fechaHoy);

    const fetchData = useCallback(async (
        fi = primerDiaMes,
        ff = fechaHoy
    ) => {

        setLoading(true);

        try {

            const json = await getMoraDashboard({
                fecha_inicio: fi,
                fecha_fin: ff,
            });

            setData(json.data || json);

        } catch (e) {

            console.error('Error dashboard mora:', e);

        } finally {

            setLoading(false);
        }

    }, []);

    // Carga inicial
    useEffect(() => {

        fetchData(primerDiaMes, fechaHoy);

    }, [fetchData]);

    const handleFiltrar = () => {

        fetchData(fechaInicio, fechaFin);

    };

    const handleLimpiar = () => {

        setFechaInicio(primerDiaMes);
        setFechaFin(fechaHoy);

        fetchData(primerDiaMes, fechaHoy);

    };

    return {
        loading,
        data,

        fechaInicio,
        setFechaInicio,

        fechaFin,
        setFechaFin,

        handleFiltrar,
        handleLimpiar,
    };
};