// Forgot Password Page with OTP
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "./../../assets/logo-main.png";
import PrimaryButton from '../../components/ui/PrimaryButton';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { validateEmail, validatePassword } from '../../utils/validation';
import api from '../../utils/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef([]);

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setStep(2);
      setResendTimer(60); // 60 seconds cooldown
    } catch (err) {
      // Don't reveal if email exists - still move to OTP step for security
      setStep(2);
      setResendTimer(60);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + pastedOtp.length, 5);
      otpRefs.current[nextIndex]?.focus();
    } else {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/verify-otp', { email, otp: otpString });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email,
        otp: otp.join(''),
        newPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      setError('');
    } catch (err) {
      setError('Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="mt-4 text-2xl font-bold text-secondary-900">
            {step === 1 && 'Reset Your Password'}
            {step === 2 && 'Enter OTP'}
            {step === 3 && 'Create New Password'}
          </h1>
          <p className="mt-2 text-secondary-600">
            {step === 1 && "Enter your email address and we'll send you an OTP"}
            {step === 2 && `We've sent a 6-digit OTP to ${email}`}
            {step === 3 && 'Enter your new password below'}
          </p>
        </div>

        <Card padding="lg">
          {success ? (
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-success-100">
                <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-secondary-900">Password Reset Successful!</h3>
              <p className="mb-6 text-secondary-600">
                Your password has been reset. Redirecting to login...
              </p>
              <Link to="/login">
                <PrimaryButton fullWidth>
                  Go to Login
                </PrimaryButton>
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 mb-4 text-sm text-error-700 bg-error-50 rounded-lg">
                  {error}
                </div>
              )}

              {/* Step 1: Email */}
              {step === 1 && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                  <PrimaryButton type="submit" fullWidth disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </PrimaryButton>
                </form>
              )}

              {/* Step 2: OTP */}
              {step === 2 && (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  {/* Show email as non-editable */}
                  <div className="p-3 bg-secondary-50 rounded-lg text-center">
                    <p className="text-sm text-secondary-600">OTP sent to</p>
                    <p className="font-semibold text-secondary-900">{email}</p>
                  </div>

                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 text-center text-xl font-bold border-2 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                      />
                    ))}
                  </div>

                  <PrimaryButton type="submit" fullWidth disabled={isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </PrimaryButton>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendTimer > 0 || isLoading}
                      className={`text-sm ${resendTimer > 0 ? 'text-secondary-400' : 'text-primary-600 hover:text-primary-700'}`}
                    >
                      {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); setError(''); }}
                    className="w-full text-sm text-secondary-600 hover:text-secondary-800"
                  >
                    ← Use different email
                  </button>
                </form>
              )}

              {/* Step 3: New Password */}
              {step === 3 && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <Input
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                  <PrimaryButton type="submit" fullWidth disabled={isLoading}>
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </PrimaryButton>
                </form>
              )}

              <div className="mt-4 text-center">
                <Link to="/login" className="text-sm text-primary-600 hover:text-primary-700">
                  ← Back to Login
                </Link>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
