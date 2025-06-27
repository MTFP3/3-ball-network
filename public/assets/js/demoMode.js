export function isDemoMode() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("demo") === "true";
}

export const demoPlayerData = {
  name: "Demo Player",
  position: "SG",
  height: "6'3\"",
  weight: "185 lbs",
  gradeLevel: "11th",
  school: "3 Ball High",
  stats: {
    points: 22,
    assists: 5,
    rebounds: 7,
    steals: 3,
    blocks: 1,
    turnovers: 2
  },
  avgGrade: "B+",
  gpa: "3.8",
  highlights: [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  ]
};