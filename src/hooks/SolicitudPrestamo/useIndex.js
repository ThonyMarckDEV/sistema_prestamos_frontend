import { useState, useCallback, useRef, useEffect } from 'react';
import { index, changeStatus, show } from 'services/solicitudPrestamoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [solicitudes, setSolicitudes] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters, setFilters] = useState({ search: '', estado: '1' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);

    const fetchSolicitudes = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setSolicitudes(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
                total: response.total
            });
        } catch (err) { setAlert(handleApiError(err)); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchSolicitudes(1); }, [fetchSolicitudes]);

    const handleView = async (id) => {
        setIsViewOpen(true);
        setViewLoading(true);
        try {
            const response = await show(id);
            setViewData(response.data || response);
        } catch (err) { setAlert(handleApiError(err)); setIsViewOpen(false); }
        finally { setViewLoading(false); }
    };

    const openApproveModal = (solicitud) => {
        setSelectedSolicitud(solicitud);
        setIsApproveOpen(true);
    };

    // 🔥 Actualizado el valor por defecto a CUENTA CORRIENTE por si acaso
    const handleUpdateStatus = async (id, nuevoEstado, abonadoPor = 'CUENTA CORRIENTE') => {
        setLoading(true);
        try {
            await changeStatus(id, nuevoEstado, abonadoPor);
            setAlert({ type: 'success', message: 'Solicitud procesada correctamente.' });
            setIsApproveOpen(false);
            fetchSolicitudes(paginationInfo.currentPage);
        } catch (err) { setAlert(handleApiError(err)); }
        finally { setLoading(false); }
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({ ...prev, [name]: val }));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchSolicitudes(1); };
    const handleFilterClear = () => {
        const res = { search: '', estado: '1' };
        setFilters(res); filtersRef.current = res; fetchSolicitudes(1);
    };

    return { 
        loading, solicitudes, paginationInfo, filters, alert, setAlert, 
        handleUpdateStatus, handleFilterChange, handleFilterSubmit, handleFilterClear, 
        fetchSolicitudes, isViewOpen, setIsViewOpen, viewData, viewLoading, handleView,
        isApproveOpen, setIsApproveOpen, selectedSolicitud, openApproveModal
    };
};