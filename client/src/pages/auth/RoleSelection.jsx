import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiHeart, HiUserGroup, HiOfficeBuilding } from 'react-icons/hi';
import { updateProfile } from '../../store/userSlice';
import Card from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';
import logo from "./../../assets/logo-main.png";
import api from '../../utils/api';
import { useToast } from '../../components/ui/Toast';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((state) => state.user);

  const roles = [
    {
      value: 'DONOR',
      label: 'Donor',
      icon: HiHeart,
      description: 'I want to donate and support causes',
      color: 'primary',
    },
    {
      value: 'VOLUNTEER',
      label: 'Volunteer',
      icon: HiUserGroup,
      description: 'I want to volunteer my time and skills',
      color: 'success',
    },
    {
      value: 'NGO',
      label: 'NGO/Organization',
      icon: HiOfficeBuilding,
      description: 'I represent an organization seeking donations',
      color: 'accent',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;

    setLoading(true);
    try {
      const response = await api.patch('/users/update-role', { role: selectedRole });

      const updatedUser = response.data?.data || response.data;
      
      dispatch(updateProfile({ role: updatedUser.role || selectedRole }));
      
      const roleUpper = selectedRole.toUpperCase();
      
      switch (roleUpper) {
        case 'DONOR':
          navigate('/donor');
          break;
        case 'VOLUNTEER':
          navigate('/volunteer');
          break;
        case 'NGO':
          navigate('/ngo');
          break;
        default:
          navigate('/donor');
      }
    } catch (error) {
      toast.error('An error occurred: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-12 h-12">
              <img src={logo} alt="BarakahAid Logo" />
            </div>
            <span className="text-3xl font-bold font-logo text-primary-600">
              BarakahAid
            </span>
          </div>
          <h1 className="text-2xl font-bold text-secondary-900">Welcome!</h1>
          <p className="mt-2 text-secondary-600">Choose how you'd like to use BarakahAid</p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <label
                    key={role.value}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedRole === role.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-secondary-200 hover:border-secondary-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={selectedRole === role.value}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-4 w-full">
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                          selectedRole === role.value
                            ? `bg-${role.color}-100`
                            : 'bg-secondary-100'
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            selectedRole === role.value
                              ? `text-${role.color}-600`
                              : 'text-secondary-600'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-secondary-900">
                          {role.label}
                        </h3>
                        <p className="text-sm text-secondary-600">{role.description}</p>
                      </div>
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedRole === role.value
                            ? 'border-primary-500'
                            : 'border-secondary-300'
                        }`}
                      >
                        {selectedRole === role.value && (
                          <div className="w-3 h-3 rounded-full bg-primary-500" />
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="mt-6">
              <PrimaryButton
                type="submit"
                fullWidth
                disabled={!selectedRole || loading}
              >
                {loading ? 'Setting up your account...' : 'Continue'}
              </PrimaryButton>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RoleSelection;
