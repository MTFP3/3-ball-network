/**
 * Advanced Basketball Analytics Engine
 * Comprehensive basketball-specific analysis and metrics
 */

class BasketballAnalyticsEngine {
  constructor() {
    this.playerMetrics = new Map();
    this.teamMetrics = new Map();
    this.gameAnalytics = new Map();
    this.advancedStats = new AdvancedStatsCalculator();
    this.shotChart = new ShotChartAnalyzer();
    this.playerTracking = new PlayerTrackingSystem();
    this.teamChemistry = new TeamChemistryAnalyzer();
    this.injuryPrevention = new InjuryPreventionSystem();
    this.basketballIQ = new BasketballIQAnalyzer();
  }

  // Player Performance Analytics
  async analyzePlayerPerformance(playerId, gameData) {
    const basicStats = this.calculateBasicStats(gameData);
    const advancedStats = this.advancedStats.calculate(gameData);
    const shotAnalysis = this.shotChart.analyzeShooting(gameData.shots);
    const movementAnalysis = this.playerTracking.analyzeMovement(gameData.tracking);
    const iqAssessment = this.basketballIQ.assessPlayer(gameData);
    const injuryRisk = this.injuryPrevention.assessRisk(playerId, gameData);

    return {
      playerId,
      timestamp: Date.now(),
      basicStats,
      advancedStats,
      shotAnalysis,
      movementAnalysis,
      iqAssessment,
      injuryRisk,
      overallGrade: this.calculateOverallGrade(basicStats, advancedStats, iqAssessment),
      recommendations: this.generatePlayerRecommendations(basicStats, advancedStats, iqAssessment)
    };
  }

  // Team Analytics
  async analyzeTeamPerformance(teamId, gameData) {
    const teamStats = this.calculateTeamStats(gameData);
    const chemistryAnalysis = this.teamChemistry.analyzeTeam(gameData);
    const formationAnalysis = this.analyzeFormations(gameData);
    const efficiency = this.calculateTeamEfficiency(gameData);

    return {
      teamId,
      timestamp: Date.now(),
      teamStats,
      chemistryAnalysis,
      formationAnalysis,
      efficiency,
      strengths: this.identifyTeamStrengths(teamStats, chemistryAnalysis),
      weaknesses: this.identifyTeamWeaknesses(teamStats, chemistryAnalysis),
      recommendations: this.generateTeamRecommendations(teamStats, chemistryAnalysis)
    };
  }

  // Advanced Stats Calculation
  calculateBasicStats(gameData) {
    const { stats, minutes } = gameData;
    
    return {
      // Scoring
      points: stats.points || 0,
      fieldGoals: { made: stats.fgm || 0, attempted: stats.fga || 0 },
      threePointers: { made: stats.tpm || 0, attempted: stats.tpa || 0 },
      freeThrows: { made: stats.ftm || 0, attempted: stats.fta || 0 },
      
      // Rebounding
      offensiveRebounds: stats.oreb || 0,
      defensiveRebounds: stats.dreb || 0,
      totalRebounds: (stats.oreb || 0) + (stats.dreb || 0),
      
      // Playmaking
      assists: stats.assists || 0,
      turnovers: stats.turnovers || 0,
      assistToTurnoverRatio: stats.assists / Math.max(stats.turnovers, 1),
      
      // Defense
      steals: stats.steals || 0,
      blocks: stats.blocks || 0,
      deflections: stats.deflections || 0,
      charges: stats.charges || 0,
      
      // Efficiency
      minutesPlayed: minutes || 0,
      fouls: stats.fouls || 0,
      plusMinus: stats.plusMinus || 0
    };
  }

  // Overall Grade Calculation (Enhanced 3Ball Network System)
  calculateOverallGrade(basicStats, advancedStats, iqAssessment) {
    const weights = {
      scoring: 0.25,
      rebounding: 0.15,
      playmaking: 0.20,
      defense: 0.25,
      efficiency: 0.10,
      basketballIQ: 0.05
    };

    const scores = {
      scoring: this.calculateScoringScore(basicStats),
      rebounding: this.calculateReboundingScore(basicStats),
      playmaking: this.calculatePlaymakingScore(basicStats),
      defense: this.calculateDefenseScore(basicStats),
      efficiency: advancedStats.playerEfficiencyRating,
      basketballIQ: iqAssessment.overallScore
    };

    const weightedScore = Object.keys(weights).reduce((total, category) => {
      return total + (scores[category] * weights[category]);
    }, 0);

    return {
      overall: Math.round(weightedScore),
      breakdown: scores,
      letterGrade: this.convertToLetterGrade(weightedScore),
      percentile: this.calculatePercentile(weightedScore)
    };
  }

