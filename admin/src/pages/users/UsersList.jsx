// Users List Page - User Management Table
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Input, Badge, Modal } from '../../components/ui';
import {
    selectFilteredUsers,
    selectUsersFilters,
    selectUsersPagination,
    setFilters,
    setPagination,
    verifyUser,
    updateUser,
} from '../../store/usersSlice';
import usePagination from '../../hooks/usePagination';
import { ROLES, VERIFICATION_STATUS } from '../../utils/constants';

const UsersList = () => {
    const dispatch = useDispatch();
    const users = useSelector(selectFilteredUsers);
    const filters = useSelector(selectUsersFilters);
    const paginationState = useSelector(selectUsersPagination);

    // Local state
    const [selectedUser, setSelectedUser] = useState(null);
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionType, setActionType] = useState('');

    // Use pagination hook
    const {
        currentPage,
        totalPages,
        paginatedData,
        goToPage,
        nextPage,
        prevPage,
        hasNextPage,
        hasPrevPage,
        startIndex,
        endIndex,
        totalItems,
    } = usePagination(users, paginationState.limit);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        dispatch(setFilters({ [key]: value }));
    };

    // Handle search
    const handleSearch = (e) => {
        dispatch(setFilters({ search: e.target.value }));
    };

    // Open action modal
    const openActionModal = (user, action) => {
        setSelectedUser(user);
        setActionType(action);
        setShowActionModal(true);
    };

    // Handle verify user
    const handleVerifyUser = () => {
        if (selectedUser) {
            dispatch(verifyUser(selectedUser.id));
            setShowActionModal(false);
            setSelectedUser(null);
        }
    };

    // Handle block/unblock user
    const handleToggleBlock = () => {
        if (selectedUser) {
            const newStatus = selectedUser.isBlocked ? false : true;
            dispatch(updateUser({ id: selectedUser.id, isBlocked: newStatus }));
            setShowActionModal(false);
            setSelectedUser(null);
        }
    };

    // Get status badge variant
    const getStatusVariant = (status) => {
        switch (status) {
            case 'VERIFIED':
                return 'success';
            case 'PENDING':
                return 'warning';
            case 'REJECTED':
                return 'danger';
            default:
                return 'default';
        }
    };

    // Get role badge variant
    const getRoleVariant = (role) => {
        switch (role) {
            case 'ADMIN':
                return 'danger';
            case 'NGO':
                return 'primary';
            case 'VOLUNTEER':
                return 'success';
            case 'DONOR':
                return 'info';
            default:
                return 'default';
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 font-heading">Users</h1>
                    <p className="mt-1 text-secondary-700">Manage all platform users ({totalItems} total)</p>
                </div>
            </div>

            {/* Filters Card */}
            <Card>
                <div className="flex flex-col gap-4 lg:flex-row">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={filters.search}
                                onChange={handleSearch}
                                className="w-full py-2 pl-10 pr-4 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>

                    {/* Role Filter */}
                    <div className="w-full lg:w-48">
                        <select
                            value={filters.role}
                            onChange={(e) => handleFilterChange('role', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="all">All Roles</option>
                            <option value="DONOR">Donors</option>
                            <option value="VOLUNTEER">Volunteers</option>
                            <option value="NGO">NGOs</option>
                            <option value="ADMIN">Admins</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="w-full lg:w-48">
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="all">All Status</option>
                            <option value="VERIFIED">Verified</option>
                            <option value="PENDING">Pending</option>
                            <option value="UNVERIFIED">Unverified</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Users Table */}
            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b bg-secondary-50 border-secondary-200">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-left text-secondary-700">Name</th>
                                <th className="px-6 py-4 text-sm font-semibold text-left text-secondary-700">Email</th>
                                <th className="px-6 py-4 text-sm font-semibold text-left text-secondary-700">Role</th>
                                <th className="px-6 py-4 text-sm font-semibold text-left text-secondary-700">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-right text-secondary-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-200">
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-secondary-700">
                                        No users found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((user) => (
                                    <tr key={user.id} className="transition-colors hover:bg-secondary-50">
                                        {/* Name with Avatar */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-primary-100">
                                                    <span className="text-sm font-semibold text-primary-700">
                                                        {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-secondary-900">{user.name}</p>
                                                    <p className="text-xs text-secondary-600">{user.location || 'Location not set'}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-6 py-4 text-secondary-800">{user.email}</td>

                                        {/* Role */}
                                        <td className="px-6 py-4">
                                            <Badge variant={getRoleVariant(user.role)} size="sm">
                                                {user.role}
                                            </Badge>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <Badge variant={getStatusVariant(user.verificationStatus)} size="sm">
                                                {user.verificationStatus}
                                            </Badge>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/users/${user.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        View
                                                    </Button>
                                                </Link>

                                                {user.verificationStatus === 'PENDING' && (
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => openActionModal(user, 'verify')}
                                                    >
                                                        Verify
                                                    </Button>
                                                )}

                                                <Button
                                                    variant={user.isBlocked ? 'warning' : 'outline'}
                                                    size="sm"
                                                    onClick={() => openActionModal(user, 'block')}
                                                >
                                                    {user.isBlocked ? 'Unblock' : 'Block'}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-secondary-200">
                        <p className="text-sm text-secondary-700">
                            Showing {startIndex} to {endIndex} of {totalItems} users
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={prevPage}
                                disabled={!hasPrevPage}
                            >
                                Previous
                            </Button>

                            {/* Page numbers */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => goToPage(pageNum)}
                                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                                                ? 'bg-primary-600 text-white'
                                                : 'text-secondary-700 hover:bg-secondary-100'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={nextPage}
                                disabled={!hasNextPage}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Action Confirmation Modal */}
            <Modal
                isOpen={showActionModal}
                onClose={() => setShowActionModal(false)}
                title={actionType === 'verify' ? 'Verify User' : (selectedUser?.isBlocked ? 'Unblock User' : 'Block User')}
                size="sm"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setShowActionModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant={actionType === 'verify' ? 'success' : (selectedUser?.isBlocked ? 'warning' : 'danger')}
                            onClick={actionType === 'verify' ? handleVerifyUser : handleToggleBlock}
                        >
                            {actionType === 'verify' ? 'Verify' : (selectedUser?.isBlocked ? 'Unblock' : 'Block')}
                        </Button>
                    </>
                }
            >
                <div className="py-4 text-center">
                    {actionType === 'verify' ? (
                        <>
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-success-100">
                                <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-secondary-600">
                                Are you sure you want to verify <strong>{selectedUser?.name}</strong>?
                            </p>
                        </>
                    ) : (
                        <>
                            <div className={`w-16 h-16 ${selectedUser?.isBlocked ? 'bg-warning-100' : 'bg-danger-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <svg className={`w-8 h-8 ${selectedUser?.isBlocked ? 'text-warning-600' : 'text-danger-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </div>
                            <p className="text-secondary-600">
                                {selectedUser?.isBlocked
                                    ? `Are you sure you want to unblock ${selectedUser?.name}?`
                                    : `Are you sure you want to block ${selectedUser?.name}? They will not be able to access the platform.`
                                }
                            </p>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default UsersList;
