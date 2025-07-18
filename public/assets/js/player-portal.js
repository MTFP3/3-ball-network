// Player Portal JavaScript - Enhanced for User-Specific Data with Comprehensive Feedback
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

// UI Feedback System
const UIFeedback = {
  // Show/hide loading overlay
  showLoading: function (message = 'Loading...') {
    const overlay = document.getElementById('loadingOverlay');
    const messageEl = document.getElementById('loadingMessage');
    if (overlay && messageEl) {
      messageEl.textContent = message;
      overlay.style.display = 'flex';
    }
  },

  hideLoading: function () {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  },

  // Update authentication status
  updateAuthStatus: function (status, message, user = null) {
    const dashboard = document.getElementById('authStatusDashboard');
    const statusIcon = document.getElementById('authStatusIcon');
    const statusText = document.getElementById('authStatusText');
    const userInfo = document.getElementById('userInfoDisplay');

    if (!dashboard || !statusIcon || !statusText) return;

    // Show the dashboard
    dashboard.style.display = 'block';

    // Update status icon
    switch (status) {
      case 'success':
        statusIcon.style.background = '#28a745';
        statusIcon.style.animation = 'none';
        break;
      case 'loading':
        statusIcon.style.background = '#17a2b8';
        statusIcon.style.animation = 'pulse 2s infinite';
        break;
      case 'error':
        statusIcon.style.background = '#dc3545';
        statusIcon.style.animation = 'pulse 2s infinite';
        break;
      case 'warning':
        statusIcon.style.background = '#ffc107';
        statusIcon.style.animation = 'pulse 2s infinite';
        break;
    }

    // Update status text
    statusText.textContent = message;

    // Update user info if provided
    if (user && userInfo) {
      userInfo.innerHTML = `
        <div style="margin-bottom: 5px;"><strong>User:</strong> ${user.email}</div>
        <div style="margin-bottom: 5px;"><strong>UID:</strong> ${user.uid.substring(0, 8)}...</div>
        <div><strong>Role:</strong> ${user.role || 'Loading...'}</div>
      `;
      userInfo.style.display = 'block';
    } else if (userInfo) {
      userInfo.style.display = 'none';
    }
  },

  // Show message notifications
  showMessage: function (message, type = 'info', duration = 5000) {
    const container = document.getElementById('messageContainer');
    if (!container) return;

    const messageEl = document.createElement('div');
    messageEl.className = `message-item message-${type}`;
    messageEl.textContent = message;

    container.appendChild(messageEl);

    // Auto-remove after duration
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.parentNode.removeChild(messageEl);
      }
    }, duration);
  },

  // Hide auth status dashboard
  hideAuthStatus: function () {
    const dashboard = document.getElementById('authStatusDashboard');
    if (dashboard) {
      dashboard.style.display = 'none';
    }
  },
};

// Initialize UI feedback controls
document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.getElementById('toggleStatus');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      UIFeedback.hideAuthStatus();
    });
  }
});

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
  console.log('Player Portal initializing...');
  UIFeedback.updateAuthStatus('loading', 'Initializing player portal...');
  UIFeedback.showLoading('Checking authentication...');
  initializeApp();
  setupEventListeners();
});

// Enhanced Authentication State Handler with Comprehensive Feedback
auth.onAuthStateChanged(async function (user) {
  try {
    if (user) {
      console.log('✅ User authenticated:', user.uid);
      UIFeedback.updateAuthStatus(
        'loading',
        'User authenticated, verifying player role...',
        user
      );
      UIFeedback.showLoading('Verifying your player account...');

      playerPortalState.currentUser = user;

      // Verify user is a player with detailed feedback
      try {
        const userDoc = await db
          .collection(COLLECTIONS.USERS)
          .doc(user.uid)
          .get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          console.log('📋 User data loaded:', userData);

          if (userData.role === 'player') {
            console.log('✅ Player role verified');
            UIFeedback.updateAuthStatus(
              'success',
              'Player account verified! Loading your profile...',
              {
                ...user,
                role: userData.role,
              }
            );
            UIFeedback.showMessage('Welcome to your player portal!', 'success');

            // Load player profile and data
            UIFeedback.showLoading('Loading your player profile...');
            await loadPlayerProfile(user.uid);

            UIFeedback.showLoading('Loading your stats and game data...');
            await initializeUserData(user.uid);

            playerPortalState.userDataLoaded = true;
            UIFeedback.hideLoading();
            UIFeedback.updateAuthStatus(
              'success',
              `Welcome ${userData.name || user.email}! Your player data is ready.`,
              {
                ...user,
                role: userData.role,
              }
            );
            UIFeedback.showMessage(
              'All your player data has been loaded successfully!',
              'success'
            );
          } else {
            console.error(
              '❌ Access denied: User role is not "player":',
              userData.role
            );
            UIFeedback.updateAuthStatus(
              'error',
              `Access denied: Account role is "${userData.role}", not "player"`
            );
            UIFeedback.hideLoading();
            UIFeedback.showMessage(
              `This account is registered as "${userData.role}". Player portal access requires "player" role.`,
              'error',
              10000
            );

            // Redirect based on role
            setTimeout(() => {
              switch (userData.role) {
                case 'coach':
                  window.location.href = '/coach.html';
                  break;
                case 'admin':
                  window.location.href = '/admin.html';
                  break;
                case 'fan':
                  window.location.href = '/fan.html';
                  break;
                default:
                  window.location.href = '/login.html';
              }
            }, 3000);
          }
        } else {
          console.error('❌ User document not found in Firestore');
          UIFeedback.updateAuthStatus(
            'error',
            'User profile not found in database'
          );
          UIFeedback.hideLoading();
          UIFeedback.showMessage(
            'Your user profile was not found. Please contact support or try logging in again.',
            'error',
            10000
          );

          setTimeout(() => {
            window.location.href = '/login.html';
          }, 5000);
        }
      } catch (roleError) {
        console.error('❌ Error checking user role:', roleError);
        UIFeedback.updateAuthStatus('error', 'Failed to verify user role');
        UIFeedback.hideLoading();
        UIFeedback.showMessage(
          'Error accessing your account data. Please try refreshing the page.',
          'error',
          8000
        );

        setTimeout(() => {
          window.location.href = '/login.html';
        }, 3000);
      }
    } else {
      console.log('❌ User not authenticated, redirecting to login');
      UIFeedback.updateAuthStatus(
        'error',
        'Not authenticated - redirecting to login...'
      );
      UIFeedback.hideLoading();
      UIFeedback.showMessage(
        'Please log in to access your player portal.',
        'warning',
        3000
      );

      setTimeout(() => {
        window.location.href = '/login.html';
      }, 1000);
    }
  } catch (error) {
    console.error('❌ Authentication error:', error);
    UIFeedback.updateAuthStatus('error', 'Authentication system error');
    UIFeedback.hideLoading();
    UIFeedback.showMessage(
      'Authentication system error. Please try refreshing the page.',
      'error',
      8000
    );
  }
});