  calculateScoringScore(stats) {
    const fgPct = stats.fieldGoals.attempted > 0 ? 
      (stats.fieldGoals.made / stats.fieldGoals.attempted) * 100 : 0;
    const tpPct = stats.threePointers.attempted > 0 ? 
      (stats.threePointers.made / stats.threePointers.attempted) * 100 : 0;
    const ftPct = stats.freeThrows.attempted > 0 ? 
      (stats.freeThrows.made / stats.freeThrows.attempted) * 100 : 0;

    const efficiencyScore = (fgPct * 0.5) + (tpPct * 0.3) + (ftPct * 0.2);
    const volumeScore = Math.min(stats.points, 40) * 2; // Max 80 points
    
    return Math.min(100, (efficiencyScore + volumeScore) / 2);
  }

  calculatePlaymakingScore(stats) {
    const assistScore = Math.min(stats.assists * 8, 80); // Max 80 for 10+ assists
    const ratioScore = Math.min(stats.assistToTurnoverRatio * 20, 20); // Max 20
    return Math.min(100, assistScore + ratioScore);
  }

  calculateDefenseScore(stats) {
    const stealScore = stats.steals * 15; // 15 points per steal
    const blockScore = stats.blocks * 20; // 20 points per block
    const deflectionScore = stats.deflections * 5; // 5 points per deflection
    const chargeScore = stats.charges * 25; // 25 points per charge
    const foulPenalty = stats.fouls * -10; // -10 points per foul
    
    return Math.max(0, Math.min(100, stealScore + blockScore + deflectionScore + chargeScore + foulPenalty + 40));
  }

  generatePlayerRecommendations(basicStats, advancedStats, iqAssessment) {
    const recommendations = [];

    // Shooting recommendations
    if (basicStats.fieldGoals.attempted > 0) {
      const fgPct = (basicStats.fieldGoals.made / basicStats.fieldGoals.attempted) * 100;
      if (fgPct < 45) {
        recommendations.push({
          category: 'Shooting',
          priority: 'High',
          text: 'Focus on shot selection and mechanics. Consider working with a shooting coach.',
          drills: ['Form shooting', 'Spot-up shooting', 'Game-speed shooting']
        });
      }
    }

    // Playmaking recommendations
    if (basicStats.assistToTurnoverRatio < 1.5) {
      recommendations.push({
        category: 'Playmaking',
        priority: 'Medium',
        text: 'Improve decision-making and ball security.',
        drills: ['Two-ball dribbling', 'Decision-making drills', 'Pressure situations']
      });
    }

    // Defense recommendations
    if (basicStats.steals + basicStats.blocks < 2) {
      recommendations.push({
        category: 'Defense',
        priority: 'Medium',
        text: 'Focus on active defense and anticipation.',
        drills: ['Defensive slides', 'Closeout drills', 'Help defense rotations']
      });
    }

    // Basketball IQ recommendations
    if (iqAssessment.overallScore < 70) {
      recommendations.push({
        category: 'Basketball IQ',
        priority: 'High',
        text: 'Study game film and work on understanding game situations.',
        activities: ['Film study', 'Situational scrimmages', 'Coach mentoring']
      });
    }

    return recommendations;
  }

  convertToLetterGrade(score) {
    if (score >= 97) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 87) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 80) return 'B-';
    if (score >= 77) return 'C+';
    if (score >= 73) return 'C';
    if (score >= 70) return 'C-';
    if (score >= 67) return 'D+';
    if (score >= 63) return 'D';
    if (score >= 60) return 'D-';
    return 'F';
  }
}

// Advanced Stats Calculator
class AdvancedStatsCalculator {
  calculate(gameData) {
    const { stats, minutes, possessions } = gameData;
    
    return {
      // Efficiency Metrics
      playerEfficiencyRating: this.calculatePER(stats, minutes),
      trueShootingPercentage: this.calculateTS(stats),
      effectiveFieldGoalPercentage: this.calculateeFG(stats),
      usageRate: this.calculateUsageRate(stats, possessions),
      
      // Advanced Shooting
      shotQuality: this.calculateShotQuality(gameData.shots),
      shotSelection: this.calculateShotSelection(gameData.shots),
      clutchShooting: this.calculateClutchShooting(gameData.shots),
      
      // Advanced Playmaking
      assistPercentage: this.calculateAssistPercentage(stats, possessions),
      turnoverPercentage: this.calculateTurnoverPercentage(stats, possessions),
      
      // Advanced Defense
      defensiveRating: this.calculateDefensiveRating(stats, possessions),
      stealPercentage: this.calculateStealPercentage(stats, possessions),
      blockPercentage: this.calculateBlockPercentage(stats, possessions),
      
      // Impact Metrics
      winShares: this.calculateWinShares(stats, minutes),
      boxPlusMinus: this.calculateBPM(stats, minutes),
      valueOverReplacement: this.calculateVORP(stats, minutes)
    };
  }

