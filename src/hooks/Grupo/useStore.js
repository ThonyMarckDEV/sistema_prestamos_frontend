import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/grupoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({
        nombre: ''
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlert(null);
        setLoading(true);

        try {
            await store(formData);
            setAlert({
                type: 'success',
                message: 'El grupo ha sido registrado exitosamente. Redirigiendo...'
            });

            setTimeout(() => {
                navigate('/grupo/listar');
            }, 1500);

        } catch (err) {
            setAlert(handleApiError(err, 'Error al intentar registrar el grupo.'));
        } finally {
            setLoading(false);
        }
    };

    return { formData, loading, alert, setAlert, handleChange, handleSubmit };
};