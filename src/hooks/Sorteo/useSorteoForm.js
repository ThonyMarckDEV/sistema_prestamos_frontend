/** Estado inicial y normalización del formulario de sorteo (compartido por Store y Update). */
export const EMPTY_SORTEO = {
    nombre: '',
    premio: '',
    descripcion: '',
    fecha_cierre: '',
    fecha_sorteo: '',
    tipo_prestamo: 'AMBOS',
    requiere_activo: true,
    min_liquidados: '1',
    sin_cuotas_vencidas: true,
    max_dias_atraso: '',
    evaluar_desde: '',
};

export const fromApi = (d) => ({
    nombre:              d.nombre || '',
    premio:              d.premio || '',
    descripcion:         d.descripcion || '',
    fecha_cierre:        d.fecha_cierre || '',
    fecha_sorteo:        d.fecha_sorteo || '',
    tipo_prestamo:       d.tipo_prestamo || 'AMBOS',
    requiere_activo:     !!d.requiere_activo,
    min_liquidados:      String(d.min_liquidados ?? 0),
    sin_cuotas_vencidas: !!d.sin_cuotas_vencidas,
    max_dias_atraso:     d.max_dias_atraso === null || d.max_dias_atraso === undefined ? '' : String(d.max_dias_atraso),
    evaluar_desde:       d.evaluar_desde || '',
});

const orNull = (v) => (v === '' || v === undefined ? null : v);

export const toPayload = (f) => {
    const historial = f.max_dias_atraso !== '' && f.max_dias_atraso !== null;
    return {
        nombre:              f.nombre.trim(),
        premio:              orNull(f.premio.trim()),
        descripcion:         orNull(f.descripcion.trim()),
        fecha_cierre:        orNull(f.fecha_cierre),
        fecha_sorteo:        orNull(f.fecha_sorteo),
        tipo_prestamo:       f.tipo_prestamo,
        requiere_activo:     !!f.requiere_activo,
        min_liquidados:      Number(f.min_liquidados || 0),
        sin_cuotas_vencidas: !!f.sin_cuotas_vencidas,
        max_dias_atraso:     historial ? Number(f.max_dias_atraso) : null,
        evaluar_desde:       historial ? orNull(f.evaluar_desde) : null,
    };
};
