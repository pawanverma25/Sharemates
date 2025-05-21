import axios from "axios";
import { storageService } from "./storageService";
import { API_BASE_URL } from "@/constants/proxy";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    async (config) => {
        const token = await storageService.getItemAsync("token");
        if (
            token &&
            !config.url?.endsWith("login") &&
            !config.url?.endsWith("register") &&
            !config.url?.includes("forgot-password") &&
            !config.url?.includes("reset-password") &&
            !config.url?.includes("usernameexists") &&
            !config.url?.includes("emailexists")
        ) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;
