import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HiMail, HiPhone, HiLocationMarker, HiCalendar, HiUser, HiPencil, HiCamera } from 'react-icons/hi';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import Avatar from '../components/ui/Avatar';
import api from '../utils/api';
import { updateProfile } from '../store/userSlice';
import { fetchDonations, selectDonationsStats } from '../store/donationsSlice';
import { formatCurrency } from '../utils/helpers';
import { useToast } from '../components/ui/Toast';

const Profile = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const donationStats = useSelector(selectDonationsStats);
  
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

  // Fetch full profile data from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        const profileData = response.data?.data || response.data;
        dispatch(updateProfile(profileData));
      } catch (error) {
        // Silent fail
      }
    };
    fetchProfile();
    dispatch(fetchDonations());
  }, [dispatch]);

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
      setAvatarPreview(user.profileImage || user.avatar || null);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        bio: formData.bio,
        phone: formData.phone,
        location: formData.location,
      };
      
      const response = await api.put('/users/profile', payload);
      
      const updatedData = response.data?.data || response.data;
      dispatch(updateProfile(updatedData));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));

    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('image', file);
      const response = await api.put('/users/profile/image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const userData = response.data?.data || response.data;
      const imageUrl = userData?.profileImage || userData?.avatar;
      
      if (imageUrl) {
        setAvatarPreview(imageUrl);
        dispatch(updateProfile({ profileImage: imageUrl, avatar: imageUrl }));
        toast.success('Profile picture updated!');
      } else {
        toast.error('Upload succeeded but no image URL returned');
      }
    } catch (error) {
      toast.error('Failed to upload image: ' + (error.response?.data?.message || error.message));
      setAvatarPreview(user?.profileImage || user?.avatar || null);
    } finally {
      setIsUploading(false);
    }
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
                    src={avatarPreview || user?.profileImage || user?.avatar} 
                    name={user?.name} 
                    size="2xl"
                    className="w-32 h-32 mx-auto"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button 
                    onClick={handleAvatarClick}
                    disabled={isUploading}
                    className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 text-white transition-colors border-4 border-white rounded-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <HiCamera className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* User Info */}
                <h2 className="mb-1 text-2xl font-bold text-secondary-900">{user?.name || 'User'}</h2>
                <p className="mb-2 text-sm text-secondary-600">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Donor'}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-secondary-200">
                  <div>
                    <p className="text-2xl font-bold text-primary-600">{formatCurrency(donationStats?.totalDonated || 0)}</p>
                    <p className="text-xs text-secondary-600">Total Donated</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success-600">{donationStats?.totalDonations || 0}</p>
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
                    <SecondaryButton onClick={handleCancel} disabled={isSaving}>
                      Cancel
                    </SecondaryButton>
                    <PrimaryButton onClick={handleSave} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save'}
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
                      <span className="text-secondary-900">{formData.phone || <span className="text-secondary-400 italic">Not provided</span>}</span>
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
                      <span className="text-secondary-900">{formData.location || <span className="text-secondary-400 italic">Not provided</span>}</span>
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
                      <p className="text-secondary-900">{formData.bio || <span className="text-secondary-400 italic">No bio provided</span>}</p>
                    </div>
                  )}
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
