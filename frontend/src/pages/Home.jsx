import '../styles/Home.css'
import { useNavigate } from 'react-router-dom'


function Home(){
    const navigate = useNavigate()
    return (
        <>
         <div className="auth-container">
            <h1 className="app-name">TaskLite</h1>
            <p className="app-description">
                A minimalist todo app that helps you focus on what matters. 
                Simple, clean, and distraction-free task management.
            </p>
            <div className="auth-buttons">
                <button onClick= {() => navigate('/login')}className="btn">Log In</button>
                <button onClick= {() => navigate('/register')} className="btn" >Sign Up</button>
            </div>
         </div>
        </>
    )
}


export default Home;