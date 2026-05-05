import React, { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

/**
 * Botón reutilizable para exportar a Excel.
 *
 * Props:
 * - exportService: fn(filters) => Promise<Blob>  ← servicio que devuelve el blob del excel
 * - filters:       objeto con los filtros activos (fecha_inicio, fecha_fin, etc.)
 * - filename:      nombre del archivo sin extensión (default: 'reporte')
 * - label:         texto del botón (default: 'Excel')
 * - disabled:      deshabilitar externo
 */
const ExcelExportButton = ({
    exportService,
    filters     = {},
    filename    = 'reporte',
    label       = 'Excel',
    disabled    = false,
}) => {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        if (!exportService || loading) return;
        setLoading(true);
        try {
            const blob = await exportService(filters);
            const url  = window.URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href     = url;
            a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error al exportar Excel:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={disabled || loading || !exportService}
            title="Exportar a Excel"
            className={`
                flex items-center gap-1.5 px-3 py-2
                text-[10px] font-black uppercase tracking-widest
                rounded-lg border transition-all select-none
                ${loading || disabled || !exportService
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-white'
                    : 'border-emerald-600/30 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-600/50 active:scale-95'
                }
            `}
        >
            {loading ? (
                <>
                    <span className="w-3.5 h-3.5 border-2 border-emerald-300 border-t-emerald-700 rounded-full animate-spin flex-shrink-0" />
                    Exportando…
                </>
            ) : (
                <>
                    <ArrowDownTrayIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    {label}
                </>
            )}
        </button>
    );
};

export default ExcelExportButton;