import React, { useEffect } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import { formatCurrency, formatDate } from '../../utils/helpers';
import {
  fetchMyCampaigns,
  fetchNgoDonations,
  fetchMyRequests,
  selectMyCampaigns,
  selectNgoDonations,
  selectNgoRequests,
  selectNgoLoading
} from '../../store/ngoSlice';

const NgoDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const myCampaigns = useSelector(selectMyCampaigns);
  const donations = useSelector(selectNgoDonations);
  const requests = useSelector(selectNgoRequests);
  const loading = useSelector(selectNgoLoading);

  useEffect(() => {
    dispatch(fetchMyCampaigns());
    dispatch(fetchNgoDonations());
    dispatch(fetchMyRequests());
  }, [dispatch]);

  // Derived Stats
  const totalRaised = donations.reduce((sum, d) => sum + Number(d.amount), 0);
  const activeCampaignsCount = myCampaigns.filter(c => c.status === 'ACTIVE').length;
  const totalDonors = new Set(donations.map(d => d.donor?.id)).size;

  // Recent 5 donations
  const recentDonations = [...donations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  // Active Campaigns List (Top 3)
  const dashboardCampaigns = myCampaigns
    .filter(c => c.status === 'ACTIVE' || !c.status || c.status === 'active')
    .slice(0, 3);

  // Pending requests from state
  const pendingRequests = requests.filter(r => r.status === 'PENDING').slice(0, 5);

  const stats = [
    {
      label: 'Total Raised',
      value: formatCurrency(totalRaised),
      change: 'Lifetime',
      icon: HiCash,
      color: 'primary'
    },
    {
      label: 'Active Campaigns',
      value: activeCampaignsCount,
      change: `${myCampaigns.length} total`,
      icon: HiChartBar,
      color: 'success'
    },
    {
      label: 'Total Donors',
      value: totalDonors,
      change: 'Unique donors',
      icon: HiUserGroup,
      color: 'warning'
    },
    {
      label: 'Recent Donations',
      value: donations.length,
      change: 'Total received',
      icon: HiTrendingUp,
      color: 'error'
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
                {dashboardCampaigns.map((campaign) => (
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
                            {campaign.status || 'Active'}
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
                      value={Number(campaign.raisedAmount || 0)}
                      max={Number(campaign.goalAmount || campaign.targetAmount || 1)}
                      className="mb-3"
                    />
                    <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <span className="font-semibold text-secondary-900">
                          {formatCurrency(Number(campaign.raisedAmount || 0))}
                        </span>
                        <span className="text-secondary-600"> raised of {formatCurrency(Number(campaign.goalAmount || campaign.targetAmount))}</span>
                      </div>
                      <div className="text-secondary-600 whitespace-nowrap">
                        {(campaign.endDate) ? `${Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days left` : 'Ongoing'}
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
                        <p className="font-semibold truncate text-secondary-900">{donation.donor?.name || 'Anonymous'}</p>
                        <p className="text-sm truncate text-secondary-600">{donation.campaign?.title}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-primary-600">{formatCurrency(Number(donation.amount))}</p>
                      <p className="text-xs text-secondary-500">{new Date(donation.createdAt).toLocaleDateString()}</p>
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
                    <div className="flex items-start gap-3 mb-2">
                      {/* Thumbnail */}
                      {request.media && request.media.length > 0 ? (
                        <img 
                          src={request.media[0]} 
                          alt={request.title}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                          <span className="text-lg font-bold text-primary-400">
                            {request.title?.charAt(0)?.toUpperCase() || 'R'}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-secondary-900 wrap-break-word">{request.title}</h3>
                        <p className="text-sm text-secondary-600">
                          {request.targetAmount ? formatCurrency(Number(request.targetAmount)) : 'See details'}
                        </p>
                        <p className="text-xs text-secondary-500">
                          Requested: {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            </div>
          </div>
        </div>
      </div>
  );
};

export default NgoDashboard;
