// Advanced Player Analytics System
// Real-time performance tracking and AI insights

class PlayerAnalytics {
  constructor() {
    this.performanceData = [];
    this.insights = [];
    this.comparisons = {};
    this.trends = {};
  }

  // Real-time performance tracking
  trackPerformance(gameData) {
    const performance = {
      gameId: gameData.id,
      date: gameData.date,
      opponent: gameData.opponent,
      minutes: gameData.minutes,
      stats: gameData.stats,
      situational: this.analyzeSituationalPerformance(gameData),
      efficiency: this.calculateAdvancedEfficiency(gameData.stats),
      impact: this.calculateGameImpact(gameData),
      timestamp: new Date().toISOString(),
    };

    this.performanceData.push(performance);
    this.generateInsights(performance);
    return performance;
  }

  // AI-powered insights generation
  generateInsights(performance) {
    const insights = [];

    // Shooting analysis
    if (performance.stats.fga >= 8) {
      const fgPct = (performance.stats.fgm / performance.stats.fga) * 100;
      if (fgPct < 35) {
        insights.push({
          type: 'shooting',
          severity: 'warning',
          message: `Shot selection needs improvement - ${fgPct.toFixed(1)}% FG on ${performance.stats.fga} attempts`,
          recommendation:
            'Focus on high-percentage shots near the basket and open looks',
        });
      }
    }

    // Turnover analysis
    const turnoverRate =
      (performance.stats.turnovers /
        (performance.stats.assists + performance.stats.points / 2)) *
      100;
    if (turnoverRate > 20) {
      insights.push({
        type: 'ballhandling',
        severity: 'alert',
        message: `High turnover rate: ${turnoverRate.toFixed(1)}%`,
        recommendation:
          'Work on ball security drills and decision-making under pressure',
      });
    }

    // Clutch performance
    if (
      performance.situational.fourthQuarter &&
      performance.situational.closeGame
    ) {
      insights.push({
        type: 'clutch',
        severity: 'info',
        message: 'Strong clutch performance in close game',
        recommendation:
          'Continue developing late-game composure and leadership',
      });
    }

    this.insights.push(...insights);
    return insights;
  }

  // Calculate advanced efficiency metrics
  calculateAdvancedEfficiency(stats) {
    const possessions = stats.fga + stats.fta * 0.44 + stats.turnovers;
    const points = stats.points;

    return {
      effectiveFG:
        stats.fga > 0
          ? ((stats.fgm + stats.threePM * 0.5) / stats.fga) * 100
          : 0,
      trueShootingPct: possessions > 0 ? (points / (2 * possessions)) * 100 : 0,
      assistToTurnoverRatio:
        stats.turnovers > 0 ? stats.assists / stats.turnovers : stats.assists,
      reboundRate: ((stats.rebounds * 5) / 40) * 100, // Estimated based on team rebounds
      usageRate: possessions > 0 ? (possessions / 80) * 100 : 0, // Estimated team possessions
    };
  }

  // Analyze situational performance
  analyzeSituationalPerformance(gameData) {
    return {
      fourthQuarter: gameData.situational?.fourthQuarter || false,
      closeGame: gameData.situational?.closeGame || false,
      pressure: gameData.situational?.pressure || 'normal',
      location: gameData.situational?.location || 'home',
      restDays: gameData.situational?.restDays || 1,
    };
  }

  // Calculate game impact score
  calculateGameImpact(gameData) {
    const stats = gameData.stats;
    const minutes = gameData.minutes;

    // Impact formula considering per-minute production
    const rawImpact =
      stats.points * 1.0 +
      stats.rebounds * 1.2 +
      stats.assists * 1.5 +
      stats.steals * 2.0 +
      stats.blocks * 2.0 -
      stats.turnovers * 1.5 -
      stats.fouls * 0.5;

    const perMinuteImpact = minutes > 0 ? rawImpact / minutes : 0;
    const scaledImpact = perMinuteImpact * 36; // Per 36 minutes

    return {
      raw: rawImpact,
      perMinute: perMinuteImpact,
      per36: scaledImpact,
      rating: this.getImpactRating(scaledImpact),
    };
  }

  getImpactRating(impact) {
    if (impact >= 25) return 'Elite';
    if (impact >= 20) return 'Excellent';
    if (impact >= 15) return 'Good';
    if (impact >= 10) return 'Average';
    return 'Below Average';
  }

