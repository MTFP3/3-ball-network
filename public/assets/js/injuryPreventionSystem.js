/**
 * Injury Prevention & Health Monitoring System
 * Advanced basketball injury risk assessment and prevention
 */

class InjuryPreventionSystem {
  constructor() {
    this.playerProfiles = new Map();
    this.riskFactors = new RiskFactorAnalyzer();
    this.fatigueMonitor = new FatigueMonitor();
    this.movementAnalyzer = new MovementAnalyzer();
    this.recoveryTracker = new RecoveryTracker();
    this.alertSystem = new HealthAlertSystem();
  }

  async assessPlayer(playerId, gameData, historicalData = null) {
    const profile = await this.getPlayerProfile(playerId);
    const currentRisk = await this.calculateCurrentRisk(playerId, gameData);
    const fatigueLevel = this.fatigueMonitor.assess(gameData, profile);
    const movementRisk = this.movementAnalyzer.assessRisk(gameData.tracking);
    const recoveryStatus = this.recoveryTracker.getStatus(playerId);

    const overallRisk = this.calculateOverallRisk({
      currentRisk,
      fatigueLevel,
      movementRisk,
      recoveryStatus,
      profile
    });

    const recommendations = this.generateRecommendations(overallRisk, profile);
    
    // Generate alerts if necessary
    if (overallRisk.level === 'high' || overallRisk.level === 'critical') {
      this.alertSystem.generateAlert(playerId, overallRisk, recommendations);
    }

    return {
      playerId,
      timestamp: Date.now(),
      overallRisk,
      breakdown: {
        fatigue: fatigueLevel,
        movement: movementRisk,
        recovery: recoveryStatus,
        historical: currentRisk
      },
      recommendations,
      alerts: this.alertSystem.getActiveAlerts(playerId)
    };
  }

  async getPlayerProfile(playerId) {
    if (!this.playerProfiles.has(playerId)) {
      // Create default profile - in real implementation, this would come from database
      this.playerProfiles.set(playerId, {
        id: playerId,
        age: 18, // Default youth player
        height: 72, // inches
        weight: 180, // lbs
        position: 'G',
        injuryHistory: [],
        baseline: {
          maxHeartRate: 200,
          restingHeartRate: 60,
          vo2Max: 55,
          bodyFatPercentage: 8
        },
        riskFactors: {
          previousInjuries: [],
          muscularImbalances: [],
          flexibility: 'average',
          strength: 'average'
        },
        lastAssessment: null
      });
    }
    return this.playerProfiles.get(playerId);
  }

  calculateCurrentRisk(playerId, gameData) {
    const risk = {
      level: 'low',
      score: 0,
      factors: {}
    };

    // Playing time risk
    const minutes = gameData.stats?.minutes || 0;
    if (minutes > 35) {
      risk.factors.playingTime = { score: 20, description: 'High playing time' };
    } else if (minutes > 28) {
      risk.factors.playingTime = { score: 10, description: 'Moderate playing time' };
    }

    // Physical contact risk
    const contact = this.assessContactRisk(gameData);
    if (contact.high) {
      risk.factors.contact = { score: 15, description: 'High contact game' };
    }

    // Game intensity risk
    const intensity = this.assessGameIntensity(gameData);
    if (intensity > 80) {
      risk.factors.intensity = { score: 12, description: 'High intensity game' };
    }

    // Calculate total score
    risk.score = Object.values(risk.factors).reduce((sum, factor) => sum + factor.score, 0);
    risk.level = this.getRiskLevel(risk.score);

    return risk;
  }

  assessContactRisk(gameData) {
    const stats = gameData.stats || {};
    const contactEvents = (stats.fouls || 0) + (stats.charges || 0) + (stats.technicals || 0);
    const rebounds = (stats.offensiveRebounds || 0) + (stats.defensiveRebounds || 0);
    
    return {
      high: contactEvents > 5 || rebounds > 8,
      score: contactEvents + (rebounds * 0.5),
      events: contactEvents,
      rebounds
    };
  }

