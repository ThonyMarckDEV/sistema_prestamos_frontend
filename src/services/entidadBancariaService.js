import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/insumo`;

export const index = async (page = 1, filters = {}) => {
  const params = new URLSearchParams({
    page: page,
    search: filters.search || '',
    estado: filters.estado || '',
    unidad_medida: filters.unidad_medida_id || '',
    es_inventariable: filters.es_inventariable ?? '',
    es_venta_directa: filters.es_venta_directa ?? '',
    almacen_id: filters.almacen_id || '',
    isPos: filters.isPos ?? '',
  });

  const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { method: 'GET' });
  return handleResponse(response);
};

export const catalogo = async (page = 1, filters = {}) => {
  const params = new URLSearchParams({
    page: page,
    search: filters.search || '',
    estado: filters.estado || '',
    unidad_medida: filters.unidad_medida_id || '',
    es_inventariable: filters.es_inventariable ?? '',
    es_venta_directa: filters.es_venta_directa ?? '',
    almacen_id: filters.almacen_id || ''
  });

  const response = await fetchWithAuth(`${BASE_URL}/catalogo?${params.toString()}`, { method: 'GET' });
  return handleResponse(response);
};


export const combobox = async (page = 1, filters = {}) => {
  const params = new URLSearchParams({
    page: page,
    search: filters.search || '',
    estado: filters.estado || '',
    es_inventariable: filters.es_inventariable ?? '',
    almacen_id: filters.almacen_id || '',
  });

  const response = await fetchWithAuth(`${BASE_URL}/combobox?${params.toString()}`, { method: 'GET' });
  return handleResponse(response);
};

export const show = async (id) => {
  const response = await fetchWithAuth(`${BASE_URL}/show/${id}`, { method: 'GET' });
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

export const update = async (id, data) => {
  const response = await fetchWithAuth(`${BASE_URL}/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const toggleStatus = async (id) => {
  const response = await fetchWithAuth(`${BASE_URL}/status/${id}`, { method: 'PATCH' });
  return handleResponse(response);
};

export const destroy = async (id) => {
  const response = await fetchWithAuth(`${BASE_URL}/${id}`, { method: 'DELETE' });
  return handleResponse(response);
};