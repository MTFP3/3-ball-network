/**
 * Live Coaching Dashboard - 3 Ball Network
 * Real-time coaching interface with AI integration
 */

class LiveCoachingDashboard {
  constructor() {
    this.gameState = {
      isLive: false,
      quarter: 4,
      timeRemaining: '8:42',
      homeScore: 78,
      awayScore: 82,
      homeTeam: 'Warriors',
      awayTeam: 'Lakers',
    };

    this.playerStats = new Map();
    this.aiInsights = {};
    this.connectionStatus = 'live';
    this.recordingMarkers = [];

    // AI Integration
    this.aiTracker = null;
    this.aiEnabled = false;
    this.liveAnalytics = {
      shotChart: new Map(),
      playerHeatMaps: new Map(),
      possessionAnalysis: [],
      performanceTrends: new Map(),
    };

    // Enhanced AI Analytics
    this.aiPerformanceMetrics = {
      fps: 30,
      accuracy: 94.2,
      memoryUsage: 256,
      latency: 85,
      trackingActive: true,
      ballTrackingActive: true,
      actionRecognitionActive: true,
      insightsActive: true,
    };

    this.trackingOverlays = {
      players: new Map(),
      ball: null,
      shotChart: [],
      heatMaps: new Map(),
    };

    this.advancedFeatures = {
      playerTracking: true,
      ballTracking: true,
      shotChart: false,
      heatMap: false,
      momentumAnalysis: true,
      fatigueDetection: true,
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeWebSocket();
    this.startGameClock();
    this.setupOfflineSupport();
    this.initializeAIAnalytics();
    this.connectAITracker();
    this.setupAdvancedFeatures();
    this.initializeAIPerformanceMonitor();
    this.setupTrackingOverlays();
    this.initializeAIChat();
    // Dashboard initialized
  }

  setupEventListeners() {
    // Control buttons
    document
      .getElementById('timeoutBtn')
      .addEventListener('click', () => this.callTimeout());
    document
      .getElementById('subBtn')
      .addEventListener('click', () => this.openSubstitutionDialog());
    document
      .getElementById('recordBtn')
      .addEventListener('click', () => this.toggleRecording());
    document
      .getElementById('shareBtn')
      .addEventListener('click', () => this.shareGame());

    // Video controls
    document
      .getElementById('replayBtn')
      .addEventListener('click', () => this.replayLastPlay());
    document
      .getElementById('markBtn')
      .addEventListener('click', () => this.markKeyMoment());
    document
      .getElementById('slowMoBtn')
      .addEventListener('click', () => this.toggleSlowMotion());

    // Player rows for detailed view
    document.querySelectorAll('.player-row').forEach(row => {
      row.addEventListener('click', e => {
        const playerId = e.currentTarget.dataset.player;
        this.showPlayerDetails(playerId);
      });
    });

    // Play cards for quick actions
    document.querySelectorAll('.play-card').forEach(card => {
      card.addEventListener('click', e => {
        const playType = e.currentTarget.dataset.play;
        this.executePlay(playType);
      });
    });

    // Keyboard shortcuts for coaches
    document.addEventListener('keydown', e => this.handleKeyboardShortcuts(e));

    // Touch gestures for mobile
    this.setupTouchGestures();
  }

  initializeWebSocket() {
    // WebSocket connection for real-time data
    const wsUrl = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsPort =
      window.location.port ||
      (window.location.protocol === 'https:' ? '443' : '80');

    try {
      this.ws = new WebSocket(
        `${wsUrl}//${window.location.hostname}:${wsPort}/live-coaching`
      );

      this.ws.onopen = () => {
        // Connected to live coaching server
        this.updateConnectionStatus('live');
      };

      this.ws.onmessage = event => {
        const data = JSON.parse(event.data);
        this.handleLiveData(data);
      };

      this.ws.onclose = () => {
        // Disconnected from server, attempting to reconnect
        this.updateConnectionStatus('reconnecting');
        setTimeout(() => this.initializeWebSocket(), 3000);
      };

      this.ws.onerror = () => {
        // WebSocket error occurred
        this.updateConnectionStatus('offline');
      };
    } catch {
      // WebSocket not available, using fallback polling
      this.startPolling();
    }
  }

  handleLiveData(data) {
    switch (data.type) {
      case 'gameUpdate':
        this.updateGameState(data.gameState);
        break;
      case 'playerStats':
        this.updatePlayerStats(data.stats);
        break;
      case 'aiInsight':
        this.updateAIInsights(data.insights);
        break;
      case 'videoEvent':
        this.handleVideoEvent(data.event);
        break;
      default:
      // Unknown data type received
    }
  }

  updateGameState(newState) {
    Object.assign(this.gameState, newState);

    // Update UI elements
    document.getElementById('quarter').textContent =
      `Q${this.gameState.quarter}`;
    document.getElementById('gameTime').textContent =
      this.gameState.timeRemaining;
    document.getElementById('homeScore').textContent = this.gameState.homeScore;
    document.getElementById('awayScore').textContent = this.gameState.awayScore;

    // Cache for offline use
    this.cacheGameState();
  }

  updatePlayerStats(stats) {
    stats.forEach(player => {
      this.playerStats.set(player.id, player);
      this.updatePlayerRow(player);
    });

    this.updateTeamStats();
  }

  updatePlayerRow(player) {
    const row = document.querySelector(`[data-player="${player.id}"]`);
    if (!row) {
      return;
    }

    const statsElement = row.querySelector('.player-stats');
    statsElement.innerHTML = `
            <span>${player.points}pts</span>
            <span>${player.rebounds}reb</span>
            <span>${player.assists}ast</span>
            <div class="performance-indicator ${this.getPerformanceClass(player.efficiency)}"></div>
        `;
  }

  getPerformanceClass(efficiency) {
    if (efficiency >= 15) {
      return 'performance-good';
    }
    if (efficiency >= 10) {
      return 'performance-average';
    }
    return 'performance-poor';
  }

  updateTeamStats() {
    // Calculate team statistics from player data
    const players = Array.from(this.playerStats.values());

    const totalFGM = players.reduce((sum, p) => sum + p.fieldGoalsMade, 0);
    const totalFGA = players.reduce((sum, p) => sum + p.fieldGoalsAttempted, 0);
    const fgPercentage =
      totalFGA > 0 ? Math.round((totalFGM / totalFGA) * 100) : 0;

    const total3PM = players.reduce((sum, p) => sum + p.threePointersMade, 0);
    const total3PA = players.reduce(
      (sum, p) => sum + p.threePointersAttempted,
      0
    );
    const threePtPercentage =
      total3PA > 0 ? Math.round((total3PM / total3PA) * 100) : 0;

    const totalRebounds = players.reduce((sum, p) => sum + p.rebounds, 0);
    const totalTurnovers = players.reduce((sum, p) => sum + p.turnovers, 0);

    document.getElementById('fgPercentage').textContent = `${fgPercentage}%`;
    document.getElementById('threePtPercentage').textContent =
      `${threePtPercentage}%`;
    document.getElementById('rebounds').textContent = totalRebounds;
    document.getElementById('turnovers').textContent = totalTurnovers;
  }

  updateAIInsights(insights) {
    this.aiInsights = insights;
    const container = document.getElementById('aiInsights');

    container.innerHTML = Object.entries(insights)
      .map(
        ([key, value]) => `
            <div class="insight-item">
                <span>${this.formatInsightLabel(key)}</span>
                <span class="insight-value">${value}</span>
            </div>
        `
      )
      .join('');
  }

  formatInsightLabel(key) {
    const labels = {
      shotAccuracy: 'Shot Accuracy',
      pace: 'Pace',
      fatigueLevel: 'Fatigue Level',
      momentum: 'Momentum',
      defensiveEfficiency: 'Defense',
      reboundingRate: 'Rebounding',
    };
    return labels[key] || key;
  }

  initializeAIAnalytics() {
    // Initialize AI-powered analytics
    this.aiAnalytics = {
      trackingActive: true,
      confidenceThreshold: 0.8,
      insights: {},
    };

    // Simulate AI insights for demo (replace with actual AI integration)
    this.simulateAIInsights();
  }

  simulateAIInsights() {
    if (!this.gameState.isLive) {
      return;
    }

    // Mock AI insights that would come from computer vision analysis
    const insights = {
      shotAccuracy: `${Math.round(50 + Math.random() * 30)}%`,
      pace: ['Slow', 'Medium', 'Fast'][Math.floor(Math.random() * 3)],
      fatigueLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      momentum: ['+Warriors', '+Lakers', 'Even'][Math.floor(Math.random() * 3)],
    };

    this.updateAIInsights(insights);

    // Update every 10 seconds
    setTimeout(() => this.simulateAIInsights(), 10000);
  }

  connectAITracker() {
    // Initialize AI Game Tracker
    if (window.AIGameTracker) {
      this.aiTracker = new window.AIGameTracker();
      this.aiEnabled = true;

      // Set up AI data handler
      this.aiTracker.onTrackingUpdate = data => {
        this.handleAIUpdate(data);
      };

      this.showNotification('AI tracking enabled', 'success');
    } else {
      this.showNotification('AI tracking not available', 'warning');
    }
  }

  handleAIUpdate(data) {
    // Process AI tracking data
    if (data.results) {
      this.processAIResults(data.results);
    }

    if (data.insights) {
      this.updateAIInsights(data.insights);
    }

    // Update live analytics
    this.updateLiveAnalytics(data);
  }

  processAIResults(results) {
    // Process player tracking
    if (results.players) {
      results.players.forEach(player => {
        this.updatePlayerPosition(player);
        this.analyzePlayerMovement(player);
      });
    }

    // Process ball tracking
    if (results.ball) {
      this.updateBallPosition(results.ball);
    }

    // Process detected actions
    if (results.actions) {
      results.actions.forEach(action => {
        this.processGameAction(action);
      });
    }
  }

  updatePlayerPosition(player) {
    // Update player position on court visualization
    const playerElement = document.querySelector(
      `[data-player="${player.id}"]`
    );
    if (playerElement) {
      // Add visual indicator for player activity
      playerElement.style.boxShadow =
        player.confidence > 0.9 ? '0 0 10px #4ade80' : '0 0 5px #fbbf24';
    }
  }

  analyzePlayerMovement(player) {
    // Analyze player movement patterns for fatigue detection
    if (!this.liveAnalytics.playerHeatMaps.has(player.id)) {
      this.liveAnalytics.playerHeatMaps.set(player.id, []);
    }

    const heatMap = this.liveAnalytics.playerHeatMaps.get(player.id);
    heatMap.push({
      x: player.position.x,
      y: player.position.y,
      timestamp: Date.now(),
    });

    // Keep only last 100 positions
    if (heatMap.length > 100) {
      heatMap.shift();
    }

    // Calculate movement intensity
    const movementIntensity = this.calculateMovementIntensity(heatMap);
    this.updatePlayerPerformanceIndicator(player.id, movementIntensity);
  }

  calculateMovementIntensity(positions) {
    if (positions.length < 2) {
      return 0;
    }

    let totalDistance = 0;
    for (let i = 1; i < positions.length; i++) {
      const dx = positions[i].x - positions[i - 1].x;
      const dy = positions[i].y - positions[i - 1].y;
      totalDistance += Math.sqrt(dx * dx + dy * dy);
    }

    return totalDistance / positions.length;
  }

  updatePlayerPerformanceIndicator(playerId, intensity) {
    const playerRow = document.querySelector(`[data-player="${playerId}"]`);
    if (!playerRow) {
      return;
    }

    const indicator = playerRow.querySelector('.performance-indicator');
    if (indicator) {
      // Update indicator based on movement intensity
      indicator.className = `performance-indicator ${
        intensity > 0.1
          ? 'performance-good'
          : intensity > 0.05
            ? 'performance-average'
            : 'performance-poor'
      }`;
    }
  }

  processGameAction(action) {
    switch (action.type) {
      case 'shot':
        this.processShotAction(action);
        break;
      case 'pass':
        this.processPassAction(action);
        break;
      case 'rebound':
        this.processReboundAction(action);
        break;
      case 'steal':
        this.processStealAction(action);
        break;
      case 'turnover':
        this.processTurnoverAction(action);
        break;
    }

    // Add to possession analysis
    this.liveAnalytics.possessionAnalysis.push({
      action,
      timestamp: Date.now(),
      gameTime: this.gameState.timeRemaining,
    });
  }

  processShotAction(action) {
    // Update shot chart
    if (!this.liveAnalytics.shotChart.has(action.playerId)) {
      this.liveAnalytics.shotChart.set(action.playerId, []);
    }

    const shots = this.liveAnalytics.shotChart.get(action.playerId);
    shots.push({
      position: action.position,
      made: action.made,
      shotType: action.shotType,
      timestamp: Date.now(),
    });

    // Update player stats
    this.updatePlayerShotStats(action.playerId, action);

    // Show instant feedback
    this.showShotFeedback(action);
  }

  updatePlayerShotStats(playerId, shotAction) {
    const playerRow = document.querySelector(`[data-player="${playerId}"]`);
    if (!playerRow) {
      return;
    }

    const statsElement = playerRow.querySelector('.player-stats');
    if (statsElement) {
      // Update points if shot was made
      if (shotAction.made) {
        const pointsSpan = statsElement.querySelector('span:first-child');
        if (pointsSpan) {
          const currentPoints = parseInt(pointsSpan.textContent);
          const additionalPoints = shotAction.shotType === '3PT' ? 3 : 2;
          pointsSpan.textContent = `${currentPoints + additionalPoints}pts`;
        }
      }
    }
  }

  showShotFeedback(action) {
    // Create visual feedback for shot
    const feedback = document.createElement('div');
    feedback.className = 'shot-feedback';
    feedback.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${action.made ? '#4ade80' : '#ef4444'};
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-size: 1.2rem;
      font-weight: bold;
      z-index: 10000;
      animation: fadeInOut 2s ease-in-out;
    `;

    feedback.textContent = action.made
      ? `${action.shotType} MADE!`
      : `${action.shotType} MISSED`;

    document.body.appendChild(feedback);

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      feedback.remove();
      style.remove();
    }, 2000);
  }

  updateLiveAnalytics(data) {
    // Update performance trends
    const timestamp = Date.now();

    if (data.insights) {
      this.liveAnalytics.performanceTrends.set(timestamp, {
        pace: data.insights.pace,
        shotAccuracy: data.insights.shotAccuracy,
        fatigueLevel: data.insights.fatigueLevel,
        momentum: data.insights.momentum,
      });
    }

    // Keep only last 10 minutes of trends
    const cutoff = timestamp - 10 * 60 * 1000;
    for (const [time] of this.liveAnalytics.performanceTrends) {
      if (time < cutoff) {
        this.liveAnalytics.performanceTrends.delete(time);
      }
    }
  }

  // Coaching Action Methods
  callTimeout() {
    // Timeout called
    this.sendCoachingAction('timeout', { timestamp: Date.now() });
    this.showNotification('Timeout called', 'success');
  }

  startAITracking() {
    if (this.aiTracker && !this.aiTracker.isTracking) {
      const gameConfig = {
        gameId: `game_${Date.now()}`,
        homeTeam: this.gameState.homeTeam,
        awayTeam: this.gameState.awayTeam,
        players: this.getActivePlayers(),
      };

      this.aiTracker.startTracking(gameConfig);
      this.showNotification('AI tracking started', 'success');

      // Update UI
      document.getElementById('recordBtn').textContent = 'AI Tracking';
      document.getElementById('recordBtn').classList.add('active');
    }
  }

  stopAITracking() {
    if (this.aiTracker && this.aiTracker.isTracking) {
      this.aiTracker.stopTracking();
      this.showNotification('AI tracking stopped', 'info');

      // Update UI
      document.getElementById('recordBtn').textContent = 'Record';
      document.getElementById('recordBtn').classList.remove('active');
    }
  }

  getActivePlayers() {
    // Get active players from the current roster
    const playerRows = document.querySelectorAll('.player-row');
    const players = [];

    playerRows.forEach(row => {
      const playerId = row.dataset.player;
      const playerName = row.querySelector('.player-name').textContent;
      players.push({
        id: playerId,
        name: playerName,
        team: 'home', // Simplified - in real app, determine from game state
      });
    });

    return players;
  }

  openSubstitutionDialog() {
    const modal = this.createModal(
      'Smart Substitution',
      this.getEnhancedSubstitutionContent()
    );
    document.body.appendChild(modal);
  }

  getEnhancedSubstitutionContent() {
    return `
      <div class="substitution-form">
        <div class="ai-recommendations" style="background: #2a2a2a; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
          <h4 style="color: #00b4d8; margin-bottom: 0.5rem;">AI Recommendations</h4>
          <div class="recommendation-item" style="margin-bottom: 0.5rem;">
            <span style="color: #fbbf24;">⚠️</span> #8 D. Williams showing fatigue - consider substitution
          </div>
          <div class="recommendation-item" style="margin-bottom: 0.5rem;">
            <span style="color: #4ade80;">✓</span> #12 K. Davis fresh and ready
          </div>
        </div>
        
        <div class="sub-section">
          <h4>Player Out</h4>
          <select id="playerOut" class="form-select" style="width: 100%; padding: 0.5rem; margin: 0.5rem 0; background: #1a1a1a; color: white; border: 1px solid #444; border-radius: 4px;">
            <option value="">Select player to substitute</option>
            <option value="23">J. Smith (#23) - Energy: High</option>
            <option value="15">M. Johnson (#15) - Energy: Medium</option>
            <option value="8" selected>D. Williams (#8) - Energy: Low ⚠️</option>
          </select>
        </div>
        
        <div class="sub-section">
          <h4>Player In</h4>
          <select id="playerIn" class="form-select" style="width: 100%; padding: 0.5rem; margin: 0.5rem 0; background: #1a1a1a; color: white; border: 1px solid #444; border-radius: 4px;">
            <option value="">Select substitute</option>
            <option value="12" selected>K. Davis (#12) - Energy: High ✓</option>
            <option value="7">R. Thompson (#7) - Energy: Medium</option>
            <option value="21">A. Miller (#21) - Energy: High</option>
          </select>
        </div>
        
        <button onclick="liveCoaching.executeSubstitution()" class="action-btn" style="background: #00b4d8; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 600; width: 100%; margin-top: 1rem;">
          Make Substitution
        </button>
      </div>
    `;
  }

  executeSubstitution() {
    const playerOut = document.getElementById('playerOut').value;
    const playerIn = document.getElementById('playerIn').value;

    if (!playerOut || !playerIn) {
      this.showNotification('Please select both players', 'error');
      return;
    }

    this.sendCoachingAction('substitution', { playerOut, playerIn });
    this.showNotification(
      `Substitution: #${playerOut} out, #${playerIn} in`,
      'success'
    );
    this.closeModal();
  }

  toggleRecording() {
    const btn = document.getElementById('recordBtn');
    if (btn.classList.contains('active')) {
      btn.classList.remove('active');
      btn.textContent = 'Record';
      this.stopRecording();
    } else {
      btn.classList.add('active');
      btn.textContent = 'Recording';
      this.startRecording();
    }
  }

  startRecording() {
    // Recording started
    this.recordingStartTime = Date.now();
  }

  stopRecording() {
    // Recording stopped
    const duration = Date.now() - this.recordingStartTime;
    this.showNotification(
      `Recording saved (${Math.round(duration / 1000)}s)`,
      'success'
    );
  }

  markKeyMoment() {
    const timestamp = Date.now();
    this.recordingMarkers.push({
      timestamp,
      gameTime: this.gameState.timeRemaining,
      quarter: this.gameState.quarter,
      type: 'manual',
    });

    this.showNotification('Key moment marked', 'success');
    // Key moment marked
  }

  replayLastPlay() {
    // Replaying last play
    // In a real implementation, this would trigger video replay
    this.showNotification('Replaying last 15 seconds', 'info');
  }

  toggleSlowMotion() {
    const video = document.getElementById('mainVideo');
    if (video.playbackRate === 1) {
      video.playbackRate = 0.5;
      document.getElementById('slowMoBtn').style.background = '#ff6b35';
    } else {
      video.playbackRate = 1;
      document.getElementById('slowMoBtn').style.background = '#00b4d8';
    }
  }

  executePlay(playType) {
    // Executing play
    this.sendCoachingAction('playCall', { playType, timestamp: Date.now() });
    this.showNotification(`Play called: ${playType}`, 'success');

    // Highlight the selected play
    document.querySelectorAll('.play-card').forEach(card => {
      card.style.background = '#2a2a2a';
    });
    document.querySelector(`[data-play="${playType}"]`).style.background =
      '#00b4d8';

    setTimeout(() => {
      document.querySelector(`[data-play="${playType}"]`).style.background =
        '#2a2a2a';
    }, 2000);
  }

  showPlayerDetails(playerId) {
    const player = this.playerStats.get(playerId);
    if (!player) {
      return;
    }

    const modal = this.createModal(
      `Player Details - #${playerId}`,
      this.getPlayerDetailsContent(player)
    );
    document.body.appendChild(modal);
  }

  getPlayerDetailsContent(player) {
    return `
            <div class="player-details">
                <div class="detail-section">
                    <h4>Current Game Stats</h4>
                    <div class="stats-row">
                        <span>Points: ${player.points || 0}</span>
                        <span>Rebounds: ${player.rebounds || 0}</span>
                        <span>Assists: ${player.assists || 0}</span>
                    </div>
                    <div class="stats-row">
                        <span>FG: ${player.fieldGoalsMade || 0}/${player.fieldGoalsAttempted || 0}</span>
                        <span>3PT: ${player.threePointersMade || 0}/${player.threePointersAttempted || 0}</span>
                        <span>FT: ${player.freeThrowsMade || 0}/${player.freeThrowsAttempted || 0}</span>
                    </div>
                </div>
                <div class="detail-section">
                    <h4>Performance Trends</h4>
                    <div class="trend-item">Energy Level: ${this.getEnergyLevel(player.id)}</div>
                    <div class="trend-item">Shot Confidence: ${this.getShotConfidence(player.id)}</div>
                    <div class="trend-item">Defensive Impact: ${this.getDefensiveImpact(player.id)}</div>
                </div>
            </div>
        `;
  }

  // Utility Methods
  setupTouchGestures() {
    let touchStartX, touchStartY;

    document.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', e => {
      if (!touchStartX || !touchStartY) {
        return;
      }

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Swipe gestures
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.replayLastPlay(); // Swipe right
        } else {
          this.markKeyMoment(); // Swipe left
        }
      }
    });
  }

  handleKeyboardShortcuts(e) {
    if (e.altKey) {
      switch (e.key) {
        case 't':
          e.preventDefault();
          this.callTimeout();
          break;
        case 's':
          e.preventDefault();
          this.openSubstitutionDialog();
          break;
        case 'm':
          e.preventDefault();
          this.markKeyMoment();
          break;
        case 'r':
          e.preventDefault();
          this.replayLastPlay();
          break;
      }
    }
  }

  updateConnectionStatus(status) {
    this.connectionStatus = status;
    const statusElement = document.getElementById('connectionStatus');

    statusElement.className = `connection-status connection-${status}`;

    switch (status) {
      case 'live':
        statusElement.textContent = '🔴 LIVE';
        break;
      case 'offline':
        statusElement.textContent = '⚫ OFFLINE';
        break;
      case 'reconnecting':
        statusElement.textContent = '🟡 RECONNECTING';
        break;
    }
  }

  // Offline Support
  setupOfflineSupport() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }

    // Cache critical data
    window.addEventListener('online', () => {
      this.syncOfflineData();
      this.updateConnectionStatus('live');
    });

    window.addEventListener('offline', () => {
      this.updateConnectionStatus('offline');
    });
  }

