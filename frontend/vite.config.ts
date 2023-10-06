import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    logLevel: 'info',
    plugins: [react()],
    server: {
        watch: {
            usePolling: true,
        },
        host: true, // needed for the Docker Container port mapping to work
        strictPort: true,
        port: 80, // you can replace this port with any port,
        // proxy: {
        //     '/api': 'http://localhost:3000/', // the address that u serve in the backend
        // },
    },
});
