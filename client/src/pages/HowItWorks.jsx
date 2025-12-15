// How It Works Page
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiUserAdd, 
  HiSearch, 
  HiCreditCard, 
  HiChartBar,
  HiCheckCircle,
  HiHeart,
  HiShieldCheck,
  HiLightningBolt,
  HiDocumentText,
  HiUsers
} from 'react-icons/hi';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import StatCounter from '../components/ui/StatCounter';
import useTextAnimation from '../hooks/useTextAnimation';

const HowItWorks = () => {
  useTextAnimation();

  const donorSteps = [
    {
      icon: <HiUserAdd className="w-8 h-8" />,
      number: '1',
      title: 'Create an Account',
      description: 'Sign up as a donor in just a few clicks. Provide basic information to get started on your giving journey.',
      color: 'primary'
    },
    {
      icon: <HiSearch className="w-8 h-8" />,
      number: '2',
      title: 'Browse Campaigns',
      description: 'Explore verified campaigns and urgent requests from trusted NGOs. Filter by cause, location, or urgency.',
      color: 'success'
    },
    {
      icon: <HiCreditCard className="w-8 h-8" />,
      number: '3',
      title: 'Make a Donation',
      description: 'Choose your preferred payment method. All transactions are secure and you receive instant confirmation.',
      color: 'accent'
    },
    {
      icon: <HiChartBar className="w-8 h-8" />,
      number: '4',
      title: 'Track Your Impact',
      description: 'Monitor how your donations are used in real-time. Receive updates, reports, and see the difference you make.',
      color: 'warning'
    }
  ];

  const ngoSteps = [
    {
      icon: <HiDocumentText className="w-8 h-8" />,
      number: '1',
      title: 'Register Your Organization',
      description: 'Complete the verification process with your NGO credentials and documentation.',
      color: 'primary'
    },
    {
      icon: <HiShieldCheck className="w-8 h-8" />,
      number: '2',
      title: 'Get Verified',
      description: 'Our team reviews your application to ensure legitimacy and compliance with our standards.',
      color: 'success'
    },
    {
      icon: <HiHeart className="w-8 h-8" />,
      number: '3',
      title: 'Create Campaigns',
      description: 'Launch campaigns for your causes with detailed information, goals, and impact metrics.',
      color: 'accent'
    },
    {
      icon: <HiUsers className="w-8 h-8" />,
      number: '4',
      title: 'Receive Donations',
      description: 'Accept donations from verified donors and manage funds through our secure platform.',
      color: 'warning'
    }
  ];

  const features = [
    {
      icon: <HiShieldCheck className="w-10 h-10" />,
      title: '100% Verified',
      description: 'All NGOs and campaigns undergo rigorous verification to ensure authenticity and transparency.'
    },
    {
      icon: <HiLightningBolt className="w-10 h-10" />,
      title: 'Instant Updates',
      description: 'Real-time notifications and tracking keep you informed about your donations and their impact.'
    },
    {
      icon: <HiCheckCircle className="w-10 h-10" />,
      title: 'Secure Payments',
      description: 'Multiple payment options with bank-level encryption to protect your financial information.'
    },
    {
      icon: <HiChartBar className="w-10 h-10" />,
      title: 'Impact Reports',
      description: 'Detailed analytics and reports showing exactly how your contributions are making a difference.'
    }
  ];

  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    accent: 'bg-accent-100 text-accent-600',
    warning: 'bg-warning-100 text-warning-600'
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary-700 to-primary-900 sm:py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl fade-in" data-text-split data-letters-slide-up>
              How BarakahAid Works
            </h1>
            <p className="max-w-3xl mx-auto mt-6 text-lg text-primary-100 sm:text-xl fade-in-delay-1">
              Our platform connects generous donors with verified NGOs to create meaningful impact. 
              Here's how you can make a difference or receive support for your cause.
            </p>
          </div>
        </div>
      </section>

      {/* For Donors Section */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-secondary-900 sm:text-4xl" data-text-split data-letters-slide-up>For Donors</h2>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-secondary-600">
              Start your journey to making a difference in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {donorSteps.map((step, index) => (
              <div key={index} className="relative">
                <Card padding="lg" className="h-full transition-shadow hover:shadow-lg">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full ${colorClasses[step.color]}`}>
                      {step.icon}
                    </div>
                    <div className="absolute flex items-center justify-center w-8 h-8 text-white rounded-full -top-3 -right-3 bg-secondary-900">
                      <span className="text-sm font-bold">{step.number}</span>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-secondary-900">{step.title}</h3>
                    <p className="text-secondary-600">{step.description}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/register">
              <PrimaryButton size="lg">
                Get Started as a Donor
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </section>

      {/* For NGOs Section */}
      <section className="py-16 bg-secondary-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-secondary-900 sm:text-4xl" data-text-split data-letters-slide-up>For NGOs</h2>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-secondary-600">
              Join our platform and connect with donors who care about your mission
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {ngoSteps.map((step, index) => (
              <div key={index} className="relative">
                <Card padding="lg" className="h-full transition-shadow hover:shadow-lg">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full ${colorClasses[step.color]}`}>
                      {step.icon}
                    </div>
                    <div className="absolute flex items-center justify-center w-8 h-8 text-white rounded-full -top-3 -right-3 bg-secondary-900">
                      <span className="text-sm font-bold">{step.number}</span>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-secondary-900">{step.title}</h3>
                    <p className="text-secondary-600">{step.description}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/register">
              <PrimaryButton size="lg">
                Register Your NGO
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-secondary-900 sm:text-4xl" data-text-split data-letters-slide-up>Why Choose BarakahAid?</h2>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-secondary-600">
              We provide a secure, transparent, and efficient platform for charitable giving
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} padding="lg" className="text-center transition-shadow hover:shadow-lg">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-secondary-900">{feature.title}</h3>
                <p className="text-secondary-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How Donations Work */}
      <section className="py-16 bg-secondary-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-secondary-900 sm:text-4xl" data-text-split data-letters-slide-up>
                Transparent Donation Process
              </h2>
              <p className="mt-4 text-lg text-secondary-600">
                Every donation goes through a secure and transparent process to ensure your contribution reaches those who need it most.
              </p>
              
              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 text-primary-600">
                    <HiCheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900">Secure Payment Processing</h3>
                    <p className="mt-1 text-secondary-600">
                      All transactions are encrypted and processed through trusted payment gateways.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-success-100 text-success-600">
                    <HiShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900">Verified Recipients</h3>
                    <p className="mt-1 text-secondary-600">
                      All NGOs undergo strict verification to ensure legitimacy and compliance.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-accent-100 text-accent-600">
                    <HiChartBar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900">Real-Time Tracking</h3>
                    <p className="mt-1 text-secondary-600">
                      Monitor your donations and see detailed reports on their impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card padding="lg" className="bg-primary-50 border-primary-200">
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-primary-600">
                  <HiHeart className="w-10 h-10 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-secondary-900">
                  95% of Funds Go Directly to Causes
                </h3>
                <p className="mb-6 text-lg text-secondary-700">
                  We keep operational costs minimal to ensure maximum impact from your donations.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-primary-300">
                  <StatCounter 
                    value="95%" 
                    label="To Causes" 
                    duration={1500}
                    valueColor="text-primary-600"
                    labelColor="text-secondary-600"
                    size="md"
                  />
                  <StatCounter 
                    value="5%" 
                    label="Operations" 
                    duration={1500}
                    valueColor="text-secondary-600"
                    labelColor="text-secondary-600"
                    size="md"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl" data-text-split data-letters-slide-up>
            Ready to Make a Difference?
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-primary-100">
            Join thousands of donors and NGOs who are creating positive change through BarakahAid.
          </p>
          <div className="flex flex-col justify-center gap-4 mt-8 sm:flex-row">
            <Link to="/register">
              <PrimaryButton size="lg" className="bg-white hover:bg-secondary-50 text-primary-600" buttonType='secondary'>
                Sign Up Now
              </PrimaryButton>
            </Link>
            <Link to="/campaigns">
              <SecondaryButton size="lg" className="text-white border-white hover:bg-primary-700" buttonType='secondary'>
                Browse Campaigns
              </SecondaryButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
