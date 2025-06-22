import { useState, useEffect } from 'react';
import axios from 'axios';
import phonepeLogo from '../assets/images/phonepe-logo.png';
import googlepayLogo from '../assets/images/googlepay-logo.png';
import paytmLogo from '../assets/images/paytm-logo.png';
import amazonpayLogo from '../assets/images/amazonpay-logo.png';

const UPIPayment = ({ amount, ticketId, onPaymentInitiated, onPaymentSuccess, onCancel }) => {
  const [selectedUPI, setSelectedUPI] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(15);

  const upiApps = [
    { id: 'phonepe', name: 'PhonePe', color: 'bg-purple-500', logo: phonepeLogo, packageName: 'com.phonepe.app' },
    { id: 'googlepay', name: 'Google Pay', color: 'bg-blue-500', logo: googlepayLogo, packageName: 'com.google.android.apps.nbu.paisa.user' },
    { id: 'paytm', name: 'Paytm', color: 'bg-blue-600', logo: paytmLogo, packageName: 'net.one97.paytm' },
    { id: 'amazonpay', name: 'Amazon Pay', color: 'bg-orange-500', logo: amazonpayLogo, packageName: 'in.amazon.mShop.android.shopping' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          try {
            onPaymentInitiated();
          } catch (err) {
            setError('Failed to generate ticket automatically');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onPaymentInitiated]);

  const handlePayment = async () => {
    if (!selectedUPI) {
      setError('Please select a UPI app');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const { data } = await axios.post(
        'http://localhost:5001/st-pay-90643/us-central1/createOrder',
        { amount }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'ST Pay Lite',
        description: `Ticket Payment ${ticketId}`,
        image: '/vite.svg',
        handler: function (response) {
          setProcessing(false);
          onPaymentSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            setError('Payment cancelled or failed');
          },
        },
        prefill: {
          name: 'Passenger',
          email: 'passenger@example.com',
          contact: '9999999999',
          vpa: 'success@razorpay',
        },
        theme: {
          color: '#3B82F6',
        },
        method: {
          upi: true,
        },
        upi: {
          flow: 'intent',
          packageName: upiApps.find((app) => app.id === selectedUPI)?.packageName || '',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.error || 'Payment initiation failed');
      setProcessing(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 text-center">💳 UPI Payment</h3>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="text-center mb-6">
        <p className="text-2xl font-bold text-green-600">₹{amount}</p>
        <p className="text-gray-600">Select your preferred UPI app</p>
        <p className="text-sm text-gray-500 mt-2">
          Ticket will be generated automatically in {formatTime(timeLeft)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {upiApps.map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedUPI(app.id)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedUPI === app.id
                ? `${app.color} text-white border-transparent`
                : 'border-gray-200 hover:border-gray-300'
            }`}
            disabled={processing}
          >
            <div className="text-center">
              <img
                src={app.logo}
                alt={`${app.name} logo`}
                className="mx-auto mb-1 h-8 object-contain"
              />
              <div className="text-sm font-medium">{app.name}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <button
          onClick={handlePayment}
          disabled={!selectedUPI || processing}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {processing ? 'Processing...' : `Pay ₹${amount}`}
        </button>

        <button
          onClick={onCancel}
          disabled={processing}
          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UPIPayment;