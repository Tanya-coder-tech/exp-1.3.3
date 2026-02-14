import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '0.5rem', background: '#007bff', color: '#fff', border: 'none' }}>Login</button>
            </form>
            
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '5px', fontSize: '0.9rem', color: '#333' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', borderBottom: '1px solid #ddd', paddingBottom: '0.25rem' }}>Demo Credentials (For Teacher):</p>
                <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ color: '#d63384' }}>Admin User:</strong><br/>
                    Email: <code>admin@test.com</code><br/>
                    Password: <code>password123</code>
                </div>
                <div>
                    <strong style={{ color: '#0d6efd' }}>Regular User:</strong><br/>
                    Email: <code>user@test.com</code><br/>
                    Password: <code>password123</code>
                </div>
            </div>
        </div>
    );
};

export default Login;
