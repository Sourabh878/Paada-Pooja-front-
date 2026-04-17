import { Navigate } from 'react-router-dom';
import { isAuthenticated, getRole } from '../utils/auth';

const ProtectedRoute = ({ children, role }) => {
  if (!isAuthenticated()) return <Navigate to="/login" />;

  if (role && getRole() !== role) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
