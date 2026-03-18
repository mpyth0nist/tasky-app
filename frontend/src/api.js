import axios from 'axios'

import { ACCESS_TOKEN, REFRESH_TOKEN, ENDPOINTS } from './constants'


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        // Only add Authorization header if token exists and is not null/undefined
        if (token && token !== 'null' && token !== 'undefined') {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Only attempt token refresh on 401, and only once per request
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            const refresh = localStorage.getItem(REFRESH_TOKEN)
            if (refresh && refresh !== 'null' && refresh !== 'undefined') {
                try {
                    const res = await axios.post(
                        `${import.meta.env.VITE_API_URL}${ENDPOINTS.TOKEN_REFRESH.replace(/^\//, '')}`,
                        { refresh }
                    )
                    localStorage.setItem(ACCESS_TOKEN, res.data.access)
                    originalRequest.headers.Authorization = `Bearer ${res.data.access}`
                    return api(originalRequest)
                } catch {
                    // Refresh failed — clear tokens and send to login
                    localStorage.removeItem(ACCESS_TOKEN)
                    localStorage.removeItem(REFRESH_TOKEN)
                    window.location.href = '/login'
                }
            } else {
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)

export default api;