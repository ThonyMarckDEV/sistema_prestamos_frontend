import React, { useState, useEffect, useRef } from 'react';
import { combobox } from 'services/cajaService'; // Asegúrate de importar el servicio correcto
import { MagnifyingGlassIcon, XMarkIcon, InboxStackIcon } from '@heroicons/react/24/outline';

const CajaSearchSelect = ({ onSelect, disabled, initialName = '' }) => {
    const [inputValue, setInputValue] = useState(initialName);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);

    // Cerrar sugerencias al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setShowSuggestions(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const fetchCajas = async (term = '') => {
        setLoading(true);
        try {
            const response = await combobox(term);
            // El backend devuelve paginado, así que tomamos la propiedad 'data'
            const dataCajas = response.data?.data || response.data || [];
            setSuggestions(dataCajas);
            setShowSuggestions(true);
        } catch (error) { 
            setSuggestions([]); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleChange = (e) => {
        const texto = e.target.value;
        setInputValue(texto);
        
        // Buscamos si hay al menos 1 letra para que sea rápido, o mostramos todas si está vacío
        if (texto.trim() === '') {
            fetchCajas(''); // Cargar lista inicial
        } else {
            fetchCajas(texto);
        }
    };

    const handleSelect = (caja) => {
        if (onSelect) {
            onSelect(caja); 
            setInputValue(caja.nombre); 
        }
        setShowSuggestions(false);
    };

    const handleClear = () => {
        if (disabled) return;
        setInputValue(''); 
        setSuggestions([]); 
        if (onSelect) onSelect(null); 
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative flex items-center group">
                <input
                    type="text" 
                    value={inputValue} 
                    onChange={handleChange}
                    onClick={() => {
                        if (!showSuggestions && !disabled) fetchCajas(inputValue);
                    }}
                    disabled={disabled}
                    placeholder="Buscar caja disponible..."
                    className="w-full border border-slate-300 rounded-xl shadow-sm pl-11 pr-10 py-3 text-sm font-bold focus:ring-2 focus:ring-red-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed"
                    autoComplete="off"
                />
                <div className={`absolute left-3.5 ${disabled ? 'text-slate-300' : 'text-slate-400'}`}>
                    <InboxStackIcon className="w-5 h-5" />
                </div>
                
                <div className="absolute right-3 flex items-center">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-slate-300 rounded-full animate-spin border-t-red-600"></div> 
                    ) : inputValue && !disabled ? (
                        <button onClick={handleClear} type="button" className="text-slate-400 hover:text-red-500 p-1 transition-colors">
                            <XMarkIcon className="w-5 h-5" />
                        </button> 
                    ) : (
                        <MagnifyingGlassIcon className={`w-4 h-4 ${disabled ? 'text-slate-300' : 'text-slate-400'}`} />
                    )}
                </div>

                {showSuggestions && !disabled && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-xl mt-1.5 max-h-72 overflow-y-auto shadow-2xl p-1.5 space-y-1">
                        {suggestions.length > 0 ? suggestions.map((caja) => (
                            <li 
                                key={caja.id} 
                                onClick={() => handleSelect(caja)} 
                                className="px-4 py-3 cursor-pointer rounded-lg border border-transparent hover:bg-red-50 hover:border-slate-100 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="uppercase font-black text-slate-800 text-xs flex items-center gap-1.5">
                                            <InboxStackIcon className="w-4 h-4 text-slate-500" /> {caja.nombre}
                                        </span>
                                        {caja.descripcion && (
                                            <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5 truncate max-w-[200px]">
                                                {caja.descripcion}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase border border-green-200">
                                            Disponible
                                        </span>
                                    </div>
                                </div>
                            </li>
                        )) : (
                            <li className="px-4 py-6 text-slate-400 text-xs text-center flex flex-col items-center gap-2">
                                <InboxStackIcon className="w-8 h-8 text-slate-200" />
                                <span className="font-bold">No hay cajas libres disponibles.</span>
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CajaSearchSelect;