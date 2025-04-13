import axios from "axios";
import { storageService } from "./storageService";
import { API_BASE_URL } from "@/util/constants";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    async (config) => {
        const token = await storageService.getItemAsync("token");
        if (token && !config.url?.endsWith("login")) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;
