import { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

export const useDashboardAsesores = () => {
    const [loading, setLoading] = useState(true);
    const [data,    setData]    = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchWithAuth(`${API_BASE_URL}/api/dashboard/asesores`, { method: 'GET' });
            const json = await handleResponse(res);
            setData(json.data || json);
        } catch (e) {
            console.error('Error dashboard asesores:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    return { loading, data, refetch: fetchData };
};