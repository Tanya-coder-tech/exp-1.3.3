import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ padding: '1rem', background: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <Link to="/" style={{ color: '#fff', textDecoration: 'none', marginRight: '1rem' }}>Home</Link>
                {user && user.role === 'admin' && (
                    <Link to="/admin" style={{ color: '#fff', textDecoration: 'none', marginRight: '1rem' }}>Admin Dashboard</Link>
                )}
                {user && (
                    <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none', marginRight: '1rem' }}>Dashboard</Link>
                )}
            </div>
            <div>
                {user ? (
                    <button onClick={handleLogout} style={{ background: 'red', color: '#fff', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>Logout</button>
                ) : (
                    <>
                        <Link to="/login" style={{ color: '#fff', textDecoration: 'none', marginRight: '1rem' }}>Login</Link>
                        <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
