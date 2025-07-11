// Game Grade Calculator
// Advanced basketball performance grading system

export function calculateGameGrade(stats) {
  const pts = stats.points || 0;
  const reb = stats.rebounds || 0;
  const ast = stats.assists || 0;
  const stl = stats.steals || 0;
  const blk = stats.blocks || 0;
  const chg = stats.charges || 0;
  const dfl = stats.deflections || 0;
  const fgMade = stats.fgm || 0;
  const ftMade = stats.ftm || 0;
  const to = stats.turnovers || 0;
  const fouls = stats.fouls || 0;
  const fgMiss = stats.fgmiss || 0;
  const ftMiss = stats.ftmiss || 0;
  const attitude = stats.attitude || 0;

  // Your exact formula: 150 + ((basic stats)*2) + ((premium stats)*5) - ((negative stats) + fouls*10)
  const basicStats = pts + reb + ast + fgMade + ftMade;
  const premiumStats = stl + blk + chg + dfl + attitude;
  const negativeStats = to + fgMiss + ftMiss;

  const totalScore =
    150 + basicStats * 2 + premiumStats * 5 - negativeStats - fouls * 10;

  // Convert total score to letter grade (simplified A, B, C, D, F)
  if (totalScore >= 180) {
    return 'A';
  } else if (totalScore >= 150) {
    return 'B';
  } else if (totalScore >= 120) {
    return 'C';
  } else if (totalScore >= 100) {
    return 'D';
  } else {
    return 'F';
  }
}

// Helper function to get the raw numeric score
export function calculateRawScore(stats) {
  const pts = stats.points || 0;
  const reb = stats.rebounds || 0;
  const ast = stats.assists || 0;
  const stl = stats.steals || 0;
  const blk = stats.blocks || 0;
  const chg = stats.charges || 0;
  const dfl = stats.deflections || 0;
  const fgMade = stats.fgm || 0;
  const ftMade = stats.ftm || 0;
  const to = stats.turnovers || 0;
  const fouls = stats.fouls || 0;
  const fgMiss = stats.fgmiss || 0;
  const ftMiss = stats.ftmiss || 0;
  const attitude = stats.attitude || 0;

  const basicStats = pts + reb + ast + fgMade + ftMade;
  const premiumStats = stl + blk + chg + dfl + attitude;
  const negativeStats = to + fgMiss + ftMiss;

  return 150 + basicStats * 2 + premiumStats * 5 - negativeStats - fouls * 10;
}

// Helper function to get numeric grade for averaging and charts
export function getNumericGrade(letterGrade) {
  switch (letterGrade) {
    case 'A':
      return 5;
    case 'B':
      return 4;
    case 'C':
      return 3;
    case 'D':
      return 2;
    case 'F':
      return 1;
    default:
      return 1;
  }
}

// Helper function to convert numeric grade back to letter
export function getLetterGrade(numericGrade) {
  const gradeMap = {
    5: 'A',
    4: 'B',
    3: 'C',
    2: 'D',
    1: 'F',
  };
  return gradeMap[Math.round(numericGrade)] || 'F';
}

// 3Ball Network Basketball Game Grade Calculator
// Based on percentage system with minutes played factor
export function calculate3BallGrade(stats) {
  const {
    points = 0,
    rebounds = 0,
    assists = 0,
    fieldGoalsMade = 0,
    freeThrowsMade = 0,
    steals = 0,
    blocks = 0,
    charges = 0,
    deflections = 0,
    turnovers = 0,
    fouls = 0,
    missedFieldGoals = 0,
    missedFreeThrows = 0,
    minutesPlayed = 0,
    gameLength = 32,
  } = stats;

  // Step 1: Calculate Good Credits
  const basicStats =
    points + rebounds + assists + fieldGoalsMade + freeThrowsMade;
  const premiumStats = steals + blocks + charges + deflections;
  const goodCredits = basicStats * 2 + premiumStats * 5;

  // Step 2: Calculate Bad Credits
  const badCredits = turnovers + fouls + missedFieldGoals + missedFreeThrows;

  // Step 3: Calculate Possible Credits
  const possibleCredits = goodCredits + badCredits + gameLength;

  // Step 4: Calculate Actual Credits
  const actualCredits = minutesPlayed + goodCredits - badCredits;

  // Step 5: Calculate Game Grade Percentage
  const gameGradePercentage =
    possibleCredits > 0 ? (actualCredits / possibleCredits) * 100 : 0;

  // Step 6: Convert to Letter Grade
  let letterGrade;
  if (gameGradePercentage >= 70) {
    letterGrade = 'A';
  } else if (gameGradePercentage >= 60) {
    letterGrade = 'B';
  } else if (gameGradePercentage >= 50) {
    letterGrade = 'C';
  } else if (gameGradePercentage >= 40) {
    letterGrade = 'D';
  } else {
    letterGrade = 'F';
  }

  return {
    letterGrade,
  };
}

