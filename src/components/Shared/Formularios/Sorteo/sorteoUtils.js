export const ESTADO = { CONFIGURACION: 1, GENERADO: 2, CERRADO: 3 };

export const ESTADO_BADGE = {
    1: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30',
    2: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30',
    3: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-dark-surface-alt dark:text-dark-text-muted dark:border-dark-border',
};

export const TIPO_LABEL = { INDIVIDUAL: 'Individual', GRUPAL: 'Grupal', AMBOS: 'Individual y grupal' };

/** 'YYYY-MM-DD' → 'DD/MM/YYYY' sin pasar por Date (evita el desfase de zona horaria). */
export const formatFecha = (iso) => {
    if (!iso) return '—';
    const [y, m, d] = String(iso).slice(0, 10).split('-');
    return `${d}/${m}/${y}`;
};

/** Fecha larga para el cliente: 'martes, 24 de diciembre de 2026'. */
export const formatFechaLarga = (iso) => {
    if (!iso) return null;
    const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-PE', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
};

/** Días que faltan desde hoy hasta la fecha (0 = hoy, negativo = ya pasó). */
export const diasRestantes = (iso) => {
    if (!iso) return null;
    const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    return Math.round((new Date(y, m - 1, d) - hoy) / 86400000);
};

/** Resumen legible de los criterios configurados (para el staff). */
export const describirCriterios = (s) => {
    if (!s) return [];
    const tipo = s.tipo_prestamo === 'AMBOS' ? '' : ` ${s.tipo_prestamo.toLowerCase()}`;
    const lista = [`Préstamos: ${TIPO_LABEL[s.tipo_prestamo] || s.tipo_prestamo}`];
    if (s.requiere_activo) lista.push(`Al menos 1 préstamo${tipo} vigente`);
    if (Number(s.min_liquidados) > 0) lista.push(`Mínimo ${s.min_liquidados} préstamo(s)${tipo} liquidado(s)`);
    if (s.sin_cuotas_vencidas) lista.push('Sin cuotas vencidas impagas hoy');
    if (s.max_dias_atraso !== null && s.max_dias_atraso !== undefined && s.max_dias_atraso !== '') {
        const n = Number(s.max_dias_atraso);
        let txt = n === 0 ? 'Nunca pagó tarde' : `Máx. ${n} día(s) útil(es) de atraso en su historial`;
        if (s.evaluar_desde) txt += ` (desde ${formatFecha(s.evaluar_desde)})`;
        lista.push(txt);
    }
    return lista;
};
