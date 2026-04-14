import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/pagos`;

export const index = async (page = 1, filters = {}) => {
    const params = new URLSearchParams({
        page,
        search: filters.search || '',
        estado: filters.estado ?? ''
    });
    const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { method: 'GET' });
    return handleResponse(response);
};

export const show = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/show/${id}`, { method: 'GET' });
    return handleResponse(response);
};

export const store = async (formData) => {
    const response = await fetchWithAuth(`${BASE_URL}/store`, {
        method: 'POST',
        body: formData,
    });
    return handleResponse(response);
};

export const status = async (id, data) => {
    const response = await fetchWithAuth(`${BASE_URL}/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

export const pdf = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/${id}/pdf`, { method: 'GET' });
    return handleResponse(response);
};