import { useState, useCallback, useRef, useEffect } from 'react';
import { index, show, uploadAbono } from 'services/prestamoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [prestamos, setPrestamos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    
    const [filters, setFilters] = useState({ search: '', estado: '1' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    // Modales y Datos
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    // Estado para el Modal del Abono (Imagen)
    const [isAbonoModalOpen, setIsAbonoModalOpen] = useState(false);
    const [selectedAbonoUrl, setSelectedAbonoUrl] = useState(null);
    const [uploadingAbono, setUploadingAbono] = useState(false);

    const fetchPrestamos = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setPrestamos(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
                total: response.total
            });
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPrestamos(1); }, [fetchPrestamos]);

    const handleView = async (id) => {
        setIsViewOpen(true);
        setViewLoading(true);
        try {
            const response = await show(id);
            setViewData(response.data || response);
        } catch (err) {
            setAlert(handleApiError(err));
            setIsViewOpen(false);
        } finally {
            setViewLoading(false);
        }
    };

    // 🔥 Función para subir el abono
    const handleUploadAbono = async (id, file) => {
        setUploadingAbono(true);
        try {
            await uploadAbono(id, file);
            setAlert({ type: 'success', message: 'Comprobante de abono subido correctamente.' });
            fetchPrestamos(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setUploadingAbono(false);
        }
    };

    // 🔥 Función para abrir modal de imagen del abono
    const handleOpenAbono = (url) => {
        setSelectedAbonoUrl(url);
        setIsAbonoModalOpen(true);
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({ ...prev, [name]: val }));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchPrestamos(1); };
    const handleFilterClear = () => {
        const res = { search: '', estado: '1' };
        setFilters(res);
        filtersRef.current = res;
        fetchPrestamos(1);
    };

    return {
        loading, prestamos, paginationInfo, filters, alert, setAlert,
        handleFilterChange, handleFilterSubmit, handleFilterClear, fetchPrestamos,
        handleView, isViewOpen, setIsViewOpen, viewData, viewLoading,
        handleUploadAbono, uploadingAbono,
        handleOpenAbono, isAbonoModalOpen, setIsAbonoModalOpen, selectedAbonoUrl
    };
};