import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/Producto/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { ShoppingBagIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const Index = () => {
    const { 
        loading, 
        productos, 
        paginationInfo, 
        filters, 
        alert, 
        setAlert, 
        handleToggleStatus, 
        handleDelete, 
        handleFilterChange, 
        handleFilterSubmit, 
        handleFilterClear, 
        fetchProductos 
    } = useIndex();

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
                { value: '', label: 'Todos' },
                { value: '1', label: 'Activos' },
                { value: '0', label: 'Inactivos' }
            ]
        }
    ], []);

    const columns = useMemo(() => [
        {
            header: 'Producto',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                        <ShoppingBagIcon className="w-5 h-5 text-slate-600" />
                    </div>
                    <span className="font-black text-slate-800 uppercase text-sm">{row.nombre}</span>
                </div>
            )
        },
        {
            header: 'Tasa Referencial',
            render: (row) => (
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-red-50 text-red-700 font-black text-xs border border-red-100">
                    {row.rango_tasa}
                </span>
            )
        },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => handleToggleStatus(row.id)} 
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase cursor-pointer hover:scale-105 transition-transform shadow-sm
                        ${row.estado ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-600 border border-red-200'}`}
                >
                    {row.estado ? 'Activo' : 'Inactivo'}
                </button>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Link 
                        to={`/producto/editar/${row.id}`} 
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100"
                        title="Editar Producto"
                    >
                        <PencilSquareIcon className="w-5 h-5" />
                    </Link>
                    <button 
                        onClick={() => handleDelete(row.id)} 
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
                        title="Eliminar Producto"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ], [handleToggleStatus, handleDelete]);

    if (loading && productos.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <PageHeader 
                title="Productos de Crédito" 
                subtitle="Gestión de catálogo de préstamos y tasas referenciales"
                icon={ShoppingBagIcon} 
                buttonText="+ Nuevo Producto" 
                buttonLink="/producto/agregar" 
            />
            
            <AlertMessage 
                type={alert?.type} 
                message={alert?.message} 
                details={alert?.details} 
                onClose={() => setAlert(null)} 
            />
            
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
    );
};

export default Index;