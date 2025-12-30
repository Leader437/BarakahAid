import React, { useState, useEffect, useRef } from 'react';
import { HiSave, HiCamera, HiCheckCircle, HiClock, HiMail, HiPhone, HiLocationMarker, HiCalendar } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import api from '../../utils/api';
import { updateProfile } from '../../store/userSlice';


const OrganizationProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    profileImage: '',
    verificationStatus: 'UNVERIFIED'
  });

  // Initialize form data from user state
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        profileImage: user.profileImage || user.avatar || '',
        verificationStatus: user.verificationStatus || 'UNVERIFIED'
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put('/users/profile', {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio
      });
      // Update Redux store with new user data
      const updatedUser = response.data?.data || response.data;
      dispatch(updateProfile(updatedUser));
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);

      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await api.put('/users/profile/image', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const updatedUser = response.data?.data || response.data;
      
      // Update local state
      setFormData(prev => ({
        ...prev,
        profileImage: updatedUser.profileImage || updatedUser.avatar
      }));

      // Update Redux store
      dispatch(updateProfile(updatedUser));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const getVerificationBadge = (status) => {
    const normalizedStatus = status?.toLowerCase();
    if (normalizedStatus === 'verified') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-success-100 text-success-700">
          <HiCheckCircle className="w-4 h-4" />
          Verified Organization
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-warning-100 text-warning-700">
        <HiClock className="w-4 h-4" />
        Pending Verification
      </span>
    );
  };

  const getInitials = (name) => {
    if (!name) return 'NG';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="min-h-screen py-8 bg-secondary-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Organization Profile</h1>
            <p className="mt-1 text-secondary-600">
              Manage your organization's information
            </p>
          </div>
          {!isEditing ? (
            <SecondaryButton onClick={() => setIsEditing(true)}>
              Edit Profile
            </SecondaryButton>
          ) : (
            <div className="flex gap-3">
              <SecondaryButton onClick={() => {
                setIsEditing(false);
                // Reset form to original user data
                if (user) {
                  setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    location: user.location || '',
                    bio: user.bio || '',
                    profileImage: user.profileImage || user.avatar || '',
                    verificationStatus: user.verificationStatus || 'UNVERIFIED'
                  });
                }
              }}>
                Cancel
              </SecondaryButton>
              <PrimaryButton onClick={handleSave} disabled={loading}>
                <HiSave className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </PrimaryButton>
            </div>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="p-4 mb-6 border rounded-lg bg-danger-50 border-danger-200">
            <p className="text-danger-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="p-4 mb-6 border rounded-lg bg-success-50 border-success-200">
            <p className="text-success-700">Profile updated successfully!</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Organization Details */}
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-secondary-900">Organization Details</h2>
                {getVerificationBadge(formData.verificationStatus)}
              </div>

              {/* Logo */}
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-secondary-700">
                  Organization Logo
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {formData.profileImage ? (
                    <img 
                      src={formData.profileImage} 
                      alt={formData.name}
                      className={`w-24 h-24 rounded-lg object-cover ${isEditing ? 'cursor-pointer hover:opacity-80' : ''}`}
                      onClick={handleImageClick}
                    />
                  ) : (
                    <div 
                      className={`flex items-center justify-center w-24 h-24 rounded-lg bg-primary-100 ${isEditing ? 'cursor-pointer hover:opacity-80' : ''}`}
                      onClick={handleImageClick}
                    >
                      <span className="text-3xl font-bold text-primary-600">{getInitials(formData.name)}</span>
                    </div>
                  )}
                  {isEditing && (
                    <SecondaryButton onClick={handleImageClick} disabled={uploadingImage}>
                      <HiCamera className="w-4 h-4" />
                      {uploadingImage ? 'Uploading...' : 'Change Logo'}
                    </SecondaryButton>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg border-secondary-300 bg-secondary-100 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-secondary-500">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter organization location"
                    className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card padding="lg">
              <h2 className="mb-6 text-xl font-bold text-secondary-900">About Organization</h2>
              <div>
                <label className="block mb-2 text-sm font-medium text-secondary-700">
                  Description
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="5"
                  placeholder="Tell donors about your organization, mission, and the work you do..."
                  className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100 disabled:cursor-not-allowed"
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Quick Info */}
            <Card padding="lg">
              <h3 className="mb-4 text-lg font-bold text-secondary-900">Quick Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <HiMail className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-xs text-secondary-500">Email</p>
                    <p className="text-sm font-medium text-secondary-900">{formData.email || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <HiPhone className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-xs text-secondary-500">Phone</p>
                    <p className="text-sm font-medium text-secondary-900">{formData.phone || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <HiLocationMarker className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-xs text-secondary-500">Location</p>
                    <p className="text-sm font-medium text-secondary-900">{formData.location || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <HiCalendar className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-xs text-secondary-500">Member Since</p>
                    <p className="text-sm font-medium text-secondary-900">{formatDate(user?.createdAt)}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Verification Status */}
            <Card padding="lg">
              <h3 className="mb-4 text-lg font-bold text-secondary-900">Verification Status</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {formData.verificationStatus?.toLowerCase() === 'verified' ? (
                    <HiCheckCircle className="w-5 h-5 text-success-600" />
                  ) : (
                    <HiClock className="w-5 h-5 text-warning-600" />
                  )}
                  <span className="text-sm text-secondary-900">
                    {formData.verificationStatus?.toLowerCase() === 'verified' 
                      ? 'Your organization is verified' 
                      : 'Verification pending'}
                  </span>
                </div>
                {formData.verificationStatus?.toLowerCase() !== 'verified' && (
                  <p className="text-xs text-secondary-600">
                    Complete your profile and submit verification documents to get verified.
                  </p>
                )}
              </div>
            </Card>

            {/* Statistics */}
            <Card padding="lg" className="bg-primary-50">
              <h3 className="mb-4 text-lg font-bold text-secondary-900">Organization Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-secondary-700">Member Since</span>
                  <span className="font-semibold text-secondary-900">{formatDate(user?.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary-700">Total Campaigns</span>
                  <span className="font-semibold text-secondary-900">{user?.campaigns?.length || 0}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfile;
