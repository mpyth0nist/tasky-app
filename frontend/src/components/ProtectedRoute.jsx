import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import api from '../api'
import { REFRESH_TOKEN, ACCESS_TOKEN, ENDPOINTS } from '../constants'
import { useState, useEffect } from 'react'
import '../styles/Form.css'


function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null)

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        const refresh = localStorage.getItem(REFRESH_TOKEN)
        try {
            const res = await api.post(ENDPOINTS.TOKEN_REFRESH, { refresh })
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch {
            setIsAuthorized(false)
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setIsAuthorized(false)
            return
        }
        const decoded = jwtDecode(token)
        const now = Date.now() / 1000

        if (decoded.exp < now) {
            await refreshToken()
        } else {
            setIsAuthorized(true)
        }
    }

    if (isAuthorized === null) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner" aria-label="Checking authentication…" />
            </div>
        )
    }

    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute