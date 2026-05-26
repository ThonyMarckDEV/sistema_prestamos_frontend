import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/traslado`;

export const index = async (page = 1, filters = {}) => {
    const params = new URLSearchParams({
        page,
        search:            filters.search            || '',
        asesor_origen_id:  filters.asesor_origen_id  || '',
        asesor_destino_id: filters.asesor_destino_id || '',
    });
    const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { method: 'GET' });
    return handleResponse(response);
};

export const prestamosPorAsesor = async (asesorId, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search)           params.append('search',           filters.search);
    if (filters.monto_min)        params.append('monto_min',        filters.monto_min);
    if (filters.monto_max)        params.append('monto_max',        filters.monto_max);
    if (filters.frecuencia)       params.append('frecuencia',       filters.frecuencia);
    if (filters.tipo)             params.append('tipo',             filters.tipo);
    if (filters.cuotas_pagadas_min !== undefined && filters.cuotas_pagadas_min !== '')
        params.append('cuotas_pagadas_min', filters.cuotas_pagadas_min);
    if (filters.cuotas_pagadas_max !== undefined && filters.cuotas_pagadas_max !== '')
        params.append('cuotas_pagadas_max', filters.cuotas_pagadas_max);

    const response = await fetchWithAuth(`${BASE_URL}/prestamos/${asesorId}?${params.toString()}`, { method: 'GET' });
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