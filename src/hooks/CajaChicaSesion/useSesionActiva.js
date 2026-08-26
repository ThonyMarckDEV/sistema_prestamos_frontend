// hooks/CajaChicaSesion/useSesionActiva.js
import { useState, useEffect, useCallback } from 'react';
import { actual } from 'services/cajaChicaSesionService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useSesionActiva = () => {
    const [sesion, setSesion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    const fetchSesion = useCallback(async () => {
        setLoading(true);
        try {
            const response = await actual();
            setSesion(response.data || null);
        } catch (err) {
            setAlert(handleApiError(err, 'No se pudo consultar la sesión de caja chica.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchSesion(); }, [fetchSesion]);

    return { sesion, loading, alert, setAlert, refetch: fetchSesion };
};