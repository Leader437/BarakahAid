import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  HiCheckCircle, 
  HiCreditCard, 
  HiHeart, 
  HiArrowLeft, 
  HiShieldCheck, 
  HiUser, 
  HiMail, 
  HiPhone 
} from 'react-icons/hi';
import { SiPaypal, SiGooglepay } from 'react-icons/si';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import PrimaryButton from '../components/ui/PrimaryButton';
import SecondaryButton from '../components/ui/SecondaryButton';
import { formatCurrency } from '../utils/helpers';
import DemoPaymentForm from '../components/payment/DemoPaymentForm';
import PayPalDemoForm from '../components/payment/PayPalDemoForm';
import GooglePayDemoForm from '../components/payment/GooglePayDemoForm';
import DonationSuccessModal from '../components/payment/DonationSuccessModal';

const Donate = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null); // Real data (campaign or request)
  
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState('stripe');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [donorInfo, setDonorInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    anonymous: false
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try fetching as campaign first
        try {
          const res = await api.get(`/campaigns/${id}`);
          const campaignData = res.data?.data || res.data;
          setData({
            ...campaignData,
            // Normalize field names with fallbacks
            goalAmount: Number(campaignData.goalAmount) || 0,
            raisedAmount: Number(campaignData.raisedAmount) || 0,
            image: campaignData.image || campaignData.imageUrl || '/images/placeholder-campaign.jpg',
            organizationName: campaignData.createdBy?.name || 'BarakahAid Partner',
            type: 'campaign'
          });
        } catch (err) {
          // If not campaign, try as donation request
          const res = await api.get(`/donation-requests/${id}`);
          const reqData = res.data?.data || res.data;
          setData({
            ...reqData,
            // Map request fields to common format with fallbacks
            goalAmount: Number(reqData.targetAmount) || Number(reqData.goalAmount) || 0,
            raisedAmount: Number(reqData.currentAmount) || Number(reqData.raisedAmount) || 0,
            image: reqData.media?.[0] || '/images/placeholder-request.jpg',
            organizationName: reqData.createdBy?.name || 'BarakahAid Partner',
            type: 'request'
          });
        }
      } catch (err) {
        console.error('Failed to fetch donation target', err);
        setError('Could not find the campaign or request you are looking for.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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

  const handleSuccess = async (method, transactionPrefix) => {
    try {
      const amount = getTotalAmount();
      
      // Call backend to record the transaction
      const payload = {
        amount,
        campaignId: data.type === 'campaign' ? data.id : undefined,
        requestId: data.type === 'request' ? data.id : undefined,
        paymentGateway: method.toUpperCase(),
        donorName: donorInfo.anonymous ? 'Anonymous' : donorInfo.name,
        donorEmail: donorInfo.email,
        isAnonymous: donorInfo.anonymous,
        isRecurring
      };

      const res = await api.post('/transactions', payload);
      
      setSuccessData({
        amount: amount,
        campaign: {
           ...data,
           title: data.title || data.name
        },
        donorName: donorInfo.name || 'Anonymous',
        paymentMethod: method,
        transactionId: res.data?.id || `${transactionPrefix}-${Date.now()}`,
      });
      setShowSuccessModal(true);
      
      // Reset form
      setSelectedAmount(100);
      setCustomAmount('');
      setDonorInfo({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', anonymous: false });
      setIsRecurring(false);
    } catch (err) {
      console.error('Donation processing failed', err);
      alert('Payment was successful but we failed to record it in our system: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center p-8">Loading donation details...</div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-4">
        <p className="text-xl text-secondary-600">{error || 'Target not found'}</p>
        <Link to="/campaigns" className="text-primary-600 font-bold hover:underline">Back to Campaigns</Link>
      </div>
    );
  }

  const campaign = {
    id: data.id,
    title: data.title || data.name,
    description: data.description,
    category: data.category?.name || data.category || 'General',
    currentAmount: Number(data.raisedAmount || data.currentAmount || 0),
    targetAmount: Number(data.goalAmount || data.targetAmount || 1),
    donors: data.donations?.length || data.donorCount || 0,
    daysLeft: 30, // Default or calculated
    image: data.imageUrl || data.image || (data.media && data.media[0]) || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800',
    organizer: data.ngo?.name || data.organizer || 'BarakahAid',
    verified: true
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 font-sans pb-12">
        {/* Header / Breadcrumb */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link to="/campaigns" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors font-medium text-sm">
              <HiArrowLeft className="w-4 h-4" />
              Back to Campaign
            </Link>
            <div className="text-sm font-medium text-gray-900">
              Donating to <span className="text-primary-600">{campaign.title}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Donation Form */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* STEP 1: Amount */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-lg font-heading font-bold text-gray-900 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-600 text-white text-xs">1</span>
                    Choose Donation Amount
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 mb-6">
                    {presetAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleAmountSelect(amount)}
                        className={`relative py-4 px-2 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-1
                          ${selectedAmount === amount
                            ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-600'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:bg-gray-50'
                          }`}
                      >
                        <span className="text-lg font-bold">${amount}</span>
                        {selectedAmount === amount && (
                          <div className="absolute -top-2 -right-2 bg-primary-600 text-white rounded-full p-0.5 shadow-sm">
                            <HiCheckCircle className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-bold text-lg">$</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className={`w-full pl-10 pr-4 py-4 rounded-xl border-2 font-medium text-lg transition-colors focus:outline-none focus:ring-0
                        ${customAmount 
                          ? 'border-primary-600 bg-primary-50 text-primary-900' 
                          : 'border-gray-200 text-gray-900 focus:border-primary-500'
                        }`}
                    />
                  </div>

                  {/* Recurring Toggle */}
                  <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-4">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        id="recurring"
                        type="checkbox"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                      />
                    </div>
                    <label htmlFor="recurring" className="cursor-pointer">
                      <span className="block text-sm font-bold text-blue-900">Make this a monthly donation</span>
                      <span className="block text-sm text-blue-700 mt-0.5">
                        Monthly gifts help us plan for the future and sustain our impact.
                      </span>
                    </label>
                  </div>
                </div>
              </section>

              {/* STEP 2: Donor Info */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-lg font-heading font-bold text-gray-900 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-600 text-white text-xs">2</span>
                    Your Information
                  </h2>
                </div>
                
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                        <HiUser className="text-gray-400" /> Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={donorInfo.name}
                        onChange={handleDonorInfoChange}
                        disabled={donorInfo.anonymous}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow disabled:bg-gray-100 disabled:text-gray-400"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                        <HiMail className="text-gray-400" /> Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={donorInfo.email}
                        onChange={handleDonorInfoChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <HiPhone className="text-gray-400" /> Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={donorInfo.phone}
                      onChange={handleDonorInfoChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input 
                        type="checkbox" 
                        name="anonymous" 
                        id="anonymous" 
                        checked={donorInfo.anonymous}
                        onChange={handleDonorInfoChange}
                        className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-5"
                        style={{ right: donorInfo.anonymous ? '0' : 'auto', left: donorInfo.anonymous ? 'auto' : '0' }}
                      />
                      <label 
                        htmlFor="anonymous" 
                        className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${donorInfo.anonymous ? 'bg-primary-600' : 'bg-gray-300'}`}
                      ></label>
                    </div>
                    <label htmlFor="anonymous" className="text-sm text-gray-700 cursor-pointer select-none">
                      Make my donation anonymous
                    </label>
                  </div>
                </div>
              </section>

              {/* STEP 3: Payment */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-lg font-heading font-bold text-gray-900 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-600 text-white text-xs">3</span>
                    Payment Details
                  </h2>
                </div>

                <div className="p-6">
                  {/* Payment Method Tabs */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <PaymentMethodTab
                      id="stripe"
                      label="Card"
                      icon={<HiCreditCard className="w-6 h-6" />}
                      selected={selectedPaymentGateway === 'stripe'}
                      onClick={() => setSelectedPaymentGateway('stripe')}
                    />
                    <PaymentMethodTab
                      id="paypal"
                      label="PayPal"
                      icon={<SiPaypal className="w-5 h-5" />}
                      selected={selectedPaymentGateway === 'paypal'}
                      onClick={() => setSelectedPaymentGateway('paypal')}
                    />
                    <PaymentMethodTab
                      id="googlepay"
                      label="Google Pay"
                      icon={<SiGooglepay className="w-6 h-6" />}
                      selected={selectedPaymentGateway === 'googlepay'}
                      onClick={() => setSelectedPaymentGateway('googlepay')}
                    />
                  </div>

                  {/* Active Payment Form */}
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 transition-all duration-300">
                    {selectedPaymentGateway === 'stripe' && (
                      <DemoPaymentForm
                        amount={getTotalAmount() * 100}
                        campaignId={campaign.id}
                        donorEmail={donorInfo.email}
                        donorName={donorInfo.name}
                        onSuccess={() => handleSuccess('Stripe', 'STR')}
                        onError={() => {}}
                      />
                    )}

                    {selectedPaymentGateway === 'paypal' && (
                      <PayPalDemoForm
                        amount={getTotalAmount() * 100}
                        campaignId={campaign.id}
                        donorEmail={donorInfo.email}
                        donorName={donorInfo.name}
                        onSuccess={() => handleSuccess('PayPal', 'PPL')}
                        onError={() => {}}
                      />
                    )}

                    {selectedPaymentGateway === 'googlepay' && (
                      <GooglePayDemoForm
                        amount={getTotalAmount() * 100}
                        campaignId={campaign.id}
                        donorEmail={donorInfo.email}
                        donorName={donorInfo.name}
                        onSuccess={() => handleSuccess('Google Pay', 'GPY')}
                        onError={() => {}}
                      />
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <HiShieldCheck className="w-4 h-4 text-green-600" />
                    <span>Payments are secure and encrypted</span>
                  </div>
                </div>
              </section>

            </div>

            {/* RIGHT COLUMN: Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                
                {/* Campaign Summary Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-bold text-lg leading-tight shadow-black drop-shadow-md">{campaign.title}</h3>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Raised: <span className="font-semibold text-gray-900">{formatCurrency(campaign.currentAmount)}</span></span>
                        <span className="text-gray-500">{Math.round((campaign.currentAmount / campaign.targetAmount) * 100)}%</span>
                      </div>
                      <ProgressBar value={campaign.currentAmount} max={campaign.targetAmount} height="h-2" />
                    </div>

                    {/* Donation Summary */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Donation Summary</h4>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 text-sm">Amount</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(getTotalAmount())}</span>
                      </div>
                      {isRecurring && (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600 text-sm">Frequency</span>
                          <span className="font-medium text-primary-600 text-sm">Monthly</span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 my-2 pt-2 flex justify-between items-center">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-xl text-primary-600">{formatCurrency(getTotalAmount())}</span>
                      </div>
                    </div>

                    {/* Impact Note */}
                    <div className="flex gap-3 items-start text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-100">
                      <HiHeart className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <p className="leading-snug">
                        Your <strong>{formatCurrency(getTotalAmount())}</strong> donation can provide essential food supplies for a family in need.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="flex justify-center gap-6 grayscale opacity-60">
                  {/* Placeholders for trust badges if needed */}
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      <DonationSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setSuccessData(null);
        }}
        campaign={successData?.campaign}
        amount={successData?.amount}
        donorName={successData?.donorName}
        paymentMethod={successData?.paymentMethod}
        transactionId={successData?.transactionId}
      />
    </>
  );
};

// Helper Component for Payment Tabs
const PaymentMethodTab = ({ id, label, icon, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-xl border-2 transition-all duration-200
      ${selected 
        ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm' 
        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
      }`}
  >
    <div className={`transition-transform duration-200 ${selected ? 'scale-110' : ''}`}>
      {icon}
    </div>
    <span className="text-xs font-bold">{label}</span>
    {selected && (
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-600"></div>
    )}
  </button>
);

export default Donate;
