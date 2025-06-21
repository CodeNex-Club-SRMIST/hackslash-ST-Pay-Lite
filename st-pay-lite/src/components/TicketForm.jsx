import { useState } from 'react';
import busRoutes from '../utils/busRoutes';
import firebaseService from '../utils/firebase';
import generateTicketId from '../utils/generateTicketId';
import UPIPayment from './UPIPayment';

const TicketForm = ({ onTicketSuccess, busId }) => {
  const [count, setCount] = useState(1);
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [error, setError] = useState('');
  const [ticketId, setTicketId] = useState('');

  const busInfo = busRoutes[busId] || busRoutes['BUS001-AB'];
  const stations = busInfo.route;

  const calculateDistance = () => {
    if (!fromStation || !toStation) return 0;

    const fromIndex = stations.findIndex((s) => s.name === fromStation);
    const toIndex = stations.findIndex((s) => s.name === toStation);

    if (fromIndex >= toIndex) return 0;

    return stations[toIndex].distance - stations[fromIndex].distance;
  };

  const distance = calculateDistance();
  const totalAmount = distance * count * 2;

  const handleSubmit = () => {
    setError('');

    if (!fromStation || !toStation) {
      setError('Please select both starting and destination stations');
      return;
    }

    if (fromStation === toStation) {
      setError('Starting and destination stations cannot be the same');
      return;
    }

    const fromIndex = stations.findIndex((s) => s.name === fromStation);
    const toIndex = stations.findIndex((s) => s.name === toStation);

    if (fromIndex >= toIndex) {
      setError('Destination must be ahead of starting station');
      return;
    }

    if (distance === 0) {
      setError('Invalid route selected');
      return;
    }

    const newTicketId = generateTicketId();
    setTicketId(newTicketId);
    setShowPayment(true);
  };

  const handlePaymentInitiated = async () => {
    try {
      setError('');
      const ticketData = {
        ticketId,
        busId,
        busName: busInfo.busName,
        direction: busInfo.direction,
        fromStation,
        toStation,
        distance,
        passengerCount: count,
        amount: totalAmount,
        verified: false,
        paymentStatus: 'pending',
        paymentVerified: false,
        timestamp: new Date().toISOString(),
        bookingTime: new Date().toLocaleString(),
      };

      await firebaseService.addTicket(ticketData);

      onTicketSuccess({
        ...ticketData,
        note: 'Ticket generated. Payment verification required by conductor.',
      });

      // Reset form state
      setShowPayment(false);
      setTicketId('');
      setFromStation('');
      setToStation('');
      setCount(1);
    } catch (err) {
      setError(err.message || 'Failed to generate ticket. Please try again.');
      setShowPayment(false);
    }
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setTicketId('');
    setError('');
  };

  if (showPayment) {
    return (
      <UPIPayment
        amount={totalAmount}
        ticketId={ticketId}
        onPaymentInitiated={handlePaymentInitiated}
        onCancel={handlePaymentCancel}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-2 text-center">Book Your Ticket</h2>
      <div className="text-center mb-4">
        <p className="text-gray-600">{busInfo.busName} ({busId})</p>
        <p className="text-sm text-blue-600 font-medium">Direction: {busInfo.direction}</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From Station:</label>
          <select
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select starting station</option>
            {stations.slice(0, -1).map((station) => (
              <option key={station.name} value={station.name}>
                {station.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">To Station:</label>
          <select
            value={toStation}
            onChange={(e) => setToStation(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select destination station</option>
            {stations.slice(1).map((station) => (
              <option key={station.name} value={station.name}>
                {station.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Passengers:
          </label>
          <input
            type="number"
            value={count}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 1 && value <= 4) setCount(value);
            }}
            min={1}
            max={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">Maximum 4 passengers per ticket</p>
        </div>

        {distance > 0 && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">Distance:</span>
              <span className="font-semibold">{distance} km</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">Price per km per person:</span>
              <span className="font-semibold">₹2</span>
            </div>
            <div className="flex justify-between items-center mt-2 text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-blue-600">₹{totalAmount}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!fromStation || !toStation || distance === 0 || count < 1 || count > 4}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default TicketForm;