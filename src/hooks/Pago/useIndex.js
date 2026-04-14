import { useState, useCallback, useEffect } from 'react';
import { index, status } from 'services/pagoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [pagos, setPagos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    const [filters, setFilters] = useState({ search: '', estado: '0' });
    const [alert, setAlert] = useState(null);

    const fetchPagos = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const res = await index(page, filters);
            setPagos(res.data.data || []);
            setPaginationInfo({
                currentPage: res.data.current_page,
                totalPages: res.data.last_page
            });
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => { fetchPagos(1); }, [fetchPagos]);

    const handleStatusChange = async (id, nuevoEstado, motivo = '') => {
        setLoading(true);
        try {
            await status(id, { estado: nuevoEstado, motivo });
            setAlert({ type: 'success', message: 'Estado del pago actualizado.' });
            fetchPagos(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return { 
        loading, pagos, paginationInfo, filters, setFilters, 
        alert, setAlert, fetchPagos, handleStatusChange 
    };
};