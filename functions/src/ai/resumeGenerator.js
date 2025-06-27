// resumeGenerator.js

export function generatePlayerResume(playerData) {
  console.log("📄 Generating player resume...");

  const {
    name = "Unknown Player",
    position = "N/A",
    gradeLevel = "N/A",
    school = "N/A",
    height = "N/A",
    weight = "N/A",
    gpa = "N/A",
    stats = {},
    gameGrades = {},
    highlights = []
  } = playerData;

  const points = stats.points || 0;
  const assists = stats.assists || 0;
  const rebounds = stats.rebounds || 0;
  const steals = stats.steals || 0;
  const blocks = stats.blocks || 0;
  const gradeAvg = gameGrades.avg || "N/A";
  const highlightLink = highlights.length > 0 ? highlights[0] : "N/A";

  return (
`PLAYER RESUME — ${name.toUpperCase()}

📍 Position: ${position}
🎓 Grade: ${gradeLevel} | School: ${school}
📏 Height: ${height} | ⚖️ Weight: ${weight}
📚 GPA: ${gpa}

🏀 Key Stats:
- Points: ${points}
- Assists: ${assists}
- Rebounds: ${rebounds}
- Steals: ${steals}
- Blocks: ${blocks}

🧠 Game Grade Avg: ${gradeAvg}

🔗 Highlight Reel: ${highlightLink}

Updated: ${new Date().toLocaleDateString()}`
  );
}

export function generateResumeHTML(playerData) {
  const resumeText = generatePlayerResume(playerData);
  return `<pre>${resumeText}</pre>`;
}
