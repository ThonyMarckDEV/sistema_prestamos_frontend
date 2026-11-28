import { useState, useCallback, useRef, useEffect } from 'react';
import { index } from 'services/auditoriaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading]               = useState(true);
    const [registros, setRegistros]           = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters, setFilters]               = useState({
        search:      '',
        fecha_desde: '',
        fecha_hasta: '',
    });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailData, setDetailData]     = useState(null);

    const fetchRegistros = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setRegistros(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages:  response.last_page,
                total:       response.total,
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar la bitácora'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchRegistros(1); }, [fetchRegistros]);

    const handleVerDetalle = (row) => {
        setDetailData(row);
        setIsDetailOpen(true);
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({ ...prev, [name]: val }));

    const handleFilterSubmit = () => { filtersRef.current = filters; fetchRegistros(1); };

    const handleFilterClear = () => {
        const reset = { search: '', fecha_desde: '', fecha_hasta: '' };
        setFilters(reset);
        filtersRef.current = reset;
        fetchRegistros(1);
    };

    return {
        loading, registros, paginationInfo, filters, alert, setAlert,
        isDetailOpen, setIsDetailOpen, detailData,
        fetchRegistros, handleVerDetalle,
        handleFilterChange, handleFilterSubmit, handleFilterClear,
    };
};