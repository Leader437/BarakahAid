import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HiCalendar,
  HiClock,
  HiLocationMarker,
  HiUserGroup,
  HiPhone,
  HiUser,
  HiArrowLeft,
  HiCheckCircle
} from 'react-icons/hi';
import Card from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import api from '../../utils/api';

const EventRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Registration form state
  const [formData, setFormData] = useState({
    emergencyContactName: '',
    emergencyContactPhone: '',
    availabilityConfirmed: false,
    notes: ''
  });

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate(`/login?redirect=/volunteer/events/${id}/register`);
      return;
    }

    // Redirect if not a volunteer
    if (user?.role?.toLowerCase() !== 'volunteer') {
      navigate('/register?role=volunteer');
      return;
    }

    fetchEventDetails();
  }, [id, isAuthenticated, user, navigate]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/volunteers/events/${id}`);
      setEvent(response.data?.data || response.data);
    } catch (err) {
      console.error('Failed to fetch event details:', err);
      setError('Failed to load event details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.availabilityConfirmed) {
      setError('Please confirm your availability for this event.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await api.post(`/volunteers/events/${id}/signup`, {
        emergencyContact: formData.emergencyContactName ? {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone
        } : undefined,
        notes: formData.notes || undefined
      });

      setSuccess(true);
      
      // Redirect to my activities after a short delay
      setTimeout(() => {
        navigate('/volunteer/my-activities');
      }, 2000);

    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 rounded-full border-primary-200 border-t-primary-600 animate-spin"></div>
          <p className="text-secondary-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary-50">
        <Card padding="lg" className="max-w-md mx-auto text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-success-100">
            <HiCheckCircle className="w-10 h-10 text-success-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-secondary-900">Registration Successful!</h2>
          <p className="mb-4 text-secondary-600">
            You have been registered for <span className="font-semibold">{event?.title}</span>.
          </p>
          <p className="text-sm text-secondary-500">Redirecting to your activities...</p>
        </Card>
      </div>
    );
  }

  const totalSpots = event?.maxVolunteers || 10;
  const spotsLeft = event ? totalSpots - (event.volunteers?.length || 0) : 0;
  const isAlreadyRegistered = event?.volunteers?.some(v => v.user?.id === user?.id);
  const isPassed = event?.eventDate && new Date(event.eventDate) < new Date();
  const isFull = !isAlreadyRegistered && !isPassed && spotsLeft <= 0;

  return (
    <div className="min-h-screen py-8 bg-secondary-50">
      <div className="px-4 mx-auto max-w-3xl sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/volunteer/browse-events" 
          className="inline-flex items-center gap-2 mb-6 text-secondary-600 hover:text-primary-600 transition-colors"
        >
          <HiArrowLeft className="w-5 h-5" />
          <span>Back to Events</span>
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Register for Event</h1>
          <p className="mt-1 text-secondary-600">
            Complete your registration for this volunteer opportunity
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 border rounded-lg bg-danger-50 border-danger-200">
            <p className="text-danger-700">{error}</p>
          </div>
        )}

        {isPassed && (
          <div className="p-4 mb-6 border rounded-lg bg-warning-50 border-warning-200">
            <p className="text-warning-700">This event has already taken place and is no longer accepting registrations.</p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Event Summary Card */}
          <Card padding="lg" className="lg:col-span-1">
            <h2 className="mb-4 text-lg font-bold text-secondary-900">Event Details</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-xl font-semibold text-secondary-900">{event?.title}</h3>
                <p className="text-sm text-secondary-600 line-clamp-3">{event?.description}</p>
              </div>

              <div className="pt-4 space-y-3 border-t border-secondary-200">
                <div className="flex items-center gap-3 text-sm text-secondary-600">
                  <HiCalendar className="w-5 h-5 text-primary-600" />
                  <span>
                    {event?.eventDate
                      ? new Date(event.eventDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'TBD'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-secondary-600">
                  <HiClock className="w-5 h-5 text-primary-600" />
                  <span>
                    {event?.eventDate
                      ? new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'TBD'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-secondary-600">
                  <HiLocationMarker className="w-5 h-5 text-primary-600" />
                  <span>{event?.location?.address || 'TBD'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-secondary-600">
                  <HiUserGroup className="w-5 h-5 text-primary-600" />
                  <span>
                    {isAlreadyRegistered 
                      ? 'You are registered' 
                      : spotsLeft > 0 
                        ? `${spotsLeft} spots remaining` 
                        : 'No spots remaining'}
                  </span>
                </div>
              </div>

              {/* Required Skills */}
              {event?.requiredSkills?.length > 0 && (
                <div className="pt-4 border-t border-secondary-200">
                  <p className="mb-2 text-sm font-semibold text-secondary-900">Required Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {event.requiredSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Registration Form */}
          <Card padding="lg" className="lg:col-span-2">
            <h2 className="mb-6 text-lg font-bold text-secondary-900">Registration Form</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Volunteer Info (Pre-filled) */}
              <div className="p-4 rounded-lg bg-secondary-50">
                <p className="mb-2 text-sm font-semibold text-secondary-700">Registering as:</p>
                <p className="font-medium text-secondary-900">{user?.name}</p>
                <p className="text-sm text-secondary-600">{user?.email}</p>
              </div>

              {/* Emergency Contact (Optional) */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-secondary-900">Emergency Contact (Optional)</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-secondary-700">
                      <HiUser className="inline w-4 h-4 mr-1" />
                      Contact Name
                    </label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-secondary-700">
                      <HiPhone className="inline w-4 h-4 mr-1" />
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={handleInputChange}
                      placeholder="+1 234 567 8900"
                      className="w-full px-3 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block mb-1 text-sm font-medium text-secondary-700">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any special requirements, dietary restrictions, or notes for the organizers..."
                  className="w-full px-3 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Availability Confirmation */}
              <div className="p-4 border rounded-lg border-secondary-200 bg-secondary-50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="availabilityConfirmed"
                    checked={formData.availabilityConfirmed}
                    onChange={handleInputChange}
                    className="w-5 h-5 mt-0.5 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-secondary-700">
                    I confirm that I am available on the event date and will attend this volunteer opportunity. 
                    I understand that my spot may be given to another volunteer if I do not show up without prior notice.
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <PrimaryButton
                  type="submit"
                  disabled={submitting || isFull || isAlreadyRegistered || isPassed}
                  className="flex-1"
                >
                  {submitting 
                    ? 'Registering...' 
                    : isAlreadyRegistered 
                      ? 'Already Registered' 
                      : isPassed
                        ? 'Event Passed'
                        : isFull 
                          ? 'Event is Full' 
                          : 'Register'}
                </PrimaryButton>
                <SecondaryButton
                  type="button"
                  onClick={() => navigate('/volunteer/browse-events')}
                  className="flex-1"
                >
                  Cancel
                </SecondaryButton>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;
