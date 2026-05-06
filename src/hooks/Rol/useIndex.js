import { useState, useEffect, useCallback, useRef } from 'react';
import { index, show, updatePermisos } from 'services/rolService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, total: 0 });
    const [filters, setFilters] = useState({ search: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [allPermisos, setAllPermisos] = useState([]);
    const [checkedPermisos, setCheckedPermisos] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [moduleFilter, setModuleFilter] = useState('');

    const fetchRoles = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setRoles(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
                total: response.total,
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar roles'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchRoles(1); }, [fetchRoles]);

    const handleManage = async (id) => {
        setIsEditing(true);
        setEditLoading(true);
        setModuleFilter('');
        try {
            const res = await show(id);
            setSelectedRole(res.data.rol);
            setAllPermisos(res.data.todos_los_permisos);
            setCheckedPermisos(res.data.rol.permisos.map(p => p.id));
        } catch (err) {
            setAlert(handleApiError(err, 'Error al obtener permisos'));
            setIsEditing(false);
        } finally {
            setEditLoading(false);
        }
    };

    // Toggle individual — una sola operación de estado
    const togglePermission = (permisoId) => {
        setCheckedPermisos(prev =>
            prev.includes(permisoId)
                ? prev.filter(id => id !== permisoId)
                : [...prev, permisoId]
        );
    };

    // Toggle TODOS — una sola operación de estado
    const toggleTodos = () => {
        const todosIds = allPermisos.map(p => p.id);
        setCheckedPermisos(prev => {
            const todosActivos = todosIds.every(id => prev.includes(id));
            return todosActivos ? [] : [...todosIds];
        });
    };

    // Toggle módulo completo — una sola operación de estado
    const toggleModulo = (permisos) => {
        const ids = permisos.map(p => p.id);
        setCheckedPermisos(prev => {
            const todosActivos = ids.every(id => prev.includes(id));
            if (todosActivos) {
                // Quitar solo los de este módulo
                return prev.filter(id => !ids.includes(id));
            } else {
                // Agregar los que faltan de este módulo
                const faltantes = ids.filter(id => !prev.includes(id));
                return [...prev, ...faltantes];
            }
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSelectedRole(null);
        setCheckedPermisos([]);
        setModuleFilter('');
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updatePermisos(selectedRole.id, checkedPermisos);
            setAlert({ type: 'success', message: 'Permisos actualizados correctamente.' });
            setIsEditing(false);
            setSelectedRole(null);
            setModuleFilter('');
            fetchRoles(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al guardar permisos'));
        } finally {
            setIsSaving(false);
        }
    };

    return {
        loading, roles, paginationInfo, filters, setFilters, alert, setAlert, fetchRoles,
        isEditing, editLoading, selectedRole, allPermisos, checkedPermisos,
        togglePermission, toggleTodos, toggleModulo,
        handleManage, handleSave, handleCancel, isSaving,
        moduleFilter, setModuleFilter,
    };
};