# OneBus-Vibed

A web frontend for viewing bus stops and points of interest (POIs) on an interactive map based on your current location.

## Features

- Automatically detects your current location using browser geolocation
- Fetches nearby bus stops and POIs from the OneBus API
- Displays results on a Google Map with different icons for:
  - Bus stops (blue bus icon)
  - POIs (category-specific icons based on amenity_category)
- Clean, modern UI with responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

3. Get a Google Maps API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Maps JavaScript API
   - Create credentials (API Key)
   - Add the API key to your `.env` file

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## API

The application connects to the OneBus API at:
`http://onebus.us-east-2.elasticbeanstalk.com/api/`

It sends a POST request with your latitude and longitude to fetch nearby stops and POIs.

## Technologies

- React 18
- Vite
- Google Maps JavaScript API (via @react-google-maps/api)
- Modern CSS with responsive design
