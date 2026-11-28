import { useState, useCallback, useRef, useEffect } from 'react';
import { index, toggleStatus, destroy } from 'services/entidadBancariaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [entidades, setEntidades] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters, setFilters] = useState({ search: '', estado: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    // Modales de confirmación
    const [showConfirm, setShowConfirm] = useState(false);
    const [idToToggle, setIdToToggle] = useState(null);
    
    // 🔥 Nuevos estados para eliminación
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const fetchEntidades = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setEntidades(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
                total: response.total
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar las entidades bancarias'));
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchEntidades(1); }, [fetchEntidades]);

    // Handlers Status
    const handleAskToggle = (id) => { setIdToToggle(id); setShowConfirm(true); };
    const handleConfirmToggle = async () => {
        setShowConfirm(false);
        setLoading(true);
        try {
            await toggleStatus(idToToggle);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
            fetchEntidades(paginationInfo.currentPage);
        } catch (err) { setAlert(handleApiError(err)); } 
        finally { setLoading(false); setIdToToggle(null); }
    };

    // 🔥 Handlers Delete
    const handleAskDelete = (id) => { setIdToDelete(id); setShowDeleteConfirm(true); };
    const handleConfirmDelete = async () => {
        setShowDeleteConfirm(false);
        setLoading(true);
        try {
            await destroy(idToDelete);
            setAlert({ type: 'success', message: 'Entidad bancaria eliminada con éxito.' });
            fetchEntidades(paginationInfo.currentPage);
        } catch (err) { 
            setAlert(handleApiError(err)); 
        } finally { 
            setLoading(false); 
            setIdToDelete(null); 
        }
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({ ...prev, [name]: val }));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchEntidades(1); };
    const handleFilterClear = () => {
        const reset = { search: '', estado: '' };
        setFilters(reset); filtersRef.current = reset; fetchEntidades(1);
    };

    return {
        loading, entidades, paginationInfo, filters, alert, setAlert,
        showConfirm, setShowConfirm, showDeleteConfirm, setShowDeleteConfirm,
        fetchEntidades, handleAskToggle, handleConfirmToggle, handleAskDelete, handleConfirmDelete,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    };
};