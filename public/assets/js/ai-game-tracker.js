/**
 * AI Game Tracking Integration - 3 Ball Network
 * Interface for AI-powered game analysis and real-time coaching insights
 */

class AIGameTracker {
  constructor() {
    this.isTracking = false;
    this.confidenceThreshold = 0.8;
    this.trackingSession = null;
    this.videoStream = null;
    this.analyticsBuffer = [];
    this.playerDetections = new Map();

    // Enhanced tracking capabilities
    this.advancedTracking = {
      multiCameraSupport: true,
      realTimeOptimization: true,
      adaptiveThresholds: true,
      predictionEngine: true,
      behaviorAnalysis: true,
    };

    // Performance optimization
    this.performance = {
      targetFPS: 30,
      maxBufferSize: 1000,
      processingQuality: 'high',
      adaptiveQuality: true,
      memoryThreshold: 500, // MB
    };

    // Advanced analytics
    this.analytics = {
      playerMetrics: new Map(),
      teamFormations: [],
      playPatterns: [],
      momentumIndicators: [],
      gameFlow: {
        pace: 'medium',
        intensity: 'high',
        flow: 'smooth',
      },
    };

    this.init();
  }

  init() {
    this.setupVideoCapture();
    this.initializeMLModels();
    this.setupPerformanceOptimization();
    // AI Game Tracker initialized
  }

  async setupVideoCapture() {
    try {
      // Initialize camera for game recording
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: true,
      });

      // Setup video element for processing
      this.videoElement = document.createElement('video');
      this.videoElement.srcObject = this.videoStream;
      this.videoElement.play();

      // Canvas for frame processing
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');

