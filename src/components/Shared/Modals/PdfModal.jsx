import React, { useEffect } from 'react';
import { 
    XMarkIcon, 
    PrinterIcon, 
    MagnifyingGlassPlusIcon, 
    MagnifyingGlassMinusIcon 
} from '@heroicons/react/24/outline';

import { Worker, Viewer } from '@react-pdf-viewer/core';
import { zoomPlugin } from '@react-pdf-viewer/zoom';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';

const isMobile = () =>
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

const PdfModal = ({ isOpen, onClose, title, pdfUrl }) => {
    const zoomPluginInstance = zoomPlugin();
    const { ZoomIn, ZoomOut, ZoomPopover } = zoomPluginInstance;

    useEffect(() => {
        if (!isOpen) return;

        // Guardar posición actual del scroll
        const scrollY = window.scrollY;

        // Bloquear scroll en body y html
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';

        return () => {
            // Restaurar todo al cerrar
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollY);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handlePrint = () => {
        if (isMobile()) {
            window.open(pdfUrl, '_blank');
        } else {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = pdfUrl;
            document.body.appendChild(iframe);
            iframe.onload = () => {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                setTimeout(() => document.body.removeChild(iframe), 60000);
            };
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">

            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden border border-slate-700">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-slate-50">
                    <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{title}</h3>
                        <p className="text-[10px] text-slate-500 font-medium uppercase">Vista Previa HD</p>
                    </div>

                    {/* Zoom */}
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm gap-1">
                        <ZoomOut>{(props) => (
                            <button onClick={props.onClick} className="p-1.5 hover:bg-slate-100 rounded text-slate-600">
                                <MagnifyingGlassMinusIcon className="w-5 h-5" />
                            </button>
                        )}</ZoomOut>
                        <div className="px-2 text-xs font-bold text-slate-500 min-w-[50px] text-center">
                            <ZoomPopover />
                        </div>
                        <ZoomIn>{(props) => (
                            <button onClick={props.onClick} className="p-1.5 hover:bg-slate-100 rounded text-slate-600">
                                <MagnifyingGlassPlusIcon className="w-5 h-5" />
                            </button>
                        )}</ZoomIn>
                    </div>

                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 bg-slate-200 overflow-hidden relative">
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        <Viewer
                            fileUrl={pdfUrl}
                            plugins={[zoomPluginInstance]}
                            defaultScale={1.5}
                            imageResourcesScale={2}
                        />
                    </Worker>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end">
                    <button
                        onClick={handlePrint}
                        className="px-12 py-3.5 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg flex items-center gap-2 uppercase text-sm tracking-widest"
                    >
                        <PrinterIcon className="w-5 h-5" />
                        {isMobile() ? 'ABRIR PDF' : 'IMPRIMIR AHORA'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PdfModal;