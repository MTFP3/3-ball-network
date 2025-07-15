// /assets/js/playerDashboard.js

import {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import {
  ref as storageRef,
  getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js';
import { Chart } from 'https://cdn.jsdelivr.net/npm/chart.js';
import { logAnalyticsEvent } from './analyticsLogger.js';
import { db, storage } from './firebaseConfig.js';
import {
  createVideoClip,
  createActionList,
  createScoutingReport,
  clearContainer,
  createLoadingIndicator,
  safeText,
} from './uiComponents.js';

const playerId = localStorage.getItem('playerId') || 'demoPlayer';
logAnalyticsEvent('visit', playerId, 'player');

async function loadPlayerData() {
  const ref = doc(db, 'players', playerId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return;
  }

  const data = snap.data();
  if (data.approved === false) {
    const pendingMsg = createLoadingIndicator(
      'Your account is pending approval by an admin.'
    );
    clearContainer(document.body);
    document.body.appendChild(pendingMsg);
    return;
  }

  // Safely set text content for all elements
  safeText(document.getElementById('playerName'), data.name);
  safeText(document.getElementById('name'), data.name);
  safeText(document.getElementById('position'), data.position);
  safeText(document.getElementById('height'), data.height);
  safeText(document.getElementById('weight'), data.weight);
  safeText(document.getElementById('school'), data.school);
  safeText(document.getElementById('state'), data.state);
  safeText(document.getElementById('rating'), data.rating || 'TBD');

  const profilePic = document.getElementById('profilePic');
  if (profilePic) {
    profilePic.src = data.photoUrl || '/assets/images/default-avatar.png';
  }

  safeText(
    document.getElementById('avgGrade'),
    data.avgGameGrade?.letter || '-'
  );

  const resumePreview = document.getElementById('resumePreview');
  if (resumePreview) {
    resumePreview.src =
      data.resumeUrl || 'https://example.com/sample-resume.pdf';
  }

  const highlightVideo = document.getElementById('highlightVideo');
  if (highlightVideo) {
    highlightVideo.src = data.highlightUrl || '';
  }

  const stats = data.stats || {};
  const statsList = document.getElementById('statsList');
  if (statsList) {
    // Create secure DOM elements instead of innerHTML
    statsList.textContent = '';
    Object.entries(stats).forEach(([k, v]) => {
      const li = document.createElement('li');
      li.textContent = `${k}: ${v}`;
      statsList.appendChild(li);
    });
  }

  // Convert grades to letter grades if they're numeric
  const grades = data.recentGrades || ['B', 'C+', 'C', 'B+', 'C-'];
  let gradeData, gradeLabels;

  if (typeof grades[0] === 'number') {
    // Convert numeric grades to letters for display
    gradeLabels = grades.map(grade => {
      if (grade >= 85) {
        return 'A';
      } else if (grade >= 70) {
        return 'B';
      } else if (grade >= 50) {
        return 'C';
      } else if (grade >= 40) {
        return 'D';
      } else {
        return 'F';
      }
    });

    // Map to chart values
    gradeData = gradeLabels.map(grade => {
      const gradeMap = {
        A: 5,
        B: 4,
        C: 3,
        D: 2,
        F: 1,
      };
      return gradeMap[grade] || 1;
    });
  } else {
    // Already letter grades
    gradeLabels = grades;
    gradeData = grades.map(grade => {
      const gradeMap = {
        A: 5,
        B: 4,
        C: 3,
        D: 2,
        F: 1,
      };
      return gradeMap[grade] || 1;
    });
  }

  const labels = ['G1', 'G2', 'G3', 'G4', 'G5'];
  if (document.getElementById('gradeChart')) {
    new Chart(document.getElementById('gradeChart'), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Game Grades',
            data: gradeData,
            borderWidth: 2,
            fill: false,
            borderColor: '#00b4d8',
            backgroundColor: 'rgba(0, 180, 216, 0.1)',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label(context) {
                return `Game Grade: ${gradeLabels[context.dataIndex]}`;
              },
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback(value) {
                const gradeLabelsMap = {
                  5: 'A',
                  4: 'B',
                  3: 'C',
                  2: 'D',
                  1: 'F',
                };
                return gradeLabelsMap[value] || '';
              },
              stepSize: 1,
              includeBounds: false,
            },
            min: 1,
            max: 5,
            // Only display ticks at grade positions
            afterBuildTicks(axis) {
              axis.ticks = [
                { value: 1, label: 'F' },
                { value: 2, label: 'D' },
                { value: 3, label: 'C' },
                { value: 4, label: 'B' },
                { value: 5, label: 'A' },
              ];
            },
          },
        },
      },
    });
  }

  if (data.heatmap && data.heatmap.shotLocations) {
    renderHeatmap(data.heatmap.shotLocations);
  }

  loadClassProgress();
  loadGameBreakdowns();
  loadHighlights();
  loadDailyReport();
}

async function loadDailyReport() {
  const link = document.getElementById('dailyReportLink');
  try {
    const url = await getDownloadURL(
      storageRef(storage, `reports/${playerId}/daily.pdf`)
    );
    link.href = url;
    link.textContent = '📄 Download Daily Report (PDF)';
    link.style.display = 'inline-block';
  } catch {
    link.textContent = 'Report not available yet.';
    link.style.display = 'block';
  }
}

