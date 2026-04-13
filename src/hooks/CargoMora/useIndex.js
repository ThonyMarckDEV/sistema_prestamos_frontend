import { useState, useCallback, useRef, useEffect } from 'react';
import { index } from 'services/cargoMoraService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [cargos, setCargos] = useState([]);
    const [alert, setAlert] = useState(null);
    
    // 🔥 Agregamos estados para filtros
    const [filters, setFilters] = useState({ search: '' });
    const filtersRef = useRef(filters);

    const fetchCargos = useCallback(async () => {
        setLoading(true);
        try {
            // 🔥 Enviamos los filtros actuales al servicio
            const response = await index(filtersRef.current);
            setCargos(response.data || response || []);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar moras'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCargos(); }, [fetchCargos]);

    // 🔥 Funciones para manejar los filtros
    const handleFilterChange = (name, val) => setFilters(prev => ({ ...prev, [name]: val }));
    
    const handleFilterSubmit = () => { 
        filtersRef.current = filters; 
        fetchCargos(); 
    };

    const handleFilterClear = () => {
        const reset = { search: '' };
        setFilters(reset);
        filtersRef.current = reset;
        fetchCargos();
    };

    return { 
        loading, cargos, alert, setAlert, fetchCargos,
        filters, handleFilterChange, handleFilterSubmit, handleFilterClear 
    };
};