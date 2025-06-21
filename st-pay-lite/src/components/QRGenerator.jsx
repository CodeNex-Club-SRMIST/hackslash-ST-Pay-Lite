import { useState } from 'react';
import QRCodeDisplay from './QRCodeDisplay';
import busRoutes from '../utils/busRoutes';

const QRGenerator = () => {
  const [selectedBus, setSelectedBus] = useState('BUS001-AB');

  const currentUrl = window.location.href.split('?')[0];
  const qrUrl = `${currentUrl}?bus=${selectedBus}`;

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
      <h2 className="text-xl font-bold mb-4">🚌 Bus QR Code Generator</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Bus:</label>
        <select
          value={selectedBus}
          onChange={(e) => setSelectedBus(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(busRoutes).map(([busId, busInfo]) => (
            <option key={busId} value={busId}>
              {busId} - {busInfo.busName}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">{busRoutes[selectedBus].busName}</h3>
        <p className="text-sm text-gray-600">
          Route: {busRoutes[selectedBus].route[0].name} →{' '}
          {busRoutes[selectedBus].route[busRoutes[selectedBus].route.length - 1].name}
        </p>
      </div>

      <QRCodeDisplay value={qrUrl} size={200} />
      <p className="text-sm text-gray-500 mt-4">Display this QR code on {busRoutes[selectedBus].busName}</p>
    </div>
  );
};

export default QRGenerator;