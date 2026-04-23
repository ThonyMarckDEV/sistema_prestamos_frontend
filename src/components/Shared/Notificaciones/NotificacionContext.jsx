import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { index, markAsRead, markAllAsRead } from 'services/notificacionService';
import { useAuth } from 'context/AuthContext';
import 'js/echo';
import notificationSound from 'assets/sound/notification/sound.mp3';

const NotificacionContext = createContext();

export const NotificacionProvider = ({ children }) => {
    const { user } = useAuth();
    const [notificaciones, setNotificaciones] = useState([]);
    const [noLeidas, setNoLeidas] = useState(0);
    const [cargando, setCargando] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio(notificationSound);
        audioRef.current.volume = 0.5;
    }, []);

    const reproducirSonido = useCallback(() => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = 0;
        const promise = audioRef.current.play();
        if (promise !== undefined) {
            promise.catch(() => {});
        }
    }, []);

    const refresh = useCallback(async () => {
        if (!user) return;
        setCargando(true);
        try {
            const res = await index();

            let lista = [];
            if (Array.isArray(res))                       lista = res;
            else if (Array.isArray(res?.data))            lista = res.data;
            else if (Array.isArray(res?.notificaciones))  lista = res.notificaciones;
            else if (Array.isArray(res?.data?.data))      lista = res.data.data;

            const cantidadNoLeidas = res?.no_leidas ?? res?.data?.no_leidas ?? res?.noLeidas ?? 0;

            setNotificaciones(lista);
            setNoLeidas(cantidadNoLeidas);
        } catch (err) {
            console.error("Error al cargar notificaciones", err);
            setNotificaciones([]);
        } finally {
            setCargando(false);
        }
    }, [user]);

    const handleMarcarLeida = async (id) => {
        try {
            await markAsRead(id);
            setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leido: true } : n));
            setNoLeidas(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Error al marcar leída", err);
        }
    };

    const handleMarcarTodas = async () => {
        try {
            await markAllAsRead();
            setNotificaciones(prev => prev.map(n => ({ ...n, leido: true })));
            setNoLeidas(0);
        } catch (err) {
            console.error("Error al marcar todas", err);
        }
    };

    useEffect(() => {
        if (!user) {
            setNotificaciones([]);
            setNoLeidas(0);
            return;
        }

        refresh();

        window.Echo.private(`App.Models.User.${user.id}`)
            .listen('NotificacionEnviada', (e) => {
                const nuevaNotificacion = e.notificacion || e;
                setNotificaciones(prev => [nuevaNotificacion, ...prev]);
                setNoLeidas(prev => prev + 1);
                reproducirSonido();
            });

        return () => {
            window.Echo.leave(`App.Models.User.${user.id}`);
        };
    }, [user, refresh, reproducirSonido]);

    return (
        <NotificacionContext.Provider value={{
            notificaciones, noLeidas, cargando,
            handleMarcarLeida, handleMarcarTodas, refresh
        }}>
            {children}
        </NotificacionContext.Provider>
    );
};

export const useNotificacionesGlobal = () => useContext(NotificacionContext);