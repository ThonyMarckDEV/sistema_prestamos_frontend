import { useState, useCallback, useEffect } from 'react';
import { index, status } from 'services/pagoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [pagos, setPagos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    const [filters, setFilters] = useState({ search: '', estado: '' });
    const [alert, setAlert] = useState(null);

    const fetchPagos = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const res = await index(page, filters);
            const responseBody = res;

            if (responseBody && responseBody.data) {
                setPagos([...responseBody.data]);
                setPaginationInfo({
                    currentPage: responseBody.current_page,
                    totalPages: responseBody.last_page,
                    total: responseBody.total
                });
            } else {
                setPagos([]);
            }
        } catch (err) {
            setAlert(handleApiError(err));
            setPagos([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => { 
        fetchPagos(1); 
    }, [fetchPagos]);

    const handleStatusChange = async (id, nuevoEstado, motivo = '') => {
        setLoading(true);
        try {
            await status(id, { estado: nuevoEstado, motivo });
            setAlert({ type: 'success', message: 'Estado del pago actualizado correctamente.' });
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