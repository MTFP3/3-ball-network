// 2K-Style Player Rating System
// Calculates NBA 2K-style overall rating based on basketball performance

export class Player2KRating {
  constructor(gameData) {
    this.gameData = gameData;
    this.overall = 0;
  }

  // Calculate overall player rating from game data
  calculateRatings() {
    const avgStats = this.calculateAverageStats();

    // Calculate shooting percentage
    const fgPct = avgStats.fga > 0 ? avgStats.fgm / avgStats.fga : 0;

    // Calculate component ratings for overall calculation
    const shootingRating = this.clampRating(fgPct * 150 + avgStats.points * 2);
    const finishingRating = this.clampRating(fgPct * 100 + avgStats.points * 3);
    const playmakingRating = this.clampRating(avgStats.assists * 8 + 50);
    const defenseRating = this.clampRating(
      avgStats.steals * 10 + (5 - avgStats.fouls) * 5 + 50
    );
    const stealRating = this.clampRating(avgStats.steals * 15 + 40);
    const blockRating = this.clampRating(avgStats.blocks * 20 + 45);
    const speedRating = this.clampRating(85 + avgStats.steals * 2);
    const athleticismRating = this.clampRating(
      80 + avgStats.blocks * 3 + avgStats.rebounds * 1
    );
    const staminaRating = this.clampRating(85 - avgStats.fouls * 2);

    // Calculate overall rating (weighted average)
    this.overall = Math.round(
      shootingRating * 0.15 +
        finishingRating * 0.12 +
        playmakingRating * 0.18 +
        defenseRating * 0.15 +
        stealRating * 0.1 +
        blockRating * 0.08 +
        speedRating * 0.1 +
        athleticismRating * 0.07 +
        staminaRating * 0.05
    );

    return {
      overall: this.overall,
    };
  }

  // Calculate average stats from game data
  calculateAverageStats() {
    const totalGames = this.gameData.length;
    const totals = this.gameData.reduce(
      (acc, game) => {
        const stats = game.stats || {};
        acc.points += stats.points || 0;
        acc.rebounds += stats.rebounds || 0;
        acc.assists += stats.assists || 0;
        acc.steals += stats.steals || 0;
        acc.blocks += stats.blocks || 0;
        acc.fgm += stats.fgm || 0;
        acc.fga += stats.fga || 0;
        acc.ftm += stats.ftm || 0;
        acc.fta += stats.fta || 0;
        acc.turnovers += stats.turnovers || 0;
        acc.fouls += stats.fouls || 0;
        acc.minutes += game.minutes || 0;
        return acc;
      },
      {
        points: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        fgm: 0,
        fga: 0,
        ftm: 0,
        fta: 0,
        turnovers: 0,
        fouls: 0,
        minutes: 0,
      }
    );

    // Return per-game averages
    Object.keys(totals).forEach(key => {
      totals[key] = totals[key] / totalGames;
    });

    return totals;
  }

  // Utility function to clamp ratings between 40-99
  clampRating(value) {
    return Math.min(99, Math.max(40, Math.round(value)));
  }

  // Get rating tier (for UI styling)
  getRatingTier(rating) {
    if (rating >= 90) return 'elite'; // Green
    if (rating >= 80) return 'excellent'; // Blue
    if (rating >= 70) return 'good'; // Yellow
    if (rating >= 60) return 'average'; // Orange
    return 'poor'; // Red
  }

  // Get overall tier description
  getOverallTier() {
    return this.getRatingTier(this.overall);
  }

  // Format rating for display
  formatRating(rating) {
    return Math.round(rating).toString();
  }
}

// Export helper functions for standalone use
export function calculate2KRating(gameData) {
  const ratingCalculator = new Player2KRating(gameData);
  return ratingCalculator.calculateRatings();
}

export function getRatingColor(rating) {
  if (rating >= 90) return '#51cf66'; // Green
  if (rating >= 80) return '#48cae4'; // Blue
  if (rating >= 70) return '#feca57'; // Yellow
  if (rating >= 60) return '#ff8c42'; // Orange
  return '#ff6b6b'; // Red
}
