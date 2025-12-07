// Register Page
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "./../../assets/logo-main.png";
import useAuth from '../../hooks/useAuth';
import useForm from '../../hooks/useForm';
import PrimaryButton from '../../components/ui/PrimaryButton';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validation';
import { ROLES } from '../../utils/constants';

const Register = () => {
  const { register, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const roleOptions = [
    { value: ROLES.DONOR, label: 'Donor - I want to donate' },
    { value: ROLES.RECIPIENT, label: 'Recipient - I need help' },
    { value: ROLES.VOLUNTEER, label: 'Volunteer - I want to help' },
    { value: ROLES.NGO, label: 'NGO - Organization' },
  ];

  const validate = (values) => {
    const errors = {};
    
    const nameError = validateRequired(values.name, 'Name');
    if (nameError) errors.name = nameError;
    
    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(values.password);
    if (passwordError) errors.password = passwordError;
    
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    const roleError = validateRequired(values.role, 'Role');
    if (roleError) errors.role = roleError;
    
    return errors;
  };

  const handleRegister = async (values) => {
    const { confirmPassword, ...userData } = values;
    await register(userData);
  };

  const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm(
    { name: '', email: '', password: '', confirmPassword: '', role: '', phone: '', location: '' },
    handleRegister,
    validate
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12">
              <img src={logo} alt="BarakahAid Logo" />
            </div>
            <span className="text-3xl font-bold font-logo text-primary-600">BarakahAid</span>
          </Link>
          <h1 className="text-2xl font-bold text-secondary-900 mt-4">Create Your Account</h1>
          <p className="text-secondary-600 mt-2">Join us in making a difference</p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name}
                placeholder="John Doe"
                required
              />

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
            </div>

            <Select
              label="I am a"
              name="role"
              value={values.role}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.role}
              options={roleOptions}
              placeholder="Select your role"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.phone}
                placeholder="+1 234 567 890"
              />

              <Input
                label="Location"
                name="location"
                value={values.location}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.location}
                placeholder="City, Country"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                placeholder="Create password"
                required
              />

              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.confirmPassword}
                placeholder="Confirm password"
                required
              />
            </div>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {showPassword ? 'Hide' : 'Show'} passwords
            </button>

            <div className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1 rounded border-secondary-300" />
              <label className="text-sm text-secondary-700">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <PrimaryButton
              type="submit"
              fullWidth
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? 'Creating Account...' : 'Create Account'}
            </PrimaryButton>
          </form>
        </Card>

        <p className="text-center text-secondary-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
