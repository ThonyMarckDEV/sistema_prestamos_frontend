import { useState, useCallback, useRef, useEffect } from 'react';
import { index, toggleStatus, destroy } from 'services/zonaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [zonas, setZonas] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters, setFilters] = useState({ search: '', activo: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const fetchZonas = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setZonas(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
                total: response.total
            });
        } catch (err) {
            setAlert(handleApiError(err));
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchZonas(1); }, [fetchZonas]);

    const handleAskStatus = (id) => { setSelectedId(id); setShowConfirm(true); };
    const handleConfirmStatus = async () => {
        setShowConfirm(false);
        setLoading(true);
        try {
            await toggleStatus(selectedId);
            setAlert({ type: 'success', message: 'Estado de la zona actualizado.' });
            fetchZonas(paginationInfo.currentPage);
        } catch (err) { setAlert(handleApiError(err)); } 
        finally { setLoading(false); }
    };

    const handleAskDelete = (id) => { setSelectedId(id); setShowDelete(true); };
    const handleConfirmDelete = async () => {
        setShowDelete(false);
        setLoading(true);
        try {
            await destroy(selectedId);
            setAlert({ type: 'success', message: 'Zona eliminada correctamente.' });
            fetchZonas(1);
        } catch (err) { setAlert(handleApiError(err)); } 
        finally { setLoading(false); }
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({ ...prev, [name]: val }));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchZonas(1); };
    const handleFilterClear = () => {
        const reset = { search: '', activo: '' };
        setFilters(reset); filtersRef.current = reset; fetchZonas(1);
    };

    return {
        loading, zonas, paginationInfo, filters, alert, setAlert,
        showConfirm, setShowConfirm, showDelete, setShowDelete,
        fetchZonas, handleAskStatus, handleConfirmStatus, handleAskDelete, handleConfirmDelete,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    };
};