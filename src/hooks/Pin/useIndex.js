import { useState, useCallback, useRef, useEffect } from 'react';
import { index } from 'services/pinService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading]               = useState(true);
    const [pins, setPins]                     = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters, setFilters]               = useState({ usuario_id: '', generado_por_id: '', activo: '' });
    const [alert, setAlert]                   = useState(null);
    const filtersRef                          = useRef(filters);

    // Para resetear comboboxes al limpiar
    const [comboKey, setComboKey] = useState(Date.now());

    const fetchPins = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const res = await index(page, filtersRef.current);
            setPins(res.data || []);
            setPaginationInfo({ currentPage: res.current_page, totalPages: res.last_page, total: res.total });
        } catch (err) {
            setAlert(handleApiError(err));
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchPins(1); }, [fetchPins]);

    const handleFilterChange = (name, val) => setFilters(prev => ({ ...prev, [name]: val }));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchPins(1); };
    const handleFilterClear  = () => {
        const reset = { usuario_id: '', generado_por_id: '', activo: '' };
        setFilters(reset);
        filtersRef.current = reset;
        setComboKey(Date.now());
        fetchPins(1);
    };

    return {
        loading, pins, paginationInfo, filters, alert, setAlert, comboKey,
        fetchPins, handleFilterChange, handleFilterSubmit, handleFilterClear,
    };
};