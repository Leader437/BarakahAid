import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiSearch, HiFilter, HiHeart, HiClock, HiCheckCircle } from 'react-icons/hi';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import PrimaryButton from '../components/ui/PrimaryButton';
import { formatCurrency } from '../utils/helpers';
import { fetchRequests, selectAllRequests, selectRequestsLoading } from '../store/requestsSlice';

const BrowseRequests = () => {
  const dispatch = useDispatch();
  const requests = useSelector(selectAllRequests);
  const loading = useSelector(selectRequestsLoading);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  const categories = ['All', ...new Set((requests || []).map(r => r.category).filter(Boolean))];
  const urgencyLevels = ['All', 'High', 'Medium', 'Low'];

  const filteredRequests = (requests || []).filter(request => {
    const matchesSearch = request.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || request.category === selectedCategory;
    // Handle missing urgency field gracefully
    const requestUrgency = request.urgency || 'medium';
    const matchesUrgency = selectedUrgency === 'all' || requestUrgency.toLowerCase() === selectedUrgency.toLowerCase();
    return matchesSearch && matchesCategory && matchesUrgency;
  });

  const getUrgencyBadge = (urgency) => {
    const styles = {
      high: 'bg-error-100 text-error-700',
      critical: 'bg-error-100 text-error-700',
      medium: 'bg-warning-100 text-warning-700',
      normal: 'bg-warning-100 text-warning-700',
      low: 'bg-success-100 text-success-700'
    };
    return styles[urgency?.toLowerCase()] || styles.medium;
  };

  const getRequestImage = (request, index) => {
    if (request.media && request.media.length > 0) {
      return request.media[0];
    }
    const internalDefaultImages = [
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
      'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400',
      'https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=400',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400',
    ];
    return internalDefaultImages[index % internalDefaultImages.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 bg-secondary-50 flex items-center justify-center">
        <p className="text-secondary-600">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-secondary-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900" data-text-split data-letters-slide-up>Browse Donation Requests</h1>
          <p className="mt-1 text-secondary-600">
            Find causes that matter to you and make a difference
          </p>
        </div>

        {/* Filters */}
        <Card padding="lg" className="mb-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <HiSearch className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-secondary-700">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category === 'All' ? 'all' : category)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${(category === 'All' && selectedCategory === 'all') || category === selectedCategory
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-secondary-700">Urgency</label>
              <div className="flex flex-wrap gap-2">
                {urgencyLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedUrgency(level.toLowerCase())}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${level.toLowerCase() === selectedUrgency
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                      }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-secondary-600">
            Showing <span className="font-semibold text-secondary-900">{filteredRequests.length}</span> requests
          </p>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map((request, index) => (
            <Card key={request.id} padding="none" hoverable>
              {/* Image */}
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={getRequestImage(request, index)}
                  alt={request.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute flex items-center gap-1 px-2 py-1 text-xs font-medium text-white rounded-full top-3 right-3 bg-success-600">
                  <HiCheckCircle className="w-4 h-4" />
                  Verified
                </div>
                <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full ${getUrgencyBadge(request.urgency)}`}>
                  {(request.urgency || 'Medium').charAt(0).toUpperCase() + (request.urgency || 'medium').slice(1)} Priority
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs font-medium text-primary-600">{request.category}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-secondary-900 line-clamp-2">
                  {request.title}
                </h3>
                <p className="mb-4 text-sm text-secondary-600 line-clamp-3">
                  {request.description}
                </p>

                {/* Progress */}
                <div className="mb-4">
                  <ProgressBar
                    value={request.currentAmount || 0}
                    max={request.targetAmount || 1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-secondary-900">
                      {formatCurrency(request.currentAmount || 0)}
                    </span>
                    <span className="text-secondary-600">
                      of {formatCurrency(request.targetAmount || 0)}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pb-4 mb-4 text-xs text-secondary-600 border-b border-secondary-200">
                  <div className="flex items-center gap-1">
                    <HiClock className="w-4 h-4" />
                    <span>{request.daysLeft || 30} days left</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiHeart className="w-4 h-4" />
                    <span>{request.beneficiaries || 0} beneficiaries</span>
                  </div>
                </div>

                {/* Action Button */}
                <Link to={`/donate/${request.id}`}>
                  <PrimaryButton className="w-full">
                    Donate Now
                  </PrimaryButton>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-secondary-600">No requests found matching your criteria.</p>
            <p className="mt-2 text-sm text-secondary-500">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseRequests;
