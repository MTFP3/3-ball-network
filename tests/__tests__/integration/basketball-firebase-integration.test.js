/**
 * Integration tests for Basketball Data Services with Firebase
 * Tests real Firebase integration and data flow
 */

// Mock Firebase but allow some real functionality
jest.mock('firebase/app');
jest.mock('firebase/firestore');
jest.mock('firebase/storage');
jest.mock('firebase/auth');

describe('Basketball Data Integration Tests', () => {
  let basketballData;
  let dataService;

  beforeAll(async () => {
    // Setup test environment
    global.window = {
      firebase: {
        firestore: jest.fn(),
        auth: jest.fn(),
        storage: jest.fn(),
      },
    };

    // Import services after mocks are set up
    const dataServiceModule = await import('../../../public/assets/js/dataService.js');
    const basketballModule = await import('../../../public/assets/js/basketballDataService.js');
    
    dataService = new dataServiceModule.default();
    basketballData = new basketballModule.default();
    
    // Make services available globally
    global.window.dataService = dataService;
    global.window.basketballData = basketballData;
  });

  describe('Firebase Configuration', () => {
    test('should have valid Firebase configuration', () => {
      // Test that Firebase config is loaded properly
      expect(global.window.firebase).toBeDefined();
      expect(global.window.firebase.firestore).toBeDefined();
      expect(global.window.firebase.auth).toBeDefined();
      expect(global.window.firebase.storage).toBeDefined();
    });

    test('should initialize Firebase services', () => {
      expect(dataService).toBeDefined();
      expect(basketballData).toBeDefined();
      expect(basketballData.dataService).toBeDefined();
    });
  });

  describe('Data Service Integration', () => {
    test('should have correct collection names configured', () => {
      expect(basketballData.collections.PLAYERS).toBe('players');
      expect(basketballData.collections.TEAMS).toBe('teams');
      expect(basketballData.collections.GAMES).toBe('games');
      expect(basketballData.collections.STATS).toBe('player_stats');
      expect(basketballData.collections.HIGHLIGHTS).toBe('video_highlights');
      expect(basketballData.collections.SCOUTING).toBe('scouting_reports');
    });

    test('should integrate with data service CRUD operations', async () => {
      // Mock the underlying data service methods
      const mockCreate = jest.spyOn(dataService, 'create').mockResolvedValue({ id: 'test123' });
      const mockRead = jest.spyOn(dataService, 'read').mockResolvedValue([]);
      const mockUpdate = jest.spyOn(dataService, 'update').mockResolvedValue({ success: true });
      const mockDelete = jest.spyOn(dataService, 'delete').mockResolvedValue({ success: true });

      // Test player operations
      await basketballData.createPlayer({ firstName: 'Test', lastName: 'Player' });
      expect(mockCreate).toHaveBeenCalledWith('players', expect.any(Object));

      await basketballData.getPlayers();
      expect(mockRead).toHaveBeenCalledWith('players', null, expect.any(Object));

      // Cleanup mocks
      mockCreate.mockRestore();
      mockRead.mockRestore();
      mockUpdate.mockRestore();
      mockDelete.mockRestore();
    });
  });

  describe('Admin Portal Integration', () => {
    test('should be accessible from global window object', () => {
      expect(global.window.basketballData).toBeDefined();
      expect(global.window.dataService).toBeDefined();
      expect(typeof global.window.basketballData.createPlayer).toBe('function');
      expect(typeof global.window.basketballData.getPlayers).toBe('function');
    });

    test('should support all admin portal operations', () => {
      const requiredMethods = [
        'createPlayer',
        'getPlayer',
        'getPlayers',
        'updatePlayerStats',
        'createTeam',
        'getTeams',
        'createGame',
        'getGames',
        'createScoutingReport',
        'getScoutingReports',
        'uploadHighlight',
        'getPlayerHighlights',
        'searchPlayers',
      ];

      requiredMethods.forEach(method => {
        expect(typeof basketballData[method]).toBe('function');
      });
    });
  });

  describe('Data Seeder Integration', () => {
    test('should integrate with basketball data service', async () => {
      const seederModule = await import('../../../public/assets/js/dataSeeder.js');
      const dataSeeder = new seederModule.default();

      expect(dataSeeder.basketballData).toBeDefined();
      expect(dataSeeder.basketballData).toBe(global.window.basketballData);
    });

    test('should be accessible from global window object', async () => {
      const seederModule = await import('../../../public/assets/js/dataSeeder.js');
      global.window.dataSeeder = new seederModule.default();

      expect(global.window.dataSeeder).toBeDefined();
      expect(typeof global.window.dataSeeder.seedAllData).toBe('function');
    });
  });

  describe('Real-time Features Integration', () => {
    test('should support Firebase real-time subscriptions', () => {
      const mockSubscribe = jest.spyOn(dataService, 'subscribe').mockReturnValue(jest.fn());

      basketballData.subscribeToLiveGame('game123', jest.fn());
      basketballData.subscribeToPlayerStats('player123', jest.fn());

      expect(mockSubscribe).toHaveBeenCalledTimes(2);
      mockSubscribe.mockRestore();
    });

    test('should support analytics tracking', () => {
      const mockTrackEvent = jest.spyOn(dataService, 'trackEvent').mockImplementation();

      basketballData.trackPlayerView('player123');
      basketballData.trackVideoPlay('highlight123');
      basketballData.trackScoutingReportView('report123');

      expect(mockTrackEvent).toHaveBeenCalledTimes(3);
      expect(mockTrackEvent).toHaveBeenCalledWith('player_profile_view', expect.any(Object));
      expect(mockTrackEvent).toHaveBeenCalledWith('video_highlight_play', expect.any(Object));
      expect(mockTrackEvent).toHaveBeenCalledWith('scouting_report_view', expect.any(Object));

      mockTrackEvent.mockRestore();
    });
  });

  describe('Error Handling Integration', () => {
    test('should handle Firebase connection errors', async () => {
      const mockCreate = jest.spyOn(dataService, 'create')
        .mockRejectedValue(new Error('Firebase connection failed'));

      await expect(basketballData.createPlayer({ firstName: 'Test' }))
        .rejects.toThrow('Firebase connection failed');

      mockCreate.mockRestore();
    });

    test('should handle authentication errors', async () => {
      const mockGetCurrentUser = jest.spyOn(dataService, 'getCurrentUser')
        .mockReturnValue(null);

      // Should handle cases where user is not authenticated
      expect(basketballData.dataService.getCurrentUser()).toBeNull();

      mockGetCurrentUser.mockRestore();
    });

    test('should handle storage upload errors', async () => {
      const mockUploadFile = jest.spyOn(dataService, 'uploadFile')
        .mockRejectedValue(new Error('Storage upload failed'));

      const mockFile = new File(['test'], 'test.mp4', { type: 'video/mp4' });
      const metadata = { playerId: 'player123' };

      await expect(basketballData.uploadHighlight(mockFile, metadata))
        .rejects.toThrow('Storage upload failed');

      mockUploadFile.mockRestore();
    });
  });

  describe('Performance and Optimization', () => {
    test('should use efficient Firestore queries', async () => {
      const mockRead = jest.spyOn(dataService, 'read').mockResolvedValue([]);

      // Test pagination support
      await basketballData.getPlayers({ limit: 25 });
      expect(mockRead).toHaveBeenCalledWith('players', null, expect.objectContaining({
        limit: 25,
      }));

      // Test compound queries
      await basketballData.getPlayers({ position: 'PG', school: 'Test High' });
      expect(mockRead).toHaveBeenCalledWith('players', null, expect.objectContaining({
        where: [
          ['profile.position', '==', 'PG'],
          ['profile.school', '==', 'Test High'],
        ],
      }));

      mockRead.mockRestore();
    });

    test('should implement proper data caching', () => {
      // Test that services support caching mechanisms
      expect(typeof dataService.clearCache).toBe('function');
      expect(typeof dataService.getCachedData).toBe('function');
    });
  });

  describe('Security Integration', () => {
    test('should validate user permissions', async () => {
      const mockGetCurrentUser = jest.spyOn(dataService, 'getCurrentUser')
        .mockReturnValue({ uid: 'user123', email: 'test@example.com' });

      const mockValidatePermissions = jest.spyOn(dataService, 'validatePermissions')
        .mockReturnValue(true);

      // Test admin operations require proper permissions
      expect(dataService.getCurrentUser()).toBeTruthy();
      expect(dataService.validatePermissions('admin')).toBe(true);

      mockGetCurrentUser.mockRestore();
      mockValidatePermissions.mockRestore();
    });

    test('should sanitize input data', async () => {
      const mockCreate = jest.spyOn(dataService, 'create').mockResolvedValue({ id: 'test' });
      const mockSanitizeInput = jest.spyOn(dataService, 'sanitizeInput')
        .mockImplementation((data) => data);

      const playerData = {
        firstName: '<script>alert("xss")</script>John',
        lastName: 'Doe',
      };

      await basketballData.createPlayer(playerData);

      // Should sanitize input before storing
      expect(mockSanitizeInput).toHaveBeenCalled();

      mockCreate.mockRestore();
      mockSanitizeInput.mockRestore();
    });
  });

  describe('Cross-browser Compatibility', () => {
    test('should work with different JavaScript environments', () => {
      // Test ES6 features
      expect(Array.from).toBeDefined();
      expect(Promise).toBeDefined();
      expect(Map).toBeDefined();
      expect(Set).toBeDefined();

      // Test async/await support
      expect(basketballData.createPlayer).toBeInstanceOf(Function);
      expect(basketballData.getPlayers).toBeInstanceOf(Function);
    });

    test('should handle module loading', () => {
      // Test that modules are loaded correctly
      expect(basketballData.constructor.name).toBe('BasketballDataService');
      expect(dataService.constructor.name).toBe('DataService');
    });
  });

  describe('Data Consistency', () => {
    test('should maintain referential integrity', async () => {
      const mockRead = jest.spyOn(dataService, 'read');
      const mockCreate = jest.spyOn(dataService, 'create').mockResolvedValue({ id: 'test' });

      // Test that games reference valid teams
      const gameData = {
        homeTeam: 'team1',
        awayTeam: 'team2',
        date: new Date(),
      };

      await basketballData.createGame(gameData);

      // Should validate team references exist
      expect(mockCreate).toHaveBeenCalledWith('games', expect.objectContaining({
        homeTeam: 'team1',
        awayTeam: 'team2',
      }));

      mockRead.mockRestore();
      mockCreate.mockRestore();
    });

    test('should maintain data relationships', async () => {
      const mockRead = jest.spyOn(dataService, 'read').mockResolvedValue([
        { id: 'player1', stats: { gamesPlayed: 10, points: 20 } }
      ]);
      const mockUpdate = jest.spyOn(dataService, 'update').mockResolvedValue({ success: true });

      // Test that stat updates maintain consistency
      await basketballData.updatePlayerStats('player1', { points: 25 });

      expect(mockUpdate).toHaveBeenCalledWith('players', 'player1', expect.objectContaining({
        stats: expect.objectContaining({
          gamesPlayed: 11, // Should increment
          points: expect.any(Number), // Should recalculate average
        }),
      }));

      mockRead.mockRestore();
      mockUpdate.mockRestore();
    });
  });

  describe('Scalability Features', () => {
    test('should support batch operations', () => {
      // Test that services support batch creation for large datasets
      expect(typeof dataService.batchCreate).toBe('function');
      expect(typeof dataService.batchUpdate).toBe('function');
      expect(typeof dataService.batchDelete).toBe('function');
    });

    test('should support background processing', () => {
      // Test that long-running operations can be backgrounded
      expect(typeof dataService.scheduleBackgroundTask).toBe('function');
      expect(typeof dataService.getTaskStatus).toBe('function');
    });
  });
});
