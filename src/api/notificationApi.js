import api from './axios';

export const notificationApi = {
    getAll: (userEmail) =>
        api.get(`/api/notifications?userEmail=${userEmail}`),
    getUnread: (userEmail) =>
        api.get(`/api/notifications/unread?userEmail=${userEmail}`),
    getCount: (userEmail) =>
        api.get(`/api/notifications/count?userEmail=${userEmail}`),
    markAllRead: (userEmail) =>
        api.put(`/api/notifications/read-all?userEmail=${userEmail}`),
};