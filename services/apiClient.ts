import axios from "axios";
import { storageService } from "./storageService";

// const API_BASE_URL = "http://localhost:8081/api/";
const API_BASE_URL = "http://10.0.2.2:8081/api/";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    async (config) => {
        const token = await storageService.getItemAsync("token");
        debugger;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;
