import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/dia-operativo`;

export const getDiaActual = async () => {
    const response = await fetchWithAuth(`${BASE_URL}/actual`, { method: 'GET' });
    return handleResponse(response);
};

export const index = async () => {
    const response = await fetchWithAuth(`${BASE_URL}/index`, { method: 'GET' });
    return handleResponse(response);
};

export const abrirDia = async () => {
    const response = await fetchWithAuth(`${BASE_URL}/abrir`, { method: 'POST' });
    return handleResponse(response);
};

export const cerrarDia = async () => {
    const response = await fetchWithAuth(`${BASE_URL}/cerrar`, { method: 'POST' });
    return handleResponse(response);
};