import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store, combobox } from 'services/prospectoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const initialForm = {
    tipo:             1,
    dni:              '',
    ruc:              '',
    nombre_completo:  '',
    telefono:         '',
    correo:           '',
    zona_id:          null,
    ingreso_estimado: '',
    monto_solicitado: '',
    proposito:        '',
    observaciones:    '',
};

export const useStore = () => {
    const navigate = useNavigate();

    // Fase 1: búsqueda de documento
    const [documento,      setDocumento]      = useState('');
    const [buscando,       setBuscando]       = useState(false);
    const [busquedaHecha,  setBusquedaHecha]  = useState(false);
    const [busquedaResult, setBusquedaResult] = useState(null); // { encontrado, tipo, data }

    // Fase 2: formulario
    const [formData, setFormData] = useState(initialForm);
    const [loading,  setLoading]  = useState(false);
    const [alert,    setAlert]    = useState(null);

    const handleBuscar = async () => {
        if (!documento || documento.length < 8) {
            return setAlert({ type: 'error', message: 'Ingrese un DNI (8 dígitos) o RUC (11 dígitos).' });
        }
        setBuscando(true);
        setAlert(null);
        try {
            const res = await combobox(documento);
            const result = res.data || res;
            setBusquedaResult(result);
            setBusquedaHecha(true);

            // Pre-llenar DNI/RUC si no se encontró nada
            if (!result.encontrado) {
                const esRuc = documento.length === 11;
                setFormData(prev => ({
                    ...prev,
                    tipo: esRuc ? 2 : 1,
                    [esRuc ? 'ruc' : 'dni']: documento,
                }));
            }
        } catch (err) {
            setAlert(handleApiError(err, 'Error al buscar el documento'));
        } finally {
            setBuscando(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nombre_completo) return setAlert({ type: 'error', message: 'El nombre completo es obligatorio.' });
        if (!formData.telefono)        return setAlert({ type: 'error', message: 'El teléfono es obligatorio.' });

        setLoading(true);
        setAlert(null);
        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Prospecto registrado exitosamente. Redirigiendo...' });
            setTimeout(() => navigate('/prospecto/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al registrar el prospecto'));
        } finally {
            setLoading(false);
        }
    };

    const resetBusqueda = () => {
        setDocumento('');
        setBusquedaHecha(false);
        setBusquedaResult(null);
        setFormData(initialForm);
        setAlert(null);
    };

    return {
        documento, setDocumento,
        buscando, busquedaHecha, busquedaResult,
        formData, handleChange,
        loading, alert, setAlert,
        handleBuscar, handleSubmit, resetBusqueda,
        navigate,
    };
};