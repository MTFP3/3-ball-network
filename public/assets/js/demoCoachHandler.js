/**
 * Demo Coach Dashboard Handler
 * Manages tab switching, roster uploads, and game analysis functionality
 */

class DemoCoachHandler {
  constructor() {
    this.activeTab = 'dashboard';
    this.initializeEventListeners();
  }

  /**
   * Initialize all event listeners for the coach dashboard
   */
  initializeEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupTabNavigation();
      this.setupRosterUpload();
      this.setupGameAnalysis();
    });
  }

  /**
   * Set up tab navigation with event delegation
   */
  setupTabNavigation() {
    const navContainer = document.querySelector('.nav-tabs');
    if (!navContainer) return;

    navContainer.addEventListener('click', e => {
      const tab = e.target.closest('[data-tab]');
      if (tab) {
        e.preventDefault();
        const tabName = tab.getAttribute('data-tab');
        this.switchTab(tabName);
      }
    });
  }

  /**
   * Switch between dashboard tabs
   * @param {string} tabName - The tab to switch to
   */
  switchTab(tabName) {
    // Update active tab
    this.activeTab = tabName;

    // Update tab buttons
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.remove('active');
      if (tab.getAttribute('data-tab') === tabName) {
        tab.classList.add('active');
      }
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.style.display = 'none';
      if (content.id === `${tabName}-tab`) {
        content.style.display = 'block';
      }
    });

    // Load tab-specific data
    this.loadTabData(tabName);
  }

  /**
   * Load data specific to the active tab
   * @param {string} tabName - The tab that was activated
   */
  async loadTabData(tabName) {
    try {
      switch (tabName) {
        case 'dashboard':
          await this.loadDashboardData();
          break;
        case 'roster':
          await this.loadRosterData();
          break;
        case 'analytics':
          await this.loadAnalyticsData();
          break;
        case 'live-tools':
          await this.loadLiveToolsData();
          break;
      }
    } catch (error) {
      console.error(`Error loading ${tabName} data:`, error);
      window.errorHandler?.showError(
        `Failed to load ${tabName} data. Please try again.`
      );
    }
  }

  /**
   * Set up roster upload functionality
   */
  setupRosterUpload() {
    // Set up the upload trigger button
    const uploadTrigger = document.querySelector(
      '[data-action="trigger-upload"]'
    );
    if (uploadTrigger) {
      uploadTrigger.addEventListener('click', e => {
        e.preventDefault();
        this.triggerRosterUpload();
      });
    }

    // Set up the actual file input
    const fileInput = document.getElementById('rosterUpload');
    if (fileInput) {
      fileInput.addEventListener('change', e => {
        this.handleRosterUpload(e);
      });
    }
  }

  /**
   * Trigger the hidden file input for roster upload
   */
  triggerRosterUpload() {
    const fileInput = document.getElementById('rosterUpload');
    if (fileInput) {
      fileInput.click();
    }
  }

  /**
   * Handle roster CSV file upload
   * @param {Event} event - The file input change event
   */
  async handleRosterUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      window.errorHandler?.showError('Please select a CSV file.');
      return;
    }

    try {
      window.errorHandler?.showInfo('Processing roster file...', 2000);

      const text = await this.readFileAsText(file);
      const rosterData = this.parseCSV(text);

      await this.processRosterData(rosterData);

      window.errorHandler?.showSuccess('Roster uploaded successfully!');

      // Refresh roster tab if it's active
      if (this.activeTab === 'roster') {
        await this.loadRosterData();
      }
    } catch (error) {
      console.error('Roster upload error:', error);
      window.errorHandler?.showError(
        'Failed to process roster file. Please check the format and try again.'
      );
    }
  }

  /**
   * Set up game analysis functionality
   */
  setupGameAnalysis() {
    const analysisButton = document.querySelector(
      '[data-action="analyze-game"]'
    );
    if (analysisButton) {
      analysisButton.addEventListener('click', e => {
        e.preventDefault();
        this.triggerGameAnalysis();
      });
    }
  }

  /**
   * Trigger game analysis
   */
  async triggerGameAnalysis() {
    try {
      window.errorHandler?.showInfo('Analyzing game data...', 3000);

      // Simulate analysis processing
      await this.simulateAnalysis();

      const analysisOutput = document.getElementById('analysisOutput');
      if (analysisOutput) {
        analysisOutput.textContent = `
          <div class="analysis-result">
            <h4>🎯 Game Analysis Complete</h4>
            <p><strong>Team Performance:</strong> Above Average</p>
            <p><strong>Key Strengths:</strong> Ball movement, defensive rebounds</p>
            <p><strong>Areas for Improvement:</strong> Free throw shooting, turnovers</p>
            <p><strong>Next Focus:</strong> Practice shooting drills</p>
          </div>
        `;
      }

      window.errorHandler?.showSuccess('Game analysis complete!');
    } catch (error) {
      console.error('Game analysis error:', error);
      window.errorHandler?.showError(
        'Failed to analyze game data. Please try again.'
      );
    }
  }

  /**
   * Utility functions
   */
  readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  parseCSV(text) {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());

    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj = {};
      headers.forEach((header, index) => {
        obj[header.toLowerCase()] = values[index] || '';
      });
      return obj;
    });
  }

  async simulateAnalysis() {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  async loadDashboardData() {
    // Load dashboard overview data
    console.log('Loading dashboard data...');
  }

  async loadRosterData() {
    // Load roster information
    console.log('Loading roster data...');
  }

  async loadAnalyticsData() {
    // Load analytics and charts
    console.log('Loading analytics data...');
  }

  async loadLiveToolsData() {
    // Load live coaching tools
    console.log('Loading live tools data...');
  }

  async processRosterData(rosterData) {
    // Process and save roster data
    console.log('Processing roster data:', rosterData);
    // This would normally integrate with Firebase
  }
}

// Initialize when DOM is ready
const demoCoachHandler = new DemoCoachHandler();

// Export for ES6 modules
export { DemoCoachHandler, demoCoachHandler };

// Make available globally for legacy code
window.demoCoachHandler = demoCoachHandler;
window.switchTab = tabName => demoCoachHandler.switchTab(tabName);
window.triggerGameAnalysis = () => demoCoachHandler.triggerGameAnalysis();
