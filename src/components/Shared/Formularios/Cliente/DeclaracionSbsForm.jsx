import React from 'react';
import { ShieldCheckIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { onlyNumbers, toUpper } from 'utilities/Validations/validations';

/**
 * Declaración Jurada SBS (Res. SBS N° 789-2018 — prevención LA/FT).
 * Formulario reutilizable para Prospecto (datos planos) y Cliente (datos_cliente).
 *
 * Preguntas encadenadas:
 *  - Estado civil CASADO / CONVIVIENTE → nombre del cónyuge.
 *  - ¿Es PEP? SÍ → institución, cargo y familiares (nombres + parentesco).
 *  - ¿Capital > 25%? SÍ → empresas (RUC + razón social).
 *  - ¿Familiar de PEP? SÍ → nombre del familiar y cargo.
 *  Si responde NO, los campos dependientes se ocultan y se limpian.
 */

export const ESTADOS_CIVILES = ['SOLTERO', 'CASADO', 'CONVIVIENTE', 'DIVORCIADO', 'VIUDO'];
export const ESTADOS_CON_CONYUGE = ['CASADO', 'CONVIVIENTE'];

export const PARENTESCOS = [
    { value: 'CONYUGE',               label: 'CÓNYUGE' },
    { value: 'HIJO(A)',               label: 'HIJO(A)' },
    { value: 'PADRE',                 label: 'PADRE' },
    { value: 'MADRE',                 label: 'MADRE' },
    { value: 'ABUELO(A)',             label: 'ABUELO(A)' },
    { value: 'HERMANO(A)',            label: 'HERMANO(A)' },
    { value: 'NIETO(A)',              label: 'NIETO(A)' },
    { value: 'HIJO(A) POLITICO(A)',   label: 'HIJO(A) POLÍTICO(A)' },
    { value: 'SUEGRO(A)',             label: 'SUEGRO(A)' },
    { value: 'ABUELO(A) DEL CONYUGE', label: 'ABUELO(A) DEL CÓNYUGE' },
    { value: 'CUNADO(A)',             label: 'CUÑADO(A)' },
];

/** Estado inicial de los campos SBS (para registros nuevos). */
export const SBS_INITIAL = {
    nacionalidad: 'PERUANA', pais_residencia: 'PERU', ocupacion: '',
    estado_civil: '', nombre_conyuge: '',
    es_pep: null, pep_institucion: '', pep_cargo: '', pep_familiares: [],
    tiene_capital_25: null, empresas_capital: [],
    es_familiar_pep: null, familiar_pep_nombre: '', familiar_pep_cargo: '',
};

const toBoolOrNull = (v) => (v === null || v === undefined || v === '' ? null : (v === true || v === 1 || v === '1'));

/** Mapea la respuesta del API a estado de formulario (clientes antiguos traen null). */
export const mapSbsFromApi = (d = {}) => ({
    nacionalidad:        d.nacionalidad        || '',
    pais_residencia:     d.pais_residencia     || '',
    ocupacion:           d.ocupacion           || '',
    estado_civil:        d.estado_civil        || '',
    nombre_conyuge:      d.nombre_conyuge      || '',
    es_pep:              toBoolOrNull(d.es_pep),
    pep_institucion:     d.pep_institucion     || '',
    pep_cargo:           d.pep_cargo           || '',
    pep_familiares:      Array.isArray(d.pep_familiares) ? d.pep_familiares : [],
    tiene_capital_25:    toBoolOrNull(d.tiene_capital_25),
    empresas_capital:    Array.isArray(d.empresas_capital) ? d.empresas_capital : [],
    es_familiar_pep:     toBoolOrNull(d.es_familiar_pep),
    familiar_pep_nombre: d.familiar_pep_nombre || '',
    familiar_pep_cargo:  d.familiar_pep_cargo  || '',
});

/**
 * Validación previa al envío (el backend valida igual).
 * Devuelve el primer mensaje de error o null si está completo.
 */
export const validarDeclaracionSbs = (d, { centroTrabajo } = {}) => {
    const vacio = (v) => !v || String(v).trim() === '';
    if (vacio(d.nacionalidad))    return 'Declaración SBS: la nacionalidad es obligatoria.';
    if (vacio(d.pais_residencia)) return 'Declaración SBS: el país de residencia es obligatorio.';
    if (vacio(d.ocupacion))       return 'Declaración SBS: la ocupación es obligatoria.';
    if (centroTrabajo !== undefined && vacio(centroTrabajo)) return 'Declaración SBS: el centro de trabajo es obligatorio.';
    if (vacio(d.estado_civil))    return 'Declaración SBS: el estado civil es obligatorio.';
    if (ESTADOS_CON_CONYUGE.includes(d.estado_civil) && vacio(d.nombre_conyuge))
        return 'Declaración SBS: el nombre del cónyuge es obligatorio.';

    if (d.es_pep === null) return 'Declaración SBS: responda si es una persona políticamente expuesta.';
    if (d.es_pep) {
        if (vacio(d.pep_institucion) || vacio(d.pep_cargo)) return 'Declaración SBS: ingrese la institución y el cargo (PEP).';
        if (!d.pep_familiares?.length) return 'Declaración SBS: registre al menos un familiar del PEP.';
        if (d.pep_familiares.some(f => vacio(f.nombres) || vacio(f.parentesco)))
            return 'Declaración SBS: complete nombre y parentesco de cada familiar del PEP.';
    }

    if (d.tiene_capital_25 === null) return 'Declaración SBS: responda si tiene capital social mayor al 25% en alguna empresa.';
    if (d.tiene_capital_25) {
        if (!d.empresas_capital?.length) return 'Declaración SBS: registre al menos una empresa (capital > 25%).';
        if (d.empresas_capital.some(e => String(e.ruc || '').length !== 11 || vacio(e.razon_social)))
            return 'Declaración SBS: cada empresa debe tener RUC (11 dígitos) y razón social.';
    }

    if (d.es_familiar_pep === null) return 'Declaración SBS: responda si es familiar de una persona políticamente expuesta.';
    if (d.es_familiar_pep && (vacio(d.familiar_pep_nombre) || vacio(d.familiar_pep_cargo)))
        return 'Declaración SBS: ingrese el nombre y cargo del familiar PEP.';

    return null;
};

const inputClass = "w-full p-3 text-sm text-slate-800 dark:text-dark-text bg-slate-50 dark:bg-dark-surface-alt border border-slate-200 dark:border-dark-border rounded-xl focus:ring-2 focus:ring-brand-red dark:focus:ring-brand-gold outline-none placeholder-slate-400 dark:placeholder-dark-text-muted/60 transition-colors";
const labelClass = "block text-[11px] font-bold text-slate-500 dark:text-dark-text-muted uppercase mb-1 transition-colors";

/* Botones SÍ / NO */
const SiNo = ({ value, onChange }) => (
    <div className="flex gap-2 shrink-0">
        {[{ v: true, t: 'SÍ' }, { v: false, t: 'NO' }].map(({ v, t }) => (
            <button key={t} type="button" onClick={() => onChange(v)}
                className={`px-4 py-1.5 rounded-lg border-2 text-xs font-black transition-all ${
                    value === v
                        ? (v ? 'bg-brand-red-light dark:bg-brand-gold/15 text-brand-red dark:text-brand-gold border-brand-red dark:border-brand-gold'
                             : 'bg-slate-800 dark:bg-dark-text text-white dark:text-dark-surface border-slate-800 dark:border-dark-text')
                        : 'bg-white dark:bg-dark-surface-alt text-slate-500 dark:text-dark-text-muted border-slate-200 dark:border-dark-border hover:border-slate-300'
                }`}>
                {t}
            </button>
        ))}
    </div>
);

/* Pregunta con sub-campos encadenados */
const Pregunta = ({ titulo, value, onChange, children }) => (
    <div className={`sm:col-span-2 rounded-xl border p-4 transition-colors ${
        value === null ? 'border-amber-300 dark:border-amber-500/40 bg-amber-50/40 dark:bg-amber-500/5' : 'border-slate-200 dark:border-dark-border'
    }`}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs font-black text-slate-700 dark:text-dark-text uppercase">{titulo} *</p>
            <SiNo value={value} onChange={onChange} />
        </div>
        {value === true && <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>}
    </div>
);

/**
 * @param data          objeto con los campos SBS (planos)
 * @param onChange      (field, value) => void
 * @param centroTrabajo { value, onChange } — opcional; si se pasa, muestra el campo "Centro de trabajo"
 */
const DeclaracionSbsForm = ({ data, onChange, centroTrabajo = null }) => {
    const d = data;

    const setPregunta = (campo, valor, limpiar) => {
        onChange(campo, valor);
        if (!valor) limpiar.forEach(([f, v]) => onChange(f, v));
    };

    // Listas dinámicas
    const updList  = (campo, idx, key, val) => onChange(campo, (d[campo] || []).map((it, i) => i === idx ? { ...it, [key]: val } : it));
    const addList  = (campo, vacio) => onChange(campo, [...(d[campo] || []), vacio]);
    const delList  = (campo, idx) => onChange(campo, (d[campo] || []).filter((_, i) => i !== idx));

    const conConyuge = ESTADOS_CON_CONYUGE.includes(d.estado_civil);

    return (
        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm dark:shadow-black/25 border border-slate-100 dark:border-dark-border transition-colors">
            <h3 className="text-base font-black text-slate-800 dark:text-dark-text flex items-center gap-2 mb-1 uppercase tracking-wide transition-colors">
                <ShieldCheckIcon className="w-5 h-5 text-brand-red dark:text-brand-gold" /> Declaración Jurada SBS
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-dark-text-muted mb-5">
                Res. SBS N° 789-2018 — Prevención del lavado de activos y financiamiento del terrorismo. Todos los campos son obligatorios.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Nacionalidad *</label>
                    <input type="text" value={d.nacionalidad || ''} required placeholder="EJ: PERUANA"
                        onChange={(e) => onChange('nacionalidad', toUpper(e.target.value))} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>País de residencia *</label>
                    <input type="text" value={d.pais_residencia || ''} required placeholder="EJ: PERU"
                        onChange={(e) => onChange('pais_residencia', toUpper(e.target.value))} className={inputClass} />
                </div>
                <div className={centroTrabajo ? '' : 'sm:col-span-2'}>
                    <label className={labelClass}>Ocupación *</label>
                    <input type="text" value={d.ocupacion || ''} required placeholder="EJ: COMERCIANTE"
                        onChange={(e) => onChange('ocupacion', toUpper(e.target.value))} className={inputClass} />
                </div>
                {centroTrabajo && (
                    <div>
                        <label className={labelClass}>Centro de trabajo *</label>
                        <input type="text" value={centroTrabajo.value || ''} required placeholder="EJ: NEGOCIO PROPIO"
                            onChange={(e) => centroTrabajo.onChange(toUpper(e.target.value))} className={inputClass} />
                    </div>
                )}
                <div>
                    <label className={labelClass}>Estado civil *</label>
                    <select value={d.estado_civil || ''} required className={inputClass}
                        onChange={(e) => {
                            onChange('estado_civil', e.target.value);
                            if (!ESTADOS_CON_CONYUGE.includes(e.target.value)) onChange('nombre_conyuge', '');
                        }}>
                        <option value="">-- Seleccionar --</option>
                        {ESTADOS_CIVILES.map(ec => <option key={ec} value={ec}>{ec}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Nombre del cónyuge {conConyuge ? '*' : '(N/A)'}</label>
                    <input type="text" value={d.nombre_conyuge || ''} required={conConyuge} disabled={!conConyuge}
                        placeholder={conConyuge ? 'NOMBRE COMPLETO' : 'NO APLICA'}
                        onChange={(e) => onChange('nombre_conyuge', toUpper(e.target.value))}
                        className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`} />
                </div>

                {/* ── ¿Es PEP? ── */}
                <Pregunta titulo="¿Es una persona políticamente expuesta (PEP)?" value={d.es_pep}
                    onChange={(v) => setPregunta('es_pep', v, [['pep_institucion', ''], ['pep_cargo', ''], ['pep_familiares', []]])}>
                    <div>
                        <label className={labelClass}>Nombre de institución *</label>
                        <input type="text" value={d.pep_institucion || ''} required
                            onChange={(e) => onChange('pep_institucion', toUpper(e.target.value))} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Cargo *</label>
                        <input type="text" value={d.pep_cargo || ''} required
                            onChange={(e) => onChange('pep_cargo', toUpper(e.target.value))} className={inputClass} />
                    </div>
                    <div className="sm:col-span-2">
                        <p className="text-[10px] text-slate-500 dark:text-dark-text-muted mb-2">
                            Nombre completo de hijos(as), padres, abuelos, hermanos, nietos, hijos políticos, suegros, abuelos del cónyuge y cuñados. *
                        </p>
                        <div className="space-y-2">
                            {(d.pep_familiares || []).map((f, i) => (
                                <div key={i} className="grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1fr)_11rem_auto] gap-2 items-start">
                                    <input type="text" value={f.nombres || ''} required placeholder="NOMBRES COMPLETOS"
                                        onChange={(e) => updList('pep_familiares', i, 'nombres', toUpper(e.target.value))}
                                        className={`${inputClass} col-span-1`} />
                                    <select value={f.parentesco || ''} required
                                        onChange={(e) => updList('pep_familiares', i, 'parentesco', e.target.value)}
                                        className={`${inputClass} row-start-2 sm:row-start-auto`}>
                                        <option value="">Parentesco</option>
                                        {PARENTESCOS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                                    </select>
                                    <button type="button" onClick={() => delList('pep_familiares', i)}
                                        className="row-start-1 col-start-2 sm:col-start-3 p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => addList('pep_familiares', { nombres: '', parentesco: '' })}
                            className="mt-2 flex items-center gap-1 text-[11px] font-black uppercase text-brand-red dark:text-brand-gold hover:underline">
                            <PlusIcon className="w-3.5 h-3.5" /> Agregar familiar
                        </button>
                    </div>
                </Pregunta>

                {/* ── ¿Capital > 25%? ── */}
                <Pregunta titulo="¿Tiene capital social mayor al 25% en alguna empresa?" value={d.tiene_capital_25}
                    onChange={(v) => setPregunta('tiene_capital_25', v, [['empresas_capital', []]])}>
                    <div className="sm:col-span-2">
                        <div className="space-y-2">
                            {(d.empresas_capital || []).map((emp, i) => (
                                <div key={i} className="grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[11rem_minmax(0,1fr)_auto] gap-2 items-start">
                                    <input type="text" value={emp.ruc || ''} required placeholder="RUC (11 DÍGITOS)" inputMode="numeric"
                                        onChange={(e) => updList('empresas_capital', i, 'ruc', onlyNumbers(e.target.value, 11))}
                                        className={inputClass} />
                                    <input type="text" value={emp.razon_social || ''} required placeholder="RAZÓN SOCIAL"
                                        onChange={(e) => updList('empresas_capital', i, 'razon_social', toUpper(e.target.value))}
                                        className={`${inputClass} row-start-2 sm:row-start-auto`} />
                                    <button type="button" onClick={() => delList('empresas_capital', i)}
                                        className="row-start-1 col-start-2 sm:col-start-3 p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => addList('empresas_capital', { ruc: '', razon_social: '' })}
                            className="mt-2 flex items-center gap-1 text-[11px] font-black uppercase text-brand-red dark:text-brand-gold hover:underline">
                            <PlusIcon className="w-3.5 h-3.5" /> Agregar empresa
                        </button>
                    </div>
                </Pregunta>

                {/* ── ¿Familiar de PEP? ── */}
                <Pregunta titulo="¿Es familiar de una persona políticamente expuesta?" value={d.es_familiar_pep}
                    onChange={(v) => setPregunta('es_familiar_pep', v, [['familiar_pep_nombre', ''], ['familiar_pep_cargo', '']])}>
                    <div>
                        <label className={labelClass}>Nombre completo de familiar *</label>
                        <input type="text" value={d.familiar_pep_nombre || ''} required
                            onChange={(e) => onChange('familiar_pep_nombre', toUpper(e.target.value))} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Cargo que ocupa(ó) *</label>
                        <input type="text" value={d.familiar_pep_cargo || ''} required
                            onChange={(e) => onChange('familiar_pep_cargo', toUpper(e.target.value))} className={inputClass} />
                    </div>
                </Pregunta>
            </div>
        </div>
    );
};

export default DeclaracionSbsForm;
