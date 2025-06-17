import { db, auth, storage } from '../../shared/firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { Timestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Utility for safe DOM access
function safeGet(id) {
  const el = document.getElementById(id);
  if (!el) console.warn(`Element with id "${id}" not found.`);
  return el;
}

// Utility to sanitize IDs for HTML usage
function sanitizeId(id) {
  return String(id).replace(/[^a-zA-Z0-9\-_:.]/g, '_');
}

let teamPlayers = [];
let coachTeamId = null;
let latestRenderToken = 0;

// --- Auth and Team Players ---
onAuthStateChanged(auth, async user => {
  if (!user) {
    window.location.href = "/users/registration.html";
    return;
  }
  const coachContent = safeGet('coach-content');
  if (coachContent) {
    coachContent.textContent = `Logged in as ${user.email}`;
  }
  try {
    const coachDoc = await db.collection('users').doc(user.uid).get();
    const coachData = coachDoc.data();
    if (!coachData?.teamId) {
      const teamList = safeGet('team-players-list');
      if (teamList) teamList.innerHTML = "<p>No team assigned.</p>";
      return;
    }
    coachTeamId = coachData.teamId;
    const playersSnap = await db.collection('users')
      .where('teamId', '==', coachTeamId)
      .where('role', '==', 'player')
      .get();
    teamPlayers = playersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderTeamPlayers();
    loadTeamGradingSummary();
    loadGameFilmLibrary();
    loadAnnouncements();
  } catch (err) {
    const teamList = safeGet('team-players-list');
    if (teamList) teamList.innerHTML = "<p>Error loading players.</p>";
  }
});

// --- Player Search/Filter ---
const playerSearch = safeGet('player-search');
if (playerSearch) {
  playerSearch.oninput = function() {
    const query = this.value.toLowerCase();
    const filtered = teamPlayers.filter(p =>
      (p.name || '').toLowerCase().includes(query) ||
      (p.position || '').toLowerCase().includes(query)
    );
    renderTeamPlayers(filtered);
  };
}

async function fetchLatestGrades(playerIds) {
  // Firestore 'in' supports max 10, so batch
  let gradesMap = {};
  for (let i = 0; i < playerIds.length; i += 10) {
    const batchIds = playerIds.slice(i, i + 10);
    if (batchIds.length === 0) continue;
    const gradesSnap = await db.collection('grades')
      .where('playerId', 'in', batchIds)
      .orderBy('timestamp', 'desc')
      .get();
    gradesSnap.docs.forEach(doc => {
      const data = doc.data();
      if (!gradesMap[data.playerId]) {
        gradesMap[data.playerId] = data.grade;
      }
    });
  }
  return gradesMap;
}

