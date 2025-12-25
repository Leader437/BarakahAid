import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiRefresh, HiExclamation, HiX } from 'react-icons/hi';
import DisasterHeatmap from '../components/emergency/DisasterHeatmap.jsx';
import DisasterAlertCard from '../components/emergency/DisasterAlertCard.jsx';
import AlertFilters from '../components/emergency/AlertFilters.jsx';
import DisasterStats from '../components/emergency/DisasterStats.jsx';
import RegionalStats from '../components/emergency/RegionalStats.jsx';

const Emergency = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState(null);
  const [previousAlertCount, setPreviousAlertCount] = useState(0);

  // Create donation campaign for new disaster
  const createEmergencyCampaign = async (alert) => {
    try {
      const response = await fetch('http://localhost:5000/api/campaigns/emergency/auto-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert),
      });

      if (response.ok) {
        const campaignResponse = await response.json();
        const campaign = campaignResponse.data || campaignResponse;
        console.log('✅ Emergency campaign created:', campaign);
        
        // Update the alert with campaign ID
        const updatedAlert = { ...alert, campaignId: campaign.id };
        
        // Update alerts list to include campaign ID
        setAlerts((prevAlerts) =>
          prevAlerts.map((a) =>
            (a.id === alert.id || a.location === alert.location) ? updatedAlert : a
          )
        );
        
        setNewCampaign(campaign);
        setShowCampaignModal(true);
        return campaign;
      }
    } catch (err) {
      console.error('Error creating emergency campaign:', err);
    }
  };

  // Fetch alerts from backend
  const fetchAlerts = async (useDemoData = false) => {
    try {
      setLoading(true);
      const url = `http://localhost:5000/api/emergency/alerts${useDemoData ? '?demo=true' : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }

      const responseData = await response.json();
      
      // Handle wrapped response format: { success: true, data: {...} }
      const data = responseData.data || responseData;
      
      // Handle API response format: { timestamp, alerts: [...], sources: [...], demoMode: boolean }
      let alertsArray = [];
      if (Array.isArray(data)) {
        alertsArray = data;
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.alerts)) {
          alertsArray = data.alerts;
        } else if (Array.isArray(data.data)) {
          alertsArray = data.data;
        } else {
          alertsArray = [];
        }
      }
      
      // Ensure alerts have proper coordinates
      const processedAlerts = (alertsArray || []).map((alert) => ({
        ...alert,
        timestamp: alert.timestamp ? new Date(alert.timestamp) : (alert.reportedAt ? new Date(alert.reportedAt) : new Date()),
      }));

      // Check if there are new alerts compared to previous state
      if (processedAlerts.length > previousAlertCount && previousAlertCount > 0) {
        // Find new alerts (those not in previous alerts)
        const newAlerts = processedAlerts.slice(0, processedAlerts.length - previousAlertCount);
        
        // Create campaigns for new CRITICAL and HIGH severity alerts
        for (const alert of newAlerts) {
          if (alert.severity === 'CRITICAL' || alert.severity === 'HIGH') {
            await createEmergencyCampaign(alert);
          }
        }
      }

      setAlerts(processedAlerts);
      setPreviousAlertCount(processedAlerts.length);
      setLastUpdate(new Date());
      setDemoMode(data?.demoMode || false);
      setError(null);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError('Failed to load disaster alerts. Please try again.');
      // Use mock data for demo if API fails
      setAlerts(getMockAlerts());
    } finally {
      setLoading(false);
    }
  };

  // Toggle demo mode
  const toggleDemoMode = async () => {
    const newDemoMode = !demoMode;
    console.log('Toggling demo mode:', newDemoMode);
    const url = `http://localhost:5000/api/emergency/alerts${newDemoMode ? '?demo=true' : ''}`;
    console.log('Fetching from URL:', url);
    
    try {
      setLoading(true);
      const response = await fetch(url);
      const responseData = await response.json();
      
      console.log('API Response:', responseData);
      
      // Handle wrapped response format: { success: true, data: {...} }
      const actualData = responseData.data || responseData;
      
      let alertsArray = [];
      if (Array.isArray(actualData)) {
        alertsArray = actualData;
      } else if (Array.isArray(actualData?.alerts)) {
        alertsArray = actualData.alerts;
      } else if (Array.isArray(actualData?.data)) {
        alertsArray = actualData.data;
      }
      
      const processedAlerts = (alertsArray || []).map((alert) => ({
        ...alert,
        timestamp: alert.timestamp ? new Date(alert.timestamp) : new Date(),
      }));

      setAlerts(processedAlerts);
      setDemoMode(newDemoMode);
      setLastUpdate(new Date());
      setError(null);
      console.log('✅ Demo mode set to:', newDemoMode, '| Alerts count:', processedAlerts.length);
    } catch (err) {
      console.error('Error toggling demo mode:', err);
      setError('Failed to load disaster alerts.');
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demo
  const getMockAlerts = () => [
    {
      id: 1,
      type: 'EARTHQUAKE',
      location: 'Islamabad Region',
      severity: 'HIGH',
      magnitude: 5.2,
      description: 'Magnitude 5.2 earthquake detected in Islamabad region. Depth: 15km',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      coordinates: { latitude: 33.6844, longitude: 73.0479 },
      source: 'USGS Earthquake Hazards Program',
    },
    {
      id: 2,
      type: 'FLOOD',
      location: 'Sindh Province',
      severity: 'CRITICAL',
      description: 'Severe flooding reported in low-lying areas of Sindh Province',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      coordinates: { latitude: 25.8, longitude: 68.5 },
      source: 'Open-Meteo Weather API',
    },
    {
      id: 3,
      type: 'HEATWAVE',
      location: 'Karachi',
      severity: 'MEDIUM',
      description: 'Extreme heat warning in Karachi. Temperature: 42°C',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      coordinates: { latitude: 24.8607, longitude: 67.0011 },
      source: 'Open-Meteo Weather API',
    },
  ];

  useEffect(() => {
    fetchAlerts(demoMode);

    // Refresh every 15 minutes
    const interval = setInterval(() => {
      fetchAlerts(demoMode);
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [demoMode]);

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    const typeMatch = selectedType === 'all' || alert.type === selectedType;
    const severityMatch = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    return typeMatch && severityMatch;
  });

  const handleDonate = (alert) => {
    // If alert has associated campaign, navigate to campaign donation page
    if (alert.campaignId) {
      navigate(`/donate/${alert.campaignId}`);
    } else {
      // Fallback to emergency donate page with alert info
      navigate('/donate', { state: { emergency: alert } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <HiExclamation className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Active Disasters</h1>
            </div>
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
              <button
                onClick={toggleDemoMode}
                className={`flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                  demoMode
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {demoMode ? '📊 Demo Mode ON' : '📊 Demo Mode OFF'}
              </button>
              <button
                onClick={fetchAlerts}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors"
              >
                <HiRefresh className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">
            {demoMode ? '📊 Demo Mode: Showing simulated data for visualization' : 'Real-time disaster monitoring using USGS, Open-Meteo, and GDACS data sources'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm sm:text-base">
            <p className="font-medium">{error}</p>
            <p className="text-xs sm:text-sm mt-1">Using demo data for preview</p>
          </div>
        )}

        {/* Main Content */}
        {loading && alerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-600 font-medium">Loading disaster alerts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Left Sidebar */}
            <div className="md:col-span-1 space-y-4">
              {/* Show Regional Stats when no alerts, otherwise show Disaster Stats */}
              {alerts.length === 0 ? (
                <RegionalStats />
              ) : (
                <>
                  {/* Stats */}
                  <DisasterStats alerts={alerts} />

                  {/* Filters */}
                  <AlertFilters
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                    selectedSeverity={selectedSeverity}
                    setSelectedSeverity={setSelectedSeverity}
                  />
                </>
              )}
            </div>

            {/* Right Content */}
            <div className="md:col-span-2 lg:col-span-3 space-y-4 sm:space-y-6">
              {/* Heatmap */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden h-64 sm:h-80 lg:h-96">
                <DisasterHeatmap
                  alerts={alerts}
                  selectedType={selectedType}
                  selectedSeverity={selectedSeverity}
                  onMarkerClick={setSelectedAlert}
                />
              </div>

              {/* Alerts List */}
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">
                  Disaster Alerts ({filteredAlerts.length})
                </h2>

                {filteredAlerts.length === 0 ? (
                  <div className="bg-white rounded-lg p-6 sm:p-8 text-center">
                    <p className="text-sm sm:text-base text-gray-600 font-medium">No disasters match your filters</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">Try adjusting your filter selections</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {filteredAlerts.map((alert) => (
                      <DisasterAlertCard
                        key={alert.id || alert.location}
                        alert={alert}
                        onDonateClick={handleDonate}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow">
            <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-900">USGS Earthquakes</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Real-time earthquake data filtered for Pakistan region (magnitude 3.0+)
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow">
            <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-900">Weather Monitoring</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Open-Meteo API tracking severe weather and temperature across major cities
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow">
            <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-900">GDACS System</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Global Disaster Alert system monitoring Pakistan region officially
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Campaign Modal */}
      {showCampaignModal && newCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <div className="sticky top-0 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-red-50 to-orange-50 border-b gap-2">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl">🚨</span>
                <span className="text-base sm:text-2xl">Emergency Campaign Activated</span>
              </h2>
              <button
                onClick={() => setShowCampaignModal(false)}
                className="p-1 sm:p-2 hover:bg-white rounded-lg transition-colors flex-shrink-0"
              >
                <HiX className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </button>
            </div>

            {/* Campaign Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Alert */}
              <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded">
                <p className="text-red-800 font-semibold text-xs sm:text-sm">
                  ⚠️ A new disaster has been detected. We've automatically launched an emergency relief campaign.
                </p>
              </div>

              {/* Campaign Image */}
              {newCampaign.image && (
                <div className="w-full h-40 sm:h-56 lg:h-64 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={newCampaign.image}
                    alt={newCampaign.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Campaign Title and Details */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{newCampaign.title}</h3>
                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                  <span className="px-2 sm:px-3 py-1 bg-red-100 text-red-800 rounded-full font-semibold">
                    🚨 EMERGENCY
                  </span>
                  <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                    {newCampaign.category}
                  </span>
                </div>
              </div>

              {/* Goal Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">Goal Amount</span>
                  <span className="text-base sm:text-lg font-bold text-green-600">
                    PKR {newCampaign.goalAmount?.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                  <div
                    className="bg-green-500 h-2 sm:h-3 rounded-full"
                    style={{ width: '0%' }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">About this Campaign</h4>
                <p className="text-gray-700 whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">
                  {newCampaign.description}
                </p>
              </div>

              {/* Key Information */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Campaign Duration</p>
                  <p className="font-bold text-sm sm:text-base text-gray-900">90 Days</p>
                </div>
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Status</p>
                  <p className="font-bold text-sm sm:text-base text-green-700">🟢 Active</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowCampaignModal(false);
                    navigate(`/donate/${newCampaign.id}`);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
                >
                  💚 Donate Now
                </button>
                <button
                  onClick={() => setShowCampaignModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Emergency;
