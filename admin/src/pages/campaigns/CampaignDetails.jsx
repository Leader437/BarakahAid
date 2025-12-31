// Campaign Details Page - Full campaign view with progress chart
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import { Card, Button, Badge, Modal, Avatar } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import {
    selectCampaigns,
    setSelectedCampaign,
    publishCampaign,
    pauseCampaign,
    completeCampaign,
    cancelCampaign,
} from '../../store/campaignsSlice';
import { formatCurrency, formatDate } from '../../utils/helpers';

// Generate progress data - shows current status only (no historical data available from backend)
const generateProgressData = (campaign) => {
    // Since we don't have historical donation data from the backend,
    // we show a simple progress indicator based on current and goal amounts
    const raisedAmount = campaign.raisedAmount || 0;
    return [
        { month: 'Start', amount: 0 },
        { month: 'Current', amount: raisedAmount },
    ];
};

const CampaignDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();

    // Get campaign from Redux store
    const campaigns = useSelector(selectCampaigns);
    const campaign = campaigns.find((c) => c.id === id);

    // Local state
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionType, setActionType] = useState('');

    // Redirect if campaign not found
    useEffect(() => {
        if (!campaign) {
            navigate('/campaigns');
        } else {
            dispatch(setSelectedCampaign(campaign));
        }
    }, [campaign, navigate, dispatch]);

    if (!campaign) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-secondary-900">Campaign not found</h1>
                    <Link to="/campaigns" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                        ← Back to Campaigns
                    </Link>
                </div>
            </div>
        );
    }

    // Calculate progress
    const progress = campaign.goalAmount
        ? Math.min(Math.round((campaign.raisedAmount / campaign.goalAmount) * 100), 100)
        : 0;

    // Progress data for chart
    const progressData = generateProgressData(campaign);

    // Pie chart data
    const pieData = [
        { name: 'Raised', value: campaign.raisedAmount || 0 },
        { name: 'Remaining', value: Math.max(0, campaign.goalAmount - (campaign.raisedAmount || 0)) },
    ];
    const COLORS = ['#0ea5e9', '#e2e8f0'];

    // Handle actions
    const handleAction = async () => {
        let action;
        let successMessage = '';

        switch (actionType) {
            case 'publish':
                action = publishCampaign(campaign.id);
                successMessage = 'Campaign published successfully';
                break;
            case 'pause':
                action = pauseCampaign(campaign.id);
                successMessage = 'Campaign paused successfully';
                break;
            case 'complete':
                action = completeCampaign(campaign.id);
                successMessage = 'Campaign marked as complete';
                break;
            case 'cancel':
                action = cancelCampaign(campaign.id);
                successMessage = 'Campaign cancelled';
                break;
            default:
                return;
        }

        try {
            const resultAction = await dispatch(action);
            if (resultAction.meta.requestStatus === 'fulfilled') {
                toast.success(successMessage);
            } else {
                toast.error(resultAction.payload || 'Failed to update campaign status');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        }
        setShowActionModal(false);
    };

    // Get status badge variant
    const getStatusVariant = (status) => {
        switch (status) {
            case 'ACTIVE': return 'success';
            case 'DRAFT': return 'warning';
            case 'COMPLETED': return 'info';
            case 'CANCELLED': return 'danger';
            case 'PAUSED': return 'warning';
            default: return 'default';
        }
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
                <Link to="/campaigns" className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Campaigns
                </Link>
                <span className="text-secondary-500">/</span>
                <span className="text-secondary-600 line-clamp-1">{campaign.title}</span>
            </div>

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl font-bold text-secondary-900 font-heading">{campaign.title}</h1>
                        <Badge variant={getStatusVariant(campaign.status)} size="lg">{campaign.status}</Badge>
                        {campaign.isEmergency && <Badge variant="danger">EMERGENCY</Badge>}
                    </div>
                    <p className="text-secondary-700 mt-1">
                        By {campaign.createdBy?.name || 'Unknown'} • {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                    </p>
                </div>

                {/* Actions based on status */}
                <div className="flex flex-wrap gap-2">
                    {campaign.status === 'DRAFT' && (
                        <Button variant="success" onClick={() => { setActionType('publish'); setShowActionModal(true); }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Publish Campaign
                        </Button>
                    )}
                    {campaign.status === 'ACTIVE' && (
                        <>
                            <Button variant="warning" onClick={() => { setActionType('pause'); setShowActionModal(true); }}>
                                Pause
                            </Button>
                            <Button variant="primary" onClick={() => { setActionType('complete'); setShowActionModal(true); }}>
                                Mark Complete
                            </Button>
                        </>
                    )}
                    {campaign.status === 'PAUSED' && (
                        <Button variant="success" onClick={() => { setActionType('publish'); setShowActionModal(true); }}>
                            Resume
                        </Button>
                    )}
                    {(campaign.status === 'DRAFT' || campaign.status === 'PAUSED') && (
                        <Button variant="danger" onClick={() => { setActionType('cancel'); setShowActionModal(true); }}>
                            Cancel Campaign
                        </Button>
                    )}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Campaign Description */}
                    <Card>
                        <Card.Header>
                            <h2 className="text-lg font-semibold text-secondary-900">Campaign Description</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="prose max-w-none">
                                <p className="text-secondary-700">{campaign.description}</p>
                            </div>

                            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-3 bg-secondary-50 rounded-lg">
                                    <p className="text-2xl font-bold text-primary-600">{campaign.donorCount || 0}</p>
                                    <p className="text-sm text-secondary-700">Donors</p>
                                </div>
                                <div className="text-center p-3 bg-secondary-50 rounded-lg">
                                    <p className="text-2xl font-bold text-success-600">{campaign.beneficiaryCount || 0}</p>
                                    <p className="text-sm text-secondary-700">Beneficiaries</p>
                                </div>
                                <div className="text-center p-3 bg-secondary-50 rounded-lg">
                                    <p className="text-2xl font-bold text-secondary-900">{progress}%</p>
                                    <p className="text-sm text-secondary-700">Funded</p>
                                </div>
                                <div className="text-center p-3 bg-secondary-50 rounded-lg">
                                    <p className="text-2xl font-bold text-warning-600">
                                        {Math.max(0, Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)))}
                                    </p>
                                    <p className="text-sm text-secondary-700">Days Left</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Donation Progress Chart */}
                    <Card>
                        <Card.Header>
                            <h2 className="text-lg font-semibold text-secondary-900">Donation Progress Over Time</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={progressData}>
                                        <defs>
                                            <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#334155' }} />
                                        <YAxis
                                            tick={{ fontSize: 12, fill: '#334155' }}
                                            tickFormatter={(value) => `$${value / 1000}k`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '8px',
                                            }}
                                            formatter={(value) => [formatCurrency(value), 'Raised']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#0ea5e9"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorProgress)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Organizer Info */}
                    <Card>
                        <Card.Header>
                            <h2 className="text-lg font-semibold text-secondary-900">Campaign Organizer</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 flex-shrink-0">
                                    <Avatar
                                        src={campaign.createdBy?.profileImage || campaign.createdBy?.avatar}
                                        name={campaign.createdBy?.name || 'Unknown'}
                                        size="lg"
                                        shape="square"
                                        className="w-full h-full text-xl"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-secondary-900">
                                        {campaign.createdBy?.name || 'Unknown Organization'}
                                    </h3>
                                    <Badge variant="primary" size="sm">NGO</Badge>

                                    {campaign.createdBy?.id && (
                                        <Link
                                            to={`/users/${campaign.createdBy.id}`}
                                            className="inline-flex items-center gap-1 mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                                        >
                                            View Profile
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

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Funding Progress */}
                    <Card>
                        <Card.Header>
                            <h2 className="text-lg font-semibold text-secondary-900">Funding Overview</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={70}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="text-center -mt-4">
                                <p className="text-3xl font-bold text-primary-600">{progress}%</p>
                                <p className="text-secondary-700">of goal reached</p>
                            </div>

                            <div className="mt-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-secondary-600">Goal</span>
                                    <span className="font-semibold text-secondary-900">{formatCurrency(campaign.goalAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary-600">Raised</span>
                                    <span className="font-semibold text-success-600">{formatCurrency(campaign.raisedAmount || 0)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary-600">Remaining</span>
                                    <span className="font-semibold text-secondary-900">
                                        {formatCurrency(Math.max(0, campaign.goalAmount - (campaign.raisedAmount || 0)))}
                                    </span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Campaign Stats */}
                    <Card>
                        <Card.Header>
                            <h2 className="text-lg font-semibold text-secondary-900">Campaign Stats</h2>
                        </Card.Header>
                        <Card.Body className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-secondary-600">Total Donors</span>
                                <span className="font-medium text-secondary-900">{campaign.donorCount || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-secondary-600">Beneficiaries</span>
                                <span className="font-medium text-secondary-900">{campaign.beneficiaryCount || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-secondary-600">Start Date</span>
                                <span className="font-medium text-secondary-900">{formatDate(campaign.startDate)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-secondary-600">End Date</span>
                                <span className="font-medium text-secondary-900">{formatDate(campaign.endDate)}</span>
                            </div>
                            <hr className="border-secondary-200" />
                            <div className="flex justify-between">
                                <span className="text-secondary-600">Status</span>
                                <Badge variant={getStatusVariant(campaign.status)}>{campaign.status}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-secondary-600">Type</span>
                                <Badge variant={campaign.isEmergency ? 'danger' : 'primary'}>
                                    {campaign.isEmergency ? 'Emergency' : 'Regular'}
                                </Badge>
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
                    actionType === 'publish' ? 'Publish Campaign' :
                        actionType === 'pause' ? 'Pause Campaign' :
                            actionType === 'complete' ? 'Complete Campaign' :
                                'Cancel Campaign'
                }
                size="sm"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setShowActionModal(false)}>Cancel</Button>
                        <Button
                            variant={actionType === 'cancel' ? 'danger' : 'success'}
                            onClick={handleAction}
                        >
                            Confirm
                        </Button>
                    </>
                }
            >
                <div className="py-4 text-center">
                    <div className={`w-16 h-16 ${actionType === 'cancel' ? 'bg-danger-100' : 'bg-success-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        {actionType === 'cancel' ? (
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
                        {actionType === 'publish' && 'Publish this campaign to make it visible to donors?'}
                        {actionType === 'pause' && 'Pause this campaign? It will stop accepting donations temporarily.'}
                        {actionType === 'complete' && 'Mark this campaign as complete? This will close it for new donations.'}
                        {actionType === 'cancel' && 'Cancel this campaign? This action cannot be undone.'}
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default CampaignDetails;
