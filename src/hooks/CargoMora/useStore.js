import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/cargoMoraService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [formData, setFormData] = useState({
        dias_min: '', dias_max: '',
        monto_300_1000: '', monto_1001_2000: '', monto_2001_3000: '',
        monto_3001_4000: '', monto_4001_5000: '', monto_5001_6000: '', monto_mas_6000: ''
    });

    const handleChange = (field, value) => {
        // Si el valor es vacío, lo guardamos como null (especialmente para dias_max)
        setFormData(prev => ({ ...prev, [field]: value === '' ? null : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Rango registrado exitosamente.' });
            setTimeout(() => navigate('/cargoMora/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally { setLoading(false); }
    };

    return { formData, loading, alert, setAlert, handleChange, handleSubmit };
};