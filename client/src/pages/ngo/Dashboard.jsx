import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiTrendingUp, 
  HiCash, 
  HiUserGroup, 
  HiChartBar,
  HiCheckCircle,
  HiClock,
  HiPlus,
  HiEye
} from 'react-icons/hi';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/helpers';

const NgoDashboard = () => {
  const { user } = useSelector((state) => state.user);

  // Mock data
  const stats = [
    {
      label: 'Total Raised',
      value: '$245,75',
      change: '+22% this month',
      icon: HiCash,
      color: 'primary'
    },
    {
      label: 'Active Campaigns',
      value: '12',
      change: '3 ending soon',
      icon: HiChartBar,
      color: 'success'
    },
    {
      label: 'Total Donors',
      value: '3,420',
      change: '+156 this month',
      icon: HiUserGroup,
      color: 'warning'
    },
    {
      label: 'People Helped',
      value: '8,450+',
      change: 'Direct impact',
      icon: HiTrendingUp,
      color: 'error'
    }
  ];

  const activeCampaigns = [
    {
      id: 1,
      title: 'Emergency Food Relief - Gaza',
      currentAmount: 45000,
      targetAmount: 100000,
      donors: 1250,
      daysLeft: 15,
      status: 'active',
      category: 'Emergency Relief'
    },
    {
      id: 2,
      title: 'Winter Clothing Drive',
      currentAmount: 15000,
      targetAmount: 40000,
      donors: 320,
      daysLeft: 25,
      status: 'active',
      category: 'Clothing'
    },
    {
      id: 3,
      title: 'Education Support for Orphans',
      currentAmount: 28000,
      targetAmount: 50000,
      donors: 450,
      daysLeft: 30,
      status: 'active',
      category: 'Education'
    }
  ];

  const recentDonations = [
    {
      id: 1,
      donor: 'Anonymous',
      amount: 500,
      campaign: 'Emergency Food Relief',
      date: '2025-12-12',
      time: '2h ago'
    },
    {
      id: 2,
      donor: 'John Smith',
      amount: 250,
      campaign: 'Winter Clothing Drive',
      date: '2025-12-12',
      time: '5h ago'
    },
    {
      id: 3,
      donor: 'Sarah Ahmed',
      amount: 1000,
      campaign: 'Education Support',
      date: '2025-12-11',
      time: '1d ago'
    },
    {
      id: 4,
      donor: 'Anonymous',
      amount: 150,
      campaign: 'Emergency Food Relief',
      date: '2025-12-11',
      time: '1d ago'
    }
  ];

  const pendingRequests = [
    {
      id: 1,
      title: 'Medical Supplies Request',
      status: 'pending',
      amount: 25000,
      requestedDate: '2025-12-10'
    },
    {
      id: 2,
      title: 'School Supplies Approval',
      status: 'pending',
      amount: 15000,
      requestedDate: '2025-12-09'
    }
  ];

  const colorClasses = {
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    error: 'bg-error-100 text-error-700'
  };

  return (
    <div className="min-h-screen py-8 bg-secondary-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900" data-text-split data-letters-slide-up>
            Welcome back, {user?.name || 'Organization'}! 👋
          </h1>
          <p className="mt-1 text-secondary-600">
            Manage your campaigns and track your impact
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} hoverable>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-secondary-600">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold break-all text-secondary-900">{stat.value}</p>
                  <p className="mt-2 text-sm text-secondary-500">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg shrink-0 ${colorClasses[stat.color]}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Active Campaigns */}
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-secondary-900">Active Campaigns</h2>
                <Link to="/ngo/campaigns">
                  <SecondaryButton>View All</SecondaryButton>
                </Link>
              </div>

              <div className="space-y-4">
                {activeCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="p-4 transition-colors border rounded-lg border-secondary-200 hover:bg-secondary-50"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold truncate text-secondary-900">
                            {campaign.title}
                          </h3>
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-success-100 text-success-700">
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-secondary-600">{campaign.category}</p>
                      </div>
                      <Link to={`/ngo/campaigns/${campaign.id}`}>
                        <SecondaryButton>
                          <HiEye className="w-4 h-4" />
                          View
                        </SecondaryButton>
                      </Link>
                    </div>
                    <ProgressBar
                      value={campaign.currentAmount}
                      max={campaign.targetAmount}
                      className="mb-3"
                    />
                    <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <span className="font-semibold text-secondary-900">
                          {formatCurrency(campaign.currentAmount)}
                        </span>
                        <span className="text-secondary-600"> raised of {formatCurrency(campaign.targetAmount)}</span>
                      </div>
                      <div className="text-secondary-600 whitespace-nowrap">
                        {campaign.donors} donors • {campaign.daysLeft} days left
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Donations */}
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-secondary-900">Recent Donations</h2>
                <Link to="/ngo/donations">
                  <SecondaryButton>View All</SecondaryButton>
                </Link>
              </div>

              <div className="space-y-3">
                {recentDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between gap-3 p-3 border rounded-lg border-secondary-200"
                  >
                    <div className="flex items-center flex-1 min-w-0 gap-3">
                      <div className="p-2 rounded-full bg-success-100 shrink-0">
                        <HiCheckCircle className="w-5 h-5 text-success-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate text-secondary-900">{donation.donor}</p>
                        <p className="text-sm truncate text-secondary-600">{donation.campaign}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-primary-600">{formatCurrency(donation.amount)}</p>
                      <p className="text-xs text-secondary-500">{donation.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Quick Actions */}
            <Card padding="lg">
              <h2 className="mb-4 text-lg font-bold text-secondary-900">Quick Actions</h2>
              <div className="space-y-3">
                <div>
                  <Link to="/ngo/campaigns/new">
                    <PrimaryButton className="w-full whitespace-nowrap">
                      <HiPlus className="w-5 h-5" />
                      Create Campaign
                    </PrimaryButton>
                  </Link>
                </div>
                <div>
                  <Link to="/ngo/requests/new">
                    <SecondaryButton className="w-full whitespace-nowrap">
                      <HiPlus className="w-5 h-5" />
                      Create Request
                    </SecondaryButton>
                  </Link>
                </div>
                <div>
                  <Link to="/ngo/reports">
                    <SecondaryButton className="w-full whitespace-nowrap">
                      <HiChartBar className="w-5 h-5" />
                      View Reports
                    </SecondaryButton>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Pending Requests */}
            <Card padding="lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-secondary-900">Pending Requests</h2>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-warning-100 text-warning-700">
                  {pendingRequests.length}
                </span>
              </div>
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-3 border rounded-lg border-warning-200 bg-warning-50"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <HiClock className="w-4 h-4 mt-1 text-warning-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-secondary-900 wrap-break-word">{request.title}</h3>
                        <p className="text-sm text-secondary-600">
                          {formatCurrency(request.amount)}
                        </p>
                        <p className="text-xs text-secondary-500">
                          Requested: {new Date(request.requestedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Impact Summary */}
            <Card padding="lg" className="bg-primary-50">
              <h2 className="mb-4 text-lg font-bold text-secondary-900">This Month's Impact</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-secondary-700">Families Fed</span>
                  <span className="font-semibold text-secondary-900">450</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary-700">Children Educated</span>
                  <span className="font-semibold text-secondary-900">120</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary-700">Medical Treatments</span>
                  <span className="font-semibold text-secondary-900">85</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary-700">Clothing Distributed</span>
                  <span className="font-semibold text-secondary-900">300+</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NgoDashboard;
