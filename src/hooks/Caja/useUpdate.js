import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/cajaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({ nombre: '', descripcion: '', activo: true });

    useEffect(() => {
        const loadCaja = async () => {
            try {
                const response = await show(id);
                const data = response.data || response;
                setFormData({
                    nombre: data.nombre || '',
                    descripcion: data.descripcion || '',
                    activo: data.activo
                });
            } catch (err) {
                setAlert(handleApiError(err, 'No se pudo cargar la información de la caja.'));
            } finally {
                setLoading(false);
            }
        };
        if (id) loadCaja();
    }, [id]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true); 
        setAlert(null);
        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Caja actualizada correctamente.' });
            setTimeout(() => navigate('/caja/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setSaving(false);
        }
    };

    return { formData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate };
};