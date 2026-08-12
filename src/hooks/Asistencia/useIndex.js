import { useState, useCallback, useRef, useEffect } from 'react';
import { index } from 'services/asistenciaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [asistencias, setAsistencias] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters, setFilters] = useState({ search: '', fecha_desde: '', fecha_hasta: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    const fetchAsistencias = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setAsistencias(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
                total: response.total
            });
        } catch (err) {
            setAlert(handleApiError(err));
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchAsistencias(1); }, [fetchAsistencias]);

    const handleFilterChange = (name, val) => setFilters(prev => ({ ...prev, [name]: val }));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchAsistencias(1); };
    const handleFilterClear = () => {
        const reset = { search: '', fecha_desde: '', fecha_hasta: '' };
        setFilters(reset); filtersRef.current = reset; fetchAsistencias(1);
    };

    return {
        loading, asistencias, paginationInfo, filters, alert, setAlert,
        fetchAsistencias, handleFilterChange, handleFilterSubmit, handleFilterClear
    };
};