/**
 * Unit tests for Basketball Data Service
 * Tests the basketball-specific data operations and models
 */

// Mock Firebase services
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  onSnapshot: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytesResumable: jest.fn(),
  getDownloadURL: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

// Mock the dataService dependency
const mockDataService = {
  create: jest.fn(),
  read: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  uploadFile: jest.fn(),
  subscribe: jest.fn(),
  trackEvent: jest.fn(),
  getCurrentUser: jest.fn(),
};

// Setup global mocks
global.window = {
  dataService: mockDataService,
};

// Import the basketball data service
let BasketballDataService;

describe('Basketball Data Service', () => {
  let basketballData;

  beforeAll(async () => {
    // Dynamically import the module to ensure mocks are set up first
    const module = await import('../../../public/assets/js/basketballDataService.js');
    BasketballDataService = module.default;
    basketballData = new BasketballDataService();
  });

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('Player Management', () => {
    test('should create a player with complete profile', async () => {
      const playerData = {
        firstName: 'LeBron',
        lastName: 'James',
        position: 'SF',
        height: '6\'9"',
        weight: 250,
        school: 'St. Vincent-St. Mary High School',
        graduationYear: 2003,
      };

      const expectedPlayer = {
        ...playerData,
        profile: {
          firstName: 'LeBron',
          lastName: 'James',
          position: 'SF',
          height: '6\'9"',
          weight: 250,
          birthDate: null,
          school: 'St. Vincent-St. Mary High School',
          graduationYear: 2003,
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
        },
        recruitment: {
          status: 'uncommitted',
          interests: [],
          offers: [],
          visits: [],
        },
        isActive: true,
        visibility: 'public',
      };

      mockDataService.create.mockResolvedValue({ id: 'player123', ...expectedPlayer });

      const result = await basketballData.createPlayer(playerData);

      expect(mockDataService.create).toHaveBeenCalledWith('players', expectedPlayer);
      expect(result.id).toBe('player123');
    });

    test('should get players with filters', async () => {
      const mockPlayers = [
        {
          id: 'player1',
          profile: { firstName: 'Michael', lastName: 'Jordan', position: 'SG', school: 'UNC' },
        },
        {
          id: 'player2',
          profile: { firstName: 'Magic', lastName: 'Johnson', position: 'PG', school: 'MSU' },
        },
      ];

      mockDataService.read.mockResolvedValue(mockPlayers);

      const filters = { position: 'SG', school: 'UNC' };
      const result = await basketballData.getPlayers(filters);

      expect(mockDataService.read).toHaveBeenCalledWith('players', null, {
        where: [
          ['profile.position', '==', 'SG'],
          ['profile.school', '==', 'UNC'],
        ],
        orderBy: ['profile.lastName', 'asc'],
      });
      expect(result).toEqual(mockPlayers);
    });

    test('should update player stats correctly', async () => {
      const playerId = 'player123';
      const currentPlayer = {
        id: playerId,
        stats: {
          gamesPlayed: 10,
          points: 25.5,
          rebounds: 8.2,
          assists: 6.1,
          steals: 1.8,
          blocks: 0.9,
        },
      };

      const gameStats = {
        points: 30,
        rebounds: 12,
        assists: 8,
        steals: 2,
        blocks: 1,
      };

      mockDataService.read.mockResolvedValue(currentPlayer);
      mockDataService.update.mockResolvedValue({ success: true });

      await basketballData.updatePlayerStats(playerId, gameStats);

      // Verify the stat calculations
      const expectedUpdatedStats = {
        gamesPlayed: 11,
        points: ((25.5 * 10) + 30) / 11, // New average
        rebounds: ((8.2 * 10) + 12) / 11,
        assists: ((6.1 * 10) + 8) / 11,
        steals: ((1.8 * 10) + 2) / 11,
        blocks: ((0.9 * 10) + 1) / 11,
      };

      expect(mockDataService.update).toHaveBeenCalledWith(
        'players',
        playerId,
        { stats: expectedUpdatedStats }
      );
    });

    test('should calculate average correctly', () => {
      // Test the average calculation helper
      const currentAvg = 20.5;
      const gamesPlayed = 10;
      const newValue = 35;

      const result = basketballData.calculateAverage(currentAvg, gamesPlayed, newValue);
      const expected = ((20.5 * 10) + 35) / 11;

      expect(result).toBeCloseTo(expected, 2);
    });
  });

  describe('Team Management', () => {
    test('should create a team with default values', async () => {
      const teamData = {
        name: 'Los Angeles Lakers',
        school: 'Lakers High',
        league: 'NBA Development',
      };

      const expectedTeam = {
        name: 'Los Angeles Lakers',
        school: 'Lakers High',
        league: 'NBA Development',
        division: '',
        coach: '',
        players: [],
        season: {
          year: new Date().getFullYear(),
          wins: 0,
          losses: 0,
          conference: '',
        },
        stats: {
          pointsPerGame: 0,
          reboundsPerGame: 0,
          assistsPerGame: 0,
          fieldGoalPercentage: 0,
        },
        isActive: true,
      };

      mockDataService.create.mockResolvedValue({ id: 'team123', ...expectedTeam });

      const result = await basketballData.createTeam(teamData);

      expect(mockDataService.create).toHaveBeenCalledWith('teams', expectedTeam);
      expect(result.id).toBe('team123');
    });

    test('should get teams with league filter', async () => {
      const mockTeams = [
        { id: 'team1', name: 'Team A', league: 'CIF' },
        { id: 'team2', name: 'Team B', league: 'CIF' },
      ];

      mockDataService.read.mockResolvedValue(mockTeams);

      const filters = { league: 'CIF' };
      await basketballData.getTeams(filters);

      expect(mockDataService.read).toHaveBeenCalledWith('teams', null, {
        where: [['league', '==', 'CIF']],
        orderBy: ['name', 'asc'],
      });
    });
  });

  describe('Game Management', () => {
    test('should create a game with all required fields', async () => {
      const gameData = {
        homeTeam: 'team1',
        awayTeam: 'team2',
        date: new Date('2025-01-15'),
        location: 'Staples Center',
      };

      const expectedGame = {
        homeTeam: 'team1',
        awayTeam: 'team2',
        date: new Date('2025-01-15'),
        location: 'Staples Center',
        score: { home: 0, away: 0 },
        status: 'scheduled',
        quarter: 1,
        timeRemaining: '12:00',
        playerStats: [],
        highlights: [],
        isPlayoff: false,
        season: new Date().getFullYear(),
      };

      mockDataService.create.mockResolvedValue({ id: 'game123', ...expectedGame });

      const result = await basketballData.createGame(gameData);

      expect(mockDataService.create).toHaveBeenCalledWith('games', expectedGame);
      expect(result.id).toBe('game123');
    });

    test('should get games filtered by team', async () => {
      const mockGames = [
        { id: 'game1', homeTeam: 'team1', awayTeam: 'team2' },
        { id: 'game2', homeTeam: 'team3', awayTeam: 'team1' },
      ];

      mockDataService.read.mockResolvedValue(mockGames);

      const filters = { team: 'team1', status: 'completed' };
      await basketballData.getGames(filters);

      expect(mockDataService.read).toHaveBeenCalledWith('games', null, {
        where: [
          ['homeTeam', '==', 'team1'],
          ['awayTeam', '==', 'team1'],
          ['status', '==', 'completed'],
        ],
        orderBy: ['date', 'desc'],
      });
    });
  });

  describe('Scouting Reports', () => {
    test('should create a scouting report with ratings', async () => {
      const reportData = {
        playerId: 'player123',
        scoutId: 'scout456',
        ratings: {
          overall: 8.5,
          shooting: 9.0,
          defense: 7.5,
        },
        notes: 'Excellent potential',
      };

      const expectedReport = {
        playerId: 'player123',
        scoutId: 'scout456',
        gameId: null,
        date: expect.any(Date),
        ratings: {
          overall: 8.5,
          shooting: 9.0,
          ballHandling: 0,
          defense: 7.5,
          athleticism: 0,
          basketball_iq: 0,
          leadership: 0,
        },
        notes: 'Excellent potential',
        strengths: [],
        weaknesses: [],
        recommendations: '',
        recruitmentLevel: 'D3',
        isPublic: false,
      };

      mockDataService.create.mockResolvedValue({ id: 'report123', ...expectedReport });

      const result = await basketballData.createScoutingReport(reportData);

      expect(mockDataService.create).toHaveBeenCalledWith('scouting_reports', expectedReport);
      expect(result.id).toBe('report123');
    });

    test('should get scouting reports for a player', async () => {
      const playerId = 'player123';
      const mockReports = [
        { id: 'report1', playerId, ratings: { overall: 8.0 } },
        { id: 'report2', playerId, ratings: { overall: 8.5 } },
      ];

      mockDataService.read.mockResolvedValue(mockReports);

      await basketballData.getScoutingReports(playerId);

      expect(mockDataService.read).toHaveBeenCalledWith('scouting_reports', null, {
        where: [['playerId', '==', playerId]],
        orderBy: ['date', 'desc'],
      });
    });
  });

  describe('Video Highlights', () => {
    test('should upload highlight with metadata', async () => {
      const mockFile = new File(['video content'], 'highlight.mp4', { type: 'video/mp4' });
      const metadata = {
        playerId: 'player123',
        title: 'Amazing Dunk',
        description: 'Incredible dunk in the 4th quarter',
        tags: ['dunk', 'highlight'],
      };

      const mockUrl = 'https://storage.googleapis.com/highlights/player123/highlight.mp4';
      mockDataService.uploadFile.mockResolvedValue(mockUrl);
      mockDataService.create.mockResolvedValue({ id: 'highlight123' });
      mockDataService.getCurrentUser.mockReturnValue({ uid: 'user123' });

      await basketballData.uploadHighlight(mockFile, metadata);

      expect(mockDataService.uploadFile).toHaveBeenCalledWith(
        mockFile,
        expect.stringContaining('highlights/player123/'),
        expect.any(Function)
      );

      expect(mockDataService.create).toHaveBeenCalledWith('video_highlights', {
        playerId: 'player123',
        gameId: null,
        title: 'Amazing Dunk',
        description: 'Incredible dunk in the 4th quarter',
        videoUrl: mockUrl,
        duration: 0,
        tags: ['dunk', 'highlight'],
        isPublic: true,
        uploadedBy: 'user123',
      });
    });

    test('should get player highlights', async () => {
      const playerId = 'player123';
      const mockHighlights = [
        { id: 'highlight1', playerId, title: 'Dunk 1' },
        { id: 'highlight2', playerId, title: 'Dunk 2' },
      ];

      mockDataService.read.mockResolvedValue(mockHighlights);

      await basketballData.getPlayerHighlights(playerId);

      expect(mockDataService.read).toHaveBeenCalledWith('video_highlights', null, {
        where: [['playerId', '==', playerId], ['isPublic', '==', true]],
        orderBy: ['createdAt', 'desc'],
      });
    });
  });

  describe('Real-time Subscriptions', () => {
    test('should subscribe to live game updates', () => {
      const gameId = 'game123';
      const callback = jest.fn();
      const mockUnsubscribe = jest.fn();

      mockDataService.subscribe.mockReturnValue(mockUnsubscribe);

      const unsubscribe = basketballData.subscribeToLiveGame(gameId, callback);

      expect(mockDataService.subscribe).toHaveBeenCalledWith(
        'games',
        expect.any(Function),
        { where: [['id', '==', gameId]] }
      );
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    test('should subscribe to player stats', () => {
      const playerId = 'player123';
      const callback = jest.fn();

      basketballData.subscribeToPlayerStats(playerId, callback);

      expect(mockDataService.subscribe).toHaveBeenCalledWith(
        'player_stats',
        callback,
        {
          where: [['playerId', '==', playerId]],
          orderBy: ['date', 'desc'],
        }
      );
    });
  });

  describe('Analytics and Tracking', () => {
    test('should track player view event', () => {
      const playerId = 'player123';

      basketballData.trackPlayerView(playerId);

      expect(mockDataService.trackEvent).toHaveBeenCalledWith('player_profile_view', {
        player_id: playerId,
        timestamp: expect.any(Number),
      });
    });

    test('should track video play event', () => {
      const highlightId = 'highlight123';

      basketballData.trackVideoPlay(highlightId);

      expect(mockDataService.trackEvent).toHaveBeenCalledWith('video_highlight_play', {
        highlight_id: highlightId,
        timestamp: expect.any(Number),
      });
    });

    test('should track scouting report view', () => {
      const reportId = 'report123';

      basketballData.trackScoutingReportView(reportId);

      expect(mockDataService.trackEvent).toHaveBeenCalledWith('scouting_report_view', {
        report_id: reportId,
        timestamp: expect.any(Number),
      });
    });
  });

  describe('Search Functionality', () => {
    test('should search players by name and filters', async () => {
      const mockPlayers = [
        {
          profile: {
            firstName: 'Michael',
            lastName: 'Jordan',
            school: 'UNC',
            position: 'SG',
          },
        },
        {
          profile: {
            firstName: 'Magic',
            lastName: 'Johnson',
            school: 'MSU',
            position: 'PG',
          },
        },
      ];

      basketballData.getPlayers = jest.fn().mockResolvedValue(mockPlayers);

      const result = await basketballData.searchPlayers('michael', { position: 'SG' });

      expect(basketballData.getPlayers).toHaveBeenCalledWith({ position: 'SG' });
      expect(result).toHaveLength(1);
      expect(result[0].profile.firstName).toBe('Michael');
    });

    test('should return all players when no query provided', async () => {
      const mockPlayers = [
        { profile: { firstName: 'Player', lastName: 'One' } },
        { profile: { firstName: 'Player', lastName: 'Two' } },
      ];

      basketballData.getPlayers = jest.fn().mockResolvedValue(mockPlayers);

      const result = await basketballData.searchPlayers('', {});

      expect(result).toEqual(mockPlayers);
    });
  });

  describe('Error Handling', () => {
    test('should handle player creation errors', async () => {
      const playerData = { firstName: 'Test', lastName: 'Player' };
      const error = new Error('Firestore connection failed');

      mockDataService.create.mockRejectedValue(error);

      await expect(basketballData.createPlayer(playerData)).rejects.toThrow(
        'Firestore connection failed'
      );
    });

    test('should handle missing player in stats update', async () => {
      const playerId = 'nonexistent';
      const gameStats = { points: 20 };

      mockDataService.read.mockResolvedValue(null);

      await expect(basketballData.updatePlayerStats(playerId, gameStats)).rejects.toThrow(
        'Player not found'
      );
    });

    test('should handle video upload errors', async () => {
      const mockFile = new File(['video'], 'test.mp4', { type: 'video/mp4' });
      const metadata = { playerId: 'player123' };
      const error = new Error('Upload failed');

      mockDataService.uploadFile.mockRejectedValue(error);

      await expect(basketballData.uploadHighlight(mockFile, metadata)).rejects.toThrow(
        'Upload failed'
      );
    });
  });
});
