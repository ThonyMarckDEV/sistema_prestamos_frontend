import React, { useMemo, useState } from 'react';
import { useIndex } from 'hooks/Pago/useIndex';
import { useAuth } from 'context/AuthContext';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ViewModal from 'components/Shared/Modals/ViewModal';
import RechazarPagoModal from './RechazarPagoModal';
import PdfModal from 'components/Shared/Modals/PdfModal';
import { CheckIcon, XMarkIcon, BanknotesIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { FileSearch } from 'lucide-react';

const Index = () => {
    const { 
        loading, pagos, paginationInfo, filters, setFilters, alert, setAlert, fetchPagos, handleStatusChange,
        handleFilterSubmit, handleFilterClear,
        handleViewPdf, pdfLoading, isPdfModalOpen, setIsPdfModalOpen, pdfTitle, pdfBase64 
    } = useIndex();
    
    const { can } = useAuth();

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    
    const [activePago, setActivePago] = useState(null);
    const [isAprobarOpen, setIsAprobarOpen] = useState(false);
    const [montoVerificado, setMontoVerificado] = useState("");

    const [isRechazarOpen, setIsRechazarOpen] = useState(false);

    const openVoucher = (url) => {
        setSelectedVoucher(url);
        setIsViewModalOpen(true);
    };

    const filterConfig = useMemo(() => [
        { 
            name: 'search', 
            type: 'text', 
            label: 'Nombre / Dni / Ruc / Op.', 
            placeholder: 'Ej: 20332932...',
            colSpan: 'col-span-12 md:col-span-4' 
        },
        { 
            name: 'estado', 
            type: 'select', 
            label: 'Estado', 
            colSpan: 'col-span-12 md:col-span-3',
            options: [
                { value: '', label: 'TODOS LOS PAGOS' },
                { value: '0', label: 'PENDIENTES' },
                { value: '1', label: 'APROBADOS' },
                { value: '2', label: 'RECHAZADOS' }
            ]
        }
    ], []);

    const columns = useMemo(() => [
        { 
            header: 'ID / Fecha', 
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-mono text-[14px] font-black text-slate-600">
                        #{row.id}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold whitespace-nowrap">
                        {row.fecha}
                    </span>
                </div>
            )
        },
        {
            header: 'Comprobante / Op.',
            render: (row) => (
                <div className="flex flex-col">
                    {row.numero_comprobante ? (
                        <span className="font-mono text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 w-fit">
                            {row.numero_comprobante}
                        </span>
                    ) : (
                        <span className="font-mono text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 border-dashed w-fit italic">
                            Sin Recibo (En Espera)
                        </span>
                    )}
                    
                    <span className="font-mono text-[9px] font-bold text-slate-400 mt-1 uppercase">
                        Op: {row.numero_operacion || '---'}
                    </span>
                </div>
            )
        },
        {
            header: 'Titular y Detalle',
            render: (row) => (
                <div className="flex flex-col uppercase">
                    <span className="font-black text-[11px] text-slate-800 leading-tight">
                        {row.prestamo}
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold mt-0.5">
                        Depositó: <span className="text-slate-700">{row.depositado_por}</span>
                    </span>
                    <span className="text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-100 w-fit px-1.5 py-0.5 rounded mt-1 tracking-wider">
                        CUOTA #{row.cuota_nro}
                    </span>
                </div>
            )
        },
        {
            header: 'Monto y Modalidad',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-black text-emerald-600 text-sm">S/ {row.monto}</span>
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded w-fit mt-1 border border-slate-200 uppercase tracking-widest">
                        {row.modalidad}
                    </span>
                </div>
            )
        },
        {
            header: 'Estado / Registro',
            render: (row) => (
                <div className="flex flex-col items-start gap-1">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-wider ${
                        row.estado === 1 ? 'bg-green-100 text-green-700 border-green-200' :
                        row.estado === 2 ? 'bg-red-100 text-red-700 border-red-200' :
                        'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}>
                        {row.estado === 1 ? 'APROBADO' : row.estado === 2 ? 'RECHAZADO' : 'PENDIENTE'}
                    </span>

                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">
                        Aprobado por: <span className="text-slate-600">{row.registrado_por}</span>
                    </span>

                    {row.estado === 2 && row.observaciones && (
                        <div className="flex items-center gap-1 pl-2 border-l-2 border-red-500 max-w-[180px] mt-1">
                            <span className="text-[9px] font-semibold text-red-600 truncate" title={row.observaciones}>
                                {row.observaciones}
                            </span>
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex gap-2 items-center justify-end">
                    {row.comprobante_url && (
                        <button 
                            onClick={() => openVoucher(row.comprobante_url)}
                            title="Ver Voucher"
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl border border-transparent hover:border-emerald-100 transition-all shadow-sm"
                        >
                            <FileSearch className="w-4 h-4" />
                        </button>
                    )}

                    {row.estado === 1 && can('pago.generatePDF') && (
                        <button 
                            onClick={() => handleViewPdf(row.id)}
                            disabled={pdfLoading}
                            title="Imprimir Recibo"
                            className={`p-2 rounded-xl transition-all border border-transparent shadow-sm 
                            ${pdfLoading 
                                ? 'bg-slate-50 text-slate-300' 
                                : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100'
                            }`}
                        >
                            <PrinterIcon className={`w-4 h-4 ${pdfLoading ? 'animate-spin' : ''}`} />
                        </button>
                    )}

                    {row.estado === 0 && can('pago.status') && (
                        <div className="flex gap-1">
                            <button 
                                onClick={() => { 
                                    setActivePago(row); 
                                    setMontoVerificado(row.monto);
                                    setIsAprobarOpen(true); 
                                }}
                                title="Aprobar Pago"
                                className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all border border-transparent hover:border-green-100 shadow-sm"
                            >
                                <CheckIcon className="w-4 h-4" />
                            </button>

                            <button 
                                onClick={() => { setActivePago(row); setIsRechazarOpen(true); }}
                                title="Rechazar Pago"
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm"
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            )
        }
    ], [can, pdfLoading, handleViewPdf]);

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <PageHeader title="Control de Pagos" icon={BanknotesIcon} />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <Table 
                columns={columns} 
                data={pagos} 
                loading={loading}
                filterConfig={filterConfig}
                filters={filters}
                onFilterChange={(n, v) => setFilters(p => ({ ...p, [n]: v }))}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleFilterClear}
                pagination={{ ...paginationInfo, onPageChange: fetchPagos }} 
            />

            <ViewModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Voucher de Pago">
                <div className="flex justify-center bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                    <img src={selectedVoucher} alt="Voucher" className="max-w-full h-auto object-contain" style={{ maxHeight: '70vh' }} />
                </div>
            </ViewModal>

            {/* MODAL DE APROBACIÓN VERIFICADA */}
            {isAprobarOpen && activePago && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in duration-200">
                        <div className="mb-4">
                            <h3 className="text-lg font-black text-slate-800 uppercase flex items-center gap-2">
                                <CheckIcon className="w-6 h-6 text-green-500" /> Aprobar Abono
                            </h3>
                            <p className="text-xs text-slate-500 mt-2">
                                El cliente reportó un pago de <strong className="text-slate-800">S/ {activePago.monto}</strong>. 
                                Confirma el monto real ingresado a caja.
                            </p>
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-[10px] font-black uppercase text-slate-400 ml-1 mb-1">Monto Confirmado (S/)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                value={montoVerificado}
                                onChange={(e) => setMontoVerificado(e.target.value)}
                                className="w-full p-4 bg-slate-50 border-2 border-slate-200 focus:border-green-500 rounded-xl font-black text-green-600 text-lg outline-none transition-all text-center"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => setIsAprobarOpen(false)} className="flex-1 py-3 text-xs font-black uppercase text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancelar</button>
                            <button 
                                onClick={async () => {
                                    await handleStatusChange(activePago.id, 1, montoVerificado);
                                    setIsAprobarOpen(false);
                                }} 
                                disabled={loading || !montoVerificado || montoVerificado <= 0}
                                className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white text-xs font-black uppercase rounded-xl transition-all shadow-md disabled:opacity-50"
                            >
                                Confirmar Ingreso
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <RechazarPagoModal 
                isOpen={isRechazarOpen} 
                onClose={() => setIsRechazarOpen(false)} 
                onConfirm={async (m) => { await handleStatusChange(activePago?.id, 2, null, m); setIsRechazarOpen(false); }} 
                loading={loading} 
            />

            <PdfModal 
                isOpen={isPdfModalOpen} 
                onClose={() => setIsPdfModalOpen(false)} 
                title={pdfTitle} 
                base64={pdfBase64} 
            />
        </div>
    );
};

export default Index;