import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const apiService = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const refreshToken = async () => {
    try {
        const response = await axios.get(`${API_URL}/auth/refresh-token`);

        if (response.status === 200) {
            localStorage.setItem("token", response.data.token);
            apiService.defaults.headers.Authorization = `Bearer ${response.data.token}`;
            return response.data.token;
        } else {
            throw new Error("Failed to refresh token");
        }
    } catch (error) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Failed to refresh token");
    }
}

apiService.interceptors.response.use(
    async (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            await refreshToken();
            return apiService.request(error.config);
        } else {
            throw error;
        }
    }
);

apiService.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`
        }

        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
);

export default apiService;