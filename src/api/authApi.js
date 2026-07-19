import api from "./axios.js"

export const authApi = {
    register: (data) => api.post("/api/auth/register", data),
    login: (data) => api.post("/api/auth/login", data),
    getMe: () => api.get("/api/users/me")
};