// Integrated Basketball Platform Manager
// Connects all advanced features and manages data flow between modules

class BasketballPlatformManager {
  constructor() {
    this.modules = {};
    this.sharedData = {
      currentUser: null,
      gameSession: null,
      playerProfile: {},
      teamData: {},
      performanceMetrics: {},
      socialConnections: [],
    };
    this.eventListeners = {};
    this.initializeModules();
    this.setupEventSystem();
  }

  // Initialize all platform modules
  initializeModules() {
    // Check if modules are available and initialize them
    if (typeof PlayerAnalytics !== 'undefined') {
      this.modules.analytics = new PlayerAnalytics();
    }

    if (typeof RecruitingHub !== 'undefined') {
      this.modules.recruiting = new RecruitingHub();
    }

    if (typeof SmartGameInput !== 'undefined') {
      this.modules.gameInput = new SmartGameInput();
    }

    this.setupModuleConnections();
  }

  // Setup connections between modules for data sharing
  setupModuleConnections() {
    // When game data is recorded, update analytics
    if (this.modules.gameInput && this.modules.analytics) {
      this.modules.gameInput.onStatRecorded = statData => {
        this.modules.analytics.trackPerformance(statData);
        this.updateSharedMetrics(statData);
      };
    }

    // When analytics generate insights, update recruiting profile
    if (this.modules.analytics && this.modules.recruiting) {
      this.modules.analytics.onInsightGenerated = insight => {
        this.modules.recruiting.updatePlayerMetrics(insight);
        this.broadcastEvent('insight-generated', insight);
      };
    }
  }

  // Setup event system for cross-module communication
  setupEventSystem() {
    this.eventBus = {
      listeners: {},
      emit: (event, data) => {
        if (this.eventBus.listeners[event]) {
          this.eventBus.listeners[event].forEach(callback => callback(data));
        }
      },
      on: (event, callback) => {
        if (!this.eventBus.listeners[event]) {
          this.eventBus.listeners[event] = [];
        }
        this.eventBus.listeners[event].push(callback);
      },
    };

    // Setup default event handlers
    this.setupDefaultEventHandlers();
  }

  setupDefaultEventHandlers() {
    // Performance tracking events
    this.eventBus.on('game-completed', gameData => {
      this.processGameCompletion(gameData);
    });

    this.eventBus.on('achievement-unlocked', achievement => {
      this.handleAchievementUnlock(achievement);
    });

    this.eventBus.on('recruiter-message', message => {
      this.handleRecruiterCommunication(message);
    });

    this.eventBus.on('team-chemistry-update', data => {
      this.updateTeamChemistry(data);
    });
  }

  // Process completed game data across all modules
  processGameCompletion(gameData) {
    // Update analytics
    if (this.modules.analytics) {
      const performance = this.modules.analytics.trackPerformance(gameData);
      this.sharedData.performanceMetrics = performance;
    }

    // Check for achievements
    this.checkAchievements(gameData);

    // Update recruiting profile
    if (this.modules.recruiting) {
      this.modules.recruiting.updatePlayerStats(gameData.stats);
    }

    // Update social feed
    this.updateSocialFeed({
      type: 'game-completed',
      player: gameData.player,
      stats: gameData.stats,
      timestamp: new Date().toISOString(),
    });

    // Save to local storage
    this.saveGameData(gameData);
  }

  // Achievement system
  checkAchievements(gameData) {
    const achievements = [
      {
        id: 'first-triple-double',
        name: 'First Triple-Double',
        check: stats =>
          stats.points >= 10 && stats.rebounds >= 10 && stats.assists >= 10,
      },
      {
        id: 'sharpshooter',
        name: 'Sharpshooter',
        check: stats => stats.tpm >= 10,
      },
      {
        id: 'defensive-specialist',
        name: 'Defensive Specialist',
        check: stats => stats.steals >= 5 && stats.blocks >= 3,
      },
      {
        id: 'lightning-fast',
        name: 'Lightning Fast',
        check: stats => stats.firstQuarterPoints >= 20,
      },
      {
        id: 'clutch-player',
        name: 'Clutch Player',
        check: stats => stats.gameWinningShot === true,
      },
    ];

    achievements.forEach(achievement => {
      if (achievement.check(gameData.stats)) {
        this.unlockAchievement(achievement);
      }
    });
  }

