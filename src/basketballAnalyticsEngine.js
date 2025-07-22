/**
 * Basketball Analytics Engine - Server-side / Node.js compatible version
 * Core basketball analytics without DOM dependencies
 */

class BasketballAnalyticsEngine {
  constructor() {
    this.playerData = new Map();
    this.teamData = new Map();
    this.gameData = new Map();
  }

  // Player Analytics
  calculatePlayerEfficiency(playerId, stats) {
    const { points, rebounds, assists, steals, blocks, turnovers, fouls, fgAttempted, ftAttempted, minutesPlayed } = stats;
    
    if (!minutesPlayed || minutesPlayed === 0) return 0;
    
    // PER calculation (simplified)
    const positiveActions = points + rebounds + assists + steals + blocks;
    const negativeActions = turnovers + fouls;
    const efficiency = ((positiveActions - negativeActions) / minutesPlayed) * 48; // Per 48 minutes
    
    return Math.round(Math.max(0, efficiency) * 10) / 10;
  }

  calculateBasketballIQ(playerId, gameStats) {
    const { assists, turnovers, goodShots, badShots, defensiveStops, communicationRating } = gameStats;
    
    // Decision Making (0-100)
    const decisionMaking = Math.min(100, (assists / Math.max(1, turnovers)) * 20);
    
    // Shot Selection (0-100)
    const shotSelection = Math.min(100, (goodShots / Math.max(1, goodShots + badShots)) * 100);
    
    // Defensive Awareness (0-100)
    const defensiveAwareness = Math.min(100, defensiveStops * 5);
    
    // Communication (0-100)
    const communication = Math.min(100, communicationRating || 70);
    
    return Math.round((decisionMaking + shotSelection + defensiveAwareness + communication) / 4);
  }

  calculateClutchRating(playerId, clutchStats) {
    const { clutchPoints, clutchAttempts, clutchAssists, clutchTurnovers, gameWinningShots, clutchMinutes } = clutchStats;
    
    let rating = 50; // Base rating
    
    // Scoring efficiency in clutch situations
    if (clutchAttempts > 0) {
      const efficiency = clutchPoints / clutchAttempts;
      rating += Math.min(30, efficiency * 15);
    }
    
    // Playmaking vs turnovers
    if (clutchTurnovers > 0) {
      rating += Math.min(15, (clutchAssists / clutchTurnovers) * 5);
    } else if (clutchAssists > 0) {
      rating += 15;
    }
    
    // Game-winning plays bonus
    rating += Math.min(10, gameWinningShots * 5);
    
    return Math.min(100, Math.max(0, Math.round(rating)));
  }

  // Shot Analysis
  analyzeShotData(shots) {
    const zones = {
      paint: { made: 0, attempted: 0 },
      midRange: { made: 0, attempted: 0 },
      threePoint: { made: 0, attempted: 0 }
    };

    const shotsByQuarter = { 1: [], 2: [], 3: [], 4: [] };
    
    shots.forEach(shot => {
      // Zone analysis
      if (zones[shot.zone]) {
        zones[shot.zone].attempted++;
        if (shot.made) zones[shot.zone].made++;
      }
      
      // Quarter analysis
      if (shot.quarter && shotsByQuarter[shot.quarter]) {
        shotsByQuarter[shot.quarter].push(shot);
      }
    });

    // Calculate efficiency by zone
    const zoneEfficiency = {};
    Object.keys(zones).forEach(zone => {
      const { made, attempted } = zones[zone];
      zoneEfficiency[zone] = attempted > 0 ? Math.round((made / attempted) * 100) / 100 : 0;
    });

    // Calculate trends
    const trends = this.calculateShootingTrends(shotsByQuarter);

    return {
      totalShots: shots.length,
      shotsMade: shots.filter(s => s.made).length,
      fieldGoalPercentage: shots.length > 0 ? shots.filter(s => s.made).length / shots.length : 0,
      zoneEfficiency,
      trends
    };
  }

  calculateShootingTrends(shotsByQuarter) {
    const quarterStats = {};
    
    Object.keys(shotsByQuarter).forEach(quarter => {
      const shots = shotsByQuarter[quarter];
      const made = shots.filter(s => s.made).length;
      quarterStats[`Q${quarter}`] = {
        attempted: shots.length,
        made,
        percentage: shots.length > 0 ? made / shots.length : 0
      };
    });
    
    return quarterStats;
  }

  // Team Analytics
  calculateTeamChemistry(playerConnections) {
    if (!playerConnections || playerConnections.length === 0) return 0;
    
    const totalChemistry = playerConnections.reduce((sum, connection) => {
      return sum + (connection.strength || 0);
    }, 0);
    
    return Math.round((totalChemistry / playerConnections.length) * 100) / 100;
  }

