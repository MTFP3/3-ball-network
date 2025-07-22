/**
 * Basketball-specific data models and services
 * Real data operations for players, games, teams, stats, etc.
 */

class BasketballDataService {
  constructor() {
    this.dataService = window.dataService;
    this.collections = {
      PLAYERS: 'players',
      TEAMS: 'teams',
      GAMES: 'games',
      STATS: 'player_stats',
      HIGHLIGHTS: 'video_highlights',
      SCOUTING: 'scouting_reports',
      COACHING: 'coaching_sessions',
      RECRUITMENT: 'recruitment_data'
    };
  }

  /**
   * Player Management
   */
  async createPlayer(playerData) {
    const player = {
      ...playerData,
      profile: {
        firstName: playerData.firstName || '',
        lastName: playerData.lastName || '',
        position: playerData.position || '',
        height: playerData.height || '',
        weight: playerData.weight || '',
        birthDate: playerData.birthDate || null,
        school: playerData.school || '',
        graduationYear: playerData.graduationYear || null,
        ...playerData.profile
      },
      stats: {
        season: new Date().getFullYear(),
        gamesPlayed: 0,
        points: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        fieldGoalPercentage: 0,
        threePointPercentage: 0,
        freeThrowPercentage: 0,
        ...playerData.stats
      },
      recruitment: {
        status: 'uncommitted',
        interests: [],
        offers: [],
        visits: [],
        ...playerData.recruitment
      },
      isActive: true,
      visibility: 'public'
    };

    return await this.dataService.create(this.collections.PLAYERS, player);
  }

  async getPlayer(playerId) {
    return await this.dataService.read(this.collections.PLAYERS, playerId);
  }

  async getPlayers(filters = {}) {
    const options = {};
    
    if (filters.position) {
      options.where = [['profile.position', '==', filters.position]];
    }
    
    if (filters.school) {
      options.where = [...(options.where || []), ['profile.school', '==', filters.school]];
    }
    
    if (filters.graduationYear) {
      options.where = [...(options.where || []), ['profile.graduationYear', '==', filters.graduationYear]];
    }

    options.orderBy = ['profile.lastName', 'asc'];
    
    if (filters.limit) {
      options.limit = filters.limit;
    }

    return await this.dataService.read(this.collections.PLAYERS, null, options);
  }

  async updatePlayerStats(playerId, gameStats) {
    const player = await this.getPlayer(playerId);
    if (!player) throw new Error('Player not found');

    // Calculate new season averages
    const currentStats = player.stats;
    const newGamesPlayed = currentStats.gamesPlayed + 1;

    const updatedStats = {
      gamesPlayed: newGamesPlayed,
      points: this.calculateAverage(currentStats.points, currentStats.gamesPlayed, gameStats.points),
      rebounds: this.calculateAverage(currentStats.rebounds, currentStats.gamesPlayed, gameStats.rebounds),
      assists: this.calculateAverage(currentStats.assists, currentStats.gamesPlayed, gameStats.assists),
      steals: this.calculateAverage(currentStats.steals, currentStats.gamesPlayed, gameStats.steals),
      blocks: this.calculateAverage(currentStats.blocks, currentStats.gamesPlayed, gameStats.blocks),
      // Add more stat calculations as needed
    };

    return await this.dataService.update(this.collections.PLAYERS, playerId, { stats: updatedStats });
  }

  calculateAverage(currentAvg, gamesPlayed, newValue) {
    return ((currentAvg * gamesPlayed) + newValue) / (gamesPlayed + 1);
  }

  /**
   * Team Management
   */
  async createTeam(teamData) {
    const team = {
      name: teamData.name,
      school: teamData.school || '',
      league: teamData.league || '',
      division: teamData.division || '',
      coach: teamData.coach || '',
      players: teamData.players || [],
      season: {
        year: new Date().getFullYear(),
        wins: 0,
        losses: 0,
        conference: teamData.conference || ''
      },
      stats: {
        pointsPerGame: 0,
        reboundsPerGame: 0,
        assistsPerGame: 0,
        fieldGoalPercentage: 0
      },
      isActive: true,
      ...teamData
    };

    return await this.dataService.create(this.collections.TEAMS, team);
  }

  async getTeams(filters = {}) {
    const options = {};
    
    if (filters.league) {
      options.where = [['league', '==', filters.league]];
    }
    
    if (filters.division) {
      options.where = [...(options.where || []), ['division', '==', filters.division]];
    }

    options.orderBy = ['name', 'asc'];

    return await this.dataService.read(this.collections.TEAMS, null, options);
  }

  /**
   * Game Management
   */
  async createGame(gameData) {
    const game = {
      homeTeam: gameData.homeTeam,
      awayTeam: gameData.awayTeam,
      date: gameData.date,
      location: gameData.location || '',
      score: {
        home: gameData.score?.home || 0,
        away: gameData.score?.away || 0
      },
      status: gameData.status || 'scheduled', // scheduled, in-progress, completed
      quarter: gameData.quarter || 1,
      timeRemaining: gameData.timeRemaining || '12:00',
      playerStats: gameData.playerStats || [],
      highlights: gameData.highlights || [],
      isPlayoff: gameData.isPlayoff || false,
      season: gameData.season || new Date().getFullYear(),
      ...gameData
    };

    return await this.dataService.create(this.collections.GAMES, game);
  }

