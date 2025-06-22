import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const ErrorBoundary = ({ children }) => {
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    window.onerror = (msg) => setError(msg);
    return () => (window.onerror = null);
  }, []);
  if (error) return <div className="p-4 bg-red-100 text-red-700">Error: {error}</div>;
  return children;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);