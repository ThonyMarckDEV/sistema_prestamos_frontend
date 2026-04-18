import React, { useState, useEffect } from 'react';
import ViewModal from 'components/Shared/Modals/ViewModal';
import { 
    BanknotesIcon, DevicePhoneMobileIcon, PhotoIcon, 
    UserGroupIcon, DocumentCheckIcon, XMarkIcon 
} from '@heroicons/react/24/outline';

const PagoCuotaModal = ({ isOpen, onClose, cuota, onConfirm, loading }) => {
    const [metodo, setMetodo]             = useState('DEPOSITO');
    const [recibido, setRecibido]         = useState('');
    const [referencia, setReferencia]     = useState('');
    const [archivo, setArchivo]           = useState(null);
    const [preview, setPreview]           = useState(null);
    const [esParcial, setEsParcial]       = useState(false);
    const [distribucion, setDistribucion] = useState({});

    // saldo_pendiente ya incluye mora (saldo_cuota + saldo_mora en el modelo)
    const totalAPagar = parseFloat(cuota?.saldo_pendiente || cuota?.monto || 0).toFixed(2);
    const mora        = parseFloat(cuota?.mora || 0);
    const esGrupal    = !!(cuota?.integrantes && cuota.integrantes.length > 0);

    // Solo integrantes que aún tienen saldo pendiente
    const integrantesPendientes = cuota?.integrantes?.filter(i => !i.pagado) ?? [];

    useEffect(() => {
        if (isOpen) {
            setMetodo('DEPOSITO');
            setRecibido(totalAPagar);
            setReferencia('');
            setArchivo(null);
            setPreview(null);
            setEsParcial(false);
            setDistribucion({});
        }
    }, [isOpen, totalAPagar]);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setArchivo(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handleMontoIntegrante = (clienteId, valor) => {
        const sanitized = valor.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        setDistribucion(prev => ({ ...prev, [clienteId]: sanitized }));
    };

    const reset = () => { setArchivo(null); setPreview(null); onClose(); };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('cuota_id', cuota.id);
        formData.append('metodo_pago', metodo);
        formData.append('monto_recibido', recibido);
        formData.append('numero_operacion', referencia);
        if (archivo) formData.append('comprobante', archivo);

        if (esGrupal && esParcial) {
            formData.append('es_parcial_grupal', '1');
            formData.append('distribucion', JSON.stringify(
                integrantesPendientes.map(int => ({
                    cliente_id:    int.id,
                    // total_cuota aquí es el SALDO pendiente del socio
                    total_cuota:   parseFloat(int.saldo || 0),
                    monto:         parseFloat(distribucion[int.id] || 0),
                    pago_completo: !distribucion[int.id] || distribucion[int.id] === ''
                }))
            ));
        }

        onConfirm(formData);
    };

    // Mora proporcional: se reparte entre los que tienen saldo pendiente
    const totalSaldoPendientes = integrantesPendientes.reduce((acc, int) => acc + parseFloat(int.saldo || 0), 0);
    const getMoraProporcional = (int) => {
        if (totalSaldoPendientes <= 0 || mora <= 0) return 0;
        const proporcion = parseFloat(int.saldo || 0) / totalSaldoPendientes;
        return parseFloat((mora * proporcion).toFixed(2));
    };

    // Total distribuido — si hay 1 solo pendiente y está en FULL, usa totalAPagar exacto
    const totalDistribuido = (() => {
        if (integrantesPendientes.length === 1) {
            const int = integrantesPendientes[0];
            const val = distribucion[int.id];
            const pagaCompleto = !val || val === '';
            if (pagaCompleto) return parseFloat(totalAPagar);
            return parseFloat(val || 0);
        }
        return integrantesPendientes.reduce((acc, int) => {
            const val = distribucion[int.id];
            const pagaCompleto = !val || val === '';
            const moraProp = getMoraProporcional(int);
            return acc + (pagaCompleto
                ? parseFloat(int.saldo || 0) + moraProp
                : parseFloat(val || 0));
        }, 0);
    })();


    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (esGrupal && esParcial && integrantesPendientes.length > 0) {
            // Si solo 1 pendiente → usa totalAPagar exacto para evitar diferencias de redondeo
            const total = integrantesPendientes.length === 1
                ? totalAPagar
                : totalDistribuido.toFixed(2);
            setRecibido(total);
        }
    }, [totalDistribuido, esGrupal, esParcial, integrantesPendientes.length, totalAPagar]);

    // Si es grupal sin parcial, siempre usa el total pendiente
    useEffect(() => {
        if (esGrupal && !esParcial) {
            setRecibido(totalAPagar);
        }
    }, [esParcial, esGrupal, totalAPagar]);

    return (
        <ViewModal isOpen={isOpen} onClose={reset} title={`Cobrar Cuota N° ${cuota?.nro}`} size="xl">
            <div className="flex flex-col md:flex-row -m-6 md:h-[580px] overflow-y-auto md:overflow-hidden">

                {/* Panel izquierdo */}
                <div className="w-full md:w-[55%] p-8 flex flex-col bg-white border-r border-slate-100">
                    <div className="space-y-5 flex-1 overflow-y-auto">

                        {/* Resumen */}
                        <div className="bg-slate-900 p-6 rounded-[28px] text-white shadow-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <BanknotesIcon className="w-4 h-4 text-green-400" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    {parseFloat(cuota?.pago_acumulado) > 0 ? 'Saldo Pendiente' : 'Total a Cobrar'}
                                </span>
                            </div>
                            <h2 className="text-4xl font-black italic tracking-tighter text-green-400">S/ {totalAPagar}</h2>
                            {mora > 0 && (
                                <p className="text-[10px] font-bold text-red-400 mt-1">Incluye mora: S/ {mora.toFixed(2)}</p>
                            )}
                            {parseFloat(cuota?.pago_acumulado) > 0 && (
                                <p className="text-[10px] font-bold text-blue-400 mt-1">
                                    Ya abonado: S/ {parseFloat(cuota.pago_acumulado).toFixed(2)}
                                </p>
                            )}
                            <div className="mt-5 pt-5 border-t border-white/10">
                                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                                    Cuota N° {cuota?.nro} — {cuota?.vencimiento}
                                </p>
                                <p className="text-sm font-black uppercase leading-snug text-white break-words">
                                    {cuota?.cliente ?? (esGrupal ? 'Préstamo Grupal' : 'Cliente')}
                                </p>
                            </div>
                        </div>

                        {/* Método */}
                        <div className="grid grid-cols-2 gap-3">
                            {['DEPOSITO', 'EFECTIVO'].map((m) => (
                                <button key={m} type="button" onClick={() => setMetodo(m)}
                                    className={`p-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 border-2 transition-all
                                        ${metodo === m ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}>
                                    {m === 'EFECTIVO' ? <BanknotesIcon className="w-4 h-4"/> : <DevicePhoneMobileIcon className="w-4 h-4"/>}
                                    {m}
                                </button>
                            ))}
                        </div>

                        {/* Campos */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Monto a Registrar *</label>
                                <input
                                    type="number" step="0.01" required value={recibido}
                                    readOnly={esGrupal}
                                    onChange={e => !esGrupal && setRecibido(e.target.value)}
                                    className={`w-full p-4 border-2 rounded-2xl text-sm font-bold outline-none transition-all ${
                                        esGrupal
                                            ? 'bg-slate-50 border-slate-100 cursor-not-allowed opacity-70'
                                            : 'bg-slate-50 border-slate-100 focus:border-red-500 focus:bg-white'
                                    }`}
                                />
                                {!esGrupal && (
                                    <p className="text-[9px] text-slate-400 font-bold mt-1 ml-1">
                                        Puedes ajustar el monto si el cliente paga una cantidad diferente.
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">N° Operación / Referencia</label>
                                <input type="text" value={referencia} onChange={e => setReferencia(e.target.value)}
                                    placeholder="Ej: 002938"
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:border-red-500 focus:bg-white outline-none transition-all" />
                            </div>
                        </div>

                        {/* Voucher */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Comprobante</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="pago-cuota-upload" />
                            <label htmlFor="pago-cuota-upload"
                                className={`flex items-center justify-center w-full p-5 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300
                                    ${archivo ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-500'}`}>
                                <div className="flex flex-col items-center gap-1 font-black text-[10px] uppercase">
                                    <PhotoIcon className="w-6 h-6 mb-1" />
                                    {archivo ? 'Comprobante Cargado ✓' : 'Subir Voucher / Captura'}
                                </div>
                            </label>
                        </div>

                        {/* Toggle parcial — solo si hay integrantes pendientes */}
                        {esGrupal && integrantesPendientes.length > 0 && (
                            <div onClick={() => setEsParcial(prev => !prev)}
                                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all select-none
                                    ${esParcial ? 'border-orange-400 bg-orange-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}>
                                <div className="flex items-center gap-3">
                                    <UserGroupIcon className={`w-5 h-5 ${esParcial ? 'text-orange-500' : 'text-slate-400'}`} />
                                    <div>
                                        <p className={`text-xs font-black uppercase ${esParcial ? 'text-orange-700' : 'text-slate-600'}`}>
                                            Pago Parcial del Grupo
                                        </p>
                                        <p className="text-[9px] text-slate-400 font-bold">
                                            {integrantesPendientes.length} socio{integrantesPendientes.length > 1 ? 's' : ''} con saldo pendiente
                                        </p>
                                    </div>
                                </div>
                                <div className={`w-10 h-5 rounded-full transition-all relative flex-shrink-0 ${esParcial ? 'bg-orange-500' : 'bg-slate-300'}`}>
                                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${esParcial ? 'left-5' : 'left-0.5'}`} />
                                </div>
                            </div>
                        )}

                        {/* Distribución — solo pendientes */}
                        {esGrupal && esParcial && integrantesPendientes.length > 0 && (
                            <div className="border border-orange-200 rounded-2xl overflow-hidden">
                                <div className="bg-orange-50 px-4 py-2.5 border-b border-orange-200">
                                    <p className="text-[10px] font-black text-orange-700 uppercase">Socios con Saldo Pendiente</p>
                                    <p className="text-[9px] text-orange-500 font-bold mt-0.5">
                                        Vacío = pagó su saldo completo. Ingresa monto si pagó menos.
                                    </p>
                                </div>
                                <div className="divide-y divide-slate-100 bg-white">
                                    {integrantesPendientes.map((int) => {
                                        const montoPuesto  = parseFloat(distribucion[int.id] || 0);
                                        const saldo        = parseFloat(int.saldo || 0);
                                        const moraProp     = getMoraProporcional(int);
                                        const saldoTotal   = saldo + moraProp;
                                        const pagaCompleto = !distribucion[int.id] || distribucion[int.id] === '';
                                        const pagaMas      = montoPuesto >= saldoTotal && !pagaCompleto;
                                        return (
                                            <div key={int.id} className="flex items-center gap-3 px-4 py-3">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[11px] font-black text-slate-700 uppercase truncate">{int.nombre}</p>
                                                    <div className="flex flex-col mt-0.5">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-[9px] text-slate-400 font-bold">
                                                                Capital: S/ {saldo.toFixed(2)}
                                                            </p>
                                                            {moraProp > 0 && (
                                                                <p className="text-[9px] text-red-500 font-bold">
                                                                    + Mora: S/ {moraProp.toFixed(2)}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {moraProp > 0 && (
                                                            <p className="text-[9px] font-black text-slate-600">
                                                                Total: S/ {saldoTotal.toFixed(2)}
                                                            </p>
                                                        )}
                                                        {int.pago_acumulado > 0 && (
                                                            <p className="text-[9px] text-blue-500 font-bold">
                                                                Ya pagó: S/ {parseFloat(int.pago_acumulado).toFixed(2)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <input type="text" inputMode="decimal"
                                                    value={distribucion[int.id] ?? ''}
                                                    onChange={e => handleMontoIntegrante(int.id, e.target.value)}
                                                    placeholder="Completo"
                                                    className={`w-28 p-2 border rounded-xl text-xs font-black outline-none focus:ring-1 text-right transition-all
                                                        ${pagaCompleto
                                                            ? 'border-green-200 bg-green-50 text-green-700 placeholder-green-400 focus:ring-green-400'
                                                            : pagaMas
                                                                ? 'border-green-200 bg-green-50 text-green-700 focus:ring-green-400'
                                                                : 'border-orange-200 bg-orange-50 text-orange-700 focus:ring-orange-400'}`}
                                                />
                                                <div className="w-14 text-right flex-shrink-0">
                                                    {pagaCompleto
                                                        ? <span className="text-[9px] font-black text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">✓ FULL</span>
                                                        : <span className="text-[9px] font-black text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">PARCIAL</span>
                                                    }
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-500 uppercase">Total distribuido:</span>
                                    <span className={`text-sm font-black ${Math.abs(totalDistribuido - parseFloat(recibido)) < 0.01 ? 'text-green-600' : 'text-orange-600'}`}>
                                        S/ {totalDistribuido.toFixed(2)}
                                        <span className="text-[9px] text-slate-400 font-bold ml-1">/ S/ {totalAPagar}</span>
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preview móvil */}
                    {preview && (
                        <div className="md:hidden mt-6 mb-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Vista Previa:</p>
                            <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-100 min-h-[180px]">
                                <img src={preview} alt="Voucher" className="max-h-[260px] rounded-lg shadow-sm" />
                            </div>
                        </div>
                    )}

                    {/* Botón */}
                    <div className="pt-6 md:pt-4">
                        <button onClick={handleSubmit} disabled={loading}
                            className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-xs shadow-lg shadow-red-100 hover:bg-red-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95">
                            {loading
                                ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                : <DocumentCheckIcon className="w-5 h-5" />
                            }
                            Registrar Pago de Cuota
                        </button>
                    </div>
                </div>

                {/* Panel derecho: preview voucher */}
                <div className="hidden md:flex md:w-[45%] bg-slate-50 relative items-center justify-center p-6">
                    {preview ? (
                        <div className="relative w-full h-full flex items-center justify-center group">
                            <img src={preview} alt="Voucher Preview"
                                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl bg-white border border-slate-200" />
                            <button onClick={() => { setArchivo(null); setPreview(null); }}
                                className="absolute top-4 right-4 bg-white text-red-600 p-2 rounded-full shadow-xl hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <PhotoIcon className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin Vista Previa</p>
                            <p className="text-[9px] text-slate-200 mt-1">Sube el voucher para visualizarlo aquí</p>
                        </div>
                    )}
                </div>

            </div>
        </ViewModal>
    );
};

export default PagoCuotaModal;