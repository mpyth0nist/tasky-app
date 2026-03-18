export const ACCESS_TOKEN = 'access';
export const REFRESH_TOKEN = 'refresh';

export const ENDPOINTS = {
    TOKEN: 'api/token/',
    TOKEN_REFRESH: '/api/token/refresh/',
    REGISTER: 'api/user/register/',
    TODOLISTS: 'api/todolists/',
    TASKS: (id) => `api/todolists/${id}/`,
    TASK: (todolistId, taskId) => `api/todolists/${todolistId}/tasks/${taskId}/`,
    DELETE_LIST: (id) => `api/todolists/delete/${id}/`,
    REMOVE_TASK: (todolistId, taskId) => `api/todolists/${todolistId}/remove/${taskId}/`,
};
