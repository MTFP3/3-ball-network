/**
 * Team Chemistry & Formation Analyzer
 * Advanced team dynamics and tactical analysis
 */

class TeamChemistryAnalyzer {
  constructor() {
    this.playerConnections = new Map();
    this.formations = new FormationDetector();
    this.chemistryMetrics = new ChemistryMetrics();
    this.communicationTracker = new CommunicationTracker();
  }

  analyzeTeam(gameData) {
    const players = gameData.players;
    const playByPlay = gameData.playByPlay;
    const tracking = gameData.tracking;

    return {
      overallChemistry: this.calculateOverallChemistry(players, playByPlay),
      playerConnections: this.analyzePlayerConnections(players, playByPlay),
      formations: this.formations.analyze(tracking),
      communication: this.communicationTracker.analyze(gameData),
      leadership: this.identifyLeadership(players, playByPlay),
      teamDynamics: this.analyzeTeamDynamics(gameData),
      recommendations: this.generateTeamRecommendations(players, playByPlay)
    };
  }

  calculateOverallChemistry(players, playByPlay) {
    const metrics = {
      passEfficiency: this.calculatePassEfficiency(playByPlay),
      ballMovement: this.analyzeBallMovement(playByPlay),
      spacing: this.analyzeSpacing(playByPlay),
      transitions: this.analyzeTransitions(playByPlay),
      defensive: this.analyzeDefensiveChemistry(playByPlay)
    };

    const weights = {
      passEfficiency: 0.25,
      ballMovement: 0.20,
      spacing: 0.20,
      transitions: 0.20,
      defensive: 0.15
    };

    const overallScore = Object.keys(weights).reduce((total, metric) => {
      return total + (metrics[metric] * weights[metric]);
    }, 0);

    return {
      overall: Math.round(overallScore),
      breakdown: metrics,
      grade: this.getChemistryGrade(overallScore),
      trend: this.calculateChemistryTrend(playByPlay)
    };
  }

  analyzePlayerConnections(players, playByPlay) {
    const connections = new Map();
    
    // Initialize connections
    players.forEach(p1 => {
      players.forEach(p2 => {
        if (p1.id !== p2.id) {
          const key = [p1.id, p2.id].sort().join('-');
          if (!connections.has(key)) {
            connections.set(key, {
              players: [p1.id, p2.id],
              passes: 0,
              assists: 0,
              screens: 0,
              defensiveRotations: 0,
              timeOnCourt: 0,
              efficiency: 0,
              chemistry: 0
            });
          }
        }
      });
    });

    // Analyze play-by-play for connections
    playByPlay.forEach(play => {
      if (play.type === 'pass' && play.from && play.to) {
        const key = [play.from, play.to].sort().join('-');
        const connection = connections.get(key);
        if (connection) {
          connection.passes++;
          if (play.assisted) connection.assists++;
        }
      }

      if (play.type === 'screen') {
        const key = [play.screener, play.screenee].sort().join('-');
        const connection = connections.get(key);
        if (connection) connection.screens++;
      }

      if (play.type === 'defensive_rotation') {
        const key = [play.from, play.to].sort().join('-');
        const connection = connections.get(key);
        if (connection) connection.defensiveRotations++;
      }
    });

    // Calculate connection strengths
    connections.forEach((connection, key) => {
      connection.efficiency = this.calculateConnectionEfficiency(connection);
      connection.chemistry = this.calculateConnectionChemistry(connection);
      connection.strength = this.getConnectionStrength(connection.chemistry);
    });

    return Array.from(connections.values())
      .sort((a, b) => b.chemistry - a.chemistry);
  }

  calculateConnectionEfficiency(connection) {
    const totalInteractions = connection.passes + connection.screens + connection.defensiveRotations;
    if (totalInteractions === 0) return 0;

    const successfulInteractions = connection.assists + (connection.screens * 0.7) + 
                                 (connection.defensiveRotations * 0.8);
    
    return (successfulInteractions / totalInteractions) * 100;
  }

  calculateConnectionChemistry(connection) {
    const factors = {
      passFrequency: Math.min(connection.passes / 10, 1) * 30, // Max 30 points
      assistRate: connection.passes > 0 ? (connection.assists / connection.passes) * 40 : 0, // Max 40 points
      screenUsage: Math.min(connection.screens / 5, 1) * 15, // Max 15 points
      defensiveCoordination: Math.min(connection.defensiveRotations / 3, 1) * 15 // Max 15 points
    };

    return Object.values(factors).reduce((sum, value) => sum + value, 0);
  }

