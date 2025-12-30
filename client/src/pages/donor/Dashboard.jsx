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
import { fetchDonations } from '../../store/donationsSlice';
import { fetchRequests } from '../../store/requestsSlice';

const DonorDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { requests = [] } = useSelector((state) => state.requests || {});
  const donations = useSelector((state) => state.donations.donations);
  const stats = useSelector((state) => state.donations.stats);

  useEffect(() => {
    dispatch(fetchRequests({ status: 'active' }));
    if (user?.id) {
      dispatch(fetchDonations());
    }
  }, [dispatch, user]);

  const featuredRequests = (requests || []).slice(0, 3);
  const recentDonations = (donations || []).slice(0, 3);

  // Impact metrics (Placeholder calculation based on stats)
  const impactMetrics = [
    { label: 'Families Fed', value: Math.floor((stats?.totalDonated || 0) / 50), icon: HiUserGroup, color: 'primary' }, // Assume $50 feeds a family
    { label: 'Children Educated', value: Math.floor((stats?.totalDonated || 0) / 100), icon: HiHeart, color: 'success' }, // Assume $100 educates a child
    { label: 'Wells Built', value: Math.floor((stats?.totalDonated || 0) / 1000), icon: HiTrendingUp, color: 'accent' } // Assume $1000 builds a well
  ];

  return (
    <div className="min-h-screen py-8 bg-secondary-50">
      <div className="px-4 mx-auto max-w-[100vw] lg:max-w-7xl sm:px-6 lg:px-8">
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
                    {formatCurrency(stats?.totalDonated || 0)}
                  </p>
                  <p className="flex items-center gap-1 mt-1 text-xs text-success-600">
                    <HiTrendingUp className="w-3 h-3" />
                    <span>Lifetime Impact</span>
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
                    {stats?.totalDonations || 0}
                  </p>
                  <p className="mt-1 text-xs text-secondary-600">Across {stats?.totalDonations || 0} campaigns</p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-success-100">
                  <HiCheckCircle className="w-6 h-6 text-success-600" />
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-secondary-600">Pending</p>
                  <p className="text-2xl font-bold text-accent-600">
                    {stats?.pendingDonations || 0}
                  </p>
                  <p className="mt-1 text-xs text-secondary-600">Processing</p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent-100">
                  <HiUserGroup className="w-6 h-6 text-accent-600" />
                </div>
              </div>
            </Card>
          </div>



          {/* Quick Actions */}
          <Card padding="lg">
            <h2 className="mb-4 text-xl font-semibold text-secondary-900">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
              <Link to="/donor/browse-requests">
                <Button variant="outline" fullWidth className="whitespace-nowrap">
                  Browse Requests
                </Button>
              </Link>
              <Link to="/donor/donation-history">
                <Button variant="outline" fullWidth className="whitespace-nowrap">
                  My Donations
                </Button>
              </Link>
              <Link to="/campaigns">
                <Button variant="outline" fullWidth className="whitespace-nowrap">
                  View Campaigns
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
              {recentDonations.length === 0 ? (
                <p className="text-secondary-600">No donations yet.</p>
              ) : (
                recentDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-4 transition-colors rounded-lg bg-secondary-50 hover:bg-secondary-100">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success-100">
                        <HiCheckCircle className="w-5 h-5 text-success-600" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">{donation.campaignName}</p>
                        <p className="text-sm text-secondary-600">
                          {new Date(donation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-primary-600">{formatCurrency(donation.amount)}</p>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${donation.status === 'completed' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'
                        }`}>
                        {donation.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
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
