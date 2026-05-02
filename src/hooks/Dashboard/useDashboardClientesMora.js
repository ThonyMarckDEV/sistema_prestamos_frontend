import { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

export const useDashboardClientesMora = () => {
    const [loading, setLoading] = useState(true);
    const [data,    setData]    = useState(null);
    const [page,    setPage]    = useState(1);

    const fetchData = useCallback(async (p = 1) => {
        setLoading(true);
        try {
            const res = await fetchWithAuth(
                `${API_BASE_URL}/api/dashboard/clientes-mora?page=${p}&per_page=10`,
                { method: 'GET' }
            );
            const json = await handleResponse(res);
            setData(json.data || json);
        } catch (e) {
            console.error('Error dashboard clientes mora:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(page); }, [fetchData, page]);

    const handlePageChange = (p) => setPage(p);

    return { loading, data, page, handlePageChange };
};