import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/solicitudPrendarioService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { FORM_INICIAL, crearHandleChange, construirPayload, validarAntesDeEnviar } from './prendarioForm';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading,  setLoading]  = useState(false);
    const [alert,    setAlert]    = useState(null);
    const [formData, setFormData] = useState(FORM_INICIAL);

    const handleChange = crearHandleChange(setFormData);

    const handleSubmit = async (e, isBlocked) => {
        e.preventDefault();
        if (isBlocked) {
            setAlert({ type: 'error', message: 'Revisa los datos marcados antes de registrar la solicitud.' });
            return;
        }

        const error = validarAntesDeEnviar(formData);
        if (error) { setAlert({ type: 'error', message: error }); return; }

        setLoading(true);
        try {
            await store(construirPayload(formData));
            setAlert({ type: 'success', message: 'Solicitud prendaria registrada.' });
            setTimeout(() => navigate('/solicitudPrendario/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return { formData, loading, alert, setAlert, handleChange, handleSubmit };
};