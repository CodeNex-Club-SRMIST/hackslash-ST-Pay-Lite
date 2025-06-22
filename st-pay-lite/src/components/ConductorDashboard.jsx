import { useState, useEffect } from 'react';
import firebaseService from '../utils/firebase';

const ConductorDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchId, setSearchId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const allTickets = await firebaseService.getTickets();
      // Deduplicate tickets by ticketId
      const uniqueTickets = Array.from(
        new Map(allTickets.map((ticket) => [ticket.ticketId, ticket])).values()
      );
      console.log('Fetched tickets:', uniqueTickets);
      setTickets(uniqueTickets);
      setError('');
    } catch (error) {
      console.error('Error loading tickets:', error);
      setError('Failed to load tickets: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (ticket) => {
    try {
      setLoading(true);
      setError('');
      console.log('Verifying ticket:', ticket.ticketId, 'Doc ID:', ticket.id);
      await firebaseService.updateTicket(ticket.ticketId, {
        verified: true,
        paymentVerified: true,
        verifiedTime: new Date().toLocaleString(),
      });
      // Update local state to move ticket to Verified
      setTickets((prevTickets) =>
        prevTickets.map((t) =>
          t.ticketId === ticket.ticketId
            ? { ...t, verified: true, paymentVerified: true, verifiedTime: new Date().toLocaleString() }
            : t
        )
      );
      console.log('Ticket verified:', ticket.ticketId);
    } catch (error) {
      console.error('Error verifying ticket:', error);
      setError('Error verifying ticket: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const pendingTickets = tickets.filter((ticket) => !ticket.verified);
  const verifiedTickets = tickets.filter((ticket) => ticket.verified);
  const filteredTickets = activeTab === 'pending' ? pendingTickets : verifiedTickets;

  const displayTickets = searchId
    ? filteredTickets.filter((ticket) => ticket.ticketId.includes(searchId))
    : filteredTickets;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading tickets...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">🧾 Conductor Dashboard</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Search by Ticket ID..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'pending' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending Tickets ({pendingTickets.length})
        </button>
        <button
          onClick={() => setActiveTab('verified')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'verified' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Verified Tickets ({verifiedTickets.length})
        </button>
      </div>

      <div className="space-y-4">
        {displayTickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📋</div>
            <p>No {activeTab} tickets found</p>
            {searchId && <p className="text-sm">Try searching with a different ticket ID</p>}
          </div>
        ) : (
          displayTickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`border rounded-lg p-4 ${
                ticket.verified ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl font-bold text-blue-600">{ticket.ticketId}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ticket.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {ticket.verified ? '✅ Verified' : '⏳ Pending'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Bus:</span>
                      <span className="ml-2 font-semibold">
                        {ticket.busName} ({ticket.busId})
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Route:</span>
                      <span className="ml-2">
                        {ticket.fromStation} → {ticket.toStation}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Distance:</span>
                      <span className="ml-2 font-semibold">{ticket.distance} km</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Passengers:</span>
                      <span className="ml-2 font-semibold">{ticket.passengerCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <span className="ml-2 font-semibold">₹{ticket.amount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Booked:</span>
                      <span className="ml-2">{ticket.bookingTime}</span>
                    </div>
                    {ticket.verified && ticket.verifiedTime && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Verified:</span>
                        <span className="ml-2">{ticket.verifiedTime}</span>
                      </div>
                    )}
                  </div>
                </div>

                {!ticket.verified && (
                  <button
                    onClick={() => handleVerify(ticket)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    Verify
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{tickets.length}</div>
          <div className="text-sm text-gray-600">Total Tickets</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{pendingTickets.length}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{verifiedTickets.length}</div>
          <div className="text-sm text-gray-600">Verified</div>
        </div>
      </div>
    </div>
  );
};

export default ConductorDashboard;