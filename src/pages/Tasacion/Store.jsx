import React, { useState } from 'react';
import {
    ScaleIcon, UserIcon, MagnifyingGlassIcon, PlusIcon, TrashIcon,
    CheckCircleIcon, XCircleIcon, SparklesIcon, BanknotesIcon, AdjustmentsHorizontalIcon,
    PencilSquareIcon, XMarkIcon
} from '@heroicons/react/24/outline';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import TipoJoyaSearchSelect from 'components/Shared/Comboboxes/TipoJoyaSearchSelect';
import SubtipoJoyaSearchSelect from 'components/Shared/Comboboxes/SubtipoJoyaSearchSelect';

// ── Mock de "clientes existentes" solo para simular la búsqueda ─────────────
const CLIENTES_MOCK = [
    { id: 12, dni: '45678912', nombre_completo: 'MARIA ELENA QUISPE TORRES', celular: '987654321' },
];

const TasacionStore = () => {
    // % de préstamo sobre el valor tasado — lo define el tasador/jefe en cada
    // tasación (varía según tipo de joya, kilates, política del día, etc.),
    // NO es una constante del sistema. Se guarda como entero (70 = 70%).
    const [porcentajePrestamo, setPorcentajePrestamo] = useState(70);

    // ── Paso 1: Cliente ──────────────────────────────────────────────────────
    const [dniBusqueda, setDniBusqueda] = useState('');
    const [cliente, setCliente] = useState(null);
    const [buscando, setBuscando] = useState(false);
    const [clienteNoEncontrado, setClienteNoEncontrado] = useState(false);
    const [registroRapido, setRegistroRapido] = useState({ dni: '', nombre_completo: '', celular: '' });

    // ── Paso 2: Detalles de joyas ────────────────────────────────────────────
    const [detalles, setDetalles] = useState([]);
    const [detalleActual, setDetalleActual] = useState(vacioDetalle());
    const [editandoId, setEditandoId] = useState(null); // id del detalle en edición, null = modo "agregar nuevo"
    const [montoAnteriorEdicion, setMontoAnteriorEdicion] = useState(null); // solo referencial, no se usa en el cálculo
    const [showCancelarModal, setShowCancelarModal] = useState(false);
    const [alert, setAlert] = useState(null);

    function vacioDetalle() {
        return {
            tipo_joya: null,
            subtipo_joya: null,
            descripcion_detallada: '',
            peso_bruto: '',
            peso_incrustacion: '0',
            kilates: '',
            valor_tasado: '',
            maximo_prestar: '',
        };
    }

    // ── Buscar cliente ───────────────────────────────────────────────────────
    const handleBuscarCliente = () => {
        if (!dniBusqueda.trim()) return;
        setBuscando(true);
        setClienteNoEncontrado(false);
        setCliente(null);

        // simulación de llamada — luego será clienteService.buscarPorDni(dniBusqueda)
        setTimeout(() => {
            const encontrado = CLIENTES_MOCK.find(c => c.dni === dniBusqueda.trim());
            if (encontrado) {
                setCliente(encontrado);
            } else {
                setClienteNoEncontrado(true);
                setRegistroRapido({ dni: dniBusqueda.trim(), nombre_completo: '', celular: '' });
            }
            setBuscando(false);
        }, 500);
    };

    const handleRegistrarRapido = () => {
        if (!registroRapido.nombre_completo.trim()) {
            setAlert({ type: 'error', message: 'Ingresa el nombre completo del cliente.' });
            return;
        }
        // simulación — luego será clienteService.storeRapido(registroRapido)
        const nuevoCliente = {
            id: Math.floor(Math.random() * 1000) + 100,
            dni: registroRapido.dni,
            nombre_completo: registroRapido.nombre_completo.toUpperCase(),
            celular: registroRapido.celular,
        };
        setCliente(nuevoCliente);
        setClienteNoEncontrado(false);
        setAlert({ type: 'success', message: 'Cliente registrado. Ya puedes tasar sus joyas.' });
    };

    const handleCambiarCliente = () => {
        setCliente(null);
        setDniBusqueda('');
        setClienteNoEncontrado(false);
        setDetalles([]);
    };

    /**
     * Cancela toda la tasación: resetea cliente, joyas agregadas y el
     * formulario en edición. El modal de confirmación ya validó la intención,
     * así que aquí solo se limpia todo de una.
     */
    const handleCancelarTasacion = () => {
        setCliente(null);
        setDniBusqueda('');
        setClienteNoEncontrado(false);
        setRegistroRapido({ dni: '', nombre_completo: '', celular: '' });
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
                id: Date.now(), // solo para key en el MVP
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

    // ── Guardar tasación (mock) ──────────────────────────────────────────────
    // true si el formulario de la joya actual tiene algo escrito (para saber si mostrar "Limpiar")
    const formularioTieneDatos = !!(
        detalleActual.tipo_joya || detalleActual.subtipo_joya ||
        detalleActual.descripcion_detallada || detalleActual.peso_bruto ||
        (detalleActual.peso_incrustacion && detalleActual.peso_incrustacion !== '0') ||
        detalleActual.kilates || detalleActual.valor_tasado || detalleActual.maximo_prestar
    );

    const handleGuardarTasacion = () => {
        if (editandoId) {
            setAlert({ type: 'error', message: 'Termina o cancela la edición de la joya antes de guardar.' });
            return;
        }
        if (!cliente) {
            setAlert({ type: 'error', message: 'Debes seleccionar o registrar un cliente.' });
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

        console.log('Payload tasación (mock):', payload);
        setAlert({ type: 'success', message: `Tasación guardada (simulada). Revisa la consola. Total máx. a prestar: S/ ${fmt(totalMaximoPrestar)}` });
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 transition-colors">
            <PageHeader
                title="Nueva Tasación"
                icon={ScaleIcon}
                buttonText="← Volver al listado"
                buttonLink="/tasacion/listar"
            />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            {/* ── PASO 1: CLIENTE ─────────────────────────────────────────────── */}
            <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-2xl shadow-sm dark:shadow-black/25 border border-slate-100 dark:border-dark-border transition-colors mt-4">
                <h3 className="text-base font-black text-slate-800 dark:text-dark-text flex items-center gap-2 mb-6 uppercase tracking-wide border-b border-slate-100 dark:border-dark-border pb-3 transition-colors">
                    <UserIcon className="w-6 h-6 text-brand-red dark:text-brand-gold" /> 1. Cliente
                </h3>

                {!cliente ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3.5 text-slate-400 dark:text-dark-text-muted" />
                                <input
                                    type="text"
                                    value={dniBusqueda}
                                    onChange={(e) => setDniBusqueda(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleBuscarCliente()}
                                    placeholder="Buscar cliente por DNI..."
                                    className="w-full pl-10 p-3.5 text-sm font-bold text-slate-800 dark:text-dark-text bg-slate-50 dark:bg-dark-surface-alt border border-slate-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-brand-red dark:focus:ring-brand-gold outline-none transition-all"
                                />
                            </div>
                            <button
                                onClick={handleBuscarCliente}
                                disabled={buscando}
                                className="bg-brand-red dark:bg-brand-red-glow text-white px-6 py-3.5 rounded-xl font-black uppercase text-sm shadow-lg shadow-brand-red/20 hover:bg-brand-red-dark dark:hover:brightness-110 transition-all disabled:opacity-50"
                            >
                                {buscando ? 'Buscando...' : 'Buscar'}
                            </button>
                        </div>

                        {clienteNoEncontrado && (
                            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-5">
                                <p className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase mb-4 flex items-center gap-2">
                                    <XCircleIcon className="w-4 h-4" /> Cliente no encontrado — registro rápido
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <input
                                        type="text"
                                        value={registroRapido.dni}
                                        onChange={(e) => setRegistroRapido(p => ({ ...p, dni: e.target.value }))}
                                        placeholder="DNI"
                                        className="p-3 text-sm font-bold bg-white dark:bg-dark-surface-alt border border-slate-200 dark:border-dark-border rounded-lg outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={registroRapido.nombre_completo}
                                        onChange={(e) => setRegistroRapido(p => ({ ...p, nombre_completo: e.target.value }))}
                                        placeholder="Nombre completo"
                                        className="p-3 text-sm font-bold bg-white dark:bg-dark-surface-alt border border-slate-200 dark:border-dark-border rounded-lg outline-none sm:col-span-1"
                                    />
                                    <input
                                        type="text"
                                        value={registroRapido.celular}
                                        onChange={(e) => setRegistroRapido(p => ({ ...p, celular: e.target.value }))}
                                        placeholder="Celular"
                                        className="p-3 text-sm font-bold bg-white dark:bg-dark-surface-alt border border-slate-200 dark:border-dark-border rounded-lg outline-none"
                                    />
                                </div>
                                <button
                                    onClick={handleRegistrarRapido}
                                    className="mt-4 bg-amber-500 text-white px-6 py-2.5 rounded-lg font-black uppercase text-xs hover:bg-amber-600 transition-colors"
                                >
                                    Registrar y continuar
                                </button>
                                <p className="text-[10px] text-amber-600 dark:text-amber-400/70 mt-2 uppercase">
                                    Ficha completa (dirección, empleo, cuentas) se completa después en el módulo Cliente.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <CheckCircleIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            <div>
                                <p className="font-black text-slate-800 dark:text-dark-text text-sm">{cliente.nombre_completo}</p>
                                <p className="text-xs text-slate-500 dark:text-dark-text-muted">DNI: {cliente.dni} {cliente.celular && `· ${cliente.celular}`}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleCambiarCliente}
                            className="text-xs font-black text-slate-400 dark:text-dark-text-muted hover:text-brand-red dark:hover:text-brand-gold uppercase transition-colors"
                        >
                            Cambiar
                        </button>
                    </div>
                )}
            </div>

            {/* ── PASO 2: TASACIÓN DE JOYAS ───────────────────────────────────── */}
            <div className={`bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-2xl shadow-sm dark:shadow-black/25 border border-slate-100 dark:border-dark-border transition-colors mt-6 ${!cliente ? 'opacity-40 pointer-events-none' : ''}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 dark:border-dark-border pb-3">
                    <h3 className="text-base font-black text-slate-800 dark:text-dark-text flex items-center gap-2 uppercase tracking-wide transition-colors">
                        <SparklesIcon className="w-6 h-6 text-brand-red dark:text-brand-gold" /> 2. Tasación de joyas
                        {editandoId && (
                            <span className="text-[10px] font-black bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md uppercase tracking-widest normal-case">
                                Editando joya
                            </span>
                        )}
                    </h3>

                    {/* % de préstamo — configurable por el tasador/jefe, aplica a todas
                        las joyas que se agreguen mientras esté en este valor */}
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-dark-surface-alt border border-slate-200 dark:border-dark-border rounded-xl px-4 py-2">
                        <AdjustmentsHorizontalIcon className="w-4 h-4 text-slate-400 dark:text-dark-text-muted flex-shrink-0" />
                        <span className="text-[10px] font-black text-slate-500 dark:text-dark-text-muted uppercase whitespace-nowrap">% a prestar</span>
                        <input
                            type="number"
                            value={porcentajePrestamo}
                            onChange={(e) => setPorcentajePrestamo(e.target.value)}
                            min="0"
                            step="1"
                            className="w-16 bg-transparent text-sm font-black text-brand-red dark:text-brand-gold text-right outline-none"
                        />
                        <span className="text-sm font-black text-brand-red dark:text-brand-gold">%</span>
                    </div>
                </div>

                {porcentajeNum > 100 && (
                    <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase -mt-3 mb-4 flex items-center gap-1">
                        ⚠ Prestando por encima del valor tasado ({porcentajeNum}%) — verifica que sea intencional.
                    </p>
                )}

                {/* Formulario joya actual */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <TipoJoyaSearchSelect
                        onSelect={(t) => setDetalleActual(p => ({ ...p, tipo_joya: t }))}
                        initialName={detalleActual.tipo_joya?.descripcion || ''}
                    />
                    <SubtipoJoyaSearchSelect
                        onSelect={(s) => setDetalleActual(p => ({ ...p, subtipo_joya: s }))}
                        initialName={detalleActual.subtipo_joya?.descripcion || ''}
                    />
                    <input
                        type="text"
                        value={detalleActual.kilates}
                        onChange={(e) => setDetalleActual(p => ({ ...p, kilates: e.target.value }))}
                        placeholder="Kilates (ej. 18K)"
                        className="p-3.5 text-sm font-bold bg-slate-50 dark:bg-dark-surface-alt border border-slate-200 dark:border-dark-border rounded-xl outline-none focus:ring-2 focus:ring-brand-red dark:focus:ring-brand-gold"
                    />
                    <input
                        type="text"
                        value={detalleActual.descripcion_detallada}
                        onChange={(e) => setDetalleActual(p => ({ ...p, descripcion_detallada: e.target.value }))}
                        placeholder="Descripción (opcional)"
                        className="p-3.5 text-sm font-bold bg-slate-50 dark:bg-dark-surface-alt border border-slate-200 dark:border-dark-border rounded-xl outline-none focus:ring-2 focus:ring-brand-red dark:focus:ring-brand-gold"
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <CampoNumero label="Peso bruto (g)" value={detalleActual.peso_bruto}
                        onChange={(v) => setDetalleActual(p => ({ ...p, peso_bruto: v }))} />
                    <CampoNumero label="Peso incrustación (g)" value={detalleActual.peso_incrustacion}
                        onChange={(v) => setDetalleActual(p => ({ ...p, peso_incrustacion: v }))} />
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 dark:text-dark-text-muted uppercase mb-1.5">Peso neto (g)</label>
                        <div className="p-3.5 text-sm font-black bg-slate-100 dark:bg-dark-surface-alt/50 border border-slate-200 dark:border-dark-border rounded-xl text-slate-600 dark:text-dark-text-muted">
                            {fmt(pesoNeto)}
                        </div>
                    </div>
                    <CampoNumero label="Valor tasado (S/)" value={detalleActual.valor_tasado}
                        onChange={(v) => setDetalleActual(p => ({ ...p, valor_tasado: v }))} highlight />
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 dark:text-dark-text-muted uppercase mb-1.5">
                            Máx. a prestar (S/)
                        </label>
                        <input
                            type="number"
                            value={detalleActual.maximo_prestar}
                            onChange={(e) => setDetalleActual(p => ({ ...p, maximo_prestar: e.target.value }))}
                            placeholder={maximoSugerido > 0 ? fmt(maximoSugerido) : '0.00'}
                            className="w-full p-3.5 text-sm font-black text-brand-gold bg-slate-50 dark:bg-dark-surface-alt border border-brand-gold/30 rounded-xl outline-none focus:ring-2 focus:ring-brand-gold"
                        />
                        {valorTasadoNum > 0 && (
                            <p className="text-[10px] text-slate-400 dark:text-dark-text-muted mt-1">
                                Sugerido ({porcentajeNum}%): S/ {fmt(maximoSugerido)} — editable
                                {editandoId && montoAnteriorEdicion > 0 && (
                                    <span className="text-amber-500 dark:text-amber-400"> · Anterior: S/ {fmt(montoAnteriorEdicion)}</span>
                                )}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleAgregarDetalle}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black uppercase text-xs transition-colors ${
                            editandoId
                                ? 'bg-amber-500 text-white hover:bg-amber-600'
                                : 'bg-slate-800 dark:bg-dark-surface-alt text-white dark:text-brand-gold hover:bg-slate-900 dark:hover:bg-dark-border'
                        }`}
                    >
                        {editandoId
                            ? <><CheckCircleIcon className="w-4 h-4" /> Guardar cambios de la joya</>
                            : <><PlusIcon className="w-4 h-4" /> Agregar joya a la tasación</>
                        }
                    </button>
                    {editandoId && (
                        <button
                            onClick={handleCancelarEdicion}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl font-black uppercase text-xs text-slate-500 dark:text-dark-text-muted hover:text-brand-red dark:hover:text-red-400 transition-colors"
                        >
                            <XMarkIcon className="w-4 h-4" /> Cancelar
                        </button>
                    )}
                    {!editandoId && formularioTieneDatos && (
                        <button
                            onClick={handleCancelarEdicion}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl font-black uppercase text-xs text-slate-500 dark:text-dark-text-muted hover:text-brand-red dark:hover:text-red-400 transition-colors"
                        >
                            <XMarkIcon className="w-4 h-4" /> Limpiar
                        </button>
                    )}
                </div>

                {/* Tabla de joyas agregadas */}
                {detalles.length > 0 && (
                    <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-dark-border">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-dark-surface-alt text-[10px] font-black text-slate-500 dark:text-dark-text-muted uppercase">
                                    <th className="p-3 text-left">Joya</th>
                                    <th className="p-3 text-right">Peso neto</th>
                                    <th className="p-3 text-right">Valor tasado</th>
                                    <th className="p-3 text-right">Máx. prestar</th>
                                    <th className="p-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalles.map(d => (
                                    <tr key={d.id} className={`border-t border-slate-100 dark:border-dark-border transition-colors ${editandoId === d.id ? 'bg-amber-50 dark:bg-amber-500/10' : ''}`}>
                                        <td className="p-3">
                                            <p className="font-bold text-slate-800 dark:text-dark-text">{d.tipo_joya?.descripcion} · {d.subtipo_joya?.descripcion}</p>
                                            <p className="text-xs text-slate-400 dark:text-dark-text-muted">{d.kilates} {d.descripcion_detallada && `· ${d.descripcion_detallada}`}</p>
                                        </td>
                                        <td className="p-3 text-right font-bold text-slate-600 dark:text-dark-text-muted">{fmt(d.peso_neto)} g</td>
                                        <td className="p-3 text-right font-black text-slate-800 dark:text-dark-text">S/ {fmt(d.valor_tasado)}</td>
                                        <td className="p-3 text-right font-black text-brand-gold">S/ {fmt(d.maximo_prestar)}</td>
                                        <td className="p-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleEditarDetalle(d)}
                                                    title="Editar joya"
                                                    className="p-1.5 text-slate-300 dark:text-dark-text-muted hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                                                >
                                                    <PencilSquareIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEliminarDetalle(d.id)}
                                                    title="Eliminar joya"
                                                    className="p-1.5 text-slate-300 dark:text-dark-text-muted hover:text-brand-red dark:hover:text-red-400 transition-colors"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── TOTALES + GUARDAR ───────────────────────────────────────────── */}
            {detalles.length > 0 && (
                <div className="mt-6 bg-brand-red rounded-2xl shadow-xl border border-brand-red-dark text-white p-6 flex flex-col sm:flex-row justify-between items-center gap-4 sticky bottom-4 z-20">
                    <div className="flex items-center gap-3">
                        <BanknotesIcon className="w-8 h-8 text-brand-gold" />
                        <div>
                            <p className="text-[10px] font-black text-brand-red-light/80 uppercase tracking-widest">Total tasación ({detalles.length} joyas)</p>
                            <p className="text-lg font-black">S/ {fmt(totalTasacion)}</p>
                        </div>
                    </div>
                    <div className="text-center sm:text-right">
                        <p className="text-[10px] font-black text-brand-gold uppercase tracking-widest">Total máximo a prestar</p>
                        <p className="text-2xl font-black text-brand-gold">S/ {fmt(totalMaximoPrestar)}</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleGuardarTasacion}
                            className="w-full sm:w-auto bg-brand-gold text-brand-red-dark px-8 py-3.5 rounded-xl font-black uppercase text-sm shadow-lg hover:brightness-110 transition-all"
                        >
                            Guardar tasación
                        </button>
                        <button
                            onClick={() => setShowCancelarModal(true)}
                            className="w-full sm:w-auto bg-transparent border border-white/30 text-white px-8 py-3.5 rounded-xl font-black uppercase text-sm hover:bg-white/10 transition-all"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {showCancelarModal && (
                <ConfirmModal
                    message="¿Seguro que deseas cancelar la tasación? Se perderá el cliente y todas las joyas agregadas."
                    confirmText="Sí, cancelar todo"
                    cancelText="No, seguir tasando"
                    onConfirm={handleCancelarTasacion}
                    onCancel={() => setShowCancelarModal(false)}
                />
            )}
        </div>
    );
};

const CampoNumero = ({ label, value, onChange, highlight }) => (
    <div>
        <label className="block text-[10px] font-black text-slate-400 dark:text-dark-text-muted uppercase mb-1.5">{label}</label>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0.00"
            className={`w-full p-3.5 text-sm font-bold bg-slate-50 dark:bg-dark-surface-alt border rounded-xl outline-none focus:ring-2 transition-all ${
                highlight
                    ? 'border-brand-red/30 dark:border-brand-gold/30 focus:ring-brand-red dark:focus:ring-brand-gold text-slate-800 dark:text-dark-text'
                    : 'border-slate-200 dark:border-dark-border focus:ring-brand-red dark:focus:ring-brand-gold text-slate-800 dark:text-dark-text'
            }`}
        />
    </div>
);

const round = n => Math.round(n * 100) / 100;
const fmt = n => parseFloat(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });

export default TasacionStore;