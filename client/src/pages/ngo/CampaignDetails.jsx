import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiArrowLeft, HiPencil, HiClock, HiUserGroup, HiCash } from 'react-icons/hi';
import Card from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import ProgressBar from '../../components/ui/ProgressBar';
import { formatCurrency, formatDate } from '../../utils/helpers';
import api from '../../utils/api';

const CampaignDetails = () => {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/campaigns/${id}`);
                const data = response.data?.data || response.data;
                setCampaign(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load campaign');
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen py-8 bg-secondary-50 flex items-center justify-center">
                <p className="text-secondary-600">Loading campaign...</p>
            </div>
        );
    }

    if (error || !campaign) {
        return (
            <div className="min-h-screen py-8 bg-secondary-50">
                <div className="px-4 mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <Card padding="lg" className="text-center">
                        <p className="text-error-600 mb-4">{error || 'Campaign not found'}</p>
                        <Link to="/ngo/campaigns">
                            <SecondaryButton>
                                <HiArrowLeft className="w-4 h-4 mr-2" />
                                Back to Campaigns
                            </SecondaryButton>
                        </Link>
                    </Card>
                </div>
            </div>
        );
    }

    const progress = campaign.goalAmount ? (Number(campaign.raisedAmount || 0) / Number(campaign.goalAmount)) * 100 : 0;

    return (
        <div className="min-h-screen py-8 bg-secondary-50">
            <div className="px-4 mx-auto max-w-4xl sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Link to="/ngo/campaigns" className="flex items-center text-secondary-600 hover:text-secondary-900">
                        <HiArrowLeft className="w-5 h-5 mr-2" />
                        Back to Campaigns
                    </Link>
                    <Link to={`/ngo/campaigns/${id}/edit`}>
                        <PrimaryButton>
                            <HiPencil className="w-4 h-4 mr-2" />
                            Edit Campaign
                        </PrimaryButton>
                    </Link>
                </div>

                {/* Campaign Card */}
                <Card padding="lg" className="mb-6">
                    {/* Title and Status */}
                    <div className="mb-6">
                        <div className="flex items-start justify-between mb-2">
                            <h1 className="text-2xl font-bold text-secondary-900">{campaign.title}</h1>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${campaign.status === 'ACTIVE' || campaign.status === 'active'
                                    ? 'bg-success-100 text-success-700'
                                    : 'bg-secondary-100 text-secondary-700'
                                }`}>
                                {campaign.status || 'Active'}
                            </span>
                        </div>
                        <p className="text-secondary-600">{campaign.category?.name || campaign.category || 'General'}</p>
                    </div>

                    {/* Progress */}
                    <div className="mb-6">
                        <ProgressBar value={Number(campaign.raisedAmount || 0)} max={Number(campaign.goalAmount || 1)} className="mb-3" />
                        <div className="flex justify-between text-sm">
                            <span className="font-semibold text-primary-600">{formatCurrency(campaign.raisedAmount || 0)} raised</span>
                            <span className="text-secondary-600">of {formatCurrency(campaign.goalAmount || 0)} goal</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-secondary-50 rounded-lg">
                            <HiCash className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                            <p className="text-2xl font-bold text-secondary-900">{formatCurrency(campaign.raisedAmount || 0)}</p>
                            <p className="text-sm text-secondary-600">Raised</p>
                        </div>
                        <div className="text-center p-4 bg-secondary-50 rounded-lg">
                            <HiUserGroup className="w-6 h-6 mx-auto mb-2 text-success-600" />
                            <p className="text-2xl font-bold text-secondary-900">{campaign.donorsCount || 0}</p>
                            <p className="text-sm text-secondary-600">Donors</p>
                        </div>
                        <div className="text-center p-4 bg-secondary-50 rounded-lg">
                            <HiClock className="w-6 h-6 mx-auto mb-2 text-warning-600" />
                            <p className="text-2xl font-bold text-secondary-900">
                                {campaign.endDate ? Math.max(0, Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24))) : '∞'}
                            </p>
                            <p className="text-sm text-secondary-600">Days Left</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-secondary-900 mb-2">Description</h2>
                        <p className="text-secondary-700 whitespace-pre-wrap">{campaign.description}</p>
                    </div>

                    {/* Dates */}
                    <div className="border-t border-secondary-200 pt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-secondary-600">Created:</span>
                                <span className="ml-2 text-secondary-900">{formatDate(campaign.createdAt)}</span>
                            </div>
                            {campaign.endDate && (
                                <div>
                                    <span className="text-secondary-600">End Date:</span>
                                    <span className="ml-2 text-secondary-900">{formatDate(campaign.endDate)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CampaignDetails;
