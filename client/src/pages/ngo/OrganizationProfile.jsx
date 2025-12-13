import React, { useState } from 'react';
import { HiSave, HiCamera, HiCheckCircle, HiClock } from 'react-icons/hi';
import Card from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';

const OrganizationProfile = () => {
  // const { user } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    organizationName: 'Hope Foundation',
    registrationNumber: 'NGO-2020-12345',
    taxId: 'TAX-987654321',
    email: 'contact@hopefoundation.org',
    phone: '+1 (555) 123-4567',
    website: 'www.hopefoundation.org',
    address: '123 Charity Lane',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    mission: 'To provide humanitarian aid and support to communities in need across the globe.',
    description: 'Hope Foundation is a non-profit organization dedicated to delivering emergency relief, healthcare, education, and sustainable development programs to vulnerable populations worldwide.',
    established: '2020',
    verificationStatus: 'verified'
  });

  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Executive Director',
      email: 'sarah@hopefoundation.org',
      phone: '+1 (555) 234-5678'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Program Manager',
      email: 'michael@hopefoundation.org',
      phone: '+1 (555) 345-6789'
    },
    {
      id: 3,
      name: 'Lisa Ahmed',
      role: 'Finance Director',
      email: 'lisa@hopefoundation.org',
      phone: '+1 (555) 456-7890'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  const getVerificationBadge = (status) => {
    if (status === 'verified') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-success-100 text-success-700">
          <HiCheckCircle className="w-4 h-4" />
          Verified Organization
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-warning-100 text-warning-700">
        <HiClock className="w-4 h-4" />
        Pending Verification
      </span>
    );
  };

  return (
    <div className="min-h-screen py-8 bg-secondary-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Organization Profile</h1>
            <p className="mt-1 text-secondary-600">
              Manage your organization's information and settings
            </p>
          </div>
          {!isEditing ? (
            <SecondaryButton onClick={() => setIsEditing(true)}>
              Edit Profile
            </SecondaryButton>
          ) : (
            <div className="flex gap-3">
              <SecondaryButton onClick={() => setIsEditing(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton onClick={handleSave}>
                <HiSave className="w-4 h-4" />
                Save Changes
              </PrimaryButton>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Organization Details */}
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-secondary-900">Organization Details</h2>
                {getVerificationBadge(formData.verificationStatus)}
              </div>

              {/* Logo */}
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-secondary-700">
                  Organization Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-24 h-24 rounded-lg bg-secondary-200">
                    <span className="text-3xl font-bold text-secondary-600">HF</span>
                  </div>
                  {isEditing && (
                    <SecondaryButton>
                      <HiCamera className="w-4 h-4" />
                      Change Logo
                    </SecondaryButton>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    Tax ID
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    Year Established
                  </label>
                  <input
                    type="text"
                    name="established"
                    value={formData.established}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card padding="lg">
              <h2 className="mb-6 text-xl font-bold text-secondary-900">Contact Information</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    State/Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    ZIP/Postal Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </Card>

            {/* Mission & Description */}
            <Card padding="lg">
              <h2 className="mb-6 text-xl font-bold text-secondary-900">Mission & Description</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    Mission Statement *
                  </label>
                  <textarea
                    name="mission"
                    value={formData.mission}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-secondary-700">
                    Organization Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="5"
                    className="w-full px-4 py-2 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </Card>

            {/* Team Members */}
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-secondary-900">Team Members</h2>
                {isEditing && (
                  <SecondaryButton>Add Member</SecondaryButton>
                )}
              </div>

              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="p-4 border rounded-lg border-secondary-200">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-secondary-600">Name</p>
                        <p className="font-semibold text-secondary-900">{member.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-600">Role</p>
                        <p className="font-semibold text-secondary-900">{member.role}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-600">Email</p>
                        <p className="text-secondary-900">{member.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-secondary-600">Phone</p>
                        <p className="text-secondary-900">{member.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Verification Status */}
            <Card padding="lg">
              <h3 className="mb-4 text-lg font-bold text-secondary-900">Verification Status</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <HiCheckCircle className="w-5 h-5 text-success-600" />
                  <span className="text-sm text-secondary-900">Registration Documents</span>
                </div>
                <div className="flex items-center gap-2">
                  <HiCheckCircle className="w-5 h-5 text-success-600" />
                  <span className="text-sm text-secondary-900">Tax Documentation</span>
                </div>
                <div className="flex items-center gap-2">
                  <HiCheckCircle className="w-5 h-5 text-success-600" />
                  <span className="text-sm text-secondary-900">Bank Account Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <HiCheckCircle className="w-5 h-5 text-success-600" />
                  <span className="text-sm text-secondary-900">Identity Verification</span>
                </div>
              </div>
            </Card>

            {/* Documents */}
            <Card padding="lg">
              <h3 className="mb-4 text-lg font-bold text-secondary-900">Documents</h3>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg border-secondary-200">
                  <p className="text-sm font-semibold text-secondary-900">Registration Certificate</p>
                  <p className="text-xs text-secondary-600">Uploaded: Jan 15, 2024</p>
                </div>
                <div className="p-3 border rounded-lg border-secondary-200">
                  <p className="text-sm font-semibold text-secondary-900">Tax ID Document</p>
                  <p className="text-xs text-secondary-600">Uploaded: Jan 15, 2024</p>
                </div>
                <div className="p-3 border rounded-lg border-secondary-200">
                  <p className="text-sm font-semibold text-secondary-900">Bank Statement</p>
                  <p className="text-xs text-secondary-600">Uploaded: Jan 15, 2024</p>
                </div>
              </div>
              {isEditing && (
                <SecondaryButton className="w-full mt-4">
                  Upload Document
                </SecondaryButton>
              )}
            </Card>

            {/* Statistics */}
            <Card padding="lg" className="bg-primary-50">
              <h3 className="mb-4 text-lg font-bold text-secondary-900">Organization Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-secondary-700">Member Since</span>
                  <span className="font-semibold text-secondary-900">January 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary-700">Total Campaigns</span>
                  <span className="font-semibold text-secondary-900">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary-700">Total Raised</span>
                  <span className="font-semibold text-secondary-900">$850,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary-700">People Helped</span>
                  <span className="font-semibold text-secondary-900">12,500+</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfile;
