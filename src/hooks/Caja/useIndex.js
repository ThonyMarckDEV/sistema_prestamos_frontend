import { useState, useCallback, useRef, useEffect } from 'react';
import { index, toggleStatus, destroy } from 'services/cajaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [cajas, setCajas] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters, setFilters] = useState({ search: '', activo: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const fetchCajas = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setCajas(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
                total: response.total
            });
        } catch (err) {
            setAlert(handleApiError(err));
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchCajas(1); }, [fetchCajas]);

    const handleAskStatus = (id) => { setSelectedId(id); setShowConfirm(true); };
    const handleConfirmStatus = async () => {
        setShowConfirm(false);
        setLoading(true);
        try {
            await toggleStatus(selectedId);
            setAlert({ type: 'success', message: 'Estado de caja actualizado.' });
            fetchCajas(paginationInfo.currentPage);
        } catch (err) { setAlert(handleApiError(err)); } 
        finally { setLoading(false); }
    };

    const handleAskDelete = (id) => { setSelectedId(id); setShowDelete(true); };
    const handleConfirmDelete = async () => {
        setShowDelete(false);
        setLoading(true);
        try {
            await destroy(selectedId);
            setAlert({ type: 'success', message: 'Caja eliminada correctamente.' });
            fetchCajas(1);
        } catch (err) { setAlert(handleApiError(err)); } 
        finally { setLoading(false); }
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({ ...prev, [name]: val }));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchCajas(1); };
    const handleFilterClear = () => {
        const reset = { search: '', activo: '' };
        setFilters(reset); filtersRef.current = reset; fetchCajas(1);
    };

    return {
        loading, cajas, paginationInfo, filters, alert, setAlert,
        showConfirm, setShowConfirm, showDelete, setShowDelete,
        fetchCajas, handleAskStatus, handleConfirmStatus, handleAskDelete, handleConfirmDelete,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    };
};