import { useState, useEffect, useCallback } from 'react';
import { index } from 'services/parametroService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading,    setLoading]    = useState(true);
    const [parametros, setParametros] = useState([]);
    const [alert,      setAlert]      = useState(null);

    const fetchParametros = useCallback(async () => {
        setLoading(true);
        try {
            const res = await index();
            setParametros(res.data || res || []);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchParametros(); }, [fetchParametros]);

    return { loading, parametros, alert, setAlert, fetchParametros };
};