import { db, auth, storage, functions } from '../../shared/firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { Timestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { calculateGameGrade } from '../../ai/game-grade.js';
import { httpsCallable } from "firebase/functions";

// Utility: Safe DOM access
function safeGet(id) {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`Element with id "${id}" not found.`);
  }
  return el;
}

// --- Auth State ---
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "/users/registration.html";
  } else {
    const playerContent = safeGet('player-content');
    if (playerContent) playerContent.textContent = `Logged in as ${user.email}`;

    // Example player stats (replace with real data if available)
    const playerStats = {
      points: 12,
      rebounds: 6,
      assists: 4,
      fgm: 5,
      ftm: 2,
      steals: 1,
      blocks: 0,
      charges: 0,
      deflections: 2,
      turnovers: 2,
      fouls: 1,
      fgmiss: 4,
      ftmiss: 1,
      attitude: 10,
      hustle: 10,
      body_language: 0
    };
    const minutesPlayed = 18;
    const grade = calculateGameGrade(playerStats, minutesPlayed);

    const playerGrade = safeGet('player-grade');
    if (playerGrade) playerGrade.textContent = `Your Game Grade: ${grade}`;
  }
});

window.logout = async function() {
  await signOut(auth);
  window.location.href = "/users/registration.html";
};

// --- Stat Form ---
const statForm = safeGet('stat-form');
if (statForm) {
  statForm.onsubmit = async function(e) {
    e.preventDefault();

    // Collect values from the form
    const points = parseInt(safeGet('points')?.value, 10) || 0;
    const rebounds = parseInt(safeGet('rebounds')?.value, 10) || 0;
    const minutesPlayed = parseInt(safeGet('minutes')?.value, 10) || 0;

    // You can expand this to collect all stats needed by calculateGameGrade
    const playerStats = {
      points,
      rebounds,
      assists: 0,
      fgm: 0,
      ftm: 0,
      steals: 0,
      blocks: 0,
      charges: 0,
      deflections: 0,
      turnovers: 0,
      fouls: 0,
      fgmiss: 0,
      ftmiss: 0,
      attitude: 10,
      hustle: 10,
      body_language: 0
    };

    const grade = calculateGameGrade(playerStats, minutesPlayed);

    const gradeResult = safeGet('grade-result');
    if (gradeResult) gradeResult.textContent = `Your Game Grade: ${grade}`;

    // --- Save to Firestore ---
    const user = auth.currentUser;
    if (user) {
      try {
        await db.collection('grades').add({
          playerId: user.uid,
          grade: grade,
          stats: playerStats,
          minutes: minutesPlayed,
          timestamp: Timestamp.now()
        });
      } catch (err) {
        console.error("Error saving grade:", err);
      }
    }
  };
}

