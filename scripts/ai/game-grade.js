// scripts/ai/game-grade.js

// Game Grade Calculator
export function calculateGameGrade(stats, minutesPlayed, gameLength = 32) {
  const pts = stats.points || 0;
  const reb = stats.rebounds || 0;
  const ast = stats.assists || 0;
  const fgm = stats.fgm || 0;
  const ftm = stats.ftm || 0;
  const stl = stats.steals || 0;
  const blk = stats.blocks || 0;
  const chg = stats.charges || 0;
  const dfl = stats.deflections || 0;
  const to = stats.turnovers || 0;
  const fouls = stats.fouls || 0;
  const fgmiss = stats.fgmiss || 0;
  const ftmiss = stats.ftmiss || 0;
  const attitude = stats.attitude || 0;
  const hustle = stats.hustle || 0;
  const bodyLang = stats.body_language || 0;

  const possible = (pts + reb + ast + fgm + ftm) * 2 + (stl + blk + chg + dfl) * 5 + (to + fouls + fgmiss + ftmiss);
  let actual = (pts + reb + ast + fgm + ftm) * 2 + (stl + blk + chg + dfl) * 5 - (to + fouls + fgmiss + ftmiss);
  actual += attitude + hustle + bodyLang;

  if (possible === 0) return 'F';

  let rawScore = (actual / possible) * 100;
  let ratio = minutesPlayed / gameLength;
  let scaledScore = rawScore * ratio;

  if (minutesPlayed <= 4) scaledScore = Math.min(scaledScore, 75);
  else if (minutesPlayed <= 10) scaledScore = Math.min(scaledScore, 85);

  if (scaledScore >= 70) return 'A';
  else if (scaledScore >= 60) return 'B';
  else if (scaledScore >= 50) return 'C';
  else return 'F';
}

// Example usage inside your app:
// import { calculateGameGrade } from '../ai/game-grade.js';
// const letter = calculateGameGrade(playerStats, playerMinutes);
