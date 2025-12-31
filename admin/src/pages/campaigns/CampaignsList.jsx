// Campaigns List Page - Campaign Management
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Badge, Modal } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import {
    selectFilteredCampaigns,
    selectCampaignsFilters,
    setFilters,
    fetchCampaigns,
    deleteCampaign,
} from '../../store/campaignsSlice';
import usePagination from '../../hooks/usePagination';
import { formatCurrency, formatDate } from '../../utils/helpers';

const CampaignsList = () => {
    const dispatch = useDispatch();
    const toast = useToast();
    const campaigns = useSelector(selectFilteredCampaigns);
    const filters = useSelector(selectCampaignsFilters);

    // Local state for deletion modal
    const [selectedCampaign, setSelectedCampaign] = React.useState(null);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);

    useEffect(() => {
        dispatch(fetchCampaigns());
    }, [dispatch]);

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
    } = usePagination(campaigns, 10);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        dispatch(setFilters({ [key]: value }));
    };

    // Handle search
    const handleSearch = (e) => {
        dispatch(setFilters({ search: e.target.value }));
    };

    // Get status badge variant
    const getStatusVariant = (status) => {
        switch (status) {
            case 'ACTIVE': return 'success';
            case 'DRAFT': return 'warning';
            case 'COMPLETED': return 'info';
            case 'CANCELLED': return 'danger';
            default: return 'default';
        }
    };

    // Calculate progress
    const getProgress = (raised, goal) => {
        if (!goal) return 0;
        return Math.min(Math.round((raised / goal) * 100), 100);
    };

    // Stats
    const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVE').length;
    const totalRaised = campaigns.reduce((sum, c) => sum + Number(c.raisedAmount || 0), 0);
    const totalGoal = campaigns.reduce((sum, c) => sum + Number(c.goalAmount || 0), 0);

    // Handle Delete
    const handleDelete = async () => {
        if (selectedCampaign) {
            try {
                const result = await dispatch(deleteCampaign(selectedCampaign.id));
                if (deleteCampaign.fulfilled.match(result)) {
                    toast.success('Campaign deleted successfully');
                } else {
                    toast.error(result.payload || 'Failed to delete campaign');
                }
            } catch (error) {
                toast.error('An error occurred while deleting');
            }
            setShowDeleteModal(false);
            setSelectedCampaign(null);
        }
    };

    const confirmDelete = (campaign) => {
        setSelectedCampaign(campaign);
        setShowDeleteModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 font-heading">Campaigns</h1>
                    <p className="text-secondary-700 mt-1">
                        Manage fundraising campaigns ({totalItems} total)
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <div className="text-center">
                        <p className="text-secondary-700 text-sm">Total Raised</p>
                        <p className="text-2xl font-bold text-secondary-900">{formatCurrency(totalRaised)}</p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-secondary-700 text-sm">Active Campaigns</p>
                        <p className="text-2xl font-bold text-secondary-900">{activeCampaigns}</p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-secondary-700 text-sm">Total Goal</p>
                        <p className="text-2xl font-bold text-secondary-900">{formatCurrency(totalGoal)}</p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-secondary-700 text-sm">Emergency</p>
                        <p className="text-2xl font-bold text-secondary-900">{campaigns.filter((c) => c.isEmergency).length}</p>
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
                                <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search campaigns..."
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
                        <option value="ACTIVE">Active</option>
                        <option value="DRAFT">Draft</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>

                    {/* Emergency Filter */}
                    <select
                        value={filters.isEmergency}
                        onChange={(e) => handleFilterChange('isEmergency', e.target.value)}
                        className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Types</option>
                        <option value="true">Emergency Only</option>
                        <option value="false">Regular Only</option>
                    </select>
                </div>
            </Card>

            {/* Campaigns Table */}
            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary-50 border-b border-secondary-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">Campaign</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">Organizer</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">Goal</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">Raised</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">Progress</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-secondary-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-200">
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-secondary-700">
                                        No campaigns found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((campaign) => (
                                    <tr key={campaign.id} className="hover:bg-secondary-50 transition-colors">
                                        {/* Campaign Title */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${campaign.isEmergency
                                                    ? 'bg-gradient-to-br from-danger-500 to-danger-600'
                                                    : 'bg-gradient-to-br from-primary-500 to-primary-600'
                                                    }`}>
                                                    {campaign.isEmergency ? (
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-secondary-900 line-clamp-1">{campaign.title}</p>
                                                    <p className="text-xs text-secondary-600">
                                                        {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Organizer */}
                                        <td className="px-6 py-4 text-secondary-700">
                                            {campaign.createdBy?.name || 'Unknown'}
                                        </td>

                                        {/* Goal */}
                                        <td className="px-6 py-4 font-medium text-secondary-900">
                                            {formatCurrency(campaign.goalAmount)}
                                        </td>

                                        {/* Raised */}
                                        <td className="px-6 py-4 font-bold text-success-600">
                                            {formatCurrency(campaign.raisedAmount || 0)}
                                        </td>

                                        {/* Progress */}
                                        <td className="px-6 py-4">
                                            <div className="w-24">
                                                <div className="h-2 bg-secondary-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${getProgress(campaign.raisedAmount, campaign.goalAmount) >= 100
                                                            ? 'bg-success-500'
                                                            : 'bg-primary-500'
                                                            }`}
                                                        style={{ width: `${getProgress(campaign.raisedAmount, campaign.goalAmount)}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-secondary-600 mt-1 text-center">
                                                    {getProgress(campaign.raisedAmount, campaign.goalAmount)}%
                                                </p>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <Badge variant={getStatusVariant(campaign.status)} size="sm">
                                                    {campaign.status}
                                                </Badge>
                                                {campaign.isEmergency && (
                                                    <Badge variant="danger" size="sm">EMERGENCY</Badge>
                                                )}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/campaigns/${campaign.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        View
                                                    </Button>
                                                    </Link>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    className="text-danger-500 hover:text-danger-700 hover:bg-danger-50"
                                                    onClick={() => confirmDelete(campaign)}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
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
                            Showing {startIndex} to {endIndex} of {totalItems} campaigns
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

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Campaign"
                size="sm"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    </>
                }
            >
                <div className="text-center py-4">
                    <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <p className="text-secondary-600">
                        Are you sure you want to delete <strong>{selectedCampaign?.title}</strong>?
                    </p>
                    <p className="text-sm text-secondary-500 mt-2">
                        This action cannot be undone.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default CampaignsList;
