import { useState, useCallback, useRef } from 'react';
import { registrar } from 'services/asistenciaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useRegistrar = () => {
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [resultado, setResultado] = useState(null);

    // Candado de ráfaga: evita que el mismo código se envíe 5 veces en 1 segundo
    const yaEscaneadoRef = useRef(false);

    const handleQrScan = useCallback(async (contenidoQr) => {
        // Si está procesando o el candado está cerrado, ignora la lectura
        if (!contenidoQr?.trim() || loading || yaEscaneadoRef.current) return;

        // Cierra el candado inmediatamente
        yaEscaneadoRef.current = true;
        setAlert(null);
        setResultado(null);
        setLoading(true);

        try {
            const response = await registrar(contenidoQr.trim());

            setResultado(response.data);
            setAlert({
                type: 'success',
                message: response.message || 'Asistencia registrada correctamente.'
            });

            // MODO RÁFAGA: Desbloquea la cámara en 800ms para el siguiente asesor
            setTimeout(() => {
                yaEscaneadoRef.current = false;
            }, 800);

        } catch (err) {
            setAlert(handleApiError(err, 'No se pudo registrar la asistencia.'));
            
            // Si hay error (código falso/incorrecto), también soltamos rápido
            setTimeout(() => {
                yaEscaneadoRef.current = false;
            }, 800);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    const resetearEscaneo = () => {
        setAlert(null);
        setResultado(null);
        yaEscaneadoRef.current = false; // Permite forzar el desbloqueo manual
    };

    return { 
        loading, 
        alert, 
        resultado, 
        handleQrScan, 
        resetearEscaneo 
    };
};