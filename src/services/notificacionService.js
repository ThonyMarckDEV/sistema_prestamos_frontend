import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/notificaciones`;

// Obtener todas las notificaciones (las últimas 50 según el backend)
export const index = async () => {
    const response = await fetchWithAuth(`${BASE_URL}/index`, { 
        method: 'GET' 
    });
    return handleResponse(response);
};

// Marcar una sola notificación como leída por su ID
export const marcarComoLeida = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
};

// Marcar TODAS las notificaciones como leídas (enviando 'all' como ID)
export const marcarTodasComoLeidas = async () => {
    const response = await fetchWithAuth(`${BASE_URL}/all/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
};