// Login Page
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "./../../assets/logo-main.png";
import useAuth from '../../hooks/useAuth';
import useForm from '../../hooks/useForm';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { validateEmail, validateRequired } from '../../utils/validation';

const Login = () => {
  const { login, loading, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const validate = (values) => {
    const errors = {};
    
    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validateRequired(values.password, 'Password');
    if (passwordError) errors.password = passwordError;
    
    return errors;
  };

  const handleLogin = async (values) => {
    await login(values);
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
            <div className="flex items-center justify-center w-12 h-12">
              <img src={logo} alt="BarakahAid Logo" />
            </div>
            <span className="text-3xl font-bold font-logo text-primary-600">
              BarakahAid
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-secondary-900">Welcome Back</h1>
          <p className="mt-2 text-secondary-600">Sign in to continue making a difference</p>
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
              placeholder="your@email.com"
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
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
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

          {/* Quick Login for Demo */}
          <div className="pt-6 mt-6 border-t border-secondary-200">
            <p className="mb-3 text-sm text-center text-secondary-600">Demo Login:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <SecondaryButton
                onClick={() => {
                  values.email = 'donor@example.com';
                  values.password = 'password';
                  handleLogin(values);
                }}
                className="!text-xs !py-2"
              >
                Donor
              </SecondaryButton>
              {/* <SecondaryButton
                onClick={() => {
                  values.email = 'recipient@example.com';
                  values.password = 'password';
                  handleLogin(values);
                }}
                className="!text-xs !py-2"
              >
                Recipient
              </SecondaryButton> */}
              <SecondaryButton
                onClick={() => {
                  values.email = 'volunteer@example.com';
                  values.password = 'password';
                  handleLogin(values);
                }}
                className="!text-xs !py-2"
              >
                Volunteer
              </SecondaryButton>
              <SecondaryButton
                onClick={() => {
                  values.email = 'ngo@example.com';
                  values.password = 'password';
                  handleLogin(values);
                }}
                className="!text-xs !py-2"
              >
                NGO
              </SecondaryButton>
            </div>
          </div>
        </Card>

        <p className="mt-6 text-center text-secondary-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
