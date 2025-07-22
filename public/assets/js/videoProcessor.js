/**
 * 🎬 Video Processing Module for 3 Ball Network
 *
 * Handles video upload, processing, thumbnail generation, and streaming
 * Integrates with Firebase Storage and provides secure video management
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

import { storage, db } from './firebaseConfig.js';

class VideoProcessor {
  constructor() {
    this.maxFileSize = 500 * 1024 * 1024; // 500MB
    this.allowedFormats = ['mp4', 'mov', 'avi', 'webm'];
    this.compressionQuality = 0.8;
    this.thumbnailSize = { width: 320, height: 180 };
    this.processingQueue = new Map();

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeCanvas();
    console.log('🎬 Video Processor initialized');
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
   * Main video processing function
   */
  async processVideo(file) {
    const videoId = this.generateVideoId();
    const userId = this.getCurrentUserId();

    this.showProgress(`Processing ${file.name}...`, 0);

    try {
      // 1. Create video element for processing
      const video = await this.createVideoElement(file);

      // 2. Extract metadata
      const metadata = await this.extractVideoMetadata(video, file);

      // 3. Generate thumbnail
      const thumbnail = await this.generateThumbnail(video);

      // 4. Compress video if needed
      const processedFile = await this.compressVideo(file, video);

      // 5. Upload to Firebase Storage
      const uploadResult = await this.uploadToStorage(
        processedFile,
        thumbnail,
        videoId,
        userId
      );

      // 6. Save to Firestore
      await this.saveVideoRecord(videoId, userId, metadata, uploadResult);

      // 7. Update UI
      this.onVideoProcessed(videoId, uploadResult);

      this.showSuccess(`Video ${file.name} processed successfully!`);
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
    // This is a simple estimation - in production you might use FFmpeg
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
   * Compress video if needed
   */
  async compressVideo(file, video) {
    // For now, return original file
    // In production, you might use FFmpeg.js or WebCodecs API
    if (file.size < 50 * 1024 * 1024) {
      // If less than 50MB, don't compress
      return file;
    }

    // Placeholder for compression logic
    console.log('Video compression would happen here in production');
    return file;
  }

  /**
   * Upload video and thumbnail to Firebase Storage
   */
  async uploadToStorage(videoFile, thumbnailBlob, videoId, userId) {
    const videoPath = `videos/${userId}/${videoId}/video.${this.getFileExtension(videoFile.name)}`;
    const thumbnailPath = `videos/${userId}/${videoId}/thumbnail.jpg`;

    // Upload video
    const videoRef = storageRef(storage, videoPath);
    const videoUpload = uploadBytesResumable(videoRef, videoFile);

    // Upload thumbnail
    const thumbnailRef = storageRef(storage, thumbnailPath);
    const thumbnailUpload = uploadBytesResumable(thumbnailRef, thumbnailBlob);

    // Monitor upload progress
    videoUpload.on(
      'state_changed',
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.showProgress(
          `Uploading video... ${Math.round(progress)}%`,
          progress
        );
      },
      error => {
        throw new Error(`Video upload failed: ${error.message}`);
      }
    );

    // Wait for both uploads to complete
    await Promise.all([videoUpload, thumbnailUpload]);

    // Get download URLs
    const videoUrl = await getDownloadURL(videoRef);
    const thumbnailUrl = await getDownloadURL(thumbnailRef);

    return {
      videoUrl,
      thumbnailUrl,
      videoPath,
      thumbnailPath,
    };
  }

  /**
   * Save video record to Firestore
   */
  async saveVideoRecord(videoId, userId, metadata, uploadResult) {
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
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      views: 0,
      likes: 0,
      isHighlight: false,
      gameId: null,
      playerId: userId,
    };

    // Save to user's video collection
    await setDoc(doc(db, 'videos', videoId), videoData);

    // Also save to user-specific collection for easy querying
    await setDoc(doc(db, 'users', userId, 'videos', videoId), {
      ...videoData,
      localRef: true,
    });

    return videoData;
  }

  /**
   * Create video highlights from longer videos
   */
  async createHighlight(videoId, startTime, endTime, title) {
    try {
      const highlightId = this.generateVideoId();
      const userId = this.getCurrentUserId();

      // Get original video data
      const videoDoc = await doc(db, 'videos', videoId).get();
      if (!videoDoc.exists()) {
        throw new Error('Original video not found');
      }

      const originalVideo = videoDoc.data();

      // Create highlight record
      const highlightData = {
        id: highlightId,
        userId,
        originalVideoId: videoId,
        title: title || `Highlight from ${originalVideo.title}`,
        description: `Highlight clip (${startTime}s - ${endTime}s)`,
        startTime,
        endTime,
        duration: endTime - startTime,
        urls: originalVideo.urls, // Same URLs, different time range
        status: 'processed',
        visibility: 'public',
        isHighlight: true,
        createdAt: serverTimestamp(),
        tags: ['highlight'],
        views: 0,
        likes: 0,
      };

      await setDoc(doc(db, 'highlights', highlightId), highlightData);
      await setDoc(
        doc(db, 'users', userId, 'highlights', highlightId),
        highlightData
      );

      this.showSuccess('Highlight created successfully!');
      return highlightData;
    } catch (error) {
      console.error('Error creating highlight:', error);
      this.showError('Failed to create highlight: ' + error.message);
    }
  }

  /**
   * Delete video and associated files
   */
  async deleteVideo(videoId) {
    try {
      const userId = this.getCurrentUserId();

      // Get video data
      const videoDoc = await doc(db, 'videos', videoId).get();
      if (!videoDoc.exists()) {
        throw new Error('Video not found');
      }

      const videoData = videoDoc.data();

      // Delete files from storage
      if (videoData.urls?.videoPath) {
        await deleteObject(storageRef(storage, videoData.urls.videoPath));
      }
      if (videoData.urls?.thumbnailPath) {
        await deleteObject(storageRef(storage, videoData.urls.thumbnailPath));
      }

      // Delete from Firestore
      await deleteDoc(doc(db, 'videos', videoId));
      await deleteDoc(doc(db, 'users', userId, 'videos', videoId));

      this.showSuccess('Video deleted successfully!');
    } catch (error) {
      console.error('Error deleting video:', error);
      this.showError('Failed to delete video: ' + error.message);
    }
  }

  /**
   * Get video streaming URL with authentication
   */
  async getStreamingUrl(videoId) {
    try {
      const videoDoc = await doc(db, 'videos', videoId).get();
      if (!videoDoc.exists()) {
        throw new Error('Video not found');
      }

      const videoData = videoDoc.data();

      // Increment view count
      await updateDoc(doc(db, 'videos', videoId), {
        views: (videoData.views || 0) + 1,
      });

      return videoData.urls.videoUrl;
    } catch (error) {
      console.error('Error getting streaming URL:', error);
      throw error;
    }
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
   * Load video into player
   */
  async loadVideoIntoPlayer(container, videoId) {
    try {
      const video = container.querySelector('.video-player');
      const streamingUrl = await this.getStreamingUrl(videoId);
      video.src = streamingUrl;
    } catch (error) {
      console.error('Error loading video:', error);
      container.innerHTML =
        '<div class="video-error">Failed to load video</div>';
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
   * Mark important moment in video
   */
  async markMoment(videoId, timestamp) {
    try {
      const userId = this.getCurrentUserId();
      const markData = {
        videoId,
        userId,
        timestamp,
        note: prompt('Add a note for this moment:') || '',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'videoMarks'), markData);
      this.showSuccess('Moment marked successfully!');
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
        <h3>Create Highlight Clip</h3>
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
          <button id="createClip">Create Clip</button>
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

      await this.createHighlight(videoId, start, end, title);
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
        title: 'Check out this video',
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      this.showSuccess('Video link copied to clipboard!');
    }
  }

  // Utility methods
  generateVideoId() {
    return (
      'video_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    );
  }

  getCurrentUserId() {
    // Get from auth context
    return localStorage.getItem('userId') || 'anonymous';
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
    // Implement UI progress indicator
  }

  showSuccess(message) {
    console.log(`✅ ${message}`);
    // Implement success notification
  }

  showError(message) {
    console.error(`❌ ${message}`);
    // Implement error notification
  }

  onVideoProcessed(videoId, uploadResult) {
    // Trigger custom event for UI updates
    window.dispatchEvent(
      new CustomEvent('videoProcessed', {
        detail: { videoId, uploadResult },
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
