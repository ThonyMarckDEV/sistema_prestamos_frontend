import React from 'react';
import { ShoppingCartIcon, TrashIcon, BanknotesIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const fmt = n => parseFloat(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });

const CarritoSidebar = ({
    carrito, quitarDelCarrito, totalCarrito,
    clienteGenerico, setClienteGenerico, clienteNombre, setClienteNombre,
    metodoPago, setMetodoPago,
    onProcesar,
}) => (
    <div className="bg-white dark:bg-dark-surface rounded-[28px] border border-slate-100 dark:border-dark-border shadow-sm dark:shadow-black/25 overflow-hidden sticky top-4 transition-colors">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-dark-border flex items-center gap-2">
            <ShoppingCartIcon className="w-4 h-4 text-slate-700 dark:text-dark-text" />
            <h4 className="font-black text-slate-800 dark:text-dark-text uppercase text-xs tracking-[0.15em]">
                Carrito ({carrito.length})
            </h4>
        </div>

        <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
            {carrito.length === 0 && (
                <p className="text-[10px] font-bold text-slate-400 dark:text-dark-text-muted text-center py-6">
                    Agrega lotes desde la lista para venderlos.
                </p>
            )}
            {carrito.map(item => (
                <div key={item.lote} className="flex items-center justify-between bg-slate-50 dark:bg-dark-surface-alt rounded-xl border border-slate-100 dark:border-dark-border p-3">
                    <div>
                        <p className="text-xs font-black text-slate-800 dark:text-dark-text">Lote #{item.lote}</p>
                        <p className="text-[9px] font-bold text-slate-400 dark:text-dark-text-muted">{item.cantidad_piezas} pieza(s)</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-right">
                            <span className="block text-xs font-black text-slate-700 dark:text-dark-text">S/ {fmt(item.precio_venta)}</span>
                            {parseFloat(item.precio_venta) !== parseFloat(item.valor_tasado) && (
                                <span className="block text-[8px] font-bold text-slate-400 dark:text-dark-text-muted line-through">S/ {fmt(item.valor_tasado)}</span>
                            )}
                        </div>
                        <button onClick={() => quitarDelCarrito(item.lote)} className="text-slate-300 dark:text-dark-text-muted/60 hover:text-brand-red transition-colors">
                            <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-dark-border space-y-3">
            {/* Cliente */}
            <div>
                <label className="block text-[9px] font-black text-slate-400 dark:text-dark-text-muted uppercase mb-1.5">Cliente</label>
                <div className="flex bg-slate-100 dark:bg-dark-surface-alt p-0.5 rounded-lg border border-slate-200 dark:border-dark-border mb-2">
                    <button type="button" onClick={() => setClienteGenerico(true)}
                        className={`flex-1 py-1.5 rounded-md text-[9px] font-black uppercase transition-all ${clienteGenerico ? 'bg-white dark:bg-dark-surface text-brand-red dark:text-brand-gold shadow-sm' : 'text-slate-400 dark:text-dark-text-muted'}`}>
                        Genérico / Sistema
                    </button>
                    <button type="button" onClick={() => setClienteGenerico(false)}
                        className={`flex-1 py-1.5 rounded-md text-[9px] font-black uppercase transition-all ${!clienteGenerico ? 'bg-white dark:bg-dark-surface text-brand-red dark:text-brand-gold shadow-sm' : 'text-slate-400 dark:text-dark-text-muted'}`}>
                        Registrado
                    </button>
                </div>
                {!clienteGenerico && (
                    <input type="text" value={clienteNombre} onChange={e => setClienteNombre(e.target.value)}
                        placeholder="Nombre o DNI del comprador"
                        className="w-full p-2.5 bg-slate-50 dark:bg-dark-surface-alt border border-slate-200 dark:border-dark-border rounded-lg text-xs font-bold text-slate-700 dark:text-dark-text outline-none focus:ring-2 focus:ring-brand-red dark:focus:ring-brand-gold"
                    />
                )}
            </div>

            {/* Método de pago */}
            <div>
                <label className="block text-[9px] font-black text-slate-400 dark:text-dark-text-muted uppercase mb-1.5">Método de pago</label>
                <div className="flex gap-2">
                    <button type="button" onClick={() => setMetodoPago('efectivo')}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-black uppercase border transition-all ${
                            metodoPago === 'efectivo' ? 'bg-brand-red text-white border-brand-red' : 'bg-white dark:bg-dark-surface text-slate-500 dark:text-dark-text-muted border-slate-200 dark:border-dark-border'
                        }`}>
                        <BanknotesIcon className="w-3.5 h-3.5" /> Efectivo
                    </button>
                    <button type="button" onClick={() => setMetodoPago('transferencia')}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-black uppercase border transition-all ${
                            metodoPago === 'transferencia' ? 'bg-brand-red text-white border-brand-red' : 'bg-white dark:bg-dark-surface text-slate-500 dark:text-dark-text-muted border-slate-200 dark:border-dark-border'
                        }`}>
                        <CreditCardIcon className="w-3.5 h-3.5" /> Transferencia
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-dark-border">
                <span className="text-[10px] font-black text-slate-500 dark:text-dark-text-muted uppercase">Total</span>
                <span className="text-xl font-black text-brand-red dark:text-brand-gold">S/ {fmt(totalCarrito)}</span>
            </div>

            <button
                onClick={onProcesar}
                disabled={carrito.length === 0}
                className="w-full py-3.5 rounded-2xl font-black uppercase text-xs bg-slate-900 dark:bg-black text-white dark:text-dark-text hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            >
                Procesar Venta
            </button>
        </div>
    </div>
);

export default CarritoSidebar;