// Universal Dashboard Manager
class DashboardManager {
  constructor(userRole, userId) {
    this.userRole = userRole;
    this.userId = userId;
    this.init();
  }

  async init() {
    this.setupNavigation();
    this.loadUserData();
    this.setupNotifications();
    this.setupRealTimeUpdates();
  }

  setupNavigation() {
    const nav = document.createElement('nav');
    nav.className = 'dashboard-nav';
    nav.innerHTML = `
      <div class="nav-brand">
        <img src="/logo.png" alt="3 Ball Network" style="height: 40px;">
        <span class="nav-title">3 Ball Network</span>
      </div>
      <div class="nav-menu">
        <a href="/portals/${this.userRole}/dashboard.html" class="nav-link active">
          <i class="icon-dashboard"></i> Dashboard
        </a>
        <a href="/portals/${this.userRole}/profile.html" class="nav-link">
          <i class="icon-user"></i> Profile
        </a>
        ${this.getNavLinks()}
        <a href="/logout" class="nav-link logout">
          <i class="icon-logout"></i> Logout
        </a>
      </div>
      <div class="nav-notifications">
        <div class="notification-bell" onclick="toggleNotifications()">
          <i class="icon-bell"></i>
          <span class="notification-count" id="notificationCount">0</span>
        </div>
      </div>
    `;
    document.body.insertBefore(nav, document.body.firstChild);
  }

  getNavLinks() {
    const roleSpecificLinks = {
      player: `
        <a href="/stats" class="nav-link"><i class="icon-chart"></i> Stats</a>
        <a href="/highlights" class="nav-link"><i class="icon-video"></i> Highlights</a>
        <a href="/recruitment" class="nav-link"><i class="icon-star"></i> Recruitment</a>
      `,
      coach: `
        <a href="/team" class="nav-link"><i class="icon-users"></i> Team</a>
        <a href="/analytics" class="nav-link"><i class="icon-analytics"></i> Analytics</a>
        <a href="/playbook" class="nav-link"><i class="icon-book"></i> Playbook</a>
      `,
      scout: `
        <a href="/prospects" class="nav-link"><i class="icon-search"></i> Prospects</a>
        <a href="/reports" class="nav-link"><i class="icon-file"></i> Reports</a>
        <a href="/events" class="nav-link"><i class="icon-calendar"></i> Events</a>
      `,
      fan: `
        <a href="/teams" class="nav-link"><i class="icon-trophy"></i> Teams</a>
        <a href="/games" class="nav-link"><i class="icon-play"></i> Games</a>
        <a href="/news" class="nav-link"><i class="icon-news"></i> News</a>
      `
    };
    return roleSpecificLinks[this.userRole] || '';
  }

  async loadUserData() {
    // Implementation for loading user-specific data
    console.log(`Loading data for ${this.userRole}: ${this.userId}`);
  }

  setupNotifications() {
    // Real-time notification system
    this.notificationQueue = [];
    this.updateNotificationBadge();
  }

  setupRealTimeUpdates() {
    // WebSocket or Firebase real-time listeners
    console.log('Setting up real-time updates');
  }

  updateNotificationBadge() {
    const badge = document.getElementById('notificationCount');
    if (badge) {
      badge.textContent = this.notificationQueue.length;
      badge.style.display = this.notificationQueue.length > 0 ? 'block' : 'none';
    }
  }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const userRole = localStorage.getItem('userRole') || 'player';
  const userId = localStorage.getItem('userId') || 'demo';
  new DashboardManager(userRole, userId);
});

// Global notification functions
window.toggleNotifications = () => {
  console.log('Toggle notifications panel');
};

export { DashboardManager };
