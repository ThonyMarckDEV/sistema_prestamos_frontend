import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/prospectoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id }   = useParams();
    const navigate = useNavigate();

    const [loading,  setLoading]  = useState(true);
    const [saving,   setSaving]   = useState(false);
    const [alert,    setAlert]    = useState(null);
    const [formData, setFormData] = useState({
        tipo:             1,
        dni:              '',
        ruc:              '',
        nombre_completo:  '',
        telefono:         '',
        correo:           '',
        zona_id:          null,
        zona_nombre:      '',
        ingreso_estimado: '',
        monto_solicitado: '',
        proposito:        '',
        observaciones:    '',
    });

    useEffect(() => {
        const load = async () => {
            try {
                const res  = await show(id);
                const data = res.data || res;
                setFormData({
                    tipo:             data.tipo             || 1,
                    dni:              data.dni              || '',
                    ruc:              data.ruc              || '',
                    nombre_completo:  data.nombre_completo  || '',
                    telefono:         data.telefono         || '',
                    correo:           data.correo           || '',
                    zona_id:          data.zona_id          || null,
                    zona_nombre:      data.zona             || '',
                    ingreso_estimado: data.ingreso_estimado || '',
                    monto_solicitado: data.monto_solicitado || '',
                    proposito:        data.proposito        || '',
                    observaciones:    data.observaciones    || '',
                });
            } catch (err) {
                setAlert(handleApiError(err, 'Error al cargar el prospecto'));
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
        setAlert(null);
        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Prospecto actualizado correctamente.' });
            setTimeout(() => navigate('/prospecto/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar el prospecto'));
        } finally {
            setSaving(false);
        }
    };

    return { formData, handleChange, loading, saving, alert, setAlert, handleSubmit, navigate };
};