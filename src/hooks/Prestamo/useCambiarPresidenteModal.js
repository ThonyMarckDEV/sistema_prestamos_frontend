import { useState, useEffect } from 'react';
import { cambiarPresidente } from 'services/prestamoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useCambiarPresidenteModal = ({ isOpen, prestamo, onSuccess }) => {
    const [loading, setLoading]                         = useState(false);
    const [alert, setAlert]                             = useState(null);
    const [nuevoPresidenteId, setNuevoPresidenteId]     = useState('');

    const presidenteActual = prestamo?.integrantes?.find(i => i.cargo === 'PRESIDENTE');
    const candidatos       = prestamo?.integrantes?.filter(i => i.cargo !== 'PRESIDENTE') ?? [];

    useEffect(() => {
        if (isOpen) {
            setNuevoPresidenteId(candidatos[0]?.id ?? '');
            setAlert(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, prestamo?.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nuevoPresidenteId) return;
        setAlert(null);
        setLoading(true);
        try {
            await cambiarPresidente({
                prestamo_id:          prestamo.id,
                nuevo_presidente_id:  nuevoPresidenteId,
            });
            onSuccess();
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return {
        loading, alert, setAlert,
        nuevoPresidenteId, setNuevoPresidenteId,
        presidenteActual, candidatos,
        handleSubmit,
        submitDisabled: loading || !nuevoPresidenteId,
    };
};