  unlockAchievement(achievement) {
    const unlockedAchievements = this.getUnlockedAchievements();
    if (!unlockedAchievements.includes(achievement.id)) {
      unlockedAchievements.push(achievement.id);
      localStorage.setItem(
        'unlockedAchievements',
        JSON.stringify(unlockedAchievements)
      );

      this.eventBus.emit('achievement-unlocked', achievement);
      this.showAchievementNotification(achievement);
    }
  }

  getUnlockedAchievements() {
    const stored = localStorage.getItem('unlockedAchievements');
    return stored ? JSON.parse(stored) : [];
  }

  showAchievementNotification(achievement) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-popup">
        <div class="achievement-icon">🏆</div>
        <div class="achievement-content">
          <h3>Achievement Unlocked!</h3>
          <p>${achievement.name}</p>
        </div>
      </div>
    `;

    // Add styles
    const styles = `
      .achievement-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        animation: slideInRight 0.5s ease-out;
      }
      .achievement-popup {
        background: linear-gradient(135deg, #ffd700, #ffed4e);
        color: #333;
        padding: 1em 1.5em;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(255, 215, 0, 0.4);
        display: flex;
        align-items: center;
        gap: 1em;
        min-width: 300px;
      }
      .achievement-icon {
        font-size: 2em;
      }
      .achievement-content h3 {
        margin: 0;
        font-size: 1.1em;
        font-weight: 900;
      }
      .achievement-content p {
        margin: 0.2em 0 0 0;
        font-size: 0.9em;
      }
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;

    // Add styles to head if not already present
    if (!document.querySelector('#achievement-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'achievement-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    // Add to page
    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideInRight 0.5s ease-out reverse';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }, 5000);
  }

  // Team chemistry analysis
  updateTeamChemistry(data) {
    const chemistry = {
      overall: this.calculateTeamChemistry(data),
      connections: this.analyzePlayerConnections(data),
      recommendations: this.generateChemistryRecommendations(data),
    };

    this.sharedData.teamData.chemistry = chemistry;
    this.eventBus.emit('chemistry-updated', chemistry);
  }

  calculateTeamChemistry(data) {
    // Analyze team performance metrics
    const factors = {
      communication: data.communicationEvents || 0,
      assists: data.totalAssists || 0,
      turnovers: data.totalTurnovers || 0,
      winRate: data.winRate || 0,
    };

    const communicationScore = Math.min(
      (factors.communication / 50) * 100,
      100
    );
    const playingScore = Math.max(
      0,
      100 - (factors.turnovers / factors.assists) * 20
    );
    const winScore = factors.winRate * 100;

    return Math.round((communicationScore + playingScore + winScore) / 3);
  }

  analyzePlayerConnections(data) {
    // Analyze player-to-player connections based on performance
    const connections = {};

    if (data.playerStats) {
      Object.keys(data.playerStats).forEach(player1 => {
        connections[player1] = {};
        Object.keys(data.playerStats).forEach(player2 => {
          if (player1 !== player2) {
            connections[player1][player2] = this.calculateConnectionStrength(
              data.playerStats[player1],
              data.playerStats[player2]
            );
          }
        });
      });
    }

    return connections;
  }

  calculateConnectionStrength(player1Stats, player2Stats) {
    // Calculate connection strength based on assist-to-turnover ratios when playing together
    const assistRatio =
      (player1Stats.assistsToPlayer2 || 0) /
      Math.max(player1Stats.totalAssists || 1, 1);
    const turnoverRate =
      (player1Stats.turnoversWithPlayer2 || 0) /
      Math.max(player1Stats.totalTurnovers || 1, 1);

    const strength = assistRatio * 100 - turnoverRate * 50;

    if (strength >= 70) return 'high';
    if (strength >= 40) return 'medium';
    return 'low';
  }

  generateChemistryRecommendations(data) {
    const recommendations = [];

    if (data.communicationScore < 70) {
      recommendations.push('Focus on defensive communication drills');
    }

    if (data.assistToTurnoverRatio < 1.5) {
      recommendations.push('Practice ball movement and decision-making');
    }

    if (data.benchChemistry < data.starterChemistry) {
      recommendations.push('Organize team bonding activities for all players');
    }

    return recommendations;
  }

  // Recruiting system integration
  handleRecruiterCommunication(message) {
    // Process incoming recruiter messages
    const communication = {
      id: Date.now(),
      recruiter: message.recruiter,
      college: message.college,
      message: message.content,
      timestamp: new Date().toISOString(),
      status: 'unread',
    };

    this.addRecruiterMessage(communication);
    this.showRecruiterNotification(communication);
  }

  addRecruiterMessage(communication) {
    const messages = this.getRecruiterMessages();
    messages.unshift(communication);
    localStorage.setItem('recruiterMessages', JSON.stringify(messages));
  }

  getRecruiterMessages() {
    const stored = localStorage.getItem('recruiterMessages');
    return stored ? JSON.parse(stored) : [];
  }

  showRecruiterNotification(communication) {
    // Similar to achievement notification but for recruiter messages
    console.log('New recruiter message:', communication);
  }

  // Social feed management
  updateSocialFeed(activity) {
    const feed = this.getSocialFeed();
    feed.unshift({
      ...activity,
      id: Date.now(),
      timestamp: activity.timestamp || new Date().toISOString(),
    });

    // Keep only latest 100 items
    if (feed.length > 100) {
      feed.splice(100);
    }

    localStorage.setItem('socialFeed', JSON.stringify(feed));
    this.eventBus.emit('social-feed-updated', feed);
  }

  getSocialFeed() {
    const stored = localStorage.getItem('socialFeed');
    return stored ? JSON.parse(stored) : [];
  }

  // Data persistence
  saveGameData(gameData) {
    const allGames = this.getAllGameData();
    allGames.unshift(gameData);

    // Keep only latest 50 games
    if (allGames.length > 50) {
      allGames.splice(50);
    }

    localStorage.setItem('gameHistory', JSON.stringify(allGames));
  }

  getAllGameData() {
    const stored = localStorage.getItem('gameHistory');
    return stored ? JSON.parse(stored) : [];
  }

  // Public API methods
  broadcastEvent(eventName, data) {
    this.eventBus.emit(eventName, data);
  }

  addEventListener(eventName, callback) {
    this.eventBus.on(eventName, callback);
  }

  updateSharedMetrics(data) {
    this.sharedData.performanceMetrics = {
      ...this.sharedData.performanceMetrics,
      ...data,
      lastUpdated: new Date().toISOString(),
    };
  }

  getSharedData() {
    return this.sharedData;
  }

  // AI coaching integration
  generateCoachingInsight(performanceData) {
    const insights = {
      strengths: [],
      weaknesses: [],
      recommendations: [],
    };

    // Analyze shooting
    if (performanceData.fgPercentage > 50) {
      insights.strengths.push('Excellent shooting efficiency');
    } else if (performanceData.fgPercentage < 40) {
      insights.weaknesses.push('Shooting consistency needs improvement');
      insights.recommendations.push(
        'Focus on form shooting drills and shot selection'
      );
    }

    // Analyze playmaking
    if (performanceData.assistToTurnoverRatio > 2) {
      insights.strengths.push('Great ball security and playmaking');
    } else if (performanceData.assistToTurnoverRatio < 1) {
      insights.weaknesses.push('High turnover rate affecting team flow');
      insights.recommendations.push('Practice decision-making under pressure');
    }

    return insights;
  }

  // Performance prediction
  predictPerformance(upcomingOpponent) {
    const historicalData = this.getAllGameData();
    const playerStats = this.sharedData.performanceMetrics;

    // Simple prediction based on historical performance vs similar opponents
    const prediction = {
      expectedPoints: playerStats.averagePoints || 0,
      expectedAssists: playerStats.averageAssists || 0,
      expectedRebounds: playerStats.averageRebounds || 0,
      confidence: 0.75,
    };

    // Adjust based on opponent strength
    if (upcomingOpponent.defensiveRating > 110) {
      prediction.expectedPoints *= 0.9;
      prediction.confidence *= 0.9;
    }

    return prediction;
  }
}

// Export for ES modules
export { BasketballPlatformManager as PlatformManager };

// Global platform manager instance
let platformManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  platformManager = new BasketballPlatformManager();

  // Make available globally for other modules
  window.BasketballPlatform = platformManager;
  window.PlatformManager = BasketballPlatformManager;
});

// Also support CommonJS for backward compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BasketballPlatformManager;
}