function renderTeamPlayers(filteredList) {
  const listDiv = safeGet('team-players-list');
  const players = filteredList || teamPlayers;
  if (!listDiv) return;
  if (!players.length) {
    listDiv.innerHTML = "<p>No players found.</p>";
    return;
  }
  listDiv.innerHTML = '';
  // Table header
  const table = document.createElement('table');
  table.style.width = "100%";
  table.innerHTML = `
    <thead>
      <tr>
        <th>Name</th>
        <th>Position</th>
        <th>Email</th>
        <th>Latest Grade</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector('tbody');
  // Use a render token to prevent async grade fetches from updating old tables
  const renderToken = ++latestRenderToken;
  players.forEach(player => {
    const tr = document.createElement('tr');
    tr.className = "player-list-item";
    tr.style.cursor = "pointer";
    tr.onclick = () => openPlayerProfile(player.id);
    const gradeCellId = `grade-${sanitizeId(player.id)}`;
    tr.innerHTML = `
      <td>${player.name || ''}</td>
      <td>${player.position || ''}</td>
      <td>${player.email || ''}</td>
      <td id="${gradeCellId}">Loading...</td>
    `;
    tbody.appendChild(tr);
  });
  listDiv.appendChild(table);

  // Fetch latest grades in batch for visible players
  fetchLatestGrades(players.map(p => p.id)).then(gradesMap => {
    // Only update if this is the latest render
    if (renderToken !== latestRenderToken) return;
    players.forEach(player => {
      const gradeCell = safeGet(`grade-${sanitizeId(player.id)}`);
      if (gradeCell) {
        gradeCell.textContent = gradesMap[player.id] !== undefined ? gradesMap[player.id] : "N/A";
      }
    });
  });
}

// --- Player Profile Modal ---
async function openPlayerProfile(playerId) {
  const modal = safeGet('player-profile-modal');
  const content = safeGet('player-profile-content');
  if (!modal || !content) return;
  content.innerHTML = "<p>Loading profile...</p>";
  modal.style.display = "block";
  try {
    const userDoc = await db.collection('users').doc(playerId).get();
    const userData = userDoc.data();
    // Get last 5 grades
    const gradesSnap = await db.collection('grades')
      .where('playerId', '==', playerId)
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get();
    const grades = gradesSnap.docs.map(doc => doc.data());
    content.innerHTML = `
      <h3>${userData?.name || "Player"}</h3>
      <p>Email: ${userData?.email || ""}</p>
      <p>Position: ${userData?.position || ""}</p>
      <h4>Recent Grades</h4>
      <ul>
        ${grades.length ? grades.map(g => `<li>Grade: ${g.grade} (${g.minutes || 0} min)</li>`).join('') : "<li>No grades yet.</li>"}
      </ul>
    `;
  } catch (err) {
    content.innerHTML = "<p>Error loading profile.</p>";
  }
}

window.closePlayerProfile = function() {
  const modal = safeGet('player-profile-modal');
  if (modal) {
    modal.style.display = "none";
    const content = safeGet('player-profile-content');
    if (content) content.innerHTML = "";
  }
};

// --- Upload Game Film ---
const gameFilmForm = safeGet('game-film-upload-form');
if (gameFilmForm) {
  gameFilmForm.onsubmit = async function(e) {
    e.preventDefault();
    const fileInput = safeGet('game-film-file');
    const linkInput = safeGet('game-film-link');
    const messageDiv = safeGet('game-film-upload-message');
    const submitBtn = gameFilmForm.querySelector('button[type="submit"], input[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const file = fileInput?.files[0];
    const link = linkInput?.value.trim();

    // UX: Only allow one input at a time
    if (file && link) {
      if (messageDiv) {
        messageDiv.textContent = "Please provide either a file or a link, not both.";
        messageDiv.style.color = "#d90429";
      }
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    if (!file && !link) {
      if (messageDiv) {
        messageDiv.textContent = "Please select a file or enter a link.";
        messageDiv.style.color = "#d90429";
      }
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    // Handle MP4 upload
    if (file) {
      const validMp4 = (
        file.type === "video/mp4" ||
        file.type === "video/x-mp4" ||
        file.name.toLowerCase().endsWith(".mp4")
      );
      if (!validMp4) {
        if (messageDiv) {
          messageDiv.textContent = "Please select a valid MP4 file.";
          messageDiv.style.color = "#d90429";
        }
        if (submitBtn) submitBtn.disabled = false;
        return;
      }
      try {
        const user = auth.currentUser;
        const videoRef = storage.ref(`gamefilms/${user.uid}/${Date.now()}_${file.name}`);
        const snapshot = await videoRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        await db.collection('gameFilms').add({
          uploadedBy: user.uid,
          teamId: coachTeamId,
          videoUrl: downloadURL,
          originalFileName: file.name,
          createdAt: Timestamp.now()
        });
        if (messageDiv) {
          messageDiv.textContent = "Game film uploaded!";
          messageDiv.style.color = "#007cba";
        }
        if (fileInput) fileInput.value = '';
        if (linkInput) linkInput.value = '';
        loadGameFilmLibrary();
      } catch (err) {
        if (messageDiv) {
          messageDiv.textContent = "Error uploading film.";
          messageDiv.style.color = "#d90429";
        }
      }
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    // Handle YouTube/Hudl link
    if (link) {
      if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be|hudl\.com)\//i.test(link)) {
        if (messageDiv) {
          messageDiv.textContent = "Please enter a valid YouTube or Hudl link.";
          messageDiv.style.color = "#d90429";
        }
        if (submitBtn) submitBtn.disabled = false;
        return;
      }
      try {
        const user = auth.currentUser;
        await db.collection('gameFilms').add({
          uploadedBy: user.uid,
          teamId: coachTeamId,
          videoLink: link,
          createdAt: Timestamp.now()
        });
        if (messageDiv) {
          messageDiv.textContent = "Game film link uploaded!";
          messageDiv.style.color = "#007cba";
        }
        if (linkInput) linkInput.value = '';
        if (fileInput) fileInput.value = '';
        loadGameFilmLibrary();
      } catch (err) {
        if (messageDiv) {
          messageDiv.textContent = "Error uploading film link.";
          messageDiv.style.color = "#d90429";
        }
      }
      if (submitBtn) submitBtn.disabled = false;
      return;
    }
  };
}

// --- Game Film Library ---
async function loadGameFilmLibrary() {
  const libraryDiv = safeGet('game-film-library');
  if (!libraryDiv) return;
  libraryDiv.innerHTML = "<p>Loading game films...</p>";
  try {
    if (!coachTeamId) {
      libraryDiv.innerHTML = "<p>No team assigned.</p>";
      return;
    }
    const filmsSnap = await db.collection('gameFilms')
      .where('teamId', '==', coachTeamId)
      .orderBy('createdAt', 'desc')
      .get();
    if (filmsSnap.empty) {
      libraryDiv.innerHTML = "<p>No game films uploaded yet.</p>";
      return;
    }
    libraryDiv.innerHTML = '';
    filmsSnap.forEach(doc => {
      const film = doc.data();
      const div = document.createElement('div');
      div.className = "film-thumb";
      if (film.videoUrl) {
        div.innerHTML = `<video controls width="320" src="${film.videoUrl}"></video>`;
      } else if (film.videoLink) {
        div.innerHTML = `<a href="${film.videoLink}" target="_blank">${film.videoLink}</a>`;
      }
      libraryDiv.appendChild(div);
    });
  } catch (err) {
    libraryDiv.innerHTML = "<p>Error loading game films.</p>";
  }
}

// --- Team Grading Summary ---
async function loadTeamGradingSummary() {
  const summaryDiv = safeGet('team-grading-summary');
  if (!summaryDiv) return;
  summaryDiv.innerHTML = "<p>Loading summary...</p>";
  try {
    if (!teamPlayers.length) {
      summaryDiv.innerHTML = "<p>No players on team.</p>";
      return;
    }
    // Get all grades for all players (Firestore 'in' supports max 10)
    const playerIds = teamPlayers.map(p => p.id);
    let grades = [];
    for (let i = 0; i < playerIds.length; i += 10) {
      const batchIds = playerIds.slice(i, i + 10);
      if (batchIds.length === 0) continue;
      const gradesSnap = await db.collection('grades')
        .where('playerId', 'in', batchIds)
        .get();
      grades = grades.concat(gradesSnap.docs.map(doc => doc.data()));
    }
    if (!grades.length) {
      summaryDiv.innerHTML = "<p>No grades found for team.</p>";
      return;
    }
    // Calculate average grade
    const avg = (grades.reduce((sum, g) => sum + (g.grade || 0), 0) / grades.length).toFixed(2);
    summaryDiv.innerHTML = `
      <p>Players graded: ${grades.length}</p>
      <p>Average grade: <strong>${avg}</strong></p>
    `;
  } catch (err) {
    summaryDiv.innerHTML = "<p>Error loading summary.</p>";
  }
}

// --- Team Announcements ---
const announcementForm = safeGet('announcement-form');
if (announcementForm) {
  announcementForm.onsubmit = async function(e) {
    e.preventDefault();
    const text = safeGet('announcement-text').value.trim();
    const messageDiv = safeGet('announcement-message');
    if (!text) {
      messageDiv.textContent = "Announcement cannot be empty.";
      messageDiv.style.color = "#d90429";
      return;
    }
    try {
      const user = auth.currentUser;
      await db.collection('announcements').add({
        teamId: coachTeamId,
        text,
        postedBy: user.uid,
        createdAt: Timestamp.now()
      });
      messageDiv.textContent = "Announcement posted!";
      messageDiv.style.color = "#007cba";
      safeGet('announcement-text').value = '';
      loadAnnouncements();
    } catch (err) {
      messageDiv.textContent = "Error posting announcement.";
      messageDiv.style.color = "#d90429";
    }
  };
}

async function loadAnnouncements() {
  const listDiv = safeGet('announcements-list');
  if (!listDiv) return;
  listDiv.innerHTML = "<p>Loading announcements...</p>";
  try {
    if (!coachTeamId) {
      listDiv.innerHTML = "<p>No team assigned.</p>";
      return;
    }
    const snap = await db.collection('announcements')
      .where('teamId', '==', coachTeamId)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();
    if (snap.empty) {
      listDiv.innerHTML = "<p>No announcements yet.</p>";
      return;
    }
    listDiv.innerHTML = '';
    snap.forEach(doc => {
      const ann = doc.data();
      const div = document.createElement('div');
      div.className = "announcement";
      div.innerHTML = `
        <div style="font-size:1.1em;">${ann.text}</div>
        <div style="font-size:0.9em;color:#888;">${ann.createdAt?.toDate().toLocaleString() || ""}</div>
      `;
      listDiv.appendChild(div);
    });
  } catch (err) {
    listDiv.innerHTML = "<p>Error loading announcements.</p>";
  }
}

// --- Logout ---
window.logout = async function() {
  try {
    await signOut(auth);
  } catch (err) {
    alert("Error signing out. Please try again.");
  }
  window.location.href = "/users/registration.html";
};