  assessGameIntensity(gameData) {
    // Simplified intensity calculation
    const stats = gameData.stats || {};
    const pace = gameData.pace || 80;
    const competitiveness = gameData.competitiveness || 75;
    
    let intensity = 50; // Base intensity
    
    // High pace increases intensity
    intensity += Math.max(0, (pace - 75) * 0.5);
    
    // Close game increases intensity
    intensity += (competitiveness - 50) * 0.4;
    
    // High stat production indicates high intensity
    const statIntensity = (stats.points || 0) + (stats.rebounds || 0) + (stats.assists || 0);
    intensity += Math.min(statIntensity * 0.8, 20);

    return Math.min(100, intensity);
  }

  calculateOverallRisk(assessmentData) {
    const weights = {
      currentRisk: 0.3,
      fatigueLevel: 0.35,
      movementRisk: 0.25,
      recoveryStatus: 0.1
    };

    let totalScore = 0;
    let maxScore = 0;

    Object.entries(weights).forEach(([factor, weight]) => {
      const factorData = assessmentData[factor];
      let score = 0;
      
      if (typeof factorData === 'object' && factorData.score !== undefined) {
        score = factorData.score;
      } else if (typeof factorData === 'number') {
        score = factorData;
      }
      
      totalScore += score * weight;
      maxScore += 100 * weight;
    });

    const overallScore = (totalScore / maxScore) * 100;
    const level = this.getRiskLevel(overallScore);

    return {
      score: Math.round(overallScore),
      level,
      confidence: this.calculateConfidence(assessmentData),
      factors: this.identifyTopRiskFactors(assessmentData)
    };
  }

  getRiskLevel(score) {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'moderate';
    if (score >= 20) return 'low';
    return 'minimal';
  }

