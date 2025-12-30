import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/api';
import {
  HiHeart,
  HiUserGroup,
  HiAcademicCap,
  HiTrendingUp,
  HiShieldCheck,
  HiClock,
  HiLocationMarker,
  HiUsers
} from 'react-icons/hi';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import Footer from '../components/layout/Footer';
import useTextAnimation from '../hooks/useTextAnimation';
import { fetchEvents, selectEvents, selectVolunteerLoading } from '../store/volunteerSlice';

const Volunteer = () => {
  useTextAnimation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const events = useSelector(selectEvents);
  const loading = useSelector(selectVolunteerLoading);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const volunteerBenefits = [
    {
      icon: <HiHeart className="w-8 h-8" />,
      title: 'Make a Real Difference',
      description: 'Your time and skills directly impact lives and communities in need.',
      color: 'primary'
    },
    {
      icon: <HiUserGroup className="w-8 h-8" />,
      title: 'Build Connections',
      description: 'Meet like-minded people and expand your network while giving back.',
      color: 'success'
    },
    {
      icon: <HiAcademicCap className="w-8 h-8" />,
      title: 'Gain Experience',
      description: 'Develop new skills and enhance your resume with volunteer experience.',
      color: 'accent'
    },
    {
      icon: <HiTrendingUp className="w-8 h-8" />,
      title: 'Personal Growth',
      description: 'Challenge yourself and discover new strengths through meaningful work.',
      color: 'warning'
    }
  ];

  const handleApply = (eventId) => {
    if (!isAuthenticated) {
      navigate(`/register?role=volunteer&redirect=/volunteer/events/${eventId}/register`);
      return;
    }

    if (user?.role?.toLowerCase() !== 'volunteer') {
      alert('You must be registered as a volunteer to apply for events.');
      return;
    }

    navigate(`/volunteer/events/${eventId}/register`);
  };

  const volunteerOpportunities = events.map(e => ({
    id: e.id,
    title: e.title,
    // Use correct backend field names with fallbacks
    organization: e.ngo?.name || e.createdBy?.name || 'BarakahAid',
    location: e.location?.address || (typeof e.location === 'string' ? e.location : 'TBD'),
    type: e.location?.address?.toLowerCase().includes('remote') ? 'Remote' : 'On-site',
    duration: e.duration || 'Flexible',
    // Use volunteers array length instead of fabricated field
    volunteers: e.volunteers?.length || e.volunteersRegistered || 0,
    needed: e.maxVolunteers || 10,
    date: e.eventDate ? new Date(e.eventDate).toLocaleDateString() : 'TBD',
    description: e.description,
    // Use correct backend field name
    skills: e.requiredSkills || [],
    isRegistered: e.volunteers?.some(v => v.user?.id === user?.id),
    urgent: e.isUrgent || false
  }));

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary-100 text-primary-700',
      success: 'bg-primary-100 text-primary-700',
      accent: 'bg-accent-100 text-accent-700',
      warning: 'bg-warning-100 text-warning-700'
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary-700 to-primary-900 sm:py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl" data-text-split data-letters-slide-up>
              Become a Volunteer
            </h1>
            <p className="max-w-3xl mx-auto mt-6 text-lg text-primary-100 sm:text-xl">
              Make a lasting impact in your community. Join thousands of volunteers who are changing lives through their time, skills, and compassion.
            </p>
            <div className="flex flex-col justify-center gap-4 mt-8 sm:flex-row">
              <Link to="/register?role=volunteer">
                <SecondaryButton buttonType='secondary'>
                  Register as Volunteer
                </SecondaryButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Volunteer Section */}
      <section className="py-16 bg-white sm:py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl text-secondary-900" data-text-split data-letters-slide-up>
              Why Volunteer With Us?
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-secondary-600">
              Volunteering is more than giving time—it's about creating meaningful change and personal growth.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {volunteerBenefits.map((benefit, index) => (
              <Card key={index} padding="lg" className="transition-transform hover:scale-105">
                <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 rounded-lg ${getColorClasses(benefit.color)}`}>
                  {benefit.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-secondary-900">{benefit.title}</h3>
                <p className="text-secondary-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities Section */}
      <section className="py-16 bg-secondary-50 sm:py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl text-secondary-900" data-text-split data-letters-slide-up>
              Current Volunteer Opportunities
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-secondary-600">
              Explore diverse opportunities to make a difference. Find the perfect match for your skills and schedule.
            </p>
          </div>

          {loading ? (
            <div className="text-center">Loading opportunities...</div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {volunteerOpportunities.length > 0 ? volunteerOpportunities.map((opportunity) => (
                <Card key={opportunity.id} padding="lg" className="relative">
                  {opportunity.urgent && (
                    <div className="absolute px-3 py-1 text-xs font-semibold text-white rounded-full top-4 right-4 bg-danger-600">
                      Urgent
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="mb-2 text-xl font-bold text-secondary-900">{opportunity.title}</h3>
                    <p className="flex items-center gap-1 text-sm text-secondary-600">
                      <HiShieldCheck className="w-4 h-4 text-success-600" />
                      {opportunity.organization}
                    </p>
                  </div>

                  <p className="mb-4 text-secondary-700">{opportunity.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-secondary-600">
                      <HiLocationMarker className="w-4 h-4" />
                      <span>{opportunity.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary-600">
                      <HiClock className="w-4 h-4" />
                      <span>{opportunity.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary-600">
                      <HiUsers className="w-4 h-4" />
                      <span>{opportunity.volunteers}/{opportunity.needed} volunteers</span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary-600">
                      <span className="font-medium">{opportunity.type}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="mb-2 text-sm font-semibold text-secondary-900">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
                    <span className="text-sm font-medium text-secondary-700">
                      Date: {opportunity.date}
                    </span>
                    <PrimaryButton 
                      size="sm" 
                      onClick={() => handleApply(opportunity.id)}
                      disabled={opportunity.isRegistered || (opportunity.needed - opportunity.volunteers <= 0)}
                    >
                      {opportunity.isRegistered 
                        ? 'Registered' 
                        : (opportunity.needed - opportunity.volunteers <= 0) 
                          ? 'Event Full' 
                          : 'Apply Now'}
                    </PrimaryButton>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full h-2 overflow-hidden rounded-full bg-secondary-200">
                      <div
                        className="h-full transition-all bg-primary-600"
                        style={{ width: `${(opportunity.volunteers / opportunity.needed) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-secondary-600">
                      {Math.max(0, opportunity.needed - opportunity.volunteers)} spots remaining
                    </p>
                  </div>
                </Card>
              )) : (
                <div className="col-span-2 text-center py-8">No volunteer opportunities found at this time.</div>
              )}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/register?role=volunteer">
              <PrimaryButton size="lg">
                View All Opportunities
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </section>



      {/* How It Works Section */}
      <section className="py-16 bg-white sm:py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl text-secondary-900" data-text-split data-letters-slide-up>
              How Volunteering Works
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-secondary-600">
              Getting started is simple. Follow these steps to begin your volunteering journey.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {[
              { step: '1', title: 'Register', description: 'Create your volunteer account and complete your profile with skills and interests.' },
              { step: '2', title: 'Browse', description: 'Explore available opportunities that match your skills, location, and schedule.' },
              { step: '3', title: 'Apply', description: 'Apply to opportunities that interest you and wait for NGO confirmation.' },
              { step: '4', title: 'Make Impact', description: 'Attend events, complete tasks, and track the difference you\'re making.' }
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-2xl font-bold text-white rounded-full bg-primary-600">
                  {item.step}
                </div>
                <h3 className="mb-2 text-xl font-bold text-secondary-900">{item.title}</h3>
                <p className="text-secondary-600">{item.description}</p>
                {index < 3 && (
                  <div className="absolute hidden transform -translate-y-1/2 md:block top-8 -right-4">
                    <svg className="w-8 h-8 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl" data-text-split data-letters-slide-up>
              Ready to Make a Difference?
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-secondary-600">
              Join our community of dedicated volunteers today. Your time and skills can change lives.
            </p>
            <div className="flex flex-col justify-center gap-4 mt-8 sm:flex-row">
              <Link to="/register">
                <PrimaryButton buttonType='secondary' size="lg">
                  Register Now
                </PrimaryButton>
              </Link>
              <Link to="/contact">
                <SecondaryButton buttonType='secondary' size="lg">
                  Have Questions?
                </SecondaryButton>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Volunteer;