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
      console.log('🔍 Fetching user profile with token:', token.substring(0, 20) + '...');
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5500';
      const response = await fetch(`${apiUrl}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ User profile fetched:', JSON.stringify(responseData, null, 2));
        
        // Extract user data from response (handle both wrapped and unwrapped responses)
        const user = responseData.data || responseData;
        console.log('✅ Extracted user object:', JSON.stringify(user, null, 2));
        
        // Store token in localStorage
        localStorage.setItem('accessToken', token);
        
        // Dispatch to Redux to update authentication state
        dispatch(loginSuccess(user));
        console.log('✅ User data dispatched to Redux');
        
        // Check if this is a new OAuth user with default DONOR role
        // If they logged in with OAuth and have DONOR role, they might need to select their actual role
        // We can check if they just created their account (e.g., createdAt is recent)
        const isNewUser = user.authProvider === 'GOOGLE';
        const hasDefaultRole = user.role === 'DONOR';
        const accountAge = new Date() - new Date(user.createdAt);
        const isVeryNewAccount = accountAge < 60000; // Less than 1 minute old
        
        console.log('📊 User check:', { isNewUser, hasDefaultRole, accountAge, isVeryNewAccount, role: user.role });
        
        if (isNewUser && hasDefaultRole && isVeryNewAccount) {
          // New OAuth user, redirect to role selection
          console.log('🔀 Redirecting to role selection');
          navigate('/select-role');
        } else {
          // Existing user or already selected role, redirect to dashboard
          const dashboardPath = {
            'DONOR': '/donor',
            'NGO': '/ngo',
            'VOLUNTEER': '/volunteer',
            'ADMIN': '/admin',
            'RECIPIENT': '/recipient',
          }[user.role?.toUpperCase()] || '/donor';
          console.log('🔀 Redirecting to dashboard:', dashboardPath, 'for role:', user.role);
          navigate(dashboardPath);
        }
      } else {
        console.error('❌ Profile fetch failed:', response.status, response.statusText);
        navigate('/login?error=profile_fetch_failed');
      }
    } catch (error) {
      console.error('❌ OAuth callback error:', error);
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
