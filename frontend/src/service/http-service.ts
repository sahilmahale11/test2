import axios from 'axios';
import jwtDecode, { JwtPayload } from 'jwt-decode';

const getApiUrl = () => {
    if (import.meta.env.VITE_ENV === 'production') {
        return import.meta.env.VITE_API_URL_PROD;
    } else if (import.meta.env.VITE_ENV === 'stage') {
        return import.meta.env.VITE_API_URL_STAGE;
    } else {
        return import.meta.env.VITE_API_URL_DEV;
    }
};

const apiUrl: string = getApiUrl();
const authAxios = axios.create({
    baseURL: apiUrl,
});
authAxios.interceptors.request.use(
    async (config) => {
        const currentDate = new Date();
        const token = localStorage.getItem('token');
        let decodedToken: JwtPayload | null = null;

        if (token) {
            const accessToken = JSON.parse(token).token;
            decodedToken = jwtDecode(token) as JwtPayload;
            if (decodedToken && typeof decodedToken.exp === 'number' && decodedToken.exp * 1000 < currentDate.getTime()) {
                //const data = await refreshToken();
                //config.headers['Authorization'] = 'Bearer ' + data.accessToken;
            }
            config.headers['Authorization'] = 'Bearer ' + accessToken;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);
export default authAxios;
