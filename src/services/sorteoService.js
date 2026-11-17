import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/sorteos`;

const json = (method, data) => ({
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
});

export const index = async (page = 1, filters = {}) => {
    const params = new URLSearchParams({ page });
    if (filters.search)        params.append('search', filters.search);
    if (filters.estado)        params.append('estado', filters.estado);
    if (filters.tipo_prestamo) params.append('tipo_prestamo', filters.tipo_prestamo);

    const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { method: 'GET' });
    return handleResponse(response);
};

export const show = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/show/${id}`, { method: 'GET' });
    return handleResponse(response);
};

export const store = async (data) => {
    const response = await fetchWithAuth(`${BASE_URL}/store`, json('POST', data));
    return handleResponse(response);
};

export const update = async (id, data) => {
    const response = await fetchWithAuth(`${BASE_URL}/update/${id}`, json('PUT', data));
    return handleResponse(response);
};

export const destroy = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/delete/${id}`, { method: 'DELETE' });
    return handleResponse(response);
};

/** Devuelve { fuente: 'EN_VIVO' | 'GENERADO', resumen, participantes (paginado) } */
export const participantes = async (id, page = 1, filters = {}) => {
    const params = new URLSearchParams({ page, per_page: filters.per_page || 15 });
    if (filters.search) params.append('search', filters.search);
    if (filters.tipo)   params.append('tipo', filters.tipo);

    const response = await fetchWithAuth(`${BASE_URL}/participantes/${id}?${params.toString()}`, { method: 'GET' });
    return handleResponse(response);
};

export const generar = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/generar/${id}`, { method: 'POST' });
    return handleResponse(response);
};

export const cerrar = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/cerrar/${id}`, { method: 'PATCH' });
    return handleResponse(response);
};

/** PDF de boletos: { pdf (base64), title }. clienteIds opcional para reimprimir sólo esos. */
export const boletos = async (id, clienteIds = []) => {
    const qs = clienteIds.length ? `?cliente_ids=${clienteIds.join(',')}` : '';
    const response = await fetchWithAuth(`${BASE_URL}/boletos/${id}${qs}`, { method: 'GET' });
    return handleResponse(response);
};

/** Cliente logueado: sus sorteos vigentes con su boleto o las condiciones que le faltan. */
export const misSorteos = async () => {
    const response = await fetchWithAuth(`${BASE_URL}/mis-sorteos`, { method: 'GET' });
    return handleResponse(response);
};
