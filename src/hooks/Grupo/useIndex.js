import { useState, useCallback, useRef, useEffect } from 'react';
import { index, destroy } from 'services/grupoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [grupos, setGrupos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    
    const [filters, setFilters] = useState({ search: '', zona_id: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const fetchGrupos = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setGrupos(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
                total: response.total
            });
        } catch (err) {
            setAlert(handleApiError(err));
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchGrupos(1); }, [fetchGrupos]);

    const handleAskDelete = (id) => { setSelectedId(id); setShowDelete(true); };
    const handleConfirmDelete = async () => {
        setShowDelete(false); setLoading(true);
        try {
            await destroy(selectedId);
            setAlert({ type: 'success', message: 'Grupo eliminado correctamente.' });
            fetchGrupos(1);
        } catch (err) { setAlert(handleApiError(err)); } 
        finally { setLoading(false); }
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({ ...prev, [name]: val }));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchGrupos(1); };
    const handleFilterClear = () => {
        const reset = { search: '', zona_id: '' };
        setFilters(reset); filtersRef.current = reset; fetchGrupos(1);
    };

    return {
        loading, grupos, paginationInfo, filters, alert, setAlert,
        showConfirm, setShowConfirm, showDelete, setShowDelete,
        fetchGrupos , handleAskDelete, handleConfirmDelete,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    };
};