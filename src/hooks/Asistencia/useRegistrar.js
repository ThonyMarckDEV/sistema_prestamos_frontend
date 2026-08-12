import { useState, useCallback, useRef } from 'react';
import { registrar } from 'services/asistenciaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { Html5Qrcode } from 'html5-qrcode';

export const useRegistrar = (scannerId) => {
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [resultado, setResultado] = useState(null);
    const [camaraError, setCamaraError] = useState(false);

    const scannerRef = useRef(null);
    const isRunningRef = useRef(false);
    const yaEscaneadoRef = useRef(false);

    const enviarQr = useCallback(async (contenidoQr) => {
        if (!contenidoQr?.trim() || loading) return;

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

        } catch (err) {
            setAlert(handleApiError(err, 'No se pudo registrar la asistencia.'));
            // Si falla, le damos 2 segundos antes de permitir que vuelva a escanear
            setTimeout(() => {
                yaEscaneadoRef.current = false;
            }, 2000);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    const iniciarCamara = useCallback(() => {
        setCamaraError(false);
        yaEscaneadoRef.current = false;
        isRunningRef.current = false;

        const scanner = new Html5Qrcode(scannerId);
        scannerRef.current = scanner;

        scanner.start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
                if (yaEscaneadoRef.current) return;
                yaEscaneadoRef.current = true; // Bloquea múltiples lecturas en el mismo segundo
                enviarQr(decodedText);
            },
            () => { /* frame sin QR, ignorado silenciosamente */ }
        )
        .then(() => {
            isRunningRef.current = true;
        })
        .catch(() => {
            setCamaraError(true);
        });

    }, [scannerId, enviarQr]);

    const detenerCamara = useCallback(() => {
        if (isRunningRef.current && scannerRef.current) {
            scannerRef.current
                .stop()
                .then(() => scannerRef.current.clear())
                .catch(() => {})
                .finally(() => {
                    isRunningRef.current = false;
                });
        }
    }, []);

    // Resetea el bloqueo de lectura cuando se cierra el alert de éxito
    const resetearEscaneo = () => {
        setAlert(null);
        setResultado(null);
        yaEscaneadoRef.current = false;
    };

    return { 
        loading, 
        alert, 
        resultado, 
        camaraError, 
        iniciarCamara, 
        detenerCamara,
        resetearEscaneo 
    };
};