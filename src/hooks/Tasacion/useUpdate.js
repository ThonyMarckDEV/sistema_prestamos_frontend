import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/tasacionService';
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

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);     // carga inicial de la tasación
    const [guardando, setGuardando] = useState(false); // submit de "Guardar cambios"
    const [alert, setAlert] = useState(null);

    const [porcentajePrestamo, setPorcentajePrestamo] = useState(70);
    const [cliente, setCliente] = useState(null);
    const [fechaTasacion, setFechaTasacion] = useState(null); // se precarga del show(); TasacionRequest la exige required
    const [detalles, setDetalles] = useState([]);
    const [detalleActual, setDetalleActual] = useState(vacioDetalle());
    const [editandoId, setEditandoId] = useState(null);
    const [montoAnteriorEdicion, setMontoAnteriorEdicion] = useState(null);
    const [showCancelarModal, setShowCancelarModal] = useState(false);

    // ── Cargar tasación existente ────────────────────────────────────────────
    useEffect(() => {
        const cargar = async () => {
            setLoading(true);
            try {
                const response = await show(id);
                const data = response.data || response;

                // El backend bloquea la edición si estado === CONVERTIDA (3),
                // pero lo cortamos acá también para no dejar al tasador llenar
                // el formulario entero y recién enterarse al guardar.
                if (data.estado === 3) {
                    setAlert({ type: 'error', message: 'Esta tasación ya fue convertida en préstamo y no se puede editar.' });
                    setLoading(false);
                    return;
                }

                setFechaTasacion(data.fecha_tasacion);

                setCliente(data.cliente ? {
                    id: data.cliente.id,
                    nombre_completo: data.cliente.nombre_completo,
                    documento: data.cliente.documento,
                } : null);

                // Confirmado con la respuesta real del backend: las relaciones
                // vienen en snake_case (tipo_joya / subtipo_joya), no camelCase.
                setDetalles((data.detalles || []).map(d => ({
                    id: d.id, // id real del tasacion_detalle — se manda igual en el payload de update, no se usa para nada especial
                    tipo_joya: d.tipo_joya ? { id: d.tipo_joya.id, descripcion: d.tipo_joya.descripcion } : null,
                    subtipo_joya: d.subtipo_joya ? { id: d.subtipo_joya.id, descripcion: d.subtipo_joya.descripcion } : null,
                    descripcion_detallada: d.descripcion_detallada || '',
                    peso_bruto: d.peso_bruto,
                    peso_incrustacion: d.peso_incrustacion,
                    peso_neto: d.peso_neto,
                    kilates: d.kilates || '',
                    valor_tasado: d.valor_tasado,
                    maximo_prestar: d.maximo_prestar,
                })));
            } catch (err) {
                setAlert(handleApiError(err, 'No se pudo cargar la tasación.'));
            } finally {
                setLoading(false);
            }
        };
        if (id) cargar();
    }, [id]);

    // ── Cliente ──────────────────────────────────────────────────────────────
    const handleSeleccionarCliente = (clienteSeleccionado) => {
        setCliente(clienteSeleccionado);
    };

    const handleCambiarCliente = () => {
        setCliente(null);
        setDetalles([]);
    };

    // "Cancelar" en edición navega de vuelta sin guardar — no tiene sentido
    // vaciar los campos en pantalla como en Store, porque no hay nada nuevo
    // que "descartar en memoria": lo que se pierde son los cambios hechos
    // sobre datos que ya existían en el backend.
    const handleCancelarEdicionTasacion = () => {
        setShowCancelarModal(false);
        navigate('/tasacion/listar');
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
                id: `nueva-${Date.now()}`, // joya agregada en esta edición, aún no existe en la BD
                peso_neto: pesoNeto,
                maximo_prestar: maximoFinal,
            }]);
            setAlert(null);
        }

        setDetalleActual(vacioDetalle());
    };

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
        if (editandoId === id) handleCancelarEdicion();
    };

    // ── Totales ───────────────────────────────────────────────────────────────
    const totalTasacion = round(detalles.reduce((acc, d) => acc + parseFloat(d.valor_tasado || 0), 0));
    const totalMaximoPrestar = round(detalles.reduce((acc, d) => acc + parseFloat(d.maximo_prestar || 0), 0));

    const formularioTieneDatos = !!(
        detalleActual.tipo_joya || detalleActual.subtipo_joya ||
        detalleActual.descripcion_detallada || detalleActual.peso_bruto ||
        (detalleActual.peso_incrustacion && detalleActual.peso_incrustacion !== '0') ||
        detalleActual.kilates || detalleActual.valor_tasado || detalleActual.maximo_prestar
    );

    // ── Guardar cambios ──────────────────────────────────────────────────────
    const handleGuardarCambios = async () => {
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

        // El backend reemplaza TODOS los detalles al hacer update (borra y
        // vuelve a crear, ver TasacionController::update service) — por eso
        // no importa distinguir "id real" vs "nueva-<timestamp>" acá, el
        // payload manda solo los datos, nunca el id del detalle.
        const payload = {
            cliente_id: cliente.id,
            fecha_tasacion: fechaTasacion,
            porcentaje_prestamo_aplicado: porcentajeNum,
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
            await update(id, payload);
            setAlert({ type: 'success', message: `Tasación actualizada exitosamente. Total máx. a prestar: S/ ${fmt(totalMaximoPrestar)}. Redirigiendo...` });
            setTimeout(() => navigate('/tasacion/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar la tasación.'));
        } finally {
            setGuardando(false);
        }
    };

    return {
        loading,

        cliente, handleSeleccionarCliente, handleCambiarCliente,

        detalles, detalleActual, setDetalleActual, editandoId, montoAnteriorEdicion,
        pesoNeto, valorTasadoNum, porcentajeNum, maximoSugerido, formularioTieneDatos,
        handleAgregarDetalle, handleEditarDetalle, handleCancelarEdicion, handleEliminarDetalle,

        porcentajePrestamo, setPorcentajePrestamo,

        totalTasacion, totalMaximoPrestar, handleGuardarCambios, guardando,
        showCancelarModal, setShowCancelarModal, handleCancelarEdicionTasacion,

        alert, setAlert,
    };
};