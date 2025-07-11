/**
 * Live Coaching WebSocket Server - 3 Ball Network
 * Real-time communication server for live coaching features
 */

const WebSocket = require('ws');
const http = require('http');
const express = require('express');

class LiveCoachingServer {
  constructor(port = 8080) {
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });

    this.activeGames = new Map();
    this.connectedClients = new Map();
    this.gameStatistics = new Map();
    this.aiDataBuffer = new Map(); // Buffer AI data for offline clients
    this.performanceMetrics = new Map();

    // Enhanced server capabilities
    this.advancedFeatures = {
      multiGameSupport: true,
      realTimeAnalytics: true,
      advancedStatistics: true,
      predictiveAnalytics: true,
      collaborativeCoaching: true,
    };

    // Performance monitoring
    this.serverMetrics = {
      activeConnections: 0,
      messagesPerSecond: 0,
      averageLatency: 0,
      memoryUsage: 0,
      cpuUsage: 0,
    };

    // Advanced analytics engine
    this.analyticsEngine = {
      realTimeCalculations: new Map(),
      historicalTrends: new Map(),
      predictiveModels: new Map(),
      alertThresholds: new Map(),
    };

    this.init();
  }

  init() {
    this.setupExpress();
    this.setupWebSocket();
    this.setupAIIntegration();
    this.setupPerformanceMonitoring();
    this.setupEnhancedAnalytics();
    this.startServer();
    console.log('Live Coaching Server initialized');
  }

  setupExpress() {
    this.app.use(express.json());
    this.app.use(express.static('public'));

    // Enhanced API endpoints
    this.app.get('/api/live-games', (req, res) => {
      const games = Array.from(this.activeGames.values());
      res.json(games);
    });

    this.app.get('/api/game/:gameId', (req, res) => {
      const game = this.activeGames.get(req.params.gameId);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }
      res.json(game);
    });

    this.app.get('/api/game/:gameId/analytics', (req, res) => {
      const gameId = req.params.gameId;
      const analytics = this.generateGameAnalytics(gameId);
      res.json(analytics);
    });

    this.app.get('/api/game/:gameId/performance', (req, res) => {
      const gameId = req.params.gameId;
      const performance = this.performanceMetrics.get(gameId) || {};
      res.json(performance);
    });

    this.app.post('/api/game/:gameId/action', (req, res) => {
      const gameId = req.params.gameId;
      const action = req.body;

      this.handleCoachingAction(gameId, action);
      res.json({ success: true });
    });

    // Enhanced AI tracking endpoints
    this.app.post('/api/ai/tracking-data', (req, res) => {
      const { gameId, trackingData } = req.body;
      this.handleAITrackingData(gameId, trackingData);
      res.json({ success: true });
    });

    this.app.post('/api/ai/performance', (req, res) => {
      const { gameId, performanceData } = req.body;
      this.updatePerformanceMetrics(gameId, performanceData);
      res.json({ success: true });
    });

    // Real-time statistics endpoint
    this.app.get('/api/game/:gameId/live-stats', (req, res) => {
      const gameId = req.params.gameId;
      const stats = this.getLiveStatistics(gameId);
      res.json(stats);
    });
  }

  setupAIIntegration() {
    // AI data processing queue
    this.aiProcessingQueue = [];
    this.isProcessingAI = false;

    // Process AI data in batches for better performance
    setInterval(() => {
      this.processAIQueue();
    }, 100); // Process every 100ms
  }

  setupPerformanceMonitoring() {
    // Monitor server performance
    setInterval(() => {
      this.updateServerMetrics();
    }, 5000);
  }

  setupAdvancedAnalytics() {
    // Initialize real-time analytics
    setInterval(() => {
      this.updateRealTimeAnalytics();
    }, 1000);

    // Initialize predictive models
    setInterval(() => {
      this.updatePredictiveModels();
    }, 10000);

    // Initialize performance alerts
    setInterval(() => {
      this.checkPerformanceAlerts();
    }, 5000);
  }

  processAIQueue() {
    if (this.isProcessingAI || this.aiProcessingQueue.length === 0) {
      return;
    }

    this.isProcessingAI = true;
    const batch = this.aiProcessingQueue.splice(0, 10); // Process up to 10 items

    batch.forEach(item => {
      this.processAIDataItem(item);
    });

    this.isProcessingAI = false;
  }

  processAIDataItem(item) {
    const { gameId, trackingData, timestamp } = item;
    const game = this.activeGames.get(gameId);

    if (!game) {
      return;
    }

    // Enhanced AI data processing
    this.updatePlayerTracking(game, trackingData);
    this.updateGameInsights(game, trackingData);
    this.detectKeyMoments(game, trackingData);

    // Broadcast to connected clients
    this.broadcastToGame(gameId, {
      type: 'aiUpdate',
      trackingData,
      timestamp,
      processed: true,
    });
  }

  updatePlayerTracking(game, trackingData) {
    if (!trackingData.players) {
      return;
    }

    // Update player positions and movements
    game.playerPositions = game.playerPositions || {};
    game.playerMovements = game.playerMovements || {};

    trackingData.players.forEach(player => {
      // Store position history
      if (!game.playerPositions[player.id]) {
        game.playerPositions[player.id] = [];
      }

      game.playerPositions[player.id].push({
        position: player.position,
        timestamp: Date.now(),
        confidence: player.confidence,
      });

      // Keep only last 100 positions
      if (game.playerPositions[player.id].length > 100) {
        game.playerPositions[player.id].shift();
      }

      // Calculate movement metrics
      this.calculatePlayerMovementMetrics(game, player);
    });
  }

  calculatePlayerMovementMetrics(game, player) {
    const positions = game.playerPositions[player.id];
    if (positions.length < 2) {
      return;
    }

    const recent = positions.slice(-10); // Last 10 positions
    let totalDistance = 0;
    let maxSpeed = 0;

    for (let i = 1; i < recent.length; i++) {
      const dx = recent[i].position.x - recent[i - 1].position.x;
      const dy = recent[i].position.y - recent[i - 1].position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const timeDiff = recent[i].timestamp - recent[i - 1].timestamp;
      const speed = distance / (timeDiff / 1000); // Speed per second

      totalDistance += distance;
      maxSpeed = Math.max(maxSpeed, speed);
    }

    // Store movement metrics
    if (!game.playerMovements[player.id]) {
      game.playerMovements[player.id] = {
        totalDistance: 0,
        averageSpeed: 0,
        maxSpeed: 0,
        sprintCount: 0,
      };
    }

    const movement = game.playerMovements[player.id];
    movement.totalDistance += totalDistance;
    movement.averageSpeed = totalDistance / recent.length;
    movement.maxSpeed = Math.max(movement.maxSpeed, maxSpeed);

    // Detect sprints (high speed)
    if (maxSpeed > 0.5) {
      // Threshold for sprint
      movement.sprintCount++;
    }
  }

  updateGameInsights(game, trackingData) {
    if (!trackingData.insights) {
      return;
    }

    // Store insights with timestamps
    game.insightHistory = game.insightHistory || [];
    game.insightHistory.push({
      insights: trackingData.insights,
      timestamp: Date.now(),
    });

    // Keep only last 50 insights (about 5 minutes at 10fps)
    if (game.insightHistory.length > 50) {
      game.insightHistory.shift();
    }

    // Update current insights
    game.currentInsights = trackingData.insights;
  }

  detectKeyMoments(game, trackingData) {
    // Detect significant game moments
    const keyMoments = [];

    // Check for scoring plays
    if (trackingData.actions) {
      trackingData.actions.forEach(action => {
        if (action.type === 'shot' && action.made) {
          keyMoments.push({
            type: 'scoring_play',
            action,
            timestamp: Date.now(),
            importance: action.shotType === '3PT' ? 'high' : 'medium',
          });
        }

        if (action.type === 'steal' || action.type === 'block') {
          keyMoments.push({
            type: 'defensive_play',
            action,
            timestamp: Date.now(),
            importance: 'medium',
          });
        }
      });
    }

    // Check for momentum shifts
    if (this.detectMomentumShift(game)) {
      keyMoments.push({
        type: 'momentum_shift',
        timestamp: Date.now(),
        importance: 'high',
      });
    }

    // Store key moments
    if (keyMoments.length > 0) {
      game.keyMoments = game.keyMoments || [];
      game.keyMoments.push(...keyMoments);

      // Broadcast key moments to coaches
      this.broadcastToGameRole(game.id, 'coach', {
        type: 'keyMoments',
        moments: keyMoments,
        timestamp: Date.now(),
      });
    }
  }

  detectMomentumShift(game) {
    // Simple momentum detection based on recent scoring
    if (!game.scoreHistory || game.scoreHistory.length < 4) {
      return false;
    }

    const recent = game.scoreHistory.slice(-4);
    const homeRecent = recent.filter(score => score.team === 'home').length;
    const awayRecent = recent.filter(score => score.team === 'away').length;

    // Momentum shift if one team scored 3+ in a row
    return Math.abs(homeRecent - awayRecent) >= 3;
  }

  generateGameAnalytics(gameId) {
    const game = this.activeGames.get(gameId);
    if (!game) {
      return null;
    }

    return {
      gameId,
      duration: Date.now() - game.startTime,
      totalPossessions: this.calculatePossessions(game),
      teamStats: {
        home: this.calculateTeamAnalytics(game, 'home'),
        away: this.calculateTeamAnalytics(game, 'away'),
      },
      playerAnalytics: this.calculatePlayerAnalytics(game),
      keyInsights: this.generateKeyInsights(game),
    };
  }

  calculateTeamAnalytics(game, team) {
    const stats = game.statistics[team];
    if (!stats) {
      return {};
    }

    return {
      fieldGoalPercentage:
        stats.fieldGoals.attempted > 0
          ? (
              (stats.fieldGoals.made / stats.fieldGoals.attempted) *
              100
            ).toFixed(1)
          : '0.0',
      threePointPercentage:
        stats.threePointers.attempted > 0
          ? (
              (stats.threePointers.made / stats.threePointers.attempted) *
              100
            ).toFixed(1)
          : '0.0',
      reboundingRate: stats.rebounds.total || 0,
      turnoverRate: stats.turnovers || 0,
      pace: this.calculatePace(game, team),
    };
  }

  calculatePlayerAnalytics(game) {
    const analytics = {};

    Object.keys(game.playerStats || {}).forEach(playerId => {
      const stats = game.playerStats[playerId];
      const movement = game.playerMovements[playerId] || {};

      analytics[playerId] = {
        efficiency: this.calculatePlayerEfficiency(stats),
        usage: this.calculateUsageRate(stats, game),
        movement: {
          distance: movement.totalDistance || 0,
          averageSpeed: movement.averageSpeed || 0,
          sprints: movement.sprintCount || 0,
        },
        fatigue: this.estimateFatigue(playerId, game),
      };
    });

    return analytics;
  }

  calculatePlayerEfficiency(stats) {
    if (!stats) {
      return 0;
    }

    const points = stats.points || 0;
    const rebounds = stats.rebounds || 0;
    const assists = stats.assists || 0;
    const steals = stats.steals || 0;
    const blocks = stats.blocks || 0;
    const turnovers = stats.turnovers || 0;
    const fga = stats.fieldGoals?.attempted || 0;

    return (
      points +
      rebounds +
      assists +
      steals +
      blocks -
      turnovers -
      (fga - (stats.fieldGoalsMade || 0)) -
      (stats.freeThrows?.attempted || 0) +
      (stats.freeThrows?.made || 0)
    );
  }

  calculateMovementScore(movement) {
    if (!movement) {
      return 0;
    }

    return (
      movement.totalDistance * 0.3 +
      movement.averageSpeed * 0.4 +
      movement.sprintCount * 0.3
    );
  }

  // Enhanced Analytics and Predictive Features
  setupEnhancedAnalytics() {
    // Initialize real-time analytics
    setInterval(() => {
      this.updateRealTimeAnalytics();
    }, 1000);

    // Initialize predictive models
    setInterval(() => {
      this.updatePredictiveModels();
    }, 10000);

    // Initialize performance alerts
    setInterval(() => {
      this.checkPerformanceAlerts();
    }, 5000);
  }

  updateRealTimeAnalytics() {
    this.activeGames.forEach((game, gameId) => {
      const analytics = this.calculateAdvancedGameAnalytics(gameId);

      // Store real-time calculations
      this.analyticsEngine.realTimeCalculations.set(gameId, {
        ...analytics,
        timestamp: Date.now(),
      });

      // Broadcast to connected clients
      this.broadcastToGame(gameId, {
        type: 'realTimeAnalytics',
        analytics,
        timestamp: Date.now(),
      });
    });
  }

  calculateAdvancedGameAnalytics(gameId) {
    const game = this.activeGames.get(gameId);
    if (!game) {
      return null;
    }

    const analytics = {
      gameFlow: this.analyzeGameFlow(game),
      momentumMetrics: this.calculateMomentumMetrics(game),
      teamEfficiency: this.calculateTeamEfficiency(game),
      playerImpact: this.calculatePlayerImpact(game),
      predictionMetrics: this.generatePredictions(game),
    };

    return analytics;
  }

  analyzeGameFlow(game) {
    const recentEvents = game.events?.slice(-20) || [];

    return {
      pace: this.calculateGamePace(recentEvents),
      intensity: this.calculateGameIntensity(recentEvents),
      competitiveness: this.calculateCompetitiveness(game),
      rhythm: this.analyzeGameRhythm(recentEvents),
    };
  }

  calculateGamePace(events) {
    const timeWindow = 5 * 60 * 1000; // 5 minutes
    const now = Date.now();
    const recentEvents = events.filter(
      event => now - event.timestamp < timeWindow
    );

    const possessions = recentEvents.filter(event =>
      ['shot', 'turnover', 'foul'].includes(event.type)
    ).length;

    if (possessions > 40) {
      return 'very_fast';
    }
    if (possessions > 30) {
      return 'fast';
    }
    if (possessions > 20) {
      return 'medium';
    }
    if (possessions > 10) {
      return 'slow';
    }
    return 'very_slow';
  }

  calculateGameIntensity(events) {
    const highIntensityEvents = events.filter(event =>
      ['steal', 'block', 'dunk', 'three_pointer'].includes(event.type)
    ).length;

    const ratio = events.length > 0 ? highIntensityEvents / events.length : 0;

    if (ratio > 0.3) {
      return 'very_high';
    }
    if (ratio > 0.2) {
      return 'high';
    }
    if (ratio > 0.1) {
      return 'medium';
    }
    return 'low';
  }

  calculateCompetitiveness(game) {
    const scoreDifference = Math.abs(game.homeScore - game.awayScore);
    const gameTime = game.timeElapsed || 0;
    const totalGameTime = 48 * 60 * 1000; // 48 minutes in ms

    // Adjust competitiveness based on time remaining
    const timeWeight = Math.max(
      0.1,
      (totalGameTime - gameTime) / totalGameTime
    );
    const adjustedDifference = scoreDifference / timeWeight;

    if (adjustedDifference <= 3) {
      return 'very_close';
    }
    if (adjustedDifference <= 7) {
      return 'close';
    }
    if (adjustedDifference <= 15) {
      return 'moderate';
    }
    return 'blowout';
  }

  analyzeGameRhythm(events) {
    const timeIntervals = [];
    for (let i = 1; i < events.length; i++) {
      timeIntervals.push(events[i].timestamp - events[i - 1].timestamp);
    }

    if (timeIntervals.length === 0) {
      return 'unknown';
    }

    const avgInterval =
      timeIntervals.reduce((a, b) => a + b, 0) / timeIntervals.length;
    const variance = this.calculateVariance(timeIntervals);

    if (variance < avgInterval * 0.1) {
      return 'steady';
    }
    if (variance < avgInterval * 0.3) {
      return 'flowing';
    }
    return 'choppy';
  }

  calculateMomentumMetrics(game) {
    const recentScoring = game.scoreHistory?.slice(-10) || [];

    if (recentScoring.length < 3) {
      return {
        direction: 'neutral',
        strength: 0,
        team: null,
      };
    }

    let homeRuns = 0;
    let awayRuns = 0;
    let currentRun = 0;
    let runningTeam = null;

    for (let i = 1; i < recentScoring.length; i++) {
      const homeDiff = recentScoring[i].home - recentScoring[i - 1].home;
      const awayDiff = recentScoring[i].away - recentScoring[i - 1].away;

      if (homeDiff > awayDiff) {
        if (runningTeam === 'home') {
          currentRun += homeDiff - awayDiff;
        } else {
          homeRuns = Math.max(homeRuns, currentRun);
          currentRun = homeDiff - awayDiff;
          runningTeam = 'home';
        }
      } else if (awayDiff > homeDiff) {
        if (runningTeam === 'away') {
          currentRun += awayDiff - homeDiff;
        } else {
          awayRuns = Math.max(awayRuns, currentRun);
          currentRun = awayDiff - homeDiff;
          runningTeam = 'away';
        }
      }
    }

    const maxRun = Math.max(homeRuns, awayRuns, currentRun);
    const team =
      homeRuns > awayRuns ? 'home' : awayRuns > homeRuns ? 'away' : runningTeam;

    return {
      direction: maxRun > 5 ? 'strong' : maxRun > 2 ? 'building' : 'neutral',
      strength: Math.min(10, maxRun),
      team,
      currentRun,
    };
  }

  calculateTeamEfficiency(game) {
    const homeStats = this.calculateTeamAnalytics(game, 'home');
    const awayStats = this.calculateTeamAnalytics(game, 'away');

    return {
      home: {
        offensive: this.calculateOffensiveEfficiency(homeStats),
        defensive: this.calculateDefensiveEfficiency(homeStats, awayStats),
        overall: this.calculateOverallEfficiency(homeStats),
      },
      away: {
        offensive: this.calculateOffensiveEfficiency(awayStats),
        defensive: this.calculateDefensiveEfficiency(awayStats, homeStats),
        overall: this.calculateOverallEfficiency(awayStats),
      },
    };
  }

  calculateOffensiveEfficiency(teamStats) {
    const fgPct = teamStats.fieldGoalPercentage || 0;
    const threePct = teamStats.threePointPercentage || 0;
    const ftPct = teamStats.freeThrowPercentage || 0;
    const assists = teamStats.assists || 0;
    const turnovers = teamStats.turnovers || 0;

    return (
      fgPct * 0.4 +
      threePct * 0.2 +
      ftPct * 0.1 +
      assists * 0.2 -
      turnovers * 0.1
    );
  }

  calculateDefensiveEfficiency(teamStats, opponentStats) {
    const steals = teamStats.steals || 0;
    const blocks = teamStats.blocks || 0;
    const rebounds = teamStats.rebounds || 0;
    const opponentFG = opponentStats.fieldGoalPercentage || 0;

    return (
      steals * 0.3 + blocks * 0.2 + rebounds * 0.2 + (1 - opponentFG) * 0.3
    );
  }

  calculateOverallEfficiency(teamStats) {
    return (
      this.calculateOffensiveEfficiency(teamStats) +
      this.calculateDefensiveEfficiency(teamStats, {})
    );
  }

  calculatePlayerImpact(game) {
    const impact = {};

    Object.keys(game.playerStats || {}).forEach(playerId => {
      const stats = game.playerStats[playerId];
      const efficiency = this.calculatePlayerEfficiency(stats);
      const movement = game.playerMovements?.[playerId];
      const positions = game.playerPositions?.[playerId];

      impact[playerId] = {
        offensiveImpact: this.calculateOffensiveImpact(stats),
        defensiveImpact: this.calculateDefensiveImpact(stats),
        efficiencyRating: efficiency,
        movementScore: this.calculateMovementScore(movement),
        positioningScore: this.calculatePositioningScore(positions),
        clutchFactor: this.calculateClutchFactor(stats, game),
      };
    });

    return impact;
  }

  calculateOffensiveImpact(stats) {
    const points = stats.points || 0;
    const assists = stats.assists || 0;
    const fgPct =
      stats.fieldGoals?.attempted > 0
        ? stats.fieldGoals.made / stats.fieldGoals.attempted
        : 0;

    return points * 0.5 + assists * 2 + fgPct * 20;
  }

  calculateDefensiveImpact(stats) {
    const steals = stats.steals || 0;
    const blocks = stats.blocks || 0;
    const rebounds = stats.rebounds || 0;

    return steals * 3 + blocks * 2 + rebounds * 1;
  }

  calculatePositioningScore(positions) {
    if (!positions || positions.length < 10) {
      return 0;
    }

    const recentPositions = positions.slice(-20);
    const avgConfidence =
      recentPositions.reduce((sum, pos) => sum + pos.confidence, 0) /
      recentPositions.length;

    return avgConfidence * 10;
  }

  calculateClutchFactor(stats, game) {
    // Simplified clutch calculation based on recent performance
    const timeRemaining = game.timeRemaining || 0;
    const scoreDifference = Math.abs(game.homeScore - game.awayScore);

    if (timeRemaining < 300000 && scoreDifference < 10) {
      // Last 5 minutes, close game
      return (stats.points || 0) * 1.5 + (stats.assists || 0) * 2;
    }

    return 0;
  }

  generatePredictions(game) {
    return {
      winProbability: this.calculateWinProbability(game),
      finalScore: this.predictFinalScore(game),
      nextPlay: this.predictNextPlay(game),
      keyMoments: this.predictKeyMoments(game),
    };
  }

  calculateWinProbability(game) {
    const scoreDiff = game.homeScore - game.awayScore;
    const timeRemaining = game.timeRemaining || 0;
    const totalTime = 48 * 60 * 1000;
    const gameProgress = 1 - timeRemaining / totalTime;

    // Simple win probability calculation
    const baseProb = 0.5 + scoreDiff * 0.02;
    const timeWeight = Math.pow(gameProgress, 2);

    return {
      home: Math.max(0.05, Math.min(0.95, baseProb + timeWeight * 0.1)),
      away: Math.max(0.05, Math.min(0.95, 1 - baseProb - timeWeight * 0.1)),
    };
  }

  predictFinalScore(game) {
    const timeElapsed = game.timeElapsed || 0;
    const totalTime = 48 * 60 * 1000;
    const timeRemaining = totalTime - timeElapsed;

    if (timeRemaining <= 0) {
      return {
        home: game.homeScore,
        away: game.awayScore,
      };
    }

    const pace = (game.homeScore + game.awayScore) / (timeElapsed / totalTime);
    const remainingPoints = pace * (timeRemaining / totalTime);

    return {
      home: Math.round(game.homeScore + remainingPoints * 0.5),
      away: Math.round(game.awayScore + remainingPoints * 0.5),
    };
  }

  predictNextPlay(game) {
    const recentPlays = game.events?.slice(-5) || [];
    const playTypes = ['shot', 'pass', 'drive', 'screen'];

    // Simple prediction based on recent patterns
    const lastPlay = recentPlays[recentPlays.length - 1];
    if (!lastPlay) {
      return playTypes[Math.floor(Math.random() * playTypes.length)];
    }

    // Predict opposite of last play type for variety
    switch (lastPlay.type) {
      case 'shot':
        return 'pass';
      case 'pass':
        return 'drive';
      case 'drive':
        return 'shot';
      default:
        return 'screen';
    }
  }

  predictKeyMoments(game) {
    const timeRemaining = game.timeRemaining || 0;
    const scoreDiff = Math.abs(game.homeScore - game.awayScore);

    const moments = [];

    if (timeRemaining < 300000 && scoreDiff < 5) {
      // Last 5 minutes, close
      moments.push({
        type: 'clutch_period',
        probability: 0.9,
        description: 'Entering clutch time - every possession critical',
      });
    }

    if (timeRemaining < 120000 && scoreDiff < 3) {
      // Last 2 minutes, very close
      moments.push({
        type: 'final_push',
        probability: 0.95,
        description: 'Final push - game could be decided',
      });
    }

    return moments;
  }

  updatePredictiveModels() {
    this.activeGames.forEach((game, gameId) => {
      const predictions = this.generatePredictions(game);

      this.analyticsEngine.predictiveModels.set(gameId, {
        predictions,
        timestamp: Date.now(),
        confidence: this.calculatePredictionConfidence(game),
      });
    });
  }

  calculatePredictionConfidence(game) {
    const dataQuality = this.assessDataQuality(game);
    const gameProgress = game.timeElapsed / (48 * 60 * 1000);

    return Math.min(0.95, dataQuality * gameProgress + 0.3);
  }

  assessDataQuality(game) {
    let quality = 0.5; // Base quality

    if (game.playerStats && Object.keys(game.playerStats).length > 8) {
      quality += 0.2;
    }

    if (game.events && game.events.length > 50) {
      quality += 0.2;
    }

    if (game.playerPositions) {
      quality += 0.1;
    }

    return Math.min(1, quality);
  }

  checkPerformanceAlerts() {
    this.activeGames.forEach((game, gameId) => {
      const alerts = this.generatePerformanceAlerts(game);

      if (alerts.length > 0) {
        this.broadcastToGame(gameId, {
          type: 'performanceAlerts',
          alerts,
          timestamp: Date.now(),
        });
      }
    });
  }

  generatePerformanceAlerts(game) {
    const alerts = [];

    // Check for unusual patterns
    const momentum = this.calculateMomentumMetrics(game);
    if (momentum.strength > 8) {
      alerts.push({
        type: 'momentum_shift',
        severity: 'high',
        message: `Strong momentum shift favoring ${momentum.team} team`,
        recommendation: 'Consider timeout to stop opponent momentum',
      });
    }

    // Check individual player performance
    Object.entries(game.playerStats || {}).forEach(([playerId, stats]) => {
      const efficiency = this.calculatePlayerEfficiency(stats);

      if (efficiency < -5) {
        alerts.push({
          type: 'player_struggling',
          severity: 'medium',
          playerId,
          message: `Player #${playerId} having efficiency issues`,
          recommendation: 'Consider substitution or different role',
        });
      }

      if (efficiency > 15) {
        alerts.push({
          type: 'player_hot',
          severity: 'positive',
          playerId,
          message: `Player #${playerId} performing exceptionally well`,
          recommendation: 'Consider running plays through this player',
        });
      }
    });

    return alerts;
  }

  calculateVariance(values) {
    if (values.length === 0) {
      return 0;
    }

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));

    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  broadcastToGameRole(gameId, role, message) {
    this.connectedClients.forEach(client => {
      if (
        client.gameId === gameId &&
        client.role === role &&
        client.ws.readyState === WebSocket.OPEN
      ) {
        client.ws.send(JSON.stringify(message));
      }
    });
  }

  updateServerMetrics() {
    const metrics = {
      activeGames: this.activeGames.size,
      connectedClients: this.connectedClients.size,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      aiQueueSize: this.aiProcessingQueue.length,
    };

    // Broadcast metrics to admin clients
    this.broadcastToRole('admin', {
      type: 'serverMetrics',
      metrics,
      timestamp: Date.now(),
    });
  }

  broadcastToRole(role, message) {
    this.connectedClients.forEach(client => {
      if (client.role === role && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    });
  }

  // Cleanup and shutdown
  shutdown() {
    console.log('Shutting down Live Coaching Server...');

    // Close all WebSocket connections
    this.connectedClients.forEach(client => {
      client.ws.close();
    });

    // Close server
    this.server.close(() => {
      console.log('Server shut down gracefully');
    });
  }
}

// Export for use
module.exports = LiveCoachingServer;

// Start server if this file is run directly
if (require.main === module) {
  const server = new LiveCoachingServer(8080);

  // Graceful shutdown
  process.on('SIGINT', () => {
    server.shutdown();
    process.exit(0);
  });
}
