import React, { useMemo } from 'react';
import { useIndex } from 'hooks/rol/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { ShieldCheckIcon, AdjustmentsHorizontalIcon, CheckBadgeIcon, ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, roles, paginationInfo, alert, setAlert, fetchRoles,
        isEditing, editLoading, selectedRole, allPermisos, 
        checkedPermisos, togglePermission, handleManage, handleSave, handleCancel, isSaving,
        moduleFilter, setModuleFilter // Importamos el filtro
    } = useIndex();

    const columns = useMemo(() => [
        { 
            header: 'Rol', 
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-black uppercase text-slate-800">{row.nombre}</span>
                    <span className="text-[10px] text-slate-400">{row.descripcion || 'Sin descripción'}</span>
                </div>
            )
        },
        { 
            header: 'Permisos Habilitados', 
            render: (row) => (
                <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5 text-indigo-500" />
                    <span className="font-bold text-sm bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                        {row.permisos_count} permisos
                    </span>
                </div>
            )
        },
        { 
            header: 'Acciones', 
            render: (row) => (
                <button 
                    onClick={() => handleManage(row.id)} 
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                    <AdjustmentsHorizontalIcon className="w-4 h-4"/>
                    Gestionar
                </button>
            )
        }
    ], [handleManage]);

    // Agrupamos TODOS los permisos
    const groupedPermisos = useMemo(() => {
        return allPermisos.reduce((acc, perm) => {
            const [modulo] = perm.nombre.split('.');
            if (!acc[modulo]) acc[modulo] = [];
            acc[modulo].push(perm);
            return acc;
        }, {});
    }, [allPermisos]);

    // 🔥 NUEVO: Filtramos los grupos según lo que escriba el usuario
    const filteredGroupedPermisos = useMemo(() => {
        if (!moduleFilter) return groupedPermisos;
        
        const lowerFilter = moduleFilter.toLowerCase();
        const filtered = {};
        
        Object.entries(groupedPermisos).forEach(([modulo, permisos]) => {
            // Si el nombre del módulo coincide, lo mostramos
            if (modulo.toLowerCase().includes(lowerFilter)) {
                filtered[modulo] = permisos;
            }
        });
        
        return filtered;
    }, [groupedPermisos, moduleFilter]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Gestión de Roles y Permisos" icon={ShieldCheckIcon} />
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            
            {!isEditing ? (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mt-6 animate-fade-in">
                    <Table 
                        columns={columns} 
                        data={roles} 
                        loading={loading} 
                        pagination={{...paginationInfo, onPageChange: fetchRoles}} 
                    />
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 mt-6 flex flex-col overflow-hidden animate-fade-in">
                    
                    {/* Header de Edición */}
                    <div className="bg-slate-50 p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                                title="Volver a la lista"
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                            </button>
                            <div>
                                <h2 className="text-lg font-black uppercase text-slate-800">
                                    Permisos: {selectedRole?.nombre}
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Marca o desmarca las casillas para asignar o revocar accesos.
                                </p>
                            </div>
                        </div>

                        {/* 🔥 NUEVO: Input buscador y contador */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <input 
                                    type="text"
                                    placeholder="Buscar módulo..."
                                    value={moduleFilter}
                                    onChange={(e) => setModuleFilter(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none w-full md:w-64"
                                />
                                <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg border border-indigo-200 whitespace-nowrap">
                                {checkedPermisos.length} activos
                            </span>
                        </div>
                    </div>
                    
                    {/* Contenido (Grid de Permisos) */}
                    <div className="p-6 bg-slate-100 min-h-[400px]">
                        {editLoading ? (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                                <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                                <p className="font-bold text-sm">Cargando configuración...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* 🔥 Usamos el arreglo filtrado */}
                                {Object.keys(filteredGroupedPermisos).length > 0 ? (
                                    Object.entries(filteredGroupedPermisos).map(([modulo, permisos]) => (
                                        <div key={modulo} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
                                            <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-between">
                                                <span className="font-black uppercase text-xs tracking-wider">{modulo}</span>
                                                <CheckBadgeIcon className="w-4 h-4 opacity-50" />
                                            </div>
                                            <div className="p-3 space-y-2">
                                                {permisos.map(perm => (
                                                    <label key={perm.id} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={checkedPermisos.includes(perm.id)}
                                                            onChange={() => togglePermission(perm.id)}
                                                            className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="text-[11px] font-bold text-slate-700">{perm.nombre}</span>
                                                            <span className="text-[10px] text-slate-500 leading-tight">{perm.descripcion}</span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-10 text-slate-400">
                                        <p className="font-bold">No se encontraron módulos para "{moduleFilter}"</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer de Acciones */}
                    <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3">
                        <button 
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving || editLoading}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-black hover:bg-slate-800 rounded-lg shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            {isSaving ? 'Guardando...' : 'Guardar Configuración'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Index;