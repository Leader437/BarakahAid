import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HiMail, HiPhone, HiLocationMarker, HiCalendar, HiUser, HiPencil, HiCamera } from 'react-icons/hi';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Diego, CA',
    bio: 'Passionate about making a difference in the world through charitable giving.',
    joinDate: 'January 2024'
  });

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
    // Reset form data
    setFormData({
      name: user?.name || 'John Doe',
      email: user?.email || 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Diego, CA',
      bio: 'Passionate about making a difference in the world through charitable giving.',
      joinDate: 'January 2024'
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
                  <div className="flex items-center justify-center w-32 h-32 mx-auto rounded-full bg-primary-100">
                    <HiUser className="w-16 h-16 text-primary-600" />
                  </div>
                  <button className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 text-white transition-colors border-4 border-white rounded-full bg-primary-600 hover:bg-primary-700">
                    <HiCamera className="w-5 h-5" />
                  </button>
                </div>

                {/* User Info */}
                <h2 className="mb-1 text-2xl font-bold text-secondary-900">{formData.name}</h2>
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
                  <span>Member since {formData.joinDate}</span>
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
