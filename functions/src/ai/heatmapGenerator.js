// heatmapGenerator.js

export function generateHeatmap(events, type = 'shot') {
  console.log(`📊 Generating ${type} heatmap...`);

  const zones = [
    'paint', 'midrange-left', 'midrange-right',
    'left-corner-3', 'right-corner-3', 'top-of-key',
    'wing-left', 'wing-right'
  ];

  const map = {};
  zones.forEach(z => map[z] = 0);

  events.forEach(event => {
    if (map[event.zone] !== undefined) map[event.zone]++;
  });

  return map;
}

export function generateReboundHeatmap(rebounds) {
  console.log("🟢 Generating rebound heatmap...");

  const zones = [
    'paint', 'baseline-left', 'baseline-right',
    'elbow-left', 'elbow-right', 'free-throw-line',
    'top-of-key', 'wing-left', 'wing-right'
  ];

  const map = {};
  zones.forEach(z => map[z] = 0);

  rebounds.forEach(r => {
    if (map[r.zone] !== undefined) map[r.zone]++;
  });

  return map;
}

// Test block
const testEvents = [
  { zone: 'paint' }, { zone: 'left-corner-3' }, { zone: 'paint' }, { zone: 'top-of-key' }
];

const testOutput = generateHeatmap(testEvents, 'shot');
console.log("TEST HEATMAP:", testOutput);
