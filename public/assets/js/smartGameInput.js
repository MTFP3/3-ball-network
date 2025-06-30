// Smart Game Input System
// Voice commands, quick-tap interface, and real-time game tracking

class SmartGameInput {
  constructor() {
    this.gameSession = null;
    this.voiceRecognition = null;
    this.isRecording = false;
    this.currentPlayer = null;
    this.quickStats = {
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      fouls: 0,
      fgm: 0,
      fga: 0,
      ftm: 0,
      fta: 0,
    };
    this.gameEvents = [];
    this.initializeVoiceRecognition();
  }

  // Initialize voice recognition
  initializeVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.voiceRecognition = new SpeechRecognition();
      this.voiceRecognition.continuous = true;
      this.voiceRecognition.interimResults = true;
      this.voiceRecognition.lang = 'en-US';

      this.voiceRecognition.onresult = event => {
        this.handleVoiceResult(event);
      };

      this.voiceRecognition.onerror = event => {
        console.error('Voice recognition error:', event.error);
      };
    }
  }

  // Start new game session
  startGameSession(gameInfo) {
    this.gameSession = {
      id: this.generateGameId(),
      homeTeam: gameInfo.homeTeam,
      awayTeam: gameInfo.awayTeam,
      playerTeam: gameInfo.playerTeam,
      opponent: gameInfo.opponent,
      date: new Date().toISOString(),
      quarter: 1,
      timeRemaining: '12:00',
      homeScore: 0,
      awayScore: 0,
      players: gameInfo.players || [],
      events: [],
      isLive: true,
    };

    this.gameEvents = [];
    this.resetQuickStats();

    return this.gameSession;
  }

  // Voice command processing
  startVoiceInput() {
    if (this.voiceRecognition && !this.isRecording) {
      this.voiceRecognition.start();
      this.isRecording = true;
      this.showVoiceIndicator();
    }
  }

  stopVoiceInput() {
    if (this.voiceRecognition && this.isRecording) {
      this.voiceRecognition.stop();
      this.isRecording = false;
      this.hideVoiceIndicator();
    }
  }

  handleVoiceResult(event) {
    const results = event.results;
    const lastResult = results[results.length - 1];

    if (lastResult.isFinal) {
      const transcript = lastResult[0].transcript.toLowerCase().trim();
      this.processVoiceCommand(transcript);
    }
  }

  processVoiceCommand(command) {
    const patterns = {
      // Scoring patterns
      score:
        /(\w+)\s+(made|scored|hit)\s+(?:a\s+)?(three|2|two|free throw|layup|dunk)/i,
      miss: /(\w+)\s+(missed|miss)\s+(?:a\s+)?(three|2|two|free throw|layup|shot)/i,

      // Assists
      assist:
        /(\w+)\s+(?:to\s+)?(\w+)\s+(?:for\s+(?:a\s+)?)?(three|2|two|score|basket)/i,

      // Rebounds
      rebound: /(\w+)\s+(rebound|board|got the rebound)/i,

      // Defensive stats
      steal: /(\w+)\s+(steal|stole|picked off)/i,
      block: /(\w+)\s+(block|blocked|swat)/i,

      // Turnovers
      turnover: /(\w+)\s+(turnover|lost the ball|travel|double dribble)/i,

      // Fouls
      foul: /(\w+)\s+(foul|fouled)/i,

      // Game management
      timeout: /(timeout|time out)/i,
      quarter: /(end of quarter|quarter|period)/i,
      substitution: /(\w+)\s+(?:in|out)\s+for\s+(\w+)/i,
    };

    let processed = false;

    for (const [type, pattern] of Object.entries(patterns)) {
      const match = command.match(pattern);
      if (match) {
        this.executeVoiceCommand(type, match);
        processed = true;
        break;
      }
    }

    if (!processed) {
      this.showVoiceError(`Command not recognized: "${command}"`);
    }
  }

  executeVoiceCommand(type, match) {
    const playerName = match[1];
    const player = this.findPlayer(playerName);

    if (!player && type !== 'timeout' && type !== 'quarter') {
      this.showVoiceError(`Player "${playerName}" not found`);
      return;
    }

    const event = {
      id: this.generateEventId(),
      timestamp: new Date().toISOString(),
      quarter: this.gameSession.quarter,
      player: player,
      type: type,
      description: match[0],
      processed: true,
    };

    switch (type) {
      case 'score':
        this.processScore(event, match[3]);
        break;
      case 'miss':
        this.processMiss(event, match[3]);
        break;
      case 'assist':
        this.processAssist(event, match[2], match[3]);
        break;
      case 'rebound':
        this.processRebound(event);
        break;
      case 'steal':
        this.processSteal(event);
        break;
      case 'block':
        this.processBlock(event);
        break;
      case 'turnover':
        this.processTurnover(event);
        break;
      case 'foul':
        this.processFoul(event);
        break;
    }

    this.gameEvents.push(event);
    this.updateGameDisplay();
    this.showVoiceConfirmation(event);
  }

  // Process different event types
  processScore(event, shotType) {
    const points = this.getPointsFromShotType(shotType);
    event.points = points;
    event.shotType = shotType;

    if (this.currentPlayer === event.player?.id) {
      this.quickStats.points += points;
      this.quickStats.fgm += 1;
      this.quickStats.fga += 1;
    }

    this.updateScore(points);
  }

  processMiss(event, shotType) {
    event.shotType = shotType;
    event.points = 0;

    if (this.currentPlayer === event.player?.id) {
      this.quickStats.fga += 1;
    }
  }

  processAssist(event, assistedPlayer, shotType) {
    const points = this.getPointsFromShotType(shotType);
    event.assistedPlayer = this.findPlayer(assistedPlayer);
    event.points = points;

    if (this.currentPlayer === event.player?.id) {
      this.quickStats.assists += 1;
    }
  }

  processRebound(event) {
    if (this.currentPlayer === event.player?.id) {
      this.quickStats.rebounds += 1;
    }
  }

  processSteal(event) {
    if (this.currentPlayer === event.player?.id) {
      this.quickStats.steals += 1;
    }
  }

  processBlock(event) {
    if (this.currentPlayer === event.player?.id) {
      this.quickStats.blocks += 1;
    }
  }

  processTurnover(event) {
    if (this.currentPlayer === event.player?.id) {
      this.quickStats.turnovers += 1;
    }
  }

  processFoul(event) {
    if (this.currentPlayer === event.player?.id) {
      this.quickStats.fouls += 1;
    }
  }

  // Quick-tap interface methods
  quickTapScore(points, shotType = '2') {
    const event = {
      id: this.generateEventId(),
      timestamp: new Date().toISOString(),
      quarter: this.gameSession.quarter,
      player: this.getCurrentPlayer(),
      type: 'score',
      points: points,
      shotType: shotType,
      method: 'quick_tap',
    };

    this.quickStats.points += points;
    this.quickStats.fgm += 1;
    this.quickStats.fga += 1;

    this.gameEvents.push(event);
    this.updateScore(points);
    this.updateGameDisplay();
    this.showQuickTapFeedback(`+${points} points`);
  }

  quickTapMiss(shotType = '2') {
    const event = {
      id: this.generateEventId(),
      timestamp: new Date().toISOString(),
      quarter: this.gameSession.quarter,
      player: this.getCurrentPlayer(),
      type: 'miss',
      points: 0,
      shotType: shotType,
      method: 'quick_tap',
    };

    this.quickStats.fga += 1;
    this.gameEvents.push(event);
    this.updateGameDisplay();
    this.showQuickTapFeedback('Miss recorded');
  }

  quickTapAssist() {
    this.quickStats.assists += 1;
    this.addQuickEvent('assist');
    this.showQuickTapFeedback('+1 Assist');
  }

  quickTapRebound() {
    this.quickStats.rebounds += 1;
    this.addQuickEvent('rebound');
    this.showQuickTapFeedback('+1 Rebound');
  }

  quickTapSteal() {
    this.quickStats.steals += 1;
    this.addQuickEvent('steal');
    this.showQuickTapFeedback('+1 Steal');
  }

  quickTapBlock() {
    this.quickStats.blocks += 1;
    this.addQuickEvent('block');
    this.showQuickTapFeedback('+1 Block');
  }

  quickTapTurnover() {
    this.quickStats.turnovers += 1;
    this.addQuickEvent('turnover');
    this.showQuickTapFeedback('+1 Turnover');
  }

  quickTapFoul() {
    this.quickStats.fouls += 1;
    this.addQuickEvent('foul');
    this.showQuickTapFeedback('+1 Foul');
  }

  // Helper methods
  addQuickEvent(type) {
    const event = {
      id: this.generateEventId(),
      timestamp: new Date().toISOString(),
      quarter: this.gameSession.quarter,
      player: this.getCurrentPlayer(),
      type: type,
      method: 'quick_tap',
    };

    this.gameEvents.push(event);
    this.updateGameDisplay();
  }

  findPlayer(playerName) {
    if (!this.gameSession?.players) return null;

    return this.gameSession.players.find(
      player =>
        player.name.toLowerCase().includes(playerName.toLowerCase()) ||
        player.firstName?.toLowerCase().includes(playerName.toLowerCase()) ||
        player.lastName?.toLowerCase().includes(playerName.toLowerCase())
    );
  }

  getCurrentPlayer() {
    return (
      this.gameSession?.players?.find(p => p.id === this.currentPlayer) || {
        id: this.currentPlayer,
        name: 'Current Player',
      }
    );
  }

  getPointsFromShotType(shotType) {
    const type = shotType.toLowerCase();
    if (type.includes('three') || type.includes('3')) return 3;
    if (type.includes('free')) return 1;
    return 2;
  }

  updateScore(points) {
    if (this.gameSession) {
      if (this.gameSession.playerTeam === 'home') {
        this.gameSession.homeScore += points;
      } else {
        this.gameSession.awayScore += points;
      }
    }
  }

  // UI feedback methods
  showVoiceIndicator() {
    // Show visual indicator that voice is listening
    this.updateUIElement('voice-indicator', {
      active: true,
      text: 'Listening...',
    });
  }

  hideVoiceIndicator() {
    this.updateUIElement('voice-indicator', { active: false, text: '' });
  }

  showVoiceConfirmation(event) {
    const message = this.formatEventMessage(event);
    this.updateUIElement('voice-feedback', {
      type: 'success',
      message: message,
      timeout: 3000,
    });
  }

  showVoiceError(message) {
    this.updateUIElement('voice-feedback', {
      type: 'error',
      message: message,
      timeout: 3000,
    });
  }

  showQuickTapFeedback(message) {
    this.updateUIElement('quick-tap-feedback', {
      message: message,
      timeout: 1500,
    });
  }

  formatEventMessage(event) {
    const playerName = event.player?.name || 'Player';
    switch (event.type) {
      case 'score':
        return `${playerName} scored ${event.points} points`;
      case 'assist':
        return `${playerName} assist recorded`;
      case 'rebound':
        return `${playerName} rebound recorded`;
      case 'steal':
        return `${playerName} steal recorded`;
      default:
        return `${playerName} ${event.type} recorded`;
    }
  }

  updateUIElement(elementId, data) {
    // This would update the actual UI elements
    // Implementation depends on your UI framework
    console.log(`UI Update - ${elementId}:`, data);
  }

  updateGameDisplay() {
    // Update the game display with current stats and events
    this.updateUIElement('game-stats', this.quickStats);
    this.updateUIElement('game-score', {
      home: this.gameSession?.homeScore || 0,
      away: this.gameSession?.awayScore || 0,
    });
    this.updateUIElement('recent-events', this.gameEvents.slice(-5));
  }

  // Game management
  endQuarter() {
    this.gameSession.quarter += 1;
    this.gameSession.timeRemaining = '12:00';

    const event = {
      id: this.generateEventId(),
      timestamp: new Date().toISOString(),
      type: 'quarter_end',
      quarter: this.gameSession.quarter - 1,
    };

    this.gameEvents.push(event);
    this.updateGameDisplay();
  }

  endGame() {
    this.gameSession.isLive = false;
    this.gameSession.endTime = new Date().toISOString();

    const finalStats = {
      ...this.quickStats,
      gameId: this.gameSession.id,
      opponent: this.gameSession.opponent,
      result: this.getGameResult(),
      playTime: this.calculatePlayTime(),
    };

    return {
      gameSession: this.gameSession,
      playerStats: finalStats,
      events: this.gameEvents,
    };
  }

  getGameResult() {
    const playerTeamScore =
      this.gameSession.playerTeam === 'home'
        ? this.gameSession.homeScore
        : this.gameSession.awayScore;
    const opponentScore =
      this.gameSession.playerTeam === 'home'
        ? this.gameSession.awayScore
        : this.gameSession.homeScore;

    return playerTeamScore > opponentScore ? 'W' : 'L';
  }

  calculatePlayTime() {
    // Estimate play time based on events and quarters played
    const quarterMinutes = Math.min(this.gameSession.quarter, 4) * 8; // 8-minute quarters
    const eventBasedTime = Math.min(
      this.gameEvents.length * 0.5,
      quarterMinutes
    );
    return Math.round(eventBasedTime);
  }

  // Utility methods
  resetQuickStats() {
    Object.keys(this.quickStats).forEach(key => {
      this.quickStats[key] = 0;
    });
  }

  generateGameId() {
    return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateEventId() {
    return (
      'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    );
  }

  setCurrentPlayer(playerId) {
    this.currentPlayer = playerId;
    this.resetQuickStats();
  }

  getGameStats() {
    return {
      session: this.gameSession,
      currentStats: this.quickStats,
      events: this.gameEvents,
      eventCount: this.gameEvents.length,
    };
  }
}

// Export for ES modules
export { SmartGameInput };

// Also make available globally for backward compatibility
if (typeof window !== 'undefined') {
  window.SmartGameInput = SmartGameInput;
}
