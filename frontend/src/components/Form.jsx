import { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { ACCESS_TOKEN, REFRESH_TOKEN, ENDPOINTS } from '../constants'
import '../styles/Form.css'

function Form({ route, method }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const isLogin = method === 'login'
    const name = isLogin ? 'Login' : 'Register'

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const payload = isLogin
                ? { username, password }
                : { username, email, password, password2 }

            const res = await api.post(route, payload)

            if (isLogin) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                navigate('/account')
            } else {
                navigate('/login')
            }
        } catch (err) {
            const data = err.response?.data
            if (data) {
                // Surface first field error from DRF response
                const messages = Object.values(data).flat()
                setError(messages[0] || 'Something went wrong. Please try again.')
            } else {
                setError('Could not connect to the server. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-form-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1 className="auth-title">{name}</h1>

                {error && <p className="form-error">{error}</p>}

                <div className="input-group">
                    <input
                        className="auth-input"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        autoComplete="username"
                    />
                </div>

                {!isLogin && (
                    <div className="input-group">
                        <input
                            className="auth-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            autoComplete="email"
                        />
                    </div>
                )}

                <div className="input-group">
                    <input
                        className="auth-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                    />
                </div>

                {!isLogin && (
                    <div className="input-group">
                        <input
                            className="auth-input"
                            type="password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            placeholder="Confirm Password"
                            required
                            autoComplete="new-password"
                        />
                    </div>
                )}

                <button className="auth-button" type="submit" disabled={loading}>
                    {loading ? 'Please wait…' : name}
                </button>
            </form>
        </div>
    )
}

export default Form