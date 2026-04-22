import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/clienteService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert]     = useState(null);

    const [formData, setFormData] = useState({
        datos_cliente: {
            tipo: 1, nombre: '', apellidoPaterno: '', apellidoMaterno: '',
            dni: '', fechaNacimiento: '', fechaVencimientoDni: '', sexo: '', ruc: '', razon_social: '', nombre_comercial: '', // 🔥 Agregado
            ciiu_id: null,
            ciiu: null, 
            zona_id: null
        },
        contacto: { telefonoMovil: '', telefonoFijo: '', correo: '' },
        direccion: { direccionFiscal: '', departamento: '', provincia: '', distrito: '', tipoVivienda: '', tiempoResidencia: '' },
        empleo: { centroLaboral: '', ingresoMensual: '', inicioLaboral: '', situacionLaboral: '' },
        usuario: { username: '', password: '', password_confirmation: '' },
        cuentas_bancarias: [] 
    });

    const handleNestedChange = (section, field, value) => {
        if (field === null) {
            setFormData(prev => ({ ...prev, [section]: value }));
        } else {
            setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.usuario.password !== formData.usuario.password_confirmation) {
            return setAlert({ type: 'error', message: 'Las contraseñas no coinciden.' });
        }

        if (!formData.datos_cliente.zona_id) {
            return setAlert({ type: 'error', message: 'Por favor, seleccione una Zona Operativa obligatoriamente.' });
        }

        setLoading(true); setAlert(null);
        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Cliente registrado exitosamente. Redirigiendo...' });
            setTimeout(() => navigate('/cliente/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al registrar cliente'));
        } finally {
            setLoading(false);
        }
    };

    return { formData, setFormData, loading, alert, setAlert, handleNestedChange, handleSubmit };
};