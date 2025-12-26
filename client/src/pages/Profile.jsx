import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HiMail, HiPhone, HiLocationMarker, HiCalendar, HiUser, HiPencil, HiCamera } from 'react-icons/hi';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import Avatar from '../components/ui/Avatar';

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  
  // Format the join date from user.createdAt
  const formatJoinDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Save profile changes
    setIsEditing(false);
    // Dispatch update action here
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original user data
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
    });
  };

  return (
    <div className="min-h-screen py-8 bg-secondary-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900" data-text-split data-letters-slide-up>My Profile</h1>
          <p className="mt-1 text-secondary-600">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card padding="lg">
              <div className="text-center">
                {/* Profile Picture */}
                <div className="relative inline-block mb-4">
                  <Avatar 
                    src={user?.avatar} 
                    name={user?.name} 
                    size="2xl"
                    className="w-32 h-32 mx-auto"
                  />
                  <button className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 text-white transition-colors border-4 border-white rounded-full bg-primary-600 hover:bg-primary-700">
                    <HiCamera className="w-5 h-5" />
                  </button>
                </div>

                {/* User Info */}
                <h2 className="mb-1 text-2xl font-bold text-secondary-900">{user?.name || 'User'}</h2>
                <p className="mb-2 text-sm text-secondary-600">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Donor'}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-secondary-200">
                  <div>
                    <p className="text-2xl font-bold text-primary-600">$2,575</p>
                    <p className="text-xs text-secondary-600">Total Donated</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success-600">8</p>
                    <p className="text-xs text-secondary-600">Donations</p>
                  </div>
                </div>

                {/* Join Date */}
                <div className="flex items-center justify-center gap-2 pt-4 mt-4 text-sm border-t border-secondary-200 text-secondary-600">
                  <HiCalendar className="w-4 h-4" />
                  <span>Member since {formatJoinDate(user?.createdAt)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card padding="lg">
              <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-semibold text-secondary-900">Profile Information</h3>
                {!isEditing ? (
                  <SecondaryButton onClick={() => setIsEditing(true)}>
                    <HiPencil className="w-4 h-4 mr-2 shrink-0" />
                    Edit Profile
                  </SecondaryButton>
                ) : (
                  <div className="flex gap-2">
                    <SecondaryButton onClick={handleCancel}>
                      Cancel
                    </SecondaryButton>
                    <PrimaryButton onClick={handleSave}>
                      Save
                    </PrimaryButton>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary-50">
                      <HiUser className="w-5 h-5 text-secondary-400" />
                      <span className="text-secondary-900">{formData.name}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary-50">
                      <HiMail className="w-5 h-5 text-secondary-400" />
                      <span className="text-secondary-900">{formData.email}</span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary-50">
                      <HiPhone className="w-5 h-5 text-secondary-400" />
                      <span className="text-secondary-900">{formData.phone}</span>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary-50">
                      <HiLocationMarker className="w-5 h-5 text-secondary-400" />
                      <span className="text-secondary-900">{formData.location}</span>
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-2 rounded-lg bg-secondary-50">
                      <p className="text-secondary-900">{formData.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Security Settings */}
            <Card padding="lg" className="mt-6">
              <h3 className="mb-6 text-xl font-semibold text-secondary-900">Security Settings</h3>
              <div className="space-y-4">
                {user?.authProvider === 'LOCAL' && (
                  <div className="flex flex-col gap-3 p-4 rounded-lg sm:flex-row sm:items-center sm:justify-between bg-secondary-50">
                    <div>
                      <p className="font-medium text-secondary-900">Password</p>
                      <p className="text-sm text-secondary-600">Last changed 3 months ago</p>
                    </div>
                    <SecondaryButton className="w-full sm:w-auto">
                      <span className="sm:hidden">Change</span>
                      <span className="hidden sm:inline">Change Password</span>
                    </SecondaryButton>
                  </div>
                )}
                {user?.authProvider === 'GOOGLE' && (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-success-50">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success-100">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-success-900">Signed in with Google</p>
                      <p className="text-sm text-success-700">Your account is secured by Google authentication</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 p-4 rounded-lg sm:flex-row sm:items-center sm:justify-between bg-secondary-50">
                  <div>
                    <p className="font-medium text-secondary-900">Two-Factor Authentication</p>
                    <p className="text-sm text-secondary-600">Add an extra layer of security</p>
                  </div>
                  <SecondaryButton className="w-full sm:w-auto">
                    Enable
                  </SecondaryButton>
                </div>
              </div>
            </Card>

            {/* Preferences */}
            <Card padding="lg" className="mt-6">
              <h3 className="mb-6 text-xl font-semibold text-secondary-900">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 p-4 rounded-lg sm:items-center bg-secondary-50">
                  <div className="min-w-0">
                    <p className="font-medium text-secondary-900">Email Notifications</p>
                    <p className="text-sm text-secondary-600">Receive updates about your donations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-secondary-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-start justify-between gap-4 p-4 rounded-lg sm:items-center bg-secondary-50">
                  <div className="min-w-0">
                    <p className="font-medium text-secondary-900">Monthly Newsletter</p>
                    <p className="text-sm text-secondary-600">Get impact stories and updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-secondary-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
