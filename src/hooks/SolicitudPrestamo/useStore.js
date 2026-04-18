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

    const isBlocked = 
        formData.modalidad === 'RCS' || 
        (formData.modalidad && formData.modalidad.includes('VIGENTE')) ||
        formData.integrantes.some(i => i.modalidad === 'RCS' || (i.modalidad && i.modalidad.includes('VIGENTE')));

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
                    cargo: cargo
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
        if (isBlocked) return;
        setLoading(true);
        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Solicitud enviada con éxito.' });
            setTimeout(() => navigate('/solicitudPrestamo/listar'), 1500);
        } catch (err) { setAlert(handleApiError(err)); }
        finally { setLoading(false); }
    };

    return { formData, loading, alert, setAlert, handleChange, handleSubmit, isBlocked, addIntegrante, removeIntegrante, updateMontoIntegrante, updateCargoIntegrante };
};