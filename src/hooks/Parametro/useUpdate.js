import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/parametroService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id }   = useParams();
    const navigate = useNavigate();

    const [loading,  setLoading]  = useState(true);
    const [saving,   setSaving]   = useState(false);
    const [alert,    setAlert]    = useState(null);
    const [formData, setFormData] = useState({ valor: '', descripcion: '' });
    const [clave,    setClave]    = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const res  = await show(id);
                const data = res.data || res;
                setClave(data.clave);
                setFormData({ valor: data.valor, descripcion: data.descripcion ?? '' });
            } catch (err) {
                setAlert(handleApiError(err, 'No se pudo cargar el parámetro.'));
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
            setAlert({ type: 'success', message: 'Parámetro actualizado correctamente.' });
            setTimeout(() => navigate('/parametro/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setSaving(false);
        }
    };

    return { formData, clave, loading, saving, alert, setAlert, handleChange, handleSubmit };
};