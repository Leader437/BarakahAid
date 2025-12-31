import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiSearch,
  HiPlus,
  HiPencil,
  HiTrash,
  HiEye,
  HiCheckCircle,
  HiClock,
  HiExclamation
} from 'react-icons/hi';
import Card from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';
import ProgressBar from '../../components/ui/ProgressBar';
import { formatCurrency } from '../../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../components/ui/Toast';
import {
  fetchMyCampaigns,
  deleteCampaign,
  selectMyCampaigns,
  selectNgoLoading
} from '../../store/ngoSlice';

const ManageCampaigns = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const campaigns = useSelector(selectMyCampaigns);
  const loading = useSelector(selectNgoLoading);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchMyCampaigns());
  }, [dispatch]);

  const handleDeleteClick = (campaign) => {
    setCampaignToDelete(campaign);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!campaignToDelete) return;
    
    setDeleting(true);
    try {
      await dispatch(deleteCampaign(campaignToDelete.id)).unwrap();
      toast.success(`Campaign "${campaignToDelete.title}" deleted successfully`);
      setDeleteModalOpen(false);
      setCampaignToDelete(null);
    } catch (error) {
      toast.error(error || 'Failed to delete campaign');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setCampaignToDelete(null);
  };

  const statuses = ['All', 'Active', 'Completed', 'Paused', 'Draft'];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = (campaign.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (campaign.category?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' ||
      (campaign.status && campaign.status.toLowerCase() === selectedStatus) ||
      (!campaign.status && selectedStatus === 'active');
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : 'active';
    const styles = {
      active: 'bg-success-100 text-success-700',
      completed: 'bg-primary-100 text-primary-700',
      paused: 'bg-warning-100 text-warning-700',
      draft: 'bg-secondary-100 text-secondary-700'
    };
    return styles[s] || styles.draft;
  };

  const getStatusIcon = (status) => {
    const s = status ? status.toLowerCase() : 'active';
    switch (s) {
      case 'active':
      case 'completed':
        return <HiCheckCircle className="w-4 h-4" />;
      case 'paused':
        return <HiClock className="w-4 h-4" />;
      case 'draft':
        return <HiPencil className="w-4 h-4" />;
      default:
        return <HiClock className="w-4 h-4" />;
    }
  };

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => !c.status || c.status === 'ACTIVE' || c.status === 'active').length,
    completed: campaigns.filter(c => c.status === 'COMPLETED' || c.status === 'completed').length,
    draft: campaigns.filter(c => c.status === 'DRAFT' || c.status === 'draft').length
  };

  return (
    <div className="min-h-screen py-8 bg-secondary-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Manage Campaigns</h1>
            <p className="mt-1 text-secondary-600">Create and manage your fundraising campaigns</p>
          </div>
          <Link to="/ngo/campaigns/new">
            <PrimaryButton>
              <HiPlus className="w-5 h-5" />
              Create Campaign
            </PrimaryButton>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
          <Card padding="lg">
            <div className="text-center">
              <p className="text-sm text-secondary-600">Total Campaigns</p>
              <p className="mt-1 text-3xl font-bold text-secondary-900">{stats.total}</p>
            </div>
          </Card>
          <Card padding="lg">
            <div className="text-center">
              <p className="text-sm text-secondary-600">Active</p>
              <p className="mt-1 text-3xl font-bold text-success-600">{stats.active}</p>
            </div>
          </Card>
          <Card padding="lg">
            <div className="text-center">
              <p className="text-sm text-secondary-600">Completed</p>
              <p className="mt-1 text-3xl font-bold text-primary-600">{stats.completed}</p>
            </div>
          </Card>
          <Card padding="lg">
            <div className="text-center">
              <p className="text-sm text-secondary-600">Drafts</p>
              <p className="mt-1 text-3xl font-bold text-secondary-600">{stats.draft}</p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card padding="lg" className="mb-6">
          <div className="space-y-4">
            <div className="relative">
              <HiSearch className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-secondary-700">Filter by Status</label>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status.toLowerCase())}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      status.toLowerCase() === selectedStatus
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} padding="none" hoverable className="overflow-hidden">
              {campaign.image ? (
                <div className="relative h-40 bg-secondary-100">
                  <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(campaign.status)}`}>
                      {getStatusIcon(campaign.status)}
                      {campaign.status || 'Active'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative h-40 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary-300">{campaign.title?.charAt(0)?.toUpperCase() || 'C'}</span>
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(campaign.status)}`}>
                      {getStatusIcon(campaign.status)}
                      {campaign.status || 'Active'}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="p-4">
                <h3 className="mb-1 text-lg font-semibold text-secondary-900 line-clamp-2">{campaign.title}</h3>
                <p className="text-sm text-secondary-600 mb-3">{campaign.category}</p>

                {campaign.status !== 'draft' && (
                  <>
                    <ProgressBar
                      value={Number(campaign.raisedAmount || 0)}
                      max={Number(campaign.goalAmount || campaign.targetAmount || 1)}
                      className="mb-3"
                    />
                    <div className="mb-3 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-secondary-600">Raised</span>
                        <span className="font-semibold text-secondary-900">{formatCurrency(Number(campaign.raisedAmount || 0))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-600">Goal</span>
                        <span className="font-semibold text-secondary-900">{formatCurrency(Number(campaign.goalAmount || campaign.targetAmount))}</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-2 pt-3 border-t border-secondary-200">
                  <Link to={`/ngo/campaigns/${campaign.id}`} className="flex-1">
                    <button className="flex items-center justify-center w-full gap-1 px-2 py-2 text-xs font-medium transition-colors border rounded-lg border-secondary-300 text-secondary-700 hover:bg-secondary-50">
                      <HiEye className="w-4 h-4" />
                      View
                    </button>
                  </Link>
                  <Link to={`/ngo/campaigns/${campaign.id}/edit`} className="flex-1">
                    <button className="flex items-center justify-center w-full gap-1 px-2 py-2 text-xs font-medium transition-colors border rounded-lg border-secondary-300 text-secondary-700 hover:bg-secondary-50">
                      <HiPencil className="w-4 h-4" />
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(campaign)}
                    className="p-2 transition-colors rounded-lg text-error-600 hover:bg-error-50"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-secondary-600">No campaigns found.</p>
            <p className="mt-2 text-sm text-secondary-500">Try adjusting your filters or create a new campaign.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-500/20"
          onClick={(e) => e.target === e.currentTarget && handleCancelDelete()}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-error-100">
                <HiExclamation className="w-6 h-6 text-error-600" />
              </div>
              <h3 className="text-lg font-bold text-center text-secondary-900">Delete Campaign</h3>
              <p className="mt-2 text-center text-secondary-600">
                Are you sure you want to delete <strong>"{campaignToDelete?.title}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 p-6 border-t border-secondary-200">
              <button
                onClick={handleCancelDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-sm font-medium border rounded-lg border-secondary-300 text-secondary-700 hover:bg-secondary-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg bg-error-600 hover:bg-error-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCampaigns;
