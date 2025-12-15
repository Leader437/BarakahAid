// Donor Dashboard
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiTrendingUp, HiHeart, HiUserGroup, HiChartBar, HiClock, HiCheckCircle } from 'react-icons/hi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import PrimaryButton from '../../components/ui/PrimaryButton';
import ProgressBar from '../../components/ui/ProgressBar';
import { formatCurrency } from '../../utils/helpers';
import { getDonationStats } from '../../store/donationsSlice';
import { fetchRequests } from '../../store/requestsSlice';

const DonorDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { requests = [] } = useSelector((state) => state.requests || {});
  const [stats, setStats] = React.useState(null);

  useEffect(() => {
    dispatch(fetchRequests({ status: 'active' }));
    
    // Fetch donation stats
    if (user?.id) {
      dispatch(getDonationStats(user?.id)).then((result) => {
        setStats(result);
      }).catch(() => {
        // Handle error silently
      });
    }
  }, [dispatch, user]);

  const featuredRequests = (requests || []).slice(0, 3);

  // Recent donations data
  const recentDonations = [
    { id: 1, campaign: 'Emergency Food Relief - Gaza', amount: 150, date: '2024-12-01', status: 'completed' },
    { id: 2, campaign: 'Education Support for Orphans', amount: 200, date: '2024-11-28', status: 'completed' },
    { id: 3, campaign: 'Clean Water Project - Yemen', amount: 500, date: '2024-11-15', status: 'completed' }
  ];

  // Impact metrics
  const impactMetrics = [
    { label: 'Families Fed', value: '156', icon: HiUserGroup, color: 'primary' },
    { label: 'Children Educated', value: '42', icon: HiHeart, color: 'success' },
    { label: 'Wells Built', value: '3', icon: HiTrendingUp, color: 'accent' }
  ];

  return (
    <div className="min-h-screen py-8 bg-secondary-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Welcome Header */}
          <div>
            <h1 className="text-3xl font-bold text-secondary-900" data-text-split data-letters-slide-up>
              Welcome back, {user?.name || 'Donor'}!
            </h1>
        <p className="mt-1 text-secondary-600">
          Thank you for making a difference in people's lives.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-secondary-600">Total Donated</p>
              <p className="text-2xl font-bold text-primary-600">
                {stats ? formatCurrency(stats.totalDonated) : '$2,575'}
              </p>
              <p className="flex items-center gap-1 mt-1 text-xs text-success-600">
                <HiTrendingUp className="w-3 h-3" />
                <span>+12% this month</span>
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100">
              <HiChartBar className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-secondary-600">Total Donations</p>
              <p className="text-2xl font-bold text-success-600">
                {stats?.totalDonations || 8}
              </p>
              <p className="mt-1 text-xs text-secondary-600">Across 6 campaigns</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-success-100">
              <HiCheckCircle className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-secondary-600">Lives Impacted</p>
              <p className="text-2xl font-bold text-accent-600">
                {(stats?.totalDonations || 8) * 12}+
              </p>
              <p className="mt-1 text-xs text-secondary-600">People helped</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent-100">
              <HiUserGroup className="w-6 h-6 text-accent-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Impact Metrics */}
      <Card padding="lg">
        <h2 className="mb-4 text-xl font-semibold text-secondary-900">Your Impact</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {impactMetrics.map((metric, index) => {
            const Icon = metric.icon;
            const colorClasses = {
              primary: 'bg-primary-100 text-primary-600',
              success: 'bg-success-100 text-success-600',
              accent: 'bg-accent-100 text-accent-600'
            };
            const bgColor = colorClasses[metric.color]?.split(' ')[0] || 'bg-primary-100';
            const textColor = colorClasses[metric.color]?.split(' ')[1] || 'text-primary-600';
            return (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center shrink-0`}>
                  <Icon className={`w-6 h-6 ${textColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900">{metric.value}</p>
                  <p className="text-sm text-secondary-600">{metric.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card padding="lg">
        <h2 className="mb-4 text-xl font-semibold text-secondary-900">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Link to="/donor/browse-requests">
            <Button variant="outline" fullWidth>
              Browse Requests
            </Button>
          </Link>
          <Link to="/donor/donation-history">
            <Button variant="outline" fullWidth>
              My Donations
            </Button>
          </Link>
          <Link to="/campaigns">
            <Button variant="outline" fullWidth>
              View Campaigns
            </Button>
          </Link>
          <Link to="/donor/donation-tracking">
            <Button variant="outline" fullWidth>
              Track Impact
            </Button>
          </Link>
        </div>
      </Card>

      {/* Recent Donations */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-secondary-900">Recent Donations</h2>
          <Link to="/donor/donation-history">
            <Button variant="ghost" size="sm">View All →</Button>
          </Link>
        </div>
        <div className="space-y-3">
          {recentDonations.map((donation) => (
            <div key={donation.id} className="flex items-center justify-between p-4 transition-colors rounded-lg bg-secondary-50 hover:bg-secondary-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success-100">
                  <HiCheckCircle className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <p className="font-medium text-secondary-900">{donation.campaign}</p>
                  <p className="text-sm text-secondary-600">
                    {new Date(donation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-primary-600">{formatCurrency(donation.amount)}</p>
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-success-100 text-success-700">
                  {donation.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Featured Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-secondary-900">Featured Requests</h2>
          <Link to="/donor/browse-requests">
            <Button variant="ghost" size="sm">View All →</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featuredRequests.length === 0 ? (
            <div className="col-span-3 py-12 text-center">
              <p className="text-secondary-600">No active requests available at the moment.</p>
            </div>
          ) : (
            featuredRequests.map((request) => (
            <Card key={request.id} padding="lg" hoverable>
              <h3 className="mb-2 text-lg font-semibold line-clamp-2 min-h-[3em]">{request.title}</h3>
              <p className="mb-4 text-sm text-secondary-600 line-clamp-2">{request.description}</p>
              <ProgressBar
                value={request.currentAmount}
                max={request.targetAmount}
                className="mb-2"
              />
              <div className="flex justify-between mb-4 text-sm">
                <span className="font-semibold">{formatCurrency(request.currentAmount)}</span>
                <span className="text-secondary-600">of {formatCurrency(request.targetAmount)}</span>
              </div>
              <Link to={`/donate/${request.id}`}>
                <PrimaryButton className="w-full">
                  Donate Now
                </PrimaryButton>
              </Link>
            </Card>
          ))
          )}
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
