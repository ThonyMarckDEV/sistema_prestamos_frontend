import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/grupoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({ 
        codigo_recaudo: '' ,
        nombre: ''
    });

    useEffect(() => {
        const loadGrupo = async () => {
            try {
                const response = await show(id);
                const data = response.data || response;
                setFormData({
                    codigo_recaudo: data.codigo_recaudo || '',
                    nombre: data.nombre || ''
                });
            } catch (err) {
                setAlert(handleApiError(err, 'No se pudo cargar la información del grupo.'));
            } finally {
                setLoading(false);
            }
        };
        if (id) loadGrupo();
    }, [id]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true); 
        setAlert(null);
        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Grupo actualizado correctamente.' });
            setTimeout(() => navigate('/grupo/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setSaving(false);
        }
    };

    return { formData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate };
};