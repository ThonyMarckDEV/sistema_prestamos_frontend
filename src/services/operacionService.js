import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/operacion-caja`;

export const desembolsar = async (formData) => {
    const response = await fetchWithAuth(`${BASE_URL}/desembolsar`, {
        method: 'POST',
        body: formData,
    });
    return handleResponse(response);
};

export const cobrarCuota = async (formData) => {
    const response = await fetchWithAuth(`${BASE_URL}/cobrar`, {
        method: 'POST',
        body: formData,
    });
    return handleResponse(response);
};

export const index = async (page = 1, filters = {}) => {
    const params = new URLSearchParams({
        page: page,
        search: filters.search || '',
        tipo: filters.tipo || ''
    });
    const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { method: 'GET' });
    return handleResponse(response);
};

export const getPdfOperacion = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/pdf/${id}`, { method: 'GET' });
    return handleResponse(response);
};

export const destroy = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/delete/${id}`, { method: 'DELETE' });
    return handleResponse(response);
};