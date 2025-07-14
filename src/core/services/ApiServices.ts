import axios from "axios";

const ApiServices = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    headers: {
        'X-Tenant-Token': 'ERPKJP'
    }
});

export default ApiServices