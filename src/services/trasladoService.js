import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/traslado`;

export const index = async (page = 1, filters = {}) => {
    const params = new URLSearchParams({
        page,
        search:             filters.search             || '',
        asesor_origen_id:   filters.asesor_origen_id   || '',
        asesor_destino_id:  filters.asesor_destino_id  || '',
    });
    const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { method: 'GET' });
    return handleResponse(response);
};

export const prestamosPorAsesor = async (asesorId) => {
    const response = await fetchWithAuth(`${BASE_URL}/prestamos/${asesorId}`, { method: 'GET' });
    return handleResponse(response);
};

export const store = async (data) => {
    const response = await fetchWithAuth(`${BASE_URL}/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};