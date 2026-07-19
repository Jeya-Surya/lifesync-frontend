import api from './axios';

export const habitApi = {
    getAll: () => api.get('/api/habits'),
    getById: (id) => api.get(`/api/habits/${id}`),
    create: (data) => api.post('/api/habits', data),
    delete: (id) => api.delete(`/api/habits/${id}`),
    checkIn: (id) => api.post(`/api/habits/${id}/checkin`),
    getStreak: (id) => api.get(`/api/habits/${id}/streak`),
    getLogs: (id) => api.get(`/api/habits/${id}/logs`),
};