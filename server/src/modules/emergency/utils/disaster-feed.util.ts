import axios from 'axios';
import * as xml2js from 'xml2js';
import { Injectable, Logger } from '@nestjs/common';

export interface DisasterAlert {
  type: 'EARTHQUAKE' | 'FLOOD' | 'CYCLONE' | 'LANDSLIDE' | 'TSUNAMI' | 'HEATWAVE' | 'DROUGHT';
  location: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  magnitude?: number; // For earthquakes
  description: string;
  timestamp: Date;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  affectedArea?: string;
  estimatedDamage?: string;
  source: string;
}

@Injectable()
export class DisasterFeedUtil {
  private readonly logger = new Logger(DisasterFeedUtil.name);
  private readonly xmlParser = new xml2js.Parser({ explicitArray: false });

  /**
   * Fetch earthquake data from USGS Earthquake Hazards Program API
   * Uses USGS fdsnws (event) API with bounding box for Pakistan region (24-37°N, 61-77°E)
   * Much more efficient than filtering worldwide data on client-side
   */
  async fetchEarthquakeData(): Promise<DisasterAlert[]> {
    try {
      const alerts: DisasterAlert[] = [];
      
      // USGS fdsnws/event/1/query API with bounding box for Pakistan
      // Pakistan coordinates: 24-37°N (latitude), 61-77°E (longitude)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const response = await axios.get(
        'https://earthquake.usgs.gov/fdsnws/event/1/query',
        {
          params: {
            format: 'geojson',
            starttime: thirtyDaysAgo.toISOString().split('T')[0], // Last 30 days
            minlatitude: 24,
            maxlatitude: 37,
            minlongitude: 61,
            maxlongitude: 77,
            minmagnitude: 3.0, // Only magnitude 3.0+
            orderby: 'time-asc',
            limit: 300, // Maximum 300 results
          },
          timeout: 10000,
        }
      );

      const features = response.data.features || [];

      features.forEach((quake: any) => {
        const [lon, lat] = quake.geometry.coordinates;
        const props = quake.properties;

        // Additional safety check (should already be filtered by API)
        if (lat >= 24 && lat <= 37 && lon >= 61 && lon <= 77 && props.mag >= 3.0) {
          alerts.push({
            type: 'EARTHQUAKE',
            location: props.place || 'Pakistan Region',
            severity: this.calculateEarthquakeSeverity(props.mag),
            magnitude: props.mag,
            description: `Earthquake with magnitude ${props.mag} detected at ${props.place}. Depth: ${quake.geometry.coordinates[2]}km`,
            timestamp: new Date(props.time),
            coordinates: { latitude: lat, longitude: lon },
            source: 'USGS Earthquake Hazards Program (FDSNWS)',
          });
        }
      });

      this.logger.log(`✅ Fetched ${alerts.length} earthquake alerts from USGS (Pakistan region only)`);
      return alerts;
    } catch (error) {
      this.logger.error(`❌ Error fetching USGS earthquake data: ${error.message}`);
      return [];
    }
  }

  /**
   * Fetch weather alerts from Open-Meteo API (free, no API key required)
   * Monitors Pakistan region for severe weather conditions
   */
  async fetchWeatherAlerts(): Promise<DisasterAlert[]> {
    try {
      const alerts: DisasterAlert[] = [];

      // Open-Meteo provides free weather data for Pakistan
      // We'll check major cities for severe weather patterns
      const pakistanCities = [
        { name: 'Karachi', lat: 24.8607, lon: 67.0011 },
        { name: 'Lahore', lat: 31.5497, lon: 74.3436 },
        { name: 'Islamabad', lat: 33.6844, lon: 73.0479 },
        { name: 'Peshawar', lat: 34.0151, lon: 71.5249 },
        { name: 'Quetta', lat: 30.1798, lon: 66.9750 },
      ];

      for (const city of pakistanCities) {
        try {
          const response = await axios.get(
            'https://api.open-meteo.com/v1/forecast',
            {
              params: {
                latitude: city.lat,
                longitude: city.lon,
                current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
              },
              timeout: 5000,
            }
          );

          const current = response.data.current;
          
          // Detect severe weather conditions
          const weatherCode = current.weather_code;
          const windSpeed = current.wind_speed_10m;
          const temperature = current.temperature_2m;
          
          // Check for heatwave (temperature > 40°C is dangerous in Pakistan)
          const isHeatwave = temperature > 40;
          
          // Check for severe weather events (thunderstorms, heavy rain)
          const isSevereWeather = weatherCode === 95 || weatherCode === 96 || weatherCode === 99 || (weatherCode >= 80 && weatherCode <= 82) || windSpeed > 40;

          if (isHeatwave) {
            alerts.push({
              type: 'HEATWAVE',
              location: city.name,
              severity: this.calculateHeatwaveSeverity(temperature),
              description: `Extreme heat warning in ${city.name}. Temperature: ${temperature}°C`,
              timestamp: new Date(),
              coordinates: { latitude: city.lat, longitude: city.lon },
              source: 'Open-Meteo Weather API',
            });
          } else if (isSevereWeather) {
            const alertType = this.parseWeatherCode(weatherCode);
            alerts.push({
              type: alertType,
              location: city.name,
              severity: this.calculateWeatherCodeSeverity(weatherCode, windSpeed),
              description: `Severe weather detected in ${city.name}. Temp: ${temperature}°C, Wind: ${windSpeed} km/h`,
              timestamp: new Date(),
              coordinates: { latitude: city.lat, longitude: city.lon },
              source: 'Open-Meteo Weather API',
            });
          }
        } catch (error) {
          this.logger.debug(`⚠️ Could not fetch weather for ${city.name}: ${error.message}`);
        }
      }

      this.logger.log(`✅ Checked weather for ${pakistanCities.length} cities, found ${alerts.length} severe weather alerts`);
      return alerts;
    } catch (error) {
      this.logger.warn(`⚠️ Error fetching weather alerts: ${error.message}`);
      return [];
    }
  }

  /**
   * Parse WMO weather code to alert type
   * Reference: https://www.open-meteo.com/en/docs
   * Codes 50-67: Drizzle and Rain (maps to FLOOD)
   * Codes 80-82: Light/Moderate/Heavy rain showers (maps to FLOOD)
   * Codes 85-86: Light/Heavy rain and snow showers (maps to FLOOD)
   * Codes 95-99: Thunderstorms (maps to CYCLONE)
   */
  private parseWeatherCode(code: number): DisasterAlert['type'] {
    if (code >= 80 && code <= 82) return 'FLOOD'; // Rain showers
    if (code >= 85 && code <= 86) return 'FLOOD'; // Heavy rain showers
    if (code >= 50 && code <= 67) return 'FLOOD'; // Drizzle and rain (NOT heatwave)
    if (code === 95 || code === 96 || code === 99) return 'CYCLONE'; // Thunderstorms
    return 'FLOOD'; // Default to flood for severe conditions
  }

  /**
   * Calculate heatwave severity based on temperature
   * Pakistan context: >40°C is dangerous, >45°C is critical
   */
  private calculateHeatwaveSeverity(temperature: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (temperature >= 45) return 'CRITICAL'; // Life-threatening
    if (temperature >= 42) return 'HIGH'; // Very dangerous
    if (temperature >= 40) return 'MEDIUM'; // Dangerous
    return 'LOW';
  }

  /**
   * Calculate severity from weather code and wind speed
   */
  private calculateWeatherCodeSeverity(code: number, windSpeed: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (windSpeed > 60 || code >= 95) return 'CRITICAL';
    if (windSpeed > 40 || code >= 80) return 'HIGH';
    if (windSpeed > 25 || code >= 50) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * NDMA (National Disaster Management Authority) Alerts
   * Status: DISABLED - No public real-time API
   * 
   * Reason for removal: NDMA website does not have a public API or RSS feed.
   * HTML scraping of their homepage produces false positives because navigation
   * menus and footers always contain emergency-related keywords.
   * 
   * Alternative: GDACS (Global Disaster Alert and Coordination System) monitors
   * official Pakistani government channels and provides reliable disaster alerts.
   * This is already implemented in fetchGDACSAlerts().
   */
  async fetchNDMAAlerts(): Promise<DisasterAlert[]> {
    this.logger.warn('⚠️ NDMA real-time API unavailable - using GDACS for official government disaster monitoring');
    return [];
  }

  /**
   * Fetch World Bank disaster alerts for Pakistan
   * Uses World Bank's Global Disaster Alert and Coordination System (GDACS)
   */
  async fetchGDACSAlerts(): Promise<DisasterAlert[]> {
    try {
      const alerts: DisasterAlert[] = [];

      // GDACS RSS Feed for Pakistan/South Asia
      const response = await axios.get(
        'https://www.gdacs.org/xml/rss_africa_asia.xml',
        { timeout: 30000 }
      );

      const parsed = await this.xmlParser.parseStringPromise(response.data);
      const items = parsed.rss?.channel?.item || [];

      const itemArray = Array.isArray(items) ? items : [items];

      itemArray.forEach((item: any) => {
        const title = item.title?.[0] || '';
        const description = item.description?.[0] || '';
        
        // Only include alerts affecting Pakistan
        if (this.isPakistanAlert(title, description)) {
          const alertType = this.parseGDACSAlertType(title);
          
          alerts.push({
            type: alertType,
            location: this.extractGDACSLocation(title, description),
            severity: this.calculateGDACSServerity(title, description),
            description: `${title}: ${description}`,
            timestamp: new Date(item.pubDate?.[0] || Date.now()),
            source: 'Global Disaster Alert and Coordination System (GDACS)',
          });
        }
      });

      this.logger.log(`✅ Fetched ${alerts.length} GDACS alerts for Pakistan`);
      return alerts;
    } catch (error) {
      this.logger.error(`❌ Error fetching GDACS alerts: ${error.message}`);
      return [];
    }
  }

  /**
   * Generate demo alerts for testing/visualization purposes
   * Shows 2-3 realistic disaster scenarios across Pakistan
   */
  private getDemoAlerts(): DisasterAlert[] {
    const now = new Date();
    return [
      {
        type: 'EARTHQUAKE',
        location: 'Islamabad-Rawalpindi Region',
        severity: 'HIGH',
        magnitude: 5.2,
        description: 'Earthquake detected near Islamabad-Rawalpindi fault line. Depth: 12km',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        coordinates: { latitude: 33.7413, longitude: 73.1686 },
        source: 'Demo Alert - USGS Simulation',
      },
      {
        type: 'FLOOD',
        location: 'Sindh Province - Karachi Region',
        severity: 'MEDIUM',
        description: 'Flooding reported in low-lying areas after heavy rainfall. Heavy downpour expected in next 24 hours.',
        timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
        coordinates: { latitude: 25.3548, longitude: 68.3639 },
        source: 'Demo Alert - Open-Meteo Simulation',
      },
      {
        type: 'HEATWAVE',
        location: 'Lahore',
        severity: 'MEDIUM',
        description: 'High temperature alert: 39°C recorded in Lahore. Health advisory issued for vulnerable populations.',
        timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
        coordinates: { latitude: 31.5497, longitude: 74.3436 },
        source: 'Demo Alert - Weather Simulation',
      },
    ];
  }

  /**
   * Consolidate all disaster feeds into a single list, removing duplicates
   * @param includeDemoData - Include demo alerts if true (useful for testing/visualization)
   */
  async getAllDisasterAlerts(includeDemoData: boolean = false): Promise<DisasterAlert[]> {
    const allAlerts: DisasterAlert[] = [];

    // Fetch from all sources in parallel
    const [earthquakes, weather, gdacs] = await Promise.all([
      this.fetchEarthquakeData(),
      this.fetchWeatherAlerts(),
      this.fetchGDACSAlerts(),
    ]);

    allAlerts.push(...earthquakes, ...weather, ...gdacs);

    // If demo mode enabled, add demo alerts
    if (includeDemoData) {
      allAlerts.push(...this.getDemoAlerts());
      this.logger.log('📊 Demo alerts included for visualization');
    }

    // Remove duplicates based on location, type, and timestamp proximity
    const uniqueAlerts = this.deduplicateAlerts(allAlerts);

    // Sort by severity and timestamp
    return uniqueAlerts.sort((a, b) => {
      const severityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  }

  /**
   * Helper: Calculate earthquake severity from magnitude
   */
  private calculateEarthquakeSeverity(magnitude: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (magnitude >= 7.0) return 'CRITICAL';
    if (magnitude >= 6.0) return 'HIGH';
    if (magnitude >= 4.5) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Helper: Parse weather alert type from title
   * (No longer used - replaced with parseWeatherCode)
   */

  /**
   * Helper: Parse GDACS alert type
   */
  private parseGDACSAlertType(title: string): DisasterAlert['type'] {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('earthquake')) return 'EARTHQUAKE';
    if (titleLower.includes('flood')) return 'FLOOD';
    if (titleLower.includes('cyclone') || titleLower.includes('storm')) return 'CYCLONE';
    if (titleLower.includes('tsunami')) return 'TSUNAMI';
    
    return 'FLOOD'; // Default
  }

  /**
   * Helper: Check if alert is relevant to Pakistan
   */
  private isPakistanAlert(title: string, description: string): boolean {
    const fullText = `${title} ${description}`.toLowerCase();
    const pakistanKeywords = ['pakistan', 'karachi', 'lahore', 'peshawar', 'quetta', 'islamabad', 'punjab', 'sindh', 'kpk'];
    
    return pakistanKeywords.some(keyword => fullText.includes(keyword));
  }

  /**
   * Helper: Extract location from GDACS alert
   */
  private extractGDACSLocation(title: string, description: string): string {
    // GDACS usually includes location in title
    const matches = title.match(/in\s+(\w+)/i);
    return matches ? matches[1] : 'Pakistan Region';
  }

  /**
   * Helper: Calculate GDACS severity
   */
  private calculateGDACSServerity(title: string, description: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const fullText = `${title} ${description}`.toLowerCase();
    
    if (fullText.includes('red') || fullText.includes('magnitude 7')) return 'CRITICAL';
    if (fullText.includes('orange') || fullText.includes('magnitude 6')) return 'HIGH';
    if (fullText.includes('yellow')) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Helper: Remove duplicate alerts
   */
  private deduplicateAlerts(alerts: DisasterAlert[]): DisasterAlert[] {
    const unique = new Map<string, DisasterAlert>();

    alerts.forEach(alert => {
      // Create a unique key based on type, location, and day
      const key = `${alert.type}-${alert.location}-${alert.timestamp.toDateString()}`;
      
      // Keep the alert with highest severity
      if (!unique.has(key) || this.getSeverityScore(alert.severity) > this.getSeverityScore(unique.get(key)!.severity)) {
        unique.set(key, alert);
      }
    });

    return Array.from(unique.values());
  }

  /**
   * Helper: Get numeric severity score
   */
  private getSeverityScore(severity: string): number {
    const scores = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    return scores[severity as keyof typeof scores] || 0;
  }
}
