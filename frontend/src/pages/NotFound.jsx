import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: '1.5rem',
            color: 'var(--cream-light)',
            textAlign: 'center',
            padding: '2rem',
        }}>
            <h1 style={{ fontSize: '4rem', fontWeight: 300 }}>404</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--cream-soft)' }}>
                This page doesn't exist.
            </p>
            <Link to="/" style={{
                padding: '0.9rem 2rem',
                background: 'var(--cream-light)',
                color: 'var(--navy-deep)',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
            }}>
                ← Go Home
            </Link>
        </div>
    )
}

export default NotFound