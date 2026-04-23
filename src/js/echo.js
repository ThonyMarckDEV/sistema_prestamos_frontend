import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { fetchWithAuth } from './authToken'; 

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: process.env.REACT_APP_REVERB_APP_KEY,
    wsHost: process.env.REACT_APP_REVERB_HOST,
    wsPort: process.env.REACT_APP_REVERB_PORT,
    wssPort: process.env.REACT_APP_REVERB_PORT,
    forceTLS: process.env.REACT_APP_REVERB_SCHEME === 'https',
    enabledTransports: ['ws', 'wss'],
    authorizer: (channel, options) => {
        return {
            authorize: async (socketId, callback) => {
                try {
                    const response = await fetchWithAuth(`${process.env.REACT_APP_API_BASE_URL}/api/broadcasting/auth`, {
                        method: 'POST',
                        body: JSON.stringify({
                            socket_id: socketId,
                            channel_name: channel.name
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    callback(false, data);
                } catch (error) {
                    console.error("Error autorizando WebSockets:", error);
                    callback(true, error);
                }
            }
        };
    },
});