/**
 * Interactive Shot Chart Visualization
 * Real-time basketball shot analysis and heat map visualization
 */

class ShotChartVisualizer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      width: options.width || 600,
      height: options.height || 600,
      interactive: options.interactive !== false,
      showHeatMap: options.showHeatMap !== false,
      showZones: options.showZones !== false,
      ...options
    };
    
    this.setupCanvas();
    this.setupEventListeners();
    this.courtData = this.defineCourtData();
    this.shots = [];
    this.heatMapData = [];
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;
    this.canvas.style.border = '2px solid #333';
    this.canvas.style.borderRadius = '8px';
    this.canvas.style.background = '#2a4d3a'; // Basketball court green
    this.canvas.style.cursor = 'crosshair';
    
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    
    // Add controls
    this.addControls();
  }

  addControls() {
    const controls = document.createElement('div');
    controls.className = 'shot-chart-controls';
    controls.style.marginTop = '10px';
    controls.style.display = 'flex';
    controls.style.gap = '10px';
    controls.style.flexWrap = 'wrap';
    
    controls.innerHTML = `
      <button id="toggleHeatMap" class="btn btn-sm btn-secondary">
        🔥 Toggle Heat Map
      </button>
      <button id="toggleZones" class="btn btn-sm btn-secondary">
        🎯 Toggle Zones
      </button>
      <button id="clearShots" class="btn btn-sm btn-danger">
        🗑️ Clear Shots
      </button>
      <button id="exportData" class="btn btn-sm btn-primary">
        📊 Export Data
      </button>
      <select id="viewMode" class="form-select" style="width: auto;">
        <option value="all">All Shots</option>
        <option value="made">Made Shots</option>
        <option value="missed">Missed Shots</option>
        <option value="recent">Last 10 Shots</option>
      </select>
      <div class="shot-stats" style="margin-left: auto;">
        <span id="shotCount">0 shots</span>
        <span id="shootingPct" style="margin-left: 10px;">0.0%</span>
      </div>
    `;
    
    this.container.appendChild(controls);
    this.setupControlEvents();
  }

  setupControlEvents() {
    document.getElementById('toggleHeatMap').addEventListener('click', () => {
      this.options.showHeatMap = !this.options.showHeatMap;
      this.render();
    });

    document.getElementById('toggleZones').addEventListener('click', () => {
      this.options.showZones = !this.options.showZones;
      this.render();
    });

    document.getElementById('clearShots').addEventListener('click', () => {
      this.clearShots();
    });

    document.getElementById('exportData').addEventListener('click', () => {
      this.exportShotData();
    });

    document.getElementById('viewMode').addEventListener('change', (e) => {
      this.filterMode = e.target.value;
      this.render();
    });
  }

  setupEventListeners() {
    if (this.options.interactive) {
      this.canvas.addEventListener('click', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.canvas.width;
        const y = 1 - ((e.clientY - rect.top) / this.canvas.height); // Flip Y coordinate
        
        this.addShot(x, y, true); // Assume made shot for demo
      });

      this.canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.canvas.width;
        const y = 1 - ((e.clientY - rect.top) / this.canvas.height);
        
        this.addShot(x, y, false); // Missed shot
      });
    }
  }

  defineCourtData() {
    return {
      // Half-court dimensions (normalized 0-1)
      court: {
        width: 1.0,
        height: 1.0
      },
      
      // Key/Paint area
      key: {
        x: 0.31,
        y: 0,
        width: 0.38,
        height: 0.19
      },
      
      // Free throw circle
      freeThrowCircle: {
        centerX: 0.5,
        centerY: 0.19,
        radius: 0.12
      },
      
      // Three-point line
      threePointLine: [
        // Corner threes
        { x: 0.22, y: 0 }, { x: 0.22, y: 0.14 },
        { x: 0.78, y: 0 }, { x: 0.78, y: 0.14 },
        // Arc (simplified with line segments)
        { x: 0.22, y: 0.14 }, { x: 0.15, y: 0.25 },
        { x: 0.12, y: 0.35 }, { x: 0.15, y: 0.45 },
        { x: 0.25, y: 0.52 }, { x: 0.35, y: 0.55 },
        { x: 0.5, y: 0.56 }, { x: 0.65, y: 0.55 },
        { x: 0.75, y: 0.52 }, { x: 0.85, y: 0.45 },
        { x: 0.88, y: 0.35 }, { x: 0.85, y: 0.25 },
        { x: 0.78, y: 0.14 }
      ],
      
      // Basket
      basket: {
        x: 0.5,
        y: 0.05,
        radius: 0.015
      },
      
      // Shooting zones
      zones: {
        'paint': { 
          polygon: [[0.31, 0], [0.69, 0], [0.69, 0.19], [0.31, 0.19]],
          color: 'rgba(255, 0, 0, 0.1)'
        },
        'left-corner-3': { 
          polygon: [[0, 0], [0.22, 0], [0.22, 0.14], [0, 0.14]],
          color: 'rgba(0, 255, 0, 0.1)'
        },
        'right-corner-3': { 
          polygon: [[0.78, 0], [1, 0], [1, 0.14], [0.78, 0.14]],
          color: 'rgba(0, 255, 0, 0.1)'
        }
      }
    };
  }

  addShot(x, y, made, metadata = {}) {
    const shot = {
      id: Date.now() + Math.random(),
      x,
      y,
      made,
      timestamp: Date.now(),
      zone: this.getZone(x, y),
      distance: this.calculateDistance(x, y),
      ...metadata
    };
    
    this.shots.push(shot);
    this.updateHeatMap();
    this.updateStats();
    this.render();
    
    // Emit event for external listeners
    this.container.dispatchEvent(new CustomEvent('shotAdded', { 
      detail: shot 
    }));
  }

  getZone(x, y) {
    // Paint
    if (x >= 0.31 && x <= 0.69 && y >= 0 && y <= 0.19) return 'paint';
    
    // Corner threes
    if (x <= 0.22 && y <= 0.14) return 'left-corner-3';
    if (x >= 0.78 && y <= 0.14) return 'right-corner-3';
    
    // Three-point range (simplified)
    const distance = this.calculateDistance(x, y);
    if (distance >= 0.238) return 'three-point';
    
    // Mid-range
    if (y >= 0.19) return 'mid-range';
    
    return 'close-range';
  }

  calculateDistance(x, y) {
    const basketX = 0.5;
    const basketY = 0.05;
    return Math.sqrt(Math.pow(x - basketX, 2) + Math.pow(y - basketY, 2));
  }

  updateHeatMap() {
    // Create heat map data for visualization
    this.heatMapData = [];
    const gridSize = 20;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = i / (gridSize - 1);
        const y = j / (gridSize - 1);
        
        // Find nearby shots
        const nearbyShots = this.shots.filter(shot => {
          const distance = Math.sqrt(
            Math.pow(shot.x - x, 2) + Math.pow(shot.y - y, 2)
          );
          return distance < 0.1; // Within 10% of court
        });
        
        if (nearbyShots.length > 0) {
          const madeShots = nearbyShots.filter(shot => shot.made).length;
          const intensity = nearbyShots.length;
          const efficiency = madeShots / nearbyShots.length;
          
          this.heatMapData.push({
            x, y, intensity, efficiency,
            attempts: nearbyShots.length,
            makes: madeShots
          });
        }
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw court
    this.drawCourt();
    
    // Draw zones if enabled
    if (this.options.showZones) {
      this.drawZones();
    }
    
    // Draw heat map if enabled
    if (this.options.showHeatMap && this.heatMapData.length > 0) {
      this.drawHeatMap();
    }
    
    // Draw shots
    this.drawShots();
    
    // Draw court lines last (on top)
    this.drawCourtLines();
  }

  drawCourt() {
    const { width, height } = this.canvas;
    
    // Court background
    this.ctx.fillStyle = '#2a4d3a';
    this.ctx.fillRect(0, 0, width, height);
  }

  drawCourtLines() {
    const { width, height } = this.canvas;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    
    // Court outline
    this.ctx.strokeRect(0, 0, width, height);
    
    // Key/Paint
    const key = this.courtData.key;
    this.ctx.strokeRect(
      key.x * width, 
      (1 - key.height) * height, 
      key.width * width, 
      key.height * height
    );
    
    // Free throw circle
    const ft = this.courtData.freeThrowCircle;
    this.ctx.beginPath();
    this.ctx.arc(
      ft.centerX * width, 
      (1 - ft.centerY) * height, 
      ft.radius * width, 
      0, Math.PI * 2
    );
    this.ctx.stroke();
    
    // Three-point line
    this.ctx.beginPath();
    const threePoint = this.courtData.threePointLine;
    threePoint.forEach((point, index) => {
      const x = point.x * width;
      const y = (1 - point.y) * height;
      if (index === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });
    this.ctx.stroke();
    
    // Basket
    const basket = this.courtData.basket;
    this.ctx.fillStyle = '#ff6600';
    this.ctx.beginPath();
    this.ctx.arc(
      basket.x * width, 
      (1 - basket.y) * height, 
      basket.radius * width, 
      0, Math.PI * 2
    );
    this.ctx.fill();
  }

  drawZones() {
    Object.values(this.courtData.zones).forEach(zone => {
      this.ctx.fillStyle = zone.color;
      this.ctx.beginPath();
      zone.polygon.forEach((point, index) => {
        const x = point[0] * this.canvas.width;
        const y = (1 - point[1]) * this.canvas.height;
        if (index === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      });
      this.ctx.closePath();
      this.ctx.fill();
    });
  }

  drawHeatMap() {
    this.heatMapData.forEach(point => {
      const x = point.x * this.canvas.width;
      const y = (1 - point.y) * this.canvas.height;
      const size = Math.max(5, point.intensity * 8);
      
      // Color based on efficiency
      const alpha = Math.min(0.7, point.intensity * 0.2);
      if (point.efficiency > 0.5) {
        this.ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
      } else {
        this.ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
      }
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  drawShots() {
    const filteredShots = this.getFilteredShots();
    
    filteredShots.forEach((shot, index) => {
      const x = shot.x * this.canvas.width;
      const y = (1 - shot.y) * this.canvas.height;
      
      // Shot appearance
      const radius = 4;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      
      if (shot.made) {
        this.ctx.fillStyle = '#00ff00';
        this.ctx.strokeStyle = '#004400';
      } else {
        this.ctx.fillStyle = '#ff0000';
        this.ctx.strokeStyle = '#440000';
      }
      
      this.ctx.fill();
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
      
      // Shot number for recent shots
      if (this.filterMode === 'recent' || filteredShots.length <= 20) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText((index + 1).toString(), x, y + 3);
      }
    });
  }

  getFilteredShots() {
    switch (this.filterMode) {
      case 'made':
        return this.shots.filter(shot => shot.made);
      case 'missed':
        return this.shots.filter(shot => !shot.made);
      case 'recent':
        return this.shots.slice(-10);
      default:
        return this.shots;
    }
  }

  updateStats() {
    const shotCount = this.shots.length;
    const madeShots = this.shots.filter(shot => shot.made).length;
    const percentage = shotCount > 0 ? (madeShots / shotCount * 100).toFixed(1) : '0.0';
    
    document.getElementById('shotCount').textContent = `${shotCount} shots`;
    document.getElementById('shootingPct').textContent = `${percentage}%`;
  }

  clearShots() {
    this.shots = [];
    this.heatMapData = [];
    this.updateStats();
    this.render();
  }

  exportShotData() {
    const data = {
      shots: this.shots,
      summary: {
        total: this.shots.length,
        made: this.shots.filter(s => s.made).length,
        percentage: this.shots.length > 0 ? 
          (this.shots.filter(s => s.made).length / this.shots.length * 100) : 0
      },
      zoneBreakdown: this.getZoneBreakdown()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shot-chart-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  getZoneBreakdown() {
    const zones = {};
    this.shots.forEach(shot => {
      if (!zones[shot.zone]) {
        zones[shot.zone] = { attempts: 0, makes: 0, percentage: 0 };
      }
      zones[shot.zone].attempts++;
      if (shot.made) zones[shot.zone].makes++;
    });
    
    Object.keys(zones).forEach(zone => {
      zones[zone].percentage = zones[zone].attempts > 0 ? 
        (zones[zone].makes / zones[zone].attempts * 100) : 0;
    });
    
    return zones;
  }

  // Public methods for external integration
  loadShotData(shots) {
    this.shots = shots.map(shot => ({
      ...shot,
      id: shot.id || Date.now() + Math.random(),
      zone: shot.zone || this.getZone(shot.x, shot.y),
      distance: shot.distance || this.calculateDistance(shot.x, shot.y)
    }));
    this.updateHeatMap();
    this.updateStats();
    this.render();
  }

  getShotAnalytics() {
    return {
      total: this.shots.length,
      made: this.shots.filter(s => s.made).length,
      percentage: this.shots.length > 0 ? 
        (this.shots.filter(s => s.made).length / this.shots.length * 100) : 0,
      zoneBreakdown: this.getZoneBreakdown(),
      averageDistance: this.shots.length > 0 ? 
        this.shots.reduce((sum, shot) => sum + shot.distance, 0) / this.shots.length : 0,
      preferredZones: this.getPreferredZones()
    };
  }

  getPreferredZones() {
    const zoneBreakdown = this.getZoneBreakdown();
    return Object.entries(zoneBreakdown)
      .filter(([zone, stats]) => stats.attempts >= 3)
      .sort((a, b) => b[1].percentage - a[1].percentage)
      .slice(0, 3)
      .map(([zone, stats]) => ({ zone, ...stats }));
  }
}

// Basketball court CSS styles
const shotChartStyles = `
  .shot-chart-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    padding: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    margin-top: 10px;
  }

  .shot-chart-controls .btn {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s;
  }

  .shot-chart-controls .btn:hover {
    transform: translateY(-1px);
  }

  .shot-chart-controls .btn-sm {
    padding: 4px 8px;
    font-size: 11px;
  }

  .shot-chart-controls .btn-secondary {
    background: #6c757d;
    color: white;
  }

  .shot-chart-controls .btn-danger {
    background: #dc3545;
    color: white;
  }

  .shot-chart-controls .btn-primary {
    background: #007bff;
    color: white;
  }

  .shot-chart-controls .form-select {
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
  }

  .shot-stats {
    color: #e0e0e0;
    font-size: 14px;
    font-weight: 500;
  }
`;

// Inject styles
if (!document.querySelector('#shot-chart-styles')) {
  const style = document.createElement('style');
  style.id = 'shot-chart-styles';
  style.textContent = shotChartStyles;
  document.head.appendChild(style);
}

export { ShotChartVisualizer };
export default ShotChartVisualizer;
