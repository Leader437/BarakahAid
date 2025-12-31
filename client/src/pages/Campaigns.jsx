import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiSearch, HiClock, HiUserGroup, HiTrendingUp } from 'react-icons/hi';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import PrimaryButton from '../components/ui/PrimaryButton';
import { formatCurrency } from '../utils/helpers';
import { fetchCampaigns, selectCampaigns, selectNgoLoading } from '../store/ngoSlice';

const Campaigns = () => {
  const dispatch = useDispatch();
  const campaigns = useSelector(selectCampaigns);
  const loading = useSelector(selectNgoLoading);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    dispatch(fetchCampaigns({ status: 'ACTIVE' }));
  }, [dispatch]);

  const getDaysLeft = (endDate) => {
    if (!endDate) return 0;
    const diff = new Date(endDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  // Map campaign types/categories if possible, otherwise rely on isEmergency or default
  const getCampaignType = (c) => {
    if (c.isEmergency) return 'Emergency';
    return c.category?.name || 'General';
  };

  const formattedCampaigns = campaigns.map(c => ({
    ...c,
    // Use backend field names with fallbacks
    targetAmount: Number(c.goalAmount) || Number(c.targetAmount) || 0,
    currentAmount: Number(c.raisedAmount) || Number(c.currentAmount) || 0,
    daysLeft: getDaysLeft(c.endDate),
    donors: c.transactions?.length || c.donorCount || 0,
    type: getCampaignType(c),
    image: c.image || c.imageUrl || '/images/placeholder-campaign.jpg',
    organizationName: c.createdBy?.name || 'BarakahAid Partner'
  }));

  const campaignTypes = ['All', 'Emergency', ...new Set(formattedCampaigns.map(c => c.type).filter(t => t !== 'Emergency'))];

  const filteredCampaigns = formattedCampaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' ||
      (selectedType === 'Emergency' ? campaign.isEmergency : campaign.type === selectedType);
    return matchesSearch && matchesType;
  });

  const featuredCampaigns = formattedCampaigns.filter(c => c.isEmergency || c.featured);
  const regularCampaigns = filteredCampaigns.filter(c => !c.isEmergency);

  if (loading && campaigns.length === 0) {
    return <div className="min-h-screen flex items-center justify-center p-8">Loading campaigns...</div>;
  }

  return (
    <div className="min-h-screen py-8 bg-secondary-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900" data-text-split data-letters-slide-up>Active Campaigns</h1>
          <p className="mt-1 text-secondary-600">
            Support ongoing initiatives making a real difference worldwide
          </p>
        </div>

        {/* Search and Filter */}
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

            {/* Type Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-secondary-700">Campaign Type</label>
              <div className="flex flex-wrap gap-2">
                {campaignTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type === 'All' ? 'all' : type)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${(type === 'All' && selectedType === 'all') || type === selectedType
                      ? 'bg-primary-600 text-white'
                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Featured Campaigns */}
        {featuredCampaigns.length > 0 && selectedType === 'all' && !searchQuery && (
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-secondary-900">Featured & Emergency</h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {featuredCampaigns.slice(0, 3).map((campaign) => (
                <Card key={campaign.id} padding="none" hoverable className="overflow-hidden">
                  <div className="relative h-56">
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute flex items-center gap-1 px-3 py-1 text-sm font-medium text-white rounded-full top-3 right-3 bg-primary-600">
                      <HiTrendingUp className="w-4 h-4" />
                      Featured
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="inline-block px-2 py-1 mb-2 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                      {campaign.type}
                    </span>
                    <h3 className="mb-3 text-xl font-bold text-secondary-900 line-clamp-2">
                      {campaign.title}
                    </h3>
                    <p className="mb-4 text-sm text-secondary-600 line-clamp-3">
                      {campaign.description}
                    </p>
                    <ProgressBar
                      value={campaign.currentAmount}
                      max={campaign.targetAmount}
                      className="mb-3"
                    />
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <span className="font-semibold text-secondary-900">
                        {formatCurrency(campaign.currentAmount)}
                      </span>
                      <span className="text-secondary-600">
                        of {formatCurrency(campaign.targetAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-4 mb-4 text-xs border-b text-secondary-600 border-secondary-200">
                      <div className="flex items-center gap-1">
                        <HiUserGroup className="w-4 h-4" />
                        <span>{campaign.donors} donors</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <HiClock className="w-4 h-4" />
                        <span>{campaign.daysLeft} days left</span>
                      </div>
                    </div>
                    <Link to={`/donate/${campaign.id}`}>
                      <PrimaryButton className="w-full">
                        Support Campaign
                      </PrimaryButton>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Campaigns */}
        <div>
          <h2 className="mb-4 text-2xl font-bold text-secondary-900">
            {selectedType !== 'all' || searchQuery ? 'Search Results' : 'All Campaigns'}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {(selectedType === 'all' && !searchQuery ? regularCampaigns : filteredCampaigns).map((campaign) => (
              <Card key={campaign.id} padding="none" hoverable>
                <div className="relative h-48">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="object-cover w-full h-full rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <span className="inline-block px-2 py-1 mb-2 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                    {campaign.type}
                  </span>
                  <h3 className="mb-2 text-lg font-semibold text-secondary-900 line-clamp-2 min-h-[3em]">
                    {campaign.title}
                  </h3>
                  <p className="mb-3 text-sm text-secondary-600 line-clamp-2">
                    {campaign.description}
                  </p>
                  <ProgressBar
                    value={campaign.currentAmount}
                    max={campaign.targetAmount}
                    className="mb-2"
                  />
                  <div className="flex justify-between mb-3 text-xs">
                    <span className="font-semibold text-secondary-900">
                      {formatCurrency(campaign.currentAmount)}
                    </span>
                    <span className="text-secondary-600">
                      of {formatCurrency(campaign.targetAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-3 mb-3 text-xs border-b text-secondary-600 border-secondary-200">
                    <span>{campaign.donors} donors</span>
                    <span>{campaign.daysLeft}d left</span>
                  </div>
                  <Link to={`/donate/${campaign.id}`}>
                    <PrimaryButton className="w-full">
                      Donate
                    </PrimaryButton>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredCampaigns.length === 0 && !loading && (
          <div className="py-12 text-center">
            <p className="text-lg text-secondary-600">No campaigns found matching your criteria.</p>
            <p className="mt-2 text-sm text-secondary-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;

