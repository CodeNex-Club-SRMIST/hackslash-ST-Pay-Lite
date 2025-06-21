import downloadTicket from '../utils/downloadTicket';

const TicketSuccess = ({ ticketData, onNewTicket }) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 text-center">
        <div className="text-4xl mb-2"></div>
        <h2 className="text-2xl font-bold">Ticket Confirmed!</h2>
        <p className="text-green-100">Payment Successful</p>
      </div>

      <div className="p-6">
        <div className="text-center mb-6">
          <div className="bg-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-300">
            <p className="text-sm text-gray-600 mb-1">Ticket ID</p>
            <p className="text-3xl font-bold text-blue-600 font-mono">{ticketData.ticketId}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">🚌 Journey Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Bus:</span>
                <span className="font-semibold">{ticketData.busName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bus ID:</span>
                <span className="font-semibold">{ticketData.busId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Direction:</span>
                <span className="font-semibold">{ticketData.direction}</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-3">📍 Route Information</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-green-600 font-semibold mr-2">From:</span>
                <span className="font-semibold">{ticketData.fromStation}</span>
              </div>
              <div className="flex items-center justify-center text-gray-400 text-sm">
                ↓ {ticketData.distance} km
              </div>
              <div className="flex items-center">
                <span className="text-red-600 font-semibold mr-2">To:</span>
                <span className="font-semibold">{ticketData.toStation}</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">💰 Payment Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Passengers:</span>
                <span className="font-semibold">{ticketData.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Distance:</span>
                <span className="font-semibold">{ticketData.distance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-semibold">₹2 per km</span>
              </div>
              <div className="border-t border-yellow-200 pt-2 mt-2">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="font-bold text-green-600">₹{ticketData.amount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🕐 Booking Information</h3>
            <div className="text-sm text-gray-600">
              <p>Booked on: {ticketData.bookingTime}</p>
              <p className="mt-2 text-xs text-gray-500">
                Show this ticket to the conductor for verification
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => downloadTicket(ticketData)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>📱</span>
            Download Ticket
          </button>

          <button
            onClick={onNewTicket}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Book Another Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketSuccess;