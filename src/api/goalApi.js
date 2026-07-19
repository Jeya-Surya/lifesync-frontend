import api from './axios';

export const goalApi = {
    getAll: () => api.get('/api/goals'),
    getById: (id) => api.get(`/api/goals/${id}`),
    create: (data) => api.post('/api/goals', data),
    update: (id, data) => api.put(`/api/goals/${id}`, data),
    delete: (id) => api.delete(`/api/goals/${id}`),
    addMilestone: (goalId, data) =>
        api.post(`/api/goals/${goalId}/milestones`, data),
    completeMilestone: (goalId, milestoneId) =>
        api.patch(`/api/goals/${goalId}/milestones/${milestoneId}/complete`),
    deleteMilestone: (goalId, milestoneId) =>
        api.delete(`/api/goals/${goalId}/milestones/${milestoneId}`),
};