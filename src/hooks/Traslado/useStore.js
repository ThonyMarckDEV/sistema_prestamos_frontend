import { useState } from 'react';
import { prestamosPorAsesor, store } from 'services/trasladoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const [loading, setLoading]           = useState(false);
    const [loadingPrestamos, setLoadingPrestamos] = useState(false);
    const [alert, setAlert]               = useState(null);
    const [prestamos, setPrestamos]       = useState([]);

    const [formData, setFormData] = useState({
        prestamo_id:       null,
        asesor_origen_id:  null,   // solo para mostrar, no se envía
        asesor_destino_id: null,
        motivo:            '',
    });

    // Cuando seleccionan asesor origen → cargar sus préstamos
    const handleSelectAsesorOrigen = async (asesor) => {
        setFormData(prev => ({
            ...prev,
            asesor_origen_id: asesor ? asesor.id : null,
            prestamo_id: null,
        }));
        setPrestamos([]);

        if (!asesor) return;

        setLoadingPrestamos(true);
        try {
            const data = await prestamosPorAsesor(asesor.id);
            // El backend puede devolver array directo o { data: [...] }
            const lista = Array.isArray(data) ? data : (data?.data ?? []);
            setPrestamos(lista);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally { setLoadingPrestamos(false); }
    };

    const handleSelectAsesorDestino = (asesor) => {
        if (asesor && asesor.id === formData.asesor_origen_id) {
            setAlert({ type: 'error', message: 'El asesor de destino debe ser diferente al asesor origen.' });
            return;
        }
        setAlert(null);
        setFormData(prev => ({ ...prev, asesor_destino_id: asesor ? asesor.id : null }));
    };

    const handleSelectPrestamo = (prestamoId) => {
        setFormData(prev => ({ ...prev, prestamo_id: prestamoId }));
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.prestamo_id)       return setAlert({ type: 'error', message: 'Selecciona un préstamo.' });
        if (!formData.asesor_destino_id) return setAlert({ type: 'error', message: 'Selecciona un asesor de destino.' });
        if (formData.asesor_origen_id === formData.asesor_destino_id)
            return setAlert({ type: 'error', message: 'El asesor de destino debe ser diferente al origen.' });

        setAlert(null);
        setLoading(true);
        try {
            await store({
                prestamo_id:       formData.prestamo_id,
                asesor_destino_id: formData.asesor_destino_id,
                motivo:            formData.motivo,
            });
            setAlert({ type: 'success', message: 'Préstamo trasladado correctamente.' });
            // Reset
            setFormData({ prestamo_id: null, asesor_origen_id: null, asesor_destino_id: null, motivo: '' });
            setPrestamos([]);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally { setLoading(false); }
    };

    return {
        loading, loadingPrestamos, alert, setAlert,
        formData, prestamos,
        handleSelectAsesorOrigen, handleSelectAsesorDestino,
        handleSelectPrestamo, handleChange, handleSubmit,
    };
};