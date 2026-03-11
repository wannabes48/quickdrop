import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RoleRoute({ allowedRoles }) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect authenticated users to their primary dashboard if they access an unauthorized root
    if (user?.role === 'client') return <Navigate to="/orders" replace />;
    if (user?.role === 'courier') return <Navigate to="/tracking" replace />;
    if (user?.role === 'partner' || user?.role === 'admin') return <Navigate to="/tracking" replace />;
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
}
