import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/solicitudPrestamoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [formData, setFormData] = useState({
        cliente_id: '', producto_id: '', monto_solicitado: '', tasa_interes: '',
        cuotas_solicitadas: '', frecuencia: 'SEMANAL', modalidad: '', observaciones: '',
        aval: { dni_aval: '', nombres_aval: '', apellido_paterno_aval: '', apellido_materno_aval: '', telefono_movil_aval: '', direccion_aval: '', relacion_cliente_aval: '', departamento_aval: 'PIURA', provincia_aval: 'TALARA', distrito_aval: 'PARIÑAS' }
    });

    const handleChange = (field, value) => {
        if (field.includes('.')) {
            const [obj, key] = field.split('.');
            setFormData(prev => ({ ...prev, [obj]: { ...prev[obj], [key]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Solicitud enviada con éxito.' });
            setTimeout(() => navigate('/solicitudPrestamo/listar'), 1500);
        } catch (err) { setAlert(handleApiError(err)); }
        finally { setLoading(false); }
    };

    return { formData, loading, alert, setAlert, handleChange, handleSubmit };
};