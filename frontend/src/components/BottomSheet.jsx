import React, { useEffect } from 'react';
import '../styles/BottomSheet.css';

const BottomSheet = ({ isOpen, onClose, stop }) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!stop) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className={`bottom-sheet-backdrop ${isOpen ? 'backdrop-enter' : 'backdrop-exit'}`}
          onClick={handleBackdropClick}
        />
      )}

      {/* Bottom Sheet */}
      <div className="bottom-sheet-container">
        <div className="bottom-sheet-wrapper">
          <div 
            className={`bottom-sheet-panel ${isOpen ? 'bottom-sheet-enter' : 'bottom-sheet-exit'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <h3 className="bottom-sheet-title">
              {stop.stop_name || stop.name || 'Bus Stop'}
            </h3>

            {/* Content */}
            <div className="bottom-sheet-content">
              {stop.headsign && (
                <div className="bottom-sheet-text">
                  <strong>Headsign:</strong> {stop.headsign}
                </div>
              )}

              {stop.routes && stop.routes.length > 0 && (
                <div className="bottom-sheet-text">
                  <strong>Routes:</strong> {stop.routes.join(', ')}
                </div>
              )}

              {stop.distance && (
                <div className="bottom-sheet-text">
                  <strong>Distance:</strong> {stop.distance} miles
                </div>
              )}

              {stop.address && (
                <div className="bottom-sheet-text">
                  <strong>Address:</strong> {stop.address}
                </div>
              )}

              {stop.wheelchair_accessible && (
                <div className="bottom-sheet-accessible">
                  ♿ Wheelchair accessible
                </div>
              )}

              {stop.arrival_time && (
                <div className="bottom-sheet-text">
                  <strong>Next arrival:</strong> {stop.arrival_time}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="bottom-sheet-buttons">
              <button
                onClick={() => {
                  console.log('Get directions to:', stop);
                  // Add your directions logic here
                }}
                className="btn-primary"
              >
                Get Directions
              </button>
              
              <button
                onClick={onClose}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomSheet;