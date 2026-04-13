import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/insumo/useIndex';

import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import ViewModal from 'components/Shared/Modals/ViewModal';
import UnidadMedidaSearchSelect from 'components/Shared/Comboboxes/UnidadMedidaSearchSelect';

import { 
    BeakerIcon, 
    PencilSquareIcon, 
    TrashIcon, 
    EyeIcon, 
    CurrencyDollarIcon,
    ArrowsRightLeftIcon,
    ShoppingCartIcon,
    BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, insumos, paginationInfo, filters, setFilters, alert, setAlert,
        isViewOpen, setIsViewOpen, viewData, viewLoading, confirmAction, setConfirmAction,
        fetchInsumos, handleView, handleAskStatus, handleAskDelete, handleConfirmAction,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    } = useIndex();

    const filterConfig = useMemo(() => [
        { 
            name: 'search', 
            type: 'text', 
            label: 'Buscar Insumo', 
            placeholder: 'Ej: Tomate, Gaseosa...', 
            colSpan: 'col-span-12 md:col-span-3' 
        },
        {
            name: 'unidad_medida_id',
            type: 'custom',
            label: 'Unidad de Medida',
            colSpan: 'col-span-12 md:col-span-3',
            render: () => (
                <UnidadMedidaSearchSelect 
                    isFilter={true} 
                    form={filters} 
                    setForm={setFilters} 
                    idField="unidad_medida_id"
                    nameField="unidadMedidaNombre"
                />
            )
        },
        {
            name: 'es_venta_directa', 
            type: 'select', 
            label: '¿Es Venta Directa?', 
            colSpan: 'col-span-12 md:col-span-2',
            options: [
                { value: '', label: 'Todos' }, 
                { value: 'true', label: 'Sí (POS)' }, 
                { value: 'false', label: 'No' }
            ] 
        },
        {
            name: 'estado', 
            type: 'select', 
            label: 'Estado', 
            colSpan: 'col-span-12 md:col-span-2',
            options: [
                { value: '', label: 'Todos' }, 
                { value: '1', label: 'Activos' }, 
                { value: '0', label: 'Inactivos' }
            ] 
        }
    ], [filters, setFilters]);

    const columns = useMemo(() => [
        {
            header: 'Insumo',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-full border border-slate-200">
                        {row.es_venta_directa ? <ShoppingCartIcon className="w-5 h-5 text-slate-600" /> : <BeakerIcon className="w-5 h-5 text-slate-600" />}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">{row.nombre}</span>
                        <div className="flex items-center gap-1 mt-0.5">
                            {row.es_inventariable && <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Stock</span>}
                            {row.es_venta_directa && <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider border border-green-200">POS</span>}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Conversión (Compra → Consumo)',
            render: (row) => (
                <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600">
                        1 {row.unidad_compra?.nombre} = <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{row.factor_conversion} {row.unidad_medida?.nombre}</span>
                    </span>
                </div>
            )
        },
        {
            header: 'Precios',
            render: (row) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-500 font-bold">Compra:</span>
                        <span className="text-slate-700 font-black">
                            S/ {parseFloat(row.costo_referencial).toFixed(2)} <span className="text-[12px] font-normal text-slate-400">/ {row.unidad_compra?.abreviatura || 'Caja'}</span>
                        </span>
                    </div>
                    {row.es_venta_directa && row.precio_venta && (
                        <div className="flex items-center justify-between text-[11px] font-mono mt-0.5 pt-0.5 border-t border-slate-100">
                            <span className="text-green-600 font-bold">Venta:</span>
                            <span className="text-green-700 font-black">
                                S/ {parseFloat(row.precio_venta).toFixed(2)} <span className="text-[12px] font-normal text-green-600">/ {row.unidad_medida?.abreviatura || 'Unid'}</span>
                            </span>
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => handleAskStatus(row.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase cursor-pointer hover:scale-105 transition-transform shadow-sm
                        ${row.estado ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-600 border border-red-200'}`}
                    title="Clic para cambiar estado"
                >
                    {row.estado ? 'Activo' : 'Inactivo'}
                </button>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handleView(row.id)}
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                        title="Ver Detalle"
                    >
                        <EyeIcon className="w-5 h-5" />
                    </button>
                    <Link 
                        to={`/insumo/editar/${row.id}`} 
                        className="p-2 text-slate-500 hover:text-black hover:bg-slate-50 rounded-lg transition-all" 
                        title="Editar Insumo"
                    >
                        <PencilSquareIcon className="w-5 h-5" />
                    </Link>
                    <button 
                        onClick={() => handleAskDelete(row.id)}
                        className="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                        title="Eliminar Insumo"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ], [handleAskStatus, handleView, handleAskDelete]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title="Gestion de Insumos" 
                icon={BeakerIcon} 
                buttonText="+ Nuevo Insumo" 
                buttonLink="/insumo/agregar" 
            />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <Table 
                columns={columns} 
                data={insumos} 
                loading={loading} 
                filterConfig={filterConfig}
                filters={filters}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleFilterClear}
                pagination={{
                    ...paginationInfo,
                    onPageChange: fetchInsumos
                }}
            />

            {confirmAction.show && (
                <ConfirmModal 
                    message={confirmAction.type === 'delete' 
                        ? "¿Estás seguro de eliminar este ítem? Si ya tiene movimientos de almacén, la operación será cancelada." 
                        : "¿Deseas cambiar el estado de este ítem?"}
                    confirmText="Sí, continuar"
                    onConfirm={handleConfirmAction} 
                    onCancel={() => setConfirmAction({show: false, id: null, type: ''})} 
                />
            )}

            <ViewModal 
                isOpen={isViewOpen} 
                onClose={() => setIsViewOpen(false)} 
                title="Ficha del Ítem" 
                isLoading={viewLoading}
            >
                {viewData && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-100 p-3 rounded-full">
                                    {viewData.es_venta_directa ? <ShoppingCartIcon className="w-8 h-8 text-slate-500" /> : <BeakerIcon className="w-8 h-8 text-slate-500" />}
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        {viewData.es_venta_directa ? 'Producto / Insumo' : 'Insumo'}
                                    </h4>
                                    <p className="text-xl font-black text-slate-800 uppercase">{viewData.nombre}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 col-span-2">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                                    <ArrowsRightLeftIcon className="w-3 h-3"/> Regla de Conversión
                                </h4>
                                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500 uppercase">Se Compra en</p>
                                        <p className="font-bold text-slate-800">{viewData.unidad_compra?.nombre}</p>
                                    </div>
                                    <span className="font-black text-slate-300">➔</span>
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500 uppercase">Factor</p>
                                        <p className="font-black text-blue-600 bg-blue-50 px-2 rounded">x {viewData.factor_conversion}</p>
                                    </div>
                                    <span className="font-black text-slate-300">➔</span>
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500 uppercase">Se Consume en</p>
                                        <p className="font-bold text-slate-800">{viewData.unidad_medida?.nombre}</p>
                                    </div>
                                </div>
                            </div>
                            
                           <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                                    <CurrencyDollarIcon className="w-3 h-3"/> Costo Compra
                                </h4>
                                <p className="text-sm font-bold text-slate-700">
                                    S/ {parseFloat(viewData.costo_referencial).toFixed(2)} 
                                    <span className="text-[10px] text-slate-400 font-normal ml-1">por {viewData.unidad_compra?.nombre}</span>
                                </p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                                    <BuildingStorefrontIcon className="w-3 h-3"/> Precio Venta
                                </h4>
                                {viewData.es_venta_directa ? (
                                    <p className="text-sm font-black text-green-600">
                                        S/ {parseFloat(viewData.precio_venta).toFixed(2)}
                                        <span className="text-[10px] text-green-600/60 font-normal ml-1">por {viewData.unidad_medida?.nombre}</span>
                                    </p>
                                ) : (
                                    <p className="text-sm font-bold text-slate-400 italic">No aplica</p>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </ViewModal>
        </div>
    );
};

export default Index;