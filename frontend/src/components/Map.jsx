import React, { useMemo, useState, useEffect } from 'react';
import BottomSheet from '../components/BottomSheet';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { getBusStopIcon, getPOIIcon, getUserLocationIcon } from '../utils/icons';

// Import the new service and component
import { 
  extractUniqueCategories, 
  filterPoisByCategories, 
  getDefaultCategories,
  getCategoryCounts 
} from '../services/poiCategories';
import POICategoryFilter from './POICategoryFilter';

const AUSTIN_CENTER = { lat: 30.2672, lng: -97.7431 };
const DEFAULT_ZOOM = 13;

const Map = ({ stops = [], pois = [], center = AUSTIN_CENTER, zoom = DEFAULT_ZOOM, onLocationUpdate }) => {
  // Get Google Maps API key from environment variable
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // State to track which marker's info window is open
  const [activeMarker, setActiveMarker] = useState(null);
  
  // State for context menu
  const [contextMenu, setContextMenu] = useState(null);

  // New state for POI filtering
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [availableCategories, setAvailableCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});

  // Extract categories and set defaults when POIs change
  useEffect(() => {
    if (pois.length > 0) {
      const categories = extractUniqueCategories(pois);
      setAvailableCategories(categories);
      setSelectedCategories(getDefaultCategories(categories));
      setCategoryCounts(getCategoryCounts(pois));
    }
  }, [pois]);

  // Filter POIs based on selected categories
  const filteredPois = useMemo(() => {
    return filterPoisByCategories(pois, selectedCategories);
  }, [pois, selectedCategories]);

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };

  const mapOptions = useMemo(() => ({
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    gestureHandling: 'greedy', // Allows one-finger scrolling
  }), []);

  // Category filter handlers
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

  // Handle marker click
  const handleMarkerClick = (markerId) => {
    setActiveMarker(markerId === activeMarker ? null : markerId);
    // Close context menu if marker is clicked
    setContextMenu(null);
  };

  // Handle right-click on map
  const handleMapRightClick = (event) => {
    // Prevent default browser context menu
    event.domEvent.preventDefault();
    
    // Get the clicked location
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    // Show context menu at the clicked position
    setContextMenu({
      position: { lat, lng },
      pixelPosition: {
        x: event.domEvent.clientX,
        y: event.domEvent.clientY
      }
    });
  };
  // Handle long-press on mobile
  const handleMarkerLongPress = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    setContextMenu({
      position: { lat, lng },
      pixelPosition: {
        x: event.domEvent.clientX,
        y: event.domEvent.clientY
      }
    });
  };
  // Handle "Update my location to here" click
  const handleUpdateLocation = () => {
    if (contextMenu && onLocationUpdate) {
      onLocationUpdate(contextMenu.position.lat, contextMenu.position.lng);
      setContextMenu(null);
    }
  };

  // Close context menu when clicking elsewhere
  const handleMapClick = () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/d740929f-4fac-44d8-8d3a-248f11b38b2a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Map.jsx:66',message:'handleMapClick called',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    setContextMenu(null);
    // Don't close marker info windows on map click
  };

  if (!apiKey) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        color: '#666',
        fontSize: '16px'
      }}>
        Please set VITE_GOOGLE_MAPS_API_KEY in your .env file
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        options={mapOptions}
        onRightClick={handleMapRightClick}
        onClick={handleMapClick}
      >
        {/* Add the category filter component */}
        {availableCategories.length > 0 && (
          <POICategoryFilter
            categories={availableCategories}
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            onClearAll={handleClearAll}
            onSelectAll={handleSelectAll}
            categoryCounts={categoryCounts}
          />
        )}
        
        {/* Render user's current location marker */}
        {center && (
          <Marker
            position={center}
            icon={getUserLocationIcon()}
            title="Your Location"
          />
        )}


        {/* Render bus stop markers */}
        {stops.map((stop, index) => {
          // Handle different possible field names for coordinates
          const lat = stop.latitude || stop.lat || stop.location?.lat;
          const lng = stop.longitude || stop.lng || stop.location?.lng;
          
          if (!lat || !lng) return null;

          // Check if this is an origin stop (handle boolean true/false or string "true")
          const isOriginStop = stop.origin_stop === true || stop.origin_stop === 'true';
          const icon = getBusStopIcon(isOriginStop);
          const markerId = `stop-${index}`;
          const isActive = activeMarker === markerId;

          return (
            <React.Fragment key={markerId}>
              <Marker
                position={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
                icon={icon}
                title={stop.name || stop.stop_name || 'Bus Stop'}
                onClick={() => handleMarkerClick(markerId)}
              />
              {isActive && (
                <InfoWindow
                  position={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
                  onCloseClick={() => handleMarkerClick(markerId)}
                >
                  <div style={{ padding: '4px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>
                      {stop.stop_name || stop.name || 'Bus Stop'}
                    </div>
                    {stop.headsign && (
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        <strong>Headsign:</strong> {stop.headsign}
                      </div>
                    )}
                  </div>
                </InfoWindow>
              )}
            </React.Fragment>
          );
        })}


        {/* Render bus stop markers */}
        {/* Render filtered POI markers - now using filteredPois instead of pois */}
        {filteredPois.map((poi, index) => {
          // Handle different possible field names for coordinates
          const lat = poi.latitude || poi.lat || poi.location?.lat;
          const lng = poi.longitude || poi.lng || poi.location?.lng;
          
          if (!lat || !lng) return null;

          const amenity = poi.amenity || poi.category || '';

          const icon = getPOIIcon(amenity);
          const markerId = `poi-${index}`;
          const isActive = activeMarker === markerId;

          return (
            <React.Fragment key={markerId}>
              <Marker
                position={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
                icon={icon}
                title={poi.name || poi.poi_name || amenity || 'POI'}
                onClick={() => handleMarkerClick(markerId)}
              />
              {isActive && (
                <InfoWindow
                  position={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
                  onCloseClick={() => handleMarkerClick(markerId)}
                >
                  <div style={{ padding: '4px', maxWidth: '300px' }}>
                    {poi.name && (
                      <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>
                        {poi.name}
                      </div>
                    )}
                    {poi.amenity && (
                      <div style={{ fontSize: '14px', marginBottom: '6px', color: '#666' }}>
                        <strong>Amenity:</strong> {poi.amenity}
                      </div>
                    )}
                    {poi.num_stops_away !== undefined && poi.num_stops_away !== null && (
                      <div style={{ fontSize: '14px', marginBottom: '6px', color: '#666' }}>
                        <strong>Stops Away:</strong> {poi.num_stops_away}
                      </div>
                    )}
                    {poi.map_url && (
                      <div style={{ fontSize: '14px', marginTop: '8px' }}>
                        <a
                          href={poi.map_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#4285f4', textDecoration: 'none' }}
                          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                        >
                          View on Map →
                        </a>
                      </div>
                    )}
                  </div>
                </InfoWindow>
              )}
            </React.Fragment>
          );
        })}

        {/* Context Menu */}
        {contextMenu && (
          <InfoWindow
            position={contextMenu.position}
            onCloseClick={() => setContextMenu(null)}
          >
            <div 
              style={{ 
                padding: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#4285f4',
                fontWeight: '500'
              }}
              onClick={handleUpdateLocation}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f0f0f0';
                e.target.style.borderRadius = '4px';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Update my location to here
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;