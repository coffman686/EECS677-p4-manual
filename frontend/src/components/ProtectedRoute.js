// protected wrapper for routes that require authentication

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ProtectedRoute component to wrap protected pages
function ProtectedRoute({ children }) {
  const { token, loading } = useAuth(); // get auth state from AuthContext

  // display loading indicator while verifying auth status
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // if no token, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // if authenticated, render the protected component
  return children;
}

export default ProtectedRoute;
