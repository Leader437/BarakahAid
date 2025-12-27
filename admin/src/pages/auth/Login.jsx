// Admin Login Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAdminData } from '../../store/adminSlice';
import { mockUsers } from '../../utils/dummyData';
import { ROLES } from '../../utils/constants';

// UI Components
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [values, setValues] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

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

                // 2. Validate password (mock check - accept any password for demo if user is found)
                // In a real app, you would hash and compare.
                if (values.password.length < 6) {
                    throw new Error('Invalid email or password');
                }

                // 3. Generate Mock Token
                // We fake a JWT structure so the decoder doesn't crash
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
                setError(err.message || 'Login failed');
            } finally {
                setLoading(false);
            }
        }, 800);
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-secondary-50 to-primary-50">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white rounded-xl shadow-sm border border-secondary-100">
                        <span className="text-3xl">🛡️</span>
                    </div>
                    <h1 className="text-2xl font-bold text-secondary-900">Admin Portal</h1>
                    <p className="mt-2 text-secondary-600">Secure access for platform administrators</p>
                </div>

                <Card padding="lg" className="shadow-xl border-t-4 border-t-primary-600">
                    {error && (
                        <div className="p-3 mb-6 text-sm bg-danger-50 border border-danger-200 text-danger-700 rounded-lg flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            placeholder="admin@barakahaid.com"
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            size="lg"
                            loading={loading}
                        >
                            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-secondary-100">
                        <div className="text-center text-xs text-secondary-500">
                            <p className="mb-2 uppercase tracking-wider font-semibold">Demo Credentials</p>
                            <code className="bg-secondary-100 px-2 py-1 rounded select-all cursor-pointer hover:bg-secondary-200 transition-colors">admin@barakahaid.com</code>
                            <span className="mx-2 text-secondary-300">|</span>
                            <code className="bg-secondary-100 px-2 py-1 rounded select-all cursor-pointer hover:bg-secondary-200 transition-colors">Admin123!</code>
                        </div>
                    </div>
                </Card>

                <p className="mt-6 text-center text-sm text-secondary-500">
                    For authorized personnel only.
                    <br />
                    Unauthorized access is prohibited.
                </p>
            </div>
        </div>
    );
};

export default Login;
