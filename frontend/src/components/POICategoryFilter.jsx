import React from 'react';
import '../styles/POICategoryFilter.css';

const POICategoryFilter = ({ 
  categories, 
  selectedCategories, 
  onToggleCategory,
  onClearAll,
  onSelectAll,
  categoryCounts 
}) => {
  return (
    <div className="poi-filter-container">
      <div className="poi-filter-header">
        <span className="poi-filter-title">Points of Interest</span>
        <span className="poi-filter-count">
  {selectedCategories.size} {selectedCategories.size === 1 ? 'category' : 'categories'} selected
</span>
      </div>
      
      <div className="poi-filter-list">
        {categories.map(category => (
          <div
            key={category}
            className={`poi-filter-item ${selectedCategories.has(category) ? 'selected' : ''}`}
            onClick={() => onToggleCategory(category)}
          >
            <span className={`poi-filter-dot ${selectedCategories.has(category) ? 'selected' : ''}`} />
            <span className="poi-filter-name">
              {category}
            </span>
            <span className="poi-filter-badge">
              {categoryCounts[category] || 0}
            </span>
          </div>
        ))}
      </div>
      
      {selectedCategories.size > 0 && (
        <div className="poi-filter-actions">
          <button
            className="poi-filter-btn clear"
            onClick={onClearAll}
          >
            Clear all
          </button>
          {selectedCategories.size !== categories.length && (
            <button
              className="poi-filter-btn select-all"
              onClick={onSelectAll}
            >
              Select all
            </button>
          )}
        </div>
      )}

      {/* Feedback section */}
        <div className="feedback-section">
          <span>We'd love your feedback! </span>
          <a 
            href="https://forms.gle/d7ohy5Aktd9HHmtP7"
            target="_blank"
            rel="noopener noreferrer"
            className="feedback-link"
          >
            Tell us what you think
          </a>
        </div>
    </div>
  );
};

export default POICategoryFilter;