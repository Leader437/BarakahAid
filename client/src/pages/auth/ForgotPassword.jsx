// Forgot Password Page
import React from 'react';
import { Link } from 'react-router-dom';
import logo from "./../../assets/logo-main.png";
import PrimaryButton from '../../components/ui/PrimaryButton';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import useForm from '../../hooks/useForm';
import { validateEmail } from '../../utils/validation';

const ForgotPassword = () => {
  const [submitted, setSubmitted] = React.useState(false);

  const validate = (values) => {
    const errors = {};
    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;
    return errors;
  };

  const handleSubmit = async (values) => {
    // Simulate password reset email
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
  };

  const { values, errors, handleChange, handleBlur, handleSubmit: onSubmit, isSubmitting } = useForm(
    { email: '' },
    handleSubmit,
    validate
  );

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12">
              <img src={logo} alt="BarakahAid Logo" />
            </div>
            <span className="text-3xl font-bold font-logo text-primary-600">
              BarakahAid
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-secondary-900">Reset Your Password</h1>
          <p className="mt-2 text-secondary-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <Card padding="lg">
          {submitted ? (
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-success-100">
                <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-secondary-900">Check Your Email</h3>
              <p className="mb-6 text-secondary-600">
                We've sent a password reset link to <strong>{values.email}</strong>
              </p>
              <Link to="/login">
                <PrimaryButton fullWidth>
                  Back to Login
                </PrimaryButton>
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
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

              <PrimaryButton
                type="submit"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </PrimaryButton>

              <Link
                <Link to="/login" className="text-sm text-primary-600 hover:text-primary-700">
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
