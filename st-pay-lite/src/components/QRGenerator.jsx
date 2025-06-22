import { useState, useEffect } from 'react';
import QRCodeDisplay from './QRCodeDisplay';
import busRoutes from '../utils/busRoutes';

const QRGenerator = () => {
  const [selectedBus, setSelectedBus] = useState('BUS001-AT');
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('busRoutes:', busRoutes);
    if (!busRoutes || Object.keys(busRoutes).length === 0) {
      setError('No bus routes available. Please check busRoutes.js.');
    } else if (!busRoutes[selectedBus]) {
      setError(`Selected bus ${selectedBus} not found in busRoutes.`);
      setSelectedBus(Object.keys(busRoutes)[0] || 'BUS001-AT');
    }
  }, [selectedBus]);

  const currentUrl = window.location.href.split('?')[0];
  const qrUrl = `${currentUrl}?bus=${selectedBus}`;

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-xl font-bold mb-4">🚌 Bus QR Code Generator</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
      <h2 className="text-xl font-bold mb-4">🚌 Bus QR Code Generator</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Bus Route:</label>
        <select
          value={selectedBus}
          onChange={(e) => setSelectedBus(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          {Object.entries(busRoutes).map(([busId, busInfo]) => (
            <option key={busId} value={busId}>
              {busId}: {busInfo.busName} ({busInfo.direction})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">{busRoutes[selectedBus].busName}</h3>
        <p className="text-sm text-gray-600">
          Route: {busRoutes[selectedBus].route[0].name} →{' '}
          {busRoutes[selectedBus].route[busRoutes[selectedBus].route.length - 1].name}
        </p>
        <p className="text-sm text-gray-500 mt-1">Direction: {busRoutes[selectedBus].direction}</p>
      </div>

      <QRCodeDisplay value={qrUrl} size={200} />
      <p className="text-sm text-gray-500 mt-4">
        Display this QR code on {busRoutes[selectedBus].busName} for passenger ticket booking.
      </p>
    </div>
  );
};

export default QRGenerator;