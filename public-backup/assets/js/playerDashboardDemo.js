import { isDemoMode, demoPlayerData } from './demoMode.js';

const container = document.getElementById('playerSummary');

if (isDemoMode()) {
  const player = demoPlayerData;
  container.innerHTML = `
    <h2>${player.name}</h2>
    <p><strong>Position:</strong> ${player.position}</p>
    <p><strong>School:</strong> ${player.school}</p>
    <p><strong>Height:</strong> ${player.height}, <strong>Weight:</strong> ${player.weight}</p>
    <p><strong>GPA:</strong> ${player.gpa}</p>
    <p><strong>Game Grade Avg:</strong> ${player.avgGrade}</p>
    <h4>Stats:</h4>
    <ul>
      <li>Points: ${player.stats.points}</li>
      <li>Assists: ${player.stats.assists}</li>
      <li>Rebounds: ${player.stats.rebounds}</li>
      <li>Steals: ${player.stats.steals}</li>
      <li>Blocks: ${player.stats.blocks}</li>
    </ul>
    <h4>Highlight:</h4>
    <a href="${player.highlights[0]}" target="_blank">Watch Highlight</a>
  `;
} else {
  // fallback to real Firebase load
  loadPlayerData();
}
