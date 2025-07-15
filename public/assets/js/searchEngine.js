// Advanced Search Engine with Firebase Integration
import { db, auth } from './firebaseConfig.js';
import {
  createContainer,
  createInput,
  createButton,
  createSelect,
  createLabel,
  createProgressIndicator,
  createToast,
  createOptimisticElement,
  safeText,
  safeAttr,
  clearContainer,
} from './uiComponents.js';

class SearchEngine {
  constructor() {
    this.db = db;
    this.auth = auth;
    this.searchIndex = new Map();
    this.filters = {};
    this.searchProgress = null;
    this.pendingSearchId = null;
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

    // Clear existing content securely
    clearContainer(searchContainer);

    // Create advanced search container
    const advancedSearch = createContainer('advanced-search');

    // Create search bar
    const searchBar = createContainer('search-bar');

    const searchInput = createInput(
      'text',
      'searchInput',
      'Search players, teams, coaches...'
    );
    searchInput.classList.add('search-input');

    const searchBtn = createButton('Search', 'searchBtn', 'search-btn');
    const icon = document.createElement('i');
    icon.classList.add('icon-search');
    clearContainer(searchBtn);
    searchBtn.appendChild(icon);

    searchBar.appendChild(searchInput);
    searchBar.appendChild(searchBtn);

    // Create filters container
    const filtersContainer = createContainer('search-filters');

    // Role filter
    const roleGroup = createContainer('filter-group');
    roleGroup.appendChild(createLabel('Role:'));
    const roleFilter = createSelect('roleFilter', [
      { value: '', text: 'All' },
      { value: 'player', text: 'Players' },
      { value: 'coach', text: 'Coaches' },
      { value: 'scout', text: 'Scouts' },
    ]);
    roleGroup.appendChild(roleFilter);

    // Location filter
    const locationGroup = createContainer('filter-group');
    locationGroup.appendChild(createLabel('Location:'));
    const locationFilter = createInput('text', 'locationFilter', 'City, State');
    locationGroup.appendChild(locationFilter);

    // Position filter
    const positionGroup = createContainer('filter-group');
    positionGroup.appendChild(createLabel('Position:'));
    const positionFilter = createSelect('positionFilter', [
      { value: '', text: 'All Positions' },
      { value: 'PG', text: 'Point Guard' },
      { value: 'SG', text: 'Shooting Guard' },
      { value: 'SF', text: 'Small Forward' },
      { value: 'PF', text: 'Power Forward' },
      { value: 'C', text: 'Center' },
    ]);
    positionGroup.appendChild(positionFilter);

    // Skill level filter
    const skillGroup = createContainer('filter-group');
    skillGroup.appendChild(createLabel('Skill Level:'));
    const skillFilter = createSelect('skillFilter', [
      { value: '', text: 'All Levels' },
      { value: 'beginner', text: 'Beginner' },
      { value: 'intermediate', text: 'Intermediate' },
      { value: 'advanced', text: 'Advanced' },
      { value: 'elite', text: 'Elite' },
    ]);
    skillGroup.appendChild(skillFilter);

    // Sort options
    const sortGroup = createContainer('sort-options');
    sortGroup.appendChild(createLabel('Sort by:'));
    const sortFilter = createSelect('sortFilter', [
      { value: 'relevance', text: 'Relevance' },
      { value: 'name', text: 'Name' },
      { value: 'rating', text: 'Rating' },
      { value: 'location', text: 'Location' },
    ]);
    sortGroup.appendChild(sortFilter);

    // Assemble filters
    filtersContainer.appendChild(roleGroup);
    filtersContainer.appendChild(locationGroup);
    filtersContainer.appendChild(positionGroup);
    filtersContainer.appendChild(skillGroup);
    filtersContainer.appendChild(sortGroup);

    // Create results container
    const resultsContainer = createContainer('search-results');
    safeAttr(resultsContainer, 'id', 'searchResults');

    // Assemble main container
    advancedSearch.appendChild(searchBar);
    advancedSearch.appendChild(filtersContainer);
    advancedSearch.appendChild(resultsContainer);
    searchContainer.appendChild(advancedSearch);

    // Add event listeners securely
    searchBtn.addEventListener('click', this.performSearch.bind(this));
    searchInput.addEventListener(
      'input',
      this.debounce(this.performSearch.bind(this), 300)
    );
    roleFilter.addEventListener('change', this.performSearch.bind(this));
    locationFilter.addEventListener(
      'input',
      this.debounce(this.performSearch.bind(this), 300)
    );
    positionFilter.addEventListener('change', this.performSearch.bind(this));
    skillFilter.addEventListener('change', this.performSearch.bind(this));
    sortFilter.addEventListener('change', e =>
      this.sortResults(e.target.value)
    );
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

      // Search index built successfully
    } catch {
      // Error building search index
    }
  }

  indexDocument(doc) {
    // Create searchable text from document fields
    const searchableFields = [
      'name',
      'title',
      'position',
      'location',
      'skills',
      'bio',
      'team',
    ];
    const searchText = searchableFields
      .map(field => doc[field] || '')
      .join(' ')
      .toLowerCase();

    this.searchIndex.set(doc.id, {
      ...doc,
      searchText,
    });
  }

  setupFilters() {
    this.filters = {
      role: '',
      location: '',
      position: '',
      skill: '',
      sort: 'relevance',
    };
  }

  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  async performSearch() {
    // Generate unique search ID for optimistic updates
    const searchId = Date.now().toString();
    this.pendingSearchId = searchId;

    const query = document.getElementById('searchInput').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;
    const locationFilter = document
      .getElementById('locationFilter')
      .value.toLowerCase();
    const positionFilter = document.getElementById('positionFilter').value;
    const skillFilter = document.getElementById('skillFilter').value;

    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;

    // Show optimistic loading state
    if (
      query ||
      roleFilter ||
      locationFilter ||
      positionFilter ||
      skillFilter
    ) {
      this.showSearchLoading(resultsContainer);
    }

    try {
      const results = [];

      // Search through indexed documents
      for (const [, doc] of this.searchIndex) {
        // Check if this is still the current search
        if (this.pendingSearchId !== searchId) return;

        let score = 0;

        // Text matching
        if (query) {
          if (doc.searchText.includes(query)) {
            score += 10;
            // Boost for exact name matches
            if (doc.name && doc.name.toLowerCase().includes(query)) {
              score += 20;
            }
          }
        } else {
          score = 1; // Default score when no query
        }

        // Apply filters
        if (roleFilter && doc.collection !== `${roleFilter}s`) {
          continue;
        }
        if (
          locationFilter &&
          !doc.location?.toLowerCase().includes(locationFilter)
        ) {
          continue;
        }
        if (positionFilter && doc.position !== positionFilter) {
          continue;
        }
        if (skillFilter && doc.skillLevel !== skillFilter) {
          continue;
        }

        if (score > 0) {
          results.push({ ...doc, score });
        }
      }

      // Check if this is still the current search before displaying
      if (this.pendingSearchId === searchId) {
        // Sort results
        this.sortResults('relevance', results);
        this.displayResults(results);

        // Show success toast for non-empty queries
        if (query && results.length > 0) {
          createToast(
            `Found ${results.length} result${results.length === 1 ? '' : 's'}`,
            'success',
            3000
          );
        }
      }
    } catch (error) {
      // Only show error if this is still the current search
      if (this.pendingSearchId === searchId) {
        console.error('Search error:', error);
        this.showSearchError(resultsContainer);
        createToast('Search failed. Please try again.', 'error');
      }
    }
  }

  showSearchLoading(container) {
    clearContainer(container);

    const loadingElement = createOptimisticElement('Searching...', {
      extraClass: 'search-loading',
      showSpinner: true,
    });
    loadingElement.setPending();

    this.searchProgress = createProgressIndicator();
    this.searchProgress.setIndeterminate();

    container.appendChild(loadingElement);
    container.appendChild(this.searchProgress);
  }

  showSearchError(container) {
    clearContainer(container);

    const errorElement = createContainer('search-error');
    const errorText = document.createElement('p');
    safeText(
      errorText,
      'Search failed. Please check your connection and try again.'
    );

    const retryBtn = createButton('Try Again', null, 'btn-retry');
    retryBtn.addEventListener('click', () => this.performSearch());

    errorElement.appendChild(errorText);
    errorElement.appendChild(retryBtn);
    container.appendChild(errorElement);
  }
  sortResults(sortBy, results = null) {
    if (!results) {
      // Re-perform search with current sort
      this.performSearch();
      return;
    }

    switch (sortBy) {
      case 'name':
        results.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'rating':
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'location':
        results.sort((a, b) =>
          (a.location || '').localeCompare(b.location || '')
        );
        break;
      case 'relevance':
      default:
        results.sort((a, b) => b.score - a.score);
        break;
    }

    this.displayResults(results);
  }

  displayResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) {
      return;
    }

    clearContainer(resultsContainer);

    if (results.length === 0) {
      const noResults = createContainer('no-results');
      safeText(noResults, 'No results found');
      resultsContainer.appendChild(noResults);
      return;
    }

    // Create results header
    const resultsHeader = createContainer('results-header');
    const headerTitle = document.createElement('h3');
    safeText(headerTitle, `Search Results (${results.length})`);
    resultsHeader.appendChild(headerTitle);

    // Create results grid
    const resultsGrid = createContainer('results-grid');

    results.forEach(result => {
      const resultCard = this.createResultCard(result);
      resultsGrid.appendChild(resultCard);
    });

    resultsContainer.appendChild(resultsHeader);
    resultsContainer.appendChild(resultsGrid);
  }

  createResultCard(result) {
    const { collection, name, title, position, location, rating, photo, bio } =
      result;

    const resultCard = createContainer('result-card');
    safeAttr(resultCard, 'data-id', result.id);
    safeAttr(resultCard, 'data-collection', collection);

    // Create result header
    const resultHeader = createContainer('result-header');

    // Avatar image
    const avatar = document.createElement('img');
    safeAttr(avatar, 'src', photo || '/assets/images/default-avatar.png');
    safeAttr(avatar, 'alt', name || title || 'Unknown');
    avatar.classList.add('result-avatar');

    // Result info
    const resultInfo = createContainer('result-info');

    const resultName = document.createElement('h4');
    resultName.classList.add('result-name');
    safeText(resultName, name || title || 'Unknown');

    const resultType = document.createElement('p');
    resultType.classList.add('result-type');
    safeText(resultType, this.formatType(collection));

    resultInfo.appendChild(resultName);
    resultInfo.appendChild(resultType);

    if (position) {
      const resultPosition = document.createElement('p');
      resultPosition.classList.add('result-position');
      safeText(resultPosition, position);
      resultInfo.appendChild(resultPosition);
    }

    resultHeader.appendChild(avatar);
    resultHeader.appendChild(resultInfo);

    // Rating if available
    if (rating) {
      const resultRating = createContainer('result-rating');
      safeText(resultRating, `${rating}/5 ⭐`);
      resultHeader.appendChild(resultRating);
    }

    // Create result details
    const resultDetails = createContainer('result-details');

    if (location) {
      const resultLocation = document.createElement('p');
      resultLocation.classList.add('result-location');
      safeText(resultLocation, `📍 ${location}`);
      resultDetails.appendChild(resultLocation);
    }

    if (bio) {
      const resultBio = document.createElement('p');
      resultBio.classList.add('result-bio');
      safeText(resultBio, this.truncateText(bio, 100));
      resultDetails.appendChild(resultBio);
    }

    // Create result actions
    const resultActions = createContainer('result-actions');

    const viewProfileBtn = createButton(
      'View Profile',
      null,
      'btn-view-profile'
    );
    safeAttr(viewProfileBtn, 'data-id', result.id);
    safeAttr(viewProfileBtn, 'data-collection', collection);

    resultActions.appendChild(viewProfileBtn);

    // Add message button if user is authenticated
    if (this.auth.currentUser) {
      const messageBtn = createButton('Message', null, 'btn-message');
      safeAttr(messageBtn, 'data-id', result.id);
      resultActions.appendChild(messageBtn);
    }

    // Assemble the card
    resultCard.appendChild(resultHeader);
    resultCard.appendChild(resultDetails);
    resultCard.appendChild(resultActions);

    return resultCard;
  }

  formatType(collection) {
    const types = {
      players: 'Player',
      coaches: 'Coach',
      scouts: 'Scout',
      teams: 'Team',
    };
    return types[collection] || 'Unknown';
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.substring(0, maxLength)}...`;
  }

  // Initialize search engine when DOM is ready
  static init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        window.searchEngine = new SearchEngine();
      });
    } else {
      window.searchEngine = new SearchEngine();
    }
  }
}

// Export for module use
export default SearchEngine;

// Auto-initialize if loaded as script
SearchEngine.init();
