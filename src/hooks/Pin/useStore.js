import { useState, useEffect } from 'react';
import { store } from 'services/pinService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = ({ isOpen }) => {
    const [loading, setLoading]         = useState(false);
    const [alert, setAlert]             = useState(null);
    const [pinGenerado, setPinGenerado] = useState(null);
    const [copiado, setCopiado]         = useState(false);
    const [usuarioKey, setUsuarioKey]   = useState(Date.now());

    const [form, setForm] = useState({
        usuario_id:     null,
        usos_maximos:   1,
        expira_minutos: 5,
    });

    useEffect(() => {
        if (isOpen) {
            setPinGenerado(null);
            setAlert(null);
            setUsuarioKey(Date.now());
            setForm({ usuario_id: null, usos_maximos: 1, expira_minutos: 5 });
        }
    }, [isOpen]);

    const handleGenerar = async () => {
        setLoading(true); setAlert(null);
        try {
            const res = await store(form);
            setPinGenerado(res?.data ?? res);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally { setLoading(false); }
    };

    const handleCopiar = () => {
        navigator.clipboard.writeText(pinGenerado.pin);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
    };

    const handleChange = (field, value) => setForm(p => ({ ...p, [field]: value }));

    return {
        loading, alert, setAlert,
        pinGenerado, setPinGenerado,
        copiado, usuarioKey,
        form, handleChange,
        handleGenerar, handleCopiar,
    };
};