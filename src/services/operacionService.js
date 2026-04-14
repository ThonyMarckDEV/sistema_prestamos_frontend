import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/operacion-caja`;

export const desembolsar = async (prestamo_id) => {
    const response = await fetchWithAuth(`${BASE_URL}/desembolsar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prestamo_id }),
    });
    return handleResponse(response);
};

export const cobrarCuota = async (data) => {
    const response = await fetchWithAuth(`${BASE_URL}/cobrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};