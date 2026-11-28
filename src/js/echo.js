import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { fetchWithAuth } from './authToken';
import ENV from './runtimeEnv';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: ENV.REVERB_APP_KEY,

    wsHost: ENV.REVERB_HOST,
    wsPort: Number(ENV.REVERB_PORT),
    wssPort: Number(ENV.REVERB_PORT),

    forceTLS: ENV.REVERB_SCHEME === 'https',
    encrypted: ENV.REVERB_SCHEME === 'https',

    enabledTransports: ['ws', 'wss'],
    disableStats: true,

    authorizer: (channel) => ({
        authorize: async (socketId, callback) => {
            try {
                const response = await fetchWithAuth(
                    `${ENV.API_BASE_URL}/api/broadcasting/auth`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            socket_id: socketId,
                            channel_name: channel.name,
                        }),
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Authorization failed');
                }

                callback(false, data);
            } catch (error) {
                console.error('Error autorizando WebSockets:', error);
                callback(true, error);
            }
        },
    }),
});