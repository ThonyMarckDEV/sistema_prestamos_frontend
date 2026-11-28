import { useState, useEffect, useCallback } from 'react';
import { useAuth } from 'context/AuthContext';
import { 
    index as getNotificaciones, 
    marcarComoLeida, 
    marcarTodasComoLeidas 
} from 'services/notificacionService';

export const useNotificacion = () => {
    const { user } = useAuth();
    const [notificaciones, setNotificaciones] = useState([]); 
    const [noLeidas, setNoLeidas] = useState(0);
    const [cargando, setCargando] = useState(false);

    const fetchNotificaciones = useCallback(async () => {
        if (!user?.id) return;
        setCargando(true);
        try {
            const res = await getNotificaciones();
            const payload = res?.data || {};
            
            const lista = Array.isArray(payload.data) ? payload.data : [];
            const count = payload.no_leidas || 0;

            setNotificaciones(lista);
            setNoLeidas(count);

        } catch (err) {
            console.error('Error cargando notificaciones:', err);
            setNotificaciones([]); 
        } finally {
            setCargando(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (!user?.id) return;
        
        fetchNotificaciones();

    }, [user?.id, fetchNotificaciones]);

    const handleMarcarLeida = async (id) => {
        try {
            await marcarComoLeida(id); // Envía el ID numérico al backend
            setNotificaciones((prev) => 
                Array.isArray(prev) ? prev.map((n) => (n.id === id ? { ...n, leido: true } : n)) : []
            );
            setNoLeidas((prev) => Math.max(0, prev - 1));
        } catch (err) { console.error(err); }
    };

    const handleMarcarTodas = async () => {
        try {
            await marcarTodasComoLeidas(); // Envía 'all' al backend
            setNotificaciones((prev) => 
                Array.isArray(prev) ? prev.map((n) => ({ ...n, leido: true })) : []
            );
            setNoLeidas(0);
        } catch (err) { console.error(err); }
    };

    return { 
        notificaciones, 
        noLeidas, 
        cargando, 
        handleMarcarLeida, 
        handleMarcarTodas, 
        refresh: fetchNotificaciones 
    };
};