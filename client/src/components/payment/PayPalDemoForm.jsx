// PayPal Demo Payment Component
import React, { useState } from 'react';
import { HiCheck, HiX, HiExclamation } from 'react-icons/hi';
import { SiPaypal } from 'react-icons/si';

const PayPalDemoForm = ({ amount, campaignId, donorEmail, donorName, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    email: donorEmail || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const testAccounts = {
    'demo@example.com': { password: 'demo123', status: 'success' },
    'buyer@sandbox.com': { password: 'sandbox123', status: 'success' },
    'fail@test.com': { password: 'test123', status: 'declined' },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const testAccount = testAccounts[formData.email];

      if (!testAccount) {
        throw new Error('Please use a test account email');
      }

      if (testAccount.password !== formData.password) {
        throw new Error('Invalid password for this test account');
      }

      // Simulate PayPal login and payment (reduced for faster UX)
      await new Promise(resolve => setTimeout(resolve, 500));

      if (testAccount.status === 'declined') {
        setMessage('❌ Payment Failed - Use demo@example.com for success');
        setMessageType('error');
        if (onError) onError('Payment failed');
      } else {
        setMessage('✅ Payment Successful! Thank you for your donation via PayPal.');
        setMessageType('success');
        if (onSuccess) {
          onSuccess({
            paymentId: `paypal_${Date.now()}`,
            amount: amount,
            status: 'succeeded',
            method: 'paypal',
            timestamp: new Date().toISOString(),
          });
        }
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setMessageType('error');
      if (onError) onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="mb-6">
        <h3 className="text-lg font-heading text-secondary-900 flex items-center gap-2 mb-2">
          <SiPaypal className="text-blue-600" /> PayPal Demo
        </h3>
        <p className="text-sm text-secondary-600 font-sans">
          ⚠️ This is a TEST/DEMO environment - No real charges will occur
        </p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-card">
        <p className="text-sm font-semibold text-blue-900 mb-3 font-sans flex items-center gap-2">
          <HiExclamation className="w-4 h-4" /> Test Accounts:
        </p>
        <ul className="text-xs space-y-2 text-blue-800 font-sans">
          <li className="flex items-center gap-2">
            <span className="text-success-600 font-bold">✓</span> 
            <code className="bg-white px-2 py-1 rounded border border-blue-200 font-mono text-blue-700">demo@example.com</code>
            <span className="text-secondary-700">/ demo123 (Success)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-success-600 font-bold">✓</span> 
            <code className="bg-white px-2 py-1 rounded border border-blue-200 font-mono text-blue-700">buyer@sandbox.com</code>
            <span className="text-secondary-700">/ sandbox123 (Success)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-danger-600 font-bold">✕</span> 
            <code className="bg-white px-2 py-1 rounded border border-blue-200 font-mono text-blue-700">fail@test.com</code>
            <span className="text-secondary-700">/ test123 (Declined)</span>
          </li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-secondary-900 mb-2 font-sans">
            PayPal Email
          </label>
          <input
            type="email"
            placeholder="demo@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border-2 border-secondary-300 rounded-card bg-white text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-600 transition-all font-sans"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-secondary-900 mb-2 font-sans">
            Password
          </label>
          <input
            type="password"
            placeholder="Your PayPal password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border-2 border-secondary-300 rounded-card bg-white text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-600 transition-all font-sans"
            required
          />
        </div>

        {/* Amount Display */}
        <div className="pt-5 border-t-2 border-secondary-200">
          <div className="flex justify-between mb-5">
            <span className="text-secondary-700 font-semibold font-sans">Total Amount:</span>
            <span className="text-3xl font-bold text-primary-600 font-heading">${(amount / 100).toFixed(2)}</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.email || !formData.password}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-400 text-white font-semibold py-3 rounded-card transition duration-200 flex items-center justify-center gap-2 font-sans hover:shadow-card disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <SiPaypal className="w-5 h-5" />
                <span>Pay with PayPal</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Message Display */}
      {message && (
        <div className={`mt-6 p-4 rounded-card border-2 flex items-start gap-3 animate-in fade-in ${
          messageType === 'success' ? 'bg-success-50 border-success-200' :
          messageType === 'error' ? 'bg-danger-50 border-danger-200' :
          'bg-warning-50 border-warning-200'
        }`}>
          {messageType === 'success' && <HiCheck className="text-success-600 text-xl flex-shrink-0 mt-0.5" />}
          {messageType === 'error' && <HiX className="text-danger-600 text-xl flex-shrink-0 mt-0.5" />}
          {messageType === 'info' && <HiExclamation className="text-warning-600 text-xl flex-shrink-0 mt-0.5" />}
          <p className={`text-sm font-sans ${
            messageType === 'success' ? 'text-success-800' :
            messageType === 'error' ? 'text-danger-800' :
            'text-warning-800'
          }`}>
            {message}
          </p>
        </div>
      )}

      <p className="text-xs text-secondary-500 text-center mt-6 font-sans">
        🔒 This demo is secure and for testing purposes only
      </p>
    </div>
  );
};

export default PayPalDemoForm;
