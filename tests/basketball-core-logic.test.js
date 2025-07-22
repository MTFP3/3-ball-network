/**
 * Simple basketball analytics test - no DOM dependencies
 * Tests the core basketball logic without requiring jsdom
 */

import { describe, it, expect } from '@jest/globals';

describe('Basketball Analytics Core Logic', () => {
  
  describe('Player Statistics Calculations', () => {
    it('should calculate field goal percentage correctly', () => {
      const calculateFGPercentage = (made, attempted) => {
        if (attempted === 0) return 0;
        return Math.round((made / attempted) * 100) / 100;
      };

      expect(calculateFGPercentage(10, 20)).toBe(0.5);
      expect(calculateFGPercentage(15, 30)).toBe(0.5);
      expect(calculateFGPercentage(0, 10)).toBe(0);
      expect(calculateFGPercentage(10, 0)).toBe(0);
    });

    it('should calculate player efficiency rating (PER)', () => {
      const calculatePER = (stats) => {
        const { points, rebounds, assists, steals, blocks, turnovers, fouls, fgAttempted, ftAttempted } = stats;
        
        // Simplified PER calculation
        const positiveActions = points + rebounds + assists + steals + blocks;
        const negativeActions = turnovers + fouls + (fgAttempted - points/2) + (ftAttempted - points*0.44);
        
        return Math.max(0, Math.round(((positiveActions - negativeActions) / 10) * 100) / 100);
      };

      const playerStats = {
        points: 25,
        rebounds: 8,
        assists: 6,
        steals: 2,
        blocks: 1,
        turnovers: 3,
        fouls: 2,
        fgAttempted: 20,
        ftAttempted: 8
      };

      const per = calculatePER(playerStats);
      expect(per).toBeGreaterThan(0);
      expect(typeof per).toBe('number');
    });

    it('should calculate basketball IQ score', () => {
      const calculateBasketballIQ = (gameStats) => {
        const { assists, turnovers, goodShots, badShots, defensiveStops, communicationRating } = gameStats;
        
        const decisionMaking = Math.min(100, (assists / Math.max(1, turnovers)) * 20);
        const shotSelection = Math.min(100, (goodShots / Math.max(1, goodShots + badShots)) * 100);
        const defense = Math.min(100, defensiveStops * 5);
        const communication = Math.min(100, communicationRating);
        
        return Math.round((decisionMaking + shotSelection + defense + communication) / 4);
      };

      const gameStats = {
        assists: 8,
        turnovers: 2,
        goodShots: 15,
        badShots: 3,
        defensiveStops: 12,
        communicationRating: 85
      };

      const iq = calculateBasketballIQ(gameStats);
      expect(iq).toBeGreaterThan(50);
      expect(iq).toBeLessThanOrEqual(100);
    });
  });

  describe('Team Chemistry Analysis', () => {
    it('should calculate team chemistry score', () => {
      const calculateTeamChemistry = (playerConnections) => {
        if (playerConnections.length === 0) return 0;
        
        const totalChemistry = playerConnections.reduce((sum, connection) => sum + connection.strength, 0);
        return Math.round((totalChemistry / playerConnections.length) * 100) / 100;
      };

      const connections = [
        { players: ['A', 'B'], strength: 0.85 },
        { players: ['B', 'C'], strength: 0.92 },
        { players: ['C', 'D'], strength: 0.78 },
        { players: ['A', 'D'], strength: 0.71 }
      ];

      const chemistry = calculateTeamChemistry(connections);
      expect(chemistry).toBe(0.82);
    });

    it('should identify strongest player connections', () => {
      const findStrongestConnections = (connections, threshold = 0.8) => {
        return connections.filter(conn => conn.strength >= threshold);
      };

      const connections = [
        { players: ['Johnson', 'Williams'], strength: 0.89 },
        { players: ['Smith', 'Davis'], strength: 0.76 },
        { players: ['Brown', 'Johnson'], strength: 0.83 },
        { players: ['Williams', 'Smith'], strength: 0.45 }
      ];

      const strongConnections = findStrongestConnections(connections);
      expect(strongConnections).toHaveLength(2);
      expect(strongConnections[0].players).toEqual(['Johnson', 'Williams']);
      expect(strongConnections[1].players).toEqual(['Brown', 'Johnson']);
    });
  });

  describe('Injury Prevention Analysis', () => {
    it('should calculate injury risk score', () => {
      const calculateInjuryRisk = (healthMetrics) => {
        const { fatigueLevel, previousInjuries, workloadIndex, recoveryScore, age } = healthMetrics;
        
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
      };

      const healthMetrics = {
        fatigueLevel: 60,
        previousInjuries: 2,
        workloadIndex: 85,
        recoveryScore: 75,
        age: 28
      };

      const risk = calculateInjuryRisk(healthMetrics);
      expect(risk).toBeGreaterThanOrEqual(0);
      expect(risk).toBeLessThanOrEqual(100);
      expect(typeof risk).toBe('number');
    });

    it('should generate health recommendations', () => {
      const generateHealthRecommendations = (healthMetrics) => {
        const recommendations = [];
        const { fatigueLevel, hydrationLevel, sleepQuality, workloadIndex } = healthMetrics;
        
        if (fatigueLevel > 70) {
          recommendations.push({
            priority: 'HIGH',
            category: 'Rest',
            message: 'Consider reducing training intensity or taking rest day'
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
            message: 'Reduce training volume to prevent overtraining'
          });
        }
        
        return recommendations;
      };

      const healthMetrics = {
        fatigueLevel: 75,
        hydrationLevel: 45,
        sleepQuality: 40,
        workloadIndex: 95
      };

      const recommendations = generateHealthRecommendations(healthMetrics);
      expect(recommendations).toHaveLength(4);
      expect(recommendations.every(rec => ['HIGH', 'MEDIUM', 'LOW'].includes(rec.priority))).toBe(true);
    });
  });

  describe('Shot Analysis', () => {
    it('should analyze shot efficiency by zone', () => {
      const analyzeZoneEfficiency = (shots) => {
        const zones = {
          paint: { made: 0, attempted: 0 },
          midRange: { made: 0, attempted: 0 },
          threePoint: { made: 0, attempted: 0 }
        };

        shots.forEach(shot => {
          const zone = shot.zone;
          if (zones[zone]) {
            zones[zone].attempted++;
            if (shot.made) zones[zone].made++;
          }
        });

        const efficiency = {};
        Object.keys(zones).forEach(zone => {
          const { made, attempted } = zones[zone];
          efficiency[zone] = attempted > 0 ? Math.round((made / attempted) * 100) / 100 : 0;
        });

        return efficiency;
      };

      const shots = [
        { zone: 'paint', made: true },
        { zone: 'paint', made: true },
        { zone: 'paint', made: false },
        { zone: 'midRange', made: true },
        { zone: 'midRange', made: false },
        { zone: 'threePoint', made: true },
        { zone: 'threePoint', made: false },
        { zone: 'threePoint', made: false }
      ];

      const efficiency = analyzeZoneEfficiency(shots);
      expect(efficiency.paint).toBe(0.67);
      expect(efficiency.midRange).toBe(0.5);
      expect(efficiency.threePoint).toBe(0.33);
    });
  });

  describe('Game Situation Analysis', () => {
    it('should calculate clutch performance rating', () => {
      const calculateClutchRating = (clutchStats) => {
        const { clutchPoints, clutchAttempts, clutchAssists, clutchTurnovers, gameWinningShots } = clutchStats;
        
        let rating = 50; // Base rating
        
        // Scoring efficiency in clutch (up to 30 points)
        if (clutchAttempts > 0) {
          const clutchEfficiency = clutchPoints / clutchAttempts;
          rating += Math.min(30, clutchEfficiency * 15);
        }
        
        // Assists vs turnovers (up to 15 points)
        if (clutchTurnovers > 0) {
          rating += Math.min(15, (clutchAssists / clutchTurnovers) * 5);
        } else if (clutchAssists > 0) {
          rating += 15;
        }
        
        // Game winning shots bonus (up to 10 points)
        rating += Math.min(10, gameWinningShots * 5);
        
        return Math.min(100, Math.max(0, Math.round(rating)));
      };

      const clutchStats = {
        clutchPoints: 12,
        clutchAttempts: 8,
        clutchAssists: 3,
        clutchTurnovers: 1,
        gameWinningShots: 1
      };

      const rating = calculateClutchRating(clutchStats);
      expect(rating).toBeGreaterThan(80);
      expect(rating).toBeLessThanOrEqual(100);
    });
  });
});

// Export for potential use in other tests
export const basketballTestHelpers = {
  calculateFGPercentage: (made, attempted) => {
    if (attempted === 0) return 0;
    return Math.round((made / attempted) * 100) / 100;
  },
  
  calculateTeamChemistry: (playerConnections) => {
    if (playerConnections.length === 0) return 0;
    const totalChemistry = playerConnections.reduce((sum, connection) => sum + connection.strength, 0);
    return Math.round((totalChemistry / playerConnections.length) * 100) / 100;
  },
  
  calculateInjuryRisk: (healthMetrics) => {
    const { fatigueLevel, previousInjuries, workloadIndex, recoveryScore, age } = healthMetrics;
    let riskScore = 0;
    riskScore += Math.min(40, fatigueLevel * 0.4);
    riskScore += Math.min(30, previousInjuries * 5);
    riskScore += Math.min(20, Math.max(0, workloadIndex - 80) * 0.5);
    riskScore += Math.min(10, Math.max(0, age - 30) * 0.5);
    riskScore -= Math.min(20, recoveryScore * 0.2);
    return Math.max(0, Math.min(100, Math.round(riskScore)));
  }
};

export default basketballTestHelpers;
