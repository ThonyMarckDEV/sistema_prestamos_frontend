import { useState, useCallback, useRef, useEffect } from 'react';
import { index, getPdfOperacion } from 'services/operacionService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [operaciones, setOperaciones] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    
    const [filters, setFilters] = useState({ search: '', tipo: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfTitle, setPdfTitle] = useState('');
    const [pdfBase64, setPdfBase64] = useState(null);
    const [pdfLoading, setPdfLoading] = useState(false);

    const fetchOperaciones = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setOperaciones(response.data.data || response.data || []);
            setPaginationInfo({
                currentPage: response.data.current_page || response.current_page,
                totalPages: response.data.last_page || response.last_page,
                total: response.data.total || response.total
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar el historial.'));
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchOperaciones(1); }, [fetchOperaciones]);

    const handleFilterChange = (name, val) => setFilters(prev => ({ ...prev, [name]: val }));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchOperaciones(1); };
    const handleFilterClear = () => {
        const res = { search: '', tipo: '' };
        setFilters(res); 
        filtersRef.current = res; 
        fetchOperaciones(1); 
    };


    const handleViewPdf = async (id) => {
        setPdfLoading(true);
        try {
            const response = await getPdfOperacion(id);
            setPdfBase64(response.data.pdf);
            setPdfTitle(response.data.title || 'Comprobante');
            setIsPdfModalOpen(true);
        } catch (err) {
            setAlert(handleApiError(err, 'No se pudo generar el comprobante.'));
        } finally {
            setPdfLoading(false);
        }
    };

    return { 
        loading, operaciones, paginationInfo, filters, alert, setAlert, 
        fetchOperaciones, handleFilterChange, handleFilterSubmit, handleFilterClear,
        handleViewPdf, isPdfModalOpen, setIsPdfModalOpen, pdfTitle, pdfBase64, pdfLoading
    };
};