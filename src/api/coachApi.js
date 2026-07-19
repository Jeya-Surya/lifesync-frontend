import api from './axios';

export const coachApi = {
    getBriefing: () => api.get('/api/coach/briefing'),
};