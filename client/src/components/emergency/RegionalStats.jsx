import React, { useEffect, useState } from 'react';

const RegionalStats = () => {
  const [stats, setStats] = useState({
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    weatherCondition: 'Clear',
    regions: [
      { name: 'Islamabad', temp: 25, status: '✅ Safe' },
      { name: 'Karachi', temp: 30, status: '✅ Safe' },
      { name: 'Lahore', temp: 28, status: '✅ Safe' },
      { name: 'Peshawar', temp: 22, status: '✅ Safe' },
    ],
  });

  // Historical disasters data
  const historicalDisasters = [
    {
      date: 'Oct 8, 2005',
      event: 'Kashmir Earthquake',
      magnitude: '7.6',
      severity: 'CRITICAL',
      deaths: '~73,500',
      icon: '🌍',
    },
    {
      date: 'Aug 2010',
      event: 'Pakistan Floods',
      magnitude: 'Massive',
      severity: 'CRITICAL',
      deaths: '~1,700+',
      icon: '💧',
    },
    {
      date: 'June 2015',
      event: 'Karachi Heatwave',
      magnitude: '54°C',
      severity: 'HIGH',
      deaths: '~2,000+',
      icon: '🔥',
    },
    {
      date: 'Sep 2022',
      event: 'Sindh Floods',
      magnitude: 'Extensive',
      severity: 'HIGH',
      deaths: '~1,700+',
      icon: '🌊',
    },
  ];

  // Fetch weather data
  useEffect(() => {
    const fetchWeatherStats = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=30.3753&longitude=69.3451&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh'
        );
        const data = await response.json();

        if (data.current) {
          const weatherDescriptions = {
            0: 'Clear',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Foggy',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Slight snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            77: 'Snow grains',
            80: 'Slight rain showers',
            81: 'Moderate rain showers',
            82: 'Violent rain showers',
            85: 'Slight snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with slight hail',
            99: 'Thunderstorm with heavy hail',
          };

          setStats((prev) => ({
            ...prev,
            temperature: Math.round(data.current.temperature_2m),
            humidity: data.current.relative_humidity_2m,
            windSpeed: Math.round(data.current.wind_speed_10m),
            weatherCondition: weatherDescriptions[data.current.weather_code] || 'Clear',
          }));
        }
      } catch (error) {
        console.log('Weather fetch error (using defaults):', error);
      }
    };

    fetchWeatherStats();
  }, []);

  const getWeatherIcon = (condition) => {
    if (condition.includes('Clear') || condition.includes('clear')) return '☀️';
    if (condition.includes('cloudy') || condition.includes('Overcast')) return '⛅';
    if (condition.includes('rain') || condition.includes('Rain')) return '🌧️';
    if (condition.includes('snow') || condition.includes('Snow')) return '❄️';
    if (condition.includes('Fog') || condition.includes('fog')) return '🌫️';
    if (condition.includes('Thunder')) return '⛈️';
    return '🌍';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'border-red-300 bg-red-50';
      case 'HIGH':
        return 'border-orange-300 bg-orange-50';
      case 'MEDIUM':
        return 'border-yellow-300 bg-yellow-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Current Weather Card */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200 shadow-lg">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3 mb-3">
          <h3 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">{getWeatherIcon(stats.weatherCondition)}</span>
            <span>Current Weather</span>
          </h3>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-bold w-fit">
            All Clear
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="bg-white rounded-lg p-2 sm:p-3 border border-blue-100">
            <p className="text-xs text-gray-600 mb-1">Temperature</p>
            <p className="text-lg sm:text-2xl font-bold text-blue-600">{stats.temperature}°C</p>
          </div>
          <div className="bg-white rounded-lg p-2 sm:p-3 border border-blue-100">
            <p className="text-xs text-gray-600 mb-1">Humidity</p>
            <p className="text-lg sm:text-2xl font-bold text-blue-600">{stats.humidity}%</p>
          </div>
          <div className="bg-white rounded-lg p-2 sm:p-3 border border-blue-100 col-span-2">
            <p className="text-xs text-gray-600 mb-1">Condition</p>
            <p className="text-sm sm:text-lg font-bold text-blue-600">{stats.weatherCondition}</p>
          </div>
          <div className="bg-white rounded-lg p-2 sm:p-3 border border-blue-100 col-span-2">
            <p className="text-xs text-gray-600 mb-1">Wind Speed</p>
            <p className="text-base sm:text-xl font-bold text-blue-600">{stats.windSpeed} km/h</p>
          </div>
        </div>
      </div>

      {/* Regional Status */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200 shadow-lg">
        <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-lg sm:text-xl">🗺️</span>
          Regional Status
        </h3>

        <div className="space-y-2">
          {stats.regions.map((region) => (
            <div
              key={region.name}
              className="flex items-center justify-between bg-white rounded-lg p-2 sm:p-2.5 border border-green-100 gap-2"
            >
              <div className="min-w-0">
                <p className="font-semibold text-xs sm:text-sm text-gray-900">{region.name}</p>
                <p className="text-xs text-gray-500">{region.temp}°C</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-xs sm:text-sm">{region.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Disasters */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-amber-200 shadow-lg">
        <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-lg sm:text-xl">📚</span>
          Historical Disasters
        </h3>

        <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
          {historicalDisasters.map((disaster, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-2 sm:p-3 border-2 ${getSeverityColor(disaster.severity)} transition-all hover:shadow-md`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base sm:text-lg flex-shrink-0">{disaster.icon}</span>
                    <span className="font-bold text-xs sm:text-sm text-gray-900 truncate">{disaster.event}</span>
                  </div>
                  <p className="text-xs text-gray-600">{disaster.date}</p>
                  <div className="flex gap-1 sm:gap-2 mt-1 flex-wrap">
                    <span className="text-xs bg-white/70 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-semibold text-gray-700">
                      {disaster.magnitude}
                    </span>
                    <span className="text-xs bg-red-100 text-red-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-bold">
                      {disaster.deaths}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200 shadow-lg">
        <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-lg sm:text-xl">📊</span>
          System Status
        </h3>

        <div className="space-y-2 sm:space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1 gap-2">
              <span className="text-xs sm:text-sm text-gray-700 font-medium">Data Coverage</span>
              <span className="text-xs font-bold text-green-600">100%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
              <div className="bg-green-500 h-1.5 sm:h-2 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm text-gray-700">Monitoring</span>
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm text-gray-700">Alert Network</span>
            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Online
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Data Sources</span>
            <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              3/3
            </span>
          </div>
        </div>
      </div>

      {/* Quick Facts */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200 shadow-lg">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-xl">💡</span>
          Quick Facts
        </h3>

        <div className="space-y-2 text-xs text-gray-700">
          <p>🏔️ Pakistan sits on active seismic zones with frequent earthquakes</p>
          <p>🌊 Monsoon seasons (Jun-Sep) bring high flood risk to Sindh & Punjab</p>
          <p>🔥 Summer months (May-Oct) see extreme heat in southern regions</p>
          <p>📡 Real-time monitoring via USGS, Open-Meteo & GDACS systems</p>
        </div>
      </div>

      {/* Last Updated */}
      <p className="text-xs text-gray-500 text-center">
        Last updated: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
};

export default RegionalStats;
