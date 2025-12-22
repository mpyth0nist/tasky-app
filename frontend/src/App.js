import './App.css';
import Login from './pages/Login'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'


import {BrowserRouter, Navigate, Routes, Route} from 'react-router-dom'


function Logout(){
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout(){
  localStorage.clear()
  return <Register />
}


function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={
          <div className='app'>
            <Home />
          </div>
          } />
        <Route path="/account" element={<ProtectedRoute>
          <Dashboard />

        </ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    
    </BrowserRouter>
  )
}

export default App;