function renderHeatmap(locations) {
  const ctx = document.getElementById('shotChart').getContext('2d');
  const made = locations
    .filter(s => s.result === 'made')
    .map(p => ({ x: p.x, y: p.y }));
  const missed = locations
    .filter(s => s.result === 'missed')
    .map(p => ({ x: p.x, y: p.y }));

  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Made Shots',
          data: made,
          pointStyle: 'circle',
          backgroundColor: 'green',
        },
        {
          label: 'Missed Shots',
          data: missed,
          pointStyle: 'x',
          backgroundColor: 'red',
        },
      ],
    },
    options: {
      scales: {
        x: { min: 0, max: 100 },
        y: { min: 0, max: 100 },
      },
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  });
}

async function loadHighlights() {
  const snap = await getDocs(collection(db, `players/${playerId}/highlights`));
  const gallery = document.getElementById('highlightGallery');
  if (!gallery) {
    return;
  }
  clearContainer(gallery);

  snap.forEach(doc => {
    const clip = doc.data();
    const clipElement = createVideoClip(clip, {
      width: '300',
      extraClass: 'clip-card',
    });
    gallery.appendChild(clipElement);
  });
}

async function loadClassProgress() {
  const classList = [
    { id: 'financial', label: 'Financial Literacy' },
    { id: 'nil', label: 'NIL Training' },
    { id: 'leadership', label: 'Leadership' },
    { id: 'social', label: 'Social Media Etiquette' },
  ];

  const wrapper = document.getElementById('classList');
  if (!wrapper) {
    return;
  }
  clearContainer(wrapper);

  for (const cls of classList) {
    const ref = doc(db, `players/${playerId}/classes/${cls.id}`);
    const snap = await getDoc(ref);
    const status = snap.exists() ? snap.data().status : 'Not Started';

    const li = document.createElement('li');
    const button = document.createElement('button');
    safeText(button, 'Start');
    button.dataset.classId = cls.id;
    button.addEventListener('click', startClass);

    const statusText = document.createElement('span');
    safeText(statusText, `${cls.label} — `);

    const statusStrong = document.createElement('strong');
    safeText(statusStrong, status);

    li.appendChild(statusText);
    li.appendChild(statusStrong);
    li.appendChild(button);
    wrapper.appendChild(li);
  }
}

async function loadGameBreakdowns() {
  const breakdownDiv = document.getElementById('gameBreakdowns');
  if (!breakdownDiv) {
    return;
  }
  clearContainer(breakdownDiv);

  const title = document.createElement('h3');
  safeText(title, '🧠 Game Breakdown');
  breakdownDiv.appendChild(title);

  // OPTIMIZED APPROACH: Instead of N+1 queries, we'll use a more efficient strategy

  // First, get scouting reports for this player to identify which games they're in
  try {
    const scoutingReportsSnap = await getDocs(
      collection(db, 'scoutingReports')
    );
    const playerReports = new Map(); // gameId -> report data

    scoutingReportsSnap.forEach(doc => {
      const reportId = doc.id;
      if (reportId.endsWith(`_${playerId}`)) {
        const gameId = reportId.replace(`_${playerId}`, '');
        playerReports.set(gameId, doc.data());
      }
    });

    // If we have scouting reports, we know which games to look at
    if (playerReports.size > 0) {
      // Only query the specific games we know the player is in
      for (const [gameId, reportData] of playerReports) {
        const playsRef = collection(db, `playerStats/${gameId}/plays`);
        const snap = await getDocs(playsRef);

        const tagged = [];
        snap.forEach(doc => {
          const d = doc.data();
          if (d.playerId === playerId) {
            tagged.push(d);
          }
        });

        if (tagged.length > 0) {
          const block = document.createElement('div');
          block.classList.add('game-breakdown');

          const gameTitle = document.createElement('strong');
          safeText(gameTitle, `Game: ${gameId}`);
          block.appendChild(gameTitle);

          const actionList = createActionList(tagged);
          block.appendChild(actionList);

          const scoutingReport = createScoutingReport(reportData);
          block.appendChild(scoutingReport);

          breakdownDiv.appendChild(block);
        }
      }
    } else {
      // Fallback: If no scouting reports, show a message instead of doing expensive queries
      const fallbackMessage = document.createElement('p');
      fallbackMessage.textContent =
        'No game breakdowns available yet. Play in some games to see your stats!';
      breakdownDiv.appendChild(fallbackMessage);
    }
  } catch (error) {
    console.error('Error loading game breakdowns:', error);
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Unable to load game breakdowns at this time.';
    breakdownDiv.appendChild(errorMessage);
  }

  /*
   * RECOMMENDED DATA STRUCTURE IMPROVEMENT:
   *
   * Instead of the current structure:
   * - games/{gameId}
   * - playerStats/{gameId}/plays/{playId}
   *
   * Consider this flatter structure:
   * - games/{gameId}
   * - plays/{playId} with fields: { gameId, playerId, type, timestamp, ... }
   *
   * This would allow for efficient queries like:
   * query(collection(db, 'plays'), where('playerId', '==', playerId))
   *
   * Benefits:
   * 1. Single query instead of N+1 queries
   * 2. Better performance and lower costs
   * 3. Easier to implement player-specific analytics
   * 4. More scalable as the number of games grows
   */
}

// Clean event handlers - no global scope pollution
async function startClass(event) {
  const classId = event.target.dataset.classId;
  const ref = doc(db, `players/${playerId}/classes/${classId}`);
  await setDoc(
    ref,
    {
      status: 'In Progress',
      startedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  alert(`📘 Class started: ${classId}`);
  loadClassProgress();
}

function downloadResume() {
  const iframe = document.getElementById('resumePreview');
  const link = document.createElement('a');
  link.href = iframe.src;
  link.download = 'Player_Resume.pdf';
  link.click();
}

// Set up event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Add event listener for download resume button if it exists
  const downloadBtn = document.getElementById('downloadResumeBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadResume);
  }
});

loadPlayerData();
