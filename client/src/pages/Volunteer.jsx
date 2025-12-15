// Volunteer Page
import React from 'react';
import { Link } from 'react-router-dom';
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

const Volunteer = () => {
  useTextAnimation();

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

  const volunteerOpportunities = [
    {
      id: 1,
      title: 'Food Distribution Volunteer',
      organization: 'Hope Foundation',
      location: 'New York, NY',
      type: 'On-site',
      duration: '4 hours',
      volunteers: 15,
      needed: 20,
      date: 'Dec 20, 2025',
      description: 'Help distribute food packages to families in need during our weekly community outreach program.',
      skills: ['Physical Work', 'Communication', 'Compassion'],
      urgent: true
    },
    {
      id: 2,
      title: 'Education Support Tutor',
      organization: 'Bright Futures NGO',
      location: 'Los Angeles, CA',
      type: 'Remote',
      duration: '2 hours/week',
      volunteers: 8,
      needed: 12,
      date: 'Ongoing',
      description: 'Provide online tutoring to underprivileged children in math and science subjects.',
      skills: ['Teaching', 'Patience', 'Subject Knowledge'],
      urgent: false
    },
    {
      id: 3,
      title: 'Medical Camp Assistant',
      organization: 'Health for All',
      location: 'Chicago, IL',
      type: 'On-site',
      duration: '8 hours',
      volunteers: 22,
      needed: 25,
      date: 'Dec 22, 2025',
      description: 'Assist medical professionals during free health check-up camps in underserved communities.',
      skills: ['Organization', 'Healthcare Interest', 'Communication'],
      urgent: true
    },
    {
      id: 4,
      title: 'Community Clean-Up Organizer',
      organization: 'Green Earth Initiative',
      location: 'San Francisco, CA',
      type: 'On-site',
      duration: '5 hours',
      volunteers: 30,
      needed: 40,
      date: 'Dec 18, 2025',
      description: 'Lead and coordinate community clean-up efforts in local parks and neighborhoods.',
      skills: ['Leadership', 'Environmental Awareness', 'Coordination'],
      urgent: false
    },
    {
      id: 5,
      title: 'Senior Care Companion',
      organization: 'Golden Years Foundation',
      location: 'Boston, MA',
      type: 'Hybrid',
      duration: '3 hours/week',
      volunteers: 12,
      needed: 20,
      date: 'Ongoing',
      description: 'Spend quality time with elderly individuals, providing companionship and support.',
      skills: ['Empathy', 'Communication', 'Patience'],
      urgent: false
    },
    {
      id: 6,
      title: 'Disaster Relief Coordinator',
      organization: 'Emergency Response Team',
      location: 'Houston, TX',
      type: 'On-site',
      duration: '12 hours',
      volunteers: 18,
      needed: 30,
      date: 'Dec 19, 2025',
      description: 'Help coordinate relief efforts for families affected by recent natural disasters.',
      skills: ['Crisis Management', 'Organization', 'Physical Stamina'],
      urgent: true
    }
  ];

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

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {volunteerOpportunities.map((opportunity) => (
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
                  <Link to="/register?role=volunteer">
                    <PrimaryButton size="sm">Apply Now</PrimaryButton>
                  </Link>
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
                    {opportunity.needed - opportunity.volunteers} spots remaining
                  </p>
                </div>
              </Card>
            ))}
          </div>

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
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600 sm:py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl" data-text-split data-letters-slide-up>
              Ready to Make a Difference?
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-primary-100">
              Join our community of dedicated volunteers today. Your time and skills can change lives.
            </p>
            <div className="flex flex-col justify-center gap-4 mt-8 sm:flex-row">
              <Link to="/register">
                <PrimaryButton  buttonType='secondary' size="lg">
                  Register Now
                </PrimaryButton>
              </Link>
              <Link to="/contact">
                <SecondaryButton  buttonType='secondary' size="lg">
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
