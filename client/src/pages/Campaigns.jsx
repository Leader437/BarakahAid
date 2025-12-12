import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiSearch, HiClock, HiUserGroup, HiTrendingUp, HiCheckCircle } from 'react-icons/hi';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import PrimaryButton from '../components/ui/PrimaryButton';
import { formatCurrency } from '../utils/helpers';

const Campaigns = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Mock campaigns data
  const campaigns = [
    {
      id: 1,
      title: 'Ramadan Food Drive 2024',
      description: 'Provide iftar meals and food packages to families in need during the holy month of Ramadan. Help us spread joy and blessings.',
      type: 'Seasonal',
      status: 'active',
      currentAmount: 185000,
      targetAmount: 250000,
      donors: 1250,
      daysLeft: 12,
      startDate: '2024-03-01',
      endDate: '2024-04-10',
      image: 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=400',
      featured: true
    },
    {
      id: 2,
      title: 'Build a Mosque in Rural Pakistan',
      description: 'Help construct a mosque to serve as a spiritual and community center for a village of 500 families in rural Pakistan.',
      type: 'Infrastructure',
      status: 'active',
      currentAmount: 320000,
      targetAmount: 500000,
      donors: 890,
      daysLeft: 45,
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      image: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=400',
      featured: true
    },
    {
      id: 3,
      title: 'Syria Emergency Response',
      description: 'Immediate relief for earthquake victims in Syria including shelter, food, medical aid, and trauma support for affected families.',
      type: 'Emergency',
      status: 'active',
      currentAmount: 450000,
      targetAmount: 600000,
      donors: 3200,
      daysLeft: 8,
      startDate: '2024-02-10',
      endDate: '2024-03-31',
      image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400',
      featured: true
    },
    {
      id: 4,
      title: 'Yemen Water Wells Project',
      description: 'Dig and maintain water wells in rural Yemen to provide clean drinking water and improve health outcomes for thousands.',
      type: 'Long-term',
      status: 'active',
      currentAmount: 95000,
      targetAmount: 200000,
      donors: 450,
      daysLeft: 60,
      startDate: '2023-12-01',
      endDate: '2024-08-31',
      image: 'https://images.unsplash.com/photo-1523215713805-7a8c0f6a6c5f?w=400',
      featured: false
    },
    {
      id: 5,
      title: 'School Supplies for Rohingya Children',
      description: 'Provide books, stationery, uniforms, and educational materials to Rohingya refugee children in Bangladesh camps.',
      type: 'Education',
      status: 'active',
      currentAmount: 42000,
      targetAmount: 75000,
      donors: 320,
      daysLeft: 30,
      startDate: '2024-02-01',
      endDate: '2024-05-31',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
      featured: false
    },
    {
      id: 6,
      title: 'Gaza Healthcare Support',
      description: 'Fund medical treatments, surgeries, medications, and rehabilitation for injured civilians in Gaza hospitals.',
      type: 'Healthcare',
      status: 'active',
      currentAmount: 280000,
      targetAmount: 400000,
      donors: 1850,
      daysLeft: 20,
      startDate: '2024-01-20',
      endDate: '2024-04-30',
      image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400',
      featured: false
    },
    {
      id: 7,
      title: 'Orphan Care Program - Somalia',
      description: 'Comprehensive care including food, shelter, education, healthcare, and emotional support for orphaned children in Somalia.',
      type: 'Long-term',
      status: 'active',
      currentAmount: 125000,
      targetAmount: 300000,
      donors: 680,
      daysLeft: 90,
      startDate: '2023-11-01',
      endDate: '2024-12-31',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400',
      featured: false
    },
    {
      id: 8,
      title: 'Winter Relief - Afghanistan',
      description: 'Distribute warm clothing, blankets, heating fuel, and winterized shelter materials to families facing harsh winter.',
      type: 'Seasonal',
      status: 'active',
      currentAmount: 68000,
      targetAmount: 120000,
      donors: 420,
      daysLeft: 18,
      startDate: '2024-02-15',
      endDate: '2024-03-31',
      image: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=400',
      featured: false
    }
  ];

  const campaignTypes = ['All', 'Emergency', 'Seasonal', 'Long-term', 'Infrastructure', 'Education', 'Healthcare'];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || campaign.type === selectedType;
    return matchesSearch && matchesType;
  });

  const featuredCampaigns = campaigns.filter(c => c.featured);
  const regularCampaigns = filteredCampaigns.filter(c => !c.featured);

  return (
    <div className="min-h-screen py-8 bg-secondary-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Active Campaigns</h1>
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
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      (type === 'All' && selectedType === 'all') || type === selectedType
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
            <h2 className="mb-4 text-2xl font-bold text-secondary-900">Featured Campaigns</h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {featuredCampaigns.map((campaign) => (
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
                    <div className="flex items-center justify-between pb-4 mb-4 text-xs text-secondary-600 border-b border-secondary-200">
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
                  <h3 className="mb-2 text-lg font-semibold text-secondary-900 line-clamp-2">
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
                  <div className="flex items-center justify-between pb-3 mb-3 text-xs text-secondary-600 border-b border-secondary-200">
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
        {filteredCampaigns.length === 0 && (
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
