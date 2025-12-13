import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiSearch, 
  HiCalendar, 
  HiClock, 
  HiLocationMarker,
  HiUserGroup,
  HiCheckCircle
} from 'react-icons/hi';
import Card from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';

const BrowseEvents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Mock events data
  const events = [
    {
      id: 1,
      title: 'Food Distribution Drive',
      description: 'Help distribute food packages to families in need. We provide essential groceries and fresh produce to underprivileged communities.',
      category: 'Food Relief',
      type: 'one-time',
      date: '2025-12-15',
      time: '09:00 AM - 02:00 PM',
      duration: '5 hours',
      location: 'Community Center, Downtown',
      spotsLeft: 5,
      totalSpots: 20,
      organizer: 'BarakahAid Foundation',
      requirements: ['Physical fitness', 'Transportation'],
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400'
    },
    {
      id: 2,
      title: 'Winter Clothing Collection',
      description: 'Collect and sort winter clothing donations for distribution to homeless shelters and refugee families.',
      category: 'Clothing',
      type: 'one-time',
      date: '2025-12-18',
      time: '02:00 PM - 06:00 PM',
      duration: '4 hours',
      location: 'City Plaza',
      spotsLeft: 8,
      totalSpots: 15,
      organizer: 'Community Outreach',
      requirements: ['Organization skills'],
      image: 'https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=400'
    },
    {
      id: 3,
      title: 'Educational Workshop for Kids',
      description: 'Teach basic literacy and numeracy skills to underprivileged children. Help create a fun learning environment.',
      category: 'Education',
      type: 'recurring',
      date: '2025-12-20',
      time: '10:00 AM - 01:00 PM',
      duration: '3 hours',
      location: 'Learning Center',
      spotsLeft: 3,
      totalSpots: 10,
      organizer: 'Education Initiative',
      requirements: ['Teaching experience preferred', 'Patience with children'],
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400'
    },
    {
      id: 4,
      title: 'Medical Camp Support',
      description: 'Assist healthcare professionals in organizing and running a free medical camp for low-income families.',
      category: 'Healthcare',
      type: 'one-time',
      date: '2025-12-22',
      time: '08:00 AM - 04:00 PM',
      duration: '8 hours',
      location: 'Central Hospital',
      spotsLeft: 10,
      totalSpots: 25,
      organizer: 'Health Services',
      requirements: ['Medical background helpful but not required'],
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400'
    },
    {
      id: 5,
      title: 'Orphanage Visit & Activities',
      description: 'Spend time with orphaned children, organize games, and provide emotional support.',
      category: 'Orphan Care',
      type: 'recurring',
      date: '2025-12-25',
      time: '11:00 AM - 03:00 PM',
      duration: '4 hours',
      location: 'Hope Orphanage',
      spotsLeft: 6,
      totalSpots: 12,
      organizer: 'Child Welfare',
      requirements: ['Background check required', 'Good with children'],
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400'
    },
    {
      id: 6,
      title: 'Emergency Relief Packaging',
      description: 'Assemble emergency relief kits including food, water, hygiene items, and first aid supplies for disaster response.',
      category: 'Emergency',
      type: 'one-time',
      date: '2025-12-28',
      time: '01:00 PM - 05:00 PM',
      duration: '4 hours',
      location: 'Warehouse District',
      spotsLeft: 15,
      totalSpots: 30,
      organizer: 'Disaster Response Team',
      requirements: ['Ability to lift boxes'],
      image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400'
    }
  ];

  const categories = ['All', 'Food Relief', 'Clothing', 'Education', 'Healthcare', 'Orphan Care', 'Emergency'];
  const eventTypes = ['All', 'One-time', 'Recurring'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesType = selectedType === 'all' || event.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="min-h-screen py-8 bg-secondary-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Browse Volunteer Events</h1>
          <p className="mt-1 text-secondary-600">
            Find volunteer opportunities that match your interests and availability
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
                placeholder="Search events..."
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
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      (category === 'All' && selectedCategory === 'all') || category === selectedCategory
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-secondary-700">Event Type</label>
              <div className="flex flex-wrap gap-2">
                {eventTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type.toLowerCase())}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      type.toLowerCase() === selectedType
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

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-secondary-600">
            Showing <span className="font-semibold text-secondary-900">{filteredEvents.length}</span> events
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card key={event.id} padding="none" hoverable>
              {/* Image */}
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={event.image}
                  alt={event.title}
                  className="object-cover w-full h-full"
                />
                {event.spotsLeft <= 5 && (
                  <div className="absolute px-2 py-1 text-xs font-medium text-white rounded-full top-3 right-3 bg-warning-600">
                    Only {event.spotsLeft} spots left
                  </div>
                )}
                <span className="absolute px-2 py-1 text-xs font-medium text-white rounded-full top-3 left-3 bg-primary-600">
                  {event.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-2">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    event.type === 'recurring' 
                      ? 'bg-success-100 text-success-700' 
                      : 'bg-secondary-100 text-secondary-700'
                  }`}>
                    {event.type === 'recurring' ? 'Recurring' : 'One-time'}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-secondary-900 line-clamp-2">
                  {event.title}
                </h3>
                <p className="mb-4 text-sm text-secondary-600 line-clamp-2">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="mb-4 space-y-2 text-sm text-secondary-600">
                  <div className="flex items-center gap-2">
                    <HiCalendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiClock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiLocationMarker className="w-4 h-4" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiUserGroup className="w-4 h-4" />
                    <span>{event.totalSpots - event.spotsLeft}/{event.totalSpots} registered</span>
                  </div>
                </div>

                {/* Action Button */}
                <PrimaryButton className="w-full">
                  Register for Event
                </PrimaryButton>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-secondary-600">No events found matching your criteria.</p>
            <p className="mt-2 text-sm text-secondary-500">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseEvents;
