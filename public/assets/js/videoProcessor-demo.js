/**
 * 🎬 Video Processing Module for 3 Ball Network (Demo Version)
 *
 * Handles video upload, processing, thumbnail generation, and streaming
 * Uses demo Firebase configuration for testing
 */

import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  getMetadata,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js';

import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

// Try to import demo config first, fallback to original
let storage, db;
try {
  const demoConfig = await import('./firebaseConfig-demo.js');
  storage = demoConfig.storage;
  db = demoConfig.db;
  console.log('🎬 Video Processor using demo Firebase config');
} catch (error) {
  const config = await import('./firebaseConfig.js');
  storage = config.storage;
  db = config.db;
  console.log('🎬 Video Processor using production Firebase config');
}

class VideoProcessor {
  constructor() {
    this.maxFileSize = 500 * 1024 * 1024; // 500MB
    this.allowedFormats = ['mp4', 'mov', 'avi', 'webm'];
    this.compressionQuality = 0.8;
    this.thumbnailSize = { width: 320, height: 180 };
    this.processingQueue = new Map();
    this.demoMode = true; // Enable demo mode for testing

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeCanvas();
    console.log('🎬 Video Processor initialized (Demo Mode)');
  }

  setupEventListeners() {
    // Global video upload handlers
    document.addEventListener('change', e => {
      if (e.target.type === 'file' && e.target.accept?.includes('video')) {
        this.handleVideoUpload(e);
      }
    });

    // Drag and drop support
    document.addEventListener('dragover', e => {
      e.preventDefault();
    });

    document.addEventListener('drop', e => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter(file =>
        file.type.startsWith('video/')
      );
      if (files.length > 0) {
        this.processMultipleVideos(files);
      }
    });
  }

  initializeCanvas() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style.display = 'none';
    document.body.appendChild(this.canvas);
  }

  /**
   * Handle video file upload with validation
   */
  async handleVideoUpload(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    try {
      await this.processMultipleVideos(files);
    } catch (error) {
      console.error('Video upload error:', error);
      this.showError('Failed to upload video: ' + error.message);
    }
  }

  /**
   * Process multiple video files
   */
  async processMultipleVideos(files) {
    for (const file of files) {
      if (this.validateVideoFile(file)) {
        await this.processVideo(file);
      }
    }
  }

  /**
   * Validate video file
   */
  validateVideoFile(file) {
    // Check file size
    if (file.size > this.maxFileSize) {
      this.showError(
        `File ${file.name} is too large. Maximum size: ${this.maxFileSize / (1024 * 1024)}MB`
      );
      return false;
    }

    // Check file format
    const extension = file.name.split('.').pop().toLowerCase();
    if (!this.allowedFormats.includes(extension)) {
      this.showError(
        `File ${file.name} has unsupported format. Allowed: ${this.allowedFormats.join(', ')}`
      );
      return false;
    }

    return true;
  }

  /**
   * Main video processing function (Demo Mode)
   */
  async processVideo(file) {
    const videoId = this.generateVideoId();
    const userId = this.getCurrentUserId();

    this.showProgress(`Processing ${file.name}... (Demo Mode)`, 0);

    try {
      // 1. Create video element for processing
      const video = await this.createVideoElement(file);

      // 2. Extract metadata
      const metadata = await this.extractVideoMetadata(video, file);

      // 3. Generate thumbnail
      const thumbnail = await this.generateThumbnail(video);

      // 4. In demo mode, simulate upload
      const uploadResult = await this.simulateUpload(
        file,
        thumbnail,
        videoId,
        userId
      );

      // 5. Save to demo storage (localStorage)
      await this.saveDemoVideoRecord(videoId, userId, metadata, uploadResult);

      // 6. Update UI
      this.onVideoProcessed(videoId, uploadResult);

      this.showSuccess(
        `Video ${file.name} processed successfully! (Demo Mode - not actually uploaded)`
      );
    } catch (error) {
      console.error('Video processing error:', error);
      this.showError(`Failed to process ${file.name}: ${error.message}`);
    } finally {
      this.processingQueue.delete(videoId);
    }
  }

  /**
   * Create video element from file
   */
  createVideoElement(file) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;

      video.onloadedmetadata = () => resolve(video);
      video.onerror = () => reject(new Error('Failed to load video'));

      video.src = URL.createObjectURL(file);
    });
  }

  /**
   * Extract video metadata
   */
  async extractVideoMetadata(video, file) {
    return {
      duration: video.duration,
      width: video.videoWidth,
      height: video.videoHeight,
      aspectRatio: video.videoWidth / video.videoHeight,
      fileSize: file.size,
      fileName: file.name,
      mimeType: file.type,
      fps: await this.estimateFPS(video),
      bitrate: Math.round((file.size * 8) / video.duration), // Estimate bitrate
    };
  }

  /**
   * Estimate video FPS
   */
  async estimateFPS(video) {
    return 30; // Default assumption
  }

  /**
   * Generate video thumbnail
   */
  async generateThumbnail(video) {
    return new Promise(resolve => {
      // Set canvas size
      this.canvas.width = this.thumbnailSize.width;
      this.canvas.height = this.thumbnailSize.height;

      // Seek to middle of video for thumbnail
      video.currentTime = video.duration / 2;

      video.onseeked = () => {
        // Draw video frame to canvas
        this.ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);

        // Convert to blob
        this.canvas.toBlob(
          blob => {
            resolve(blob);
          },
          'image/jpeg',
          0.9
        );
      };
    });
  }

  /**
   * Simulate upload for demo mode
   */
  async simulateUpload(videoFile, thumbnailBlob, videoId, userId) {
    return new Promise(resolve => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          clearInterval(interval);
          this.showProgress('Upload complete (Demo)', 100);

          // Create object URLs for demo
          const videoUrl = URL.createObjectURL(videoFile);
          const thumbnailUrl = URL.createObjectURL(thumbnailBlob);

          resolve({
            videoUrl,
            thumbnailUrl,
            videoPath: `demo/videos/${userId}/${videoId}/video.${this.getFileExtension(videoFile.name)}`,
            thumbnailPath: `demo/videos/${userId}/${videoId}/thumbnail.jpg`,
          });
        } else {
          this.showProgress(
            `Uploading video... ${Math.round(progress)}% (Demo)`,
            progress
          );
        }
      }, 200);
    });
  }

  /**
   * Save video record to demo storage (localStorage)
   */
  async saveDemoVideoRecord(videoId, userId, metadata, uploadResult) {
    const videoData = {
      id: videoId,
      userId,
      title: metadata.fileName.replace(/\.[^/.]+$/, ''), // Remove extension
      description: '',
      metadata,
      urls: uploadResult,
      status: 'processed',
      visibility: 'private',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      isHighlight: false,
      gameId: null,
      playerId: userId,
      demoMode: true,
    };

    // Save to localStorage for demo
    const existingVideos = JSON.parse(
      localStorage.getItem('demoVideos') || '[]'
    );
    existingVideos.push(videoData);
    localStorage.setItem('demoVideos', JSON.stringify(existingVideos));

    console.log('💾 Video saved to demo storage:', videoData);
    return videoData;
  }

  /**
   * Get demo videos from localStorage
   */
  async getDemoVideos(userId = null) {
    const videos = JSON.parse(localStorage.getItem('demoVideos') || '[]');
    if (userId) {
      return videos.filter(video => video.userId === userId);
    }
    return videos;
  }

  /**
   * Create video player with custom controls
   */
  createVideoPlayer(videoId, container, options = {}) {
    const playerHTML = `
      <div class="video-player-container" data-video-id="${videoId}">
        <video class="video-player" controls ${options.autoplay ? 'autoplay' : ''} 
               ${options.muted ? 'muted' : ''}>
          <source src="" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <div class="video-controls-overlay">
          <button class="control-btn play-pause">⏯️</button>
          <button class="control-btn fullscreen">⛶</button>
          <button class="control-btn speed" data-speed="1">1x</button>
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <div class="time-display">
            <span class="current-time">0:00</span> / 
            <span class="total-time">0:00</span>
          </div>
        </div>
        <div class="video-overlay-controls">
          <button class="overlay-btn" data-action="mark-moment">📌 Mark</button>
          <button class="overlay-btn" data-action="create-clip">✂️ Clip</button>
          <button class="overlay-btn" data-action="share">🔗 Share</button>
        </div>
        <div class="demo-notice">
          🎯 Demo Mode: Video is stored locally and will not persist
        </div>
      </div>
    `;

    container.innerHTML = playerHTML;
    this.initializePlayerControls(container, videoId);
    this.loadVideoIntoPlayer(container, videoId);
  }

  /**
   * Initialize player controls
   */
  initializePlayerControls(container, videoId) {
    const video = container.querySelector('.video-player');
    const playPauseBtn = container.querySelector('.play-pause');
    const fullscreenBtn = container.querySelector('.fullscreen');
    const speedBtn = container.querySelector('.speed');
    const progressBar = container.querySelector('.progress-bar');
    const progressFill = container.querySelector('.progress-fill');

    // Play/Pause
    playPauseBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        playPauseBtn.textContent = '⏸️';
      } else {
        video.pause();
        playPauseBtn.textContent = '▶️';
      }
    });

    // Fullscreen
    fullscreenBtn.addEventListener('click', () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    });

    // Speed control
    speedBtn.addEventListener('click', () => {
      const speeds = [0.5, 1, 1.25, 1.5, 2];
      const currentSpeed = parseFloat(speedBtn.dataset.speed);
      const nextSpeedIndex = (speeds.indexOf(currentSpeed) + 1) % speeds.length;
      const nextSpeed = speeds[nextSpeedIndex];

      video.playbackRate = nextSpeed;
      speedBtn.dataset.speed = nextSpeed;
      speedBtn.textContent = `${nextSpeed}x`;
    });

    // Progress bar
    video.addEventListener('timeupdate', () => {
      const progress = (video.currentTime / video.duration) * 100;
      progressFill.style.width = `${progress}%`;

      container.querySelector('.current-time').textContent = this.formatTime(
        video.currentTime
      );
      container.querySelector('.total-time').textContent = this.formatTime(
        video.duration
      );
    });

    progressBar.addEventListener('click', e => {
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      video.currentTime = pos * video.duration;
    });

    // Overlay controls
    container.querySelectorAll('.overlay-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const action = e.target.dataset.action;
        this.handleOverlayAction(action, videoId, video.currentTime);
      });
    });
  }

  /**
   * Load video into player (demo mode)
   */
  async loadVideoIntoPlayer(container, videoId) {
    try {
      const video = container.querySelector('.video-player');
      const videos = await this.getDemoVideos();
      const videoData = videos.find(v => v.id === videoId);

      if (videoData) {
        video.src = videoData.urls.videoUrl;
      } else {
        throw new Error('Demo video not found');
      }
    } catch (error) {
      console.error('Error loading demo video:', error);
      container.innerHTML =
        '<div class="video-error">Failed to load demo video</div>';
    }
  }

  /**
   * Handle overlay control actions
   */
  handleOverlayAction(action, videoId, currentTime) {
    switch (action) {
      case 'mark-moment':
        this.markMoment(videoId, currentTime);
        break;
      case 'create-clip':
        this.openClipCreator(videoId, currentTime);
        break;
      case 'share':
        this.shareVideo(videoId, currentTime);
        break;
    }
  }

  /**
   * Mark important moment in video (demo mode)
   */
  async markMoment(videoId, timestamp) {
    try {
      const userId = this.getCurrentUserId();
      const markData = {
        videoId,
        userId,
        timestamp,
        note: prompt('Add a note for this moment:') || '',
        createdAt: new Date().toISOString(),
      };

      const marks = JSON.parse(localStorage.getItem('demoVideoMarks') || '[]');
      marks.push(markData);
      localStorage.setItem('demoVideoMarks', JSON.stringify(marks));

      this.showSuccess('Moment marked successfully! (Demo Mode)');
    } catch (error) {
      console.error('Error marking moment:', error);
      this.showError('Failed to mark moment');
    }
  }

  /**
   * Open clip creator dialog
   */
  openClipCreator(videoId, startTime) {
    const modal = document.createElement('div');
    modal.className = 'clip-creator-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Create Highlight Clip (Demo Mode)</h3>
        <div class="form-group">
          <label>Start Time (seconds):</label>
          <input type="number" id="clipStart" value="${Math.max(0, startTime - 5)}" min="0" step="0.1">
        </div>
        <div class="form-group">
          <label>End Time (seconds):</label>
          <input type="number" id="clipEnd" value="${startTime + 10}" min="0" step="0.1">
        </div>
        <div class="form-group">
          <label>Title:</label>
          <input type="text" id="clipTitle" placeholder="Enter clip title">
        </div>
        <div class="modal-actions">
          <button id="createClip">Create Demo Clip</button>
          <button id="cancelClip">Cancel</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Handle actions
    modal.querySelector('#createClip').addEventListener('click', async () => {
      const start = parseFloat(modal.querySelector('#clipStart').value);
      const end = parseFloat(modal.querySelector('#clipEnd').value);
      const title = modal.querySelector('#clipTitle').value;

      // Create demo highlight
      const highlightData = {
        id: this.generateVideoId(),
        originalVideoId: videoId,
        title: title || 'Demo Highlight',
        startTime: start,
        endTime: end,
        duration: end - start,
        createdAt: new Date().toISOString(),
        demoMode: true,
      };

      const highlights = JSON.parse(
        localStorage.getItem('demoHighlights') || '[]'
      );
      highlights.push(highlightData);
      localStorage.setItem('demoHighlights', JSON.stringify(highlights));

      this.showSuccess('Demo highlight created successfully!');
      document.body.removeChild(modal);
    });

    modal.querySelector('#cancelClip').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  }

  /**
   * Share video
   */
  shareVideo(videoId, timestamp = null) {
    const shareUrl = `${window.location.origin}/video/${videoId}${timestamp ? `?t=${Math.round(timestamp)}` : ''}`;

    if (navigator.share) {
      navigator.share({
        title: 'Check out this demo video',
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      this.showSuccess('Demo video link copied to clipboard!');
    }
  }

  // Utility methods
  generateVideoId() {
    return (
      'demo_video_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    );
  }

  getCurrentUserId() {
    return localStorage.getItem('userId') || 'demo-user';
  }

  getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  showProgress(message, percent) {
    console.log(`📊 ${message} (${percent}%)`);
    // Update any progress UI elements
    const progressElements = document.querySelectorAll('.upload-progress');
    progressElements.forEach(el => {
      el.textContent = `${message} ${Math.round(percent)}%`;
      const bar = el.querySelector('.progress-bar');
      if (bar) bar.style.width = `${percent}%`;
    });
  }

  showSuccess(message) {
    console.log(`✅ ${message}`);
    // Show temporary success message
    const notification = document.createElement('div');
    notification.className = 'demo-notification success';
    notification.textContent = message;
    notification.style.cssText =
      'position:fixed;top:20px;right:20px;background:#28a745;color:white;padding:12px;border-radius:4px;z-index:10000;';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  showError(message) {
    console.error(`❌ ${message}`);
    // Show temporary error message
    const notification = document.createElement('div');
    notification.className = 'demo-notification error';
    notification.textContent = message;
    notification.style.cssText =
      'position:fixed;top:20px;right:20px;background:#dc3545;color:white;padding:12px;border-radius:4px;z-index:10000;';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
  }

  onVideoProcessed(videoId, uploadResult) {
    // Trigger custom event for UI updates
    window.dispatchEvent(
      new CustomEvent('videoProcessed', {
        detail: { videoId, uploadResult, demoMode: true },
      })
    );
  }
}

// Initialize video processor
const videoProcessor = new VideoProcessor();

// Export for global use
window.VideoProcessor = VideoProcessor;
window.videoProcessor = videoProcessor;

export default VideoProcessor;