// --- MP4 Upload ---
const mp4UploadForm = safeGet('mp4-upload-form');
if (mp4UploadForm) {
  mp4UploadForm.onsubmit = async function(e) {
    e.preventDefault();
    const fileInput = safeGet('video-file');
    const file = fileInput?.files[0];
    const messageDiv = safeGet('mp4-upload-message');
    const user = auth.currentUser;
    const submitBtn = mp4UploadForm.querySelector('button[type="submit"], input[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    if (!user) {
      if (messageDiv) {
        messageDiv.textContent = "You must be logged in to upload a video.";
        messageDiv.style.color = "#d90429";
      }
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    // Loosen MP4 file type check for broader compatibility
    if (
      !file ||
      !(
        file.type === "video/mp4" ||
        file.type === "video/x-mp4" ||
        file.name.toLowerCase().endsWith(".mp4")
      )
    ) {
      if (messageDiv) {
        messageDiv.textContent = "Please select a valid MP4 file.";
        messageDiv.style.color = "#d90429";
      }
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    try {
      // Upload to Firebase Storage
      const videoRef = storage.ref(`videos/${user.uid}/${Date.now()}_${file.name}`);
      const snapshot = await videoRef.put(file);
      const downloadURL = await snapshot.ref.getDownloadURL();

      // Save video info to Firestore
      await db.collection('videos').add({
        uploadedBy: user.uid,
        videoUrl: downloadURL,
        originalFileName: file.name,
        createdAt: Timestamp.now()
      });

      if (messageDiv) {
        messageDiv.textContent = "MP4 video uploaded successfully!";
        messageDiv.style.color = "#007cba";
      }
      if (fileInput) fileInput.value = '';
    } catch (err) {
      if (messageDiv) {
        messageDiv.textContent = "Error uploading MP4 video. Please try again.";
        messageDiv.style.color = "#d90429";
      }
    }
    if (submitBtn) submitBtn.disabled = false;
  };
}

// --- Video Upload (YouTube/Hudl) ---
const videoUploadForm = safeGet('video-upload-form');
if (videoUploadForm) {
  videoUploadForm.onsubmit = async function(e) {
    e.preventDefault();
    const link = safeGet('video-url')?.value.trim();
    const user = auth.currentUser;
    const messageDiv = safeGet('upload-message');
    const submitBtn = videoUploadForm.querySelector('button[type="submit"], input[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    // Basic validation for YouTube or Hudl links
    if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be|hudl\.com)\//i.test(link)) {
      if (messageDiv) {
        messageDiv.textContent = "Please enter a valid YouTube or Hudl link.";
        messageDiv.style.color = "#d90429";
      }
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    if (!user) {
      if (messageDiv) {
        messageDiv.textContent = "You must be logged in to upload a video.";
        messageDiv.style.color = "#d90429";
      }
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    try {
      await db.collection('videos').add({
        uploadedBy: user.uid,
        videoLink: link,
        createdAt: Timestamp.now()
      });
      if (messageDiv) {
        messageDiv.textContent = 'Video uploaded!';
        messageDiv.style.color = "#007cba";
      }
      if (safeGet('video-url')) safeGet('video-url').value = '';
    } catch (err) {
      if (messageDiv) {
        messageDiv.textContent = "Error uploading video. Please try again.";
        messageDiv.style.color = "#d90429";
      }
    }
    if (submitBtn) submitBtn.disabled = false;
  };
}

// --- Game Recaps ---
async function loadLatestGameRecap() {
  const recapDiv = safeGet('game-recap-content');
  if (!recapDiv) return;
  recapDiv.innerHTML = "<p>Loading recap...</p>";

  try {
    const snapshot = await db
      .collection('gameRecaps')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      recapDiv.innerHTML = "<p>No recaps available yet.</p>";
      return;
    }

    const recap = snapshot.docs[0].data();
    recapDiv.innerHTML = `
      <h4 style="margin-bottom:0.5em;">${recap.title || ''}</h4>
      <p>${recap.summary || ''}</p>
      <div style="margin-top:1em;">
        <strong>Top Players:</strong>
        <ul>
          ${(recap.topPlayers || []).map(p => `<li>${p.name}: ${p.points} pts, ${p.rebounds} reb, ${p.assists} ast, ${p.steals} stl, ${p.blocks} blk</li>`).join('')}
        </ul>
        <strong>Team Stats:</strong>
        <ul>
          <li>Rebounds: ${recap.teamStats?.rebounds || 0}</li>
          <li>Assists: ${recap.teamStats?.assists || 0}</li>
          <li>Steals: ${recap.teamStats?.steals || 0}</li>
          <li>Blocks: ${recap.teamStats?.blocks || 0}</li>
          <li>Shooting %: ${recap.teamStats?.shootingPercentage || 0}%</li>
        </ul>
      </div>
    `;
  } catch (err) {
    recapDiv.innerHTML = "<p>Error loading recap.</p>";
  }
}
loadLatestGameRecap();

// --- All Game Recaps ---
async function loadAllGameRecaps() {
  const user = auth.currentUser;
  if (!user) return;

  const teamFilter = safeGet('recap-team-filter');
  const dateFilter = safeGet('recap-date-filter');
  const recapFeedDiv = safeGet('game-recap-feed');
  if (!teamFilter || !dateFilter || !recapFeedDiv) return;

  let query = db.collection('gameRecaps').orderBy('createdAt', 'desc');

  // Filter by team
  const team = teamFilter.value;
  if (team) {
    query = query.where('teamA', '==', team); // or 'teamB', or both, depending on your data
  }

  // Filter by date (assumes createdAt is a Firestore Timestamp)
  const date = dateFilter.value;
  if (date) {
    const start = new Date(date);
    start.setHours(0,0,0,0);
    const end = new Date(date);
    end.setHours(23,59,59,999);
    query = query.where('createdAt', '>=', Timestamp.fromDate(start))
                 .where('createdAt', '<=', Timestamp.fromDate(end));
  }

  try {
    const recapsSnap = await query.get();

    if (recapsSnap.empty) {
      recapFeedDiv.innerHTML = "<p>No recaps available for this filter.</p>";
      return;
    }

    const recapFeed = recapsSnap.docs.map(doc => {
      const recap = doc.data();
      return `
        <div style="margin-bottom:2em;padding-bottom:1em;border-bottom:1px solid #ccc;">
          <h4 style="font-size:1.2em;color:#007cba;font-weight:800;">${recap.title}</h4>
          <p style="font-weight:700;margin-bottom:0.3em;">
            Team Grade: <span style="font-size:1.2em;color:#28a745;">${recap.teamGrade || ''}</span>
          </p>
          <p style="font-size:1em;margin-bottom:1em;">${recap.summary}</p>
          <h5 style="font-weight:700;">Top Performers:</h5>
          <ul>
            ${(recap.topPlayers || []).map(p => `
              <li>${p.name} — ${p.points} pts, ${p.rebounds} reb, ${p.assists || 0} ast</li>
            `).join('')}
          </ul>
          <h5 style="font-weight:700;margin-top:1em;">Team Stats:</h5>
          <ul>
            <li>Rebounds: ${recap.teamStats?.rebounds || 0}</li>
            <li>Assists: ${recap.teamStats?.assists || 0}</li>
            <li>Steals: ${recap.teamStats?.steals || 0}</li>
            <li>Blocks: ${recap.teamStats?.blocks || 0}</li>
            <li>Shooting %: ${recap.teamStats?.shootingPercentage || 0}%</li>
          </ul>
        </div>
      `;
    }).join('');

    recapFeedDiv.innerHTML = recapFeed;
  } catch (err) {
    recapFeedDiv.innerHTML = "<p>Error loading recaps.</p>";
  }
}

// Add event listeners for the filter controls
const recapFilterBtn = safeGet('recap-filter-btn');
const recapTeamFilter = safeGet('recap-team-filter');
const recapDateFilter = safeGet('recap-date-filter');
if (recapFilterBtn) recapFilterBtn.onclick = loadAllGameRecaps;
if (recapTeamFilter) recapTeamFilter.onchange = loadAllGameRecaps;
if (recapDateFilter) recapDateFilter.onchange = loadAllGameRecaps;

// Initial load after auth
onAuthStateChanged(auth, user => {
  if (user) loadAllGameRecaps();
});

// PDF Resume Download Logic (modularized, no window.firebase)
const resumeBtn = safeGet('download-resume-btn');
if (resumeBtn) {
  resumeBtn.onclick = async function() {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to download your resume.");
      return;
    }
    const btn = this;
    btn.disabled = true;
    btn.textContent = "Generating PDF...";

    try {
      // Modular Firebase Functions usage
      const generateResume = httpsCallable(functions, 'generatePlayerResume');
      const result = await generateResume();
      if (result.data && result.data.url) {
        window.open(result.data.url, '_blank');
      } else {
        alert("Could not generate resume. Please try again.");
      }
    } catch (err) {
      alert("Error generating resume: " + (err.message || err));
    }
    btn.disabled = false;
    btn.textContent = "Download Resume";
  };
}

// --- Statkeeper ---
let statkeeperStats = {};
let statkeeperPlayerId = null;

async function populatePlayerSelect() {
  const select = safeGet('player-select');
  if (!select) return;
  select.innerHTML = '';
  try {
    const snapshot = await db.collection('users').where('role', '==', 'player').get();
    snapshot.forEach(doc => {
      const data = doc.data();
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = data.name || doc.id;
      select.appendChild(option);
    });
    if (select.options.length > 0) {
      statkeeperPlayerId = select.value;
      statkeeperStats = {};
      updateStatOutput();
    }
  } catch (err) {
    console.error("Error populating player select:", err);
  }
}

const playerSelect = safeGet('player-select');
if (playerSelect) {
  playerSelect.onchange = function() {
    statkeeperPlayerId = this.value;
    statkeeperStats = {};
    updateStatOutput();
  };
}

window.recordStat = function(stat) {
  if (!statkeeperPlayerId) return;
  statkeeperStats[stat] = (statkeeperStats[stat] || 0) + 1;
  updateStatOutput();
};

function updateStatOutput() {
  const statOutput = safeGet('stat-output');
  if (statOutput) {
    statOutput.textContent =
      `Player: ${statkeeperPlayerId || 'None selected'}\n` +
      JSON.stringify(statkeeperStats, null, 2);
  }
}

// Offline save/load using localStorage
window.saveOfflineStats = function() {
  if (!statkeeperPlayerId) return;
  localStorage.setItem(`statkeeper_${statkeeperPlayerId}`, JSON.stringify(statkeeperStats));
  alert('Stats saved offline!');
};

window.syncOfflineStats = async function() {
  if (!statkeeperPlayerId) return;
  const stats = JSON.parse(localStorage.getItem(`statkeeper_${statkeeperPlayerId}`) || '{}');
  if (Object.keys(stats).length === 0) {
    alert('No offline stats to sync.');
    return;
  }
  try {
    await db.collection('grades').add({
      playerId: statkeeperPlayerId,
      stats: stats,
      timestamp: Timestamp.now()
    });
    alert('Stats synced to Firebase!');
    localStorage.removeItem(`statkeeper_${statkeeperPlayerId}`);
    statkeeperStats = {};
    updateStatOutput();
  } catch (err) {
    alert("Error syncing stats: " + (err.message || err));
  }
};

// --- DOMContentLoaded for tab logic and player select ---
document.addEventListener('DOMContentLoaded', () => {
  if (safeGet('statkeeper-tab')) {
    populatePlayerSelect();
  }
});

// --- Error handling for missing elements is now included via safeGet utility ---