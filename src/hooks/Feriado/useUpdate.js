import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/feriadoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id }   = useParams();
    const navigate = useNavigate();

    const [loading,  setLoading]  = useState(true);
    const [saving,   setSaving]   = useState(false);
    const [alert,    setAlert]    = useState(null);
    const [formData, setFormData] = useState({ fecha: '', descripcion: '' });

    useEffect(() => {
        const load = async () => {
            try {
                const res  = await show(id);
                const data = res.data || res;
                setFormData({ fecha: data.fecha, descripcion: data.descripcion });
            } catch (err) {
                setAlert(handleApiError(err, 'No se pudo cargar el feriado.'));
            } finally {
                setLoading(false);
            }
        };
        if (id) load();
    }, [id]);

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Feriado actualizado correctamente.' });
            setTimeout(() => navigate('/feriados/index'), 1500);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setSaving(false);
        }
    };

    return { formData, loading, saving, alert, setAlert, handleChange, handleSubmit };
};