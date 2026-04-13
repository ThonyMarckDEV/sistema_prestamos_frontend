import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/dashboard`;

/**
 * @param {{ periodo?: string, fecha_inicio?: string, fecha_fin?: string }} params
 */
export const getDashboardData = async (params = {}) => {
    const query = new URLSearchParams();
    if (params.periodo)      query.set('periodo', params.periodo);
    if (params.fecha_inicio) query.set('fecha_inicio', params.fecha_inicio);
    if (params.fecha_fin)    query.set('fecha_fin', params.fecha_fin);

    const url = query.toString() ? `${BASE_URL}/index?${query}` : BASE_URL;
    const response = await fetchWithAuth(url, { method: 'GET' });
    return handleResponse(response);
};