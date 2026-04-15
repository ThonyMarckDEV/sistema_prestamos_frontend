import React, { useMemo } from 'react';
import { useIndex } from 'hooks/Prestamo/useIndex';
import { useAuth } from 'context/AuthContext';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import ViewModal from 'components/Shared/Modals/ViewModal';
import ViewPrestamoModal from './ViewPrestamoModal';
import { 
    BanknotesIcon, 
    EyeIcon, 
    ArrowUpTrayIcon, 
    PhotoIcon,
    ArrowPathIcon,
    UserGroupIcon,
    UserIcon
} from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, prestamos, paginationInfo, filters, alert, setAlert,
        handleFilterChange, handleFilterSubmit, handleFilterClear, fetchPrestamos,
        handleView, isViewOpen, setIsViewOpen, viewData, viewLoading,
        handleUploadAbono, uploadingAbono,
        handleOpenAbono, isAbonoModalOpen, setIsAbonoModalOpen, selectedAbonoUrl
    } = useIndex();

    const { role, can } = useAuth();

    const filterConfig = useMemo(() => {
        const config = [];
        if (role !== 'cliente') {
            config.push({ 
                name: 'search', type: 'text', label: 'Buscar Cliente / DNI / Grupo', 
                placeholder: 'Ej: Mendoza o Los Halcones...', colSpan: 'col-span-12 md:col-span-8' 
            });
        }
        config.push({ 
            name: 'estado', type: 'select', label: 'Estado Préstamo', 
            colSpan: role !== 'cliente' ? 'col-span-12 md:col-span-4' : 'col-span-12',
            options: [
                { value: '1', label: 'VIGENTES' },
                { value: '2', label: 'CANCELADOS' },
                { value: '3', label: 'LIQUIDADOS' },
                { value: 'all', label: 'TODOS' }
            ]
        });
        return config;
    }, [role]);

    const columns = useMemo(() => [
        { 
            header: 'ID', 
            render: (row) => (
                <span className="font-mono text-[15px] font-black px-2 py-1 rounded text-slate-600">
                    {row.id}
                </span>
            )
        },
        { header: 'Cliente / Producto', render: (row) => (
            <div className="flex flex-col uppercase">
                {/* 🔥 Icono dinámico si es Grupo o Cliente Individual */}
                <div className="flex items-center gap-1.5">
                    {row.es_grupal ? <UserGroupIcon className="w-3.5 h-3.5 text-blue-600" /> : <UserIcon className="w-3.5 h-3.5 text-slate-400" />}
                    <span className={`font-black text-[11px] ${row.es_grupal ? 'text-blue-700' : 'text-slate-800'}`}>
                        {row.cliente}
                    </span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold mt-0.5 ml-5">{row.producto}</span>
            </div>
        )},
        { header: 'Financiero', render: (row) => (
            <div className="flex flex-col">
                <span className="font-black text-red-600 italic text-sm">S/ {row.monto}</span>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">{row.abonado_por}</span>
            </div>
        )},
        { header: 'Cuotas', render: (row) => (
            <div className="flex flex-col">
                <span className="text-xs font-black text-slate-700">{row.cuotas_detalle}</span>
                <span className="text-[9px] text-slate-400 uppercase font-bold">{row.frecuencia}</span>
            </div>
        )},
        { header: 'Estado', render: (row) => {
            const colors = { 1: 'bg-green-50 text-green-700 border-green-100', 2: 'bg-slate-50 text-slate-600 border-slate-100', 3: 'bg-blue-50 text-blue-700 border-blue-100' };
            const labels = { 1: 'VIGENTE', 2: 'CANCELADO', 3: 'LIQUIDADO' };
            return <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${colors[row.estado]}`}>{labels[row.estado]}</span>
        }},
        { header: 'Acciones', render: (row) => (
            <div className="flex gap-2 items-center justify-end">
                <button onClick={() => handleView(row.id)} title="Ver Cronograma" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100 shadow-sm">
                    <EyeIcon className="w-4 h-4" />
                </button>

                {row.abonado_por === 'CUENTA CORRIENTE' && can('prestamo.abono') && (
                    <label title="Subir Abono" className={`cursor-pointer p-2 rounded-xl transition-all border border-transparent shadow-sm ${uploadingAbono ? 'bg-slate-50' : 'text-slate-400 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-100'}`}>
                        <input 
                            type="file" className="hidden" accept="image/*"
                            onChange={(e) => {
                                if (e.target.files[0]) handleUploadAbono(row.id, e.target.files[0]);
                                e.target.value = null; 
                            }} 
                        />
                        {uploadingAbono ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <ArrowUpTrayIcon className="w-4 h-4" />}
                    </label>
                )}

                {row.abono_url && (
                    <button 
                        onClick={() => handleOpenAbono(row.abono_url)}
                        title="Ver Comprobante" 
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl border border-transparent hover:border-emerald-100 transition-all shadow-sm"
                    >
                        <PhotoIcon className="w-4 h-4" />
                    </button>
                )}
            </div>
        )}
    ], [handleView, can, uploadingAbono, handleUploadAbono, handleOpenAbono]);

    if (loading && prestamos.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
            <PageHeader title="Cartera de Préstamos" icon={BanknotesIcon} />
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            
            <Table 
                columns={columns} data={prestamos} loading={loading} 
                pagination={{ ...paginationInfo, onPageChange: fetchPrestamos }} 
                onFilterChange={handleFilterChange} onFilterSubmit={handleFilterSubmit} onFilterClear={handleFilterClear} 
                filters={filters} filterConfig={filterConfig}
            />

            <ViewPrestamoModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} data={viewData} isLoading={viewLoading} />

            <ViewModal isOpen={isAbonoModalOpen} onClose={() => setIsAbonoModalOpen(false)} title="Voucher de Abono Bancario">
                <div className="flex justify-center bg-slate-50 rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                    {selectedAbonoUrl ? (
                        <img 
                            src={selectedAbonoUrl} 
                            alt="Abono" 
                            className="max-w-full h-auto object-contain"
                            style={{ maxHeight: '75vh' }}
                        />
                    ) : (
                        <div className="py-20 text-center">
                            <ArrowPathIcon className="w-10 h-10 animate-spin text-slate-300 mx-auto" />
                            <p className="mt-4 text-slate-400 font-black uppercase text-[10px] tracking-widest">Cargando imagen...</p>
                        </div>
                    )}
                </div>
            </ViewModal>
        </div>
    );
};

export default Index;