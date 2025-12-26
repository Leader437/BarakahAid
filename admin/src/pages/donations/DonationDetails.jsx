// Donation Details Page - Full transaction details with status timeline
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Badge, Modal } from '../../components/ui';
import {
    selectDonations,
    setSelectedDonation,
    updateDonation,
    refundDonation,
} from '../../store/donationsSlice';
import { formatCurrency, formatDateTime } from '../../utils/helpers';

// Mock delivery/processing timeline
const generateTimeline = (donation) => {
    const baseTimeline = [
        {
            id: 1,
            status: 'initiated',
            title: 'Donation Initiated',
            description: 'Transaction started by donor',
            date: donation.createdAt,
            completed: true,
        },
        {
            id: 2,
            status: 'processing',
            title: 'Payment Processing',
            description: `Processing via ${donation.paymentGateway}`,
            date: donation.createdAt,
            completed: donation.status !== 'PENDING',
        },
        {
            id: 3,
            status: 'completed',
            title: 'Payment Confirmed',
            description: 'Funds received successfully',
            date: donation.status === 'COMPLETED' ? donation.createdAt : null,
            completed: donation.status === 'COMPLETED',
        },
        {
            id: 4,
            status: 'allocated',
            title: 'Funds Allocated',
            description: donation.campaign ? `Allocated to ${donation.campaign.title}` : 'Allocated to general fund',
            date: donation.status === 'COMPLETED' ? donation.createdAt : null,
            completed: donation.status === 'COMPLETED',
        },
    ];

    if (donation.status === 'FAILED') {
        baseTimeline[2] = {
            ...baseTimeline[2],
            status: 'failed',
            title: 'Payment Failed',
            description: 'Transaction could not be completed',
            completed: true,
            isFailed: true,
        };
        baseTimeline[3].completed = false;
    }

    if (donation.status === 'REFUNDED') {
        baseTimeline.push({
            id: 5,
            status: 'refunded',
            title: 'Refund Processed',
            description: 'Funds returned to donor',
            date: donation.createdAt,
            completed: true,
            isRefund: true,
        });
    }

    return baseTimeline;
};

const DonationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get donation from Redux store
    const donations = useSelector(selectDonations);
    const donation = donations.find((d) => d.id === id);

    // Local state
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    // Redirect if donation not found
    useEffect(() => {
        if (!donation) {
            navigate('/donations');
        } else {
            dispatch(setSelectedDonation(donation));
        }
    }, [donation, navigate, dispatch]);

    if (!donation) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-secondary-900">Donation not found</h1>
                    <Link to="/donations" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                        ← Back to Donations
                    </Link>
                </div>
            </div>
        );
    }

    const timeline = generateTimeline(donation);

    // Handle status update
    const handleStatusUpdate = () => {
        dispatch(updateDonation({ id: donation.id, status: newStatus }));
        setShowStatusModal(false);
        setNewStatus('');
    };

    // Handle refund
    const handleRefund = () => {
        dispatch(refundDonation(donation.id));
        setShowRefundModal(false);
    };

    // Get status badge variant
    const getStatusVariant = (status) => {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'PENDING': return 'warning';
            case 'FAILED': return 'danger';
            case 'REFUNDED': return 'info';
            default: return 'default';
        }
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
                <Link to="/donations" className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Donations
                </Link>
                <span className="text-secondary-400">/</span>
                <span className="text-secondary-600">{donation.transactionId}</span>
            </div>

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-secondary-900 font-heading">
                            Transaction Details
                        </h1>
                        <Badge variant={getStatusVariant(donation.status)} size="lg">
                            {donation.status}
                        </Badge>
                    </div>
                    <p className="text-secondary-500 mt-1">
                        Transaction ID: <span className="font-mono text-secondary-700">{donation.transactionId}</span>
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => setShowStatusModal(true)}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Update Status
                    </Button>
                    {donation.status === 'COMPLETED' && (
                        <Button variant="danger" onClick={() => setShowRefundModal(true)}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            Process Refund
                        </Button>
                    )}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Transaction Details */}
                    <Card>
                        <Card.Header>
                            <h2 className="text-lg font-semibold text-secondary-900">Transaction Details</h2>
                        </Card.Header>
                        <Card.Body>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <dt className="text-sm font-medium text-secondary-500">Transaction ID</dt>
                                    <dd className="mt-1 font-mono text-secondary-900">{donation.transactionId}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-secondary-500">Amount</dt>
                                    <dd className="mt-1 text-2xl font-bold text-success-600">
                                        {formatCurrency(donation.amount)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-secondary-500">Payment Method</dt>
                                    <dd className="mt-1 text-secondary-900">{donation.paymentGateway}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-secondary-500">Date & Time</dt>
                                    <dd className="mt-1 text-secondary-900">{formatDateTime(donation.createdAt)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-secondary-500">Status</dt>
                                    <dd className="mt-1">
                                        <Badge variant={getStatusVariant(donation.status)}>{donation.status}</Badge>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-secondary-500">Campaign</dt>
                                    <dd className="mt-1 text-secondary-900">
                                        {donation.campaign?.title || 'General Donation'}
                                    </dd>
                                </div>
                            </dl>
                        </Card.Body>
                    </Card>

                    {/* Donor Information */}
                    <Card>
                        <Card.Header>
                            <h2 className="text-lg font-semibold text-secondary-900">Donor Information</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-xl">
                                        {donation.donor?.name
                                            ? donation.donor.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
                                            : 'AN'}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-secondary-900">
                                        {donation.donor?.name || 'Anonymous Donor'}
                                    </h3>
                                    <p className="text-secondary-500">{donation.donor?.email || 'No email provided'}</p>

                                    {donation.donor?.id && (
                                        <Link
                                            to={`/users/${donation.donor.id}`}
                                            className="inline-flex items-center gap-1 mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
                                        >
                                            View Donor Profile
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Status Timeline */}
                <div className="space-y-6">
                    <Card>
                        <Card.Header>
                            <h2 className="text-lg font-semibold text-secondary-900">Status Timeline</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="relative">
                                {timeline.map((step, index) => (
                                    <div key={step.id} className="flex gap-4 pb-6 last:pb-0">
                                        {/* Timeline Line */}
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.isFailed
                                                        ? 'bg-danger-100'
                                                        : step.isRefund
                                                            ? 'bg-info-100'
                                                            : step.completed
                                                                ? 'bg-success-100'
                                                                : 'bg-secondary-100'
                                                    }`}
                                            >
                                                {step.isFailed ? (
                                                    <svg className="w-4 h-4 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                ) : step.completed ? (
                                                    <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <div className="w-2 h-2 bg-secondary-400 rounded-full"></div>
                                                )}
                                            </div>
                                            {index < timeline.length - 1 && (
                                                <div
                                                    className={`w-0.5 flex-1 mt-2 ${step.completed ? 'bg-success-200' : 'bg-secondary-200'
                                                        }`}
                                                ></div>
                                            )}
                                        </div>

                                        {/* Timeline Content */}
                                        <div className="flex-1 pb-2">
                                            <h4
                                                className={`font-medium ${step.isFailed
                                                        ? 'text-danger-700'
                                                        : step.completed
                                                            ? 'text-secondary-900'
                                                            : 'text-secondary-400'
                                                    }`}
                                            >
                                                {step.title}
                                            </h4>
                                            <p className="text-sm text-secondary-500 mt-0.5">{step.description}</p>
                                            {step.date && step.completed && (
                                                <p className="text-xs text-secondary-400 mt-1">
                                                    {formatDateTime(step.date)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <Card.Header>
                            <h2 className="text-lg font-semibold text-secondary-900">Quick Actions</h2>
                        </Card.Header>
                        <Card.Body className="space-y-2">
                            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors text-left">
                                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-secondary-900">Print Receipt</p>
                                    <p className="text-xs text-secondary-500">Generate donation receipt</p>
                                </div>
                            </button>

                            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors text-left">
                                <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-secondary-900">Send Confirmation</p>
                                    <p className="text-xs text-secondary-500">Email donor receipt</p>
                                </div>
                            </button>

                            {donation.campaign && (
                                <Link
                                    to={`/campaigns/${donation.campaign.id}`}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors text-left"
                                >
                                    <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-secondary-900">View Campaign</p>
                                        <p className="text-xs text-secondary-500">{donation.campaign.title}</p>
                                    </div>
                                </Link>
                            )}
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* Status Update Modal */}
            <Modal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                title="Update Transaction Status"
                size="sm"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setShowStatusModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleStatusUpdate}
                            disabled={!newStatus}
                        >
                            Update Status
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-secondary-600">
                        Select a new status for this transaction:
                    </p>
                    <div className="space-y-2">
                        {['PENDING', 'COMPLETED', 'FAILED'].map((status) => (
                            <label
                                key={status}
                                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${newStatus === status
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-secondary-200 hover:bg-secondary-50'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="status"
                                    value={status}
                                    checked={newStatus === status}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-4 h-4 text-primary-600"
                                />
                                <Badge variant={getStatusVariant(status)}>{status}</Badge>
                            </label>
                        ))}
                    </div>
                </div>
            </Modal>

            {/* Refund Confirmation Modal */}
            <Modal
                isOpen={showRefundModal}
                onClose={() => setShowRefundModal(false)}
                title="Process Refund"
                size="sm"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setShowRefundModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleRefund}>
                            Confirm Refund
                        </Button>
                    </>
                }
            >
                <div className="text-center py-4">
                    <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                    </div>
                    <p className="text-secondary-600">
                        Are you sure you want to refund <strong>{formatCurrency(donation.amount)}</strong> to{' '}
                        <strong>{donation.donor?.name || 'the donor'}</strong>?
                    </p>
                    <p className="text-sm text-secondary-500 mt-2">
                        This action cannot be undone.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default DonationDetails;
