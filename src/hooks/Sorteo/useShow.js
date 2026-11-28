import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { show, participantes, generar, cerrar, boletos } from 'services/sorteoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const EMPTY_FILTERS = { search: '', tipo: '' };

export const useShow = () => {
    const { id } = useParams();

    const [sorteo,         setSorteo]         = useState(null);
    const [loadingSorteo,  setLoadingSorteo]  = useState(true);
    const [lista,          setLista]          = useState([]);
    const [resumen,        setResumen]        = useState(null);
    const [fuente,         setFuente]         = useState(null);
    const [loadingLista,   setLoadingLista]   = useState(true);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters,        setFilters]        = useState(EMPTY_FILTERS);
    const filtersRef                          = useRef(filters);
    const [alert,          setAlert]          = useState(null);

    // confirmaciones: 'generar' | 'cerrar' | null
    const [confirm,  setConfirm]  = useState(null);
    const [working,  setWorking]  = useState(false);

    // PDF
    const [pdf,        setPdf]        = useState(null); // { base64, title }
    const [pdfLoading, setPdfLoading] = useState(null); // 'all' | cliente_id | null

    const fetchSorteo = useCallback(async () => {
        try {
            const res = await show(id);
            setSorteo(res.data);
        } catch (err) {
            setAlert(handleApiError(err, 'No se pudo cargar el sorteo.'));
        } finally {
            setLoadingSorteo(false);
        }
    }, [id]);

    const fetchLista = useCallback(async (page = 1) => {
        setLoadingLista(true);
        try {
            const res = await participantes(id, page, filtersRef.current);
            const d   = res.data || {};
            setLista(d.participantes?.data || []);
            setResumen(d.resumen || null);
            setFuente(d.fuente || null);
            setPaginationInfo({
                currentPage: d.participantes?.current_page || 1,
                totalPages:  d.participantes?.last_page || 1,
                total:       d.participantes?.total || 0,
            });
        } catch (err) {
            setAlert(handleApiError(err, 'No se pudo cargar la lista de participantes.'));
        } finally {
            setLoadingLista(false);
        }
    }, [id]);

    useEffect(() => { fetchSorteo(); fetchLista(1); }, [fetchSorteo, fetchLista]);

    const handleConfirm = async () => {
        const accion = confirm;
        setWorking(true);
        try {
            const res = accion === 'generar' ? await generar(id) : await cerrar(id);
            setAlert({ type: 'success', message: res.message });
            await Promise.all([fetchSorteo(), fetchLista(1)]);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setWorking(false);
            setConfirm(null);
        }
    };

    const handleImprimir = async (clienteId = null) => {
        setPdfLoading(clienteId ?? 'all');
        try {
            const res = await boletos(id, clienteId ? [clienteId] : []);
            setPdf({ base64: res.data.pdf, title: res.data.title || 'Boletos' });
        } catch (err) {
            setAlert(handleApiError(err, 'No se pudieron generar los boletos.'));
        } finally {
            setPdfLoading(null);
        }
    };

    const handleFilterChange = (name, val) => setFilters(prev => ({ ...prev, [name]: val }));
    const handleFilterSubmit = () => { filtersRef.current = filters; fetchLista(1); };
    const handleFilterClear  = () => { setFilters(EMPTY_FILTERS); filtersRef.current = EMPTY_FILTERS; fetchLista(1); };

    return {
        id, sorteo, loadingSorteo,
        lista, resumen, fuente, loadingLista, paginationInfo, fetchLista,
        filters, handleFilterChange, handleFilterSubmit, handleFilterClear,
        alert, setAlert,
        confirm, setConfirm, working, handleConfirm,
        pdf, setPdf, pdfLoading, handleImprimir,
    };
};
