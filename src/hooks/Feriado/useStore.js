import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { store, index } from 'services/feriadoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const normalizar = (f) => ({
    ...f,
    fecha: f.fecha?.includes('/') ? f.fecha.split('/').reverse().join('-') : f.fecha,
});

export const useStore = () => {
    const navigate = useNavigate();
    const [loading,  setLoading]  = useState(false);
    const [alert,    setAlert]    = useState(null);
    const [feriados, setFeriados] = useState([]);
    const [formData, setFormData] = useState({ fecha: '', descripcion: '' });

    useEffect(() => {
        const load = async () => {
            try {
                const res = await index();
                setFeriados((res.data || []).map(normalizar));
            } catch (_) {}
        };
        load();
    }, []);

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Feriado registrado correctamente.' });
            setTimeout(() => navigate('/feriados/index'), 1500);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return { formData, feriados, loading, alert, setAlert, handleChange, handleSubmit };
};