import React from 'react';
import ViewModal from 'components/Shared/Modals/ViewModal';
import { 
    UserIcon, BuildingOfficeIcon, IdentificationIcon, PhoneIcon, 
    MapPinIcon, CreditCardIcon, BriefcaseIcon 
} from '@heroicons/react/24/outline';

const FichaClienteModal = ({ isOpen, onClose, data, isLoading }) => {
    if (!data && !isLoading) return null;

    const cuentas = data?.cuentasBancarias 
        ? (Array.isArray(data.cuentasBancarias) ? data.cuentasBancarias : [data.cuentasBancarias])
        : (data?.cuentas_bancarias 
            ? (Array.isArray(data.cuentas_bancarias) ? data.cuentas_bancarias : [data.cuentas_bancarias]) 
            : []);

    return (
        <ViewModal isOpen={isOpen} onClose={onClose} title="Ficha Detallada del Cliente" isLoading={isLoading}>
            {data && (
                <div className="space-y-6">
                    {/* Cabecera: Perfil y Documentos */}
                    <div className="flex flex-col md:flex-row gap-5 border-b border-slate-100 pb-6">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 shrink-0 ${
                            data.tipo === 2 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'
                        }`}>
                            {data.tipo === 2 
                                ? <BuildingOfficeIcon className="w-10 h-10 text-amber-600"/> 
                                : <UserIcon className="w-10 h-10 text-red-600"/>
                            }
                        </div>
                        <div className="flex-1">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase border ${
                                data.tipo === 2 ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-red-100 text-red-700 border-red-300'
                            }`}>
                                {data.tipo === 2 ? 'Empresa / RUC' : 'Persona Natural / DNI'}
                            </span>
                            <h2 className="text-2xl font-black text-slate-900 uppercase mt-1 leading-tight">
                                {data.nombre_completo}
                            </h2>
                            <div className="flex flex-wrap gap-4 mt-3">
                                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                                    <IdentificationIcon className="w-5 h-5 text-slate-400"/>
                                    {data.tipo === 2 ? data.ruc : data.dni}
                                </div>
                                {data.contacto?.telefonoMovil && (
                                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                                        <PhoneIcon className="w-5 h-5 text-slate-400"/>
                                        {data.contacto.telefonoMovil}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Cuerpo: Información en Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Columna: Ubicación */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Residencia</h4>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 relative overflow-hidden h-full">
                                <MapPinIcon className="w-12 h-12 text-slate-200 absolute -right-2 -bottom-2 transform -rotate-12" />
                                <p className="text-sm font-bold text-slate-800 relative z-10">{data.direccion?.direccionFiscal || 'No registrada'}</p>
                                <p className="text-xs text-slate-500 uppercase font-medium mt-1 relative z-10">
                                    {data.direccion?.distrito} - {data.direccion?.provincia}
                                </p>
                                <div className="mt-3 flex gap-2 relative z-10">
                                    <span className="text-[10px] bg-white px-2 py-1 rounded-lg shadow-sm border border-slate-200 text-slate-600 font-bold">
                                        {data.direccion?.tipoVivienda}
                                    </span>
                                    <span className="text-[10px] bg-white px-2 py-1 rounded-lg shadow-sm border border-slate-200 text-slate-600 font-bold">
                                        {data.direccion?.tiempoResidencia}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Columna: Empleo */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Situación Laboral</h4>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 h-full">
                                {data.tipo === 1 ? (
                                    <div className="space-y-2">
                                        <p className="text-xs text-slate-500 uppercase font-bold">Centro Laboral:</p>
                                        <p className="text-sm font-black text-slate-800">{data.empleo?.centroLaboral || 'No especificado'}</p>
                                        <div className="pt-2 border-t border-slate-200 mt-2">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Ingreso Mensual:</p>
                                            <p className="text-lg font-black text-green-600">S/ {data.empleo?.ingresoMensual || '0.00'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400 italic text-xs">
                                        No aplica para empresas
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fila completa: Cuentas Bancarias (CON CORRECCIÓN DE ESPACIADO) */}
                        <div className="md:col-span-2 mt-2 pt-6 border-t border-slate-100 space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cuentas para Desembolso / Cobro</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {cuentas.length > 0 ? cuentas.map((cta, i) => (
                                    <div key={i} className="group bg-white p-4 rounded-2xl border border-slate-200 hover:border-red-200 transition-all shadow-sm">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-600 transition-colors">
                                                <CreditCardIcon className="w-5 h-5 text-red-600 group-hover:text-white" />
                                            </div>
                                            <p className="text-xs font-black text-slate-800 uppercase">{cta.entidadFinanciera}</p>
                                        </div>
                                        <p className="text-sm font-mono font-bold text-slate-700 tracking-wider bg-slate-50 p-2 rounded-lg border border-slate-100">
                                            {cta.ctaAhorros}
                                        </p>
                                        {cta.cci && (
                                            <p className="text-[10px] text-slate-400 font-mono mt-2 pl-1">CCI: {cta.cci}</p>
                                        )}
                                    </div>
                                )) : (
                                    <div className="col-span-2 py-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-sm">
                                        No registra cuentas bancarias
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Acceso al Sistema */}
                    {data.usuario && (
                        <div className="bg-slate-900 p-5 rounded-[2rem] shadow-xl border border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                    <BriefcaseIcon className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Usuario de Sistema</p>
                                    <p className="text-lg font-bold text-white leading-none">{data.usuario.username}</p>
                                </div>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg ${
                                data.usuario.estado ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-red-500 text-white shadow-red-500/20'
                            }`}>
                                {data.usuario.estado ? 'Acceso Activo' : 'Cuenta Bloqueada'}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </ViewModal>
    );
};

export default FichaClienteModal;