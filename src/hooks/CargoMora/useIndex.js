import { useState, useCallback, useEffect } from 'react';
import { index } from 'services/cargoMoraService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [cargos, setCargos] = useState([]);
    const [alert, setAlert] = useState(null);

    const fetchCargos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await index();
            setCargos(response.data || response || []);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar moras'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCargos(); }, [fetchCargos]);

    return { loading, cargos, alert, setAlert, fetchCargos };
};