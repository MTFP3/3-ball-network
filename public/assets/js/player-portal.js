// Player Portal JavaScript - Enhanced for User-Specific Data
// Modern ES6+ implementation with proper user authentication and data isolation

// Initialize Firebase
const config = getFirebaseConfig();
if (config) {
  firebase.initializeApp(config);
}
const auth = firebase.auth();
const db = firebase.firestore();

// Global state management
const playerPortalState = {
  currentUser: null,
  playerData: null,
  activeSection: 'profile',
  aiChatMessages: [],
  publicProfileEnabled: false,
  currentHeatmapView: 'shots',
  userDataLoaded: false,
};

// Data collections for user-specific data
const COLLECTIONS = {
  USERS: 'users',
  PLAYER_STATS: 'playerStats',
  PLAYER_GAMES: 'playerGames',
  PLAYER_HIGHLIGHTS: 'playerHighlights',
  PLAYER_CLASSES: 'playerClasses',
  PLAYER_RESUME: 'playerResume',
  PLAYER_HEATMAPS: 'playerHeatmaps',
  AI_CHAT_HISTORY: 'aiChatHistory',
  PUBLIC_PROFILES: 'publicProfiles',
};

// DOM elements
const elements = {
  navLinks: document.querySelectorAll('.nav-link'),
  contentSections: document.querySelectorAll('.content-section'),
  navToggle: document.getElementById('navToggle'),
  navMenu: document.getElementById('navMenu'),
  aiChatMessages: document.getElementById('aiChatMessages'),
  aiChatInput: document.getElementById('aiChatInput'),
  publicToggle: document.getElementById('publicToggle'),
  highlightsGrid: document.getElementById('highlightsGrid'),
  classGrid: document.getElementById('classGrid'),
  resumePreview: document.getElementById('resumePreview'),
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
  initializeApp();
  setupEventListeners();
});

// Authentication state listener - CRITICAL: This ensures only authenticated users can access data
auth.onAuthStateChanged(async function (user) {
  if (user) {
    console.log('User authenticated:', user.uid);
    playerPortalState.currentUser = user;

    // Verify user is a player
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(user.uid).get();
    if (userDoc.exists && userDoc.data().role === 'player') {
      await loadPlayerProfile(user.uid);
      await initializeUserData(user.uid);
      playerPortalState.userDataLoaded = true;
    } else {
      console.error('Access denied: User is not a player');
      window.location.href = '/login.html';
    }
  } else {
    console.log('User not authenticated, redirecting to login');
    window.location.href = '/login.html';
  }
});

// Initialize user-specific data
async function initializeUserData(uid) {
  try {
    // Load all user-specific data
    await Promise.all([
      loadPlayerStats(uid),
      loadPlayerGames(uid),
      loadPlayerHighlights(uid),
      loadPlayerClasses(uid),
      loadPlayerHeatmaps(uid),
      loadAIChatHistory(uid),
      loadPublicProfileSettings(uid),
    ]);

    // Initialize UI components
    initializeCharts();
    initializeHeatmaps();
    loadHighlights();
    loadClassModules();
    initializeAIChat();
    generateResume();

    console.log('User data initialized successfully');
  } catch (error) {
    console.error('Error initializing user data:', error);
  }
}

// Load player profile from Firebase - User-specific
async function loadPlayerProfile(uid) {
  try {
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      playerPortalState.playerData = userData;
      updatePlayerProfile(userData);
    } else {
      console.error('Player profile not found for UID:', uid);
    }
  } catch (error) {
    console.error('Error loading player profile:', error);
  }
}

// Load player stats - User-specific
async function loadPlayerStats(uid) {
  try {
    const statsDoc = await db
      .collection(COLLECTIONS.PLAYER_STATS)
      .doc(uid)
      .get();
    if (statsDoc.exists) {
      const stats = statsDoc.data();
      playerPortalState.playerData.stats = stats;
      updateStatsDisplay(stats);
    } else {
      // Create default stats for new player
      await createDefaultPlayerStats(uid);
    }
  } catch (error) {
    console.error('Error loading player stats:', error);
  }
}

