import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import phonepeLogo from '../assets/images/phonepe-logo.png';
import googlepayLogo from '../assets/images/googlepay-logo.png';
import paytmLogo from '../assets/images/paytm-logo.png';
import amazonpayLogo from '../assets/images/amazonpay-logo.png';

const UPIPayment = ({ amount, ticketId, onPaymentInitiated, onCancel }) => {
  const [selectedUPI, setSelectedUPI] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [qrCode, setQRCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds

  const upiApps = [
    { id: 'phonepe', name: 'PhonePe', color: 'bg-purple-500', logo: phonepeLogo },
    { id: 'googlepay', name: 'Google Pay', color: 'bg-blue-500', logo: googlepayLogo },
    { id: 'paytm', name: 'Paytm', color: 'bg-blue-600', logo: paytmLogo },
    { id: 'amazonpay', name: 'Amazon Pay', color: 'bg-orange-500', logo: amazonpayLogo },
  ];

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          try {
            onPaymentInitiated(); // Auto-generate ticket after 15 seconds
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

  // Generate QR code
  useEffect(() => {
    const deepLink = generateUPIDeepLink();
    QRCode.toDataURL(deepLink, (err, url) => {
      if (!err) setQRCode(url);
      else setError('Failed to generate QR code');
    });
  }, [amount, ticketId]);

  const generateUPIDeepLink = () => {
    const merchantVPA = import.meta.env.VITE_MERCHANT_VPA || 'test@upi';
    const merchantName = 'Bus Ticketing App';
    const encodedMerchantName = encodeURIComponent(merchantName);
    const encodedTransactionNote = encodeURIComponent(`Ticket Payment ${ticketId}`);
    const amountStr = amount.toFixed(2);

    return `upi://pay?pa=${merchantVPA}&pn=${encodedMerchantName}&am=${amountStr}&cu=INR&tn=${encodedTransactionNote}&tr=${ticketId}`;
  };

  const handlePayment = () => {
    if (!selectedUPI) {
      setError('Please select a UPI app');
      return;
    }

    if (!import.meta.env.VITE_MERCHANT_VPA) {
      setError('Merchant VPA not configured. Please contact support.');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const deepLink = generateUPIDeepLink();
      window.location.href = deepLink;
      setTimeout(() => {
        setProcessing(false);
      }, 1000);
    } catch (err) {
      setError('Failed to initiate payment. Please try again.');
      setProcessing(false);
    }
  };

  // Format time as MM:SS
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

      {qrCode && (
        <div className="text-center mb-4">
          <p className="text-gray-600 mb-2">Scan to pay on desktop</p>
          <img src={qrCode} alt="UPI QR Code" className="mx-auto h-32" />
        </div>
      )}

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