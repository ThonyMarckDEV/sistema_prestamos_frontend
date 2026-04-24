import API_BASE_URL from './urlHelper';
import jwtUtils from 'utilities/Token/jwtUtils';
import { logout } from 'js/logout';

let isRefreshing        = false;
let refreshSubscribers  = [];

const onRefreshed = (token) => {
    refreshSubscribers.forEach(cb => cb(token));
    refreshSubscribers = [];
};

const addSubscriber = (cb) => refreshSubscribers.push(cb);

export async function fetchWithAuth(url, options = {}) {
    const access_token = jwtUtils.getAccessTokenFromCookie();

    const headers = {
        'Accept': 'application/json',
        ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (access_token) {
        headers['Authorization'] = `Bearer ${access_token}`;
    }

    // Primer intento
    let response = await fetch(url, { ...options, headers, credentials: 'include' });

    if (response.status !== 401) return response;

    // Si ya hay un refresh en curso — encolar y esperar
    if (isRefreshing) {
        return new Promise((resolve) => {
            addSubscriber(async (newToken) => {
                headers['Authorization'] = `Bearer ${newToken}`;
                resolve(await fetch(url, { ...options, headers, credentials: 'include' }));
            });
        });
    }

    // Iniciar refresh
    isRefreshing = true;

    try {
        const refreshResponse = await fetch(`${API_BASE_URL}/api/refresh`, {
            method:      'POST',
            headers:     { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (!refreshResponse.ok) {
            throw new Error('Refresh inválido');
        }

        const json          = await refreshResponse.json();
        const newAccessToken = json?.data?.access_token;

        if (!newAccessToken) throw new Error('Token no recibido');

        jwtUtils.setAccessTokenInCookie(newAccessToken);
        onRefreshed(newAccessToken);

        // Reintentar petición original
        headers['Authorization'] = `Bearer ${newAccessToken}`;
        response = await fetch(url, { ...options, headers, credentials: 'include' });

        return response;

    } catch (error) {
        console.error('[Auth] Refresh falló, forzando logout...', error);
        refreshSubscribers = [];
        logout();
        return response;

    } finally {
        isRefreshing = false;
    }
}