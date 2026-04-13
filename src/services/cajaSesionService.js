import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/caja-sesiones`;

// Verifica si el cajero tiene un turno abierto actualmente
export const miSesionActiva = async () => {
    const response = await fetchWithAuth(`${BASE_URL}/mi-sesion`, { method: 'GET' });
    return handleResponse(response);
};

// Abre un nuevo turno
export const abrirTurno = async (data) => {
    const response = await fetchWithAuth(`${BASE_URL}/abrir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

// Cierra el turno (Arqueo)
export const cerrarTurno = async (id, data) => {
    const response = await fetchWithAuth(`${BASE_URL}/${id}/cerrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

// Listar historial de turnos
export const index = async (page = 1, filters = {}) => {
    const params = new URLSearchParams({ page, ...filters });
    const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { method: 'GET' });
    return handleResponse(response);
};

// Ver detalle y movimientos de un turno
export const show = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/show/${id}`, { method: 'GET' });
    return handleResponse(response);
};