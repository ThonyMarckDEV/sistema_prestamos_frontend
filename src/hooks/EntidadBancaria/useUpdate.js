import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/entidadBancariaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setSaving]  = useState(true);
    const [saving,  setLoading] = useState(false);
    const [alert,   setAlert]   = useState(null);

    const [formData, setFormData] = useState({
        nombre: '', longitud_cuenta: '', longitud_cci: ''
    });

    useEffect(() => {
        const loadEntidad = async () => {
            try {
                const response = await show(id);
                const data = response.data || response;
                setFormData({
                    nombre: data.nombre || '',
                    longitud_cuenta: data.longitud_cuenta || '',
                    longitud_cci: data.longitud_cci || ''
                });
            } catch (err) {
                setAlert(handleApiError(err, 'No se pudo cargar la información del banco.'));
            } finally {
                setSaving(false);
            }
        };
        if (id) loadEntidad();
    }, [id]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setAlert(null);
        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Entidad actualizada correctamente.' });
            setTimeout(() => navigate('/bancos/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar el banco'));
        } finally {
            setLoading(false);
        }
    };

    return { formData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate };
};