import { isDemoMode } from "./demoMode.js";

const container = document.getElementById("coachSummary");

if (isDemoMode()) {
  container.innerHTML = `
    <h2>Coach Demo</h2>
    <p><strong>Team:</strong> 3 Ball High Varsity</p>
    <p><strong>Record:</strong> 22-5</p>
    <h4>Top Performers:</h4>
    <ul>
      <li>Demo Player — 22 PPG, B+ Grade</li>
      <li>Demo Forward — 17 PPG, A- Grade</li>
    </ul>
    <h4>Upcoming Games:</h4>
    <ul>
      <li>vs PCHS — Friday 7PM</li>
      <li>vs BHS — Next Tuesday</li>
    </ul>
  `;
} else {
  loadCoachDashboard();
}