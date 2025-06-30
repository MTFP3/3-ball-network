// Game Grade Calculator
// Advanced basketball performance grading system

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

  const possible =
    (pts + reb + ast + fgm + ftm) * 2 +
    (stl + blk + chg + dfl) * 5 +
    (to + fouls + fgmiss + ftmiss);
  let actual =
    (pts + reb + ast + fgm + ftm) * 2 +
    (stl + blk + chg + dfl) * 5 -
    (to + fouls + fgmiss + ftmiss);
  actual += attitude + hustle + bodyLang;

  if (possible === 0) return 'F';

  let rawScore = (actual / possible) * 100;
  let ratio = minutesPlayed / gameLength;
  let scaledScore = rawScore * ratio;

  // Limit grades based on playing time
  if (minutesPlayed <= 4) scaledScore = Math.min(scaledScore, 75);
  else if (minutesPlayed <= 10) scaledScore = Math.min(scaledScore, 85);

  // Determine letter grade
  if (scaledScore >= 70) return 'A';
  else if (scaledScore >= 60) return 'B';
  else if (scaledScore >= 50) return 'C';
  else return 'F';
}

// Helper function to get numeric grade for averaging
export function getNumericGrade(letterGrade) {
  switch (letterGrade) {
    case 'A+':
      return 4.0;
    case 'A':
      return 4.0;
    case 'A-':
      return 3.7;
    case 'B+':
      return 3.3;
    case 'B':
      return 3.0;
    case 'B-':
      return 2.7;
    case 'C+':
      return 2.3;
    case 'C':
      return 2.0;
    case 'C-':
      return 1.7;
    case 'D+':
      return 1.3;
    case 'D':
      return 1.0;
    case 'F':
      return 0.0;
    default:
      return 0.0;
  }
}

// Sample game data with comprehensive stats
export const sampleGameData = [
  {
    opponent: 'Lakers Academy',
    date: 'March 15, 2025',
    minutes: 28,
    stats: {
      points: 22,
      rebounds: 8,
      assists: 5,
      fgm: 9,
      fgmiss: 6,
      ftm: 4,
      ftmiss: 1,
      steals: 3,
      blocks: 1,
      charges: 1,
      deflections: 4,
      turnovers: 2,
      fouls: 3,
      attitude: 8,
      hustle: 9,
      body_language: 8,
    },
  },
  {
    opponent: 'Warriors Elite',
    date: 'March 12, 2025',
    minutes: 24,
    stats: {
      points: 15,
      rebounds: 6,
      assists: 7,
      fgm: 6,
      fgmiss: 8,
      ftm: 3,
      ftmiss: 2,
      steals: 2,
      blocks: 0,
      charges: 0,
      deflections: 3,
      turnovers: 4,
      fouls: 2,
      attitude: 7,
      hustle: 8,
      body_language: 7,
    },
  },
  {
    opponent: 'Celtics Youth',
    date: 'March 8, 2025',
    minutes: 30,
    stats: {
      points: 28,
      rebounds: 12,
      assists: 7,
      fgm: 11,
      fgmiss: 4,
      ftm: 6,
      ftmiss: 0,
      steals: 4,
      blocks: 2,
      charges: 2,
      deflections: 5,
      turnovers: 1,
      fouls: 2,
      attitude: 9,
      hustle: 10,
      body_language: 9,
    },
  },
  {
    opponent: 'Bulls Academy',
    date: 'March 5, 2025',
    minutes: 18,
    stats: {
      points: 12,
      rebounds: 4,
      assists: 2,
      fgm: 5,
      fgmiss: 9,
      ftm: 2,
      ftmiss: 3,
      steals: 1,
      blocks: 0,
      charges: 0,
      deflections: 1,
      turnovers: 5,
      fouls: 4,
      attitude: 5,
      hustle: 6,
      body_language: 5,
    },
  },
  {
    opponent: 'Heat Select',
    date: 'March 1, 2025',
    minutes: 26,
    stats: {
      points: 19,
      rebounds: 9,
      assists: 6,
      fgm: 7,
      fgmiss: 6,
      ftm: 5,
      ftmiss: 1,
      steals: 2,
      blocks: 1,
      charges: 1,
      deflections: 3,
      turnovers: 3,
      fouls: 3,
      attitude: 7,
      hustle: 7,
      body_language: 7,
    },
  },
  {
    opponent: 'Spurs Academy',
    date: 'February 25, 2025',
    minutes: 8,
    stats: {
      points: 6,
      rebounds: 2,
      assists: 1,
      fgm: 2,
      fgmiss: 3,
      ftm: 2,
      ftmiss: 1,
      steals: 0,
      blocks: 0,
      charges: 0,
      deflections: 1,
      turnovers: 2,
      fouls: 2,
      attitude: 6,
      hustle: 7,
      body_language: 6,
    },
  },
  {
    opponent: 'Rockets Elite',
    date: 'February 22, 2025',
    minutes: 32,
    stats: {
      points: 8,
      rebounds: 3,
      assists: 2,
      fgm: 3,
      fgmiss: 12,
      ftm: 2,
      ftmiss: 4,
      steals: 1,
      blocks: 0,
      charges: 0,
      deflections: 2,
      turnovers: 6,
      fouls: 5,
      attitude: 4,
      hustle: 5,
      body_language: 3,
    },
  },
];