// Create default player stats
async function createDefaultPlayerStats(uid) {
  const defaultStats = {
    ppg: 0,
    rpg: 0,
    apg: 0,
    fgPercentage: 0,
    overallRating: 50,
    gamesPlayed: 0,
    avgGrade: 'N/A',
    profileViews: 0,
    scoutInterest: 0,
    fanFollowing: 0,
    seasonStats: {
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      fieldGoalsMade: 0,
      fieldGoalsAttempted: 0,
      threePointsMade: 0,
      threePointsAttempted: 0,
      freeThrowsMade: 0,
      freeThrowsAttempted: 0,
    },
    performanceHistory: [],
    skillRatings: {
      shooting: 50,
      defense: 50,
      passing: 50,
      rebounding: 50,
      speed: 50,
      courtVision: 50,
    },
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  await db.collection(COLLECTIONS.PLAYER_STATS).doc(uid).set(defaultStats);
  playerPortalState.playerData.stats = defaultStats;
  updateStatsDisplay(defaultStats);
}

// Load player games - User-specific
async function loadPlayerGames(uid) {
  try {
    const gamesQuery = await db
      .collection(COLLECTIONS.PLAYER_GAMES)
      .where('playerId', '==', uid)
      .orderBy('gameDate', 'desc')
      .limit(20)
      .get();

    const games = [];
    gamesQuery.forEach(doc => {
      games.push({ id: doc.id, ...doc.data() });
    });

    playerPortalState.playerData.games = games;
    updateGameHistory(games);
  } catch (error) {
    console.error('Error loading player games:', error);
  }
}

// Load player highlights - User-specific
async function loadPlayerHighlights(uid) {
  try {
    const highlightsQuery = await db
      .collection(COLLECTIONS.PLAYER_HIGHLIGHTS)
      .where('playerId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();

    const highlights = [];
    highlightsQuery.forEach(doc => {
      highlights.push({ id: doc.id, ...doc.data() });
    });

    playerPortalState.playerData.highlights = highlights;
  } catch (error) {
    console.error('Error loading player highlights:', error);
  }
}

// Load player classes - User-specific
async function loadPlayerClasses(uid) {
  try {
    const classesQuery = await db
      .collection(COLLECTIONS.PLAYER_CLASSES)
      .where('playerId', '==', uid)
      .get();

    const classes = [];
    classesQuery.forEach(doc => {
      classes.push({ id: doc.id, ...doc.data() });
    });

    playerPortalState.playerData.classes = classes;
  } catch (error) {
    console.error('Error loading player classes:', error);
  }
}

// Load player heatmaps - User-specific
async function loadPlayerHeatmaps(uid) {
  try {
    const heatmapDoc = await db
      .collection(COLLECTIONS.PLAYER_HEATMAPS)
      .doc(uid)
      .get();
    if (heatmapDoc.exists) {
      playerPortalState.playerData.heatmaps = heatmapDoc.data();
    } else {
      // Create default heatmap data
      await createDefaultHeatmaps(uid);
    }
  } catch (error) {
    console.error('Error loading player heatmaps:', error);
  }
}

// Create default heatmaps
async function createDefaultHeatmaps(uid) {
  const defaultHeatmaps = {
    shotChart: {
      zones: [],
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
    },
    movementChart: {
      zones: [],
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
    },
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  await db
    .collection(COLLECTIONS.PLAYER_HEATMAPS)
    .doc(uid)
    .set(defaultHeatmaps);
  playerPortalState.playerData.heatmaps = defaultHeatmaps;
}

// Load AI chat history - User-specific
async function loadAIChatHistory(uid) {
  try {
    const chatQuery = await db
      .collection(COLLECTIONS.AI_CHAT_HISTORY)
      .where('playerId', '==', uid)
      .orderBy('timestamp', 'asc')
      .limit(50)
      .get();

    const messages = [];
    chatQuery.forEach(doc => {
      messages.push({ id: doc.id, ...doc.data() });
    });

    playerPortalState.aiChatMessages = messages;
  } catch (error) {
    console.error('Error loading AI chat history:', error);
  }
}

// Load public profile settings - User-specific
async function loadPublicProfileSettings(uid) {
  try {
    const profileDoc = await db
      .collection(COLLECTIONS.PUBLIC_PROFILES)
      .doc(uid)
      .get();
    if (profileDoc.exists) {
      const settings = profileDoc.data();
      playerPortalState.publicProfileEnabled = settings.enabled;
      updatePublicProfileToggle(settings.enabled);
    }
  } catch (error) {
    console.error('Error loading public profile settings:', error);
  }
}

// Save player stats - User-specific
async function savePlayerStats(uid, stats) {
  try {
    await db
      .collection(COLLECTIONS.PLAYER_STATS)
      .doc(uid)
      .update({
        ...stats,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    console.log('Player stats saved successfully');
  } catch (error) {
    console.error('Error saving player stats:', error);
  }
}

// Save player highlight - User-specific
async function savePlayerHighlight(uid, highlight) {
  try {
    await db.collection(COLLECTIONS.PLAYER_HIGHLIGHTS).add({
      ...highlight,
      playerId: uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    console.log('Player highlight saved successfully');
  } catch (error) {
    console.error('Error saving player highlight:', error);
  }
}

// Save AI chat message - User-specific
async function saveAIChatMessage(uid, message) {
  try {
    await db.collection(COLLECTIONS.AI_CHAT_HISTORY).add({
      ...message,
      playerId: uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    console.log('AI chat message saved successfully');
  } catch (error) {
    console.error('Error saving AI chat message:', error);
  }
}

// Update public profile settings - User-specific
async function updatePublicProfileSettings(uid, enabled) {
  try {
    await db.collection(COLLECTIONS.PUBLIC_PROFILES).doc(uid).set(
      {
        enabled,
        playerId: uid,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    playerPortalState.publicProfileEnabled = enabled;
    console.log('Public profile settings updated successfully');
  } catch (error) {
    console.error('Error updating public profile settings:', error);
  }
}

// Utility function to ensure user is authenticated before data operations
function ensureAuthenticated() {
  if (!playerPortalState.currentUser) {
    console.error('User not authenticated');
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

// Enhanced edit profile function with user validation
async function editProfile() {
  if (!ensureAuthenticated()) return;

  const uid = playerPortalState.currentUser.uid;
  showNotification('Profile editor opening...', 'info');
  console.log('Editing profile for user:', uid);
  // TODO: Implement profile editing modal
}

// Enhanced upload highlight function with user validation
async function uploadHighlight() {
  if (!ensureAuthenticated()) return;

  const uid = playerPortalState.currentUser.uid;
  // Implementation for uploading highlight
  console.log('Uploading highlight for user:', uid);
}

// Enhanced toggle public profile function with user validation
async function togglePublicProfileEnhanced() {
  if (!ensureAuthenticated()) return;

  const uid = playerPortalState.currentUser.uid;
  const newState = !playerPortalState.publicProfileEnabled;

  await updatePublicProfileSettings(uid, newState);
  updatePublicProfileToggle(newState);
}

// Enhanced send message function with user validation
async function sendMessage() {
  if (!ensureAuthenticated()) return;

  const uid = playerPortalState.currentUser.uid;
  const input = elements.aiChatInput;
  const message = input.value.trim();

  if (message) {
    // Save user message
    await saveAIChatMessage(uid, {
      type: 'user',
      content: message,
    });

    // Add to UI
    addAIChatMessage('user', message);

    // Clear input
    input.value = '';

    // Simulate AI response (in real app, this would call AI service)
    setTimeout(async () => {
      const aiResponse = generateAIResponse(message);
      await saveAIChatMessage(uid, {
        type: 'ai',
        content: aiResponse,
      });
      addAIChatMessage('ai', aiResponse);
    }, 1000);
  }
}

// Generate AI response
function generateAIResponse(userMessage) {
  const responses = {
    shooting:
      "Great question about shooting! Focus on your follow-through and arc. I recommend practicing the BEEF technique: Balance, Eyes, Elbow, Follow-through. Based on your stats, you're shooting 52.4% from the field, which is solid. Let's work on increasing your 3-point percentage.",
    defense:
      'Defense wins championships! Your steal average is good at 2.1 per game. Work on staying low, moving your feet, and anticipating passes. Practice slide steps and closeouts daily.',
    passing:
      'Your 7.3 assists per game shows great court vision! To improve further, work on no-look passes and reading defenses. Practice with both hands and vary your passing speeds.',
    training:
      "Based on your profile, I recommend focusing on: 1) Ball handling drills 2) Shooting consistency 3) Defensive positioning. You're enrolled in some great classes - keep up the progress!",
    stats:
      'Your current stats show strong performance: 15.8 PPG, 4.1 RPG, 7.3 APG. Your B+ average grade indicates consistent play. Areas for improvement: reduce turnovers and increase shooting efficiency.',
    default:
      "I'm here to help with any basketball-related questions! I can analyze your performance, suggest drills, discuss strategy, or help with specific skills. What aspect of your game would you like to focus on?",
  };

  const lowerMessage = userMessage.toLowerCase();

  for (const [keyword, response] of Object.entries(responses)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }

  return responses.default;
}

// Generate resume
function generateResume() {
  if (!elements.resumePreview) return;

  const playerData = playerPortalState.playerData || {
    name: 'Marcus Johnson',
    position: 'Point Guard',
    height: '6\'2"',
    weight: '185 lbs',
    school: 'Lincoln High School',
    stats: {
      ppg: 15.8,
      rpg: 4.1,
      apg: 7.3,
      fgPercentage: 52.4,
    },
  };

  elements.resumePreview.innerHTML = `
    <div class="resume-header">
      <h2 class="resume-name">${playerData.name}</h2>
      <div class="resume-position">${playerData.position}</div>
      <div class="resume-contact">
        <span>📱 (555) 123-4567</span>
        <span>📧 ${playerData.name.toLowerCase().replace(' ', '.')}@email.com</span>
        <span>📍 Sacramento, CA</span>
      </div>
    </div>

    <div class="resume-section">
      <h3>Physical Stats</h3>
      <div class="resume-item">
        <p><strong>Height:</strong> ${playerData.height} | <strong>Weight:</strong> ${playerData.weight}</p>
        <p><strong>Position:</strong> ${playerData.position}</p>
        <p><strong>School:</strong> ${playerData.school}</p>
      </div>
    </div>

    <div class="resume-section">
      <h3>Season Statistics</h3>
      <div class="resume-item">
        <div class="resume-item-description">
          <strong>Points per Game:</strong> ${playerData.stats.ppg}<br>
          <strong>Rebounds per Game:</strong> ${playerData.stats.rpg}<br>
          <strong>Assists per Game:</strong> ${playerData.stats.apg}<br>
          <strong>Field Goal Percentage:</strong> ${playerData.stats.fgPercentage}%
        </div>
      </div>
    </div>

    <div class="resume-section">
      <h3>Achievements</h3>
      <div class="resume-item">
        <h4>Team Captain</h4>
        <div class="resume-item-meta">Lincoln High School | 2024-2025</div>
        <div class="resume-item-description">
          Led team to regional championship with outstanding leadership and performance
        </div>
      </div>
      <div class="resume-item">
        <h4>All-Conference First Team</h4>
        <div class="resume-item-meta">Sacramento Conference | 2024</div>
        <div class="resume-item-description">
          Selected for exceptional play and sportsmanship throughout the season
        </div>
      </div>
    </div>

    <div class="resume-section">
      <h3>Skills</h3>
      <div class="resume-item">
        <div class="resume-item-description">
          <strong>Strengths:</strong> Court vision, leadership, three-point shooting, defensive awareness<br>
          <strong>Training Focus:</strong> Ball handling, post moves, free throw consistency
        </div>
      </div>
    </div>

    <div class="resume-section">
      <h3>Academic Information</h3>
      <div class="resume-item">
        <h4>Lincoln High School</h4>
        <div class="resume-item-meta">Class of 2025 | GPA: 3.8</div>
        <div class="resume-item-description">
          Honor Roll student with strong academic performance alongside athletic excellence
        </div>
      </div>
    </div>
  `;
}

// Load public profile data
function loadPublicProfileData() {
  // Update public profile visibility toggle
  const toggle = document.getElementById('publicToggle');
  if (toggle) {
    if (playerPortalState.publicProfileEnabled) {
      toggle.classList.add('active');
    } else {
      toggle.classList.remove('active');
    }
  }
}

// Toggle public profile visibility - Enhanced
function togglePublicProfile() {
  if (!ensureAuthenticated()) return;

  const uid = playerPortalState.currentUser.uid;
  const newState = !playerPortalState.publicProfileEnabled;

  // Update in database
  updatePublicProfileSettings(uid, newState);

  // Update UI
  const toggle = document.getElementById('publicToggle');
  if (toggle) {
    toggle.classList.toggle('active');
  }

  // Show notification
  const message = newState
    ? 'Public profile enabled - scouts and fans can now view your profile'
    : 'Public profile disabled - your profile is now private';

  showNotification(message, 'info');
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'info' ? '#00b4d8' : '#f59e0b'};
    color: white;
    border-radius: 8px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Utility functions
// Note: editProfile is already defined above with enhanced user validation

function exportStats() {
  showNotification('Exporting statistics...', 'info');
  // TODO: Implement stats export functionality
}

// Note: uploadHighlight is already defined above with enhanced user validation

function browseClasses() {
  showNotification('Opening class browser...', 'info');
  // TODO: Implement class browser
}

function openClass(classId) {
  showNotification(`Opening class ${classId}...`, 'info');
  // TODO: Implement class viewer
}

function clearChat() {
  playerPortalState.aiChatMessages = [];
  initializeAIChat();
  showNotification('Chat cleared', 'info');
}

function downloadResume() {
  showNotification('Downloading resume as PDF...', 'info');
  // TODO: Implement PDF generation
}

function editResume() {
  showNotification('Resume editor opening...', 'info');
  // TODO: Implement resume editor
}

function previewPublicProfile() {
  showNotification('Opening public profile preview...', 'info');
  // TODO: Implement public profile preview
}

// Export functions for global access
window.editProfile = editProfile;
window.exportStats = exportStats;
window.uploadHighlight = uploadHighlight;
window.browseClasses = browseClasses;
window.openClass = openClass;
window.clearChat = clearChat;
window.downloadResume = downloadResume;
window.editResume = editResume;
window.previewPublicProfile = previewPublicProfile;
window.sendMessage = sendMessage;
window.togglePublicProfile = togglePublicProfile;
window.toggleHeatmapView = toggleHeatmapView;
