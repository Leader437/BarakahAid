// Login Page
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAdminData } from '../../store/adminSlice';
import { mockUsers } from '../../utils/dummyData';
import { ROLES } from '../../utils/constants';

// UI Components
import useForm from '../../hooks/useForm';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { validateEmail, validateRequired } from '../../utils/validation';

// Assets
// Using a placeholder for logo if not available, or standard text
const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    // Local Auth State (Replica of useAuth logic)
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Handle OAuth callback (Mock)
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            navigate('/dashboard');
        }
    }, [searchParams, navigate]);

    const validate = (values) => {
        const errors = {};
        const emailError = validateEmail(values.email);
        if (emailError) errors.email = emailError;
        const passwordError = validateRequired(values.password, 'Password');
        if (passwordError) errors.password = passwordError;
        return errors;
    };

    // Mock Login Function
    const handleLogin = async (values) => {
        setLoading(true);
        setAuthError('');

        // Simulate network delay
        setTimeout(() => {
            try {
                // 1. Find admin user in mock data
                const adminUser = mockUsers.find(
                    u => u.email.toLowerCase() === values.email.toLowerCase() && u.role === ROLES.ADMIN
                );

                if (!adminUser) {
                    throw new Error('Invalid email or password');
                }

                // 2. Validate password (mock check)
                if (values.password.length < 6) {
                    throw new Error('Invalid email or password');
                }

                // 3. Generate Mock Token
                const mockTokenHeader = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
                const mockTokenPayload = btoa(JSON.stringify({
                    id: adminUser.id,
                    email: adminUser.email,
                    name: adminUser.name,
                    role: adminUser.role,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
                    iat: Math.floor(Date.now() / 1000)
                }));
                const mockTokenSignature = "mock_signature_secret";
                const token = `${mockTokenHeader}.${mockTokenPayload}.${mockTokenSignature}`;

                // 4. Save to LocalStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(adminUser));

                // 5. Update Redux
                dispatch(setAdminData(adminUser));

                // 6. Redirect
                navigate('/dashboard');

            } catch (err) {
                setAuthError(err.message || 'Login failed');
            } finally {
                setLoading(false);
            }
        }, 800);
    };

    const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm(
        { email: '', password: '' },
        handleLogin,
        validate
    );

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-50 to-accent-50">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm text-2xl">
                            🎁
                        </div>
                        <span className="text-3xl font-bold font-logo text-primary-600">
                            BarakahAid
                        </span>
                    </Link>
                    <h1 className="mt-4 text-2xl font-bold text-secondary-900">Admin Portal</h1>
                    <p className="mt-2 text-secondary-600">Sign in to manage the platform</p>
                </div>

                <Card padding="lg">
                    {authError && (
                        <div className="p-3 mb-4 text-sm border rounded-lg bg-danger-50 border-danger-200 text-danger-700">
                            {authError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.email}
                            placeholder="admin@barakahaid.com"
                            required
                        />

                        <div>
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.password}
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="mt-1 text-sm text-primary-600 hover:text-primary-700"
                            >
                                {showPassword ? 'Hide' : 'Show'} password
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded border-secondary-300" />
                                <span className="text-sm text-secondary-700">Remember me</span>
                            </label>
                            {/* Hidden for Admin or point to dummy */}
                            <Link to="#" className="text-sm text-primary-600 hover:text-primary-700">
                                Forgot password?
                            </Link>
                        </div>

                        <PrimaryButton
                            type="submit"
                            fullWidth
                            disabled={isSubmitting || loading}
                        >
                            {isSubmitting || loading ? 'Signing In...' : 'Sign In'}
                        </PrimaryButton>
                    </form>

                    {/* Demo Login Options */}
                    <div className="pt-6 mt-6 border-t border-secondary-200">
                        <p className="mb-3 text-sm text-center text-secondary-600">Demo Login:</p>
                        <div className="grid grid-cols-1 gap-2 text-xs">
                            <SecondaryButton
                                onClick={() => {
                                    values.email = 'admin@barakahaid.com';
                                    values.password = 'Admin123!';
                                    handleLogin(values);
                                }}
                                className="!text-xs !py-2 justify-center"
                            >
                                Auto-Fill Admin Credentials
                            </SecondaryButton>
                        </div>
                    </div>
                </Card>

                <p className="mt-6 text-center text-secondary-600">
                    Restricted Access area.
                </p>
            </div>
        </div>
    );
};

export default Login;
