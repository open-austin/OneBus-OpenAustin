const icons = [
  'theater', 'bar', 'bus', 'cafe', 'church', 'cinema', 
  'event-center', 'grocery', 'library', 'music-center', 
  'mylocation', 'pub', 'restaurant', 'social-center'
];

// Generate imports
const imports = icons.map(icon => {
  const camelCase = icon.split('-').map((word, i) => 
    i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
  ).join('');
  return `import ${camelCase}Icon from '../../assets/icon/pin/${icon}.png';`;
}).join('\n');

// Generate configs
const configs = icons.map(icon => {
  const camelCase = icon.split('-').map((word, i) => 
    i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
  ).join('');
  return `const ${camelCase}IconConfig = {
  url: ${camelCase}Icon,
  scaledSize: { width: 32, height: 32 },
};`;
}).join('\n\n');

console.log('=== IMPORTS ===\n' + imports);
console.log('\n=== CONFIGS ===\n' + configs);