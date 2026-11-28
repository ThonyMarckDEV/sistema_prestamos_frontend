import { useState, useCallback, useRef, useEffect } from 'react';
import { index } from 'services/trasladoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading]               = useState(true);
    const [traslados, setTraslados]           = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters, setFilters]               = useState({ search: '', asesor_origen_id: '', asesor_destino_id: '' });
    const [alert, setAlert]                   = useState(null);
    const filtersRef                          = useRef(filters);

    const fetchTraslados = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const res = await index(page, filtersRef.current);
            setTraslados(res.data || []);
            setPaginationInfo({ currentPage: res.current_page, totalPages: res.last_page, total: res.total });
        } catch (err) {
            setAlert(handleApiError(err));
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchTraslados(1); }, [fetchTraslados]);

    const handleFilterChange = (name, val) => setFilters(prev => ({ ...prev, [name]: val }));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchTraslados(1); };
    const handleFilterClear  = () => {
        const reset = { search: '', asesor_origen_id: '', asesor_destino_id: '' };
        setFilters(reset); filtersRef.current = reset; fetchTraslados(1);
    };

    return {
        loading, traslados, paginationInfo, filters, alert, setAlert,
        fetchTraslados, handleFilterChange, handleFilterSubmit, handleFilterClear,
    };
};