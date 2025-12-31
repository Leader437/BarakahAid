import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiSearch,
  HiPlus,
  HiEye,
  HiPencil,
  HiTrash,
  HiCalendar,
  HiLocationMarker,
  HiUserGroup,
  HiExclamation,
  HiPhotograph,
  HiX
} from 'react-icons/hi';
import Card from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../components/ui/Toast';
import {
  fetchMyEvents,
  deleteEvent,
  selectNgoEvents,
  selectNgoLoading
} from '../../store/ngoSlice';

const ManageEvents = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const events = useSelector(selectNgoEvents);
  const loading = useSelector(selectNgoLoading);

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    dispatch(fetchMyEvents());
  }, [dispatch]);

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    
    setDeleting(true);
    try {
      await dispatch(deleteEvent(eventToDelete.id)).unwrap();
      toast.success(`Event "${eventToDelete.title}" deleted successfully`);
      setDeleteModalOpen(false);
      setEventToDelete(null);
    } catch (error) {
      toast.error(error || 'Failed to delete event');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setEventToDelete(null);
  };

  const filteredEvents = events.filter(event => 
    (event.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (event.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const getEventStatus = (eventDate) => {
    const date = new Date(eventDate);
    const now = new Date();
    if (date < now) return { label: 'Completed', color: 'bg-secondary-100 text-secondary-700' };
    if (date.toDateString() === now.toDateString()) return { label: 'Today', color: 'bg-warning-100 text-warning-700' };
    return { label: 'Upcoming', color: 'bg-success-100 text-success-700' };
  };

  const stats = {
    total: events.length,
    upcoming: events.filter(e => new Date(e.eventDate) > new Date()).length,
    completed: events.filter(e => new Date(e.eventDate) < new Date()).length,
    totalVolunteers: events.reduce((acc, e) => acc + (e.volunteers?.length || 0), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 bg-secondary-50 flex items-center justify-center">
        <p className="text-secondary-600">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-secondary-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Manage Events</h1>
            <p className="mt-1 text-secondary-600">Create and manage volunteer events</p>
          </div>
          <Link to="/ngo/events/new">
            <PrimaryButton>
              <HiPlus className="w-5 h-5" />
              Create Event
            </PrimaryButton>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
          <Card padding="lg">
            <div className="text-center">
              <p className="text-sm text-secondary-600">Total Events</p>
              <p className="mt-1 text-2xl font-bold text-secondary-900">{stats.total}</p>
            </div>
          </Card>
          <Card padding="lg" className="border-l-4 border-success-500">
            <div className="text-center">
              <p className="text-sm text-success-600">Upcoming</p>
              <p className="mt-1 text-2xl font-bold text-success-700">{stats.upcoming}</p>
            </div>
          </Card>
          <Card padding="lg" className="border-l-4 border-secondary-400">
            <div className="text-center">
              <p className="text-sm text-secondary-600">Completed</p>
              <p className="mt-1 text-2xl font-bold text-secondary-700">{stats.completed}</p>
            </div>
          </Card>
          <Card padding="lg" className="border-l-4 border-primary-500">
            <div className="text-center">
              <p className="text-sm text-primary-600">Total Volunteers</p>
              <p className="mt-1 text-2xl font-bold text-primary-700">{stats.totalVolunteers}</p>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card padding="lg" className="mb-6">
          <div className="relative">
            <HiSearch className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </Card>

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => {
            const status = getEventStatus(event.eventDate);
            return (
              <Card key={event.id} padding="none" hoverable className="overflow-hidden">
                {/* Event Image */}
                <div className="relative h-40 bg-secondary-100">
                  {event.image ? (
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                      <HiPhotograph className="w-12 h-12 text-primary-300" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                <div className="p-4 border-b border-secondary-200">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs text-secondary-500">
                      {event.volunteers?.length || 0}/{event.maxVolunteers} volunteers
                    </span>
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-secondary-900 line-clamp-2">{event.title}</h3>
                  <p className="text-sm text-secondary-600 line-clamp-2">{event.description}</p>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-secondary-600">
                    <HiCalendar className="w-4 h-4" />
                    <span>{new Date(event.eventDate).toLocaleDateString('en-US', { 
                      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                    })}</span>
                  </div>
                  
                  {event.location?.address && (
                    <div className="flex items-center gap-2 text-sm text-secondary-600">
                      <HiLocationMarker className="w-4 h-4" />
                      <span className="truncate">{event.location.address}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-secondary-600">
                    <HiUserGroup className="w-4 h-4" />
                    <span>{event.requiredSkills?.join(', ') || 'No specific skills required'}</span>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-secondary-200">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="flex items-center justify-center flex-1 gap-1 px-2 py-2 text-xs font-medium transition-colors border rounded-lg border-secondary-300 text-secondary-700 hover:bg-secondary-50"
                    >
                      <HiEye className="w-4 h-4" />
                      View
                    </button>
                    <Link to={`/ngo/events/${event.id}/edit`} className="flex-1">
                      <button className="flex items-center justify-center w-full gap-1 px-2 py-2 text-xs font-medium transition-colors border rounded-lg border-secondary-300 text-secondary-700 hover:bg-secondary-50">
                        <HiPencil className="w-4 h-4" />
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(event)}
                      className="p-2 transition-colors rounded-lg text-error-600 hover:bg-error-50"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-secondary-600">No events found.</p>
            <p className="mt-2 text-sm text-secondary-500">Create your first volunteer event.</p>
            <Link to="/ngo/events/new" className="inline-block mt-4">
              <PrimaryButton>
                <HiPlus className="w-5 h-5" />
                Create Event
              </PrimaryButton>
            </Link>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-500/20"
          onClick={(e) => e.target === e.currentTarget && setSelectedEvent(null)}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between p-6 border-b border-secondary-200">
              <div>
                <h2 className="text-xl font-bold text-secondary-900">{selectedEvent.title}</h2>
                <p className="mt-1 text-sm text-secondary-600">
                  {new Date(selectedEvent.eventDate).toLocaleDateString('en-US', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="p-2 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Image */}
            {selectedEvent.image && (
              <div className="h-48 overflow-hidden">
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-secondary-700 mb-2">Description</h3>
                <p className="text-secondary-600">{selectedEvent.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-secondary-50 rounded-lg">
                  <p className="text-xs text-secondary-500">Location</p>
                  <p className="font-medium text-secondary-900">{selectedEvent.location?.address || 'Not specified'}</p>
                </div>
                <div className="p-3 bg-secondary-50 rounded-lg">
                  <p className="text-xs text-secondary-500">Max Volunteers</p>
                  <p className="font-medium text-secondary-900">{selectedEvent.maxVolunteers}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-secondary-700 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.requiredSkills?.length > 0 ? (
                    selectedEvent.requiredSkills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-secondary-500">No specific skills required</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-secondary-700 mb-3">
                  Registered Volunteers ({selectedEvent.volunteers?.length || 0})
                </h3>
                {selectedEvent.volunteers?.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedEvent.volunteers.map((volunteer) => (
                      <div key={volunteer.id} className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-600">
                            {volunteer.user?.name?.charAt(0)?.toUpperCase() || 'V'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900">{volunteer.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-secondary-500">{volunteer.user?.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-secondary-500">No volunteers registered yet</p>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-secondary-200">
              <SecondaryButton onClick={() => setSelectedEvent(null)} className="w-full">
                Close
              </SecondaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-500/20"
          onClick={(e) => e.target === e.currentTarget && handleCancelDelete()}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-error-100">
                <HiExclamation className="w-6 h-6 text-error-600" />
              </div>
              <h3 className="text-lg font-bold text-center text-secondary-900">Delete Event</h3>
              <p className="mt-2 text-center text-secondary-600">
                Are you sure you want to delete <strong>"{eventToDelete?.title}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 p-6 border-t border-secondary-200">
              <button
                onClick={handleCancelDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-sm font-medium border rounded-lg border-secondary-300 text-secondary-700 hover:bg-secondary-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg bg-error-600 hover:bg-error-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