      // Video capture initialized
    } catch (error) {
      // Error accessing camera
      this.fallbackToFileUpload();
    }
  }

  async initializeMLModels() {
    // Initialize TensorFlow.js or similar ML framework
    // This would load pre-trained models for:
    // - Player detection and tracking
    // - Ball tracking
    // - Action recognition (shooting, passing, dribbling)
    // - Court boundary detection

    this.models = {
      playerDetection: null,
      ballTracking: null,
      actionRecognition: null,
      poseEstimation: null,
    };

    try {
      // Load models (replace with actual model URLs)
      // Loading AI models

      // In production, you would load actual TensorFlow.js models:
      // this.models.playerDetection = await tf.loadLayersModel('/models/player-detection/model.json');
      // this.models.ballTracking = await tf.loadLayersModel('/models/ball-tracking/model.json');
      // this.models.actionRecognition = await tf.loadLayersModel('/models/action-recognition/model.json');

      // For now, simulate model loading
      await this.simulateModelLoading();

      // AI models loaded successfully
      this.modelsLoaded = true;

      // Set up performance monitoring
      this.setupModelPerformanceMonitoring();
    } catch (error) {
      // Error loading ML models
      this.useMockTracking();
    }
  }

  async simulateModelLoading() {
    // Simulate model loading delay
    return new Promise(resolve => {
      setTimeout(() => {
        this.models.playerDetection = { loaded: true, accuracy: 0.94 };
        this.models.ballTracking = { loaded: true, accuracy: 0.92 };
        this.models.actionRecognition = { loaded: true, accuracy: 0.88 };
        this.models.poseEstimation = { loaded: true, accuracy: 0.91 };
        resolve();
      }, 2000);
    });
  }

  setupModelPerformanceMonitoring() {
    this.modelPerformance = {
      frameProcessingTime: [],
      detectionAccuracy: [],
      memoryUsage: [],
      fps: 0,
    };

    // Monitor performance every 5 seconds
    setInterval(() => {
      this.updatePerformanceMetrics();
    }, 5000);
  }

  updatePerformanceMetrics() {
    // Calculate average frame processing time
    if (this.modelPerformance.frameProcessingTime.length > 0) {
      const avgTime =
        this.modelPerformance.frameProcessingTime.reduce((a, b) => a + b, 0) /
        this.modelPerformance.frameProcessingTime.length;

      // Calculate FPS
      this.modelPerformance.fps = 1000 / avgTime;

      // Clear old data
      this.modelPerformance.frameProcessingTime = [];
    }

    // Send performance data to dashboard
    if (this.onPerformanceUpdate) {
      this.onPerformanceUpdate({
        fps: this.modelPerformance.fps,
        memoryUsage: this.getMemoryUsage(),
        modelAccuracy: this.getAverageAccuracy(),
      });
    }
  }

  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
      };
    }
    return { used: 0, total: 0 };
  }

  getAverageAccuracy() {
    const accuracies = Object.values(this.models)
      .filter(model => model && model.accuracy)
      .map(model => model.accuracy);

    return accuracies.length > 0
      ? accuracies.reduce((a, b) => a + b, 0) / accuracies.length
      : 0;
  }

  startTracking(gameConfig) {
    if (this.isTracking) {
      return;
    }

    this.isTracking = true;
    this.trackingSession = {
      gameId: gameConfig.gameId,
      startTime: Date.now(),
      teams: gameConfig.teams,
      players: gameConfig.players,
      courtDimensions: gameConfig.courtDimensions,
    };

    // Start the main tracking loop
    this.trackingLoop();
  }

  trackingLoop() {
    if (!this.isTracking) {
      return;
    }

    // Process current video frame
    this.processFrame()
      .then(results => {
        this.handleTrackingResults(results);

        // Continue loop
        requestAnimationFrame(() => this.trackingLoop());
      })
      .catch(() => {
        setTimeout(() => this.trackingLoop(), 100); // Retry after delay
      });
  }

  async processFrame() {
    if (!this.videoElement || this.videoElement.readyState < 2) {
      return null;
    }

    const startTime = performance.now();

    // Draw current frame to canvas
    this.canvas.width = this.videoElement.videoWidth;
    this.canvas.height = this.videoElement.videoHeight;
    this.ctx.drawImage(this.videoElement, 0, 0);

    // Get image data for processing
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    // Process with AI models in parallel for better performance
    const [players, ball, actions, court] = await Promise.all([
      this.detectPlayers(imageData),
      this.trackBall(imageData),
      this.recognizeActions(imageData),
      this.analyzeCourt(imageData),
    ]);

    const processingTime = performance.now() - startTime;
    this.modelPerformance.frameProcessingTime.push(processingTime);

    return {
      timestamp: Date.now(),
      players,
      ball,
      actions,
      court,
      frameData: imageData,
      processingTime,
    };
  }

  // Enhanced player detection with better tracking
  async detectPlayers() {
    if (!this.models.playerDetection || !this.modelsLoaded) {
      return this.mockPlayerDetection();
    }

    try {
      // In production, this would use actual ML models
      // const tensor = tf.browser.fromPixels(imageData);
      // const predictions = await this.models.playerDetection.predict(tensor);

      // For now, return enhanced mock data with better tracking
      return this.enhancedMockPlayerDetection();
    } catch {
      return this.mockPlayerDetection();
    }
  }

  enhancedMockPlayerDetection() {
    // More realistic player detection with movement patterns
    const players = [];
    const timestamp = Date.now();

    // Simulate 5 players per team with realistic movements
    for (let i = 0; i < 10; i++) {
      const playerId = ['23', '15', '8', '12', '7', '21', '9', '14', '6', '11'][
        i
      ];
      const team = i < 5 ? 'home' : 'away';

      // Create more realistic position data with movement patterns
      const basePosition = this.getPlayerBasePosition(playerId);
      const movement = this.simulatePlayerMovement(playerId, timestamp);

      players.push({
        id: playerId,
        position: {
          x: Math.max(0, Math.min(1, basePosition.x + movement.x)),
          y: Math.max(0, Math.min(1, basePosition.y + movement.y)),
        },
        velocity: movement,
        confidence: 0.88 + Math.random() * 0.1,
        team,
        action: this.detectPlayerAction(playerId),
        energy: this.calculatePlayerEnergy(playerId),
      });
    }

    return players;
  }

  getPlayerBasePosition(playerId) {
    // Assign base positions based on player roles
    const positions = {
      23: { x: 0.3, y: 0.4 }, // Point guard
      15: { x: 0.7, y: 0.6 }, // Shooting guard
      8: { x: 0.5, y: 0.3 }, // Small forward
      12: { x: 0.2, y: 0.7 }, // Power forward
      7: { x: 0.8, y: 0.4 }, // Center
      21: { x: 0.6, y: 0.5 }, // Sixth man
      9: { x: 0.4, y: 0.6 },
      14: { x: 0.1, y: 0.3 },
      6: { x: 0.9, y: 0.7 },
      11: { x: 0.5, y: 0.8 },
    };

    return positions[playerId] || { x: 0.5, y: 0.5 };
  }

  simulatePlayerMovement(playerId, timestamp) {
    // Create realistic movement patterns
    const speed = 0.02 + Math.random() * 0.03;
    const direction = (timestamp / 1000) % (Math.PI * 2);

    return {
      x: Math.sin(direction + parseInt(playerId)) * speed,
      y: Math.cos(direction + parseInt(playerId)) * speed,
    };
  }

  detectPlayerAction() {
    // Simulate action detection
    const actions = [
      'dribbling',
      'running',
      'shooting',
      'defending',
      'passing',
    ];
    const actionProbabilities = [0.4, 0.3, 0.1, 0.15, 0.05];

    const random = Math.random();
    let cumulative = 0;

    for (let i = 0; i < actions.length; i++) {
      cumulative += actionProbabilities[i];
      if (random <= cumulative) {
        return {
          type: actions[i],
          confidence: 0.8 + Math.random() * 0.2,
        };
      }
    }

    return { type: 'running', confidence: 0.85 };
  }

  calculatePlayerEnergy(playerId) {
    // Simulate energy levels based on game time and activity
    const gameMinutes =
      48 - (parseInt(this.gameState?.timeRemaining?.split(':')[0]) || 12);
    const baseFatigue = gameMinutes / 48;
    const playerVariation = Math.sin(parseInt(playerId) * 0.5) * 0.2;

    return Math.max(0.1, Math.min(1, 1 - baseFatigue + playerVariation));
  }

  // Enhanced ball tracking with physics
  async trackBall() {
    if (!this.models.ballTracking || !this.modelsLoaded) {
      return this.enhancedMockBallTracking();
    }

    try {
      // In production: actual ball tracking
      return this.enhancedMockBallTracking();
    } catch {
      return this.mockBallTracking();
    }
  }

  enhancedMockBallTracking() {
    // More realistic ball physics
    const timestamp = Date.now();
    const ballPosition = this.simulateBallPhysics(timestamp);

    return {
      position: ballPosition.position,
      velocity: ballPosition.velocity,
      height: ballPosition.height,
      confidence: 0.91 + Math.random() * 0.08,
      possession: this.determineBallPossession(ballPosition.position),
      trajectory: this.predictBallTrajectory(ballPosition),
    };
  }

  simulateBallPhysics(timestamp) {
    // Simulate realistic ball movement
    const time = timestamp / 1000;
    const baseX = 0.5 + Math.sin(time * 0.5) * 0.3;
    const baseY = 0.5 + Math.cos(time * 0.3) * 0.4;

    return {
      position: { x: baseX, y: baseY },
      velocity: {
        x: Math.cos(time * 0.5) * 0.15,
        y: -Math.sin(time * 0.3) * 0.12,
      },
      height: Math.max(0, Math.sin(time * 2) * 0.5 + 0.1),
    };
  }

  determineBallPossession(ballPosition) {
    // Determine which player has possession based on proximity
    const players = this.lastPlayerDetections || [];
    let closestPlayer = null;
    let minDistance = Infinity;

    players.forEach(player => {
      const distance = Math.sqrt(
        Math.pow(player.position.x - ballPosition.x, 2) +
          Math.pow(player.position.y - ballPosition.y, 2)
      );

      if (distance < minDistance && distance < 0.05) {
        minDistance = distance;
        closestPlayer = player;
      }
    });

    return closestPlayer
      ? {
          playerId: closestPlayer.id,
          team: closestPlayer.team,
          confidence: 0.9 - minDistance * 10,
        }
      : null;
  }

  predictBallTrajectory(ballState) {
    // Predict ball trajectory for next few frames
    const predictions = [];
    const pos = { ...ballState.position };
    const vel = { ...ballState.velocity };

    for (let i = 1; i <= 10; i++) {
      pos.x += vel.x * 0.1;
      pos.y += vel.y * 0.1;
      vel.x *= 0.98; // Air resistance
      vel.y *= 0.98;

      predictions.push({
        frame: i,
        position: { ...pos },
        confidence: Math.max(0.1, 0.9 - i * 0.05),
      });
    }

    return predictions;
  }

  handleTrackingResults(results) {
    if (!results) {
      return;
    }

    // Process and validate results
    const validatedResults = this.validateResults(results);

    // Update game statistics
    this.updateGameStatistics(validatedResults);

    // Generate insights
    const insights = this.generateInsights();

    // Send to live dashboard
    this.sendToLiveDashboard({
      type: 'aiUpdate',
      results: validatedResults,
      insights,
      timestamp: results.timestamp,
    });

    // Buffer for analysis
    this.analyticsBuffer.push(validatedResults);
    if (this.analyticsBuffer.length > 300) {
      // Keep last 10 seconds at 30fps
      this.analyticsBuffer.shift();
    }
  }

  validateResults(results) {
    // Validate AI results against confidence thresholds
    const validated = {
      players: results.players.filter(
        p => p.confidence > this.confidenceThreshold
      ),
      ball:
        results.ball.confidence > this.confidenceThreshold
          ? results.ball
          : null,
      actions: results.actions.filter(
        a => a.confidence > this.confidenceThreshold
      ),
      court: results.court,
    };

    return validated;
  }

  updateGameStatistics(results) {
    // Update player statistics based on AI observations
    results.players.forEach(player => {
      if (!this.playerDetections.has(player.id)) {
        this.playerDetections.set(player.id, {
          positions: [],
          actions: [],
          performance: {},
        });
      }

      const playerData = this.playerDetections.get(player.id);
      playerData.positions.push({
        x: player.position.x,
        y: player.position.y,
        timestamp: results.timestamp,
      });
    });

    // Analyze actions for statistics
    results.actions.forEach(action => {
      this.processAction(action);
    });
  }

  processAction(action) {
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
  }

  processShotAction(action) {
    // Analyze shot and update statistics
    const shotData = {
      playerId: action.playerId,
      position: action.position,
      shotType: this.determineShotType(action.position),
      timestamp: action.timestamp,
      made: action.result === 'made',
    };

    this.sendStatUpdate('shot', shotData);
  }

  processPassAction(action) {
    // Analyze pass and update statistics
    const passData = {
      from: action.from,
      to: action.to,
      type: action.passType,
      timestamp: action.timestamp,
    };

    this.sendStatUpdate('pass', passData);
  }

  processReboundAction(action) {
    // Analyze rebound and update statistics
    const reboundData = {
      playerId: action.playerId,
      position: action.position,
      reboundType: action.reboundType || 'defensive', // defensive or offensive
      timestamp: action.timestamp,
    };

    this.sendStatUpdate('rebound', reboundData);
  }

  processStealAction(action) {
    // Analyze steal and update statistics
    const stealData = {
      playerId: action.playerId,
      position: action.position,
      timestamp: action.timestamp,
      success: action.success || true,
    };

    this.sendStatUpdate('steal', stealData);
  }

  processTurnoverAction(action) {
    // Analyze turnover and update statistics
    const turnoverData = {
      playerId: action.playerId,
      position: action.position,
      turnoverType: action.turnoverType || 'unknown',
      timestamp: action.timestamp,
    };

    this.sendStatUpdate('turnover', turnoverData);
  }

  calculatePlayerMovement(positions) {
    // Calculate movement metrics for a player
    if (positions.length < 2) {
      return {
        distance: 0,
        speed: 0,
        direction: 0,
      };
    }

    let totalDistance = 0;
    for (let i = 1; i < positions.length; i++) {
      const dx = positions[i].x - positions[i - 1].x;
      const dy = positions[i].y - positions[i - 1].y;
      totalDistance += Math.sqrt(dx * dx + dy * dy);
    }

    const timeSpan =
      positions[positions.length - 1].timestamp - positions[0].timestamp;
    const speed = timeSpan > 0 ? totalDistance / (timeSpan / 1000) : 0;

    // Calculate general direction
    const startPos = positions[0];
    const endPos = positions[positions.length - 1];
    const direction = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);

    return {
      distance: totalDistance,
      speed,
      direction,
    };
  }

  async recognizeActions() {
    if (!this.models.actionRecognition || !this.modelsLoaded) {
      return this.mockActionRecognition();
    }

    try {
      // In production: actual action recognition
      return this.mockActionRecognition();
    } catch {
      return this.mockActionRecognition();
    }
  }

  async analyzeCourt() {
    // Analyze court boundaries and features
    if (!this.modelsLoaded) {
      return this.mockCourtAnalysis();
    }

    try {
      // In production: actual court analysis
      return this.mockCourtAnalysis();
    } catch {
      return this.mockCourtAnalysis();
    }
  }

  mockCourtAnalysis() {
    return {
      boundaries: {
        width: 1.0,
        height: 1.0,
        detected: true,
        confidence: 0.92,
      },
      features: {
        threePointLine: { detected: true, confidence: 0.89 },
        freeThrowLine: { detected: true, confidence: 0.91 },
        centerCourt: { detected: true, confidence: 0.88 },
        baskets: { detected: true, confidence: 0.94 },
      },
    };
  }

  // Mock methods for development/testing
  mockPlayerDetection() {
    return [
      {
        id: '23',
        position: { x: 0.3, y: 0.4 },
        confidence: 0.95,
        team: 'home',
      },
      {
        id: '15',
        position: { x: 0.7, y: 0.6 },
        confidence: 0.92,
        team: 'home',
      },
      { id: '8', position: { x: 0.5, y: 0.3 }, confidence: 0.88, team: 'home' },
      {
        id: '12',
        position: { x: 0.2, y: 0.7 },
        confidence: 0.91,
        team: 'away',
      },
      { id: '7', position: { x: 0.8, y: 0.4 }, confidence: 0.94, team: 'away' },
    ];
  }

  mockBallTracking() {
    return {
      position: {
        x: 0.5 + Math.random() * 0.1 - 0.05,
        y: 0.5 + Math.random() * 0.1 - 0.05,
      },
      velocity: { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 },
      confidence: 0.93,
    };
  }

  mockActionRecognition() {
    const actions = ['shot', 'pass', 'dribble', 'rebound'];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];

    return Math.random() > 0.7
      ? [
          {
            type: randomAction,
            playerId: '23',
            confidence: 0.87,
            position: { x: Math.random(), y: Math.random() },
          },
        ]
      : [];
  }

  useMockTracking() {
    this.isMockMode = true;
  }

  fallbackToFileUpload() {
    // Create file input for manual video upload
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'video/*';
    fileInput.onchange = e => this.handleVideoFile(e.target.files[0]);
    document.body.appendChild(fileInput);
  }

  handleVideoFile(file) {
    // Process uploaded video file
    const videoUrl = URL.createObjectURL(file);
    this.videoElement.src = videoUrl;
    this.videoElement.onloadeddata = () => {
      this.startTracking({
        gameId: 'uploaded-game',
        teams: ['Team A', 'Team B'],
        players: [],
      });
    };
  }

  stopTracking() {
    this.isTracking = false;

    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
    }
  }

  // Utility methods
  calculateAverageMovement(positions) {
    if (positions.length < 2) {
      return 0;
    }

    let totalMovement = 0;
    for (let i = 1; i < positions.length; i++) {
      // Calculate movement between frames
      totalMovement += this.calculateDistance(positions[i - 1], positions[i]);
    }

    return totalMovement / positions.length;
  }

  calculateDistance(pos1, pos2) {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  determineShotType(position) {
    // Determine if shot is 2-pointer or 3-pointer based on position
    const distanceFromBasket = this.calculateDistanceFromBasket(position);
    return distanceFromBasket > 0.75 ? '3PT' : '2PT'; // Simplified
  }

  calculateDistanceFromBasket(position) {
    // Calculate distance from basket (simplified)
    const basketPosition = { x: 0.5, y: 0.05 }; // Assuming normalized coordinates
    return this.calculateDistance(position, basketPosition);
  }

  isGoodShot(shot) {
    // Determine if shot was a good shot based on position and context
    const distanceFromBasket = this.calculateDistanceFromBasket(shot.position);
    return distanceFromBasket < 0.8; // Simplified good shot criteria
  }

  getRecentActions(actionType, timeWindow) {
    const now = Date.now();
    return this.analyticsBuffer.filter(
      item =>
        item.actions &&
        item.timestamp > now - timeWindow &&
        item.actions.some(action => action.type === actionType)
    );
  }

  // Enhanced Analytics Engine
  analyzeTeamFormation() {
    const currentPositions = Array.from(this.playerDetections.values())
      .map(detection => detection.positions[detection.positions.length - 1])
      .filter(pos => pos && pos.confidence > 0.8);

    if (currentPositions.length >= 5) {
      const formation = this.classifyFormation(currentPositions);
      this.analytics.teamFormations.push({
        formation,
        timestamp: Date.now(),
        confidence: this.calculateFormationConfidence(currentPositions),
      });
    }
  }

  classifyFormation(positions) {
    // Simplified formation classification
    const spread =
      Math.max(...positions.map(p => p.position.y)) -
      Math.min(...positions.map(p => p.position.y));

    if (spread < 0.3) {
      return 'tight';
    }
    if (spread > 0.6) {
      return 'spread';
    }
    return 'balanced';
  }

  calculateFormationConfidence(positions) {
    const avgConfidence =
      positions.reduce((sum, pos) => sum + pos.confidence, 0) /
      positions.length;
    return Math.min(0.95, avgConfidence);
  }

  analyzePlayPatterns() {
    const recentActions = this.analyticsBuffer.slice(-50);
    const patterns = this.detectPatterns(recentActions);

    patterns.forEach(pattern => {
      this.analytics.playPatterns.push({
        type: pattern.type,
        frequency: pattern.frequency,
        effectiveness: pattern.effectiveness,
        timestamp: Date.now(),
      });
    });
  }

  detectPatterns(actions) {
    const patterns = [];
    const actionTypes = ['pass', 'shot', 'dribble', 'screen'];

    actionTypes.forEach(type => {
      const typeActions = actions.filter(
        action => action.actions && action.actions.some(a => a.type === type)
      );

      if (typeActions.length > 5) {
        patterns.push({
          type,
          frequency: typeActions.length / actions.length,
          effectiveness: this.calculatePatternEffectiveness(typeActions, type),
        });
      }
    });

    return patterns;
  }

  calculatePatternEffectiveness(actions, type) {
    // Simplified effectiveness calculation
    switch (type) {
      case 'shot': {
        const shots = actions.flatMap(a =>
          a.actions.filter(action => action.type === 'shot')
        );
        const made = shots.filter(shot => shot.made).length;
        return shots.length > 0 ? made / shots.length : 0;
      }
      case 'pass':
        return Math.random() * 0.3 + 0.7; // 70-100% effectiveness
      default:
        return Math.random() * 0.5 + 0.5; // 50-100% effectiveness
    }
  }

  analyzeMomentumShifts() {
    const recent = this.analyticsBuffer.slice(-20);
    const momentum = this.calculateMomentum(recent);

    this.analytics.momentumIndicators.push({
      value: momentum,
      timestamp: Date.now(),
      trend: this.calculateMomentumTrend(),
    });

    // Keep only last 100 momentum readings
    if (this.analytics.momentumIndicators.length > 100) {
      this.analytics.momentumIndicators.shift();
    }
  }

  calculateMomentum(actions) {
    let momentum = 0;

    actions.forEach(action => {
      if (action.actions) {
        action.actions.forEach(a => {
          switch (a.type) {
            case 'shot':
              momentum += a.made ? 2 : -1;
              break;
            case 'steal':
              momentum += 1.5;
              break;
            case 'turnover':
              momentum -= 1.5;
              break;
            case 'rebound':
              momentum += 1;
              break;
          }
        });
      }
    });

    return Math.max(-10, Math.min(10, momentum));
  }

  calculateMomentumTrend() {
    if (this.analytics.momentumIndicators.length < 5) {
      return 'neutral';
    }

    const recent = this.analytics.momentumIndicators.slice(-5);
    const trend = recent[recent.length - 1].value - recent[0].value;

    if (trend > 2) {
      return 'increasing';
    }
    if (trend < -2) {
      return 'decreasing';
    }
    return 'stable';
  }

  // Advanced Performance Optimization
  optimizePerformance() {
    const currentMemory = this.getMemoryUsage();
    const currentFPS = this.getFPS();

    // Adaptive quality adjustment
    if (this.performance.adaptiveQuality) {
      if (currentMemory > this.performance.memoryThreshold) {
        this.lowerProcessingQuality();
      } else if (currentFPS < this.performance.targetFPS * 0.8) {
        this.optimizeForFPS();
      } else if (
        currentFPS > this.performance.targetFPS * 1.1 &&
        this.performance.processingQuality !== 'high'
      ) {
        this.increaseProcessingQuality();
      }
    }

    // Buffer management
    if (this.analyticsBuffer.length > this.performance.maxBufferSize) {
      this.analyticsBuffer = this.analyticsBuffer.slice(
        -this.performance.maxBufferSize / 2
      );
    }
  }

  lowerProcessingQuality() {
    if (this.performance.processingQuality === 'high') {
      this.performance.processingQuality = 'medium';
      this.confidenceThreshold = 0.75;
    } else if (this.performance.processingQuality === 'medium') {
      this.performance.processingQuality = 'low';
      this.confidenceThreshold = 0.7;
    }
  }

  optimizeForFPS() {
    this.performance.targetFPS = Math.max(15, this.performance.targetFPS - 5);
    this.lowerProcessingQuality();
  }

  increaseProcessingQuality() {
    if (this.performance.processingQuality === 'low') {
      this.performance.processingQuality = 'medium';
      this.confidenceThreshold = 0.75;
    } else if (this.performance.processingQuality === 'medium') {
      this.performance.processingQuality = 'high';
      this.confidenceThreshold = 0.8;
    }
  }

  getFPS() {
    if (this.modelPerformance.frameProcessingTime.length === 0) {
      return 30;
    }

    const avgProcessingTime =
      this.modelPerformance.frameProcessingTime.reduce((a, b) => a + b, 0) /
      this.modelPerformance.frameProcessingTime.length;

    return Math.min(60, 1000 / avgProcessingTime);
  }

  // Enhanced Behavioral Analysis
  analyzePlayerBehavior(playerId) {
    const playerData = this.playerDetections.get(playerId);
    if (!playerData || playerData.positions.length < 10) {
      return null;
    }

    const behavior = {
      movementPattern: this.analyzeMovementPattern(playerData.positions),
      positioningTendency: this.analyzePositioning(playerData.positions),
      activityLevel: this.calculateActivityLevel(playerData),
      consistency: this.calculateConsistency(playerData),
      predictedNextMove: this.predictNextMove(playerData),
    };

    // Store behavior analysis
    if (!this.analytics.playerMetrics.has(playerId)) {
      this.analytics.playerMetrics.set(playerId, {
        behaviors: [],
        trends: [],
        predictions: [],
      });
    }

    this.analytics.playerMetrics.get(playerId).behaviors.push({
      ...behavior,
      timestamp: Date.now(),
    });

    return behavior;
  }

  analyzeMovementPattern(positions) {
    if (positions.length < 5) {
      return 'insufficient_data';
    }

    const movements = [];
    for (let i = 1; i < positions.length; i++) {
      const dx = positions[i].position.x - positions[i - 1].position.x;
      const dy = positions[i].position.y - positions[i - 1].position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      movements.push(distance);
    }

    const avgMovement = movements.reduce((a, b) => a + b, 0) / movements.length;
    const movementVariance = this.calculateVariance(movements);

    if (avgMovement < 0.01 && movementVariance < 0.005) {
      return 'stationary';
    }
    if (avgMovement > 0.05) {
      return 'highly_active';
    }
    if (movementVariance > 0.02) {
      return 'erratic';
    }
    return 'steady';
  }

  analyzePositioning(positions) {
    const recent = positions.slice(-20);
    const xPositions = recent.map(p => p.position.x);
    const yPositions = recent.map(p => p.position.y);

    const xVariance = this.calculateVariance(xPositions);
    const yVariance = this.calculateVariance(yPositions);
    const avgX = xPositions.reduce((a, b) => a + b, 0) / xPositions.length;

    if (xVariance < 0.01 && yVariance < 0.01) {
      return 'position_specialist';
    }
    if (avgX < 0.3) {
      return 'perimeter_focused';
    }
    if (avgX > 0.7) {
      return 'paint_focused';
    }
    return 'versatile';
  }

  calculateActivityLevel(playerData) {
    const recentPositions = playerData.positions.slice(-30);
    if (recentPositions.length < 2) {
      return 0;
    }

    let totalMovement = 0;
    for (let i = 1; i < recentPositions.length; i++) {
      const dx =
        recentPositions[i].position.x - recentPositions[i - 1].position.x;
      const dy =
        recentPositions[i].position.y - recentPositions[i - 1].position.y;
      totalMovement += Math.sqrt(dx * dx + dy * dy);
    }

    return Math.min(1, totalMovement * 10); // Normalize to 0-1
  }

  calculateConsistency(playerData) {
    const confidences = playerData.positions.slice(-20).map(p => p.confidence);
    if (confidences.length === 0) {
      return 0;
    }

    const avgConfidence =
      confidences.reduce((a, b) => a + b, 0) / confidences.length;
    const variance = this.calculateVariance(confidences);

    return Math.max(0, avgConfidence - variance); // Higher consistency = higher average, lower variance
  }

  predictNextMove(playerData) {
    const recentPositions = playerData.positions.slice(-5);
    if (recentPositions.length < 3) {
      return null;
    }

    // Simple linear prediction based on recent movement
    const movements = [];
    for (let i = 1; i < recentPositions.length; i++) {
      movements.push({
        dx: recentPositions[i].position.x - recentPositions[i - 1].position.x,
        dy: recentPositions[i].position.y - recentPositions[i - 1].position.y,
      });
    }

    const avgDx =
      movements.reduce((sum, m) => sum + m.dx, 0) / movements.length;
    const avgDy =
      movements.reduce((sum, m) => sum + m.dy, 0) / movements.length;

    const lastPos = recentPositions[recentPositions.length - 1].position;

    return {
      x: Math.max(0, Math.min(1, lastPos.x + avgDx * 3)),
      y: Math.max(0, Math.min(1, lastPos.y + avgDy * 3)),
      confidence: Math.min(0.8, this.calculateConsistency(playerData)),
    };
  }

  calculateVariance(values) {
    if (values.length === 0) {
      return 0;
    }

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));

    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  // Enhanced Communication with Dashboard
  sendEnhancedUpdate(data) {
    const enhancedData = {
      ...data,
      analytics: {
        formations: this.analytics.teamFormations.slice(-5),
        patterns: this.analytics.playPatterns.slice(-10),
        momentum: this.analytics.momentumIndicators.slice(-5),
        gameFlow: this.analytics.gameFlow,
      },
      performance: {
        fps: this.getFPS(),
        memory: this.getMemoryUsage(),
        quality: this.performance.processingQuality,
        latency: this.getAverageLatency(),
      },
    };

    this.sendToLiveDashboard(enhancedData);
  }

  getAverageLatency() {
    if (this.modelPerformance.frameProcessingTime.length === 0) {
      return 50;
    }

    return (
      this.modelPerformance.frameProcessingTime.reduce((a, b) => a + b, 0) /
      this.modelPerformance.frameProcessingTime.length
    );
  }

  setupPerformanceOptimization() {
    // Initialize performance optimization settings
    this.performanceInterval = setInterval(() => {
      this.optimizePerformance();
    }, 10000); // Every 10 seconds

    // Monitor memory usage
    this.memoryMonitor = setInterval(() => {
      const memory = this.getMemoryUsage();
      if (memory.used > this.performance.memoryThreshold) {
        this.lowerProcessingQuality();
      }
    }, 5000); // Every 5 seconds
  }

  generateInsights() {
    // Generate coaching insights from AI analysis
    const insights = {};

    // Team pace analysis
    insights.pace = this.analyzePace();

    // Shot selection analysis
    insights.shotSelection = this.analyzeShotSelection();

    // Player fatigue detection
    insights.fatigue = this.analyzeFatigue();

    // Defensive efficiency
    insights.defense = this.analyzeDefense();

    return insights;
  }

  sendToLiveDashboard(data) {
    // Send data to live coaching dashboard
    if (window.liveCoaching) {
      window.liveCoaching.handleAIUpdate(data);
    }

    // Also send via WebSocket if available
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  sendStatUpdate(type, data) {
    this.sendToLiveDashboard({
      type: 'statUpdate',
      statType: type,
      data,
      timestamp: Date.now(),
    });
  }

  analyzePace() {
    // Analyze game pace based on player movements and possessions
    const recentPositions = this.analyticsBuffer.slice(-30); // Last second
    const movementSpeed = this.calculateAverageMovement(recentPositions);

    if (movementSpeed > 2.5) {
      return 'Fast';
    }
    if (movementSpeed > 1.5) {
      return 'Medium';
    }
    return 'Slow';
  }

  analyzeShotSelection() {
    // Analyze shot quality and selection
    const recentShots = this.getRecentActions('shot', 60000); // Last minute
    const goodShots = recentShots.filter(shot => this.isGoodShot(shot));

    return `${Math.round((goodShots.length / recentShots.length) * 100)}%`;
  }

  analyzeFatigue() {
    // Detect player fatigue based on movement patterns
    this.playerDetections.forEach(data => {
      const recentMovement = data.positions.slice(-90); // Last 3 seconds
      this.calculatePlayerMovement(recentMovement);
      // Return fatigue level based on movement analysis
    });

    return 'Medium'; // Placeholder
  }

  analyzeDefense() {
    // Analyze defensive actions and effectiveness
    const recentDefensiveActions = this.getRecentActions('steal', 120000); // Last 2 minutes
    const successfulSteals = recentDefensiveActions.filter(
      action => action.success
    );

    return `${Math.round((successfulSteals.length / recentDefensiveActions.length) * 100)}%`;
  }
}

// Export for use in live coaching dashboard
window.AIGameTracker = AIGameTracker;
