import React, { useState, useEffect, useRef } from 'react';
import { combobox } from 'services/productoService';
import { 
    MagnifyingGlassIcon, 
    XMarkIcon, 
    ChevronRightIcon, 
    ShoppingBagIcon, 
    PresentationChartLineIcon 
} from '@heroicons/react/24/outline';

const ProductoSearchSelect = ({ onSelect, disabled, initialName = '' }) => {
    const [inputValue, setInputValue] = useState(initialName);
    const [productos, setProductos] = useState([]); 
    const [suggestions, setSuggestions] = useState([]); 
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);

    useEffect(() => {
        setInputValue(initialName || '');
    }, [initialName]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setShowSuggestions(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const fetchProductos = async () => {
        if (productos.length > 0) {
            setSuggestions(productos);
            setShowSuggestions(true);
            return;
        }

        setLoading(true);
        try {
            const response = await combobox();
            const dataProd = response.data || response || [];
            
            setProductos(dataProd);
            setSuggestions(dataProd);
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
            setSuggestions(productos);
        } else {
            const filtrados = productos.filter(p => 
                p.nombre.toLowerCase().includes(texto.toLowerCase())
            );
            setSuggestions(filtrados);
        }
        setShowSuggestions(true);
    };

    const handleSelect = (producto) => {
        if (onSelect) {
            onSelect(producto); 
            setInputValue(producto.nombre); 
        }
        setShowSuggestions(false);
    };

    const handleClear = () => {
        if (disabled) return;
        setInputValue(''); 
        setSuggestions(productos); 
        if (onSelect) onSelect(null); 
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative flex items-center group">
                <input
                    type="text" 
                    value={inputValue} 
                    onChange={handleChange}
                    onClick={() => !showSuggestions && !disabled && fetchProductos()}
                    disabled={disabled}
                    placeholder="Buscar producto (ej. Consumo, Pyme)..."
                    className="w-full border border-slate-300 rounded-lg shadow-sm pl-9 pr-8 py-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none bg-white transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed"
                    autoComplete="off"
                />
                <div className={`absolute left-3 ${disabled ? 'text-slate-300' : 'text-slate-400 group-focus-within:text-brand-red transition-colors'}`}>
                    <ShoppingBagIcon className="w-4 h-4" />
                </div>
                
                <div className="absolute right-2 flex items-center">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-brand-red rounded-full animate-spin"></div> 
                    ) : inputValue && !disabled ? (
                        <button onClick={handleClear} type="button" className="text-slate-400 hover:text-brand-red p-1 transition-colors">
                            <XMarkIcon className="w-4 h-4" />
                        </button> 
                    ) : (
                        <MagnifyingGlassIcon className={`w-4 h-4 ${disabled ? 'text-slate-300' : 'text-slate-400'}`} />
                    )}
                </div>

                {showSuggestions && !disabled && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl">
                        {suggestions.length > 0 ? suggestions.map((p) => (
                            <li 
                                key={p.id} 
                                onClick={() => handleSelect(p)} 
                                className="px-4 py-2.5 cursor-pointer text-sm flex items-center justify-between hover:bg-brand-red-light border-b border-slate-100 last:border-0 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-brand-red-light p-1.5 rounded-md border border-brand-red/20">
                                        <ShoppingBagIcon className="w-5 h-5 text-brand-red" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="uppercase font-bold text-slate-800">
                                            {p.nombre}
                                        </span>
                                        <span className="text-[10px] text-brand-red font-bold flex items-center gap-1 mt-0.5 uppercase">
                                            <PresentationChartLineIcon className="w-3 h-3" /> Tasa: {p.rango_tasa}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ChevronRightIcon className="w-4 h-4 text-slate-400" />
                                </div>
                            </li>
                        )) : (
                            <li className="px-4 py-6 text-slate-400 text-xs text-center flex flex-col items-center gap-2">
                                <ShoppingBagIcon className="w-8 h-8 text-slate-200" />
                                <span>No se encontraron productos activos.</span>
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ProductoSearchSelect;