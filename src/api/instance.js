import axios from 'axios';
import Cookies from 'js-cookie';

let instance = axios.create({ timeout: 60000 });

instance.interceptors.request.use(function (config) {
    if (!config.headers['Content-Type']) config.headers['Content-Type'] = 'application/json';
    let token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
});

instance.interceptors.response.use(function (response) {
    return response
}, async (error) => {
    let status = (error.response && error.response.status) || 0;
    if (status === 401) {
        window.location = "/app/auth/login";
    } else {
        throw error;
    }
});

export default instance;
