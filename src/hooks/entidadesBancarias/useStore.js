import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/menuService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({ nombre: '', precio: '' });

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Menú creado exitosamente.' });
            setTimeout(() => navigate('/menu/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al crear el menú'));
        } finally { setLoading(false); }
    };

    return { formData, setFormData, loading, alert, setAlert, handleChange, handleSubmit };
};