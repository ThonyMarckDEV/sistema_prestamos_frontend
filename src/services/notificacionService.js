import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/notificaciones`;

export const index = async () => {
    const response = await fetchWithAuth(`${BASE_URL}/index`, { method: 'GET' });
    return handleResponse(response);
};

export const markAsRead = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
};

export const markAllAsRead = async () => {
    const response = await fetchWithAuth(`${BASE_URL}/all/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
};