// useAuth Hook - Authentication utilities
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, logout } from '../store/userSlice';

/**
 * Custom hook for authentication operations
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.user);

  const login = async (credentials) => {
    const result = await dispatch(loginUser(credentials));
    if (result.success && result.user) {
      // Persist to localStorage for AdminModule and session persistence
      localStorage.setItem('user', JSON.stringify(result.user));
      
      // Generate mock token if not present (mock mode) or use real one
      const token = result.token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQURNSU4iLCJleHAiOjE5OTk5OTk5OTl9.mock_token";
      localStorage.setItem('token', token);

      const dashboardPath = getDashboardPath(result.user.role);
      navigate(dashboardPath);
    }
    return result;
  };

  const register = async (userData) => {
    const result = await dispatch(registerUser(userData));
    if (result.success && result.user) {
      const dashboardPath = getDashboardPath(result.user.role);
      navigate(dashboardPath);
    }
    return result;
  };

  const logoutUser = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case 'donor':
        return '/donor/dashboard';
      case 'recipient':
        return '/recipient/dashboard';
      case 'volunteer':
        return '/volunteer/dashboard';
      case 'ngo':
        return '/ngo/dashboard';

      default:
        return '/';
    }
  };

  const hasRole = (allowedRoles) => {
    if (!user || !isAuthenticated) return false;
    return allowedRoles.includes(user.role);
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout: logoutUser,
    hasRole,
  };
};

export default useAuth;
