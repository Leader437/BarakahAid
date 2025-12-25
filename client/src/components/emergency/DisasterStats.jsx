import React from 'react';
import { HiExclamation, HiCheckCircle, HiClock } from 'react-icons/hi';

const DisasterStats = ({ alerts }) => {
  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL').length;
  const highCount = alerts.filter((a) => a.severity === 'HIGH').length;
  const lastUpdate = alerts.length > 0 ? new Date(Math.max(...alerts.map((a) => new Date(a.timestamp)))) : null;

  const getLastUpdateText = () => {
    if (!lastUpdate) return 'No data';
    const now = new Date();
    const diffMs = now - lastUpdate;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${Math.floor(diffMins / 60)}h ago`;
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-green-200">
      {/* Title */}
      <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Active Disasters</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        {/* Total Alerts */}
        <div className="bg-white rounded-lg p-2 sm:p-3 text-center">
          <p className="text-gray-600 text-xs sm:text-sm font-medium">Total Alerts</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">{alerts.length}</p>
        </div>

        {/* Critical */}
        <div className="bg-red-50 rounded-lg p-2 sm:p-3 text-center border border-red-200">
          <p className="text-red-700 text-xs sm:text-sm font-medium flex items-center justify-center gap-1">
            <HiExclamation className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Critical</span>
            <span className="xs:hidden">Crit</span>
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-red-600">{criticalCount}</p>
        </div>

        {/* High */}
        <div className="bg-orange-50 rounded-lg p-2 sm:p-3 text-center border border-orange-200">
          <p className="text-orange-700 text-xs sm:text-sm font-medium">High</p>
          <p className="text-2xl sm:text-3xl font-bold text-orange-600">{highCount}</p>
        </div>
      </div>

      {/* Last Update */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-white rounded px-2 sm:px-3 py-2">
        <HiClock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
        <span className="truncate">
          <strong>Last:</strong> {getLastUpdateText()}
        </span>
      </div>

      {/* Status Badge */}
      <div className="mt-3 sm:mt-4 flex items-center gap-2">
        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${alerts.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
        <span className="text-xs sm:text-sm font-medium text-gray-700">
          {alerts.length > 0 ? 'System Active - Monitoring Data' : 'No Active Disasters'}
        </span>
      </div>
    </div>
  );
};

export default DisasterStats;
