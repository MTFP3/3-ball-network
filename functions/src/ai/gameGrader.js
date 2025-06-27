// gameGrader.js
export function gradePerformance(stats) {
  console.log("🧠 Grading with stats:", stats);

  // Convert stats to numeric score (example logic)
  const score = stats.points + stats.assists * 1.5 + stats.rebounds * 1.2;

  let letterGrade;
  if (score >= 70) letterGrade = "A";
  else if (score >= 60) letterGrade = "B";
  else if (score >= 50) letterGrade = "C";
  else letterGrade = "F";

  return {
    score: Math.round(score),
    grade: letterGrade
  };
}
