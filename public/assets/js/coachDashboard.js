import {
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  query,
  where,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { logAnalyticsEvent } from './analyticsLogger.js';
import { db } from './firebaseConfig.js';
import {
  createGameCard,
  createVideoClip,
  createActionList,
  createScoutingReport,
  clearContainer,
  createLoadingIndicator,
  createErrorMessage,
  createToast,
  createProgressIndicator,
  safeText,
} from './uiComponents.js';
import { DataValidator, ValidationError } from './dataValidator.js';

// Enhanced notification system for better UX
function showNotification(message, type = 'info', duration = 5000) {
  // Create notification container if it doesn't exist
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
    color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
    border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#b6d4db'};
    border-radius: 8px;
    padding: 12px 16px;
    max-width: 350px;
    pointer-events: auto;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    font-size: 14px;
    line-height: 1.4;
  `;

  safeText(notification, message);
  container.appendChild(notification);

  // Animate in
  requestAnimationFrame(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  });

  // Auto remove
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, duration);

  // Click to dismiss
  notification.addEventListener('click', () => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  });
}

// Add CSS for spinner animation and optimistic UI effects
if (!document.getElementById('optimistic-ui-styles')) {
  const style = document.createElement('style');
  style.id = 'optimistic-ui-styles';
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .uploading {
      position: relative;
      overflow: hidden;
    }
    
    .uploading::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,165,0,0.1), transparent);
      animation: shimmer 2s infinite;
    }
    
    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    
    .upload-success {
      transition: all 0.3s ease;
    }
  `;
  document.head.appendChild(style);
}

const coachId = localStorage.getItem('coachId') || 'demoCoach';
const coachTeamName = localStorage.getItem('team') || 'Demo Team';
logAnalyticsEvent('visit', coachId, 'coach');

(async function checkApproval() {
  const ref = doc(db, 'coaches', coachId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const errorMsg = createErrorMessage('Coach profile not found.');
    clearContainer(document.body);
    document.body.appendChild(errorMsg);
    return;
  }
  const data = snap.data();
  if (data.approved === false) {
    const pendingMsg = createLoadingIndicator(
      'Your account is pending admin approval.'
    );
    clearContainer(document.body);
    document.body.appendChild(pendingMsg);
    return;
  }
  loadTeamGames();
})();

async function loadTeamGames() {
  const gameSnap = await getDocs(
    query(collection(db, 'games'), where('teamName', '==', coachTeamName))
  );
  const historyContainer = document.getElementById('teamGameHistory');
  if (!historyContainer) {
    return;
  }
  clearContainer(historyContainer);

  gameSnap.forEach(doc => {
    const game = doc.data();
    const gameId = doc.id;
    const card = createGameCard(gameId, game, {
      onPlayerStats: viewPlayerBreakdowns,
      onHighlights: viewGameHighlights,
    });
    historyContainer.appendChild(card);
  });
}

async function viewGameHighlights(event) {
  const gameId = event.target.dataset.gameId;
  const container = document.getElementById('coachPlayerView');
  if (!container) {
    return;
  }

  clearContainer(container);

  const title = document.createElement('h3');
  title.textContent = `🎬 Highlights for Game: ${gameId}`;
  container.appendChild(title);

  const clipsSnap = await getDocs(collection(db, `games/${gameId}/clips`));
  clipsSnap.forEach(doc => {
    const clip = doc.data();
    const clipElement = createVideoClip(clip, { width: '320' });
    container.appendChild(clipElement);
  });
}

async function viewPlayerBreakdowns(event) {
  const gameId = event.target.dataset.gameId;
  const breakdown =
    document.getElementById('gameBreakdownView') ||
    document.createElement('div');
  breakdown.id = 'gameBreakdownView';

  clearContainer(breakdown);

  const title = document.createElement('h3');
  title.textContent = `🧠 AI Player Tags - ${gameId}`;
  breakdown.appendChild(title);

  const snap = await getDocs(collection(db, `playerStats/${gameId}/plays`));
  const byPlayer = {};

  snap.forEach(doc => {
    const d = doc.data();
    if (!byPlayer[d.playerId]) {
      byPlayer[d.playerId] = [];
    }
    byPlayer[d.playerId].push(d);
  });

  for (const [pid, actions] of Object.entries(byPlayer)) {
    const playerContainer = document.createElement('div');
    playerContainer.classList.add('player-breakdown');

    const actionList = createActionList(actions, { title: pid });
    playerContainer.appendChild(actionList);

    // Check for scouting report
    const rptRef = doc(db, `scoutingReports/${gameId}_${pid}`);
    const rptSnap = await getDoc(rptRef);
    if (rptSnap.exists()) {
      const rpt = rptSnap.data();
      const scoutingReport = createScoutingReport(rpt);
      playerContainer.appendChild(scoutingReport);
    }

    breakdown.appendChild(playerContainer);
  }

  document.body.appendChild(breakdown);
}

const uploadForm = document.getElementById('uploadForm');
if (uploadForm) {
  uploadForm.addEventListener('submit', async e => {
    e.preventDefault();

    // Clear any existing validation errors
    DataValidator.clearValidationErrors(uploadForm);

    // Get form data
    const gameId = document.getElementById('gameId').value.trim();
    const teamName = document.getElementById('teamName').value.trim();
    const opponent = document.getElementById('opponent').value.trim();
    const gameDate = document.getElementById('gameDate').value;
    const videoUrl = document.getElementById('videoUrl').value.trim();

    const gameData = {
      teamName,
      opponent,
      date: gameDate,
      videoUrl,
      uploadedBy: coachTeamName,
      analysisStatus: 'pending',
      taggingStatus: 'pending-tagging',
      finalScore: 'TBD',
    };

    // Client-side validation (UX - server validation is authoritative)
    const validationErrors = DataValidator.validateGameData(gameData);

    // Additional custom validations
    if (!gameId) {
      validationErrors.push(
        new ValidationError('gameId', 'Game ID is required')
      );
    }

    // Future date validation
    if (gameDate) {
      const selectedDate = new Date(gameDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        validationErrors.push(
          new ValidationError('gameDate', 'Game date cannot be in the future')
        );
      }
    }

    // Display validation errors if any
    if (validationErrors.length > 0) {
      DataValidator.displayValidationErrors(validationErrors, uploadForm);
      createToast(
        'Please fix the validation errors before submitting',
        'error'
      );
      return;
    }

    // Optimistic UI Update - Show immediate feedback
    const historyContainer = document.getElementById('teamGameHistory');
    if (historyContainer) {
      const tempCard = createGameCard(gameId, gameData, {
        onPlayerStats: viewPlayerBreakdowns,
        onHighlights: viewGameHighlights,
        extraClass: 'pending-upload',
      });

      // Style as pending
      tempCard.style.opacity = '0.7';
      tempCard.style.border = '2px dashed #ffa500';
      tempCard.classList.add('uploading');

      // Add progress indicator
      const progressIndicator = createProgressIndicator();
      progressIndicator.setIndeterminate();
      tempCard.appendChild(progressIndicator);

      // Add to top of list for immediate visibility
      historyContainer.prepend(tempCard);

      // Reset form immediately for better UX
      uploadForm.reset();

      // Disable submit button temporarily
      const submitBtn = uploadForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      safeText(submitBtn, 'Uploading...');

      try {
        const gameRef = doc(db, 'games', gameId);
        await setDoc(gameRef, {
          ...gameData,
          uploadedAt: serverTimestamp(),
        });

        await logAnalyticsEvent('upload', coachId, 'coach');

        // Success - update UI to final state
        tempCard.style.opacity = '1';
        tempCard.style.border = '2px solid #28a745';
        tempCard.classList.remove('uploading');
        tempCard.classList.add('upload-success');

        // Complete progress indicator
        progressIndicator.complete();

        createToast('Game uploaded successfully! 🎉', 'success');

        // Remove success styling after a delay
        setTimeout(() => {
          tempCard.style.border = '';
          tempCard.classList.remove('upload-success');
        }, 3000);
      } catch (error) {
        console.error('Upload failed:', error);

        // On failure, remove the temporary card and show detailed error
        tempCard.remove();

        // Parse Firebase error for user-friendly message
        let errorMessage = 'Game upload failed. ';

        if (error.code === 'permission-denied') {
          errorMessage +=
            'You do not have permission to upload games. Please check your coach status.';
        } else if (error.code === 'failed-precondition') {
          errorMessage +=
            'Data validation failed. Please check all required fields.';
        } else if (error.code === 'unavailable') {
          errorMessage += 'Service temporarily unavailable. Please try again.';
        } else {
          errorMessage += 'Please check your data and try again.';
        }

        createToast(errorMessage, 'error', 7000);
      } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        safeText(submitBtn, originalText);
      }
    }
  });
}
