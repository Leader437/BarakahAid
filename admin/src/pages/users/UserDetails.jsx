// User Details Page - View and manage individual user
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Badge, Modal, useToast, Avatar } from '../../components/ui';
import {
    selectUsers,
    setSelectedUser,
    verifyUser,
    rejectUser,
} from '../../store/usersSlice';
import { selectDonations } from '../../store/donationsSlice';
import { formatDate, formatCurrency } from '../../utils/helpers';

const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();

    // Get user from Redux store
    const users = useSelector(selectUsers);
    const donations = useSelector(selectDonations);
    const user = users.find((u) => u.id === id);

    // Redirect if user not found
    useEffect(() => {
        if (!user) {
            navigate('/users');
        } else {
            dispatch(setSelectedUser(user));
        }
    }, [user, navigate, dispatch]);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-secondary-900">User not found</h1>
                    <Link to="/users" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                        ← Back to Users
                    </Link>
                </div>
            </div>
        );
    }

    // Get user's donations
    const userDonations = donations.filter((d) => d.donor?.id === user.id);
    const totalDonated = userDonations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

    // Handle verify user
    const handleVerify = async () => {
        try {
            await dispatch(verifyUser(user.id)).unwrap();
            toast.success(`User ${user.name} has been verified successfully.`);
        } catch (err) {
            toast.error(err || 'Failed to verify user');
        }
    };

    // Handle reject user
    const handleReject = async () => {
        try {
            await dispatch(rejectUser(user.id)).unwrap();
            toast.warning(`User ${user.name} has been rejected.`);
        } catch (err) {
            toast.error(err || 'Failed to reject user');
        }
    };

    // Get badge variants
    const getStatusVariant = (status) => {
        switch (status) {
            case 'VERIFIED': return 'success';
            case 'PENDING': return 'warning';
            case 'REJECTED': return 'danger';
            default: return 'default';
        }
    };

    const getRoleVariant = (role) => {
        switch (role) {
            case 'ADMIN': return 'danger';
            case 'NGO': return 'primary';
            case 'VOLUNTEER': return 'success';
            case 'DONOR': return 'info';
            default: return 'default';
        }
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
                <Link to="/users" className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Users
                </Link>
                <span className="text-secondary-500">/</span>
                <span className="text-secondary-600">{user.name}</span>
            </div>

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Avatar
                        src={user.profileImage || user.avatar}
                        name={user.name}
                        size="2xl"
                        shape="square"
                        className="rounded-xl"
                    />

                    {/* User Info */}
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-secondary-900 font-heading">{user.name}</h1>
                        </div>
                        <p className="text-secondary-700 mt-1">{user.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant={getRoleVariant(user.role)}>{user.role}</Badge>
                            <Badge variant={getStatusVariant(user.verificationStatus)}>
                                {user.verificationStatus}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                    {user.verificationStatus !== 'VERIFIED' && (
                        <>
                            <Button variant="success" onClick={handleVerify}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Verify User
                            </Button>
                            {user.verificationStatus !== 'REJECTED' && (
                                <Button variant="danger" onClick={handleReject}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Reject User
                                </Button>
                            )}

                        </>
                    )}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Information */}
                <Card className="lg:col-span-2">
                    <Card.Header>
                        <h2 className="text-lg font-semibold text-secondary-900">User Information</h2>
                    </Card.Header>
                    <Card.Body>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <dt className="text-sm font-medium text-secondary-700">Full Name</dt>
                                <dd className="mt-1 text-secondary-900">{user.name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-secondary-700">Email Address</dt>
                                <dd className="mt-1 text-secondary-900">{user.email}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-secondary-700">Phone Number</dt>
                                <dd className="mt-1 text-secondary-900">{user.phone || 'Not provided'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-secondary-700">Location</dt>
                                <dd className="mt-1 text-secondary-900">{user.location || 'Not provided'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-secondary-700">Member Since</dt>
                                <dd className="mt-1 text-secondary-900">{user.joinedDate}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-secondary-700">Account Type</dt>
                                <dd className="mt-1">
                                    <Badge variant={getRoleVariant(user.role)}>{user.role}</Badge>
                                </dd>
                            </div>
                        </dl>

                        {/* Role-specific information */}
                        {user.role === 'NGO' && (
                            <div className="mt-6 pt-6 border-t border-secondary-200">
                                <h3 className="text-sm font-semibold text-secondary-700 mb-4">NGO Information</h3>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <dt className="text-sm font-medium text-secondary-700">Registration Number</dt>
                                        <dd className="mt-1 text-secondary-900">{user.registrationNumber || 'N/A'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-secondary-500">Total Campaigns</dt>
                                        <dd className="mt-1 text-secondary-900">{user.campaignCount || 0}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-secondary-500">Total Raised</dt>
                                        <dd className="mt-1 text-secondary-900 font-semibold text-primary-600">
                                            {formatCurrency(user.totalRaised || 0)}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        )}

                        {user.role === 'VOLUNTEER' && (
                            <div className="mt-6 pt-6 border-t border-secondary-200">
                                <h3 className="text-sm font-semibold text-secondary-700 mb-4">Volunteer Information</h3>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <dt className="text-sm font-medium text-secondary-700">Hours Logged</dt>
                                        <dd className="mt-1 text-secondary-900">{user.hoursLogged || 0} hours</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-secondary-700">Events Attended</dt>
                                        <dd className="mt-1 text-secondary-900">{user.eventsAttended || 0}</dd>
                                    </div>
                                </dl>
                            </div>
                        )}
                    </Card.Body>
                </Card>

                {/* Activity Summary */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <Card>
                        <Card.Header>
                            <h2 className="text-lg font-semibold text-secondary-900">Activity Summary</h2>
                        </Card.Header>
                        <Card.Body className="space-y-4">
                            {user.role === 'DONOR' && (
                                <>
                                    <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                                        <div>
                                            <p className="text-sm text-primary-600">Total Donated</p>
                                            <p className="text-xl font-bold text-primary-700">
                                                {formatCurrency(user.totalDonations !== undefined && user.totalDonations !== null ? Number(user.totalDonations) : totalDonated)}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                                        <div>
                                            <p className="text-sm text-success-600">Donation Count</p>
                                            <p className="text-xl font-bold text-success-700">
                                                {user.donationCount || userDonations.length}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </>
                            )}

                            {user.role === 'NGO' && (
                                <>
                                    <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                                        <div>
                                            <p className="text-sm text-primary-600">Total Raised</p>
                                            <p className="text-xl font-bold text-primary-700">
                                                {formatCurrency(user.totalRaised || 0)}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-accent-50 rounded-lg">
                                        <div>
                                            <p className="text-sm text-accent-600">Campaigns</p>
                                            <p className="text-xl font-bold text-accent-700">
                                                {user.campaignCount || 0}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6" />
                                            </svg>
                                        </div>
                                    </div>
                                </>
                            )}

                            {user.role === 'VOLUNTEER' && (
                                <>
                                    <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                                        <div>
                                            <p className="text-sm text-success-600">Hours Logged</p>
                                            <p className="text-xl font-bold text-success-700">
                                                {user.hoursLogged || 0}h
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                                        <div>
                                            <p className="text-sm text-primary-600">Events</p>
                                            <p className="text-xl font-bold text-primary-700">
                                                {user.eventsAttended || 0}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Account Status */}
                    <Card>
                        <Card.Header>
                            <h2 className="text-lg font-semibold text-secondary-900">Account Status</h2>
                        </Card.Header>
                        <Card.Body className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-secondary-600">Verification</span>
                                <Badge variant={getStatusVariant(user.verificationStatus)}>
                                    {user.verificationStatus}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-secondary-600">Member Since</span>
                                <span className="text-sm text-secondary-900">{user.joinedDate}</span>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>

        </div>
    );
};

export default UserDetails;
