import { useState } from 'react';
import QRLanding from './QRLanding';
import TicketForm from './TicketForm';
import TicketSuccess from './TicketSuccess';

const PassengerView = ({ fromQR = false, busId = 'BUS001-AB' }) => {
  const [ticketData, setTicketData] = useState(null);
  const [showQRLanding, setShowQRLanding] = useState(fromQR);

  const handleTicketSuccess = (data) => {
    setTicketData(data);
    setShowQRLanding(false);
  };

  const handleNewTicket = () => {
    setTicketData(null);
  };

  const handleEnterApp = () => {
    setShowQRLanding(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">🚌 ST Pay Lite</h1>
        {ticketData ? (
          <TicketSuccess ticketData={ticketData} onNewTicket={handleNewTicket} />
        ) : showQRLanding ? (
          <QRLanding onEnterApp={handleEnterApp} busId={busId} />
        ) : (
          <TicketForm onTicketSuccess={handleTicketSuccess} busId={busId} />
        )}
      </div>
    </div>
  );
};

export default PassengerView;