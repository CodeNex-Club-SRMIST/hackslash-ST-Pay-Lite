// src/pages/QRLanding.jsx
import React from 'react';
import { motion } from 'framer-motion';
import busRoutes from '../utils/busRoutes';
import { BusFront, IndianRupee, ScanLine, UserCheck } from 'lucide-react';

const QRLanding = ({ onEnterApp, busId }) => {
  const busInfo = busRoutes[busId] || busRoutes['BUS001-AB'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-sky-500 to-purple-600 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/60 backdrop-blur-lg shadow-xl border border-white/20 rounded-3xl p-6 sm:p-10 max-w-md w-full"
      >
        <div className="flex justify-center mb-4 text-indigo-600">
          <BusFront size={48} strokeWidth={2.5} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-2">
          Welcome to {busInfo.busName}
        </h1>
        <p className="text-sm sm:text-base text-blue-700 font-medium text-center mb-1">
          Bus ID: {busId}
        </p>
        <p className="text-sm text-purple-700 text-center mb-4">
          Direction: {busInfo.direction}
        </p>

        <div className="bg-white/80 border border-gray-200 rounded-xl p-4 mb-6 shadow-inner">
          <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <ScanLine size={18} /> Ticket Info
          </h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-center gap-2">
              <IndianRupee size={16} /> ₹2/km per passenger
            </li>
            <li className="flex items-center gap-2">
              <UserCheck size={16} /> Max 4 passengers
            </li>
            <li className="flex items-center gap-2">  UPI (PhonePe, GPay, Paytm)</li>
            <li className="flex items-center gap-2">🕒 Single journey only</li>
          </ul>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnterApp}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all"
        >
          Book Your Ticket Now
        </motion.button>
      </motion.div>
    </div>
  );
};

export default QRLanding;
