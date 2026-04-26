import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { store } from 'services/clienteService';
import { show as showProspecto } from 'services/prospectoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const generarUsername = (nombre, apellidoPaterno, apellidoMaterno) => {
    const n  = (nombre         || '').trim().split(' ')[0].slice(0, 2);
    const ap = (apellidoPaterno || '').trim().split(' ')[0]; 
    const am = (apellidoMaterno || '').trim().split(' ')[0].slice(0, 1);
    return (n + ap + am).toUpperCase().replace(/[^A-Z0-9]/g, '');
};

const initialForm = {
    datos_cliente: {
        tipo: 1, nombre: '', apellidoPaterno: '', apellidoMaterno: '',
        dni: '', fechaNacimiento: '', fechaVencimientoDni: '', sexo: '',
        ruc: '', razon_social: '', nombre_comercial: '',
        ciiu_id: null, ciiu: null, zona_id: null, zona_nombre: '',
    },
    contacto:  { telefonoMovil: '', telefonoFijo: '', correo: '' },
    direccion: { direccionFiscal: '', departamento: '', provincia: '', distrito: '', tipoVivienda: '', tiempoResidencia: '' },
    empleo:    { centroLaboral: '', ingresoMensual: '', inicioLaboral: '', situacionLaboral: '' },
    usuario:   { username: '' },
    cuentas_bancarias: [],
};

export const useStore = () => {
    const navigate        = useNavigate();
    const [searchParams]  = useSearchParams();
    const prospectoId     = searchParams.get('prospecto_id');

    const [loading,          setLoading]          = useState(false);
    const [loadingProspecto, setLoadingProspecto] = useState(!!prospectoId);
    const [alert,            setAlert]            = useState(null);
    const [formData,         setFormData]         = useState(initialForm);

    useEffect(() => {
        const dc = formData.datos_cliente;
        if (dc.tipo !== 1) return;
        if (!dc.nombre && !dc.apellidoPaterno && !dc.apellidoMaterno) return;

        const username = generarUsername(dc.nombre, dc.apellidoPaterno, dc.apellidoMaterno);
        setFormData(prev => ({
            ...prev,
            usuario: { ...prev.usuario, username },
        }));
        // eslint-disable-next-line
    }, [
        formData.datos_cliente.nombre,
        formData.datos_cliente.apellidoPaterno,
        formData.datos_cliente.apellidoMaterno,
        formData.datos_cliente.tipo,
    ]);

    // Precargar datos del prospecto
    useEffect(() => {
        if (!prospectoId) return;

        const cargarProspecto = async () => {
            setLoadingProspecto(true);
            try {
                const res = await showProspecto(prospectoId);
                const p   = res.data || res;

                setFormData(prev => ({
                    ...prev,
                    datos_cliente: {
                        ...prev.datos_cliente,
                        tipo:                p.tipo,
                        dni:                 p.dni                || '',
                        nombre:              p.nombre             || '',
                        apellidoPaterno:     p.apellidoPaterno    || '',
                        apellidoMaterno:     p.apellidoMaterno    || '',
                        fechaNacimiento:     p.fechaNacimiento    || '',
                        fechaVencimientoDni: p.fechaVencimientoDni || '',
                        sexo:                p.sexo               || '',
                        ruc:                 p.ruc                || '',
                        razon_social:        p.razon_social       || '',
                        nombre_comercial:    p.nombre_comercial   || '',
                        ciiu_id:             p.ciiu_id            || null,
                        ciiu:                p.ciiu               || null,
                        zona_id:             p.zona_id            || null,
                        zona_nombre:         p.zona               || '',
                    },
                    contacto: {
                        telefonoMovil: p.telefono     || '',
                        telefonoFijo:  p.telefonoFijo || '',
                        correo:        p.correo        || '',
                    },
                    direccion: {
                        direccionFiscal:  p.direccionFiscal  || '',
                        departamento:     p.departamento     || '',
                        provincia:        p.provincia        || '',
                        distrito:         p.distrito         || '',
                        tipoVivienda:     p.tipoVivienda     ||  '',
                        tiempoResidencia: p.tiempoResidencia || '',
                    },
                }));
            } catch (err) {
                setAlert(handleApiError(err, 'No se pudo cargar el prospecto.'));
            } finally {
                setLoadingProspecto(false);
            }
        };

        cargarProspecto();
    }, [prospectoId]);

    const handleNestedChange = (section, field, value) => {
        if (field === null) {
            setFormData(prev => ({ ...prev, [section]: value }));
        } else {
            setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.datos_cliente.zona_id) {
            return setAlert({ type: 'error', message: 'Por favor, seleccione una Zona Operativa obligatoriamente.' });
        }
        if (!formData.contacto.correo) {
            return setAlert({ type: 'error', message: 'El correo electrónico es obligatorio.' });
        }

        setLoading(true);
        setAlert(null);
        try {
            const payload = prospectoId
                ? { ...formData, prospecto_id: prospectoId }
                : formData;

            await store(payload);
            setAlert({ type: 'success', message: 'Cliente registrado exitosamente. Redirigiendo...' });
            setTimeout(() => navigate('/cliente/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al registrar cliente'));
        } finally {
            setLoading(false);
        }
    };

    return {
        formData, setFormData,
        loading, loadingProspecto,
        alert, setAlert,
        handleNestedChange, handleSubmit,
        prospectoId,
    };
};