import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { show, update } from 'services/metaAsesorService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const anioActual = new Date().getFullYear();

export const useUpdate = () => {
    const { id }   = useParams();
    const navigate = useNavigate();

    const [loading, setLoading]       = useState(true);
    const [saving, setSaving]         = useState(false);
    const [alert, setAlert]           = useState(null);
    const [asesorNombre, setAsesorNombre] = useState('');
    const [formData, setFormData]     = useState({
        asesor_id:  '',
        mes:        new Date().getMonth() + 1,
        anio:       anioActual,
        meta_monto: '',
    });

    useEffect(() => {
        if (!id) return;
        show(id)
            .then(res => {
                const meta = res.data || res;
                setFormData({
                    asesor_id:  meta.asesor_id,
                    mes:        meta.mes,
                    anio:       meta.anio,
                    meta_monto: meta.meta_monto,
                });
                // Guardamos el nombre para pasarlo al combobox como initialName
                setAsesorNombre(meta.nombre ?? '');
            })
            .catch(err => setAlert(handleApiError(err)))
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (field, value) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setAlert(null);
        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Meta actualizada correctamente.' });
            setTimeout(() => navigate('/meta-asesor/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setSaving(false);
        }
    };

    return { loading, saving, alert, setAlert, formData, asesorNombre, handleChange, handleSubmit, navigate };
};