  async getGames(filters = {}) {
    const options = {};
    
    if (filters.team) {
      options.where = [
        ['homeTeam', '==', filters.team],
        ['awayTeam', '==', filters.team]
      ];
    }
    
    if (filters.status) {
      options.where = [...(options.where || []), ['status', '==', filters.status]];
    }
    
    if (filters.season) {
      options.where = [...(options.where || []), ['season', '==', filters.season]];
    }

    options.orderBy = ['date', 'desc'];
    
    if (filters.limit) {
      options.limit = filters.limit;
    }

    return await this.dataService.read(this.collections.GAMES, null, options);
  }

  /**
   * Scouting Reports
   */
  async createScoutingReport(reportData) {
    const report = {
      playerId: reportData.playerId,
      scoutId: reportData.scoutId,
      gameId: reportData.gameId || null,
      date: reportData.date || new Date(),
      ratings: {
        overall: reportData.ratings?.overall || 0,
        shooting: reportData.ratings?.shooting || 0,
        ballHandling: reportData.ratings?.ballHandling || 0,
        defense: reportData.ratings?.defense || 0,
        athleticism: reportData.ratings?.athleticism || 0,
        basketball_iq: reportData.ratings?.basketball_iq || 0,
        leadership: reportData.ratings?.leadership || 0
      },
      notes: reportData.notes || '',
      strengths: reportData.strengths || [],
      weaknesses: reportData.weaknesses || [],
      recommendations: reportData.recommendations || '',
      recruitmentLevel: reportData.recruitmentLevel || 'D3', // D1, D2, D3, NAIA, Junior College
      isPublic: reportData.isPublic || false,
      ...reportData
    };

    return await this.dataService.create(this.collections.SCOUTING, report);
  }

  async getScoutingReports(playerId) {
    const options = {
      where: [['playerId', '==', playerId]],
      orderBy: ['date', 'desc']
    };

    return await this.dataService.read(this.collections.SCOUTING, null, options);
  }

  /**
   * Video Highlights
   */
  async uploadHighlight(file, metadata) {
    try {
      const path = `highlights/${metadata.playerId}/${Date.now()}_${file.name}`;
      
      const url = await this.dataService.uploadFile(file, path, (progress) => {
        console.log(`Upload progress: ${progress}%`);
      });

      const highlight = {
        playerId: metadata.playerId,
        gameId: metadata.gameId || null,
        title: metadata.title || 'Game Highlight',
        description: metadata.description || '',
        videoUrl: url,
        duration: metadata.duration || 0,
        tags: metadata.tags || [],
        isPublic: metadata.isPublic || true,
        uploadedBy: this.dataService.getCurrentUser()?.uid
      };

      return await this.dataService.create(this.collections.HIGHLIGHTS, highlight);
    } catch (error) {
      console.error('Error uploading highlight:', error);
      throw error;
    }
  }

  async getPlayerHighlights(playerId) {
    const options = {
      where: [['playerId', '==', playerId], ['isPublic', '==', true]],
      orderBy: ['createdAt', 'desc']
    };

    return await this.dataService.read(this.collections.HIGHLIGHTS, null, options);
  }

  /**
   * Real-time subscriptions for live data
   */
  subscribeToLiveGame(gameId, callback) {
    return this.dataService.subscribe(
      this.collections.GAMES,
      (games, error) => {
        if (games) {
          const game = games.find(g => g.id === gameId);
          callback(game, null);
        } else {
          callback(null, error);
        }
      },
      { where: [['id', '==', gameId]] }
    );
  }

  subscribeToPlayerStats(playerId, callback) {
    return this.dataService.subscribe(
      this.collections.STATS,
      callback,
      { where: [['playerId', '==', playerId]], orderBy: ['date', 'desc'] }
    );
  }

  /**
   * Analytics and tracking
   */
  trackPlayerView(playerId) {
    this.dataService.trackEvent('player_profile_view', {
      player_id: playerId,
      timestamp: Date.now()
    });
  }

  trackVideoPlay(highlightId) {
    this.dataService.trackEvent('video_highlight_play', {
      highlight_id: highlightId,
      timestamp: Date.now()
    });
  }

  trackScoutingReportView(reportId) {
    this.dataService.trackEvent('scouting_report_view', {
      report_id: reportId,
      timestamp: Date.now()
    });
  }

  /**
   * Search functionality
   */
  async searchPlayers(query, filters = {}) {
    // This would ideally use Algolia or Firebase's full-text search
    // For now, we'll do basic filtering
    const allPlayers = await this.getPlayers(filters);
    
    if (!query) return allPlayers;
    
    const searchTerms = query.toLowerCase().split(' ');
    
    return allPlayers.filter(player => {
      const searchableText = [
        player.profile?.firstName || '',
        player.profile?.lastName || '',
        player.profile?.school || '',
        player.profile?.position || ''
      ].join(' ').toLowerCase();
      
      return searchTerms.every(term => searchableText.includes(term));
    });
  }
}

// Create global instance
window.basketballData = new BasketballDataService();

// Export for ES6 modules
export default BasketballDataService;
