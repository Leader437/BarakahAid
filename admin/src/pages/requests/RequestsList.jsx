// Requests List Page - Donation Requests Management
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Badge, Modal } from '../../components/ui';
import {
    selectFilteredRequests,
    selectRequestsFilters,
    setFilters,
    approveRequest,
    rejectRequest,
} from '../../store/requestsSlice';
import usePagination from '../../hooks/usePagination';
import { formatCurrency, formatDate } from '../../utils/helpers';

const RequestsList = () => {
    const dispatch = useDispatch();
    const requests = useSelector(selectFilteredRequests);
    const filters = useSelector(selectRequestsFilters);

    // Local state
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionType, setActionType] = useState('');
    const [rejectReason, setRejectReason] = useState('');

    // Pagination
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
    } = usePagination(requests, 10);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        dispatch(setFilters({ [key]: value }));
    };

    // Handle search
    const handleSearch = (e) => {
        dispatch(setFilters({ search: e.target.value }));
    };

    // Open action modal
    const openActionModal = (request, action) => {
        setSelectedRequest(request);
        setActionType(action);
        setShowActionModal(true);
    };

    // Handle approve
    const handleApprove = () => {
        if (selectedRequest) {
            dispatch(approveRequest(selectedRequest.id));
            setShowActionModal(false);
            setSelectedRequest(null);
        }
    };

    // Handle reject
    const handleReject = () => {
        if (selectedRequest) {
            dispatch(rejectRequest(selectedRequest.id));
            setShowActionModal(false);
            setSelectedRequest(null);
            setRejectReason('');
        }
    };

    // Get status badge variant
    const getStatusVariant = (status) => {
        switch (status) {
            case 'APPROVED': return 'success';
            case 'PENDING': return 'warning';
            case 'REJECTED': return 'danger';
            case 'FULFILLED': return 'info';
            case 'CLOSED': return 'default';
            default: return 'default';
        }
    };

    // Get urgency badge variant
    const getUrgencyVariant = (urgency) => {
        switch (urgency) {
            case 'CRITICAL': return 'danger';
            case 'HIGH': return 'warning';
            case 'MEDIUM': return 'info';
            case 'LOW': return 'default';
            default: return 'default';
        }
    };

    // Calculate progress percentage
    const getProgress = (current, target) => {
        if (!target) return 0;
        return Math.min(Math.round((current / target) * 100), 100);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 font-heading">Donation Requests</h1>
                    <p className="text-secondary-500 mt-1">
                        Review and manage requests from NGOs and recipients ({totalItems} total)
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <div className="text-center">
                        <p className="text-sm text-secondary-500">Total Requests</p>
                        <p className="text-2xl font-bold text-secondary-900">{requests.length}</p>
                    </div>
                </Card>
                <Card className="border-l-4 border-warning-500">
                    <div className="text-center">
                        <p className="text-sm text-warning-600">Pending Review</p>
                        <p className="text-2xl font-bold text-warning-700">
                            {requests.filter((r) => r.status === 'PENDING').length}
                        </p>
                    </div>
                </Card>
                <Card className="border-l-4 border-success-500">
                    <div className="text-center">
                        <p className="text-sm text-success-600">Approved</p>
                        <p className="text-2xl font-bold text-success-700">
                            {requests.filter((r) => r.status === 'APPROVED').length}
                        </p>
                    </div>
                </Card>
                <Card className="border-l-4 border-danger-500">
                    <div className="text-center">
                        <p className="text-sm text-danger-600">Critical Urgency</p>
                        <p className="text-2xl font-bold text-danger-700">
                            {requests.filter((r) => r.urgency === 'CRITICAL').length}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Filters Card */}
            <Card>
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search requests..."
                                value={filters.search}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="FULFILLED">Fulfilled</option>
                    </select>

                    {/* Category Filter */}
                    <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Categories</option>
                        <option value="Education">Education</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Food">Food</option>
                        <option value="Shelter">Shelter</option>
                        <option value="Disaster Relief">Disaster Relief</option>
                    </select>

                    {/* Urgency Filter */}
                    <select
                        value={filters.urgency}
                        onChange={(e) => handleFilterChange('urgency', e.target.value)}
                        className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Urgency</option>
                        <option value="CRITICAL">Critical</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>
                </div>
            </Card>

            {/* Requests Table */}
            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary-50 border-b border-secondary-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">Request</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">Requester</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">Category</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">Progress</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-secondary-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-200">
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-secondary-500">
                                        No requests found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((request) => (
                                    <tr key={request.id} className="hover:bg-secondary-50 transition-colors">
                                        {/* Request Title */}
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-secondary-900 line-clamp-1">{request.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant={getUrgencyVariant(request.urgency)} size="sm">
                                                        {request.urgency}
                                                    </Badge>
                                                    <span className="text-xs text-secondary-500">
                                                        {formatDate(request.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Requester */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white font-semibold text-xs">
                                                        {request.createdBy?.name?.substring(0, 2).toUpperCase() || 'NA'}
                                                    </span>
                                                </div>
                                                <span className="text-secondary-700">{request.createdBy?.name || 'Unknown'}</span>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-6 py-4 text-secondary-600">{request.category}</td>

                                        {/* Progress */}
                                        <td className="px-6 py-4">
                                            <div className="w-32">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-secondary-600">
                                                        {formatCurrency(request.currentAmount || 0)}
                                                    </span>
                                                    <span className="text-secondary-500">
                                                        {formatCurrency(request.targetAmount)}
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-secondary-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary-500 rounded-full transition-all"
                                                        style={{ width: `${getProgress(request.currentAmount, request.targetAmount)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <Badge variant={getStatusVariant(request.status)} size="sm">
                                                {request.status}
                                            </Badge>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/requests/${request.id}`}>
                                                    <Button variant="ghost" size="sm">View</Button>
                                                </Link>
                                                {request.status === 'PENDING' && (
                                                    <>
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            onClick={() => openActionModal(request, 'approve')}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => openActionModal(request, 'reject')}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
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
                        <p className="text-sm text-secondary-500">
                            Showing {startIndex} to {endIndex} of {totalItems} requests
                        </p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={prevPage} disabled={!hasPrevPage}>
                                Previous
                            </Button>
                            <Button variant="outline" size="sm" onClick={nextPage} disabled={!hasNextPage}>
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Action Modal */}
            <Modal
                isOpen={showActionModal}
                onClose={() => setShowActionModal(false)}
                title={actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
                size="sm"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setShowActionModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant={actionType === 'approve' ? 'success' : 'danger'}
                            onClick={actionType === 'approve' ? handleApprove : handleReject}
                        >
                            {actionType === 'approve' ? 'Approve' : 'Reject'}
                        </Button>
                    </>
                }
            >
                <div className="py-4">
                    {actionType === 'approve' ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-secondary-600">
                                Approve <strong>{selectedRequest?.title}</strong>?
                            </p>
                            <p className="text-sm text-secondary-500 mt-2">
                                This will allow the request to receive donations.
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <p className="text-secondary-600 text-center mb-4">
                                Reject <strong>{selectedRequest?.title}</strong>?
                            </p>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                                Reason for rejection (optional)
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                rows={3}
                                placeholder="Enter reason..."
                            />
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default RequestsList;
