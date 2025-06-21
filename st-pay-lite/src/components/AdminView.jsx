import QRGenerator from './QRGenerator';

const AdminView = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">🔐 Admin Dashboard</h1>
        <QRGenerator />
      </div>
    </div>
  );
};

export default AdminView;