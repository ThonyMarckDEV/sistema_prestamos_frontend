import React, { useState, useEffect, useRef } from 'react';
import { combobox } from 'services/clienteService'; 
import { MagnifyingGlassIcon, XMarkIcon, ChevronRightIcon, UserIcon, IdentificationIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const ClienteSearchSelect = ({ onSelect, disabled, initialName = '' }) => {
    const [inputValue, setInputValue] = useState(initialName);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null); 

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

    const fetchClientes = async (searchTerm = '') => {
        setLoading(true);
        try {
            const response = await combobox(1, { search: searchTerm, estado: '1' });
            setSuggestions(response.data || []);
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
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchClientes(texto), 500);
    };

    const handleSelect = (cliente) => {
        if (onSelect) {
            onSelect({ id: cliente.usuario_id }); 
            setInputValue(cliente.nombre_completo); 
        }
        setShowSuggestions(false);
    };

    const handleClear = () => {
        if (disabled) return;
        setInputValue(''); 
        fetchClientes(''); 
        if (onSelect) onSelect({id: null}); 
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative flex items-center group">
                <input
                    type="text" 
                    value={inputValue} 
                    onChange={handleChange}
                    onClick={() => !showSuggestions && !disabled && fetchClientes(inputValue)}
                    disabled={disabled}
                    placeholder="Buscar cliente (ej. Christian Ruiz, 4133...)..."
                    className="w-full border border-slate-300 rounded-lg shadow-sm pl-9 pr-8 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white transition-all disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed font-medium"
                    autoComplete="off"
                />
                <div className={`absolute left-3 ${disabled ? 'text-slate-300' : 'text-slate-400'}`}>
                    <UserIcon className="w-4 h-4" />
                </div>
                
                <div className="absolute right-2 flex items-center">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin"></div> 
                    ) : inputValue && !disabled ? (
                        <button onClick={handleClear} type="button" className="text-slate-400 hover:text-red-500 p-1">
                            <XMarkIcon className="w-4 h-4" />
                        </button> 
                    ) : (
                        <MagnifyingGlassIcon className={`w-4 h-4 ${disabled ? 'text-slate-300' : 'text-slate-400'}`} />
                    )}
                </div>

                {showSuggestions && !disabled && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl">
                        {suggestions.length > 0 ? suggestions.map((cliente) => {
                            const isEmpresa = cliente.tipo === 2;
                            const IconoCliente = isEmpresa ? BuildingOfficeIcon : UserIcon;
                            const badgeColor = isEmpresa 
                                ? 'bg-amber-100 text-amber-700 border-amber-200' 
                                : 'bg-emerald-100 text-emerald-700 border-emerald-200';
                            const badgeText = isEmpresa ? 'EMPRESA' : 'CLIENTE';

                            return (
                                <li 
                                    key={cliente.id} 
                                    onClick={() => handleSelect(cliente)} 
                                    className="px-4 py-2.5 cursor-pointer text-sm flex items-center justify-between hover:bg-indigo-50 border-b border-slate-100 last:border-0 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-indigo-100 p-1.5 rounded-md">
                                            <IconoCliente className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="uppercase font-bold text-slate-800">
                                                {cliente.nombre_completo}
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                                                <IdentificationIcon className="w-3 h-3 text-slate-400" />
                                                {isEmpresa ? 'RUC:' : 'DNI:'} {cliente.documento}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${badgeColor}`}>
                                            {badgeText}
                                        </span>
                                        <ChevronRightIcon className="w-4 h-4 text-indigo-400" />
                                    </div>
                                </li>
                            );
                        }) : (
                            <li className="px-4 py-6 text-slate-400 text-xs text-center flex flex-col items-center gap-2">
                                <UserIcon className="w-8 h-8 text-slate-200" />
                                <span>No se encontraron clientes activos.</span>
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ClienteSearchSelect;