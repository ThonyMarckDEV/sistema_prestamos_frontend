import React, { useState, useEffect, useRef } from 'react';
import { combobox } from 'services/zonaService';
import { MagnifyingGlassIcon, XMarkIcon, MapPinIcon } from '@heroicons/react/24/outline';

const ZonaSearchSelect = ({ onSelect, disabled, initialName = '' }) => {
    const [inputValue, setInputValue] = useState(initialName);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setShowSuggestions(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const fetchZonas = async (term = '') => {
        setLoading(true);
        try {
            // Mandamos el término de búsqueda al servicio
            const response = await combobox({ search: term });
            const dataZonas = response.data?.data || response.data || [];
            setSuggestions(dataZonas);
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
        
        if (texto.trim() === '') {
            fetchZonas('');
        } else {
            fetchZonas(texto);
        }
    };

    const handleSelect = (zona) => {
        if (onSelect) {
            onSelect(zona); 
            setInputValue(zona.nombre); 
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
                        if (!showSuggestions && !disabled) fetchZonas(inputValue);
                    }}
                    disabled={disabled}
                    placeholder="Buscar zona operativa..."
                    className="w-full border border-slate-300 rounded-xl shadow-sm pl-11 pr-10 py-3 text-sm font-bold focus:ring-2 focus:ring-red-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed"
                    autoComplete="off"
                />
                <div className={`absolute left-3.5 ${disabled ? 'text-slate-300' : 'text-red-500'}`}>
                    <MapPinIcon className="w-5 h-5" />
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
                        {suggestions.length > 0 ? suggestions.map((zona) => (
                            <li 
                                key={zona.id} 
                                onClick={() => handleSelect(zona)} 
                                className="px-4 py-3 cursor-pointer rounded-lg border border-transparent hover:bg-blue-50 hover:border-blue-100 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="uppercase font-black text-slate-800 text-xs flex items-center gap-1.5">
                                            <MapPinIcon className="w-4 h-4 text-slate-500" /> {zona.nombre}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase border border-green-200">
                                            Activa
                                        </span>
                                    </div>
                                </div>
                            </li>
                        )) : (
                            <li className="px-4 py-6 text-slate-400 text-xs text-center flex flex-col items-center gap-2">
                                <MapPinIcon className="w-8 h-8 text-slate-200" />
                                <span className="font-bold">No se encontraron zonas operativas.</span>
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ZonaSearchSelect;