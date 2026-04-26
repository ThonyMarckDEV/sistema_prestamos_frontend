import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/dashboard`;

export const getPagosDashboard = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.fecha_inicio) params.append('fecha_inicio', filters.fecha_inicio);
    if (filters.fecha_fin)    params.append('fecha_fin',    filters.fecha_fin);
    const qs = params.toString();
    const response = await fetchWithAuth(`${BASE_URL}/pagos${qs ? '?' + qs : ''}`, { method: 'GET' });
    return handleResponse(response);
};

export const getPrestamosDashboard = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.fecha_inicio) params.append('fecha_inicio', filters.fecha_inicio);
    if (filters.fecha_fin)    params.append('fecha_fin',    filters.fecha_fin);
    const qs = params.toString();
    const response = await fetchWithAuth(`${BASE_URL}/prestamos${qs ? '?' + qs : ''}`, { method: 'GET' });
    return handleResponse(response);
};
 