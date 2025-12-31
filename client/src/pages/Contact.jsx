// Contact Us Page
import React, { useState } from 'react';
import { HiMail, HiPhone, HiLocationMarker, HiClock, HiCheckCircle, HiQuestionMarkCircle } from 'react-icons/hi';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import Select from '../components/ui/Select';
import useTextAnimation from '../hooks/useTextAnimation';

const Contact = () => {
  useTextAnimation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <HiMail className="w-6 h-6" />,
      title: 'Email',
      details: ['support@barakahaid.com', 'partnerships@barakahaid.com'],
      description: 'Send us an email anytime'
    },
    {
      icon: <HiPhone className="w-6 h-6" />,
      title: 'Phone',
      details: ['+1 (619) 555-0123', '+1 (619) 555-0124'],
      description: 'Mon-Fri from 8am to 6pm PST'
    },
    {
      icon: <HiLocationMarker className="w-6 h-6" />,
      title: 'Office',
      details: ['3002 Suter Avenue', 'San Diego, CA 92103', 'United States'],
      description: 'Visit our headquarters'
    },
    {
      icon: <HiClock className="w-6 h-6" />,
      title: 'Business Hours',
      details: ['Monday - Friday: 8am - 6pm PST', 'Saturday: 10am - 4pm PST', 'Sunday: Closed'],
      description: 'When we\'re available'
    }
  ];

  const departments = [
    {
      title: 'General Support',
      email: 'support@barakahaid.com',
      description: 'Questions about donations, accounts, or platform features'
    },
    {
      title: 'Partnerships',
      email: 'partnerships@barakahaid.com',
      description: 'Corporate partnerships and collaboration opportunities'
    },
    {
      title: 'Media Inquiries',
      email: 'media@barakahaid.com',
      description: 'Press releases, interviews, and media resources'
    },
    {
      title: 'Legal',
      email: 'legal@barakahaid.com',
      description: 'Legal questions, compliance, and terms of service'
    },
    {
      title: 'Technical Support',
      email: 'tech@barakahaid.com',
      description: 'Technical issues, bugs, and platform errors'
    },
    {
      title: 'Campaign Verification',
      email: 'verification@barakahaid.com',
      description: 'Campaign verification and approval process'
    }
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-secondary-900 md:text-5xl" data-text-split data-letters-slide-up>
              Contact Us
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-secondary-600">
              Have a question or need assistance? We're here to help. Reach out to us through any of the channels below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info, index) => (
              <Card key={index} className="p-6 text-center transition-shadow hover:shadow-card-hover">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary-100 text-primary-600">
                  {info.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-secondary-900">{info.title}</h3>
                <div className="mb-2 space-y-1 text-sm font-medium text-secondary-700">
                  {info.details.map((detail, idx) => (
                    <p key={idx}>{detail}</p>
                  ))}
                </div>
                <p className="text-sm text-secondary-600">{info.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Departments */}
      <section className="py-12">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="mb-6 text-2xl font-bold text-secondary-900" data-text-split data-letters-slide-up>Send Us a Message</h2>
                
                {submitted && (
                  <div className="p-4 mb-6 border border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="font-semibold text-green-800">Message sent successfully!</p>
                    </div>
                    <p className="mt-1 text-sm text-green-700">We'll get back to you within 24-48 hours.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Input
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <Select
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={[
                      { value: 'general', label: 'General Inquiry' },
                      { value: 'support', label: 'Technical Support' },
                      { value: 'donation', label: 'Donation Question' },
                      { value: 'campaign', label: 'Campaign Related' },
                      { value: 'partnership', label: 'Partnership Opportunity' },
                      { value: 'media', label: 'Media Inquiry' },
                      { value: 'other', label: 'Other' }
                    ]}
                    required
                  />

                  <Input
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                  />

                  <TextArea
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                  />

                  <PrimaryButton type="submit" className="w-full">
                    Send Message
                  </PrimaryButton>
                </form>
              </Card>
            </div>

            {/* Departments */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="mb-4 text-xl font-bold text-secondary-900">Our Departments</h3>
                <div className="space-y-4">
                  {departments.map((dept, index) => (
                    <div key={index} className="pb-4 border-b border-secondary-200 last:border-0 last:pb-0">
                      <h4 className="mb-1 font-semibold text-secondary-900">{dept.title}</h4>
                      <a href={`mailto:${dept.email}`} className="block mb-1 text-sm font-medium text-primary-600 hover:underline">
                        {dept.email}
                      </a>
                      <p className="text-xs text-secondary-600">{dept.description}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-primary-50 to-white border-primary-200">
                <h3 className="mb-2 text-lg font-bold text-secondary-900">Quick Response</h3>
                <p className="mb-4 text-sm text-secondary-700">
                  Most inquiries are answered within 24-48 hours during business days. 
                  For urgent matters, please call our support line.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-secondary-900">Average response: 12 hours</span>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-secondary-50 to-white">
                <h3 className="mb-2 text-lg font-bold text-secondary-900">Need Immediate Help?</h3>
                <p className="mb-4 text-sm text-secondary-700">
                  Check out our FAQ page for answers to common questions, or reach out on social media.
                </p>
                <div className="space-y-2">
                  <a href="/faq" className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:underline">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Visit FAQ Page
                  </a>
                  <div className="flex gap-3 pt-2">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 transition-colors rounded-lg bg-primary-100 text-primary-600 hover:bg-primary-200">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 transition-colors rounded-lg bg-primary-100 text-primary-600 hover:bg-primary-200">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 transition-colors rounded-lg bg-primary-100 text-primary-600 hover:bg-primary-200">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Card className="overflow-hidden">
            <div className="h-96">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3318.8111050880016!2d73.02207907441515!3d33.713836435525636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbe5967d48243%3A0xcb2c90c562c4687e!2sAir%20University%20Islamabad!5e0!3m2!1sen!2s!4v1765554939843!5m2!1sen!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Air University Islamabad Location"
              />
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Contact;
