import React, { useState, useEffect } from 'react';
import { fetchStopsAndPOIs } from './services/api';
import Map from './components/Map';
import LocationButton from './components/LocationButton';
import POICategoryFilter from './components/POICategoryFilter'; // Import the filter
import './styles/App.css';
import onebusLogo from './assets/images/onebus-logo.svg';

const AUSTIN_CENTER = { lat: 30.2672, lng: -97.7431 };
const DEFAULT_ZOOM = 13;

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [stops, setStops] = useState([]);
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState(AUSTIN_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);

  // New state for POI filtering
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [availableCategories, setAvailableCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});

  // Extract categories when POIs change
  useEffect(() => {
    if (pois.length > 0) {
      const categories = [...new Set(pois.map(poi => poi.amenity || poi.category || 'Other').filter(Boolean))];
      setAvailableCategories(categories);
      // Set default selected categories (maybe all or a subset)

      setSelectedCategories(new Set()); // Select none by default    
        
      // Calculate counts
      const counts = {};
      pois.forEach(poi => {
        const cat = poi.amenity || poi.category || 'Other';
        counts[cat] = (counts[cat] || 0) + 1;
      });
      setCategoryCounts(counts);
    }
  }, [pois]);

  // Filter handlers
  const handleToggleCategory = (category) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleClearAll = () => {
    setSelectedCategories(new Set());
  };

  const handleSelectAll = () => {
    setSelectedCategories(new Set(availableCategories));
  };

  // Filter POIs based on selected categories
  const filteredPois = pois.filter(poi => {
    const category = poi.amenity || poi.category || 'Other';
    return selectedCategories.has(category);
  });

  // Fetch stops and POIs when location is available
  useEffect(() => {
    if (userLocation) {
      loadStopsAndPOIs(userLocation.lat, userLocation.lng);
    }
  }, [userLocation]);

  const loadStopsAndPOIs = async (lat, lng) => {
    setLoading(true);
    setError(null);
    
    setStops([]);
    setPois([]);
    
    try {
      const data = await fetchStopsAndPOIs(lat, lng);
      setStops(data.stops);
      setPois(data.pois);
      setMapCenter({ lat, lng });
      setMapZoom(15);
    } catch (err) {
      setError(err.message || 'Failed to load stops and POIs');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationUpdate = (lat, lng) => {
    setUserLocation({ lat, lng });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setLoading(false);
      },
      (err) => {
        setError(`Error getting location: ${err.message}`);
        setLoading(false);
        setMapCenter(AUSTIN_CENTER);
        setMapZoom(DEFAULT_ZOOM);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Try to get location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="app-container">
      <div className="header">
        <img 
          src={onebusLogo} 
          alt="OneBus Logo" 
          className="logo"
        />
        
        
        {/* Add filter directly below the button, in the header */}
        {availableCategories.length > 0 && (
          <div className="filter-wrapper">
            <POICategoryFilter
              categories={availableCategories}
              selectedCategories={selectedCategories}
              onToggleCategory={handleToggleCategory}
              onClearAll={handleClearAll}
              onSelectAll={handleSelectAll}
              categoryCounts={categoryCounts}
            />
          </div>
        )}

    

      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {loading && !userLocation && (
        <div className="loading-banner">
          Getting your location...
        </div>
      )}

      <div className="map-container">
        <Map 
          stops={stops}
          pois={filteredPois} // Pass filtered POIs to map
          center={mapCenter}
          zoom={mapZoom}
          onLocationUpdate={handleLocationUpdate}
        />
      </div>

      {/* <div className="footer">
        <div className="stats">
          {stops.length > 0 && <span>{stops.length} Bus Stop{stops.length !== 1 ? 's' : ''}</span>}
          {pois.length > 0 && <span>{filteredPois.length} of {pois.length} POI{pois.length !== 1 ? 's' : ''}</span>}
        </div>
      </div> */}
    </div>
  );
}

export default App;