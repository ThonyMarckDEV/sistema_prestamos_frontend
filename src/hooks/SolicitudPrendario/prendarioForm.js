// Estado y payload compartidos por useStore / useUpdate de Solicitud Prendaria.

// Campos fijos de un prendario: el backend también los fuerza.
export const CAMPOS_FIJOS = {
    es_grupal:          false,
    es_prendario:       true,
    cuotas_solicitadas: 1,
    frecuencia:         'MENSUAL',
    modalidad:          'PRENDARIO',
};

export const FORM_INICIAL = {
    ...CAMPOS_FIJOS,
    cliente_id:                 '',
    fechaVencimientoDni:        '',
    dni_status:                 null,
    grupo_id:                   '',
    integrantes:                [],
    producto_id:                '',
    producto_nombre:            '',
    monto_solicitado:           0,
    tasa_interes:               '',
    seguro:                     '',
    seguro_financiado:          false,
    observaciones:              '',
    tasacion_id:                '',
    monto_custodia:             '',
    fecha_inicio_personalizada: '',
};

/**
 * handleChange genérico. Soporta 'aval.campo' y bloquea los campos fijos
 * (por si alguna sección compartida intenta cambiarlos).
 */
export const crearHandleChange = (setFormData) => (field, value) => {
    if (field in CAMPOS_FIJOS) return;

    if (field.includes('.')) {
        const [obj, key] = field.split('.');
        setFormData(prev => ({ ...prev, [obj]: { ...(prev[obj] || {}), [key]: value } }));
        return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
};

/** Solo los campos que acepta SolicitudPrendarioRequest. */
export const construirPayload = (formData) => ({
    cliente_id:                 formData.cliente_id,
    tasacion_id:                formData.tasacion_id,
    monto_custodia:             formData.monto_custodia === '' ? 0 : formData.monto_custodia,
    producto_id:                formData.producto_id,
    monto_solicitado:           formData.monto_solicitado,
    tasa_interes:               formData.tasa_interes,
    cuotas_solicitadas:         1,
    frecuencia:                 'MENSUAL',
    seguro:                     formData.seguro || 0,
    seguro_financiado:          !!formData.seguro_financiado,
    observaciones:              formData.observaciones || null,
    fecha_inicio_personalizada: formData.fecha_inicio_personalizada || null,
});

/** Validación previa al envío (el backend valida igual). */
export const validarAntesDeEnviar = (formData) => {
    if (!formData.cliente_id)  return 'Debes seleccionar un cliente.';
    if (!formData.tasacion_id) return 'Debes seleccionar la tasación del cliente.';
    if (!formData.producto_id) return 'Debes seleccionar un producto financiero.';
    if (!(parseFloat(formData.monto_solicitado) > 0)) return 'El monto solicitado debe ser mayor a 0.';
    return null;
};

/** Normaliza la respuesta de handleResponse (con o sin wrapper { data }). */
export const unwrap = (res, campoClave) =>
    res?.data && res.data[campoClave] !== undefined ? res.data : res;