// Extract unique categories from POIs
export const extractUniqueCategories = (pois) => {
  if (!pois || pois.length === 0) return [];
  
  const categories = [...new Set(
    pois
      .map(poi => poi.amenity_category || poi.category || 'other')
      .filter(category => category && category.trim() !== '')
  )].sort();
  
  return categories;
};

// Filter POIs by selected categories
export const filterPoisByCategories = (pois, selectedCategories) => {
  if (!pois || selectedCategories.size === 0) return [];
  
  return pois.filter(poi => {
    const category = poi.amenity_category || poi.category || 'other';
    return selectedCategories.has(category);
  });
};

// Get default categories (prioritize 'restaurant')
export const getDefaultCategories = (categories) => {
  if (categories.includes('restaurant')) {
    return new Set(['restaurant']);
  } else if (categories.length > 0) {
    return new Set([categories[0]]);
  }
  return new Set();
};

// Get count of POIs per category
export const getCategoryCounts = (pois) => {
  const counts = {};
  pois.forEach(poi => {
    const category = poi.amenity_category || poi.category || 'other';
    counts[category] = (counts[category] || 0) + 1;
  });
  return counts;
};