import { useState, useCallback, useRef, useEffect } from 'react';
import { index, destroy } from 'services/sorteoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const EMPTY_FILTERS = { search: '', estado: '', tipo_prestamo: '' };

export const useIndex = () => {
    const [loading,        setLoading]        = useState(true);
    const [sorteos,        setSorteos]        = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters,        setFilters]        = useState(EMPTY_FILTERS);
    const filtersRef                          = useRef(filters);
    const [alert,          setAlert]          = useState(null);
    const [deleteId,       setDeleteId]       = useState(null);

    const fetchSorteos = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const res = await index(page, filtersRef.current);
            setSorteos(res.data || []);
            setPaginationInfo({ currentPage: res.current_page, totalPages: res.last_page, total: res.total });
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchSorteos(1); }, [fetchSorteos]);

    const handleConfirmDelete = async () => {
        const id = deleteId;
        setDeleteId(null);
        setLoading(true);
        try {
            await destroy(id);
            setAlert({ type: 'success', message: 'Sorteo eliminado.' });
            fetchSorteos(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err));
            setLoading(false);
        }
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({ ...prev, [name]: val }));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchSorteos(1); };
    const handleFilterClear  = () => { setFilters(EMPTY_FILTERS); filtersRef.current = EMPTY_FILTERS; fetchSorteos(1); };

    return {
        loading, sorteos, paginationInfo, filters, alert, setAlert,
        deleteId, setDeleteId, handleConfirmDelete, fetchSorteos,
        handleFilterChange, handleFilterSubmit, handleFilterClear,
    };
};
