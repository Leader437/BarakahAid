// Settings Page - Admin Profile and Preferences
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Badge } from '../../components/ui';
import { selectAdmin } from '../../store/adminSlice';
import {
    selectGeneralSettings,
    selectNotificationSettings,
    setGeneralSettings,
    setNotificationSettings,
    saveSettings,
} from '../../store/settingsSlice';

const SettingsPage = () => {
    const dispatch = useDispatch();
    const admin = useSelector(selectAdmin);
    const generalSettings = useSelector(selectGeneralSettings);
    const notificationSettings = useSelector(selectNotificationSettings);

    // Local state for form
    const [profileData, setProfileData] = useState({
        name: admin?.name || 'Admin User',
        email: admin?.email || 'admin@barakahaid.com',
    });

    // Theme state
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('adminTheme');
        return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    // Notification preferences
    const [notifications, setNotifications] = useState(notificationSettings);

    // Active tab
    const [activeTab, setActiveTab] = useState('profile');

    // Saved indicator
    const [showSaved, setShowSaved] = useState(false);

    // Apply dark mode on change
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('adminTheme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('adminTheme', 'light');
        }
    }, [isDarkMode]);

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

    // Save settings
    const handleSave = () => {
        // Update Redux
        dispatch(setNotificationSettings(notifications));
        dispatch(saveSettings());

        // Save to localStorage
        localStorage.setItem('adminNotifications', JSON.stringify(notifications));
        localStorage.setItem('adminProfile', JSON.stringify(profileData));

        // Show saved indicator
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 3000);
    };

    // Tabs configuration
    const tabs = [
        { id: 'profile', label: 'Profile', icon: 'user' },
        { id: 'appearance', label: 'Appearance', icon: 'palette' },
        { id: 'notifications', label: 'Notifications', icon: 'bell' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 font-heading">Settings</h1>
                    <p className="text-secondary-500 mt-1">Manage your account and preferences</p>
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
                                : 'border-transparent text-secondary-500 hover:text-secondary-700'
                            }`}
                    >
                        {tab.icon === 'user' && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        )}
                        {tab.icon === 'palette' && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
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
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                                        <span className="text-white font-bold text-2xl">
                                            {profileData.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <Button variant="outline" size="sm">Change Avatar</Button>
                                        <p className="text-xs text-secondary-500 mt-1">JPG, PNG or GIF. Max 2MB.</p>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">
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
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>

                                {/* Read-only fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            value={admin?.role || 'ADMIN'}
                                            disabled
                                            className="w-full px-4 py-2 border border-secondary-200 rounded-lg bg-secondary-50 text-secondary-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                                            User ID
                                        </label>
                                        <input
                                            type="text"
                                            value={admin?.id || 'admin-001'}
                                            disabled
                                            className="w-full px-4 py-2 border border-secondary-200 rounded-lg bg-secondary-50 text-secondary-500 cursor-not-allowed font-mono text-sm"
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
                                <span className="text-secondary-600">Status</span>
                                <Badge variant="success">Active</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-600">Role</span>
                                <Badge variant="danger">ADMIN</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-600">Verified</span>
                                <Badge variant="success">Yes</Badge>
                            </div>
                            <hr className="border-secondary-200" />
                            <div className="text-sm text-secondary-500">
                                <p>Last login: Today at 10:30 AM</p>
                                <p className="mt-1">Session expires in 24 hours</p>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
                <Card>
                    <Card.Header>
                        <h2 className="text-lg font-semibold text-secondary-900">Appearance Settings</h2>
                    </Card.Header>
                    <Card.Body>
                        <div className="space-y-6">
                            {/* Theme Toggle */}
                            <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-secondary-800' : 'bg-white border border-secondary-200'
                                        }`}>
                                        {isDarkMode ? (
                                            <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-secondary-900">Dark Mode</p>
                                        <p className="text-sm text-secondary-500">
                                            {isDarkMode ? 'Dark theme is enabled' : 'Light theme is enabled'}
                                        </p>
                                    </div>
                                </div>

                                {/* Toggle Switch */}
                                <button
                                    onClick={() => setIsDarkMode(!isDarkMode)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDarkMode ? 'bg-primary-600' : 'bg-secondary-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Theme Preview */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setIsDarkMode(false)}
                                    className={`p-4 rounded-lg border-2 transition-colors ${!isDarkMode ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-secondary-300'
                                        }`}
                                >
                                    <div className="bg-white rounded-lg p-3 shadow-sm border border-secondary-200">
                                        <div className="h-2 w-16 bg-secondary-300 rounded mb-2"></div>
                                        <div className="h-2 w-12 bg-secondary-200 rounded"></div>
                                    </div>
                                    <p className="text-sm font-medium text-secondary-700 mt-2">Light</p>
                                </button>

                                <button
                                    onClick={() => setIsDarkMode(true)}
                                    className={`p-4 rounded-lg border-2 transition-colors ${isDarkMode ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-secondary-300'
                                        }`}
                                >
                                    <div className="bg-secondary-800 rounded-lg p-3 shadow-sm">
                                        <div className="h-2 w-16 bg-secondary-600 rounded mb-2"></div>
                                        <div className="h-2 w-12 bg-secondary-700 rounded"></div>
                                    </div>
                                    <p className="text-sm font-medium text-secondary-700 mt-2">Dark</p>
                                </button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <Card>
                    <Card.Header>
                        <h2 className="text-lg font-semibold text-secondary-900">Notification Preferences</h2>
                    </Card.Header>
                    <Card.Body>
                        <div className="space-y-4">
                            {/* Email Notifications */}
                            <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-secondary-900">Email Notifications</p>
                                    <p className="text-sm text-secondary-500">Receive email updates about platform activity</p>
                                </div>
                                <button
                                    onClick={() => handleNotificationToggle('emailNotifications')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.emailNotifications ? 'bg-primary-600' : 'bg-secondary-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Campaign Alerts */}
                            <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-secondary-900">Campaign Alerts</p>
                                    <p className="text-sm text-secondary-500">Get notified about new campaigns and updates</p>
                                </div>
                                <button
                                    onClick={() => handleNotificationToggle('campaignAlerts')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.campaignAlerts ? 'bg-primary-600' : 'bg-secondary-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.campaignAlerts ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Emergency Alerts */}
                            <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-secondary-900">Emergency Alerts</p>
                                    <p className="text-sm text-secondary-500">Critical notifications for emergency campaigns</p>
                                </div>
                                <button
                                    onClick={() => handleNotificationToggle('emergencyAlerts')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.emergencyAlerts ? 'bg-danger-600' : 'bg-secondary-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.emergencyAlerts ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Donation Alerts */}
                            <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-secondary-900">Donation Alerts</p>
                                    <p className="text-sm text-secondary-500">Notifications for new donations and transactions</p>
                                </div>
                                <button
                                    onClick={() => handleNotificationToggle('donationAlerts')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.donationAlerts ? 'bg-primary-600' : 'bg-secondary-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.donationAlerts ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Weekly Reports */}
                            <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-secondary-900">Weekly Reports</p>
                                    <p className="text-sm text-secondary-500">Receive weekly summary of platform analytics</p>
                                </div>
                                <button
                                    onClick={() => handleNotificationToggle('weeklyReports')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.weeklyReports ? 'bg-primary-600' : 'bg-secondary-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            )}

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
