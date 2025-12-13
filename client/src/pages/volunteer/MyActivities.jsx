import React, { useState } from 'react';
import { 
  HiSearch, 
  HiCheckCircle, 
  HiClock, 
  HiCalendar,
  HiDownload,
  HiEye,
  HiXCircle
} from 'react-icons/hi';
import Card from '../../components/ui/Card';
import SecondaryButton from '../../components/ui/SecondaryButton';

const MyActivities = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock activities data
  const activities = [
    {
      id: 'VA-2024-015',
      title: 'Emergency Relief Package Assembly',
      category: 'Emergency',
      date: '2025-12-10',
      hours: 6,
      location: 'Warehouse District',
      status: 'completed',
      badge: 'Team Leader',
      rating: 5,
      feedback: 'Outstanding contribution'
    },
    {
      id: 'VA-2024-014',
      title: 'Community Meal Preparation',
      category: 'Food Relief',
      date: '2025-12-08',
      hours: 4,
      location: 'Community Kitchen',
      status: 'completed',
      badge: null,
      rating: 5,
      feedback: 'Great teamwork'
    },
    {
      id: 'VA-2024-013',
      title: 'Fundraising Event Support',
      category: 'Event',
      date: '2025-12-05',
      hours: 5,
      location: 'City Hall',
      status: 'completed',
      badge: 'Outstanding',
      rating: 5,
      feedback: 'Excellent organization skills'
    },
    {
      id: 'VA-2024-012',
      title: 'Winter Clothing Drive',
      category: 'Clothing',
      date: '2025-12-03',
      hours: 3,
      location: 'Community Center',
      status: 'completed',
      badge: null,
      rating: 4,
      feedback: null
    },
    {
      id: 'VA-2024-011',
      title: 'Educational Workshop',
      category: 'Education',
      date: '2025-12-01',
      hours: 4,
      location: 'Learning Center',
      status: 'completed',
      badge: null,
      rating: 5,
      feedback: 'Children loved the session'
    },
    {
      id: 'VA-2024-010',
      title: 'Medical Camp Setup',
      category: 'Healthcare',
      date: '2025-11-28',
      hours: 6,
      location: 'Central Hospital',
      status: 'completed',
      badge: null,
      rating: 5,
      feedback: null
    },
    {
      id: 'VA-2025-001',
      title: 'Food Distribution Drive',
      category: 'Food Relief',
      date: '2025-12-15',
      hours: 5,
      location: 'Community Center',
      status: 'upcoming',
      badge: null,
      rating: null,
      feedback: null
    },
    {
      id: 'VA-2025-002',
      title: 'Winter Clothing Collection',
      category: 'Clothing',
      date: '2025-12-18',
      hours: 4,
      location: 'City Plaza',
      status: 'upcoming',
      badge: null,
      rating: null,
      feedback: null
    }
  ];

  const statuses = ['All', 'Upcoming', 'Completed', 'Cancelled'];

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || activity.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-success-100 text-success-700',
      upcoming: 'bg-primary-100 text-primary-700',
      cancelled: 'bg-error-100 text-error-700'
    };
    return styles[status] || styles.upcoming;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <HiCheckCircle className="w-4 h-4" />;
      case 'upcoming':
        return <HiClock className="w-4 h-4" />;
      case 'cancelled':
        return <HiXCircle className="w-4 h-4" />;
      default:
        return <HiClock className="w-4 h-4" />;
    }
  };

  const totalHours = activities
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + a.hours, 0);

  const completedCount = activities.filter(a => a.status === 'completed').length;
  const upcomingCount = activities.filter(a => a.status === 'upcoming').length;

  return (
    <div className="min-h-screen py-8 bg-secondary-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">My Volunteer Activities</h1>
          <p className="mt-1 text-secondary-600">
            Track your volunteer history and upcoming commitments
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
          <Card padding="lg">
            <div className="text-center">
              <p className="text-sm text-secondary-600">Total Hours</p>
              <p className="mt-1 text-3xl font-bold text-primary-600">{totalHours}</p>
            </div>
          </Card>
          <Card padding="lg">
            <div className="text-center">
              <p className="text-sm text-secondary-600">Total Activities</p>
              <p className="mt-1 text-3xl font-bold text-secondary-900">{activities.length}</p>
            </div>
          </Card>
          <Card padding="lg">
            <div className="text-center">
              <p className="text-sm text-secondary-600">Completed</p>
              <p className="mt-1 text-3xl font-bold text-success-600">{completedCount}</p>
            </div>
          </Card>
          <Card padding="lg">
            <div className="text-center">
              <p className="text-sm text-secondary-600">Upcoming</p>
              <p className="mt-1 text-3xl font-bold text-warning-600">{upcomingCount}</p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card padding="lg" className="mb-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <HiSearch className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-secondary-700">Filter by Status</label>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status.toLowerCase())}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      status.toLowerCase() === selectedStatus
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Export Button */}
        <div className="flex justify-end mb-4">
          <SecondaryButton>
            <HiDownload className="w-4 h-4" />
            Export Activity Report
          </SecondaryButton>
        </div>

        {/* Activities Table */}
        <Card padding="lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-secondary-700">
                    Activity ID
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-secondary-700">
                    Title
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-secondary-700">
                    Category
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-secondary-700">
                    Date
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-secondary-700">
                    Hours
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-secondary-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left uppercase text-secondary-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200">
                {filteredActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-secondary-50">
                    <td className="px-4 py-4 text-sm font-medium text-secondary-900">
                      {activity.id}
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium text-secondary-900">{activity.title}</div>
                        <div className="text-sm text-secondary-500">{activity.location}</div>
                        {activity.badge && (
                          <span className="inline-block px-2 py-1 mt-1 text-xs font-medium rounded-full bg-warning-100 text-warning-700">
                            🏆 {activity.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-secondary-600">
                      {activity.category}
                    </td>
                    <td className="px-4 py-4 text-sm text-secondary-600">
                      {new Date(activity.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-secondary-900">
                      {activity.hours}h
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(activity.status)}`}>
                        {getStatusIcon(activity.status)}
                        {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 transition-colors text-secondary-600 hover:text-primary-600">
                          <HiEye className="w-5 h-5" />
                        </button>
                        {activity.status === 'completed' && (
                          <button className="p-1 transition-colors text-secondary-600 hover:text-primary-600">
                            <HiDownload className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredActivities.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-secondary-600">No activities found.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MyActivities;
