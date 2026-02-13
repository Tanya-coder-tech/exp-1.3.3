import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const [message, setMessage] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/dashboard');
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
            <h1>Dashboard</h1>
            <p>Welcome, {user.username} ({user.role})</p>
            <p>{message}</p>
        </div>
    );
};

export default Dashboard;
