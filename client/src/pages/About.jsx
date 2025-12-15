// About Us Page
import React from 'react';
import { Link } from 'react-router-dom';
import { HiShieldCheck, HiUsers, HiGlobeAlt, HiAdjustments } from 'react-icons/hi';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import StatCounter from '../components/ui/StatCounter';
import useTextAnimation from '../hooks/useTextAnimation';

const About = () => {
  useTextAnimation();
  const stats = [
    { value: '21+', label: 'Years of Service' },
    { value: '$877M', label: 'Funds Raised' },
    { value: '1.7M+', label: 'Donors Worldwide' },
    { value: '35K+', label: 'Projects Funded' },
    { value: '175+', label: 'Countries Reached' },
    { value: '95%', label: 'Funds to Causes' },
  ];

  const values = [
    {
      icon: <HiShieldCheck className="w-8 h-8" />,
      title: 'Transparency',
      description: 'Every donation is tracked and verified. We provide real-time updates on how funds are used, ensuring complete accountability.'
    },
    {
      icon: <HiUsers className="w-8 h-8" />,
      title: 'Community First',
      description: 'We prioritize the needs of both donors and recipients, creating a supportive ecosystem for positive change.'
    },
    {
      icon: <HiGlobeAlt className="w-8 h-8" />,
      title: 'Global Impact',
      description: 'From healthcare to education, disaster relief to poverty eradication, we support diverse causes across the globe.'
    },
    {
      icon: <HiAdjustments className="w-8 h-8" />,
      title: 'Innovation',
      description: 'We leverage cutting-edge technology, including blockchain, to ensure secure, efficient, and transparent transactions.'
    },
  ];

  const team = [
    {
      name: 'Dr. Sarah Mitchell',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
      bio: '15+ years in nonprofit management and global development'
    },
    {
      name: 'Ahmed Hassan',
      role: 'Chief Technology Officer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      bio: 'Former tech lead at major fintech companies'
    },
    {
      name: 'Maria Rodriguez',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
      bio: 'Expert in international humanitarian aid coordination'
    },
    {
      name: 'David Chen',
      role: 'Chief Financial Officer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
      bio: 'Specialized in nonprofit financial management'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold text-secondary-900 md:text-5xl" data-text-split data-letters-slide-up>
              About BarakahAid
            </h1>
            <p className="max-w-3xl mx-auto mb-8 text-xl leading-relaxed text-secondary-600">
              We're on a mission to make charitable giving transparent, accessible, and impactful. 
              Together with our global community, we're creating positive change in lives around the world.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <PrimaryButton>
                  Join Our Mission
                </PrimaryButton>
              </Link>
              <Link to="/contact">
                <SecondaryButton>
                  Get in Touch
                </SecondaryButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b bg-primary-700 border-primary-600">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat, index) => (
              <StatCounter 
                key={index} 
                value={stat.value} 
                label={stat.label}
                duration={2000}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-center text-secondary-900" data-text-split data-letters-slide-up>Our Story</h2>
          <Card className="p-8">
            <div className="space-y-4 text-lg leading-relaxed text-secondary-700">
              <p>
                Founded in 2004, BarakahAid began with a simple yet powerful vision: to create a platform where 
                compassion meets transparency, and every donation creates measurable impact.
              </p>
              <p>
                Our founder, Dr. Sarah Mitchell, witnessed firsthand the challenges faced by both donors wanting 
                to make a difference and communities in need of support. Traditional charitable systems often lacked 
                transparency, making it difficult for donors to trust where their contributions went.
              </p>
              <p>
                BarakahAid was created to bridge this gap. By leveraging technology and building a community-driven 
                platform, we've made it possible for anyone, anywhere, to contribute to causes they care about with 
                complete confidence and transparency.
              </p>
              <p>
                Today, we're proud to serve over 1.7 million donors and support more than 35,000 projects across 
                175 countries. But our mission remains the same: empowering people to create positive change through 
                transparent, impactful giving.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-secondary-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900" data-text-split data-letters-slide-up>Our Core Values</h2>
            <p className="max-w-2xl mx-auto text-lg text-secondary-600">
              These principles guide everything we do and shape our commitment to making a difference
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Card key={index} className="p-6 text-center transition-shadow hover:shadow-card-hover">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary-100 text-primary-600">
                  {value.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-secondary-900">{value.title}</h3>
                <p className="leading-relaxed text-secondary-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-secondary-900" data-text-split data-letters-slide-up>Meet Our Leadership Team</h2>
            <p className="max-w-2xl mx-auto text-lg text-secondary-600">
              Experienced professionals dedicated to our mission of transparent, impactful giving
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden text-center transition-shadow hover:shadow-card-hover">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="object-cover w-full h-64"
                />
                <div className="p-6">
                  <h3 className="mb-1 text-xl font-bold text-secondary-900">{member.name}</h3>
                  <p className="mb-3 font-medium text-primary-600">{member.role}</p>
                  <p className="text-sm text-secondary-600">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-secondary-900" data-text-split data-letters-slide-up>Creating Real Impact</h2>
              <div className="space-y-4 text-lg leading-relaxed text-secondary-700">
                <p>
                  Every donation on BarakahAid creates tangible change. From building schools in rural communities 
                  to providing emergency relief during natural disasters, our platform ensures funds reach those who 
                  need them most.
                </p>
                <p>
                  We maintain a 95% pass-through rate, meaning 95 cents of every dollar goes directly to the cause. 
                  The remaining 5% covers platform maintenance and payment processing, ensuring sustainable operations.
                </p>
                <p>
                  Our verification process ensures all campaigns are legitimate, and our blockchain-powered tracking 
                  system provides complete transparency from donation to impact.
                </p>
              </div>
              <div className="mt-6">
                <Link to="/register">
                  <PrimaryButton>
                    Start Making an Impact
                  </PrimaryButton>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=300&h=300&fit=crop" 
                alt="Impact"
                className="object-cover w-full rounded-lg shadow-card h-60"
              />
              <img 
                src="https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=300&h=300&fit=crop" 
                alt="Impact"
                className="object-cover w-full mt-8 rounded-lg shadow-card h-60"
              />
              <img 
                src="https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=300&h=300&fit=crop" 
                alt="Impact"
                className="object-cover w-full rounded-lg shadow-card h-60"
              />
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=300&h=300&fit=crop" 
                alt="Impact"
                className="object-cover w-full mt-8 rounded-lg shadow-card h-60"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl" data-text-split data-letters-slide-up>
            Join Us in Making a Difference
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-primary-100">
            Whether you're looking to donate, create a campaign, or partner with us, 
            there are many ways to be part of the BarakahAid community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <PrimaryButton buttonType='secondary'>
                Get Started Today
              </PrimaryButton>
            </Link>
            <Link to="/contact">
              <SecondaryButton buttonType='secondary'>
                Contact Our Team
              </SecondaryButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
