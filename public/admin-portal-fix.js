// Admin Portal Fix - Add to end of admin.html
// This script fixes the navigation issues and improves data loading

(function () {
  'use strict';

  // Fix navigation tabs - add click handlers
  function initializeNavigation() {
    console.log('🔧 Initializing admin navigation...');

    const navTabs = document.querySelectorAll('.nav-tab');
    console.log('📋 Found nav tabs:', navTabs.length);

    navTabs.forEach((tab, index) => {
      // Add click event listener
      tab.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('🔄 Tab clicked:', this.textContent);

        // Get the section ID from the tab text
        const tabText = this.textContent.trim();
        let sectionId = 'dashboard'; // default

        // Map tab text to section IDs
        if (tabText.includes('Dashboard')) sectionId = 'dashboard';
        else if (tabText.includes('CMS')) sectionId = 'cms';
        else if (tabText.includes('User Management')) sectionId = 'users';
        else if (tabText.includes('Game')) sectionId = 'games';
        else if (tabText.includes('Firestore')) sectionId = 'firestore';
        else if (tabText.includes('Developer')) sectionId = 'developer';
        else if (tabText.includes('Settings')) sectionId = 'settings';
        else if (tabText.includes('Messaging')) sectionId = 'messaging';
        else if (tabText.includes('Analytics')) sectionId = 'analytics';
        else if (tabText.includes('Moderation')) sectionId = 'moderation';

        switchTab(sectionId, this);
      });

      // Add cursor pointer
      tab.style.cursor = 'pointer';

      // Add hover effect
      tab.addEventListener('mouseenter', function () {
        if (!this.classList.contains('active')) {
          this.style.backgroundColor = '#e9ecef';
        }
      });

      tab.addEventListener('mouseleave', function () {
        if (!this.classList.contains('active')) {
          this.style.backgroundColor = '';
        }
      });
    });

    console.log('✅ Navigation initialized successfully');
  }

  // Enhanced tab switching function
  function switchTab(sectionId, clickedTab) {
    console.log('🔄 Switching to section:', sectionId);

    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
      section.classList.remove('active');
      section.style.display = 'none';
    });

    // Remove active class from all nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.remove('active');
      tab.style.backgroundColor = '';
    });

    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      targetSection.style.display = 'block';
      console.log('✅ Section shown:', sectionId);
    } else {
      console.error('❌ Section not found:', sectionId);
    }

    // Add active class to clicked tab
    if (clickedTab) {
      clickedTab.classList.add('active');
      clickedTab.style.backgroundColor = '#007cba';
      clickedTab.style.color = 'white';
    }

    // Load section-specific data
    loadSectionData(sectionId);
  }

  // Enhanced data loading with better error handling
  async function loadSectionData(sectionId) {
    console.log('📊 Loading data for section:', sectionId);

    try {
      switch (sectionId) {
        case 'dashboard':
          await loadDashboardData();
          break;
        case 'users':
          await loadUserDataFixed();
          break;
        case 'cms':
          await loadCMSData();
          break;
        case 'games':
          await loadGameData();
          break;
        case 'firestore':
          await loadFirestoreData();
          break;
        case 'analytics':
          await loadAnalyticsData();
          break;
        default:
          console.log('ℹ️ No data loading required for:', sectionId);
      }
    } catch (error) {
      console.error('❌ Error loading section data:', error);
      showAlert(`Error loading ${sectionId} data: ${error.message}`, 'error');
    }
  }

  // Fixed user data loading
  async function loadUserDataFixed() {
    console.log('👥 Loading user data...');

    try {
      // Show loading indicator
      const userSection = document.getElementById('users');
      if (userSection) {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'user-loading';
        loadingDiv.innerHTML = '🔄 Loading user data...';
        loadingDiv.style.cssText =
          'text-align: center; padding: 20px; color: #666;';
        userSection.appendChild(loadingDiv);
      }

      // Get users from Firestore
      const usersSnapshot = await db.collection('users').get();
      const users = [];

      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        users.push({
          id: doc.id,
          ...userData,
        });
      });

      console.log('📊 Found users:', users.length);

      // Update user statistics
      updateUserStats(users);

      // Update user table
      updateUserTable(users);

      // Remove loading indicator
      const loadingDiv = document.getElementById('user-loading');
      if (loadingDiv) {
        loadingDiv.remove();
      }

      console.log('✅ User data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading user data:', error);

      // Remove loading indicator
      const loadingDiv = document.getElementById('user-loading');
      if (loadingDiv) {
        loadingDiv.innerHTML = '❌ Error loading user data';
        loadingDiv.style.color = 'red';
      }

      throw error;
    }
  }

  // Update user statistics
  function updateUserStats(users) {
    const stats = {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      new: users.filter(u => {
        const created = new Date(u.createdAt);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return created > dayAgo;
      }).length,
      banned: users.filter(
        u => u.status === 'suspended' || u.status === 'banned'
      ).length,
    };

    // Update stat elements
    const totalElement = document.getElementById('totalUsers');
    const activeElement = document.getElementById('activeUsers');
    const newElement = document.getElementById('newUsers');
    const bannedElement = document.getElementById('bannedUsers');

    if (totalElement) totalElement.textContent = stats.total;
    if (activeElement) activeElement.textContent = stats.active;
    if (newElement) newElement.textContent = stats.new;
    if (bannedElement) bannedElement.textContent = stats.banned;

    console.log('📊 User stats updated:', stats);
  }

  // Update user table
  function updateUserTable(users) {
    const tableBody = document.querySelector('#userTable tbody');
    if (!tableBody) {
      console.log('⚠️ User table body not found');
      return;
    }

    // Clear existing rows
    tableBody.innerHTML = '';

    // Add user rows
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${user.name || 'Unknown'}</td>
                <td>${user.email || 'No email'}</td>
                <td><span class="role-badge role-${user.role}">${user.role || 'Unknown'}</span></td>
                <td><span class="status-badge status-${user.status}">${user.status || 'Unknown'}</span></td>
                <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</td>
                <td>
                    <button class="btn-edit" onclick="editUser('${user.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteUser('${user.id}')">Delete</button>
                </td>
            `;
      tableBody.appendChild(row);
    });

    console.log('📋 User table updated with', users.length, 'users');
  }

  // Show alert function
  function showAlert(message, type = 'info') {
    console.log(`🚨 Alert (${type}):`, message);

    // Create alert element if it doesn't exist
    let alertDiv = document.getElementById('admin-alert');
    if (!alertDiv) {
      alertDiv = document.createElement('div');
      alertDiv.id = 'admin-alert';
      alertDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                z-index: 10000;
                max-width: 400px;
            `;
      document.body.appendChild(alertDiv);
    }

    // Set alert style based on type
    const colors = {
      info: '#007cba',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545',
    };

    alertDiv.style.backgroundColor = colors[type] || colors.info;
    alertDiv.textContent = message;
    alertDiv.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
      alertDiv.style.display = 'none';
    }, 5000);
  }

  // Initialize everything when DOM is ready
  function initializeAdmin() {
    console.log('🚀 Initializing admin portal fixes...');

    // Add navigation handlers
    initializeNavigation();

    // Add styles for better UX
    addAdminStyles();

    // Load initial data for dashboard
    loadSectionData('dashboard');

    console.log('✅ Admin portal fixes initialized');
  }

  // Add necessary styles
  function addAdminStyles() {
    const style = document.createElement('style');
    style.textContent = `
            .nav-tab {
                transition: background-color 0.3s ease;
            }
            
            .nav-tab:hover {
                background-color: #e9ecef !important;
            }
            
            .nav-tab.active {
                background-color: #007cba !important;
                color: white !important;
            }
            
            .role-badge {
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
            }
            
            .role-player { background: #007cba; color: white; }
            .role-coach { background: #28a745; color: white; }
            .role-scout { background: #17a2b8; color: white; }
            .role-fan { background: #6c757d; color: white; }
            .role-admin { background: #dc3545; color: white; }
            
            .status-badge {
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: bold;
            }
            
            .status-active { background: #d4edda; color: #155724; }
            .status-inactive { background: #f8d7da; color: #721c24; }
            .status-suspended { background: #fff3cd; color: #856404; }
            
            .btn-edit, .btn-delete {
                padding: 4px 8px;
                margin: 2px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
            
            .btn-edit {
                background: #007cba;
                color: white;
            }
            
            .btn-delete {
                background: #dc3545;
                color: white;
            }
            
            .btn-edit:hover { background: #0056b3; }
            .btn-delete:hover { background: #c82333; }
        `;
    document.head.appendChild(style);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdmin);
  } else {
    initializeAdmin();
  }

  // Make functions globally available
  window.switchTab = switchTab;
  window.loadUserDataFixed = loadUserDataFixed;
  window.showAlert = showAlert;
})();
