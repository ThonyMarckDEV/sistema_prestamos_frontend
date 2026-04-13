import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/caja`;

export const index = async (page = 1, filters = {}) => {
  const params = new URLSearchParams({ page, ...filters });
  return handleResponse(await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { method: 'GET' }));
};

export const combobox = async (page = 1, filters = {}) => {
  const params = new URLSearchParams({ page, ...filters });
  return handleResponse(await fetchWithAuth(`${BASE_URL}/combobox?${params.toString()}`, { method: 'GET' }));
};

export const show = async (id) => handleResponse(await fetchWithAuth(`${BASE_URL}/show/${id}`, { method: 'GET' }));
export const store = async (data) => handleResponse(await fetchWithAuth(`${BASE_URL}/store`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }));
export const update = async (id, data) => handleResponse(await fetchWithAuth(`${BASE_URL}/update/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }));
export const toggleStatus = async (id) => handleResponse(await fetchWithAuth(`${BASE_URL}/status/${id}`, { method: 'PATCH' }));
export const destroy = async (id) => handleResponse(await fetchWithAuth(`${BASE_URL}/delete/${id}`, { method: 'DELETE' }));