// Initialize user-specific data with progress feedback
async function initializeUserData(uid) {
  try {
    console.log('🔄 Initializing user data for:', uid);

    // Load all user-specific data with progress tracking
    const dataPromises = [
      { name: 'Player Stats', fn: loadPlayerStats(uid) },
      { name: 'Game History', fn: loadPlayerGames(uid) },
      { name: 'Highlights', fn: loadPlayerHighlights(uid) },
      { name: 'Classes', fn: loadPlayerClasses(uid) },
      { name: 'Heatmaps', fn: loadPlayerHeatmaps(uid) },
      { name: 'AI Chat History', fn: loadAIChatHistory(uid) },
      { name: 'Profile Settings', fn: loadPublicProfileSettings(uid) },
    ];

    // Load data with individual progress updates
    for (const dataItem of dataPromises) {
      try {
        UIFeedback.showLoading(`Loading ${dataItem.name}...`);
        await dataItem.fn;
        console.log(`✅ ${dataItem.name} loaded successfully`);
      } catch (error) {
        console.error(`❌ Error loading ${dataItem.name}:`, error);
        UIFeedback.showMessage(
          `Warning: Could not load ${dataItem.name}`,
          'warning',
          3000
        );
      }
    }

    // Initialize UI components
    UIFeedback.showLoading('Setting up charts and visualizations...');
    try {
      initializeCharts();
      initializeHeatmaps();
      loadHighlights();
      loadClassModules();
      initializeAIChat();
      generateResume();
      console.log('✅ UI components initialized successfully');
    } catch (uiError) {
      console.error('❌ Error initializing UI components:', uiError);
      UIFeedback.showMessage(
        'Some UI components may not work properly. Try refreshing the page.',
        'warning',
        5000
      );
    }

    console.log('✅ User data initialization completed');
  } catch (error) {
    console.error('❌ Critical error initializing user data:', error);
    UIFeedback.showMessage(
      'Failed to load your player data. Please try refreshing the page.',
      'error',
      8000
    );
    throw error; // Re-throw to handle in parent function
  }
}

// Load player profile from Firebase - User-specific with enhanced feedback
async function loadPlayerProfile(uid) {
  try {
    console.log('🔄 Loading player profile for UID:', uid);
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(uid).get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log('✅ Player profile loaded:', userData.name || userData.email);
      playerPortalState.playerData = userData;
      updatePlayerProfile(userData);
      UIFeedback.showMessage(
        `Profile loaded for ${userData.name || userData.email}`,
        'success',
        3000
      );
    } else {
      console.error('❌ Player profile not found for UID:', uid);
      UIFeedback.showMessage(
        'Player profile not found. Using default profile.',
        'warning',
        5000
      );

      // Set default profile data
      playerPortalState.playerData = {
        name: 'Player',
        email: playerPortalState.currentUser?.email || '',
        position: 'Unknown',
        team: 'No Team',
        uid: uid,
      };
      updatePlayerProfile(playerPortalState.playerData);
    }
  } catch (error) {
    console.error('❌ Error loading player profile:', error);
    UIFeedback.showMessage(
      'Error loading player profile. Some features may not work correctly.',
      'error',
      5000
    );

    // Fallback profile
    playerPortalState.playerData = {
      name: 'Player',
      email: playerPortalState.currentUser?.email || '',
      position: 'Unknown',
      team: 'No Team',
      uid: uid,
    };
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