// Sample game data matching your spreadsheet structure
export const sampleGameData = [
  {
    opponent: 'Lakers Academy',
    date: 'March 15, 2025',
    minutes: 28,
    stats: {
      points: 12, // Points
      rebounds: 5, // Reb
      assists: 1, // Ast
      steals: 4, // Stl
      blocks: 3, // Blk
      charges: 0, // Charge
      deflections: 9, // Def
      fgm: 5, // FG✓
      ftm: 2, // FT✓
      turnovers: 0, // TO
      fouls: 1, // Foul
      fgmiss: 5, // FG✗
      ftmiss: 0, // FT✗
      attitude: 0, // Attitude
    },
  },
  {
    opponent: 'Warriors Elite',
    date: 'March 12, 2025',
    minutes: 24,
    stats: {
      points: 5,
      rebounds: 2,
      assists: 2,
      steals: 0,
      blocks: 0,
      charges: 0,
      deflections: 3,
      fgm: 2,
      ftm: 1,
      turnovers: 0,
      fouls: 0,
      fgmiss: 1,
      ftmiss: 3,
      attitude: 0,
    },
  },
  {
    opponent: 'Celtics Youth',
    date: 'March 8, 2025',
    minutes: 30,
    stats: {
      points: 4,
      rebounds: 4,
      assists: 1,
      steals: 0,
      blocks: 1,
      charges: 1,
      deflections: 3,
      fgm: 2,
      ftm: 0,
      turnovers: 1,
      fouls: 0,
      fgmiss: 0,
      ftmiss: 0,
      attitude: 0,
    },
  },
  {
    opponent: 'Bulls Academy',
    date: 'March 5, 2025',
    minutes: 18,
    stats: {
      points: 18,
      rebounds: 3,
      assists: 4,
      steals: 2,
      blocks: 1,
      charges: 0,
      deflections: 3,
      fgm: 7,
      ftm: 0,
      turnovers: 3,
      fouls: 2,
      fgmiss: 2,
      ftmiss: 0,
      attitude: 0,
    },
  },
  {
    opponent: 'Heat Select',
    date: 'March 1, 2025',
    minutes: 26,
    stats: {
      points: 4,
      rebounds: 4,
      assists: 4,
      steals: 3,
      blocks: 0,
      charges: 0,
      deflections: 5,
      fgm: 2,
      ftm: 0,
      turnovers: 0,
      fouls: 2,
      fgmiss: 2,
      ftmiss: 2,
      attitude: 0,
    },
  },
  {
    opponent: 'Spurs Academy',
    date: 'February 25, 2025',
    minutes: 8,
    stats: {
      points: 6,
      rebounds: 4,
      assists: 1,
      steals: 0,
      blocks: 1,
      charges: 0,
      deflections: 2,
      fgm: 3,
      ftm: 0,
      turnovers: 2,
      fouls: 0,
      fgmiss: 0,
      ftmiss: 0,
      attitude: 0,
    },
  },
  {
    opponent: 'Rockets Elite',
    date: 'February 22, 2025',
    minutes: 32,
    stats: {
      points: 10,
      rebounds: 4,
      assists: 1,
      steals: 0,
      blocks: 1,
      charges: 0,
      deflections: 2,
      fgm: 4,
      ftm: 1,
      turnovers: 0,
      fouls: 2,
      fgmiss: 1,
      ftmiss: 3,
      attitude: 0,
    },
  },
];
