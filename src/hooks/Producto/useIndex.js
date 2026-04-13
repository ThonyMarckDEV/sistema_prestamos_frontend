import { useState, useCallback, useRef, useEffect } from 'react';
import { index, toggleStatus, destroy } from 'services/productoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [productos, setProductos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    
    const [filters, setFilters] = useState({ search: '', estado: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    const fetchProductos = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setProductos(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
                total: response.total
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar productos'));
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchProductos(1); }, [fetchProductos]);

    // 🔥 Handlers para el filtrado de la tabla
    const handleFilterChange = (name, val) => setFilters(prev => ({ ...prev, [name]: val }));
    
    const handleFilterSubmit = () => { 
        filtersRef.current = filters; 
        fetchProductos(1); 
    };

    const handleFilterClear = () => {
        const res = { search: '', estado: '' };
        setFilters(res); 
        filtersRef.current = res; 
        fetchProductos(1); 
    };

    const handleToggleStatus = async (id) => {
        try {
            await toggleStatus(id);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
            fetchProductos(paginationInfo.currentPage);
        } catch (err) { setAlert(handleApiError(err)); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar este producto? Los préstamos asociados podrían verse afectados.')) return;
        try {
            await destroy(id);
            setAlert({ type: 'success', message: 'Producto eliminado con éxito.' });
            fetchProductos(paginationInfo.currentPage);
        } catch (err) { setAlert(handleApiError(err)); }
    };

    return { 
        loading, productos, paginationInfo, filters, alert, setAlert, 
        fetchProductos, handleToggleStatus, handleDelete, 
        handleFilterChange, handleFilterSubmit, handleFilterClear 
    };
};