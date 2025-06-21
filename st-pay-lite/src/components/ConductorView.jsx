import ConductorDashboard from './ConductorDashboard';

const ConductorView = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8"> Conductor Dashboard</h1>
        <ConductorDashboard />
      </div>
    </div>
  );
};

export default ConductorView;