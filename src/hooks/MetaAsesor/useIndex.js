import { useState, useEffect, useCallback, useRef } from 'react';
import { index, destroy } from 'services/metaAsesorService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const MESES = [
    { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' }, { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setiembre' }, { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' },
];

const anioActual = new Date().getFullYear();
export const ANIOS = Array.from({ length: 5 }, (_, i) => anioActual - 2 + i);

export const useIndex = () => {
    const [loading, setLoading]       = useState(true);
    const [metas, setMetas]           = useState([]);
    const [alert, setAlert]           = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [filters, setFilters]       = useState({ mes: '', anio: anioActual, asesor_id: '' });
    const filtersRef                  = useRef(filters);

    const fetchMetas = useCallback(async (f = filtersRef.current) => {
        setLoading(true);
        try {
            const res = await index(f);
            setMetas(res.data || res);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchMetas(); }, [fetchMetas]);

    const handleFilterChange = (name, val) =>
        setFilters(prev => ({ ...prev, [name]: val }));

    const handleFilterSubmit = () => {
        filtersRef.current = filters;
        fetchMetas(filters);
    };

    const handleFilterClear = () => {
        const reset = { mes: '', anio: anioActual, asesor_id: '' };
        setFilters(reset);
        filtersRef.current = reset;
        fetchMetas(reset);
    };

    const handleAskDelete    = (id) => { setSelectedId(id); setShowDelete(true); };
    const handleConfirmDelete = async () => {
        setShowDelete(false);
        try {
            await destroy(selectedId);
            setAlert({ type: 'success', message: 'Meta eliminada correctamente.' });
            fetchMetas();
        } catch (err) {
            setAlert(handleApiError(err));
        }
    };

    return {
        loading, metas, alert, setAlert,
        filters, showDelete, setShowDelete,
        MESES, ANIOS,
        fetchMetas,
        handleFilterChange, handleFilterSubmit, handleFilterClear,
        handleAskDelete, handleConfirmDelete,
    };
};