  calculatePER(stats, minutes) {
    if (!minutes || minutes === 0) return 0;
    
    const uPER = (stats.fgm * 85.910) + (stats.steals * 53.897) + 
                 (stats.tpm * 51.757) + (stats.ftm * 46.845) + 
                 (stats.blocks * 39.190) + (stats.oreb * 39.190) + 
                 (stats.assists * 34.677) + (stats.dreb * 14.707) - 
                 (stats.fouls * 17.174) - ((stats.fta - stats.ftm) * 20.091) - 
                 ((stats.fga - stats.fgm) * 39.190) - (stats.turnovers * 53.897);
    
    return Math.max(0, (uPER * (1 / minutes)) * 15);
  }

  calculateTS(stats) {
    const points = stats.points || 0;
    const fga = stats.fga || 0;
    const fta = stats.fta || 0;
    
    if (fga + (0.44 * fta) === 0) return 0;
    return (points / (2 * (fga + (0.44 * fta)))) * 100;
  }

  calculateeFG(stats) {
    const fgm = stats.fgm || 0;
    const fga = stats.fga || 0;
    const tpm = stats.tpm || 0;
    
    if (fga === 0) return 0;
    return ((fgm + (0.5 * tpm)) / fga) * 100;
  }

  calculateShotQuality(shots) {
    if (!shots || shots.length === 0) return 0;
    
    let qualityScore = 0;
    shots.forEach(shot => {
      // Score based on shot type, defender distance, time on clock, etc.
      let shotScore = 50; // Base score
      
      // Shot type bonus/penalty
      if (shot.type === 'layup' || shot.type === 'dunk') shotScore += 30;
      else if (shot.type === 'three') shotScore += 10;
      else if (shot.type === 'midrange') shotScore -= 10;
      
      // Defender distance
      if (shot.defenderDistance > 6) shotScore += 20;
      else if (shot.defenderDistance < 3) shotScore -= 20;
      
      // Time pressure
      if (shot.timeRemaining > 10) shotScore += 10;
      else if (shot.timeRemaining < 3) shotScore -= 15;
      
      qualityScore += Math.max(0, Math.min(100, shotScore));
    });
    
    return qualityScore / shots.length;
  }
}

// Shot Chart Analyzer
class ShotChartAnalyzer {
  constructor() {
    this.zones = this.defineShootingZones();
  }

  defineShootingZones() {
    return {
      'paint': { x: [0.35, 0.65], y: [0.0, 0.19] },
      'left-corner-3': { x: [0.0, 0.22], y: [0.0, 0.14] },
      'right-corner-3': { x: [0.78, 1.0], y: [0.0, 0.14] },
      'left-wing-3': { x: [0.0, 0.35], y: [0.14, 0.47] },
      'right-wing-3': { x: [0.65, 1.0], y: [0.14, 0.47] },
      'top-of-key-3': { x: [0.35, 0.65], y: [0.24, 0.47] },
      'left-midrange': { x: [0.22, 0.35], y: [0.0, 0.24] },
      'right-midrange': { x: [0.65, 0.78], y: [0.0, 0.24] },
      'elbow-left': { x: [0.19, 0.35], y: [0.19, 0.24] },
      'elbow-right': { x: [0.65, 0.81], y: [0.19, 0.24] }
    };
  }

  analyzeShooting(shots) {
    if (!shots || shots.length === 0) {
      return this.getEmptyAnalysis();
    }

    const zoneStats = {};
    const heatMapData = [];
    
    // Initialize zone stats
    Object.keys(this.zones).forEach(zone => {
      zoneStats[zone] = { made: 0, attempted: 0, percentage: 0 };
    });

    shots.forEach(shot => {
      const zone = this.getZone(shot.x, shot.y);
      if (zone) {
        zoneStats[zone].attempted++;
        if (shot.made) {
          zoneStats[zone].made++;
        }
      }

      // Add to heat map data
      heatMapData.push({
        x: shot.x,
        y: shot.y,
        made: shot.made,
        value: 1
      });
    });

    // Calculate percentages
    Object.keys(zoneStats).forEach(zone => {
      const stats = zoneStats[zone];
      stats.percentage = stats.attempted > 0 ? 
        (stats.made / stats.attempted) * 100 : 0;
    });

    return {
      zoneStats,
      heatMapData,
      totalShots: shots.length,
      overallPercentage: (shots.filter(s => s.made).length / shots.length) * 100,
      preferredZones: this.getPreferredZones(zoneStats),
      weakZones: this.getWeakZones(zoneStats),
      recommendations: this.generateShootingRecommendations(zoneStats)
    };
  }

