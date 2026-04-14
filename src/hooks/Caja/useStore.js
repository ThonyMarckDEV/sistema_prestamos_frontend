import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/cajaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    // Estado inicial del formulario según tu migración
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        activo: 1 // Por defecto habilitada
    });

    /**
     * Maneja el cambio de los inputs del formulario
     */
    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    /**
     * Envía la data al servicio de Laravel
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Limpiamos alertas previas y activamos loading
        setAlert(null);
        setLoading(true);

        try {
            await store(formData);
            
            setAlert({
                type: 'success',
                message: 'La caja ha sido registrada exitosamente. Redirigiendo...'
            });

            // Pequeño delay para que el usuario vea el mensaje de éxito
            setTimeout(() => {
                navigate('/caja/listar');
            }, 1500);

        } catch (err) {
            // Manejo de errores de API (ej: nombre duplicado)
            setAlert(handleApiError(err, 'Error al intentar registrar la caja.'));
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        alert,
        setAlert,
        handleChange,
        handleSubmit
    };
};