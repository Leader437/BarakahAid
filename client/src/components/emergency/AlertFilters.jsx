import React from 'react';
import { HiX } from 'react-icons/hi';

const AlertFilters = ({
  selectedType,
  setSelectedType,
  selectedSeverity,
  setSelectedSeverity,
}) => {
  const disasterTypes = ['all', 'EARTHQUAKE', 'FLOOD', 'CYCLONE', 'HEATWAVE', 'TSUNAMI', 'LANDSLIDE', 'DROUGHT'];
  const severityLevels = ['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  const handleClearFilters = () => {
    setSelectedType('all');
    setSelectedSeverity('all');
  };

  const isFiltered = selectedType !== 'all' || selectedSeverity !== 'all';

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 sm:pb-3 border-b">
        <span className="text-base sm:text-lg">⚙️</span>
        <h3 className="font-bold text-base sm:text-lg">Filters</h3>
      </div>

      {/* Disaster Type Filter */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">Disaster Type</label>
        <div className="grid grid-cols-2 gap-1 sm:gap-2">
          {disasterTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`py-1.5 sm:py-2 px-2 sm:px-3 rounded text-xs sm:text-sm font-medium transition-all ${
                selectedType === type
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={type === 'all' ? 'All Types' : type}
            >
              {type === 'all' ? 'All' : (type.length > 6 ? type.slice(0, 6) : type)}
            </button>
          ))}
        </div>
      </div>

      {/* Severity Filter */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">Severity</label>
        <div className="space-y-1.5 sm:space-y-2">
          {severityLevels.map((severity) => {
            const colors = {
              all: 'bg-gray-100 hover:bg-gray-200',
              CRITICAL: 'bg-red-100 hover:bg-red-200',
              HIGH: 'bg-orange-100 hover:bg-orange-200',
              MEDIUM: 'bg-yellow-100 hover:bg-yellow-200',
              LOW: 'bg-green-100 hover:bg-green-200',
            };

            return (
              <button
                key={severity}
                onClick={() => setSelectedSeverity(severity)}
                className={`w-full py-1.5 sm:py-2 px-3 rounded text-xs sm:text-sm font-medium transition-all text-left ${
                  selectedSeverity === severity
                    ? colors[severity] + ' ring-2 ring-offset-1'
                    : colors[severity]
                }`}
              >
                {severity === 'all' ? 'All Levels' : severity}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear Filters Button */}
      {isFiltered && (
        <button
          onClick={handleClearFilters}
          className="w-full py-1.5 sm:py-2 px-3 sm:px-4 bg-red-100 hover:bg-red-200 text-red-700 rounded font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <HiX className="w-3 h-3 sm:w-4 sm:h-4" />
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default AlertFilters;
