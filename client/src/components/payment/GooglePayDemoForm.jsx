// Google Pay Demo Payment Component
import React, { useState } from 'react';
import { HiCheck, HiX, HiExclamation, HiUser } from 'react-icons/hi';
import { SiGooglepay } from 'react-icons/si';

const GooglePayDemoForm = ({ amount, campaignId, donorEmail, donorName, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    googleEmail: donorEmail || '',
    phone: '',
    otp: '',
  });
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Confirm
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      // Generate demo OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(otp);
      setMessage(`📱 OTP sent to ${formData.googleEmail}`);
      setMessageType('info');
      setStep(2);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Demo OTP for testing: 123456
      if (formData.otp !== '123456' && formData.otp !== generatedOTP) {
        throw new Error('Invalid OTP. Use 123456 or the generated code');
      }

      await new Promise(resolve => setTimeout(resolve, 300));
      setMessage('✅ Identity verified');
      setMessageType('info');
      setStep(3);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      setMessage('✅ Payment Successful! Thank you for your donation via Google Pay.');
      setMessageType('success');
      if (onSuccess) {
        onSuccess({
          paymentId: `googlepay_${Date.now()}`,
          amount: amount,
          status: 'succeeded',
          method: 'googlepay',
          timestamp: new Date().toISOString(),
        });
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
          <SiGooglepay className="text-blue-500" /> Google Pay Demo
        </h3>
        <p className="text-sm text-secondary-600 font-sans">
          ⚠️ This is a TEST/DEMO environment - No real charges will occur
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex-1 text-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto font-semibold text-white font-sans ${
            step >= 1 ? 'bg-primary-600' : 'bg-secondary-300'
          }`}>
            1
          </div>
          <p className="text-xs mt-2 text-secondary-600 font-sans">Email</p>
        </div>
        <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary-600' : 'bg-secondary-300'}`}></div>
        <div className="flex-1 text-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto font-semibold text-white font-sans ${
            step >= 2 ? 'bg-primary-600' : 'bg-secondary-300'
          }`}>
            2
          </div>
          <p className="text-xs mt-2 text-secondary-600 font-sans">Verify</p>
        </div>
        <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-primary-600' : 'bg-secondary-300'}`}></div>
        <div className="flex-1 text-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto font-semibold text-white font-sans ${
            step >= 3 ? 'bg-primary-600' : 'bg-secondary-300'
          }`}>
            3
          </div>
          <p className="text-xs mt-2 text-secondary-600 font-sans">Confirm</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-card">
        <p className="text-sm font-semibold text-blue-900 mb-3 font-sans flex items-center gap-2">
          <HiExclamation className="w-4 h-4" /> Test OTP:
        </p>
        <p className="text-xs text-blue-800 font-sans">
          Enter <code className="bg-white px-2 py-1 rounded border border-blue-200 font-mono">123456</code> at the OTP verification step
        </p>
      </div>

      {/* Step 1: Email */}
      {step === 1 && (
        <form onSubmit={handleEmailSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-secondary-900 mb-2 font-sans">
              Google Account Email
            </label>
            <input
              type="email"
              placeholder="your.email@gmail.com"
              value={formData.googleEmail}
              onChange={(e) => setFormData({ ...formData, googleEmail: e.target.value })}
              className="w-full px-4 py-3 border-2 border-secondary-300 rounded-card bg-white text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-600 transition-all font-sans"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.googleEmail}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-400 text-white font-semibold py-3 rounded-card transition duration-200 flex items-center justify-center gap-2 font-sans hover:shadow-card disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Sending OTP...</span>
              </>
            ) : (
              <>
                <SiGooglepay className="w-5 h-5" />
                <span>Continue</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Step 2: OTP Verification */}
      {step === 2 && (
        <form onSubmit={handleOTPSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-secondary-900 mb-2 font-sans">
              Enter OTP
            </label>
            <input
              type="text"
              placeholder="123456"
              value={formData.otp}
              onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              maxLength="6"
              className="w-full px-4 py-3 border-2 border-secondary-300 rounded-card bg-white text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-600 transition-all font-sans text-center text-lg tracking-widest"
              required
            />
            <p className="text-xs text-secondary-600 mt-2 font-sans text-center">
              OTP has been sent to {formData.googleEmail}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || formData.otp.length !== 6}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-400 text-white font-semibold py-3 rounded-card transition duration-200 flex items-center justify-center gap-2 font-sans hover:shadow-card disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Verifying...</span>
              </>
            ) : (
              <span>Verify OTP</span>
            )}
          </button>
        </form>
      )}

      {/* Step 3: Confirm Payment */}
      {step === 3 && (
        <form onSubmit={handlePayment} className="space-y-5">
          <div className="p-4 bg-primary-50 border-2 border-primary-200 rounded-card">
            <div className="flex items-start gap-3 mb-4">
              <HiUser className="w-5 h-5 text-primary-700 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-secondary-900">Payment Details</p>
                <p className="text-xs text-secondary-600 mt-1">Email: {formData.googleEmail}</p>
              </div>
            </div>

            <div className="border-t border-primary-200 pt-4">
              <div className="flex justify-between mb-3">
                <span className="text-secondary-700 font-semibold font-sans">Amount:</span>
                <span className="text-2xl font-bold text-primary-600 font-heading">${(amount / 100).toFixed(2)}</span>
              </div>
              <p className="text-xs text-secondary-600 font-sans">This is a demo transaction. No real charges will occur.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-400 text-white font-semibold py-3 rounded-card transition duration-200 flex items-center justify-center gap-2 font-sans hover:shadow-card disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <HiCheck className="w-5 h-5" />
                <span>Confirm Payment</span>
              </>
            )}
          </button>
        </form>
      )}

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

export default GooglePayDemoForm;
