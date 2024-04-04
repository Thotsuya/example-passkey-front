import axios from 'axios';

axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'x-device-id': 'stateful',
        'Accept': 'application/json',
    },
});

export default client;