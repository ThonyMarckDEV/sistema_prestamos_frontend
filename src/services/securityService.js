import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api`;

export const verifyPassword = async (password) => {
    const response = await fetchWithAuth(`${BASE_URL}/verify-password`, {
        method: 'POST',
        body: JSON.stringify({ password }),
    });
    return handleResponse(response);
};