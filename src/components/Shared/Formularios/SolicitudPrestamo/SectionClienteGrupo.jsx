import React from 'react';
import ClienteSearchSelect from 'components/Shared/Comboboxes/ClienteSearchSelect';
import ProductoSearchSelect from 'components/Shared/Comboboxes/ProductoSearchSelect';
import GrupoSearchSelect from 'components/Shared/Comboboxes/GrupoSearchSelect';
import { UserIcon, UserGroupIcon, ShieldCheckIcon, TrashIcon } from '@heroicons/react/24/outline';

const SectionClienteGrupo = ({ data, handleChange, isBlocked, isMainBlocked, isUpdate, addIntegrante, removeIntegrante, updateMontoIntegrante, updateCargoIntegrante }) => {

    const isPresidenteTaken = (currentId) => data.integrantes.some(i => i.cargo === 'PRESIDENTE' && i.id !== currentId);
    const isSecretarioTaken = (currentId) => data.integrantes.some(i => i.cargo === 'SECRETARIO' && i.id !== currentId);

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-700 uppercase mb-4 flex items-center gap-2">
                {data.es_grupal ? <UserGroupIcon className="w-5 h-5 text-blue-600" /> : <UserIcon className="w-5 h-5 text-red-600" />} 
                {data.es_grupal ? 'Configuración de Grupo' : 'Información del Cliente'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{data.es_grupal ? 'Grupo *' : 'Cliente *'}</label>
                    {!data.es_grupal ? (
                        <ClienteSearchSelect 
                            onSelect={(c) => { 
                                handleChange('cliente_id', c?.usuario_id); 
                                handleChange('modalidad', c ? c.modalidad_cliente : ''); 
                            }} 
                            initialName={data.cliente_nombre || data.cliente?.nombre_completo}
                            disabled={isUpdate} 
                        />
                    ) : (
                        <GrupoSearchSelect 
                            onSelect={(g) => handleChange('grupo_id', g?.id)} 
                            initialName={data.grupo_nombre} 
                            disabled={isUpdate || isBlocked}
                        />
                    )}
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Modalidad Detectada</label>
                    <div className={`p-2.5 rounded-lg border text-xs font-black flex items-center gap-2 h-[42px] ${isMainBlocked ? 'bg-red-50 border-red-200 text-red-600' : (data.modalidad ? 'bg-green-50 border-green-200 text-green-600' : 'bg-slate-50 border-slate-200 text-slate-400')}`}>
                        <ShieldCheckIcon className="w-4 h-4" /> {data.modalidad || 'ESPERANDO SELECCIÓN...'}
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Producto Financiero *</label>
                    <ProductoSearchSelect onSelect={(p) => handleChange('producto_id', p?.id)} initialName={data.producto_nombre || data.producto?.nombre} disabled={isBlocked} />
                </div>
            </div>

            {/* TABLA DE INTEGRANTES */}
            {data.es_grupal && (
                <div className="mt-8 border-t border-slate-100 pt-6">
                    <div className="flex justify-between items-end mb-4">
                        <div className="w-72">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 italic text-blue-600">Añadir Socio al Grupo:</label>
                            <ClienteSearchSelect onSelect={addIntegrante} disabled={isBlocked} clearOnSelect={true} />
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase">Suma Total Grupo</p>
                            <p className="text-lg font-black text-blue-600">S/ {data.integrantes.reduce((acc, i) => acc + parseFloat(i.monto || 0), 0).toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="overflow-hidden border border-slate-100 rounded-xl">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase">
                                <tr>
                                    <th className="px-4 py-3">Socio / Modalidad</th>
                                    <th className="px-4 py-3 w-40">Cargo</th>
                                    <th className="px-4 py-3 w-40">Aporte (S/)</th>
                                    <th className="px-4 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data.integrantes.map((int) => {
                                    const isRed = int.modalidad === 'RCS' || int.modalidad?.includes('VIGENTE');
                                    return (
                                        <tr key={int.id} className={isRed ? 'bg-red-50/50' : ''}>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-bold uppercase text-[11px] ${isRed ? 'text-red-700' : 'text-slate-700'}`}>{int.nombre}</span>
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black border ${isRed ? 'bg-red-100 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                                        {int.modalidad}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={int.cargo || 'INTEGRANTE'}
                                                    onChange={(e) => updateCargoIntegrante(int.id, e.target.value)}
                                                    disabled={isBlocked && !isRed}
                                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:ring-1 focus:ring-blue-500 outline-none disabled:cursor-not-allowed uppercase"
                                                >
                                                    <option value="PRESIDENTE" disabled={isPresidenteTaken(int.id)}>Presidente</option>
                                                    <option value="SECRETARIO" disabled={isSecretarioTaken(int.id)}>Secretario</option>
                                                    <option value="INTEGRANTE">Integrante</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3">
                                                <input 
                                                    disabled={isBlocked && !isRed} 
                                                    type="text" 
                                                    value={int.monto === 0 ? '' : int.monto} 
                                                    onChange={(e) => {
                                                        let val = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                                                        updateMontoIntegrante(int.id, val === '' ? 0 : val);
                                                    }} 
                                                    placeholder="0.00"
                                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-blue-600 focus:ring-1 focus:ring-blue-500 outline-none disabled:cursor-not-allowed" 
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <button type="button" onClick={() => removeIntegrante(int.id)} className="text-red-400 hover:text-red-600 transition-colors">
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {data.integrantes.length === 0 && (
                                    <tr><td colSpan="4" className="px-4 py-8 text-center text-slate-400 text-xs italic">Busca y selecciona clientes para armar el grupo.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SectionClienteGrupo;