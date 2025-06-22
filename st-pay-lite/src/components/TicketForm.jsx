import { useState, useEffect } from 'react';
import busRoutes from '../utils/busRoutes';
import firebaseService from '../utils/firebase';
import generateTicketId from '../utils/generateTicketId';
import UPIPayment from './UPIPayment';

const TicketForm = ({ onTicketSuccess, busId, fromQR }) => {
  const [count, setCount] = useState(1);
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [error, setError] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [ticketDocId, setTicketDocId] = useState('');
  const [ticketData, setTicketData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const busInfo = busRoutes[busId] || busRoutes['BUS001-AT'];
  const stations = busInfo?.route || [];

  useEffect(() => {
    console.log('TicketForm busId:', busId);
    if (!busRoutes[busId] && busId !== 'BUS001-AT') {
      setError(`Invalid bus ID: ${busId}. Defaulting to BUS001-AT.`);
    }
  }, [busId]);

  const calculateDistance = () => {
    if (!fromStation || !toStation) return 0;
    const fromIndex = stations.findIndex((s) => s.name === fromStation);
    const toIndex = stations.findIndex((s) => s.name === toStation);
    if (fromIndex >= toIndex) return 0;
    return stations[toIndex].distance - stations[fromIndex].distance;
  };

  const distance = calculateDistance();
  const totalAmount = distance * count * 2;

  const createTicket = async (status, paymentDetails = {}) => {
    try {
      const ticket = {
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
        paymentStatus: status,
        paymentVerified: status === 'completed',
        timestamp: new Date().toISOString(),
        bookingTime: new Date().toLocaleString(),
        ...paymentDetails,
      };
      console.log('Creating ticket with ticketId:', ticketId);
      const createdTicket = await firebaseService.addTicket(ticket);
      setTicketDocId(createdTicket.id);
      return createdTicket;
    } catch (error) {
      console.error('Error in createTicket:', error);
      throw error;
    }
  };

  const updateTicket = async (status, paymentDetails = {}) => {
    try {
      const updates = {
        paymentStatus: status,
        paymentVerified: status === 'completed',
        ...paymentDetails,
        updatedAt: new Date().toISOString(),
      };
      console.log('Updating ticket with ticketId:', ticketId);
      return await firebaseService.updateTicket(ticketId, updates);
    } catch (error) {
      console.error('Error in updateTicket:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      if (!fromStation || !toStation) {
        throw new Error('Please select both starting and destination stations');
      }
      if (fromStation === toStation) {
        throw new Error('Starting and destination stations cannot be the same');
      }
      const fromIndex = stations.findIndex((s) => s.name === fromStation);
      const toIndex = stations.findIndex((s) => s.name === toStation);
      if (fromIndex >= toIndex) {
        throw new Error('Destination must be ahead of starting station');
      }
      if (distance === 0) {
        throw new Error('Invalid route selected');
      }
      const newTicketId = await generateTicketId();
      console.log('Generated ticketId:', newTicketId);
      if (typeof newTicketId !== 'string') {
        throw new Error(`Invalid ticketId generated: ${typeof newTicketId}`);
      }
      setTicketId(newTicketId);
      setShowPayment(true);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message || 'Failed to generate unique 4-digit ticket ID. Please try again or clear old tickets.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentInitiated = async () => {
    try {
      setError('');
      const ticket = await createTicket('pending');
      setTicketData(ticket);
      onTicketSuccess({
        ...ticket,
        note: 'Ticket generated. Payment verification required by conductor.',
      });
      setShowPayment(false);
    } catch (err) {
      console.error('Error in handlePaymentInitiated:', err);
      setError(err.message || 'Failed to generate ticket. Please try again.');
      setShowPayment(false);
    }
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      setError('');
      let ticket;
      if (ticketDocId) {
        ticket = await updateTicket('completed', {
          paymentId: paymentDetails.paymentId,
          orderId: paymentDetails.orderId,
        });
      } else {
        ticket = await createTicket('completed', {
          paymentId: paymentDetails.paymentId,
          orderId: paymentDetails.orderId,
        });
      }
      setTicketData(ticket);
      onTicketSuccess({
        ...ticket,
        note: 'Payment successful. Ticket generated.',
      });
      setShowPayment(false);
    } catch (err) {
      console.error('Error in handlePaymentSuccess:', err);
      setError(err.message || 'Failed to save payment details.');
      setShowPayment(false);
    }
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setTicketId('');
    setTicketDocId('');
    setError('');
    setTicketData(null);
  };

  const handleDownloadTicket = () => {
    if (!ticketData) return;
    const ticketText = `
Ticket ID: ${ticketData.ticketId}
Bus: ${ticketData.busName} (${ticketData.busId})
From: ${ticketData.fromStation}
To: ${ticketData.toStation}
Distance: ${ticketData.distance} km
Passengers: ${ticketData.passengerCount}
Amount: ₹${ticketData.amount}
Status: ${ticketData.paymentStatus}
Booking Time: ${ticketData.bookingTime}
    `.trim();
    const blob = new Blob([ticketText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket_${ticketData.ticketId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!busInfo) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Book Your Ticket</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: Invalid bus configuration. Please select a valid bus route.
        </div>
      </div>
    );
  }

  if (ticketData) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Ticket Details</h2>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {ticketData.paymentStatus === 'completed'
            ? 'Payment successful. Ticket generated.'
            : 'Ticket generated. Payment verification required by conductor.'}
        </div>
        <div className="space-y-2 text-sm">
          <p><strong>Ticket ID:</strong> {ticketData.ticketId}</p>
          <p><strong>Bus:</strong> {ticketData.busName} ({ticketData.busId})</p>
          <p><strong>From:</strong> {ticketData.fromStation}</p>
          <p><strong>To:</strong> {ticketData.toStation}</p>
          <p><strong>Distance:</strong> {ticketData.distance} km</p>
          <p><strong>Passengers:</strong> {ticketData.passengerCount}</p>
          <p><strong>Amount:</strong> ₹{ticketData.amount}</p>
          <p><strong>Status:</strong> {ticketData.paymentStatus}</p>
          <p><strong>Booking Time:</strong> {ticketData.bookingTime}</p>
        </div>
        <button
          onClick={handleDownloadTicket}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg mt-4"
        >
          Download Ticket
        </button>
        <button
          onClick={() => {
            setTicketData(null);
            setFromStation('');
            setToStation('');
            setCount(1);
            setTicketId('');
            setTicketDocId('');
          }}
          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 rounded-lg mt-2"
        >
          Book Another Ticket
        </button>
      </div>
    );
  }

  if (showPayment) {
    return (
      <UPIPayment
        amount={totalAmount}
        ticketId={ticketId}
        onPaymentInitiated={handlePaymentInitiated}
        onPaymentSuccess={handlePaymentSuccess}
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
        {fromQR && <p className="text-sm text-green-600 mt-1">Scanned QR for Bus {busId}</p>}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Passengers:</label>
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
          <p className="text-sm text-gray-500 mt-1">Maximum 4 passengers</p>
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
          disabled={!fromStation || !toStation || distance === 0 || count < 1 || count > 4 || isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {isSubmitting ? 'Generating Ticket ID...' : 'Proceed to Payment'}
        </button>
      </div>
    </div>
  );
};

export default TicketForm;