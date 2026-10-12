import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/solicitudPrendarioService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { FORM_INICIAL, crearHandleChange, construirPayload, validarAntesDeEnviar, unwrap } from './prendarioForm';

export const useUpdate = () => {
    const { id }   = useParams();
    const navigate = useNavigate();
    const [loading,  setLoading]  = useState(true);
    const [saving,   setSaving]   = useState(false);
    const [alert,    setAlert]    = useState(null);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = unwrap(await show(id), 'id');
                setFormData({
                    ...FORM_INICIAL,
                    ...data,
                    es_grupal:          false,
                    es_prendario:       true,
                    cuotas_solicitadas: 1,
                    frecuencia:         'MENSUAL',
                    modalidad:          'PRENDARIO',
                    seguro:             data.seguro || '',
                    seguro_financiado:  !!data.seguro_financiado,
                    monto_custodia:     data.monto_custodia ?? '',
                    fecha_inicio_personalizada: data.fecha_inicio_personalizada || '',
                    integrantes:        [],
                });
            } catch (err) {
                setAlert(handleApiError(err));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleChange = crearHandleChange(setFormData);

    const handleSubmit = async (e, isBlocked) => {
        e.preventDefault();
        if (isBlocked) {
            setAlert({ type: 'error', message: 'Revisa los datos marcados antes de guardar.' });
            return;
        }

        const error = validarAntesDeEnviar(formData);
        if (error) { setAlert({ type: 'error', message: error }); return; }

        setSaving(true);
        try {
            await update(id, construirPayload(formData));
            setAlert({ type: 'success', message: 'Solicitud prendaria actualizada.' });
            setTimeout(() => navigate('/solicitudPrendario/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setSaving(false);
        }
    };

    return { formData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate };
};