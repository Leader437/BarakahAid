import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DisasterHeatmap = ({ alerts, selectedType, selectedSeverity, onMarkerClick }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef(new Map());
  const [hoveredMarker, setHoveredMarker] = useState(null);

  // Pakistan center coordinates
  const PAKISTAN_CENTER = [30.3753, 69.3451];
  const ZOOM_LEVEL = 6;

  // Enhanced severity colors with gradients
  const SEVERITY_COLORS = {
    CRITICAL: { primary: '#dc2626', light: '#fee2e2', icon: '🔴' },
    HIGH: { primary: '#ea580c', light: '#ffedd5', icon: '🟠' },
    MEDIUM: { primary: '#eab308', light: '#fef3c7', icon: '🟡' },
    LOW: { primary: '#16a34a', light: '#f0fdf4', icon: '🟢' },
  };

  // Disaster type icons
  const DISASTER_ICONS = {
    EARTHQUAKE: '🌍',
    FLOOD: '💧',
    CYCLONE: '🌪️',
    LANDSLIDE: '⛏️',
    TSUNAMI: '🌊',
    HEATWAVE: '🔥',
    DROUGHT: '☀️',
  };

  // Calculate impact radius based on severity
  const getImpactRadius = (severity) => {
    const radiusMap = { CRITICAL: 60, HIGH: 50, MEDIUM: 40, LOW: 30 };
    return radiusMap[severity] || 30;
  };

  // Get marker size based on severity
  const getMarkerSize = (severity) => {
    const sizeMap = { CRITICAL: 18, HIGH: 14, MEDIUM: 11, LOW: 8 };
    return sizeMap[severity] || 8;
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map only once
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView(PAKISTAN_CENTER, ZOOM_LEVEL);

      // Add dark-themed OpenStreetMap tiles for better contrast
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstance.current);

      mapInstance.current.zoomControl.setPosition('topright');
    }

    // Clear existing markers and circles
    markersRef.current.forEach((markerData) => {
      if (markerData.marker) mapInstance.current.removeLayer(markerData.marker);
      if (markerData.circle) mapInstance.current.removeLayer(markerData.circle);
      if (markerData.pulse) clearInterval(markerData.pulse);
    });
    markersRef.current.clear();

    // Filter alerts based on type and severity
    const filteredAlerts = alerts.filter((alert) => {
      const typeMatch = selectedType === 'all' || alert.type === selectedType;
      const severityMatch = selectedSeverity === 'all' || alert.severity === selectedSeverity;
      return typeMatch && severityMatch && alert.coordinates;
    });

    // Add markers for each alert with enhanced visuals
    filteredAlerts.forEach((alert) => {
      const { latitude, longitude } = alert.coordinates;
      const severityData = SEVERITY_COLORS[alert.severity];
      const markerSize = getMarkerSize(alert.severity);
      const impactRadius = getImpactRadius(alert.severity);
      const icon = DISASTER_ICONS[alert.type] || '⚠️';

      // Create impact zone circle (subtle background)
      const impactCircle = L.circle([latitude, longitude], {
        radius: impactRadius * 1000, // Convert to meters (rough approximation)
        fillColor: severityData.primary,
        color: severityData.primary,
        weight: 1,
        opacity: 0.1,
        fillOpacity: 0.05,
      }).addTo(mapInstance.current);

      // Create main marker with custom styling
      const marker = L.circleMarker([latitude, longitude], {
        radius: markerSize,
        fillColor: severityData.primary,
        color: 'white',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.95,
      }).addTo(mapInstance.current);

      // Enhanced popup with more details
      const timeAgo = getTimeAgo(alert.timestamp);
      const popup = L.popup({
        maxWidth: 300,
        className: 'disaster-popup',
      }).setContent(`
        <div class="p-4 rounded-lg" style="background: linear-gradient(135deg, ${severityData.light} 0%, white 100%);">
          <div class="flex items-center justify-between mb-2">
            <span class="text-2xl">${icon}</span>
            <span class="text-xs px-2 py-1 rounded font-bold text-white" style="background-color: ${severityData.primary};">
              ${alert.severity}
            </span>
          </div>
          
          <h3 class="font-bold text-sm mb-1">${alert.type}</h3>
          <p class="text-xs text-gray-700 mb-2">${alert.location}</p>
          
          <p class="text-xs text-gray-600 mb-3 leading-relaxed">${alert.description}</p>
          
          <div class="border-t pt-2 text-xs text-gray-600 space-y-1">
            ${alert.magnitude ? `<div><strong>Magnitude:</strong> ${alert.magnitude}</div>` : ''}
            <div><strong>Coordinates:</strong> ${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°</div>
            <div><strong>Reported:</strong> ${timeAgo}</div>
            <div class="text-xs italic text-gray-500 mt-2"><strong>Source:</strong> ${alert.source}</div>
          </div>
        </div>
      `);

      marker.bindPopup(popup);

      // Add hover effects
      marker.on('mouseover', function () {
        setHoveredMarker(alert.location);
        this.setStyle({ weight: 4, fillOpacity: 1 });
        impactCircle.setStyle({ opacity: 0.3, fillOpacity: 0.15 });
      });

      marker.on('mouseout', function () {
        setHoveredMarker(null);
        this.setStyle({ weight: 3, fillOpacity: 0.95 });
        impactCircle.setStyle({ opacity: 0.1, fillOpacity: 0.05 });
      });

      // Click handler
      marker.on('click', () => {
        onMarkerClick?.(alert);
      });

      // Pulse animation for critical and high severity alerts
      let pulseInterval = null;
      if (alert.severity === 'CRITICAL') {
        let increasing = true;
        pulseInterval = setInterval(() => {
          const currentFillOpacity = marker.options.fillOpacity;
          const newOpacity = increasing ? 0.5 : 0.95;
          marker.setStyle({ fillOpacity: newOpacity });
          increasing = !increasing;
        }, 600);
      } else if (alert.severity === 'HIGH') {
        let increasing = true;
        pulseInterval = setInterval(() => {
          const newOpacity = increasing ? 0.7 : 0.95;
          marker.setStyle({ fillOpacity: newOpacity });
          increasing = !increasing;
        }, 1000);
      }

      markersRef.current.set(alert.location, { marker, circle: impactCircle, pulse: pulseInterval });
    });

    // Fit bounds if there are alerts
    if (filteredAlerts.length > 0) {
      const group = new L.featureGroup(
        Array.from(markersRef.current.values())
          .map(m => m.marker)
          .filter(Boolean)
      );
      const bounds = group.getBounds();
      if (bounds.isValid()) {
        mapInstance.current.fitBounds(bounds.pad(0.15));
      }
    }

    // Cleanup intervals on unmount
    return () => {
      markersRef.current.forEach((markerData) => {
        if (markerData.pulse) clearInterval(markerData.pulse);
      });
    };
  }, [alerts, selectedType, selectedSeverity, onMarkerClick]);

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const severityStats = {
    CRITICAL: alerts.filter(a => a.severity === 'CRITICAL').length,
    HIGH: alerts.filter(a => a.severity === 'HIGH').length,
    MEDIUM: alerts.filter(a => a.severity === 'MEDIUM').length,
    LOW: alerts.filter(a => a.severity === 'LOW').length,
  };

  return (
    <div className="relative w-full h-full rounded-lg shadow-2xl overflow-hidden bg-gradient-to-b from-blue-50 to-gray-50 z-0">
      <div
        ref={mapRef}
        className="w-full h-full relative z-0"
        style={{ minHeight: '300px' }}
      />
      
      {/* Enhanced Legend with Statistics - Responsive */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/95 backdrop-blur p-2 sm:p-4 rounded-lg sm:rounded-xl shadow-xl z-20 border border-gray-200 text-xs sm:text-sm max-w-xs sm:max-w-sm">
        <h4 className="font-bold mb-2 sm:mb-3 text-xs sm:text-sm text-gray-900">🎯 Alert Severity</h4>
        <div className="space-y-1 sm:space-y-2">
          {Object.entries(SEVERITY_COLORS).map(([severity, data]) => {
            const count = severityStats[severity];
            return (
              <div key={severity} className="flex items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                  <div
                    className="w-3 h-3 sm:w-5 sm:h-5 rounded-full border-2 border-white shadow-md flex-shrink-0"
                    style={{ backgroundColor: data.primary }}
                  />
                  <span className="font-medium text-gray-700 truncate">{severity}</span>
                </div>
                <span className="bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded text-xs font-bold text-gray-700 flex-shrink-0">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="border-t border-gray-200 mt-2 sm:mt-3 pt-2 sm:pt-3">
          <p className="text-xs text-gray-600">
            <strong>Total:</strong> {alerts.length}
          </p>
          <p className="text-xs text-gray-500 mt-1 hidden sm:block">
            Circles show impact zones
          </p>
        </div>
      </div>

      {/* Info Panel - Top Left - Responsive */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/95 backdrop-blur p-2 sm:p-3 rounded-lg shadow-lg z-20 border border-gray-200 max-w-xs text-xs sm:text-sm">
        <h5 className="font-bold text-xs sm:text-sm mb-1 sm:mb-2 text-gray-900">📍 Heatmap</h5>
        <p className="text-xs text-gray-600 hidden sm:block">
          Click markers for details • Hover for zones • Zoom to explore
        </p>
        <p className="text-xs text-gray-600 block sm:hidden">
          Click for details • Pinch to zoom
        </p>
      </div>

      {/* Quick Stats Bar - Bottom - Responsive */}
      <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 flex gap-1 sm:gap-2 z-20">
        {Object.entries(SEVERITY_COLORS).map(([severity, data]) => {
          const count = severityStats[severity];
          if (count === 0) return null;
          return (
            <div
              key={severity}
              className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-white text-center text-xs sm:text-sm font-bold shadow-lg"
              style={{ backgroundColor: data.primary }}
            >
              <span className="hidden sm:inline">{data.icon} {count}</span>
              <span className="inline sm:hidden">{data.icon} {count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DisasterHeatmap;
