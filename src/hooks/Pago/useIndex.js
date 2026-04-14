import { useState, useCallback, useEffect } from 'react';
import { index, status, pdf } from 'services/pagoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [pagos, setPagos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    const [filters, setFilters] = useState({ search: '', estado: '' });
    const [alert, setAlert] = useState(null);

    // Estados PDF
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfBase64, setPdfBase64] = useState(null);
    const [pdfTitle, setPdfTitle] = useState('');
    const [pdfLoading, setPdfLoading] = useState(false);

    const fetchPagos = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const res = await index(page, filters);
            if (res && res.data) {
                setPagos([...res.data]);
                setPaginationInfo({
                    currentPage: res.current_page,
                    totalPages: res.last_page,
                    total: res.total
                });
            }
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => { fetchPagos(1); }, [fetchPagos]);

    const handleViewPdf = async (id) => {
        setPdfLoading(true);
        try {
            const res = await pdf(id);
            setPdfBase64(res.data.pdf);  
            setPdfTitle(res.data.title); 
            setIsPdfModalOpen(true);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setPdfLoading(false);
        }
    };

    const handleStatusChange = async (id, nuevoEstado, motivo = '') => {
        setLoading(true);
        try {
            await status(id, { estado: nuevoEstado, motivo });
            setAlert({ type: 'success', message: 'Estado actualizado.' });
            fetchPagos(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return { 
        loading, pagos, paginationInfo, filters, setFilters, alert, setAlert, fetchPagos, handleStatusChange,
        handleViewPdf, isPdfModalOpen, setIsPdfModalOpen, pdfBase64, pdfTitle, pdfLoading
    };
};