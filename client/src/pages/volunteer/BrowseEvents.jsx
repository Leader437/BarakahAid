import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import { fetchEvents, selectEvents, selectVolunteerLoading } from '../../store/volunteerSlice';

const BrowseEvents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const rawEvents = useSelector(selectEvents);
  const loading = useSelector(selectVolunteerLoading);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleRegister = (eventId) => {
    navigate(`/volunteer/events/${eventId}/register`);
  };

  // Helper to infer category from title (since backend doesn't save it yet)
  const inferCategory = (title) => {
    const t = title.toLowerCase();
    if (t.includes('food')) return 'Food Relief';
    if (t.includes('clothing') || t.includes('winter')) return 'Clothing';
    if (t.includes('education') || t.includes('mentor') || t.includes('school')) return 'Education';
    if (t.includes('medical') || t.includes('health')) return 'Healthcare';
    if (t.includes('orphan')) return 'Orphan Care';
    if (t.includes('emergency') || t.includes('relief')) return 'Emergency';
    return 'Other';
  };

  const getRandomImage = (category) => {
    const images = {
      'Food Relief': 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400',
      'Clothing': 'https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=400',
      'Education': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
      'Healthcare': 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400',
      'Orphan Care': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400',
      'Emergency': 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400',
      'Other': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400'
    };
    return images[category] || images['Other'];
  };

  // Map backend events to UI structure
  const events = rawEvents.map(e => {
    const category = inferCategory(e.title);
    const totalSpots = e.maxVolunteers || 10;
    return {
      id: e.id,
      title: e.title,
      description: e.description,
      category: category,
      type: 'one-time', // Default to one-time
      date: e.eventDate,
      time: new Date(e.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: '4 hours', // Placeholder
      location: e.location?.address || 'TBD',
      spotsLeft: totalSpots - (e.volunteers?.length || 0),
      totalSpots: totalSpots,
      isRegistered: e.volunteers?.some(v => v.user?.id === user?.id),
      organizer: 'BarakahAid',
      requirements: e.requiredSkills || [],
      image: getRandomImage(category),
      isPassed: new Date(e.eventDate) < new Date()
    };
  });

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

            {/* Type Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-secondary-700">Event Type</label>
              <div className="flex flex-wrap gap-2">
                {eventTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type.toLowerCase())}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${type.toLowerCase() === selectedType
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
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${event.type === 'recurring'
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
                <PrimaryButton 
                  className="w-full" 
                  onClick={() => handleRegister(event.id)}
                  disabled={event.isRegistered || (event.spotsLeft <= 0 && !event.isPassed)}
                >
                  {event.isRegistered 
                    ? 'Already Registered' 
                    : event.isPassed
                      ? 'View Details'
                      : event.spotsLeft <= 0 
                        ? 'Event Full' 
                        : 'Register for Event'}
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