  cacheGameState() {
    localStorage.setItem('liveGameState', JSON.stringify(this.gameState));
    localStorage.setItem(
      'playerStats',
      JSON.stringify(Array.from(this.playerStats.entries()))
    );
  }

  syncOfflineData() {
    // Sync any offline actions when connection is restored
    const offlineActions = JSON.parse(
      localStorage.getItem('offlineActions') || '[]'
    );

    offlineActions.forEach(action => {
      this.sendCoachingAction(action.type, action.data);
    });

    localStorage.removeItem('offlineActions');
  }

  sendCoachingAction(type, data) {
    const action = { type, data, timestamp: Date.now() };

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(action));
    } else {
      // Store for offline sync
      const offlineActions = JSON.parse(
        localStorage.getItem('offlineActions') || '[]'
      );
      offlineActions.push(action);
      localStorage.setItem('offlineActions', JSON.stringify(offlineActions));
    }
  }

  // UI Helper Methods
  createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

    modal.innerHTML = `
            <div class="modal-content" style="background: #1a1a1a; padding: 2rem; border-radius: 12px; max-width: 500px; width: 90%; color: white;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3>${title}</h3>
                    <button onclick="liveCoaching.closeModal()" style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">×</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;

    modal.addEventListener('click', e => {
      if (e.target === modal) {
        this.closeModal();
      }
    });

    return modal;
  }

  closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.remove();
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#4ade80' : type === 'error' ? '#ef4444' : '#00b4d8'};
            color: ${type === 'success' ? '#000' : '#fff'};
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10001;
            font-weight: 600;
        `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = 'translateX(-50%) translateY(-100px)';
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  startGameClock() {
    // Simulate game clock (in real implementation, this would sync with actual game time)
    setInterval(() => {
      if (this.gameState.isLive) {
        // Update game time logic here
        // Game time update
      }
    }, 1000);
  }

  startPolling() {
    // Fallback polling for when WebSocket is not available
    setInterval(() => {
      if (navigator.onLine) {
        this.fetchGameData();
      }
    }, 5000);
  }

  async fetchGameData() {
    try {
      const response = await fetch('/api/live-game-data');
      const data = await response.json();
      this.handleLiveData(data);
    } catch {
      // Failed to fetch game data
    }
  }

  shareGame() {
    if (navigator.share) {
      navigator.share({
        title: `${this.gameState.homeTeam} vs ${this.gameState.awayTeam} - Live`,
        text: 'Watch this live basketball game on 3 Ball Network',
        url: window.location.href,
      });
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(window.location.href);
      this.showNotification('Game link copied to clipboard', 'success');
    }
  }

  // Mock data methods (replace with real data)
  getEnergyLevel() {
    return ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)];
  }

  getShotConfidence() {
    return ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)];
  }

  getDefensiveImpact() {
    return ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)];
  }

  // Advanced AI Performance Monitoring
  initializeAIPerformanceMonitor() {
    this.updateAIPerformanceDisplay();
    this.setupAIMonitorEvents();

    // Update AI performance metrics every second
    setInterval(() => {
      this.updateAIPerformanceMetrics();
    }, 1000);
  }

  setupAIMonitorEvents() {
    const monitorToggle = document.getElementById('aiMonitorToggle');
    const monitorContent = document.getElementById('aiMonitorContent');

    if (monitorToggle && monitorContent) {
      monitorToggle.addEventListener('click', () => {
        const isHidden = monitorContent.style.display === 'none';
        monitorContent.style.display = isHidden ? 'flex' : 'none';
        monitorToggle.textContent = isHidden ? '−' : '+';
      });
    }
  }

  updateAIPerformanceMetrics() {
    // Simulate realistic AI performance variations
    this.aiPerformanceMetrics.fps = Math.max(
      15,
      Math.min(30, this.aiPerformanceMetrics.fps + (Math.random() - 0.5) * 2)
    );

    this.aiPerformanceMetrics.accuracy = Math.max(
      85,
      Math.min(
        98,
        this.aiPerformanceMetrics.accuracy + (Math.random() - 0.5) * 1
      )
    );

    this.aiPerformanceMetrics.memoryUsage = Math.max(
      200,
      Math.min(
        400,
        this.aiPerformanceMetrics.memoryUsage + (Math.random() - 0.5) * 10
      )
    );

    this.aiPerformanceMetrics.latency = Math.max(
      50,
      Math.min(
        150,
        this.aiPerformanceMetrics.latency + (Math.random() - 0.5) * 10
      )
    );

    this.updateAIPerformanceDisplay();
  }

  updateAIPerformanceDisplay() {
    const fpsEl = document.getElementById('aiFps');
    const accuracyEl = document.getElementById('aiAccuracy');
    const memoryEl = document.getElementById('aiMemory');
    const latencyEl = document.getElementById('aiLatency');

    if (fpsEl) {
      fpsEl.textContent = Math.round(this.aiPerformanceMetrics.fps);
      fpsEl.style.color =
        this.aiPerformanceMetrics.fps > 25
          ? '#4ade80'
          : this.aiPerformanceMetrics.fps > 20
            ? '#fbbf24'
            : '#ef4444';
    }

    if (accuracyEl) {
      accuracyEl.textContent = `${this.aiPerformanceMetrics.accuracy.toFixed(1)}%`;
      accuracyEl.style.color =
        this.aiPerformanceMetrics.accuracy > 90
          ? '#4ade80'
          : this.aiPerformanceMetrics.accuracy > 85
            ? '#fbbf24'
            : '#ef4444';
    }

    if (memoryEl) {
      memoryEl.textContent = `${Math.round(this.aiPerformanceMetrics.memoryUsage)}MB`;
      memoryEl.style.color =
        this.aiPerformanceMetrics.memoryUsage < 300
          ? '#4ade80'
          : this.aiPerformanceMetrics.memoryUsage < 350
            ? '#fbbf24'
            : '#ef4444';
    }

    if (latencyEl) {
      latencyEl.textContent = `${Math.round(this.aiPerformanceMetrics.latency)}ms`;
      latencyEl.style.color =
        this.aiPerformanceMetrics.latency < 100
          ? '#4ade80'
          : this.aiPerformanceMetrics.latency < 120
            ? '#fbbf24'
            : '#ef4444';
    }
  }

  // Advanced Tracking Overlays
  setupTrackingOverlays() {
    this.setupAdvancedVideoControls();
    this.initializePlayerTrackingOverlay();
    this.initializeBallTrackingIndicator();
    this.initializeShotChartOverlay();
  }

  setupAdvancedVideoControls() {
    const trackingToggle = document.getElementById('trackingToggle');
    const ballToggle = document.getElementById('ballToggle');
    const shotChartToggle = document.getElementById('shotChartToggle');
    const heatMapToggle = document.getElementById('heatMapToggle');

    if (trackingToggle) {
      trackingToggle.addEventListener('click', () => {
        this.togglePlayerTracking();
      });
    }

    if (ballToggle) {
      ballToggle.addEventListener('click', () => {
        this.toggleBallTracking();
      });
    }

    if (shotChartToggle) {
      shotChartToggle.addEventListener('click', () => {
        this.toggleShotChart();
      });
    }

    if (heatMapToggle) {
      heatMapToggle.addEventListener('click', () => {
        this.toggleHeatMap();
      });
    }
  }

  togglePlayerTracking() {
    this.advancedFeatures.playerTracking =
      !this.advancedFeatures.playerTracking;
    const overlay = document.getElementById('playerTrackingOverlay');
    const button = document.getElementById('trackingToggle');

    if (overlay) {
      overlay.style.display = this.advancedFeatures.playerTracking
        ? 'block'
        : 'none';
    }

    if (button) {
      button.classList.toggle('active', this.advancedFeatures.playerTracking);
    }

    this.showNotification(
      `Player tracking ${this.advancedFeatures.playerTracking ? 'enabled' : 'disabled'}`,
      'info'
    );
  }

  toggleBallTracking() {
    this.advancedFeatures.ballTracking = !this.advancedFeatures.ballTracking;
    const indicator = document.getElementById('ballIndicator');
    const button = document.getElementById('ballToggle');

    if (indicator) {
      indicator.style.display = this.advancedFeatures.ballTracking
        ? 'block'
        : 'none';
    }

    if (button) {
      button.classList.toggle('active', this.advancedFeatures.ballTracking);
    }

    this.showNotification(
      `Ball tracking ${this.advancedFeatures.ballTracking ? 'enabled' : 'disabled'}`,
      'info'
    );
  }

  toggleShotChart() {
    this.advancedFeatures.shotChart = !this.advancedFeatures.shotChart;
    const overlay = document.getElementById('shotChartOverlay');
    const button = document.getElementById('shotChartToggle');

    if (overlay) {
      overlay.classList.toggle('active', this.advancedFeatures.shotChart);
    }

    if (button) {
      button.classList.toggle('active', this.advancedFeatures.shotChart);
    }

    this.showNotification(
      `Shot chart ${this.advancedFeatures.shotChart ? 'enabled' : 'disabled'}`,
      'info'
    );
  }

  toggleHeatMap() {
    this.advancedFeatures.heatMap = !this.advancedFeatures.heatMap;
    const button = document.getElementById('heatMapToggle');

    if (button) {
      button.classList.toggle('active', this.advancedFeatures.heatMap);
    }

    this.showNotification(
      `Heat map ${this.advancedFeatures.heatMap ? 'enabled' : 'disabled'}`,
      'info'
    );

    // TODO: Implement heat map visualization
  }

  // Enhanced Tracking Methods
  initializePlayerTrackingOverlay() {
    const overlay = document.getElementById('playerTrackingOverlay');
    if (!overlay) {
      return;
    }

    // Simulate player positions
    this.simulatePlayerPositions();

    // Update positions every 100ms for smooth tracking
    setInterval(() => {
      if (this.advancedFeatures.playerTracking) {
        this.updatePlayerTrackingOverlay();
      }
    }, 100);
  }

  simulatePlayerPositions() {
    const playerRows = document.querySelectorAll('.player-row');
    playerRows.forEach((row, index) => {
      const playerId = row.dataset.player;
      this.trackingOverlays.players.set(playerId, {
        x: 0.2 + index * 0.15 + Math.random() * 0.1,
        y: 0.3 + Math.random() * 0.4,
        confidence: 0.85 + Math.random() * 0.15,
        velocity: { x: 0, y: 0 },
      });
    });
  }

  updatePlayerTrackingOverlay() {
    const overlay = document.getElementById('playerTrackingOverlay');
    if (!overlay) {
      return;
    }

    // Clear existing dots
    overlay.innerHTML = '';

    // Add player dots
    this.trackingOverlays.players.forEach((position, playerId) => {
      const dot = document.createElement('div');
      dot.className = 'player-dot';
      dot.dataset.playerId = playerId;

      // Position the dot (normalized coordinates to percentage)
      dot.style.left = `${position.x * 100}%`;
      dot.style.top = `${position.y * 100}%`;

      // Set confidence-based styling
      if (position.confidence > 0.9) {
        dot.classList.add('high-confidence');
      } else if (position.confidence > 0.8) {
        dot.classList.add('medium-confidence');
      } else {
        dot.classList.add('low-confidence');
      }

      overlay.appendChild(dot);

      // Simulate slight movement
      position.x += (Math.random() - 0.5) * 0.002;
      position.y += (Math.random() - 0.5) * 0.002;
      position.x = Math.max(0.05, Math.min(0.95, position.x));
      position.y = Math.max(0.05, Math.min(0.95, position.y));
    });
  }

  initializeBallTrackingIndicator() {
    const indicator = document.getElementById('ballIndicator');
    if (!indicator) {
      return;
    }

    // Initialize ball position
    this.trackingOverlays.ball = {
      x: 0.5,
      y: 0.4,
      moving: false,
    };

    // Update ball position every 50ms for smooth tracking
    setInterval(() => {
      if (this.advancedFeatures.ballTracking) {
        this.updateBallTrackingIndicator();
      }
    }, 50);
  }

  updateBallTrackingIndicator() {
    const indicator = document.getElementById('ballIndicator');
    if (!indicator || !this.trackingOverlays.ball) {
      return;
    }

    const ball = this.trackingOverlays.ball;

    // Position the ball indicator
    indicator.style.left = `${ball.x * 100}%`;
    indicator.style.top = `${ball.y * 100}%`;

    // Add movement effects
    indicator.classList.toggle('moving', ball.moving);

    // Simulate ball movement
    if (Math.random() < 0.1) {
      // 10% chance to start moving
      ball.moving = true;
      setTimeout(() => {
        ball.moving = false;
      }, 2000);
    }

    if (ball.moving) {
      ball.x += (Math.random() - 0.5) * 0.01;
      ball.y += (Math.random() - 0.5) * 0.01;
    } else {
      ball.x += (Math.random() - 0.5) * 0.001;
      ball.y += (Math.random() - 0.5) * 0.001;
    }

    ball.x = Math.max(0.05, Math.min(0.95, ball.x));
    ball.y = Math.max(0.05, Math.min(0.95, ball.y));
  }

  initializeShotChartOverlay() {
    // Simulate some historical shots
    const shotTypes = ['made', 'missed'];
    const shots = [];

    for (let i = 0; i < 20; i++) {
      shots.push({
        x: 0.1 + Math.random() * 0.8,
        y: 0.1 + Math.random() * 0.8,
        type: shotTypes[Math.floor(Math.random() * shotTypes.length)],
        timestamp: Date.now() - Math.random() * 300000, // Last 5 minutes
      });
    }

    this.trackingOverlays.shotChart = shots;
    this.updateShotChartOverlay();
  }

  updateShotChartOverlay() {
    const overlay = document.getElementById('shotChartOverlay');
    if (!overlay) {
      return;
    }

    // Clear existing markers
    overlay.innerHTML = '';

    // Add shot markers
    this.trackingOverlays.shotChart.forEach((shot, index) => {
      const marker = document.createElement('div');
      marker.className = `shot-marker ${shot.type}`;
      marker.dataset.shotIndex = index;

      marker.style.left = `${shot.x * 100}%`;
      marker.style.top = `${shot.y * 100}%`;

      overlay.appendChild(marker);
    });
  }

  // Advanced AI Features Setup
  setupAdvancedFeatures() {
    this.startMomentumAnalysis();
    this.startFatigueDetection();
    this.startPerformanceAlerts();
  }

  startMomentumAnalysis() {
    setInterval(() => {
      this.analyzeMomentum();
    }, 5000); // Analyze every 5 seconds
  }

  analyzeMomentum() {
    // Simulate momentum analysis
    const teams = ['Warriors', 'Lakers'];
    const currentMomentum = teams[Math.floor(Math.random() * teams.length)];

    // Update momentum display
    const momentumElement = document.querySelector(
      '.insight-item:last-child .insight-value'
    );
    if (momentumElement) {
      momentumElement.textContent = `+${currentMomentum}`;
    }
  }

  startFatigueDetection() {
    setInterval(() => {
      this.detectPlayerFatigue();
    }, 10000); // Check every 10 seconds
  }

  detectPlayerFatigue() {
    const playerRows = document.querySelectorAll('.player-row');
    playerRows.forEach(row => {
      const playerId = row.dataset.player;
      const fatigueLevel = Math.random();

      if (fatigueLevel > 0.8) {
        // High fatigue
        this.showPerformanceAlert(
          `Player #${playerId} showing signs of fatigue`
        );
      }
    });
  }

  startPerformanceAlerts() {
    setInterval(() => {
      this.checkPerformanceThresholds();
    }, 15000); // Check every 15 seconds
  }

  checkPerformanceThresholds() {
    const alertChance = Math.random();

    if (alertChance > 0.85) {
      const alerts = [
        'Defensive intensity dropping - consider timeout',
        'Shot selection improving - good momentum',
        'Rebounding advantage detected',
        'Pace favoring your team',
        'Player matchup advantage identified',
      ];

      const alert = alerts[Math.floor(Math.random() * alerts.length)];
      this.showPerformanceAlert(alert);
    }
  }

  showPerformanceAlert(message) {
    const alertElement = document.createElement('div');
    alertElement.className = 'performance-alert';
    alertElement.textContent = message;

    document.body.appendChild(alertElement);

    // Remove alert after 5 seconds
    setTimeout(() => {
      alertElement.remove();
    }, 5000);
  }

  initializeAIChat() {
    // Initialize AI chat interface if available
    if (window.aiChat) {
      window.aiChat.setUserRole('coach');

      // Connect AI chat with live coaching data
      window.aiChat.contextData = {
        gameState: this.gameState,
        playerStats: this.playerStats,
        aiInsights: this.aiInsights,
      };

      // Set up real-time data updates for AI chat
      this.aiChatUpdateInterval = setInterval(() => {
        if (window.aiChat) {
          window.aiChat.contextData = {
            gameState: this.gameState,
            playerStats: Array.from(this.playerStats.entries()),
            aiInsights: this.aiInsights,
            connectionStatus: this.connectionStatus,
            trackingOverlays: this.trackingOverlays,
          };
        }
      }, 5000);

      // Add AI chat quick access button to coaching controls
      this.addAIChatButton();
    }
  }

  addAIChatButton() {
    const coachingControls = document.querySelector('.coaching-controls');
    if (coachingControls) {
      const aiChatBtn = document.createElement('button');
      aiChatBtn.id = 'aiChatBtn';
      aiChatBtn.className = 'control-btn ai-chat-btn';
      aiChatBtn.innerHTML =
        '<i class="fas fa-robot"></i><span>AI Assistant</span>';
      aiChatBtn.addEventListener('click', () => {
        if (window.aiChat) {
          window.aiChat.toggleChatVisibility();
        }
      });

      coachingControls.appendChild(aiChatBtn);
    }
  }
}

// Initialize the dashboard
const liveCoaching = new LiveCoachingDashboard();

// Global methods for HTML interactions
window.liveCoaching = liveCoaching;
