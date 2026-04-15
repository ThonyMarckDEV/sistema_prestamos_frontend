import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/solicitudPrestamoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState(null);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await show(id);
                const data = res.data || res;
                setFormData({
                    ...data,
                    integrantes: data.integrantes.map(i => ({ 
                        id: i.id, 
                        nombre: i.nombre_completo, 
                        monto: i.monto,
                        modalidad: i.modalidad 
                    }))
                });
            } catch (err) { setAlert(handleApiError(err)); }
            finally { setLoading(false); }
        };
        load();
    }, [id]);

    // VALIDACIÓN PROFUNDA PARA EDICIÓN
    const isBlocked = formData ? (
        formData.modalidad === 'RCS' || 
        (formData.modalidad && formData.modalidad.includes('VIGENTE')) ||
        (formData.integrantes || []).some(i => i.modalidad === 'RCS' || (i.modalidad && i.modalidad.includes('VIGENTE')))
    ) : false;

    const handleChange = (field, value) => {
        if (field.includes('.')) {
            const [obj, key] = field.split('.');
            setFormData(prev => ({ ...prev, [obj]: { ...prev[obj], [key]: value } }));
        } else { setFormData(prev => ({ ...prev, [field]: value })); }
    };

    // Actualizar suma al cambiar monto
    useEffect(() => {
        if (formData?.es_grupal) {
            const total = formData.integrantes.reduce((acc, i) => acc + parseFloat(i.monto || 0), 0);
            if (total !== formData.monto_solicitado) {
                setFormData(prev => ({ ...prev, monto_solicitado: total }));
            }
        }
        // eslint-disable-next-line
    }, [formData?.integrantes, formData?.es_grupal]);

    const addIntegrante = (cliente) => {
        if (!cliente || formData.integrantes.find(i => i.id === cliente.usuario_id)) return;
        setFormData(prev => ({
            ...prev,
            integrantes: [...prev.integrantes, { 
                id: cliente.usuario_id, 
                nombre: cliente.nombre_completo, 
                modalidad: cliente.modalidad_cliente,
                monto: '' 
            }]
        }));
    };

    const removeIntegrante = (id) => {
        setFormData(prev => ({ ...prev, integrantes: prev.integrantes.filter(i => i.id !== id) }));
    };

    const updateMontoIntegrante = (id, monto) => {
        setFormData(prev => ({
            ...prev,
            integrantes: prev.integrantes.map(i => i.id === id ? { ...i, monto } : i)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isBlocked) return;
        setSaving(true);
        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Solicitud actualizada.' });
            setTimeout(() => navigate('/solicitudPrestamo/listar'), 1500);
        } catch (err) { setAlert(handleApiError(err)); }
        finally { setSaving(false); }
    };

    return { formData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate, addIntegrante, removeIntegrante, updateMontoIntegrante, isBlocked };
};