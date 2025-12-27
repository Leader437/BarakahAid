// Request Details Page - Full request view with requester info and history
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Badge, Modal } from '../../components/ui';
import {
    selectRequests,
    setSelectedRequest,
    approveRequest,
    rejectRequest,
    markFulfilled,
} from '../../store/requestsSlice';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/helpers';

const RequestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get request from Redux store
    const requests = useSelector(selectRequests);
    const request = requests.find((r) => r.id === id);

    // Local state
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionType, setActionType] = useState('');
    const [rejectReason, setRejectReason] = useState('');

    // Redirect if request not found
    useEffect(() => {
        if (!request) {
            navigate('/requests');
        } else {
            dispatch(setSelectedRequest(request));
        }
    }, [request, navigate, dispatch]);

    if (!request) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-secondary-900">Request not found</h1>
                    <Link to="/requests" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                        ← Back to Requests
                    </Link>
                </div>
            </div>
        );
    }

    // Calculate progress
    const progress = request.targetAmount
        ? Math.min(Math.round((request.currentAmount / request.targetAmount) * 100), 100)
        : 0;

    // Mock request history
    const history = [
        { action: 'Request Created', date: request.createdAt, user: request.createdBy?.name },
        ...(request.status === 'APPROVED'
            ? [{ action: 'Request Approved', date: request.createdAt, user: 'Admin' }]
            : []),
        ...(request.status === 'REJECTED'
            ? [{ action: 'Request Rejected', date: request.createdAt, user: 'Admin' }]
            : []),
    ];

    // Handle actions
    const handleAction = () => {
        if (actionType === 'approve') {
            dispatch(approveRequest(request.id));
        } else if (actionType === 'reject') {
            dispatch(rejectRequest(request.id));
        } else if (actionType === 'fulfill') {
            dispatch(markFulfilled(request.id));
        }
        setShowActionModal(false);
    };

    // Get status badge variant
    const getStatusVariant = (status) => {
        switch (status) {
            case 'APPROVED': return 'success';
            case 'PENDING': return 'warning';
            case 'REJECTED': return 'danger';
            case 'FULFILLED': return 'info';
            default: return 'default';
        }
    };

    const getUrgencyVariant = (urgency) => {
        switch (urgency) {
            case 'CRITICAL': return 'danger';
            case 'HIGH': return 'warning';
            case 'MEDIUM': return 'info';
            default: return 'default';
        }
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
                <Link to="/requests" className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Requests
                </Link>
                <span className="text-secondary-500">/</span>
                <span className="text-secondary-600 line-clamp-1">{request.title}</span>
            </div>

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl font-bold text-secondary-900 font-heading">{request.title}</h1>
                        <Badge variant={getStatusVariant(request.status)} size="lg">{request.status}</Badge>
                        <Badge variant={getUrgencyVariant(request.urgency)}>{request.urgency} Priority</Badge>
                    </div>
                    <p className="text-secondary-700 mt-1">
                        Submitted on {formatDate(request.createdAt)} • {request.location}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                    {request.status === 'PENDING' && (
                        <>
                            <Button
                                variant="success"
                                onClick={() => { setActionType('approve'); setShowActionModal(true); }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Approve Request
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => { setActionType('reject'); setShowActionModal(true); }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Reject
                            </Button>
                        </>
                    )}
                    {request.status === 'APPROVED' && progress >= 100 && (
                        <Button
                            variant="primary"
                            onClick={() => { setActionType('fulfill'); setShowActionModal(true); }}
                        >
                            Mark as Fulfilled
                        </Button>
                    )}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Request Details */}
                    <Card>
                        <Card.Header>
                            <h2 className="text-lg font-semibold text-secondary-900">Request Details</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="prose max-w-none">
                                <p className="text-secondary-700">{request.description}</p>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-secondary-700">Category</p>
                                    <p className="font-medium text-secondary-900">{request.category}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary-700">Beneficiaries</p>
                                    <p className="font-medium text-secondary-900">{request.beneficiaryCount || 0} people</p>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary-700">Deadline</p>
                                    <p className="font-medium text-secondary-900">{formatDate(request.deadline)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary-700">Location</p>
                                    <p className="font-medium text-secondary-900">{request.location}</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Mock Photos Gallery */}
                    <Card>
                        <Card.Header>
                            <h2 className="text-lg font-semibold text-secondary-900">Supporting Images</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="aspect-video bg-gradient-to-br from-secondary-200 to-secondary-300 rounded-lg flex items-center justify-center"
                                    >
                                        <svg className="w-12 h-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-secondary-700 mt-3 text-center">
                                Images submitted by requester for verification
                            </p>
                        </Card.Body>
                    </Card>

                    {/* Request History */}
                    <Card>
                        <Card.Header>
                            <h2 className="text-lg font-semibold text-secondary-900">Request History</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-4">
                                {history.map((item, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-secondary-900">{item.action}</p>
                                            <p className="text-sm text-secondary-700">
                                                By {item.user} • {formatDateTime(item.date)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Funding Progress */}
                    <Card>
                        <Card.Header>
                            <h2 className="text-lg font-semibold text-secondary-900">Funding Progress</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="text-center mb-4">
                                <p className="text-3xl font-bold text-primary-600">
                                    {formatCurrency(request.currentAmount || 0)}
                                </p>
                                <p className="text-secondary-700">
                                    raised of {formatCurrency(request.targetAmount)} goal
                                </p>
                            </div>

                            <div className="h-4 bg-secondary-200 rounded-full overflow-hidden mb-2">
                                <div
                                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-center text-sm text-secondary-600">{progress}% funded</p>
                        </Card.Body>
                    </Card>

                    {/* Requester Info */}
                    <Card>
                        <Card.Header>
                            <h2 className="text-lg font-semibold text-secondary-900">Requester Info</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center">
                                    <span className="text-accent-700 font-bold text-lg">
                                        {request.createdBy?.name?.substring(0, 2).toUpperCase() || 'NA'}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-semibold text-secondary-900">{request.createdBy?.name || 'Unknown'}</p>
                                    <Badge variant="primary" size="sm">NGO</Badge>
                                </div>
                            </div>

                            {request.createdBy?.id && (
                                <Link
                                    to={`/users/${request.createdBy.id}`}
                                    className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                                >
                                    View Full Profile
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <Card.Header>
                            <h2 className="text-lg font-semibold text-secondary-900">Quick Stats</h2>
                        </Card.Header>
                        <Card.Body className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-secondary-600">Target Amount</span>
                                <span className="font-medium text-secondary-900">{formatCurrency(request.targetAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-secondary-600">Current Amount</span>
                                <span className="font-medium text-success-600">{formatCurrency(request.currentAmount || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-secondary-600">Remaining</span>
                                <span className="font-medium text-secondary-900">
                                    {formatCurrency(Math.max(0, request.targetAmount - (request.currentAmount || 0)))}
                                </span>
                            </div>
                            <hr className="border-secondary-200" />
                            <div className="flex justify-between">
                                <span className="text-secondary-600">Beneficiaries</span>
                                <span className="font-medium text-secondary-900">{request.beneficiaryCount || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-secondary-600">Days Left</span>
                                <span className="font-medium text-secondary-900">
                                    {Math.max(0, Math.ceil((new Date(request.deadline) - new Date()) / (1000 * 60 * 60 * 24)))}
                                </span>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* Action Modal */}
            <Modal
                isOpen={showActionModal}
                onClose={() => setShowActionModal(false)}
                title={
                    actionType === 'approve' ? 'Approve Request' :
                        actionType === 'reject' ? 'Reject Request' : 'Mark as Fulfilled'
                }
                size="sm"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setShowActionModal(false)}>Cancel</Button>
                        <Button
                            variant={actionType === 'reject' ? 'danger' : 'success'}
                            onClick={handleAction}
                        >
                            Confirm
                        </Button>
                    </>
                }
            >
                <div className="py-4 text-center">
                    <div className={`w-16 h-16 ${actionType === 'reject' ? 'bg-danger-100' : 'bg-success-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        {actionType === 'reject' ? (
                            <svg className="w-8 h-8 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                    <p className="text-secondary-600">
                        {actionType === 'approve' && 'Approve this request to allow it to receive donations?'}
                        {actionType === 'reject' && 'Are you sure you want to reject this request?'}
                        {actionType === 'fulfill' && 'Mark this request as fulfilled?'}
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default RequestDetails;