  getConnectionStrength(chemistry) {
    if (chemistry >= 80) return 'Excellent';
    if (chemistry >= 65) return 'Strong';
    if (chemistry >= 50) return 'Good';
    if (chemistry >= 35) return 'Developing';
    return 'Weak';
  }

  analyzeBallMovement(playByPlay) {
    const possessions = this.groupByPossession(playByPlay);
    let totalScore = 0;
    let validPossessions = 0;

    possessions.forEach(possession => {
      const passes = possession.filter(play => play.type === 'pass').length;
      const duration = possession[possession.length - 1].time - possession[0].time;
      const outcome = possession[possession.length - 1];

      if (passes > 0) {
        validPossessions++;
        let possessionScore = 50; // Base score

        // Reward more passes
        possessionScore += Math.min(passes * 8, 40);

        // Reward good outcomes
        if (outcome.type === 'made_shot') possessionScore += 20;
        else if (outcome.type === 'assist') possessionScore += 15;
        else if (outcome.type === 'foul_drawn') possessionScore += 10;

        // Penalize turnovers
        if (outcome.type === 'turnover') possessionScore -= 30;

        // Optimal possession time (8-16 seconds)
        if (duration >= 8 && duration <= 16) possessionScore += 10;
        else if (duration < 4) possessionScore -= 15;

        totalScore += Math.max(0, Math.min(100, possessionScore));
      }
    });

    return validPossessions > 0 ? totalScore / validPossessions : 0;
  }

  analyzeSpacing(playByPlay) {
    // Analyze player positioning and spacing
    const spacingData = playByPlay.filter(play => play.positions);
    let totalSpacing = 0;
    let validPlays = 0;

    spacingData.forEach(play => {
      const positions = play.positions;
      if (positions && positions.length >= 5) {
        const spacing = this.calculateSpacingScore(positions);
        totalSpacing += spacing;
        validPlays++;
      }
    });

    return validPlays > 0 ? totalSpacing / validPlays : 75; // Default good spacing
  }

