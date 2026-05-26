import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/metaAsesorService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const anioActual = new Date().getFullYear();

export const useStore = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [alert, setAlert]     = useState(null);
    const [formData, setFormData] = useState({
        asesor_id:  '',
        mes:        new Date().getMonth() + 1,
        anio:       anioActual,
        meta_monto: '',
    });

    const handleChange = (field, value) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Meta registrada correctamente. Redirigiendo...' });
            setTimeout(() => navigate('/meta-asesor/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return { loading, alert, setAlert, formData, handleChange, handleSubmit };
};