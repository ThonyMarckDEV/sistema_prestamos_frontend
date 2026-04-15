import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/Producto/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { 
    ShoppingBagIcon, 
    PencilSquareIcon, 
    TrashIcon, 
    CircleStackIcon 
} from '@heroicons/react/24/outline';

const Index = () => {
    const { 
        loading, 
        productos, 
        paginationInfo, 
        filters, 
        alert, 
        setAlert, 
        handleToggleStatus, 
        fetchProductos,
        handleFilterChange, 
        handleFilterSubmit, 
        handleFilterClear,
        // Control del Modal de Confirmación
        isDeleteModalOpen,
        openDeleteModal,
        closeDeleteModal,
        handleConfirmDelete
    } = useIndex();

    // Configuración de los filtros de la tabla
    const filterConfig = useMemo(() => [
        { 
            name: 'search', 
            type: 'text', 
            label: 'Buscar producto', 
            placeholder: 'Ej: Consumo, Microempresas...', 
            colSpan: 'col-span-12 md:col-span-8' 
        },
        { 
            name: 'estado', 
            type: 'select', 
            label: 'Estado', 
            colSpan: 'col-span-12 md:col-span-4',
            options: [
                { value: '', label: 'Todos los estados' },
                { value: '1', label: 'Activos' },
                { value: '0', label: 'Inactivos' }
            ]
        }
    ], []);

    // Definición de columnas
    const columns = useMemo(() => [
        {
            header: 'Producto',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                        <CircleStackIcon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-slate-800 uppercase text-xs tracking-tight">
                            {row.nombre}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                            ID: #{row.id.toString().padStart(3, '0')}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Tasa Referencial',
            render: (row) => (
                <div className="flex items-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-red-50 text-red-700 font-black text-xs border border-red-100 shadow-sm">
                        {row.rango_tasa}%
                    </span>
                </div>
            )
        },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => handleToggleStatus(row.id)} 
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shadow-sm border
                        ${row.estado 
                            ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' 
                            : 'bg-red-100 text-red-600 border-red-200 hover:bg-red-200'}`}
                >
                    {row.estado ? 'Activo' : 'Inactivo'}
                </button>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-2 justify-end">

                    {/* EDITAR */}
                    <Link 
                        to={`/producto/editar/${row.id}`} 
                        title="Editar parámetros"
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100 shadow-sm"
                    >
                        <PencilSquareIcon className="w-4 h-4" />
                    </Link>

                    {/* DAR DE BAJA */}
                    <button 
                        onClick={() => openDeleteModal(row.id)} 
                        title="Dar de baja"
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>

                </div>
            )
        }
    ], [handleToggleStatus, openDeleteModal]);

    return (
        <div className="container mx-auto p-4 sm:p-6 animate-in fade-in duration-500">
            {/* Cabecera de Página */}
            <PageHeader 
                title="Productos Financieros" 
                subtitle="Configuración de tasas y catálogo de créditos disponibles."
                icon={ShoppingBagIcon} 
                buttonText="+ Nuevo Producto" 
                buttonLink="/producto/agregar" 
            />
            
            {/* Mensajes de Retroalimentación */}
            <AlertMessage 
                type={alert?.type} 
                message={alert?.message} 
                details={alert?.details} 
                onClose={() => setAlert(null)} 
            />
            
            {/* Tabla de Datos */}
            <div className="mt-4">
                <Table 
                    columns={columns} 
                    data={productos} 
                    loading={loading}
                    pagination={{ 
                        ...paginationInfo, 
                        onPageChange: fetchProductos 
                    }}
                    filterConfig={filterConfig}
                    filters={filters}
                    onFilterChange={handleFilterChange} 
                    onFilterSubmit={handleFilterSubmit} 
                    onFilterClear={handleFilterClear}
                />
            </div>

            {/* Modal de Confirmación para Eliminación */}
            {isDeleteModalOpen && (
                <ConfirmModal 
                    title="¿Eliminar Producto?"
                    message="¿Estás seguro de que deseas eliminar este producto? Esta acción podría afectar la visualización histórica de préstamos asociados si no se maneja con cuidado."
                    confirmText="Sí, eliminar producto"
                    cancelText="No, mantener"
                    onConfirm={handleConfirmDelete}
                    onCancel={closeDeleteModal}
                />
            )}
        </div>
    );
};

export default Index;