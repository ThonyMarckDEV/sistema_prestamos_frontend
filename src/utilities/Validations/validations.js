/**
 * Solo permite letras (incluye mayúsculas, minúsculas, tildes, ñ y espacios).
 * Ideal para Nombres y Apellidos.
 */
export const onlyLetters = (value) => {
    if (!value) return '';
    return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
};

/**
 * Solo permite números y opcionalmente recorta hasta un límite.
 * Ideal para DNI, Teléfonos, RUC.
 */
export const onlyNumbers = (value, limit = null) => {
    if (!value) return '';
    const numericValue = value.replace(/\D/g, '');
    return limit ? numericValue.slice(0, limit) : numericValue;
};

/**
 * Solo permite letras y números (Alfanumérico).
 * Ideal para Códigos, Nombres de Usuario, etc.
 */
export const onlyAlphanumeric = (value) => {
    if (!value) return '';
    return value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, '');
};