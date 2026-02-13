import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Access Denied</h2>
            <p>You do not have permission to view this page.</p>
        </div>;
    }

    return <Outlet />;
};

export default ProtectedRoute;
