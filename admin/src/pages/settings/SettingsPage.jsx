// Settings Page - Admin Profile and Preferences
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Badge } from '../../components/ui';

import { useToast } from '../../components/ui/Toast';
import { selectAdmin, updateAdminProfile, uploadAdminAvatar, getAdminProfile } from '../../store/adminSlice';
import {
    selectGeneralSettings,
    setGeneralSettings,
} from '../../store/settingsSlice';

const SettingsPage = () => {
    const dispatch = useDispatch();
    const admin = useSelector(selectAdmin);
    const toast = useToast();
    const generalSettings = useSelector(selectGeneralSettings);
    // const notificationSettings = useSelector(selectNotificationSettings);

    // Local state for form
    const [profileData, setProfileData] = useState({
        name: admin?.name || 'Admin User',
        email: admin?.email || 'admin@barakahaid.com',
    });




    // Sync profile data with Redux
    useEffect(() => {
        dispatch(getAdminProfile());
    }, [dispatch]);

    useEffect(() => {
        if (admin) {
            setProfileData({
                name: admin.name || '',
                email: admin.email || '',
            });
        }
    }, [admin]);

    // Notification preferences (unused/removed)
    // const [notifications, setNotifications] = useState(notificationSettings);

    // Active tab
    const [activeTab, setActiveTab] = useState('profile');

    // Saved indicator
    const [showSaved, setShowSaved] = useState(false);

    // File input ref
    const fileInputRef = React.useRef(null);

    // Handle profile change
    const handleProfileChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle notification toggle
    const handleNotificationToggle = (key) => {
        setNotifications((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // Handle file selection
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (file.size > 2 * 1024 * 1024) {
            toast.error('File size must be less than 2MB');
            return;
        }

        if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
            toast.error('Invalid file type. Please upload an image.');
            return;
        }

        try {
            const result = await dispatch(uploadAdminAvatar(file));
            if (uploadAdminAvatar.fulfilled.match(result)) {
                toast.success('Profile picture updated successfully');
            } else {
                toast.error(result.payload || 'Failed to upload image');
            }
        } catch (error) {
            toast.error('Failed to upload image');
        }
    };

    // Save settings
    const handleSave = async () => {
        try {
            // Only send allowed fields (name), exclude email
            const payload = {
                name: profileData.name
            };
            const result = await dispatch(updateAdminProfile(payload));
            if (updateAdminProfile.fulfilled.match(result)) {
                toast.success('Profile updated successfully');
                setShowSaved(true);
                setTimeout(() => setShowSaved(false), 3000);
            } else {
                toast.error(result.payload || 'Failed to update profile');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        }
    };

    // Tabs configuration
    const tabs = [
        { id: 'profile', label: 'Profile', icon: 'user' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 font-heading">Settings</h1>
                    <p className="text-secondary-700 mt-1">Manage your account and preferences</p>
                </div>
                {showSaved && (
                    <Badge variant="success" size="lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Settings saved!
                    </Badge>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-secondary-200 pb-px overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-secondary-600 hover:text-secondary-800'
                            }`}
                    >
                        {tab.icon === 'user' && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        )}

                        {tab.icon === 'bell' && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        )}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Form */}
                    <Card className="lg:col-span-2">
                        <Card.Header>
                            <h2 className="text-lg font-semibold text-secondary-900">Profile Information</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-6">
                                {/* Avatar */}
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-primary-100 rounded-xl flex items-center justify-center overflow-hidden">
                                        {profileData.avatar ? (
                                            <img 
                                                src={profileData.avatar} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover" 
                                            />
                                        ) : admin?.avatar || admin?.profileImage ? (
                                            <img 
                                                src={admin.avatar || admin.profileImage} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover" 
                                            />
                                        ) : (
                                            <span className="text-primary-700 font-bold text-2xl">
                                                {profileData.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            Change Avatar
                                        </Button>
                                        <p className="text-xs text-secondary-600 mt-1">JPG, PNG or GIF. Max 2MB.</p>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-900 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-900 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            disabled
                                            className="w-full px-4 py-2 border border-secondary-200 rounded-lg bg-secondary-50 text-secondary-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {/* Read-only fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-900 mb-2">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            value={admin?.role || 'ADMIN'}
                                            disabled
                                            className="w-full px-4 py-2 border border-secondary-200 rounded-lg bg-secondary-50 text-secondary-700 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-900 mb-2">
                                            User ID
                                        </label>
                                        <input
                                            type="text"
                                            value={admin?.id || 'admin-001'}
                                            disabled
                                            className="w-full px-4 py-2 border border-secondary-200 rounded-lg bg-secondary-50 text-secondary-700 cursor-not-allowed font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Account Status */}
                    <Card>
                        <Card.Header>
                            <h2 className="text-lg font-semibold text-secondary-900">Account Status</h2>
                        </Card.Header>
                        <Card.Body className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-800">Status</span>
                                <Badge variant="success">Active</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-800">Role</span>
                                <Badge variant="danger">ADMIN</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-800">Verified</span>
                                <Badge variant="success">Yes</Badge>
                            </div>
                            <hr className="border-secondary-200" />
                            <div className="text-sm text-secondary-600">
                                <p>Last login: Today at 10:30 AM</p>
                                <p className="mt-1">Session expires in 24 hours</p>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            )}



            {/* Notifications Tab Removed */}

            {/* Save Button */}
            <div className="flex justify-end">
                <Button variant="primary" onClick={handleSave}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Settings
                </Button>
            </div>
        </div>
    );
};

export default SettingsPage;
