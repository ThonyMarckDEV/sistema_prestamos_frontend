import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/sorteoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { EMPTY_SORTEO, fromApi, toPayload } from './useSorteoForm';

export const useUpdate = () => {
    const { id }   = useParams();
    const navigate = useNavigate();

    const [loading,  setLoading]  = useState(true);
    const [saving,   setSaving]   = useState(false);
    const [alert,    setAlert]    = useState(null);
    const [sorteo,   setSorteo]   = useState(null);
    const [formData, setFormData] = useState(EMPTY_SORTEO);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await show(id);
                setSorteo(res.data);
                setFormData(fromApi(res.data));
            } catch (err) {
                setAlert(handleApiError(err, 'No se pudo cargar el sorteo.'));
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
            const res = await update(id, toPayload(formData));
            setAlert({ type: 'success', message: res.message || 'Sorteo actualizado.' });
            setTimeout(() => navigate(`/sorteo/ver/${id}`), 1500);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setSaving(false);
        }
    };

    return { sorteo, formData, loading, saving, alert, setAlert, handleChange, handleSubmit };
};
