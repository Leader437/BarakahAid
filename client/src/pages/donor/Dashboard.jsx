// Donor Dashboard
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import { formatCurrency } from '../../utils/helpers';
import { getDonationStats } from '../../store/donationsSlice';
import { fetchRequests } from '../../store/requestsSlice';

const DonorDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { requests } = useSelector((state) => state.requests);
  const [stats, setStats] = React.useState(null);

  useEffect(() => {
    dispatch(fetchRequests({ status: 'active' }));
    
    // Fetch donation stats
    dispatch(getDonationStats(user?.id)).then((result) => {
      setStats(result);
    });
  }, [dispatch, user]);

  const featuredRequests = requests.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-secondary-600 mt-1">
          Thank you for making a difference in people's lives.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Total Donated</p>
              <p className="text-2xl font-bold text-primary-600">
                {stats ? formatCurrency(stats.totalDonated) : '$0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Total Donations</p>
              <p className="text-2xl font-bold text-success-600">
                {stats?.totalDonations || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Lives Impacted</p>
              <p className="text-2xl font-bold text-accent-600">
                {(stats?.totalDonations || 0) * 3}+
              </p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card padding="lg">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

      {/* Featured Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-secondary-900">Featured Requests</h2>
          <Link to="/donor/browse-requests">
            <Button variant="ghost" size="sm">View All →</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredRequests.map((request) => (
            <Card key={request.id} padding="lg" hoverable>
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{request.title}</h3>
              <p className="text-sm text-secondary-600 mb-4 line-clamp-2">{request.description}</p>
              <ProgressBar
                value={request.currentAmount}
                max={request.targetAmount}
                className="mb-2"
              />
              <div className="flex justify-between text-sm mb-4">
                <span className="font-semibold">{formatCurrency(request.currentAmount)}</span>
                <span className="text-secondary-600">of {formatCurrency(request.targetAmount)}</span>
              </div>
              <Link to={`/donate/${request.id}`}>
                <Button variant="primary" size="sm" fullWidth>
                  Donate Now
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
