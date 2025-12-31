import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/userSlice';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Store token
      localStorage.setItem('accessToken', token);
      
      // Fetch user profile and redirect
      fetchUserProfile(token);
    } else {
      // No token, redirect to login with error
      navigate('/login?error=oauth_failed');
    }
  }, [searchParams, navigate, dispatch]);

  const fetchUserProfile = async (token) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5500';
      const response = await fetch(`${apiUrl}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        
        // Extract user data from response (handle both wrapped and unwrapped responses)
        const user = responseData.data || responseData;
        
        // Store token in localStorage
        localStorage.setItem('accessToken', token);
        
        // Dispatch to Redux to update authentication state
        dispatch(loginSuccess(user));
        
        // Check if this is a new OAuth user with default DONOR role
        const isNewUser = user.authProvider === 'GOOGLE';
        const hasDefaultRole = user.role === 'DONOR';
        const accountAge = new Date() - new Date(user.createdAt);
        const isVeryNewAccount = accountAge < 60000; // Less than 1 minute old
        
        if (isNewUser && hasDefaultRole && isVeryNewAccount) {
          navigate('/select-role');
        } else {
          const dashboardPath = {
            'DONOR': '/donor',
            'NGO': '/ngo',
            'VOLUNTEER': '/volunteer',
            'ADMIN': '/admin',
            'RECIPIENT': '/recipient',
          }[user.role?.toUpperCase()] || '/donor';
          navigate(dashboardPath);
        }
      } else {
        navigate('/login?error=profile_fetch_failed');
      }
    } catch (error) {
      navigate('/login?error=authentication_failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-t-transparent rounded-full border-primary-600 animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-secondary-700">Completing sign in...</p>
        <p className="mt-2 text-sm text-secondary-600">Please wait while we verify your account</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
