import theatreIcon from '../assets/icon/pin/theatre.png';
import barIcon from '../assets/icon/pin/bar.png';
import busIcon from '../assets/icon/pin/bus.png';
import cafeIcon from '../assets/icon/pin/cafe.png';
import churchIcon from '../assets/icon/pin/church.png';
import cinemaIcon from '../assets/icon/pin/cinema.png';
import eventCenterIcon from '../assets/icon/pin/event-center.png';
import groceryIcon from '../assets/icon/pin/grocery.png';
import libraryIcon from '../assets/icon/pin/library.png';
import musicCenterIcon from '../assets/icon/pin/music-center.png';
import mylocationIcon from '../assets/icon/pin/mylocation.png';
import pubIcon from '../assets/icon/pin/pub.png';
import restaurantIcon from '../assets/icon/pin/restaurant.png';
import socialCenterIcon from '../assets/icon/pin/social-center.png';

const iconWidth = 24; // adjust as needed
const iconHeight = 24; // adjust as needed

const iconConfigs = {
  theater: { url: theatreIcon, scaledSize: { width: iconWidth, height: iconHeight } },
  bar: { url: barIcon, scaledSize: { width: iconWidth, height: iconHeight } },
  bus: { url: busIcon, scaledSize: { width: iconWidth, height: iconHeight } },
  cafe: { url: cafeIcon, scaledSize: { width: iconWidth, height: iconHeight } },
  church: { url: churchIcon, scaledSize: { width: iconWidth, height: iconHeight } },
  cinema: { url: cinemaIcon, scaledSize: { width: iconWidth, height: iconHeight } },
  eventCenter: { url: eventCenterIcon, scaledSize: { width: iconWidth, height: iconHeight } },
  grocery: { url: groceryIcon, scaledSize: { width: iconWidth, height: iconHeight } },
  library: { url: libraryIcon, scaledSize: { width: iconWidth, height: iconHeight } },
  musicCenter: { url: musicCenterIcon, scaledSize: { width: iconWidth, height: iconHeight } },
  mylocation: { url: mylocationIcon, scaledSize: { width: iconWidth, height: iconHeight } },
  pub: { url: pubIcon, scaledSize: { width: iconWidth, height: iconHeight } },
  restaurant: { url: restaurantIcon, scaledSize: { width: iconWidth, height: iconHeight } },
  socialCenter: { url: socialCenterIcon, scaledSize: { width: iconWidth, height: iconHeight } },
};

// Google Maps icon base URL for custom icons
// We'll use Material Icons or emoji as fallback
const ICON_BASE = 'https://maps.google.com/mapfiles/ms/icons/';
const iconMap = {};

// Dynamically import all PNG files from the icons folder
const iconContext = import.meta.glob('./assets/icons/*.png', { eager: true });
const iconPin = import.meta.glob('./assets/icons/pin/*.png', { eager: true });

/**
 * Get icon URL for a bus stop
 * @param {boolean} isOriginStop - Whether this is an origin stop (origin_stop=true)
 * @returns {Object} Icon configuration object
 */
export function getBusStopIcon(isOriginStop = false) {
  const iconUrl = isOriginStop 
    ? busIcon  // use your bus icon for origin stops
    : busIcon; // or use a different icon for regular stops
  
  return {
    url: iconUrl,
    scaledSize: { width: iconWidth, height: iconHeight },
  };
}

/**
 * Get icon URL for a POI based on its amenity_category
 * @param {string} amenity - The amenity category from the POI
 * @returns {Object} Icon configuration object
 */
export function getPOIIcon(amenity) {
  if (!amenity) {
    return {
      url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      scaledSize: { width: iconWidth, height: iconHeight },
    };
  }

  // Normalize category: lowercase, trim, replace spaces/underscores with single space
  const category = amenity
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, ' ');

  // Map categories to appropriate icons
  const iconMap = {
    'restaurant': restaurantIcon,
    'cafe': cafeIcon,
    'bar': barIcon,
    'pub': pubIcon,
    'marketplace': groceryIcon,
    'theatre': theatreIcon,
    'cinema': cinemaIcon,
    'music venue': musicCenterIcon,
    'events venue': eventCenterIcon,
    'library': libraryIcon,
    'place of worship': churchIcon,
    'social centre': socialCenterIcon,
    'bus': busIcon,
    'my location': mylocationIcon,
    'location': mylocationIcon,
  };

  return iconMap[category] || {
    url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    scaledSize: { width: iconWidth, height: iconHeight },
  };
}

export function getUserLocationIcon() {
  return {
    url: mylocationIcon,
    scaledSize: { width: iconWidth, height: iconHeight },
  };
}