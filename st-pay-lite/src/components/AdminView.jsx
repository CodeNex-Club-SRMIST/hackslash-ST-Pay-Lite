import { useState, useEffect } from 'react';
import QRGenerator from './QRGenerator';

const AdminView = () => {
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('AdminView mounted');
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-center mb-8">🔐 Admin Dashboard</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">🔐 Admin Dashboard</h1>
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-gray-600 mb-6">
            Generate QR codes for bus routes to enable passenger ticket booking.
          </p>
          <QRGenerator />
        </div>
      </div>
    </div>
  );
};

export default AdminView;