  calculateSpacingScore(positions) {
    let spacingScore = 50;
    const distances = [];

    // Calculate distances between all players
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dist = Math.sqrt(
          Math.pow(positions[i].x - positions[j].x, 2) + 
          Math.pow(positions[i].y - positions[j].y, 2)
        );
        distances.push(dist);
      }
    }

    const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
    const idealDistance = 0.2; // 20% of court width/height

    // Score based on how close to ideal spacing
    const distanceRatio = avgDistance / idealDistance;
    if (distanceRatio >= 0.8 && distanceRatio <= 1.2) {
      spacingScore += 30; // Good spacing
    } else if (distanceRatio < 0.6) {
      spacingScore -= 20; // Too cramped
    } else if (distanceRatio > 1.5) {
      spacingScore -= 15; // Too spread out
    }

    // Check for clustering (bad spacing indicator)
    const clusteredPairs = distances.filter(d => d < 0.1).length;
    spacingScore -= clusteredPairs * 10;

    return Math.max(0, Math.min(100, spacingScore));
  }

  identifyLeadership(players, playByPlay) {
    const leadershipScores = new Map();

    players.forEach(player => {
      leadershipScores.set(player.id, {
        playerId: player.id,
        name: player.name,
        position: player.position,
        vocalLeadership: 0,
        playmaking: 0,
        clutchPerformance: 0,
        defensiveLeadership: 0,
        overallLeadership: 0
      });
    });

    // Analyze leadership indicators
    playByPlay.forEach(play => {
      if (play.playerId && leadershipScores.has(play.playerId)) {
        const leader = leadershipScores.get(play.playerId);

        // Playmaking leadership
        if (play.type === 'assist') leader.playmaking += 3;
        if (play.type === 'hockey_assist') leader.playmaking += 2;

        // Clutch leadership (last 5 minutes, close game)
        if (play.isClutch) {
          if (play.type === 'made_shot') leader.clutchPerformance += 5;
          if (play.type === 'assist') leader.clutchPerformance += 4;
          if (play.type === 'steal') leader.clutchPerformance += 3;
        }

        // Defensive leadership
        if (play.type === 'defensive_stop') leader.defensiveLeadership += 2;
        if (play.type === 'charge') leader.defensiveLeadership += 4;
        if (play.type === 'help_defense') leader.defensiveLeadership += 2;

        // Communication/vocal leadership
        if (play.communication) leader.vocalLeadership += 1;
      }
    });

    // Calculate overall leadership scores
    leadershipScores.forEach(leader => {
      leader.overallLeadership = (
        leader.playmaking * 0.3 +
        leader.clutchPerformance * 0.3 +
        leader.defensiveLeadership * 0.25 +
        leader.vocalLeadership * 0.15
      );
    });

    return Array.from(leadershipScores.values())
      .sort((a, b) => b.overallLeadership - a.overallLeadership)
      .slice(0, 3); // Top 3 leaders
  }

  generateTeamRecommendations(players, playByPlay) {
    const recommendations = [];
    const chemistry = this.calculateOverallChemistry(players, playByPlay);
    const connections = this.analyzePlayerConnections(players, playByPlay);

    // Ball movement recommendations
    if (chemistry.breakdown.ballMovement < 60) {
      recommendations.push({
        category: 'Ball Movement',
        priority: 'High',
        issue: 'Limited ball movement reducing offensive efficiency',
        solution: 'Implement more passing drills and motion offense',
        drills: ['5-man weave', '4-on-4 motion', 'Pass and cut'],
        expectedImprovement: '15-20% increase in offensive efficiency'
      });
    }

    // Spacing recommendations
    if (chemistry.breakdown.spacing < 65) {
      recommendations.push({
        category: 'Spacing',
        priority: 'Medium',
        issue: 'Poor floor spacing limiting driving lanes',
        solution: 'Work on positional awareness and court vision',
        drills: ['Spacing drill', '5-spot shooting', 'Drive and kick'],
        expectedImprovement: 'Better shot selection and scoring opportunities'
      });
    }

    // Connection recommendations
    const weakConnections = connections.filter(conn => conn.chemistry < 40);
    if (weakConnections.length > 0) {
      recommendations.push({
        category: 'Player Chemistry',
        priority: 'Medium',
        issue: `${weakConnections.length} player pairs need stronger connections`,
        solution: 'Focus on two-man games and combination plays',
        pairings: weakConnections.slice(0, 3).map(conn => ({
          players: conn.players,
          focus: 'Pick and roll, off-ball screens, defensive communication'
        }))
      });
    }

    // Leadership recommendations
    if (!this.hasStrongLeader(players, playByPlay)) {
      recommendations.push({
        category: 'Leadership',
        priority: 'High',
        issue: 'Team lacks clear vocal and on-court leadership',
        solution: 'Develop leadership roles and communication systems',
        actions: [
          'Assign team captain responsibilities',
          'Practice vocal communication drills',
          'Implement leadership rotation system'
        ]
      });
    }

    return recommendations;
  }

  hasStrongLeader(players, playByPlay) {
    const leaders = this.identifyLeadership(players, playByPlay);
    return leaders.length > 0 && leaders[0].overallLeadership > 50;
  }

  getChemistryGrade(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Needs Work';
    return 'Poor';
  }

  groupByPossession(playByPlay) {
    const possessions = [];
    let currentPossession = [];

    playByPlay.forEach(play => {
      currentPossession.push(play);

      // End possession on certain events
      if (['made_shot', 'missed_shot', 'turnover', 'defensive_rebound'].includes(play.type)) {
        if (currentPossession.length > 0) {
          possessions.push([...currentPossession]);
          currentPossession = [];
        }
      }
    });

    return possessions;
  }
}

// Formation Detection System
class FormationDetector {
  constructor() {
    this.knownFormations = this.defineFormations();
  }

  defineFormations() {
    return {
      'man-to-man': {
        pattern: 'distributed',
        spacing: 'even',
        movement: 'individual'
      },
      'zone-2-3': {
        pattern: 'zonal',
        positions: [
          { role: 'guard', zone: 'perimeter-left' },
          { role: 'guard', zone: 'perimeter-right' },
          { role: 'forward', zone: 'low-post-left' },
          { role: 'forward', zone: 'low-post-right' },
          { role: 'center', zone: 'paint' }
        ]
      },
      'pick-and-roll': {
        pattern: 'screen-action',
        participants: 2,
        movement: 'coordinated'
      },
      'motion-offense': {
        pattern: 'continuous-movement',
        characteristics: ['screens', 'cuts', 'ball-movement']
      }
    };
  }