  generateRecommendations(overallRisk, profile) {
    const recommendations = [];

    // Risk-based recommendations
    switch (overallRisk.level) {
      case 'critical':
        recommendations.push({
          priority: 'immediate',
          category: 'medical',
          action: 'Immediate medical evaluation required',
          description: 'Player should be removed from game/practice and evaluated by medical staff',
          timeline: 'Immediate'
        });
        break;

      case 'high':
        recommendations.push({
          priority: 'high',
          category: 'rest',
          action: 'Reduce playing time and monitor closely',
          description: 'Limit minutes, increase substitutions, enhanced monitoring',
          timeline: 'This game/practice'
        });
        break;

      case 'moderate':
        recommendations.push({
          priority: 'medium',
          category: 'prevention',
          action: 'Implement preventive measures',
          description: 'Extra warm-up, stretching, hydration focus',
          timeline: 'Next 24 hours'
        });
        break;
    }

    // Factor-specific recommendations
    overallRisk.factors.forEach(factor => {
      switch (factor.type) {
        case 'fatigue':
          recommendations.push({
            priority: 'medium',
            category: 'recovery',
            action: 'Enhanced recovery protocol',
            description: 'Extend rest periods, hydration, nutrition focus',
            timeline: 'Post-game',
            specifics: ['15-20 min ice bath', 'Electrolyte replacement', '8+ hours sleep']
          });
          break;

        case 'movement':
          recommendations.push({
            priority: 'medium',
            category: 'biomechanics',
            action: 'Movement assessment and correction',
            description: 'Analyze and correct movement patterns',
            timeline: 'Next practice',
            specifics: ['Landing mechanics drill', 'Balance training', 'Proprioception work']
          });
          break;

        case 'contact':
          recommendations.push({
            priority: 'low',
            category: 'protection',
            action: 'Protective measures',
            description: 'Consider protective equipment or positioning adjustments',
            timeline: 'Next game',
            specifics: ['Knee pads', 'Ankle tape', 'Modified defensive stance']
          });
          break;
      }
    });

    // Age-specific recommendations
    if (profile.age < 16) {
      recommendations.push({
        priority: 'ongoing',
        category: 'development',
        action: 'Youth-specific monitoring',
        description: 'Growth-related injury prevention protocols',
        timeline: 'Ongoing',
        specifics: ['Growth plate monitoring', 'Flexibility emphasis', 'Gradual load increase']
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { immediate: 4, high: 3, medium: 2, low: 1, ongoing: 0 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  identifyTopRiskFactors(assessmentData) {
    const factors = [];

    // Analyze each component
    if (assessmentData.fatigueLevel?.score > 60) {
      factors.push({
        type: 'fatigue',
        severity: 'high',
        description: 'Elevated fatigue levels detected',
        score: assessmentData.fatigueLevel.score
      });
    }

    if (assessmentData.movementRisk?.asymmetry > 15) {
      factors.push({
        type: 'movement',
        severity: 'moderate',
        description: 'Movement asymmetries detected',
        score: assessmentData.movementRisk.asymmetry
      });
    }

    if (assessmentData.currentRisk?.factors?.contact) {
      factors.push({
        type: 'contact',
        severity: 'moderate',
        description: 'High contact exposure',
        score: assessmentData.currentRisk.factors.contact.score
      });
    }

    return factors.sort((a, b) => b.score - a.score).slice(0, 3);
  }

  calculateConfidence(assessmentData) {
    let confidence = 50; // Base confidence
    
    // Higher confidence with more data
    if (assessmentData.fatigueLevel?.dataQuality === 'high') confidence += 15;
    if (assessmentData.movementRisk?.dataPoints > 100) confidence += 15;
    if (assessmentData.recoveryStatus?.lastUpdate < 24) confidence += 10;
    
    return Math.min(100, confidence);
  }
}

// Fatigue Monitoring System
class FatigueMonitor {
  assess(gameData, profile) {
    const physiological = this.assessPhysiological(gameData, profile);
    const biomechanical = this.assessBiomechanical(gameData);
    const performance = this.assessPerformance(gameData);
    const subjective = this.assessSubjective(gameData);

    const overallScore = (
      physiological.score * 0.3 +
      biomechanical.score * 0.25 +
      performance.score * 0.25 +
      subjective.score * 0.2
    );

    return {
      score: Math.round(overallScore),
      level: this.getFatigueLevel(overallScore),
      breakdown: {
        physiological,
        biomechanical,
        performance,
        subjective
      },
      recommendations: this.generateFatigueRecommendations(overallScore)
    };
  }

  assessPhysiological(gameData, profile) {
    // Simulated heart rate and other physiological markers
    const minutes = gameData.stats?.minutes || 0;
    const intensity = this.estimateIntensity(gameData);
    
    let score = 0;
    
    // Playing time fatigue
    if (minutes > 30) score += 25;
    else if (minutes > 25) score += 15;
    else if (minutes > 20) score += 10;
    
    // Intensity fatigue
    if (intensity > 85) score += 20;
    else if (intensity > 75) score += 15;
    else if (intensity > 65) score += 10;
    
    // Estimated heart rate zones (if no actual data)
    const estimatedAvgHR = 140 + (intensity * 0.5) + (minutes * 0.8);
    const maxHR = profile.baseline?.maxHeartRate || 200;
    const hrPercent = (estimatedAvgHR / maxHR) * 100;
    
    if (hrPercent > 85) score += 15;
    else if (hrPercent > 75) score += 10;

    return {
      score: Math.min(100, score),
      metrics: {
        playingTime: minutes,
        estimatedHR: Math.round(estimatedAvgHR),
        intensity: intensity,
        heartRateZone: this.getHRZone(hrPercent)
      }
    };
  }

  assessBiomechanical(gameData) {
    // Analyze movement efficiency and biomechanical markers of fatigue
    const tracking = gameData.tracking;
    let score = 0;
    
    if (tracking && tracking.length > 0) {
      // Analyze movement quality decline over time
      const firstHalf = tracking.slice(0, Math.floor(tracking.length / 2));
      const secondHalf = tracking.slice(Math.floor(tracking.length / 2));
      
      const firstHalfQuality = this.calculateMovementQuality(firstHalf);
      const secondHalfQuality = this.calculateMovementQuality(secondHalf);
      
      const qualityDecline = ((firstHalfQuality - secondHalfQuality) / firstHalfQuality) * 100;
      
      if (qualityDecline > 20) score += 30;
      else if (qualityDecline > 15) score += 20;
      else if (qualityDecline > 10) score += 15;
      
      return {
        score: Math.min(100, score),
        qualityDecline,
        movementEfficiency: secondHalfQuality
      };
    }
    
    // Fallback assessment based on stats
    const stats = gameData.stats || {};
    const turnovers = stats.turnovers || 0;
    const fouls = stats.fouls || 0;
    
    // Higher turnovers and fouls can indicate fatigue
    score += Math.min(turnovers * 8, 40);
    score += Math.min(fouls * 6, 30);
    
    return {
      score: Math.min(100, score),
      indicators: {
        turnovers,
        fouls,
        estimatedDecline: score > 30 ? 'significant' : 'minimal'
      }
    };
  }

  assessPerformance(gameData) {
    const stats = gameData.stats || {};
    let score = 0;
    
    // Performance decline indicators
    const fgPercentage = stats.fga > 0 ? (stats.fgm / stats.fga) * 100 : 50;
    const ftPercentage = stats.fta > 0 ? (stats.ftm / stats.fta) * 100 : 75;
    
    // Poor shooting can indicate fatigue
    if (fgPercentage < 35) score += 20;
    else if (fgPercentage < 40) score += 15;
    
    if (ftPercentage < 60) score += 25;
    else if (ftPercentage < 70) score += 15;
    
    // Defensive effort indicators
    const deflections = stats.deflections || 0;
    const charges = stats.charges || 0;
    const minutes = stats.minutes || 1;
    
    const defensiveEffort = (deflections + charges) / (minutes / 10);
    if (defensiveEffort < 1) score += 15; // Low defensive activity
    
    return {
      score: Math.min(100, score),
      indicators: {
        fieldGoalPercentage: fgPercentage,
        freeThrowPercentage: ftPercentage,
        defensiveEffort: defensiveEffort
      }
    };
  }

  assessSubjective(gameData) {
    // In a real implementation, this would come from player self-reporting
    // For now, estimate based on game situation
    let score = 0;
    
    const minutes = gameData.stats?.minutes || 0;
    const gameIntensity = this.estimateIntensity(gameData);
    
    // Estimate subjective fatigue based on objective measures
    if (minutes > 30 && gameIntensity > 80) score += 40;
    else if (minutes > 25 && gameIntensity > 70) score += 30;
    else if (minutes > 20) score += 20;
    
    return {
      score: Math.min(100, score),
      estimated: true,
      factors: {
        playingTime: minutes,
        gameIntensity: gameIntensity
      }
    };
  }

  estimateIntensity(gameData) {
    const stats = gameData.stats || {};
    let intensity = 50;
    
    // High stat production indicates high intensity
    intensity += Math.min((stats.points || 0) * 1.5, 20);
    intensity += Math.min((stats.rebounds || 0) * 2, 15);
    intensity += Math.min((stats.assists || 0) * 2, 10);
    intensity += Math.min((stats.steals || 0) * 3, 15);
    
    return Math.min(100, intensity);
  }

  getFatigueLevel(score) {
    if (score >= 80) return 'severe';
    if (score >= 60) return 'high';
    if (score >= 40) return 'moderate';
    if (score >= 20) return 'mild';
    return 'minimal';
  }

  generateFatigueRecommendations(score) {
    const recommendations = [];
    
    if (score >= 60) {
      recommendations.push('Immediate rest and recovery protocols');
      recommendations.push('Hydration and electrolyte replacement');
      recommendations.push('Consider player substitution');
    } else if (score >= 40) {
      recommendations.push('Monitor closely for signs of decline');
      recommendations.push('Ensure adequate hydration');
      recommendations.push('Plan recovery time post-game');
    } else {
      recommendations.push('Continue normal monitoring');
      recommendations.push('Maintain hydration');
    }
    
    return recommendations;
  }

  calculateMovementQuality(trackingData) {
    if (!trackingData || trackingData.length === 0) return 75;
    
    // Simplified movement quality score
    let quality = 75;
    
    // Analyze movement smoothness, acceleration changes, etc.
    // This is a simplified version - real implementation would be much more complex
    const movements = trackingData.filter(frame => frame.velocity);
    if (movements.length > 0) {
      const avgVelocity = movements.reduce((sum, frame) => sum + frame.velocity, 0) / movements.length;
      const velocityVariance = this.calculateVariance(movements.map(frame => frame.velocity));
      
      // Lower variance indicates more consistent movement (less fatigue)
      quality -= Math.min(velocityVariance * 5, 25);
    }
    
    return Math.max(25, quality);
  }

  calculateVariance(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }

  getHRZone(hrPercent) {
    if (hrPercent >= 90) return 'Zone 5 (Neuromuscular)';
    if (hrPercent >= 85) return 'Zone 4 (Lactate Threshold)';
    if (hrPercent >= 75) return 'Zone 3 (Aerobic)';
    if (hrPercent >= 65) return 'Zone 2 (Base)';
    return 'Zone 1 (Recovery)';
  }
}

// Movement Analysis for Injury Risk
class MovementAnalyzer {
  assessRisk(trackingData) {
    if (!trackingData || trackingData.length === 0) {
      return this.getDefaultMovementRisk();
    }

    const asymmetry = this.analyzeAsymmetry(trackingData);
    const landing = this.analyzeLandingMechanics(trackingData);
    const cutting = this.analyzeCuttingMechanics(trackingData);
    const acceleration = this.analyzeAcceleration(trackingData);

    const overallRisk = (asymmetry + landing.risk + cutting.risk + acceleration.risk) / 4;

    return {
      score: Math.round(overallRisk),
      level: this.getMovementRiskLevel(overallRisk),
      breakdown: {
        asymmetry,
        landing,
        cutting,
        acceleration
      },
      recommendations: this.generateMovementRecommendations(overallRisk, {
        asymmetry, landing, cutting, acceleration
      })
    };
  }

  analyzeAsymmetry(trackingData) {
    // Simplified asymmetry analysis
    const leftSideMovements = trackingData.filter(frame => frame.leftFootContact);
    const rightSideMovements = trackingData.filter(frame => frame.rightFootContact);
    
    if (leftSideMovements.length === 0 || rightSideMovements.length === 0) {
      return 15; // Default moderate asymmetry
    }
    
    const leftForce = leftSideMovements.reduce((sum, frame) => sum + (frame.force || 1), 0) / leftSideMovements.length;
    const rightForce = rightSideMovements.reduce((sum, frame) => sum + (frame.force || 1), 0) / rightSideMovements.length;
    
    const asymmetryPercent = Math.abs(leftForce - rightForce) / Math.max(leftForce, rightForce) * 100;
    
    // Higher asymmetry = higher risk
    return Math.min(asymmetryPercent * 2, 100);
  }

  analyzeLandingMechanics(trackingData) {
    const landingEvents = trackingData.filter(frame => frame.landing);
    
    if (landingEvents.length === 0) {
      return { risk: 20, quality: 75, events: 0 };
    }
    
    let totalRisk = 0;
    landingEvents.forEach(landing => {
      let landingRisk = 0;
      
      // Analyze landing characteristics
      if (landing.kneeValgus > 15) landingRisk += 25;
      if (landing.ankleStiffness > 80) landingRisk += 20;
      if (landing.asymmetricLanding) landingRisk += 30;
      
      totalRisk += landingRisk;
    });
    
    const avgRisk = totalRisk / landingEvents.length;
    
    return {
      risk: Math.min(avgRisk, 100),
      quality: Math.max(0, 100 - avgRisk),
      events: landingEvents.length
    };
  }

  getDefaultMovementRisk() {
    return {
      score: 25,
      level: 'low',
      breakdown: {
        asymmetry: 15,
        landing: { risk: 20, quality: 75, events: 0 },
        cutting: { risk: 25, quality: 70, events: 0 },
        acceleration: { risk: 20, quality: 75, events: 0 }
      },
      recommendations: ['Enable movement tracking for detailed analysis']
    };
  }

  getMovementRiskLevel(score) {
    if (score >= 70) return 'high';
    if (score >= 50) return 'moderate';
    if (score >= 30) return 'low';
    return 'minimal';
  }
}

// Recovery Tracking System
class RecoveryTracker {
  getStatus(playerId) {
    // In a real implementation, this would track sleep, nutrition, etc.
    return {
      sleepQuality: 75,
      nutritionScore: 80,
      hydrationLevel: 85,
      overallRecovery: 78,
      lastUpdate: Date.now() - (6 * 60 * 60 * 1000), // 6 hours ago
      recommendations: [
        'Maintain current sleep schedule',
        'Increase protein intake post-workout',
        'Continue current hydration levels'
      ]
    };
  }
}

// Health Alert System
class HealthAlertSystem {
  constructor() {
    this.activeAlerts = new Map();
  }

  generateAlert(playerId, risk, recommendations) {
    const alert = {
      id: Date.now(),
      playerId,
      level: risk.level,
      score: risk.score,
      message: this.getAlertMessage(risk.level),
      recommendations: recommendations.slice(0, 3), // Top 3 recommendations
      timestamp: Date.now(),
      acknowledged: false
    };

    if (!this.activeAlerts.has(playerId)) {
      this.activeAlerts.set(playerId, []);
    }
    this.activeAlerts.get(playerId).push(alert);

    // Emit alert event
    document.dispatchEvent(new CustomEvent('healthAlert', {
      detail: alert
    }));

    return alert;
  }

  getAlertMessage(level) {
    const messages = {
      critical: '🚨 CRITICAL: Immediate medical attention required',
      high: '⚠️ HIGH RISK: Player needs immediate rest and evaluation',
      moderate: '⚡ MODERATE RISK: Enhanced monitoring recommended',
      low: 'ℹ️ LOW RISK: Continue normal precautions'
    };
    return messages[level] || 'Monitor player condition';
  }

  getActiveAlerts(playerId) {
    return this.activeAlerts.get(playerId) || [];
  }

  acknowledgeAlert(playerId, alertId) {
    const alerts = this.activeAlerts.get(playerId);
    if (alerts) {
      const alert = alerts.find(a => a.id === alertId);
      if (alert) {
        alert.acknowledged = true;
        alert.acknowledgedAt = Date.now();
      }
    }
  }
}

// Risk Factor Analyzer
class RiskFactorAnalyzer {
  analyzeHistorical(playerId, injuryHistory) {
    const risk = {
      score: 0,
      factors: []
    };

    if (injuryHistory && injuryHistory.length > 0) {
      // Recent injuries increase risk
      const recentInjuries = injuryHistory.filter(injury => 
        Date.now() - injury.date < (365 * 24 * 60 * 60 * 1000) // Last year
      );

      risk.score += recentInjuries.length * 15;
      
      // Recurring injuries are especially concerning
      const injuryTypes = {};
      injuryHistory.forEach(injury => {
        injuryTypes[injury.type] = (injuryTypes[injury.type] || 0) + 1;
      });

      Object.entries(injuryTypes).forEach(([type, count]) => {
        if (count > 1) {
          risk.score += 20;
          risk.factors.push(`Recurring ${type} injuries`);
        }
      });
    }

    return {
      score: Math.min(100, risk.score),
      factors: risk.factors
    };
  }
}

export { InjuryPreventionSystem };
export default InjuryPreventionSystem;
