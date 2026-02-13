import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
    const [message, setMessage] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin');
                setMessage(res.data.message);
            } catch (error) {
                console.error('Error details:', error.response || error);
                setMessage('Error fetching data');
            }
        };
        fetchData();
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Admin Dashboard</h1>
            <p>Welcome, {user.username} (Admin)</p>
            <div style={{ background: '#f8d7da', padding: '1rem', border: '1px solid #f5c6cb', display: 'inline-block' }}>
                <p>Restricted Area: {message}</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
