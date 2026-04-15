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

    // Estados para la Edición (sin modal)
    const [isEditing, setIsEditing] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [allPermisos, setAllPermisos] = useState([]);
    const [checkedPermisos, setCheckedPermisos] = useState([]); 
    const [isSaving, setIsSaving] = useState(false);
    
    // 🔥 NUEVO: Estado para el filtro local de módulos
    const [moduleFilter, setModuleFilter] = useState('');

    const fetchRoles = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setRoles(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
                total: response.total
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
        setModuleFilter(''); // Limpiamos el buscador al entrar
        try {
            const res = await show(id);
            setSelectedRole(res.data.rol);
            setAllPermisos(res.data.todos_los_permisos);
            const currentIds = res.data.rol.permisos.map(p => p.id);
            setCheckedPermisos(currentIds);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al obtener permisos'));
            setIsEditing(false);
        } finally {
            setEditLoading(false);
        }
    };

    const togglePermission = (permisoId) => {
        setCheckedPermisos(prev => 
            prev.includes(permisoId) ? prev.filter(id => id !== permisoId) : [...prev, permisoId]
        );
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSelectedRole(null);
        setCheckedPermisos([]);
        setModuleFilter(''); // Limpiamos al salir
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updatePermisos(selectedRole.id, checkedPermisos);
            setAlert({ type: 'success', message: 'Permisos actualizados correctamente.' });
            setIsEditing(false);
            setSelectedRole(null);
            setModuleFilter(''); // Limpiamos al salir
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
        togglePermission, handleManage, handleSave, handleCancel, isSaving,
        moduleFilter, setModuleFilter // Exportamos el nuevo filtro
    };
};