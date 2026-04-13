import { useState, useEffect, useCallback } from 'react';
import { useAuth } from 'context/AuthContext';
import echo from 'utilities/Echo/echo';
import { 
    index as getNotificaciones, 
    marcarComoLeida, 
    marcarTodasComoLeidas 
} from 'services/notificacionService';

import alertSound from 'assets/sounds/alert.mp3'; 

export const useNotificacion = () => {
    const { user } = useAuth();
    const [notificaciones, setNotificaciones] = useState([]); 
    const [noLeidas, setNoLeidas] = useState(0);
    const [cargando, setCargando] = useState(false);

    // 🔥 Usamos la variable importada en lugar del string quemado
    const playAlert = useCallback(() => {
        const audio = new Audio(alertSound); 
        audio.volume = 1.0;
        audio.play().catch(e => {
            console.warn("Audio bloqueado: El navegador requiere un clic previo en la página para que suene.");
        });
    }, []);

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

            // Si hay mensajes sin leer al entrar, suena la campana
            if (count > 0) {
                playAlert();
            }

        } catch (err) {
            console.error('Error cargando notificaciones:', err);
            setNotificaciones([]); 
        } finally {
            setCargando(false);
        }
    }, [user?.id, playAlert]);

    useEffect(() => {
        if (!user?.id) return;

        fetchNotificaciones();

        const channel = echo.channel(`notificaciones.${user.id}`);
        channel.listen('.NotificacionCreada', (e) => {
            const nueva = e.notificacion ?? e;
            setNotificaciones((prev) => {
                const actual = Array.isArray(prev) ? prev : [];
                return [nueva, ...actual].slice(0, 50);
            });
            setNoLeidas((prev) => prev + 1);

            // Cuando llega una noti nueva por WebSockets, también suena
            playAlert();
        });

        return () => echo.leave(`notificaciones.${user.id}`);
    }, [user?.id, fetchNotificaciones, playAlert]);

    const handleMarcarLeida = async (id) => {
        try {
            await marcarComoLeida(id);
            setNotificaciones((prev) => 
                Array.isArray(prev) ? prev.map((n) => (n.id === id ? { ...n, leido: true } : n)) : []
            );
            setNoLeidas((prev) => Math.max(0, prev - 1));
        } catch (err) { console.error(err); }
    };

    const handleMarcarTodas = async () => {
        try {
            await marcarTodasComoLeidas();
            setNotificaciones((prev) => 
                Array.isArray(prev) ? prev.map((n) => ({ ...n, leido: true })) : []
            );
            setNoLeidas(0);
        } catch (err) { console.error(err); }
    };

    return { notificaciones, noLeidas, cargando, handleMarcarLeida, handleMarcarTodas, refresh: fetchNotificaciones };
};