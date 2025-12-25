import React from 'react';
import { HiExclamation, HiFire, HiEye, HiCheckCircle } from 'react-icons/hi';

const DisasterAlertCard = ({ alert, onDonateClick }) => {
  const getSeverityColor = (severity) => {
    const colors = {
      CRITICAL: 'bg-red-50 border-red-300 text-red-900',
      HIGH: 'bg-orange-50 border-orange-300 text-orange-900',
      MEDIUM: 'bg-yellow-50 border-yellow-300 text-yellow-900',
      LOW: 'bg-green-50 border-green-300 text-green-900',
    };
    return colors[severity] || colors.LOW;
  };

  const getSeverityBadgeColor = (severity) => {
    const colors = {
      CRITICAL: 'bg-red-600 text-white',
      HIGH: 'bg-orange-600 text-white',
      MEDIUM: 'bg-yellow-500 text-white',
      LOW: 'bg-green-600 text-white',
    };
    return colors[severity] || colors.LOW;
  };

  const getTypeIcon = (type) => {
    const icons = {
      EARTHQUAKE: <HiExclamation className="w-5 h-5" />,
      FLOOD: <HiExclamation className="w-5 h-5" />,
      CYCLONE: <HiFire className="w-5 h-5" />,
      HEATWAVE: <HiFire className="w-5 h-5" />,
      TSUNAMI: <HiExclamation className="w-5 h-5" />,
      LANDSLIDE: <HiExclamation className="w-5 h-5" />,
      DROUGHT: <HiFire className="w-5 h-5" />,
    };
    return icons[type] || <HiExclamation className="w-5 h-5" />;
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now - alertTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className={`border-l-4 p-3 sm:p-4 rounded-lg ${getSeverityColor(alert.severity)} transition-all hover:shadow-lg`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="text-lg sm:text-xl flex-shrink-0">{getTypeIcon(alert.type)}</div>
          <div className="min-w-0">
            <h3 className="font-bold text-base sm:text-lg">{alert.type}</h3>
            <p className="text-xs sm:text-sm opacity-75 truncate">{alert.location}</p>
          </div>
        </div>
        <span className={`px-2 sm:px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap flex-shrink-0 ${getSeverityBadgeColor(alert.severity)}`}>
          {alert.severity}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-3">
        <p className="text-xs sm:text-sm leading-relaxed">{alert.description}</p>

        {/* Additional info */}
        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs pt-2">
          <div>
            <span className="opacity-75">Source: </span>
            <span className="font-semibold">{alert.source}</span>
          </div>
          {alert.magnitude && (
            <div>
              <span className="opacity-75">Magnitude: </span>
              <span className="font-semibold">{alert.magnitude}</span>
            </div>
          )}
          <div>
            <span className="opacity-75">Reported: </span>
            <span className="font-semibold">{getTimeAgo(alert.timestamp)}</span>
          </div>
        </div>
      </div>

      {/* Coordinates */}
      {alert.coordinates && (
        <div className="mb-3 p-2 bg-white bg-opacity-40 rounded text-xs">
          <span className="opacity-75">Coordinates: </span>
          <span className="font-mono">
            {alert.coordinates.latitude.toFixed(2)}°, {alert.coordinates.longitude.toFixed(2)}°
          </span>
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={() => onDonateClick?.(alert)}
        className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
      >
        Help Now
      </button>
    </div>
  );
};

export default DisasterAlertCard;
