import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const token = localStorage.getItem("token");

const apiService = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const refreshToken = async () => {
    try {
        const response = await axios.post(`${API_URL}/auth/refresh-token?token=${token}`)

        if (response.status === 200) {
            localStorage.setItem("token", response.data.token);
            apiService.defaults.headers.Authorization = `Bearer ${response.data.token}`;
            return response.data.token;
        } else {
            throw new Error("Failed to refresh token");
        }
    } catch (error) {
        throw new Error("Failed to refresh token");
    }
}

apiService.interceptors.response.use(
    async (response) => response,
    async (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
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