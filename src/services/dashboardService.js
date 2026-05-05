import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/dashboard`;

const buildQs = (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
    const qs = params.toString();
    return qs ? '?' + qs : '';
};

// ── Pagos ─────────────────────────────────────────────────────────────────────
export const getPagosDashboard = async (filters = {}) => {
    const response = await fetchWithAuth(`${BASE_URL}/pagos${buildQs(filters)}`, { method: 'GET' });
    return handleResponse(response);
};

export const exportPagosDashboard = async (filters = {}) => {
    const response = await fetchWithAuth(`${BASE_URL}/pagos/export${buildQs(filters)}`, { method: 'GET' });
    if (!response.ok) throw new Error('Error al exportar pagos');
    return response.blob();
};

// ── Préstamos ─────────────────────────────────────────────────────────────────
export const getPrestamosDashboard = async (filters = {}) => {
    const response = await fetchWithAuth(`${BASE_URL}/prestamos${buildQs(filters)}`, { method: 'GET' });
    return handleResponse(response);
};

export const exportPrestamosDashboard = async (filters = {}) => {
    const response = await fetchWithAuth(`${BASE_URL}/prestamos/export${buildQs(filters)}`, { method: 'GET' });
    if (!response.ok) throw new Error('Error al exportar préstamos');
    return response.blob();
};

// ── Asesores ──────────────────────────────────────────────────────────────────
export const getAsesoresDashboard = async (filters = {}) => {
    const response = await fetchWithAuth(`${BASE_URL}/asesores${buildQs(filters)}`, { method: 'GET' });
    return handleResponse(response);
};

export const exportAsesoresDashboard = async (filters = {}) => {
    const response = await fetchWithAuth(`${BASE_URL}/asesores/export${buildQs(filters)}`, { method: 'GET' });
    if (!response.ok) throw new Error('Error al exportar asesores');
    return response.blob();
};

// ── Mora ──────────────────────────────────────────────────────────────────────
export const getMoraDashboard = async (filters = {}) => {
    const response = await fetchWithAuth(`${BASE_URL}/mora${buildQs(filters)}`, { method: 'GET' });
    return handleResponse(response);
};

// ── Clientes mora ─────────────────────────────────────────────────────────────
export const getClientesMoraDashboard = async (filters = {}) => {
    const response = await fetchWithAuth(`${BASE_URL}/clientes-mora${buildQs(filters)}`, { method: 'GET' });
    return handleResponse(response);
};

// ── Saldo capital ─────────────────────────────────────────────────────────────
export const getSaldoCapitalDashboard = async (filters = {}) => {
    const response = await fetchWithAuth(`${BASE_URL}/saldo-capital${buildQs(filters)}`, { method: 'GET' });
    return handleResponse(response);
};

// ── Grupos asesor ─────────────────────────────────────────────────────────────
export const getGruposAsesorDashboard = async (filters = {}) => {
    const response = await fetchWithAuth(`${BASE_URL}/grupos-asesor${buildQs(filters)}`, { method: 'GET' });
    return handleResponse(response);
};