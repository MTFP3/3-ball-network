// Advanced Search System
class SearchEngine {
  constructor() {
    this.searchIndex = new Map();
    this.filters = {};
    this.init();
  }

  init() {
    this.setupSearchUI();
    this.buildSearchIndex();
    this.setupFilters();
  }

  setupSearchUI() {
    const searchContainer = document.getElementById('searchContainer');
    if (!searchContainer) {
      return;
    }

    searchContainer.innerHTML = `
      <div class="advanced-search">
        <div class="search-bar">
          <input type="text" id="searchInput" placeholder="Search players, teams, coaches..." class="search-input">
          <button onclick="searchEngine.performSearch()" class="search-btn">
            <i class="icon-search"></i>
          </button>
        </div>
        
        <div class="search-filters">
          <div class="filter-group">
            <label>Role:</label>
            <select id="roleFilter">
              <option value="">All</option>
              <option value="player">Players</option>
              <option value="coach">Coaches</option>
              <option value="scout">Scouts</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Location:</label>
            <input type="text" id="locationFilter" placeholder="City, State">
          </div>
          
          <div class="filter-group">
            <label>Position:</label>
            <select id="positionFilter">
              <option value="">All Positions</option>
              <option value="PG">Point Guard</option>
              <option value="SG">Shooting Guard</option>
              <option value="SF">Small Forward</option>
              <option value="PF">Power Forward</option>
              <option value="C">Center</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Skill Level:</label>
            <select id="skillFilter">
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="elite">Elite</option>
            </select>
          </div>
        </div>
        
        <div class="search-results" id="searchResults"></div>
      </div>
    `;

    // Add event listeners
    document
      .getElementById('searchInput')
      .addEventListener(
        'input',
        this.debounce(this.performSearch.bind(this), 300)
      );
    document
      .getElementById('roleFilter')
      .addEventListener('change', this.performSearch.bind(this));
    document
      .getElementById('locationFilter')
      .addEventListener(
        'input',
        this.debounce(this.performSearch.bind(this), 300)
      );
    document
      .getElementById('positionFilter')
      .addEventListener('change', this.performSearch.bind(this));
    document
      .getElementById('skillFilter')
      .addEventListener('change', this.performSearch.bind(this));
  }

  async buildSearchIndex() {
    // Build search index from Firebase data
    try {
      const collections = ['players', 'coaches', 'scouts', 'teams'];

      for (const collection of collections) {
        const snapshot = await this.db.collection(collection).get();
        snapshot.forEach(doc => {
          const data = { id: doc.id, ...doc.data(), collection };
          this.indexDocument(data);
        });
      }

      console.log('Search index built successfully');
    } catch (error) {
      console.error('Error building search index:', error);
    }
  }

  indexDocument(doc) {
    const searchableFields = [
      'name',
      'position',
      'school',
      'city',
      'state',
      'skills',
    ];
    const tokens = [];

    searchableFields.forEach(field => {
      if (doc[field]) {
        tokens.push(...this.tokenize(doc[field].toString()));
      }
    });

    tokens.forEach(token => {
      if (!this.searchIndex.has(token)) {
        this.searchIndex.set(token, new Set());
      }
      this.searchIndex.get(token).add(doc.id);
    });
  }

  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(token => token.length > 2);
  }

  async performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    const roleFilter = document.getElementById('roleFilter').value;
    const locationFilter = document
      .getElementById('locationFilter')
      .value.trim();
    const positionFilter = document.getElementById('positionFilter').value;
    const skillFilter = document.getElementById('skillFilter').value;

    let results = [];

    if (query) {
      results = this.textSearch(query);
    } else {
      results = await this.getAllDocuments();
    }

    // Apply filters
    results = this.applyFilters(results, {
      role: roleFilter,
      location: locationFilter,
      position: positionFilter,
      skill: skillFilter,
    });

    this.displayResults(results);
  }

  textSearch(query) {
    const tokens = this.tokenize(query);
    const matchingDocs = new Set();

    tokens.forEach(token => {
      if (this.searchIndex.has(token)) {
        this.searchIndex.get(token).forEach(docId => {
          matchingDocs.add(docId);
        });
      }
    });

    return Array.from(matchingDocs);
  }

  async getAllDocuments() {
    // Return all documents if no search query
    const results = [];
    const collections = ['players', 'coaches', 'scouts'];

    for (const collection of collections) {
      const snapshot = await this.db.collection(collection).limit(20).get();
      snapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data(), collection });
      });
    }

    return results;
  }

  applyFilters(results, filters) {
    return results.filter(doc => {
      if (filters.role && doc.collection !== `${filters.role}s`) {
        return false;
      }
      if (filters.location && !this.matchesLocation(doc, filters.location)) {
        return false;
      }
      if (filters.position && doc.position !== filters.position) {
        return false;
      }
      if (filters.skill && doc.skillLevel !== filters.skill) {
        return false;
      }
      return true;
    });
  }

  matchesLocation(doc, location) {
    const docLocation = `${doc.city || ''} ${doc.state || ''}`.toLowerCase();
    return docLocation.includes(location.toLowerCase());
  }

  displayResults(results) {
    const resultsContainer = document.getElementById('searchResults');

    if (results.length === 0) {
      resultsContainer.innerHTML =
        '<p class="no-results">No results found. Try adjusting your search criteria.</p>';
      return;
    }

    resultsContainer.innerHTML = `
      <div class="results-header">
        <h3>Search Results (${results.length})</h3>
        <div class="sort-options">
          <select onchange="searchEngine.sortResults(this.value)">
            <option value="relevance">Sort by Relevance</option>
            <option value="name">Sort by Name</option>
            <option value="location">Sort by Location</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </div>
      <div class="results-list">
        ${results.map(this.renderResultCard).join('')}
      </div>
    `;
  }

  renderResultCard(result) {
    const roleIcon = {
      players: '🏀',
      coaches: '👔',
      scouts: '🔍',
      teams: '🏆',
    };

    return `
      <div class="result-card" onclick="searchEngine.viewProfile('${result.id}', '${result.collection}')">
        <div class="result-avatar">
          ${roleIcon[result.collection] || '👤'}
        </div>
        <div class="result-info">
          <h4>${result.name || 'Unnamed'}</h4>
          <p class="result-details">
            ${result.position ? `${result.position} • ` : ''}
            ${result.school || result.team || ''}
            ${result.city && result.state ? ` • ${result.city}, ${result.state}` : ''}
          </p>
          <div class="result-stats">
            ${result.rating ? `Rating: ${result.rating}` : ''}
            ${result.wins && result.losses ? `Record: ${result.wins}-${result.losses}` : ''}
          </div>
        </div>
        <div class="result-actions">
          <button class="btn-primary">View Profile</button>
        </div>
      </div>
    `;
  }

  sortResults(criteria) {
    // Implement sorting logic
    console.log('Sorting results by:', criteria);
  }

  viewProfile(id, collection) {
    // Navigate to profile page
    window.location.href = `/profile/${collection}/${id}`;
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize search engine
const searchEngine = new SearchEngine();
window.searchEngine = searchEngine;

export { SearchEngine };
