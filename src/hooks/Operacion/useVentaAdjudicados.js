import { useState, useEffect, useCallback } from 'react';
import { index as listarLotes, show as verLote } from 'services/garantiaPrendariaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useVentaAdjudicados = () => {
    const [lotes, setLotes]     = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert]     = useState(null);

    const [loteDetalle, setLoteDetalle]       = useState(null);
    const [loadingDetalle, setLoadingDetalle] = useState(false);
    const [modalLoteOpen, setModalLoteOpen]   = useState(false);

    const [carrito, setCarrito] = useState([]); // [{ lote, cantidad_piezas, valor_total }]

    const [clienteGenerico, setClienteGenerico] = useState(true);
    const [clienteNombre, setClienteNombre]     = useState('');
    const [metodoPago, setMetodoPago]           = useState('efectivo'); // 'efectivo' | 'transferencia'

    const cargarLotes = useCallback(async () => {
        setLoading(true);
        try {
            const res = await listarLotes();
            setLotes(res.data ?? res ?? []);
        } catch (err) {
            setAlert(handleApiError(err, 'No se pudieron cargar los lotes adjudicados.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { cargarLotes(); }, [cargarLotes]);

    const abrirDetalleLote = async (lote) => {
        setModalLoteOpen(true);
        setLoadingDetalle(true);
        try {
            const res = await verLote(lote);
            setLoteDetalle(res.data ?? res);
        } catch (err) {
            setAlert(handleApiError(err, 'No se pudo cargar el detalle del lote.'));
            setModalLoteOpen(false);
        } finally {
            setLoadingDetalle(false);
        }
    };

    const cerrarDetalleLote = () => {
        setModalLoteOpen(false);
        setLoteDetalle(null);
    };

    const enCarrito = (lote) => carrito.some(c => c.lote === lote);

        const agregarAlCarrito = (loteConPrecio) => {
        if (enCarrito(loteConPrecio.lote)) return;
        // precio_venta es lo que el cajero fijó en el modal (puede diferir
        // del valor_total tasado) — es lo que se cobra realmente.
        setCarrito(prev => [...prev, {
            lote: loteConPrecio.lote,
            cantidad_piezas: loteConPrecio.cantidad_piezas ?? loteConPrecio.piezas?.length ?? 1,
            valor_tasado: loteConPrecio.valor_total,
            precio_venta: loteConPrecio.precio_venta ?? loteConPrecio.valor_total,
        }]);
    };

    const quitarDelCarrito = (lote) => {
        setCarrito(prev => prev.filter(c => c.lote !== lote));
    };

    const vaciarCarrito = () => setCarrito([]);

     const totalCarrito = carrito.reduce((acc, c) => acc + parseFloat(c.precio_venta ?? c.valor_total ?? 0), 0);

    // Lógica de venta pendiente — a propósito. Esto solo deja el flujo de
    // UI listo (carrito + cliente + método de pago); el submit real al
    // backend se implementa después.
    const procesarVenta = () => {
        setAlert({
            type: 'info',
            message: 'La lógica de venta todavía no está implementada — esto es solo la interfaz.',
        });
    };

    return {
        lotes, loading, alert, setAlert, cargarLotes,
        loteDetalle, loadingDetalle, modalLoteOpen, abrirDetalleLote, cerrarDetalleLote,
        carrito, enCarrito, agregarAlCarrito, quitarDelCarrito, vaciarCarrito, totalCarrito,
        clienteGenerico, setClienteGenerico, clienteNombre, setClienteNombre,
        metodoPago, setMetodoPago,
        procesarVenta,
    };
};