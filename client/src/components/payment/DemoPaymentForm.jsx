// Payment Component for Demo/Testing
import React, { useState } from 'react';
import { HiCreditCard, HiCheck, HiX, HiExclamation } from 'react-icons/hi';

const DemoPaymentForm = ({ amount, campaignId, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'

  const testCards = {
    '4242424242424242': { status: 'success', message: 'Payment will succeed' },
    '4000000000000002': { status: 'declined', message: 'Payment will be declined' },
    '4000002500003155': { status: 'auth', message: 'Requires 3D Secure authentication' },
  };

  const handleCardChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    setFormData({ ...formData, cardNumber: formatted });

    // Show test card info
    if (testCards[value]) {
      const cardInfo = testCards[value];
      setMessage(`✓ Test Card: ${cardInfo.message}`);
      setMessageType('info');
    } else if (value.length >= 4) {
      const firstFour = value.substring(0, 4);
      const known = Object.keys(testCards).find(card => card.startsWith(firstFour));
      if (known) {
        setMessage('✓ Recognized test card');
        setMessageType('info');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Demo mode - simulate payment
      const cardNumber = formData.cardNumber.replace(/\s/g, '');
      const testCard = testCards[cardNumber];

      if (!testCard) {
        throw new Error('Please use a test card number');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (testCard.status === 'declined') {
        setMessage('❌ Payment Declined - Use 4242 4242 4242 4242 for success');
        setMessageType('error');
        if (onError) onError('Card declined');
      } else if (testCard.status === 'auth') {
        setMessage('⚠️ This test card requires 3D Secure - use another test card');
        setMessageType('error');
        if (onError) onError('3D Secure required');
      } else {
        setMessage('✅ Payment Successful! Thank you for your donation.');
        setMessageType('success');
        if (onSuccess) {
          onSuccess({
            paymentId: `demo_${Date.now()}`,
            amount: amount,
            status: 'succeeded',
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
    <div className="w-full bg-white">{/* Removed max-w-md to allow full width */}
      <div className="mb-6">
        <h3 className="text-lg font-heading text-secondary-900 flex items-center gap-2 mb-2">
          <HiCreditCard className="text-primary-600" /> Demo Payment
        </h3>
        <p className="text-sm text-secondary-600 font-sans">
          ⚠️ This is a TEST/DEMO environment - No real charges will occur
        </p>
      </div>

      <div className="mb-6 p-4 bg-primary-50 border-2 border-primary-200 rounded-card">
        <p className="text-sm font-semibold text-primary-900 mb-3 font-sans flex items-center gap-2">
          <HiCreditCard className="w-4 h-4" /> Test Card Numbers:
        </p>
        <ul className="text-xs space-y-2 text-primary-800 font-sans">
          <li className="flex items-center gap-2">
            <span className="text-success-600 font-bold">✓</span> 
            <code className="bg-white px-2 py-1 rounded border border-primary-200 font-mono text-primary-700">4242 4242 4242 4242</code> 
            <span className="text-secondary-700">- Success</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-danger-600 font-bold">✕</span> 
            <code className="bg-white px-2 py-1 rounded border border-primary-200 font-mono text-primary-700">4000 0000 0000 0002</code> 
            <span className="text-secondary-700">- Declined</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-warning-600 font-bold">⚠</span> 
            <code className="bg-white px-2 py-1 rounded border border-primary-200 font-mono text-primary-700">4000 0025 0000 3155</code> 
            <span className="text-secondary-700">- 3D Secure</span>
          </li>
        </ul>
        <p className="text-xs text-primary-700 mt-3 font-sans">
          ℹ️ Any future expiry date | Any 3-digit CVC
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-semibold text-secondary-900 mb-2 font-sans">
            Cardholder Name
          </label>
          <input
            type="text"
            placeholder="John Donor"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border-2 border-secondary-300 rounded-card bg-white text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-600 transition-all font-sans"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-secondary-900 mb-2 font-sans">
            Email Address
          </label>
          <input
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border-2 border-secondary-300 rounded-card bg-white text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-600 transition-all font-sans"
            required
          />
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-semibold text-secondary-900 mb-2 font-sans">
            Card Number
          </label>
          <input
            type="text"
            placeholder="4242 4242 4242 4242"
            value={formData.cardNumber}
            onChange={handleCardChange}
            maxLength="19"
            className="w-full px-4 py-3 border-2 border-secondary-300 rounded-card bg-white text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-600 transition-all font-mono font-sans"
            required
          />
        </div>

        {/* Expiry Date & CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-secondary-900 mb-2 font-sans">
              Expiry Date
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              maxLength="5"
              className="w-full px-4 py-3 border-2 border-secondary-300 rounded-card bg-white text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-600 transition-all font-sans"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-secondary-900 mb-2 font-sans">
              CVC
            </label>
            <input
              type="text"
              placeholder="123"
              value={formData.cvc}
              onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
              maxLength="3"
              className="w-full px-4 py-3 border-2 border-secondary-300 rounded-card bg-white text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-600 transition-all font-sans"
              required
            />
          </div>
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
            disabled={loading || !formData.cardNumber || !formData.name || !formData.email}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-400 text-white font-semibold py-3 rounded-card transition duration-200 flex items-center justify-center gap-2 font-sans hover:shadow-card disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <HiCreditCard className="w-5 h-5" />
                <span>Pay ${(amount / 100).toFixed(2)}</span>
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

export default DemoPaymentForm;
