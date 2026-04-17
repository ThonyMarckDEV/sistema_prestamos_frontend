import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useSolicitudForm } from './useSolicitudForm';

// Importa tus nuevas secciones
import SectionClienteGrupo from './SectionClienteGrupo';
import SectionCondiciones from './SectionCondiciones';
import SectionAval from './SectionAval';
import SectionNotas from './SectionNotas';

const SolicitudForm = ({ 
    data, 
    handleChange, 
    addIntegrante, 
    removeIntegrante, 
    updateMontoIntegrante,
    updateCargoIntegrante,
    isUpdate = false 
}) => {
    
    // Conecta el Hook
    const { 
        isBlocked, isMainBlocked, hasBlockedIntegrante, 
        avalConfig, calculadora 
    } = useSolicitudForm(data, handleChange);

    return (
        <div className={`space-y-6 transition-all duration-300 ${isBlocked ? 'opacity-90' : ''}`}>
            
            {/* ALERTA DE BLOQUEO GLOBAL */}
            {isBlocked && (
                <div className="bg-red-600 text-white p-5 rounded-2xl flex items-center gap-4 animate-bounce shadow-xl border-2 border-red-400">
                    <ExclamationTriangleIcon className="w-10 h-10 flex-shrink-0" />
                    <div>
                        <p className="font-black uppercase text-sm">Operación Bloqueada por Riesgo Crediticio</p>
                        <p className="text-[10px] font-bold opacity-90 text-white">
                            {hasBlockedIntegrante 
                                ? 'Uno o más integrantes del grupo tienen una restricción activa o deuda vigente (RCS / VIGENTE).' 
                                : `El cliente principal tiene la modalidad: ${data.modalidad}`}
                        </p>
                    </div>
                </div>
            )}

            {/* SWITCH INDIVIDUAL / GRUPAL */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit mx-auto border border-slate-200">
                <button 
                    type="button" 
                    onClick={() => !isUpdate && !isBlocked && handleChange('es_grupal', false)} 
                    disabled={isUpdate || isBlocked} 
                    className={`px-8 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${!data.es_grupal ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    Individual
                </button>
                <button 
                    type="button" 
                    onClick={() => !isUpdate && !isBlocked && handleChange('es_grupal', true)} 
                    disabled={isUpdate || isBlocked} 
                    className={`px-8 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${data.es_grupal ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    Grupal
                </button>
            </div>

            {/* SECCIONES MODULARES */}
            <SectionClienteGrupo 
                data={data} 
                handleChange={handleChange} 
                isBlocked={isBlocked} 
                isMainBlocked={isMainBlocked} 
                isUpdate={isUpdate} 
                addIntegrante={addIntegrante} 
                removeIntegrante={removeIntegrante} 
                updateMontoIntegrante={updateMontoIntegrante}
                updateCargoIntegrante={updateCargoIntegrante}
            />

            <SectionCondiciones 
                data={data} 
                handleChange={handleChange} 
                isBlocked={isBlocked} 
                calc={calculadora} 
            />

            <SectionAval 
                data={data} 
                handleChange={handleChange} 
                isBlocked={isBlocked} 
                config={avalConfig} 
            />

            <SectionNotas 
                data={data} 
                handleChange={handleChange} 
                isBlocked={isBlocked} 
            />

        </div>
    );
};

export default SolicitudForm;