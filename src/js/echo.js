import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { fetchWithAuth } from './authToken';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: process.env.REACT_APP_REVERB_APP_KEY,

    wsHost: process.env.REACT_APP_REVERB_HOST,
    wsPort: Number(process.env.REACT_APP_REVERB_PORT),
    wssPort: Number(process.env.REACT_APP_REVERB_PORT),

    forceTLS: true,
    encrypted: true,

    enabledTransports: ['ws', 'wss'],
    disableStats: true,

    authorizer: (channel) => ({
        authorize: async (socketId, callback) => {
            try {
                const response = await fetchWithAuth(
                    `${process.env.REACT_APP_API_BASE_URL}/api/broadcasting/auth`,
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