  // Trend analysis
  analyzeTrends(gameCount = 10) {
    const recentGames = this.performanceData.slice(-gameCount);
    if (recentGames.length < 3) return null;

    const trends = {};

    // Shooting trend
    const shootingTrend = this.calculateTrend(
      recentGames.map(g =>
        g.stats.fga > 0 ? (g.stats.fgm / g.stats.fga) * 100 : 0
      )
    );
    trends.shooting = {
      direction:
        shootingTrend > 5
          ? 'improving'
          : shootingTrend < -5
            ? 'declining'
            : 'stable',
      value: shootingTrend,
      message: this.getTrendMessage('shooting', shootingTrend),
    };

    // Impact trend
    const impactTrend = this.calculateTrend(
      recentGames.map(g => g.impact.per36)
    );
    trends.impact = {
      direction:
        impactTrend > 2
          ? 'improving'
          : impactTrend < -2
            ? 'declining'
            : 'stable',
      value: impactTrend,
      message: this.getTrendMessage('impact', impactTrend),
    };

    return trends;
  }

  calculateTrend(values) {
    if (values.length < 2) return 0;

    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  getTrendMessage(type, trend) {
    const direction = trend > 0 ? 'improving' : 'declining';
    const magnitude = Math.abs(trend);

    if (type === 'shooting') {
      if (magnitude > 10)
        return `Shooting ${direction} significantly (${trend.toFixed(1)}% trend)`;
      if (magnitude > 5) return `Shooting ${direction} moderately`;
      return 'Shooting consistency maintained';
    }

    if (type === 'impact') {
      if (magnitude > 5) return `Overall impact ${direction} significantly`;
      if (magnitude > 2) return `Overall impact ${direction} moderately`;
      return 'Impact level consistent';
    }

    return `${type} trend: ${direction}`;
  }

  // Comparison with league/team averages
  generateComparisons(position, level = 'high_school') {
    const benchmarks = this.getBenchmarks(position, level);
    const playerAvg = this.calculateAverages();

    const comparisons = {};

    Object.keys(benchmarks).forEach(stat => {
      const playerValue = playerAvg[stat] || 0;
      const benchmark = benchmarks[stat];
      const percentile = this.calculatePercentile(playerValue, benchmark);

      comparisons[stat] = {
        player: playerValue,
        benchmark: benchmark.average,
        percentile: percentile,
        status:
          percentile >= 75
            ? 'excellent'
            : percentile >= 50
              ? 'above_average'
              : percentile >= 25
                ? 'below_average'
                : 'needs_improvement',
      };
    });

    return comparisons;
  }

  getBenchmarks(position, level) {
    // Sample benchmarks - in real implementation, these would come from database
    const benchmarks = {
      high_school: {
        point_guard: {
          points: { average: 12.5, std: 5.2 },
          assists: { average: 4.8, std: 2.1 },
          rebounds: { average: 3.2, std: 1.5 },
          steals: { average: 1.8, std: 0.9 },
          turnovers: { average: 2.5, std: 1.2 },
        },
      },
    };

    return benchmarks[level]?.[position] || benchmarks.high_school.point_guard;
  }

  calculatePercentile(value, benchmark) {
    // Simple percentile calculation - could be more sophisticated
    const zScore = (value - benchmark.average) / benchmark.std;
    return Math.max(0, Math.min(100, 50 + zScore * 15));
  }

  calculateAverages() {
    if (this.performanceData.length === 0) return {};

    const totals = this.performanceData.reduce((acc, game) => {
      Object.keys(game.stats).forEach(stat => {
        acc[stat] = (acc[stat] || 0) + (game.stats[stat] || 0);
      });
      return acc;
    }, {});

    const averages = {};
    Object.keys(totals).forEach(stat => {
      averages[stat] = totals[stat] / this.performanceData.length;
    });

    return averages;
  }

  // Get actionable recommendations
  getRecommendations() {
    const recent = this.performanceData.slice(-5);
    const recommendations = [];

    if (recent.length === 0) return recommendations;

    const avgTurnovers =
      recent.reduce((sum, g) => sum + (g.stats.turnovers || 0), 0) /
      recent.length;
    const avgShooting =
      recent.reduce((sum, g) => {
        const fga = g.stats.fga || 0;
        return sum + (fga > 0 ? (g.stats.fgm / fga) * 100 : 0);
      }, 0) / recent.length;

    if (avgTurnovers > 3) {
      recommendations.push({
        area: 'Ball Security',
        priority: 'high',
        issue: 'Above average turnovers in recent games',
        drills: [
          'Two-ball dribbling',
          'Pressure passing',
          'Decision-making scenarios',
        ],
        goal: 'Reduce turnovers to under 2.5 per game',
      });
    }

    if (avgShooting < 40) {
      recommendations.push({
        area: 'Shooting Efficiency',
        priority: 'medium',
        issue: 'Shooting percentage below optimal range',
        drills: ['Form shooting', 'Catch and shoot', 'Shot selection training'],
        goal: 'Increase field goal percentage to 45%+',
      });
    }

    return recommendations;
  }
}

// Export for ES modules
export { PlayerAnalytics };

// Also make available globally for backward compatibility
if (typeof window !== 'undefined') {
  window.PlayerAnalytics = PlayerAnalytics;
}
