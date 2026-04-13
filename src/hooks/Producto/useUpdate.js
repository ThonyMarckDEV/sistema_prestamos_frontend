import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/productoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true); // Carga inicial
    const [saving, setSaving] = useState(false);   // Al guardar
    const [alert, setAlert] = useState(null);
    const [formData, setFormData] = useState({ nombre: '', rango_tasa: '' });

    useEffect(() => {
        const loadProducto = async () => {
            try {
                const response = await show(id);
                const data = response.data || response;
                setFormData({
                    nombre: data.nombre || '',
                    rango_tasa: data.rango_tasa || ''
                });
            } catch (err) {
                setAlert(handleApiError(err, 'No se pudo cargar el producto.'));
            } finally {
                setLoading(false);
            }
        };
        if (id) loadProducto();
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
            setAlert({ type: 'success', message: 'Producto actualizado con éxito.' });
            setTimeout(() => navigate('/producto/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar el producto'));
        } finally {
            setSaving(false);
        }
    };

    return { formData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate };
};