  analyze(trackingData) {
    if (!trackingData || trackingData.length === 0) {
      return this.getDefaultFormationAnalysis();
    }

    const formations = [];
    const segments = this.segmentTrackingData(trackingData);

    segments.forEach(segment => {
      const formation = this.detectFormation(segment);
      if (formation) {
        formations.push(formation);
      }
    });

    return {
      detectedFormations: formations,
      primaryFormation: this.getPrimaryFormation(formations),
      formationChanges: formations.length,
      efficiency: this.calculateFormationEfficiency(formations),
      recommendations: this.generateFormationRecommendations(formations)
    };
  }

  detectFormation(segment) {
    // Simplified formation detection
    const positions = segment.map(frame => frame.positions).filter(p => p);
    if (positions.length === 0) return null;

    const avgPositions = this.calculateAveragePositions(positions);
    const movement = this.analyzeMovementPattern(segment);
    const spacing = this.analyzeFormationSpacing(avgPositions);

    return {
      type: this.classifyFormation(avgPositions, movement, spacing),
      duration: segment.length,
      efficiency: this.calculateSegmentEfficiency(segment),
      positions: avgPositions,
      characteristics: {
        spacing: spacing.type,
        movement: movement.type,
        coordination: movement.coordination
      }
    };
  }

  classifyFormation(positions, movement, spacing) {
    // Simplified classification logic
    if (spacing.variance < 0.1 && movement.coordination > 0.7) {
      return 'motion-offense';
    } else if (spacing.clustered && movement.type === 'screen-action') {
      return 'pick-and-roll';
    } else if (spacing.type === 'zonal') {
      return 'zone-defense';
    } else {
      return 'man-to-man';
    }
  }

  getPrimaryFormation(formations) {
    if (formations.length === 0) return 'undefined';

    const formationCounts = {};
    formations.forEach(formation => {
      formationCounts[formation.type] = (formationCounts[formation.type] || 0) + 1;
    });

    return Object.entries(formationCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
  }

  getDefaultFormationAnalysis() {
    return {
      detectedFormations: [],
      primaryFormation: 'man-to-man',
      formationChanges: 0,
      efficiency: 75,
      recommendations: [{
        type: 'data',
        message: 'Enable player tracking for detailed formation analysis'
      }]
    };
  }
}

// Communication Tracker
class CommunicationTracker {
  analyze(gameData) {
    return {
      vocalCommunication: this.analyzeVocalCommunication(gameData),
      nonVerbalCommunication: this.analyzeNonVerbalCommunication(gameData),
      teamCommunicationScore: 75, // Placeholder
      improvements: this.generateCommunicationImprovements()
    };
  }

  analyzeVocalCommunication(gameData) {
    return {
      frequency: 'Medium',
      clarity: 'Good',
      effectiveness: 80
    };
  }

  generateCommunicationImprovements() {
    return [
      'Implement standard defensive calls',
      'Practice transition communication',
      'Develop pick-and-roll communication protocols'
    ];
  }
}

// Chemistry Metrics Calculator
class ChemistryMetrics {
  calculateTeamFlow(playByPlay) {
    // Calculate how well the team flows together
    const flowIndicators = playByPlay.filter(play => 
      ['assist', 'screen_assist', 'hockey_assist'].includes(play.type)
    );

    return {
      assistRate: flowIndicators.length / playByPlay.length,
      ballMovementEfficiency: this.calculateBallMovementEfficiency(playByPlay),
      transitionEfficiency: this.calculateTransitionEfficiency(playByPlay)
    };
  }

  calculateBallMovementEfficiency(playByPlay) {
    const possessions = this.groupIntoPossessions(playByPlay);
    let totalEfficiency = 0;

    possessions.forEach(possession => {
      const passes = possession.filter(play => play.type === 'pass').length;
      const outcome = possession[possession.length - 1];
      
      let efficiency = 50; // Base
      efficiency += passes * 5; // Reward ball movement
      
      if (outcome.type === 'made_shot') efficiency += 30;
      else if (outcome.type === 'foul_drawn') efficiency += 20;
      else if (outcome.type === 'turnover') efficiency -= 40;

      totalEfficiency += Math.max(0, Math.min(100, efficiency));
    });

    return possessions.length > 0 ? totalEfficiency / possessions.length : 0;
  }
}

export { TeamChemistryAnalyzer };
export default TeamChemistryAnalyzer;
