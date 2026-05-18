import { useState, useEffect, useCallback } from 'react';
import { getGruposAsesorDashboard } from 'services/dashboardService';

const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

const hoy = new Date();

const primerDiaMes = new Date(
    hoy.getFullYear(),
    hoy.getMonth(),
    1
);

const FECHA_INICIO_DEFAULT = formatDate(primerDiaMes);
const FECHA_FIN_DEFAULT    = formatDate(hoy);

export const useDashboardGruposAsesor = () => {

    const [loading, setLoading] = useState(true);

    const [data, setData] = useState(null);

    const [fechaInicio, setFechaInicio] = useState(
        FECHA_INICIO_DEFAULT
    );

    const [fechaFin, setFechaFin] = useState(
        FECHA_FIN_DEFAULT
    );

    const fetchData = useCallback(async (fi, ff) => {

        setLoading(true);

        try {

            const json = await getGruposAsesorDashboard({
                fecha_inicio: fi,
                fecha_fin: ff,
            });

            setData(json.data || json);

        } catch (e) {

            console.error(e);

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        fetchData(
            FECHA_INICIO_DEFAULT,
            FECHA_FIN_DEFAULT
        );

    }, [fetchData]);

    const handleFiltrar = () => {

        fetchData(
            fechaInicio,
            fechaFin
        );

    };

    const handleLimpiar = () => {

        setFechaInicio(FECHA_INICIO_DEFAULT);

        setFechaFin(FECHA_FIN_DEFAULT);

        fetchData(
            FECHA_INICIO_DEFAULT,
            FECHA_FIN_DEFAULT
        );

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