import '../styles/Home.css'
import { Link } from 'react-router-dom'


function Home() {
    return (
        <>
            <div className="auth-container">
                <h1 className="app-name">TaskLite</h1>
                <p className="app-description">
                    A minimalist todo app that helps you focus on what matters.
                    Simple, clean, and distraction-free task management.
                </p>
                <div className="auth-buttons">
                    <Link to="/login" className="btn">Log In</Link>
                    <Link to="/register" className="btn">Sign Up</Link>
                </div>
            </div>
        </>
    )
}

export default Home