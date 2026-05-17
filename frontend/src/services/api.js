const API_BASE_URL = 'https://onebus-oa.onrender.com/api/';

/**
 * Fetches bus stops and POIs from the OneBus API
 * @param {number|string} latitude - User's latitude
 * @param {number|string} longitude - User's longitude
 * @returns {Promise<{stops: Array, pois: Array}>} API response with stops and pois
 */
export async function fetchStopsAndPOIs(latitude, longitude) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: String(latitude),
        longitude: String(longitude),
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      stops: data.stops || [],
      pois: data.pois || [],
    };
  } catch (error) {
    console.error('Error fetching stops and POIs:', error);
    throw error;
  }
}
