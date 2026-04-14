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
                setFormData(res.data || res);
            } catch (err) { setAlert(handleApiError(err)); }
            finally { setLoading(false); }
        };
        load();
    }, [id]);

    const handleChange = (field, value) => {
        if (field.includes('.')) {
            const [obj, key] = field.split('.');
            setFormData(prev => ({ ...prev, [obj]: { ...prev[obj], [key]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Solicitud actualizada.' });
            setTimeout(() => navigate('/solicitudPrestamo/listar'), 1500);
        } catch (err) { setAlert(handleApiError(err)); }
        finally { setSaving(false); }
    };

    return { formData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate };
};