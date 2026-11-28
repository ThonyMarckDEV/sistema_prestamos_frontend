// src/js/runtimeEnv.js
//
// Variables de entorno leídas EN TIEMPO DE EJECUCIÓN.
// En Docker, el contenedor genera /env-config.js al arrancar con las variables
// REACT_APP_* que recibe por `docker run --env-file ...` (window._env_), igual
// que el backend lee su .env. Así no hay que reconstruir la imagen para
// cambiar la URL del API.
// En local (npm start) no existe window._env_ y se usa el .env de siempre.

const runtime = (typeof window !== 'undefined' && window._env_) || {};

const pick = (runtimeValue, buildValue) =>
    runtimeValue !== undefined && runtimeValue !== '' ? runtimeValue : buildValue;

const ENV = {
    API_BASE_URL:     pick(runtime.REACT_APP_API_BASE_URL,   process.env.REACT_APP_API_BASE_URL),
    REVERB_APP_KEY:   pick(runtime.REACT_APP_REVERB_APP_KEY, process.env.REACT_APP_REVERB_APP_KEY),
    REVERB_HOST:      pick(runtime.REACT_APP_REVERB_HOST,    process.env.REACT_APP_REVERB_HOST),
    REVERB_PORT:      pick(runtime.REACT_APP_REVERB_PORT,    process.env.REACT_APP_REVERB_PORT),
    REVERB_SCHEME:    pick(runtime.REACT_APP_REVERB_SCHEME,  process.env.REACT_APP_REVERB_SCHEME),
};

export default ENV;
