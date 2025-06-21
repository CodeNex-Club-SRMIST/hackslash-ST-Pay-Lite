import { useState, useEffect } from 'react';
import PassengerView from './components/PassengerView';
import ConductorView from './components/ConductorView';
import AdminView from './components/AdminView';

const App = () => {
  const [currentView, setCurrentView] = useState('passenger');

  const urlParams = new URLSearchParams(window.location.search);
  const busId = urlParams.get('bus') || 'BUS001-AB';
  const fromQR = urlParams.has('bus') || urlParams.has('ticket');

  useEffect(() => {
    if (fromQR) {
      setCurrentView('passenger');
    }
  }, [fromQR]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-8 py-4">
            <button
              onClick={() => setCurrentView('passenger')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                currentView === 'passenger' ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-50'
              }`}
            >
              🚌 Passenger
            </button>
            <button
              onClick={() => setCurrentView('conductor')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                currentView === 'conductor' ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-50'
              }`}
            >
              👨‍✈️ Conductor
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                currentView === 'admin' ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-50'
              }`}
            >
              🔐 Admin
            </button>
          </div>
        </div>
      </nav>

      {currentView === 'passenger' ? (
        <PassengerView fromQR={fromQR} busId={busId} />
      ) : currentView === 'conductor' ? (
        <ConductorView />
      ) : (
        <AdminView />
      )}
    </div>
  );
};

export default App;