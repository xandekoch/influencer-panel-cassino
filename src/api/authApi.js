import axios from 'axios';
import { backendConfig } from './config';

export const login = async (userData) => {
    try {
        const response = await axios.post(`${backendConfig.serverURL}/api/auth/login`, userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.msg || 'Something went wrong');
    }
};