import React from 'react';
import { useEffect } from 'react';

const LocationButton = ({ onClick, loading, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="location-button"
      style={{
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '600',
        backgroundColor: '#4285f4',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.target.style.backgroundColor = '#357ae8';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.target.style.backgroundColor = '#4285f4';
        }
      }}
    >
      {loading ? 'Loading...' : 'Get My Location'}
    </button>
  );
};

export default LocationButton;
