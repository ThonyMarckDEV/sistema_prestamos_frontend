import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/sorteoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { EMPTY_SORTEO, toPayload } from './useSorteoForm';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading,  setLoading]  = useState(false);
    const [alert,    setAlert]    = useState(null);
    const [formData, setFormData] = useState(EMPTY_SORTEO);

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await store(toPayload(formData));
            setAlert({ type: 'success', message: 'Sorteo registrado. Revisa la lista de participantes.' });
            setTimeout(() => navigate(`/sorteo/ver/${res.data.id}`), 1200);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return { formData, loading, alert, setAlert, handleChange, handleSubmit };
};
