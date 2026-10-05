import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/garantias-prendarias`;

export const index = async () => {
    const response = await fetchWithAuth(`${BASE_URL}/adjudicados`, { method: 'GET' });
    return handleResponse(response);
};

export const show = async (lote) => {
    const response = await fetchWithAuth(`${BASE_URL}/adjudicados/${lote}`, { method: 'GET' });
    return handleResponse(response);
};