  analyzePlayerConnections(players, gameData) {
    const connections = [];
    
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        const playerA = players[i];
        const playerB = players[j];
        
        const connection = this.calculateConnectionStrength(playerA, playerB, gameData);
        connections.push({
          players: [playerA.name, playerB.name],
          chemistry: Math.round(connection * 100),
          strength: this.getConnectionStrengthLabel(connection)
        });
      }
    }
    
    return connections.sort((a, b) => b.chemistry - a.chemistry);
  }

  calculateConnectionStrength(playerA, playerB, gameData) {
    // Simplified chemistry calculation based on shared time and positive interactions
    const sharedMinutes = Math.min(playerA.minutesPlayed || 0, playerB.minutesPlayed || 0);
    const assists = (playerA.assistsTo?.[playerB.id] || 0) + (playerB.assistsTo?.[playerA.id] || 0);
    const passAccuracy = (playerA.passAccuracy || 0.7) + (playerB.passAccuracy || 0.7);
    
    // Base chemistry from shared court time
    let chemistry = Math.min(1, sharedMinutes / 30) * 0.4;
    
    // Bonus for assists to each other
    chemistry += Math.min(0.3, assists * 0.05);
    
    // Bonus for pass accuracy
    chemistry += (passAccuracy / 2 - 0.7) * 0.3;
    
    return Math.max(0, Math.min(1, chemistry));
  }

  getConnectionStrengthLabel(strength) {
    if (strength >= 0.8) return 'Excellent';
    if (strength >= 0.65) return 'Strong';
    if (strength >= 0.5) return 'Good';
    if (strength >= 0.35) return 'Developing';
    return 'Weak';
  }

  // Injury Prevention
  assessInjuryRisk(healthMetrics) {
    const { fatigueLevel = 0, previousInjuries = 0, workloadIndex = 0, recoveryScore = 100, age = 25 } = healthMetrics;
    
    let riskScore = 0;
    
    // Fatigue factor (0-40 points)
    riskScore += Math.min(40, fatigueLevel * 0.4);
    
    // Previous injuries factor (0-30 points)
    riskScore += Math.min(30, previousInjuries * 5);
    
    // Workload factor (0-20 points)
    riskScore += Math.min(20, Math.max(0, workloadIndex - 80) * 0.5);
    
    // Age factor (0-10 points)
    riskScore += Math.min(10, Math.max(0, age - 30) * 0.5);
    
    // Recovery factor (subtract up to 20 points for good recovery)
    riskScore -= Math.min(20, recoveryScore * 0.2);
    
    return Math.max(0, Math.min(100, Math.round(riskScore)));
  }

  generateHealthRecommendations(healthMetrics) {
    const recommendations = [];
    const { fatigueLevel = 0, hydrationLevel = 100, sleepQuality = 100, workloadIndex = 0, injuryRisk = 0 } = healthMetrics;
    
    if (injuryRisk > 60) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Injury Risk',
        message: 'High injury risk detected - consider medical evaluation'
      });
    }
    
    if (fatigueLevel > 70) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Rest',
        message: 'High fatigue levels - reduce training intensity or take rest day'
      });
    }
    
    if (hydrationLevel < 60) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'Hydration',
        message: 'Increase fluid intake immediately'
      });
    }
    
    if (sleepQuality < 50) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Sleep',
        message: 'Focus on improving sleep quality and duration'
      });
    }
    
    if (workloadIndex > 90) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Workload',
        message: 'Training volume is high - monitor for overtraining signs'
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        priority: 'LOW',
        category: 'Maintenance',
        message: 'Continue current training and recovery protocols'
      });
    }
    
    return recommendations;
  }

  // Comprehensive Analysis
  generatePlayerReport(playerId, allData) {
    const { stats, gameStats, clutchStats, shots, healthMetrics } = allData;
    
    const efficiency = this.calculatePlayerEfficiency(playerId, stats);
    const basketballIQ = this.calculateBasketballIQ(playerId, gameStats);
    const clutchRating = this.calculateClutchRating(playerId, clutchStats);
    const shotAnalysis = this.analyzeShotData(shots || []);
    const injuryRisk = this.assessInjuryRisk(healthMetrics || {});
    const healthRecommendations = this.generateHealthRecommendations(healthMetrics || {});
    
    return {
      playerId,
      timestamp: new Date().toISOString(),
      performance: {
        efficiency,
        basketballIQ,
        clutchRating,
        overallGrade: this.calculateOverallGrade(efficiency, basketballIQ, clutchRating)
      },
      shooting: shotAnalysis,
      health: {
        injuryRisk,
        recommendations: healthRecommendations
      },
      summary: this.generatePerformanceSummary(efficiency, basketballIQ, clutchRating, injuryRisk)
    };
  }

  calculateOverallGrade(efficiency, basketballIQ, clutchRating) {
    const average = (efficiency + basketballIQ + clutchRating) / 3;
    
    if (average >= 90) return 'A+';
    if (average >= 85) return 'A';
    if (average >= 80) return 'A-';
    if (average >= 75) return 'B+';
    if (average >= 70) return 'B';
    if (average >= 65) return 'B-';
    if (average >= 60) return 'C+';
    if (average >= 55) return 'C';
    if (average >= 50) return 'C-';
    return 'D';
  }

  generatePerformanceSummary(efficiency, basketballIQ, clutchRating, injuryRisk) {
    const strengths = [];
    const improvements = [];
    
    if (efficiency >= 80) strengths.push('High efficiency rating');
    else if (efficiency < 60) improvements.push('Improve overall efficiency');
    
    if (basketballIQ >= 80) strengths.push('Excellent basketball IQ');
    else if (basketballIQ < 60) improvements.push('Develop basketball IQ and decision-making');
    
    if (clutchRating >= 80) strengths.push('Strong clutch performance');
    else if (clutchRating < 60) improvements.push('Work on performance in pressure situations');
    
    if (injuryRisk <= 20) strengths.push('Low injury risk');
    else if (injuryRisk >= 60) improvements.push('Address injury risk factors');
    
    return { strengths, improvements };
  }
}

// Export for Node.js or browser use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BasketballAnalyticsEngine;
}

export default BasketballAnalyticsEngine;
