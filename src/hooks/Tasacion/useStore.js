import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/tasacionService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const round = (n) => Math.round(n * 100) / 100;
const fmt = (n) => parseFloat(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });

const vacioDetalle = () => ({
    tipo_joya: null,
    subtipo_joya: null,
    descripcion_detallada: '',
    peso_bruto: '',
    peso_incrustacion: '0',
    kilates: '',
    valor_tasado: '',
    maximo_prestar: '',
});

export const useStore = () => {
    const navigate = useNavigate();

    // % de préstamo sobre el valor tasado — lo define el tasador/jefe en cada
    // tasación (varía según tipo de joya, kilates, política del día, etc.),
    // NO es una constante del sistema. Se guarda como entero (70 = 70%).
    const [porcentajePrestamo, setPorcentajePrestamo] = useState(70);

    // ── Paso 1: Cliente ──────────────────────────────────────────────────────
    // cliente = objeto que entrega ClienteSearchSelect al elegir una sugerencia
    // del combobox: { id, nombre_completo, documento, tipo, ... }.
    // OJO: confirmar con clienteService.combobox() si trae "celular" — si no,
    // habría que pedirlo aparte al seleccionar (o quitar esa línea de la tarjeta).
    // El tasador no registra clientes — solo selecciona uno ya existente.
    const [cliente, setCliente] = useState(null);

    // ── Paso 2: Detalles de joyas ────────────────────────────────────────────
    const [detalles, setDetalles] = useState([]);
    const [detalleActual, setDetalleActual] = useState(vacioDetalle());
    const [editandoId, setEditandoId] = useState(null); // id del detalle en edición, null = modo "agregar nuevo"
    const [montoAnteriorEdicion, setMontoAnteriorEdicion] = useState(null); // solo referencial, no se usa en el cálculo
    const [showCancelarModal, setShowCancelarModal] = useState(false);
    const [alert, setAlert] = useState(null);

    // guardando = loading del submit final (separado de cualquier loading de
    // combobox/búsqueda de cliente, que manejan sus propios componentes)
    const [guardando, setGuardando] = useState(false);

    // ── Cliente ──────────────────────────────────────────────────────────────
    const handleSeleccionarCliente = (clienteSeleccionado) => {
        setCliente(clienteSeleccionado);
    };

    const handleCambiarCliente = () => {
        setCliente(null);
        setDetalles([]);
    };

    /**
     * Cancela toda la tasación: resetea cliente, joyas agregadas y el
     * formulario en edición. El modal de confirmación ya validó la intención,
     * así que aquí solo se limpia todo de una.
     */
    const handleCancelarTasacion = () => {
        setCliente(null);
        setDetalles([]);
        setDetalleActual(vacioDetalle());
        setEditandoId(null);
        setMontoAnteriorEdicion(null);
        setShowCancelarModal(false);
        setAlert(null);
    };

    // ── Cálculo automático de la joya en edición ────────────────────────────
    const pesoBrutoNum = parseFloat(detalleActual.peso_bruto) || 0;
    const pesoIncrustNum = parseFloat(detalleActual.peso_incrustacion) || 0;
    const pesoNeto = Math.max(0, round(pesoBrutoNum - pesoIncrustNum));
    const valorTasadoNum = parseFloat(detalleActual.valor_tasado) || 0;
    const porcentajeNum = parseFloat(porcentajePrestamo) || 0;
    const maximoSugerido = round(valorTasadoNum * (porcentajeNum / 100));

    const handleAgregarDetalle = () => {
        if (!detalleActual.tipo_joya || !detalleActual.subtipo_joya) {
            setAlert({ type: 'error', message: 'Selecciona tipo y subtipo de joya.' });
            return;
        }
        if (pesoBrutoNum <= 0) {
            setAlert({ type: 'error', message: 'El peso bruto debe ser mayor a 0.' });
            return;
        }
        if (valorTasadoNum <= 0) {
            setAlert({ type: 'error', message: 'Ingresa el valor tasado de la joya.' });
            return;
        }

        const maximoFinal = detalleActual.maximo_prestar
            ? parseFloat(detalleActual.maximo_prestar)
            : maximoSugerido;

        if (editandoId) {
            // Actualiza el detalle existente en su misma posición
            setDetalles(prev => prev.map(d => d.id === editandoId
                ? { ...detalleActual, id: editandoId, peso_neto: pesoNeto, maximo_prestar: maximoFinal }
                : d
            ));
            setEditandoId(null);
            setMontoAnteriorEdicion(null);
            setAlert({ type: 'success', message: 'Joya actualizada.' });
        } else {
            setDetalles(prev => [...prev, {
                ...detalleActual,
                id: Date.now(), // solo para key en el MVP — se descarta al armar el payload
                peso_neto: pesoNeto,
                maximo_prestar: maximoFinal,
            }]);
            setAlert(null);
        }

        setDetalleActual(vacioDetalle());
    };

    /**
     * Carga una joya existente al formulario para editarla.
     * OJO: maximo_prestar se deja vacío a propósito (no se precarga el valor
     * guardado) — así el campo vuelve a seguir el % global en vivo (vía
     * placeholder/maximoSugerido) en lugar de quedar "congelado" en el monto
     * fijo que tenía al momento de agregarla. Si el usuario sube/baja el %
     * mientras edita, el sugerido se actualiza solo. Si quiere un monto
     * distinto al sugerido, lo escribe manualmente como en modo "agregar".
     */
    const handleEditarDetalle = (detalle) => {
        setDetalleActual({
            tipo_joya: detalle.tipo_joya,
            subtipo_joya: detalle.subtipo_joya,
            descripcion_detallada: detalle.descripcion_detallada,
            peso_bruto: detalle.peso_bruto,
            peso_incrustacion: detalle.peso_incrustacion,
            kilates: detalle.kilates,
            valor_tasado: detalle.valor_tasado,
            maximo_prestar: '',
        });
        setEditandoId(detalle.id);
        setMontoAnteriorEdicion(parseFloat(detalle.maximo_prestar) || 0);
        setAlert(null);
    };

    const handleCancelarEdicion = () => {
        setDetalleActual(vacioDetalle());
        setEditandoId(null);
        setMontoAnteriorEdicion(null);
    };

    const handleEliminarDetalle = (id) => {
        setDetalles(prev => prev.filter(d => d.id !== id));
        // si estabas editando justo la que borraste, limpia el formulario
        if (editandoId === id) handleCancelarEdicion();
    };

    // ── Totales ───────────────────────────────────────────────────────────────
    const totalTasacion = round(detalles.reduce((acc, d) => acc + parseFloat(d.valor_tasado || 0), 0));
    const totalMaximoPrestar = round(detalles.reduce((acc, d) => acc + parseFloat(d.maximo_prestar || 0), 0));

    // true si el formulario de la joya actual tiene algo escrito (para saber si mostrar "Limpiar")
    const formularioTieneDatos = !!(
        detalleActual.tipo_joya || detalleActual.subtipo_joya ||
        detalleActual.descripcion_detallada || detalleActual.peso_bruto ||
        (detalleActual.peso_incrustacion && detalleActual.peso_incrustacion !== '0') ||
        detalleActual.kilates || detalleActual.valor_tasado || detalleActual.maximo_prestar
    );

    // ── Guardar tasación ─────────────────────────────────────────────────────
    const handleGuardarTasacion = async () => {
        if (editandoId) {
            setAlert({ type: 'error', message: 'Termina o cancela la edición de la joya antes de guardar.' });
            return;
        }
        if (!cliente) {
            setAlert({ type: 'error', message: 'Debes seleccionar un cliente.' });
            return;
        }
        if (detalles.length === 0) {
            setAlert({ type: 'error', message: 'Agrega al menos una joya a la tasación.' });
            return;
        }

        const payload = {
            cliente_id: cliente.id,
            fecha_tasacion: new Date().toISOString().split('T')[0],
            porcentaje_prestamo_aplicado: porcentajeNum, // referencial — cada detalle ya trae su maximo_prestar final
            total_tasacion: totalTasacion,
            total_maximo_prestar: totalMaximoPrestar,
            detalles: detalles.map(d => ({
                tipo_joya_id: d.tipo_joya?.id,
                subtipo_joya_id: d.subtipo_joya?.id,
                descripcion_detallada: d.descripcion_detallada,
                peso_bruto: d.peso_bruto,
                peso_incrustacion: d.peso_incrustacion,
                peso_neto: d.peso_neto,
                kilates: d.kilates,
                valor_tasado: d.valor_tasado,
                maximo_prestar: d.maximo_prestar,
            })),
        };

        setAlert(null);
        setGuardando(true);
        try {
            await store(payload);
            setAlert({ type: 'success', message: `Tasación guardada exitosamente. Total máx. a prestar: S/ ${fmt(totalMaximoPrestar)}. Redirigiendo...` });
            setTimeout(() => navigate('/tasacion/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al guardar la tasación.'));
        } finally {
            setGuardando(false);
        }
    };

    return {
        // cliente
        cliente, handleSeleccionarCliente, handleCambiarCliente,

        // joya actual / detalles
        detalles, detalleActual, setDetalleActual, editandoId, montoAnteriorEdicion,
        pesoNeto, valorTasadoNum, porcentajeNum, maximoSugerido, formularioTieneDatos,
        handleAgregarDetalle, handleEditarDetalle, handleCancelarEdicion, handleEliminarDetalle,

        // % préstamo
        porcentajePrestamo, setPorcentajePrestamo,

        // totales / guardar / cancelar tasación
        totalTasacion, totalMaximoPrestar, handleGuardarTasacion, guardando,
        showCancelarModal, setShowCancelarModal, handleCancelarTasacion,

        // alertas
        alert, setAlert,
    };
};