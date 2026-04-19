import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/prospecto`;

export const index = async (page = 1, filters = {}) => {
    const params = new URLSearchParams({
        page:    page,
        search:  filters.search  || '',
        estado:  filters.estado  || '',
        tipo:    filters.tipo    || '',
        zona:    filters.zona    || '',
        asesor:  filters.asesor  || '',
    });
    const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { method: 'GET' });
    return handleResponse(response);
};

export const show = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/show/${id}`, { method: 'GET' });
    return handleResponse(response);
};

export const combobox = async (documento) => {
    const params = new URLSearchParams({ documento });
    const response = await fetchWithAuth(`${BASE_URL}/combobox?${params.toString()}`, { method: 'GET' });
    return handleResponse(response);
};

export const store = async (data) => {
    const response = await fetchWithAuth(`${BASE_URL}/store`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
    });
    return handleResponse(response);
};

export const update = async (id, data) => {
    const response = await fetchWithAuth(`${BASE_URL}/update/${id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
    });
    return handleResponse(response);
};

export const registrarSeguimiento = async (id, data) => {
    const response = await fetchWithAuth(`${BASE_URL}/seguimiento/${id}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
    });
    return handleResponse(response);
};

export const convertir = async (id, data) => {
    const response = await fetchWithAuth(`${BASE_URL}/convertir/${id}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
    });
    return handleResponse(response);
};