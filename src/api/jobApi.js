import api from './axios';

export const jobApi = {
    getAll: () => api.get('/api/jobs'),
    getById: (id) => api.get(`/api/jobs/${id}`),
    create: (data) => api.post('/api/jobs', data),
    update: (id, data) => api.put(`/api/jobs/${id}`, data),
    delete: (id) => api.delete(`/api/jobs/${id}`),
    updateStatus: (id, status) =>
        api.patch(`/api/jobs/${id}/status`, { status }),
    getStats: () => api.get('/api/jobs/stats'),
    addRound: (id, data) => api.post(`/api/jobs/${id}/rounds`, data),
    updateRound: (id, roundId, data) =>
        api.put(`/api/jobs/${id}/rounds/${roundId}`, data),
    getRounds: (id) => api.get(`/api/jobs/${id}/rounds`),
};