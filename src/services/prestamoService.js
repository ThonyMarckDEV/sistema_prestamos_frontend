import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/prestamo`;

export const index = async (page = 1, filters = {}) => {
    const params = new URLSearchParams({
        page: page,
        search: filters.search || '',
        estado: filters.estado || '',
        tipo_operacion: filters.tipo_operacion || '',
    });
    const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { method: 'GET' });
    return handleResponse(response);
};

export const show = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/show/${id}`, { method: 'GET' });
    return handleResponse(response);
};

export const combobox = async (tipoOperacion, search = '') => {
    const params = new URLSearchParams({
        tipo_operacion: tipoOperacion,
        search: search
    });
    const response = await fetchWithAuth(`${BASE_URL}/combobox?${params.toString()}`, { method: 'GET' });
    return handleResponse(response);
};

export const uploadAbono = async (id, file) => {
    const formData = new FormData();
    formData.append('comprobante', file);
    const response = await fetchWithAuth(`${BASE_URL}/abono/${id}`, {
        method: 'POST',
        body: formData,
    });
    return handleResponse(response);
};