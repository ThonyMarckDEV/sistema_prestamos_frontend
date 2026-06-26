import { useState, useEffect, useCallback } from 'react';
import { getDiaActual, abrirDia, cerrarDia } from 'services/diaOperativoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useDiaOperativo = () => {
    const [diaActual, setDiaActual]   = useState(null);
    const [loading, setLoading]       = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [alert, setAlert]           = useState(null);

    const fetchDiaActual = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getDiaActual();
            const dia = res?.data?.id ? res.data : null;
            setDiaActual(dia);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar el día operativo'));
        } finally {
            setLoading(false);
        }
    }, [])

    useEffect(() => { fetchDiaActual(); }, [fetchDiaActual]);

    const handleAbrir = async () => {
        setActionLoading(true);
        setAlert(null);
        try {
            const res = await abrirDia();
            setDiaActual(res.data);
            setAlert({ type: 'success', message: res.message });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al abrir el día operativo'));
        } finally {
            setActionLoading(false);
        }
    };

    const handleCerrar = async () => {
        setActionLoading(true);
        setAlert(null);
        try {
            const res = await cerrarDia();
            setDiaActual(null);
            setAlert({ type: 'success', message: res.message });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cerrar el día operativo'));
        } finally {
            setActionLoading(false);
        }
    };

    return {
        diaActual,
        loading,
        actionLoading,
        alert,
        setAlert,
        fetchDiaActual,
        handleAbrir,
        handleCerrar,
    };
};