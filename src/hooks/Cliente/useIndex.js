import { useState, useCallback, useRef, useEffect } from 'react';
import { index, show, toggleStatus } from 'services/clienteService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading]               = useState(true);
    const [clientes, setClientes]             = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters, setFilters]               = useState({ search: '', estado: '' });
    const filtersRef                          = useRef(filters);
    const [alert, setAlert]                   = useState(null);

    const [isViewOpen, setIsViewOpen]   = useState(false);
    const [viewData, setViewData]       = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);
    const [idToToggle, setIdToToggle]   = useState(null);

    const fetchClientes = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setClientes(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages:  response.last_page,
                total:       response.total
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar los clientes'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchClientes(1); }, [fetchClientes]);

    const handleView = async (id) => {
        setIsViewOpen(true);
        setViewLoading(true);
        setViewData(null);
        try {
            const response = await show(id);
            setViewData(response.data || response);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar detalles'));
            setIsViewOpen(false);
        } finally {
            setViewLoading(false);
        }
    };

    const handleAskToggle = (id) => { setIdToToggle(id); setShowConfirm(true); };

    const handleConfirmToggle = async () => {
        setShowConfirm(false);
        setLoading(true);
        try {
            await toggleStatus(idToToggle);
            setAlert({ type: 'success', message: 'Acceso del cliente actualizado correctamente.' });
            await fetchClientes(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cambiar el estado'));
        } finally {
            setLoading(false);
            setIdToToggle(null);
        }
    };

    const handleFilterChange  = (name, val) => setFilters(prev => ({ ...prev, [name]: val }));
    const handleFilterSubmit  = () => { filtersRef.current = filters; fetchClientes(1); };
    const handleFilterClear   = () => {
        const reset = { search: '', estado: '' };
        setFilters(reset); filtersRef.current = reset; fetchClientes(1);
    };

    return {
        loading, clientes, paginationInfo, filters, setFilters, alert, setAlert,
        isViewOpen, setIsViewOpen, viewData, viewLoading,
        showConfirm, setShowConfirm, setIdToToggle,
        fetchClientes, handleView, handleAskToggle, handleConfirmToggle,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    };
};