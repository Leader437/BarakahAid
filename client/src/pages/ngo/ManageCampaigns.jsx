import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiSearch, 
  HiPlus, 
  HiPencil, 
  HiTrash,
  HiEye,
  HiCheckCircle,
  HiClock,
  HiXCircle
} from 'react-icons/hi';
import Card from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import ProgressBar from '../../components/ui/ProgressBar';
import { formatCurrency } from '../../utils/helpers';

const ManageCampaigns = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock campaigns data
  const campaigns = [
    {
      id: 1,
      title: 'Emergency Food Relief - Gaza',
      category: 'Emergency Relief',
      status: 'active',
      currentAmount: 45000,
      targetAmount: 100000,
      donors: 1250,
      startDate: '2025-11-15',
      endDate: '2025-12-30',
      daysLeft: 15,
      views: 8500
    },
    {
      id: 2,
      title: 'Winter Clothing Drive',
      category: 'Clothing',
      status: 'active',
      currentAmount: 15000,
      targetAmount: 40000,
      donors: 320,
      startDate: '2025-11-20',
      endDate: '2026-01-15',
      daysLeft: 25,
      views: 3200
    },
    {
      id: 3,
      title: 'Education Support for Orphans',
      category: 'Education',
      status: 'active',
      currentAmount: 28000,
      targetAmount: 50000,
      donors: 450,
      startDate: '2025-11-10',
      endDate: '2025-12-31',
      daysLeft: 18,
      views: 5600
    },
    {
      id: 4,
      title: 'Clean Water Project - Yemen',
      category: 'Water & Sanitation',
      status: 'completed',
      currentAmount: 150000,
      targetAmount: 150000,
      donors: 2000,
      startDate: '2025-09-01',
      endDate: '2025-11-30',
      daysLeft: 0,
      views: 15000
    },
    {
      id: 5,
      title: 'Medical Aid for Syria',
      category: 'Healthcare',
      status: 'paused',
      currentAmount: 85000,
      targetAmount: 200000,
      donors: 890,
      startDate: '2025-10-01',
      endDate: '2026-02-28',
      daysLeft: 77,
      views: 12000
    },
    {
      id: 6,
      title: 'Ramadan Food Distribution',
      category: 'Food Relief',
      status: 'draft',
      currentAmount: 0,
      targetAmount: 75000,
      donors: 0,
      startDate: '2026-03-01',
      endDate: '2026-04-10',
      daysLeft: null,
      views: 0
    }
  ];

  const statuses = ['All', 'Active', 'Completed', 'Paused', 'Draft'];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || campaign.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-success-100 text-success-700',
      completed: 'bg-primary-100 text-primary-700',
      paused: 'bg-warning-100 text-warning-700',
      draft: 'bg-secondary-100 text-secondary-700'
    };
    return styles[status] || styles.draft;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <HiCheckCircle className="w-4 h-4" />;
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
    active: campaigns.filter(c => c.status === 'active').length,
    completed: campaigns.filter(c => c.status === 'completed').length,
    draft: campaigns.filter(c => c.status === 'draft').length
  };

  return (
    <div className="min-h-screen py-8 bg-secondary-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Manage Campaigns</h1>
            <p className="mt-1 text-secondary-600">
              Create and manage your fundraising campaigns
            </p>
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
            {/* Search */}
            <div className="relative">
              <HiSearch className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
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
            <Card key={campaign.id} padding="lg" hoverable>
              <div className="mb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusBadge(campaign.status)}`}>
                    {getStatusIcon(campaign.status)}
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                  <span className="text-xs text-secondary-500 whitespace-nowrap">{campaign.views} views</span>
                </div>
                <h3 className="mb-1 text-lg font-semibold break-words text-secondary-900 line-clamp-2 min-h-[3.5rem]">
                  {campaign.title}
                </h3>
                <p className="text-sm truncate text-secondary-600">{campaign.category}</p>
              </div>

              {campaign.status !== 'draft' && (
                <>
                  <ProgressBar
                    value={campaign.currentAmount}
                    max={campaign.targetAmount}
                    className="mb-3"
                  />
                  <div className="mb-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Raised</span>
                      <span className="font-semibold text-secondary-900">
                        {formatCurrency(campaign.currentAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Goal</span>
                      <span className="font-semibold text-secondary-900">
                        {formatCurrency(campaign.targetAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Donors</span>
                      <span className="font-semibold text-secondary-900">{campaign.donors}</span>
                    </div>
                    {campaign.daysLeft !== null && campaign.daysLeft > 0 && (
                      <div className="flex justify-between">
                        <span className="text-secondary-600">Days Left</span>
                        <span className="font-semibold text-secondary-900">{campaign.daysLeft}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-3 border-t border-secondary-200">
                <button className="flex items-center justify-center flex-1 gap-1 px-2 py-2 text-xs font-medium transition-colors border rounded-lg border-secondary-300 text-secondary-700 hover:bg-secondary-50">
                  <HiEye className="w-4 h-4" />
                  View
                </button>
                <button className="flex items-center justify-center flex-1 gap-1 px-2 py-2 text-xs font-medium transition-colors border rounded-lg border-secondary-300 text-secondary-700 hover:bg-secondary-50">
                  <HiPencil className="w-4 h-4" />
                  Edit
                </button>
                <button className="p-2 transition-colors rounded-lg text-error-600 hover:bg-error-50 shrink-0">
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCampaigns.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-secondary-600">No campaigns found.</p>
            <p className="mt-2 text-sm text-secondary-500">Try adjusting your filters or create a new campaign.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCampaigns;
