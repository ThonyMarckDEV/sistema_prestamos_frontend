import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/garantias-prendarias`;

// ── Módulo de consulta: todas las garantías ───────────────────────────────────

export const index = async (page = 1, filters = {}) => {
    const params = new URLSearchParams({
        page,
        search:      filters.search      || '',
        prestamo_id: filters.prestamo_id || '',
        cliente:     filters.cliente     || '',
        estado:      filters.estado      ?? '',
    });
    const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { method: 'GET' });
    return handleResponse(response);
};

export const show = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/show/${id}`, { method: 'GET' });
    return handleResponse(response);
};

// ── Venta Adjudicados (caja): lotes en estado ADJUDICADO ──────────────────────

export const lotes = async () => {
    const response = await fetchWithAuth(`${BASE_URL}/lotes`, { method: 'GET' });
    return handleResponse(response);
};

export const showLote = async (lote) => {
    const response = await fetchWithAuth(`${BASE_URL}/lotes/${encodeURIComponent(lote)}`, { method: 'GET' });
    return handleResponse(response);
};