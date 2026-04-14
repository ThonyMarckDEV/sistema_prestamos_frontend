import { useState, useEffect, useCallback } from 'react';
import { desembolsar, cobrarCuota } from 'services/operacionService';
import { show as getPrestamoDetails } from 'services/prestamoService';
import { getMiSesion, abrirCaja, cerrarCaja } from 'services/cajaSesionService'; 
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const [loading, setLoading] = useState(true);
    const [sesionActiva, setSesionActiva] = useState(undefined); 
    const [alert, setAlert] = useState(null);
    
    const [tipoOperacion, setTipoOperacion] = useState('cobro'); 
    const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
    const [prestamoDetalle, setPrestamoDetalle] = useState(null);

    const [isPagoModalOpen, setIsPagoModalOpen] = useState(false);
    const [cuotaSeleccionada, setCuotaSeleccionada] = useState(null);
    
    const [isAbrirModalOpen, setIsAbrirModalOpen] = useState(false);
    const [isCerrarModalOpen, setIsCerrarModalOpen] = useState(false);

    // 🔥 Estados para el PDF (ahora guardamos el base64 directo)
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfTitle, setPdfTitle] = useState('');
    const [pdfBase64, setPdfBase64] = useState(null);

    const verifySesion = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getMiSesion();
            if (res && res.data && res.data.id) {
                setSesionActiva(res.data);
            } else {
                setSesionActiva(null);
            }
        } catch (err) {
            setSesionActiva(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { 
        verifySesion(); 
    }, [verifySesion]);

    const handleAbrirSesion = async (data) => {
        setLoading(true);
        try {
            await abrirCaja(data);
            setAlert({ type: 'success', message: '¡Turno aperturado exitosamente!' });
            setIsAbrirModalOpen(false);
            verifySesion();
        } catch (err) {
            setAlert(handleApiError(err));
            setLoading(false);
        }
    };

    const handleCerrarSesion = async (data) => {
        setLoading(true);
        try {
            await cerrarCaja(sesionActiva.id, data);
            setAlert({ type: 'success', message: 'Turno cerrado y arqueo registrado.' });
            setIsCerrarModalOpen(false);
            setPrestamoSeleccionado(null);
            setPrestamoDetalle(null);
            verifySesion();
        } catch (err) {
            setAlert(handleApiError(err));
            setLoading(false);
        }
    };

    const handleSelectPrestamo = useCallback(async (prestamo) => {
        setPrestamoSeleccionado(prestamo);
        setPrestamoDetalle(null);
        if (prestamo && tipoOperacion === 'cobro') {
            setLoading(true);
            try {
                const res = await getPrestamoDetails(prestamo.id);
                setPrestamoDetalle(res.data || res);
            } catch (err) {
                setAlert(handleApiError(err, "No se pudo cargar el cronograma."));
            } finally {
                setLoading(false);
            }
        }
    }, [tipoOperacion]);

    const handleDesembolsar = async () => {
        setLoading(true);
        try {
            const response = await desembolsar(prestamoSeleccionado.id);
            setAlert({ type: 'success', message: 'Desembolso registrado con éxito.' });
            setPrestamoSeleccionado(null);
            verifySesion(); 
            
            if (response.data && response.data.pdf) {
                setPdfBase64(response.data.pdf);
                setPdfTitle('Voucher de Desembolso');
                setIsPdfModalOpen(true);
            }
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const openPagoModal = (cuota) => {
        setCuotaSeleccionada(cuota);
        setIsPagoModalOpen(true);
    };

    const handleConfirmarPago = async (pagoData) => {
        setLoading(true);
        try {
            const response = await cobrarCuota({ cuota_id: cuotaSeleccionada.id, ...pagoData });
            setAlert({ type: 'success', message: '¡Pago registrado exitosamente!' });
            setIsPagoModalOpen(false);
            
            if (prestamoSeleccionado) {
                handleSelectPrestamo(prestamoSeleccionado);
            }
            verifySesion(); 

            if (response.data && response.data.pdf) {
                setPdfBase64(response.data.pdf);
                setPdfTitle('Recibo de Pago de Cuota');
                setIsPdfModalOpen(true);
            }
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return {
        loading, sesionActiva, alert, setAlert,
        tipoOperacion, setTipoOperacion,
        prestamoSeleccionado, handleSelectPrestamo, prestamoDetalle, handleDesembolsar,
        isPagoModalOpen, setIsPagoModalOpen, cuotaSeleccionada, openPagoModal, handleConfirmarPago,
        isAbrirModalOpen, setIsAbrirModalOpen,
        isCerrarModalOpen, setIsCerrarModalOpen,
        handleAbrirSesion, handleCerrarSesion,
        isPdfModalOpen, setIsPdfModalOpen, pdfTitle, pdfBase64 
    };
};