  getZone(x, y) {
    for (const [zoneName, bounds] of Object.entries(this.zones)) {
      if (x >= bounds.x[0] && x <= bounds.x[1] && 
          y >= bounds.y[0] && y <= bounds.y[1]) {
        return zoneName;
      }
    }
    return 'other';
  }

  getPreferredZones(zoneStats) {
    return Object.entries(zoneStats)
      .filter(([zone, stats]) => stats.attempted >= 3 && stats.percentage >= 50)
      .sort((a, b) => b[1].percentage - a[1].percentage)
      .slice(0, 3)
      .map(([zone, stats]) => ({
        zone,
        percentage: stats.percentage,
        attempts: stats.attempted
      }));
  }

  generateShootingRecommendations(zoneStats) {
    const recommendations = [];
    
    // Find zones to improve
    const weakZones = Object.entries(zoneStats)
      .filter(([zone, stats]) => stats.attempted >= 3 && stats.percentage < 35)
      .sort((a, b) => a[1].percentage - b[1].percentage);

    if (weakZones.length > 0) {
      recommendations.push({
        type: 'improvement',
        text: `Focus on improving ${weakZones[0][0]} shooting (${weakZones[0][1].percentage.toFixed(1)}%)`,
        priority: 'high'
      });
    }

    // Find zones to exploit more
    const strongZones = Object.entries(zoneStats)
      .filter(([zone, stats]) => stats.attempted >= 3 && stats.percentage >= 60)
      .sort((a, b) => b[1].percentage - a[1].percentage);

    if (strongZones.length > 0) {
      recommendations.push({
        type: 'exploit',
        text: `Take more shots from ${strongZones[0][0]} (${strongZones[0][1].percentage.toFixed(1)}% accuracy)`,
        priority: 'medium'
      });
    }

    return recommendations;
  }

  getEmptyAnalysis() {
    const zoneStats = {};
    Object.keys(this.zones).forEach(zone => {
      zoneStats[zone] = { made: 0, attempted: 0, percentage: 0 };
    });

    return {
      zoneStats,
      heatMapData: [],
      totalShots: 0,
      overallPercentage: 0,
      preferredZones: [],
      weakZones: [],
      recommendations: []
    };
  }
}

// Basketball IQ Analyzer
class BasketballIQAnalyzer {
  assessPlayer(gameData) {
    const decisions = this.analyzeDecisions(gameData);
    const awareness = this.analyzeSituationalAwareness(gameData);
    const execution = this.analyzeExecution(gameData);
    const leadership = this.analyzeLeadership(gameData);

    const overallScore = (decisions.score + awareness.score + execution.score + leadership.score) / 4;

    return {
      overallScore,
      breakdown: {
        decisions,
        awareness,
        execution,
        leadership
      },
      grade: this.getIQGrade(overallScore),
      improvements: this.generateIQImprovements(decisions, awareness, execution, leadership)
    };
  }

  analyzeDecisions(gameData) {
    const { stats, shots, passes } = gameData;
    let score = 50; // Base score
    
    // Shot selection
    if (shots && shots.length > 0) {
      const goodShots = shots.filter(shot => shot.quality > 70).length;
      const shotSelectionRatio = goodShots / shots.length;
      score += (shotSelectionRatio - 0.5) * 40; // +/-20 points
    }

    // Assist to turnover ratio
    const atoRatio = stats.assists / Math.max(stats.turnovers, 1);
    if (atoRatio > 2) score += 15;
    else if (atoRatio > 1.5) score += 10;
    else if (atoRatio < 1) score -= 15;

    return {
      score: Math.max(0, Math.min(100, score)),
      factors: {
        shotSelection: shotSelectionRatio || 0,
        assistToTurnoverRatio: atoRatio
      }
    };
  }

  analyzeSituationalAwareness(gameData) {
    const { clutchPerformance, timeAndScore } = gameData;
    let score = 50;

    // Clutch performance
    if (clutchPerformance) {
      if (clutchPerformance.efficiency > 0.6) score += 20;
      else if (clutchPerformance.efficiency < 0.4) score -= 15;
    }

    // Time and score awareness
    if (timeAndScore) {
      const appropriateUrgency = timeAndScore.decisions.filter(d => d.appropriate).length;
      const urgencyRatio = appropriateUrgency / timeAndScore.decisions.length;
      score += (urgencyRatio - 0.5) * 30;
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      factors: {
        clutchPerformance: clutchPerformance?.efficiency || 0,
        timeAwareness: timeAndScore?.urgencyRatio || 0
      }
    };
  }

  getIQGrade(score) {
    if (score >= 90) return 'Elite';
    if (score >= 80) return 'High';
    if (score >= 70) return 'Above Average';
    if (score >= 60) return 'Average';
    if (score >= 50) return 'Below Average';
    return 'Needs Development';
  }
}

// Export the main class
export { BasketballAnalyticsEngine };
export default BasketballAnalyticsEngine;
