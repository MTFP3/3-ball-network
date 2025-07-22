/**
 * 🎬 Video Gallery and Management UI
 *
 * Provides UI components for video display, management, and interaction
 */

import VideoProcessor from './videoProcessor.js';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { db } from './firebaseConfig.js';

class VideoGallery {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentUserId = localStorage.getItem('userId');
    this.videos = [];
    this.currentFilter = 'all';
    this.currentSort = 'newest';

    this.init();
  }

  init() {
    this.createGalleryHTML();
    this.setupEventListeners();
    this.loadVideos();
  }

  createGalleryHTML() {
    this.container.innerHTML = `
      <div class="video-gallery">
        <!-- Upload Section -->
        <div class="upload-section">
          <div class="upload-area" id="videoUploadArea">
            <input type="file" id="videoUpload" accept="video/*" multiple style="display: none;">
            <div class="upload-placeholder">
              <div class="upload-icon">🎬</div>
              <h3>Upload Videos</h3>
              <p>Drag & drop video files here or click to select</p>
              <p class="upload-info">Supported: MP4, MOV, AVI, WebM (Max: 500MB)</p>
              <button class="btn-primary" onclick="document.getElementById('videoUpload').click()">
                Select Videos
              </button>
            </div>
          </div>
          <div class="upload-progress" id="uploadProgress" style="display: none;">
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            <div class="progress-text">Uploading...</div>
          </div>
        </div>

        <!-- Controls -->
        <div class="gallery-controls">
          <div class="filter-controls">
            <label>Filter:</label>
            <select id="videoFilter">
              <option value="all">All Videos</option>
              <option value="highlights">Highlights</option>
              <option value="games">Game Footage</option>
              <option value="training">Training Videos</option>
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>
          
          <div class="sort-controls">
            <label>Sort by:</label>
            <select id="videoSort">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="duration">Duration</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>

          <div class="view-controls">
            <button class="view-btn active" data-view="grid">⊞ Grid</button>
            <button class="view-btn" data-view="list">☰ List</button>
          </div>

          <div class="search-controls">
            <input type="text" id="videoSearch" placeholder="Search videos...">
            <button id="searchBtn">🔍</button>
          </div>
        </div>

        <!-- Video Grid -->
        <div class="video-grid" id="videoGrid">
          <div class="loading-videos">
            <div class="spinner"></div>
            <p>Loading videos...</p>
          </div>
        </div>

        <!-- Video Player Modal -->
        <div class="video-modal" id="videoModal" style="display: none;">
          <div class="modal-backdrop"></div>
          <div class="modal-content">
            <div class="modal-header">
              <h3 id="modalVideoTitle">Video Title</h3>
              <button class="close-btn" id="closeModal">×</button>
            </div>
            <div class="modal-body">
              <div id="modalVideoPlayer"></div>
              <div class="video-details">
                <div class="video-info">
                  <p class="video-description" id="modalVideoDescription"></p>
                  <div class="video-stats">
                    <span class="stat">👁️ <span id="modalVideoViews">0</span> views</span>
                    <span class="stat">⏱️ <span id="modalVideoDuration">0:00</span></span>
                    <span class="stat">📅 <span id="modalVideoDate">-</span></span>
                  </div>
                </div>
                <div class="video-actions">
                  <button class="action-btn" id="editVideoBtn">✏️ Edit</button>
                  <button class="action-btn" id="shareVideoBtn">🔗 Share</button>
                  <button class="action-btn" id="downloadVideoBtn">⬇️ Download</button>
                  <button class="action-btn danger" id="deleteVideoBtn">🗑️ Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // Upload handling
    const uploadArea = document.getElementById('videoUploadArea');
    const fileInput = document.getElementById('videoUpload');

    uploadArea.addEventListener('dragover', e => {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', e => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      const files = Array.from(e.dataTransfer.files).filter(f =>
        f.type.startsWith('video/')
      );
      if (files.length > 0) {
        this.handleVideoUpload(files);
      }
    });

    fileInput.addEventListener('change', e => {
      const files = Array.from(e.target.files);
      this.handleVideoUpload(files);
    });

    // Filter and sort controls
    document.getElementById('videoFilter').addEventListener('change', e => {
      this.currentFilter = e.target.value;
      this.filterAndDisplayVideos();
    });

    document.getElementById('videoSort').addEventListener('change', e => {
      this.currentSort = e.target.value;
      this.filterAndDisplayVideos();
    });

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        document
          .querySelectorAll('.view-btn')
          .forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.toggleView(e.target.dataset.view);
      });
    });

    // Search
    document.getElementById('videoSearch').addEventListener('input', e => {
      this.searchVideos(e.target.value);
    });

    // Modal controls
    document.getElementById('closeModal').addEventListener('click', () => {
      this.closeVideoModal();
    });

    // Global video processing events
    window.addEventListener('videoProcessed', e => {
      this.loadVideos(); // Refresh gallery
    });
  }

  async handleVideoUpload(files) {
    const progressContainer = document.getElementById('uploadProgress');
    progressContainer.style.display = 'block';

    for (const file of files) {
      try {
        await window.videoProcessor.processVideo(file);
      } catch (error) {
        console.error('Upload error:', error);
      }
    }

    progressContainer.style.display = 'none';
    this.loadVideos(); // Refresh gallery
  }

  async loadVideos() {
    try {
      let videosQuery = query(
        collection(db, 'videos'),
        where('userId', '==', this.currentUserId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const snapshot = await getDocs(videosQuery);
      this.videos = [];

      snapshot.forEach(doc => {
        this.videos.push({ id: doc.id, ...doc.data() });
      });

      this.filterAndDisplayVideos();
    } catch (error) {
      console.error('Error loading videos:', error);
      this.showError('Failed to load videos');
    }
  }

  filterAndDisplayVideos() {
    let filteredVideos = [...this.videos];

    // Apply filter
    if (this.currentFilter !== 'all') {
      filteredVideos = filteredVideos.filter(video => {
        switch (this.currentFilter) {
          case 'highlights':
            return video.isHighlight;
          case 'games':
            return video.gameId;
          case 'training':
            return video.tags?.includes('training');
          case 'private':
            return video.visibility === 'private';
          case 'public':
            return video.visibility === 'public';
          default:
            return true;
        }
      });
    }

    // Apply sort
    filteredVideos.sort((a, b) => {
      switch (this.currentSort) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'duration':
          return (b.metadata?.duration || 0) - (a.metadata?.duration || 0);
        case 'views':
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

    this.displayVideos(filteredVideos);
  }

  displayVideos(videos) {
    const grid = document.getElementById('videoGrid');

    if (videos.length === 0) {
      grid.innerHTML = `
        <div class="no-videos">
          <div class="no-videos-icon">🎬</div>
          <h3>No videos found</h3>
          <p>Upload your first video to get started!</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = videos.map(video => this.createVideoCard(video)).join('');

    // Add click listeners to video cards
    grid.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', () => {
        const videoId = card.dataset.videoId;
        this.openVideoModal(videoId);
      });
    });
  }

  createVideoCard(video) {
    const duration = this.formatDuration(video.metadata?.duration || 0);
    const uploadDate = this.formatDate(video.createdAt);
    const thumbnailUrl =
      video.urls?.thumbnailUrl || '/assets/images/video-placeholder.jpg';

    return `
      <div class="video-card" data-video-id="${video.id}">
        <div class="video-thumbnail">
          <img src="${thumbnailUrl}" alt="${video.title}" loading="lazy">
          <div class="video-duration">${duration}</div>
          <div class="video-overlay">
            <div class="play-button">▶</div>
          </div>
          ${video.isHighlight ? '<div class="highlight-badge">⭐ Highlight</div>' : ''}
        </div>
        <div class="video-info">
          <h4 class="video-title">${this.escapeHtml(video.title)}</h4>
          <div class="video-meta">
            <span class="views">👁️ ${video.views || 0}</span>
            <span class="date">📅 ${uploadDate}</span>
            <span class="visibility ${video.visibility}">${video.visibility}</span>
          </div>
          <div class="video-actions-quick">
            <button class="quick-action" onclick="event.stopPropagation(); videoGallery.editVideo('${video.id}')">✏️</button>
            <button class="quick-action" onclick="event.stopPropagation(); videoGallery.shareVideo('${video.id}')">🔗</button>
            <button class="quick-action danger" onclick="event.stopPropagation(); videoGallery.deleteVideo('${video.id}')">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }

  async openVideoModal(videoId) {
    const video = this.videos.find(v => v.id === videoId);
    if (!video) return;

    const modal = document.getElementById('videoModal');
    const playerContainer = document.getElementById('modalVideoPlayer');

    // Update modal content
    document.getElementById('modalVideoTitle').textContent = video.title;
    document.getElementById('modalVideoDescription').textContent =
      video.description || 'No description';
    document.getElementById('modalVideoViews').textContent = video.views || 0;
    document.getElementById('modalVideoDuration').textContent =
      this.formatDuration(video.metadata?.duration || 0);
    document.getElementById('modalVideoDate').textContent = this.formatDate(
      video.createdAt
    );

    // Create video player
    window.videoProcessor.createVideoPlayer(videoId, playerContainer, {
      autoplay: false,
      muted: false,
    });

    // Setup modal action buttons
    this.setupModalActions(videoId);

    // Show modal
    modal.style.display = 'flex';
  }

  setupModalActions(videoId) {
    document.getElementById('editVideoBtn').onclick = () =>
      this.editVideo(videoId);
    document.getElementById('shareVideoBtn').onclick = () =>
      this.shareVideo(videoId);
    document.getElementById('downloadVideoBtn').onclick = () =>
      this.downloadVideo(videoId);
    document.getElementById('deleteVideoBtn').onclick = () =>
      this.deleteVideo(videoId);
  }

  closeVideoModal() {
    const modal = document.getElementById('videoModal');
    modal.style.display = 'none';

    // Stop video playback
    const video = modal.querySelector('video');
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }

  async editVideo(videoId) {
    // Implement video editing modal
    console.log('Edit video:', videoId);
  }

  shareVideo(videoId) {
    window.videoProcessor.shareVideo(videoId);
  }

  async downloadVideo(videoId) {
    try {
      const video = this.videos.find(v => v.id === videoId);
      if (!video) return;

      const link = document.createElement('a');
      link.href = video.urls.videoUrl;
      link.download = `${video.title}.${video.metadata?.fileName?.split('.').pop() || 'mp4'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      this.showError('Failed to download video');
    }
  }

  async deleteVideo(videoId) {
    if (
      !confirm(
        'Are you sure you want to delete this video? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await window.videoProcessor.deleteVideo(videoId);
      this.loadVideos(); // Refresh gallery
      this.closeVideoModal();
    } catch (error) {
      console.error('Delete error:', error);
      this.showError('Failed to delete video');
    }
  }

  searchVideos(searchTerm) {
    if (!searchTerm.trim()) {
      this.filterAndDisplayVideos();
      return;
    }

    const filteredVideos = this.videos.filter(
      video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.tags?.some(tag =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    this.displayVideos(filteredVideos);
  }

  toggleView(viewType) {
    const grid = document.getElementById('videoGrid');
    grid.className = `video-grid ${viewType}-view`;
  }

  // Utility methods
  formatDuration(seconds) {
    if (!seconds || seconds === 0) return '0:00';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  formatDate(dateInput) {
    if (!dateInput) return '-';

    // Handle Firestore timestamp
    const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
    return date.toLocaleDateString();
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showError(message) {
    console.error(message);
    // Implement error notification UI
  }
}

// Initialize video gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize video gallery if container exists
  if (document.getElementById('videoGalleryContainer')) {
    window.videoGallery = new VideoGallery('videoGalleryContainer');
  }
});

// Export for global use
window.VideoGallery = VideoGallery;

export default VideoGallery;
