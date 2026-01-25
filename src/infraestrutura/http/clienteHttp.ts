import axios from 'axios';

export const clienteHttp = axios.create({
    baseURL: 'https://pet-manager-api.geia.vip',
    headers: {
        'Content-Type': 'application/json',
    }
})