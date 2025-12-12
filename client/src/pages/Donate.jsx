import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiCheckCircle, HiCreditCard, HiClock, HiHeart, HiArrowLeft } from 'react-icons/hi';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import { formatCurrency } from '../utils/helpers';

const Donate = () => {
  const { id } = useParams();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isRecurring, setIsRecurring] = useState(false);
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    anonymous: false
  });

  // Mock campaign data - in real app, fetch based on id
  const campaign = {
    id: id || 1,
    title: 'Emergency Food Relief - Gaza',
    description: 'Provide emergency food packages to families affected by the ongoing crisis in Gaza. Each package contains essential food items for a family of 5 for one week.',
    category: 'Emergency Relief',
    currentAmount: 45000,
    targetAmount: 100000,
    donors: 1250,
    daysLeft: 15,
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800',
    organizer: 'BarakahAid Foundation',
    verified: true
  };

  const presetAmounts = [25, 50, 100, 250, 500, 1000];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
    }
  };

  const handleDonorInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDonorInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getTotalAmount = () => {
    return selectedAmount || parseInt(customAmount) || 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle donation submission
    console.log('Donation submitted:', {
      campaign: campaign.id,
      amount: getTotalAmount(),
      paymentMethod,
      isRecurring,
      donorInfo
    });
  };

  return (
    <div className="min-h-screen py-8 bg-secondary-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/campaigns" className="inline-flex items-center gap-2 mb-6 text-primary-600 hover:text-primary-700">
          <HiArrowLeft className="w-5 h-5" />
          <span>Back to Campaigns</span>
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Donation Form */}
          <div className="lg:col-span-2">
            <Card padding="lg">
              <h1 className="mb-6 text-2xl font-bold text-secondary-900">Make a Donation</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Donation Amount */}
                <div>
                  <label className="block mb-3 text-lg font-semibold text-secondary-900">
                    Select Amount
                  </label>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {presetAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleAmountSelect(amount)}
                        className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                          selectedAmount === amount
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-secondary-300 bg-white text-secondary-700 hover:border-primary-400'
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute text-lg font-semibold transform -translate-y-1/2 left-4 top-1/2 text-secondary-700">$</span>
                    <input
                      type="text"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className={`w-full py-3 pl-10 pr-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        customAmount ? 'border-primary-600 bg-primary-50' : 'border-secondary-300'
                      }`}
                    />
                  </div>
                </div>

                {/* Recurring Donation */}
                <div className="p-4 rounded-lg bg-secondary-50">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <span className="font-semibold text-secondary-900">Make this a monthly donation</span>
                      <p className="text-sm text-secondary-600">Your support will help us plan better and sustain our programs</p>
                    </div>
                  </label>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block mb-3 text-lg font-semibold text-secondary-900">
                    Payment Method
                  </label>
                  <div className="space-y-3">
                    <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'card' ? 'border-primary-600 bg-primary-50' : 'border-secondary-300 bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-primary-600"
                      />
                      <HiCreditCard className="w-6 h-6 text-secondary-700" />
                      <span className="font-medium text-secondary-900">Credit/Debit Card</span>
                    </label>
                    <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'paypal' ? 'border-primary-600 bg-primary-50' : 'border-secondary-300 bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-primary-600"
                      />
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#00457C">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.653h8.16c2.713 0 4.64.926 5.415 2.607.246.53.359 1.093.359 1.704 0 3.096-1.978 4.956-5.244 4.956h-2.66a.77.77 0 0 0-.76.653l-.797 5.09a.641.641 0 0 1-.633.74z"/>
                      </svg>
                      <span className="font-medium text-secondary-900">PayPal</span>
                    </label>
                    <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'bank' ? 'border-primary-600 bg-primary-50' : 'border-secondary-300 bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={paymentMethod === 'bank'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-primary-600"
                      />
                      <svg className="w-6 h-6 text-secondary-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v2h20V7l-10-5zM4 11v8h2v-8H4zm4 0v8h2v-8H8zm4 0v8h2v-8h-2zm4 0v8h2v-8h-2zm4 0v8h2v-8h-2zM2 21h20v2H2v-2z"/>
                      </svg>
                      <span className="font-medium text-secondary-900">Bank Transfer</span>
                    </label>
                  </div>
                </div>

                {/* Donor Information */}
                <div>
                  <label className="block mb-3 text-lg font-semibold text-secondary-900">
                    Your Information
                  </label>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={donorInfo.name}
                        onChange={handleDonorInfoChange}
                        disabled={donorInfo.anonymous}
                        className="w-full px-4 py-3 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-100"
                        required={!donorInfo.anonymous}
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={donorInfo.email}
                        onChange={handleDonorInfoChange}
                        className="w-full px-4 py-3 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number (Optional)"
                        value={donorInfo.phone}
                        onChange={handleDonorInfoChange}
                        className="w-full px-4 py-3 border rounded-lg border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="anonymous"
                        checked={donorInfo.anonymous}
                        onChange={handleDonorInfoChange}
                        className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-secondary-700">Make my donation anonymous</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <PrimaryButton
                    type="submit"
                    className="w-full"
                    disabled={getTotalAmount() === 0}
                  >
                    <HiHeart className="w-5 h-5" />
                    Complete Donation {getTotalAmount() > 0 && `- ${formatCurrency(getTotalAmount())}`}
                  </PrimaryButton>
                </div>
              </form>
            </Card>
          </div>

          {/* Sidebar - Campaign Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Campaign Card */}
              <Card padding="lg">
                <h2 className="mb-4 text-lg font-bold text-secondary-900">You're Supporting</h2>
                <div className="mb-4">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="object-cover w-full h-40 rounded-lg"
                  />
                </div>
                <div className="mb-2">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-success-700">
                    {campaign.verified && (
                      <>
                        <HiCheckCircle className="w-4 h-4" />
                        Verified
                      </>
                    )}
                  </span>
                </div>
                <h3 className="mb-2 text-base font-semibold text-secondary-900">{campaign.title}</h3>
                <p className="mb-4 text-sm text-secondary-600 line-clamp-3">{campaign.description}</p>
                
                <div className="pt-4 border-t border-secondary-200">
                  <ProgressBar
                    value={campaign.currentAmount}
                    max={campaign.targetAmount}
                    className="mb-3"
                  />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Raised</span>
                      <span className="font-semibold text-secondary-900">{formatCurrency(campaign.currentAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Goal</span>
                      <span className="font-semibold text-secondary-900">{formatCurrency(campaign.targetAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Donors</span>
                      <span className="font-semibold text-secondary-900">{campaign.donors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Days Left</span>
                      <span className="font-semibold text-secondary-900">{campaign.daysLeft}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Impact Info */}
              <Card padding="lg" className="bg-primary-50">
                <h3 className="mb-3 font-semibold text-secondary-900">Your Impact</h3>
                <div className="space-y-2 text-sm text-secondary-700">
                  <div className="flex items-start gap-2">
                    <HiCheckCircle className="shrink-0 w-5 h-5 mt-0.5 text-primary-600" />
                    <span>$25 provides food for a family for one week</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <HiCheckCircle className="shrink-0 w-5 h-5 mt-0.5 text-primary-600" />
                    <span>$50 includes fresh produce and protein items</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <HiCheckCircle className="shrink-0 w-5 h-5 mt-0.5 text-primary-600" />
                    <span>$100 supports two families for a week</span>
                  </div>
                </div>
              </Card>

              {/* Security Notice */}
              <Card padding="md" className="bg-success-50">
                <div className="flex items-start gap-3">
                  <HiCheckCircle className="shrink-0 w-6 h-6 text-success-600" />
                  <div className="text-sm">
                    <p className="font-semibold text-success-900">Secure Donation</p>
                    <p className="text-success-700">Your payment information is encrypted and secure</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
