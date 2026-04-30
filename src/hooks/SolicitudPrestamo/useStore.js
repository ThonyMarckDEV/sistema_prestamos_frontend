import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/solicitudPrestamoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({
        es_grupal: false,
        cliente_id: '',
        fechaVencimientoDni: '',
        dni_status: null,
        grupo_id: '',
        integrantes: [],
        producto_id: '',
        monto_solicitado: 0,
        tasa_interes: '',
        cuotas_solicitadas: '',
        frecuencia: 'SEMANAL',
        modalidad: '',
        observaciones: '',
        aval: null
    });

    // 1. LÓGICA DE BLOQUEO
    const dniPrincipalVencido = formData.dni_status?.estado === 'VENCIDO';
    const dniIntegranteVencido = formData.es_grupal && formData.integrantes.some(i => i.dni_status?.estado === 'VENCIDO');

    // Riesgo Crediticio: Bloquea SOLO si piden GRUPAL y ya tienen un GRUPAL (VIGENTE GRUPAL o RCS GRUPAL)
    const principalBloqueadoPorRiesgo = formData.es_grupal && 
        (formData.modalidad?.includes('GRUPAL') && (formData.modalidad?.includes('VIGENTE') || formData.modalidad?.includes('RCS')));

    const integranteBloqueadoPorRiesgo = formData.es_grupal && formData.integrantes.some(i => 
        i.modalidad?.includes('GRUPAL') && (i.modalidad?.includes('VIGENTE') || i.modalidad?.includes('RCS'))
    );

    const isMainBlocked = dniPrincipalVencido || principalBloqueadoPorRiesgo;
    const hasBlockedIntegrante = dniIntegranteVencido || integranteBloqueadoPorRiesgo;
    const isBlocked = isMainBlocked || hasBlockedIntegrante;

    const handleChange = (field, value) => {
        if (field.includes('.')) {
            const [obj, key] = field.split('.');
            setFormData(prev => ({ ...prev, [obj]: { ...prev[obj], [key]: value } }));
        } else {
            setFormData(prev => {
                const newData = { ...prev, [field]: value };
                if (field === 'es_grupal') {
                    if (value === true) {
                        newData.modalidad = 'GRUPAL';
                        newData.cliente_id = '';
                        newData.fechaVencimientoDni = '';
                        newData.dni_status = null;
                    } else {
                        newData.modalidad = ''; 
                        newData.grupo_id = ''; 
                        newData.integrantes = []; 
                    }
                }
                return newData;
            });
        }
    };

    useEffect(() => {
        if (formData.es_grupal) {
            const total = formData.integrantes.reduce((acc, i) => acc + parseFloat(i.monto || 0), 0);
            setFormData(prev => ({ ...prev, monto_solicitado: total }));
        }
    }, [formData.integrantes, formData.es_grupal]);

    const addIntegrante = (cliente) => {
        if (!cliente || formData.integrantes.find(i => i.id === cliente.usuario_id)) return;
        setFormData(prev => {
            const cargo = prev.integrantes.length === 0 ? 'PRESIDENTE' : 'INTEGRANTE';
            return {
                ...prev,
                integrantes: [...prev.integrantes, { 
                    id: cliente.usuario_id, 
                    nombre: cliente.nombre_completo, 
                    modalidad: cliente.modalidad_cliente,
                    monto: 0,
                    cargo: cargo,
                    fechaVencimientoDni: cliente.fechaVencimientoDni,
                    dni_status: cliente.dni_status
                }]
            };
        });
    };

    const removeIntegrante = (id) => {
        setFormData(prev => ({ ...prev, integrantes: prev.integrantes.filter(i => i.id !== id) }));
    };

    const updateMontoIntegrante = (id, monto) => {
        setFormData(prev => ({
            ...prev,
            integrantes: prev.integrantes.map(i => i.id === id ? { ...i, monto } : i)
        }));
    };

    const updateCargoIntegrante = (id, cargo) => {
        setFormData(prev => ({
            ...prev,
            integrantes: prev.integrantes.map(i => i.id === id ? { ...i, cargo } : i)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isBlocked) {
            setAlert({ type: 'error', message: 'No se puede enviar la solicitud por restricciones de crédito o DNI.' });
            return;
        }
        setLoading(true);
        try {
            // 2. LIMPIEZA DEL PAYLOAD
            const payload = { ...formData };

            if (payload.es_grupal) {
                payload.modalidad = 'GRUPAL';
            } else {
                // Si tiene deuda activa (sea individual o grupal), su nuevo préstamo individual es RCS.
                if (payload.modalidad?.includes('VIGENTE') || payload.modalidad?.includes('RCS')) {
                    payload.modalidad = 'RCS'; 
                } else if (payload.modalidad?.includes('RSS')) {
                    payload.modalidad = 'RSS';
                } else {
                    payload.modalidad = 'NUEVO';
                }
            }

            await store(payload);
            setAlert({ type: 'success', message: 'Solicitud enviada con éxito.' });
            setTimeout(() => navigate('/solicitudPrestamo/listar'), 1500);
        } catch (err) { 
            setAlert(handleApiError(err)); 
        } finally { 
            setLoading(false); 
        }
    };

    return { formData, loading, alert, setAlert, handleChange, handleSubmit, isBlocked, addIntegrante, removeIntegrante, updateMontoIntegrante, updateCargoIntegrante };
};