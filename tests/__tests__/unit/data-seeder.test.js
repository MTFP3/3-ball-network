/**
 * Unit tests for Data Seeder
 * Tests the sample data generation functionality
 */

// Mock the basketball data service
const mockBasketballData = {
  createPlayer: jest.fn(),
  createTeam: jest.fn(),
  createGame: jest.fn(),
  createScoutingReport: jest.fn(),
};

// Setup global mocks
global.window = {
  basketballData: mockBasketballData,
};

// Import the data seeder
let DataSeeder;

describe('Data Seeder', () => {
  let dataSeeder;

  beforeAll(async () => {
    // Dynamically import the module
    const module = await import('../../../public/assets/js/dataSeeder.js');
    DataSeeder = module.default;
    dataSeeder = new DataSeeder();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Player Generation', () => {
    test('should generate specified number of players', () => {
      const players = dataSeeder.generatePlayers(5);

      expect(players).toHaveLength(5);
      expect(players[0]).toHaveProperty('firstName');
      expect(players[0]).toHaveProperty('lastName');
      expect(players[0]).toHaveProperty('position');
      expect(players[0]).toHaveProperty('school');
    });

    test('should generate players with valid positions', () => {
      const players = dataSeeder.generatePlayers(10);
      const validPositions = ['PG', 'SG', 'SF', 'PF', 'C'];

      players.forEach(player => {
        expect(validPositions).toContain(player.position);
      });
    });

    test('should generate players with realistic graduation years', () => {
      const players = dataSeeder.generatePlayers(10);
      const currentYear = new Date().getFullYear();

      players.forEach(player => {
        expect(player.graduationYear).toBeGreaterThanOrEqual(currentYear);
        expect(player.graduationYear).toBeLessThanOrEqual(currentYear + 3);
      });
    });

    test('should generate players with complete profiles', () => {
      const players = dataSeeder.generatePlayers(1);
      const player = players[0];

      expect(player.profile).toHaveProperty('firstName');
      expect(player.profile).toHaveProperty('lastName');
      expect(player.profile).toHaveProperty('position');
      expect(player.profile).toHaveProperty('height');
      expect(player.profile).toHaveProperty('weight');
      expect(player.profile).toHaveProperty('school');
      expect(player.profile).toHaveProperty('graduationYear');
      expect(player.profile).toHaveProperty('phoneNumber');
      expect(player.profile).toHaveProperty('email');
    });

    test('should generate realistic stats based on position', () => {
      const players = dataSeeder.generatePlayers(1);
      const player = players[0];

      expect(player.stats).toHaveProperty('points');
      expect(player.stats).toHaveProperty('rebounds');
      expect(player.stats).toHaveProperty('assists');
      expect(player.stats).toHaveProperty('gamesPlayed');
      expect(player.stats.gamesPlayed).toBeGreaterThan(0);
      expect(player.stats.fieldGoalPercentage).toBeGreaterThanOrEqual(35);
      expect(player.stats.fieldGoalPercentage).toBeLessThanOrEqual(60);
    });

    test('should generate academic data', () => {
      const players = dataSeeder.generatePlayers(1);
      const player = players[0];

      expect(player.academics).toHaveProperty('gpa');
      expect(player.academics).toHaveProperty('satScore');
      expect(player.academics).toHaveProperty('actScore');
      expect(player.academics.gpa).toBeGreaterThanOrEqual(2.5);
      expect(player.academics.gpa).toBeLessThanOrEqual(4.0);
    });
  });

  describe('Team Generation', () => {
    test('should generate specified number of teams', () => {
      const teams = dataSeeder.generateTeams(8);

      expect(teams).toHaveLength(8);
      expect(teams[0]).toHaveProperty('name');
      expect(teams[0]).toHaveProperty('school');
      expect(teams[0]).toHaveProperty('league');
    });

    test('should generate teams with complete data', () => {
      const teams = dataSeeder.generateTeams(1);
      const team = teams[0];

      expect(team).toHaveProperty('name');
      expect(team).toHaveProperty('school');
      expect(team).toHaveProperty('league');
      expect(team).toHaveProperty('coach');
      expect(team.season).toHaveProperty('year');
      expect(team.season).toHaveProperty('wins');
      expect(team.season).toHaveProperty('losses');
      expect(team.stats).toHaveProperty('pointsPerGame');
    });

    test('should generate realistic season records', () => {
      const teams = dataSeeder.generateTeams(5);

      teams.forEach(team => {
        expect(team.season.wins).toBeGreaterThanOrEqual(5);
        expect(team.season.wins).toBeLessThanOrEqual(25);
        expect(team.season.losses).toBeGreaterThanOrEqual(2);
        expect(team.season.losses).toBeLessThanOrEqual(15);
      });
    });
  });

  describe('Game Generation', () => {
    test('should generate games with different teams', () => {
      const teams = [
        { id: 'team1', name: 'Team A', school: 'School A' },
        { id: 'team2', name: 'Team B', school: 'School B' },
        { id: 'team3', name: 'Team C', school: 'School C' },
      ];

      const games = dataSeeder.generateGames(teams, 10);

      expect(games).toHaveLength(10);
      games.forEach(game => {
        expect(game.homeTeam).not.toBe(game.awayTeam);
        expect(game).toHaveProperty('date');
        expect(game).toHaveProperty('location');
        expect(game).toHaveProperty('status');
      });
    });

    test('should generate games with appropriate statuses', () => {
      const teams = [
        { id: 'team1', name: 'Team A', school: 'School A' },
        { id: 'team2', name: 'Team B', school: 'School B' },
      ];

      const games = dataSeeder.generateGames(teams, 20);
      const validStatuses = ['scheduled', 'in-progress', 'completed'];

      games.forEach(game => {
        expect(validStatuses).toContain(game.status);
      });
    });

    test('should generate completed games with scores', () => {
      const teams = [
        { id: 'team1', name: 'Team A', school: 'School A' },
        { id: 'team2', name: 'Team B', school: 'School B' },
      ];

      // Mock past date for completed games
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);
      jest.spyOn(dataSeeder, 'generateGameDate').mockReturnValue(pastDate);

      const games = dataSeeder.generateGames(teams, 5);

      games.forEach(game => {
        if (game.status === 'completed') {
          expect(game.score.home).toBeGreaterThanOrEqual(45);
          expect(game.score.home).toBeLessThanOrEqual(85);
          expect(game.score.away).toBeGreaterThanOrEqual(45);
          expect(game.score.away).toBeLessThanOrEqual(85);
        }
      });
    });
  });

  describe('Scouting Report Generation', () => {
    test('should generate scouting reports for players', () => {
      const players = [
        { id: 'player1', profile: { firstName: 'John', position: 'PG' } },
        { id: 'player2', profile: { firstName: 'Jane', position: 'SG' } },
      ];

      const reports = dataSeeder.generateScoutingReports(players, 5);

      expect(reports).toHaveLength(5);
      reports.forEach(report => {
        expect(report).toHaveProperty('playerId');
        expect(report).toHaveProperty('ratings');
        expect(report.ratings).toHaveProperty('overall');
        expect(report.ratings.overall).toBeGreaterThanOrEqual(6);
        expect(report.ratings.overall).toBeLessThanOrEqual(10);
      });
    });

    test('should generate position-specific strengths', () => {
      const players = [{ id: 'player1', position: 'PG' }];
      const reports = dataSeeder.generateScoutingReports(players, 1);
      const report = reports[0];

      expect(Array.isArray(report.strengths)).toBe(true);
      expect(Array.isArray(report.weaknesses)).toBe(true);
      expect(typeof report.recommendations).toBe('string');
    });
  });

  describe('Helper Methods', () => {
    test('should generate realistic heights by position', () => {
      const pgHeight = dataSeeder.generateHeight('PG');
      const cHeight = dataSeeder.generateHeight('C');

      // Point guards should be shorter than centers
      expect(pgHeight).toMatch(/^[5-6]'\d+"$/);
      expect(cHeight).toMatch(/^[6-7]'\d+"$/);
    });

    test('should generate realistic weights by position', () => {
      const pgWeight = dataSeeder.generateWeight('PG');
      const cWeight = dataSeeder.generateWeight('C');

      expect(pgWeight).toBeGreaterThanOrEqual(150);
      expect(pgWeight).toBeLessThanOrEqual(190);
      expect(cWeight).toBeGreaterThanOrEqual(220);
      expect(cWeight).toBeLessThanOrEqual(280);
    });

    test('should generate valid phone numbers', () => {
      const phoneNumber = dataSeeder.generatePhoneNumber();
      expect(phoneNumber).toMatch(/^\(\d{3}\) \d{3}-\d{4}$/);
    });

    test('should generate birth dates appropriate for graduation year', () => {
      const graduationYear = 2025;
      const birthDate = dataSeeder.generateBirthDate(graduationYear);
      const expectedBirthYear = graduationYear - 18;

      expect(birthDate.getFullYear()).toBe(expectedBirthYear);
    });

    test('should get random elements from arrays', () => {
      const testArray = ['a', 'b', 'c', 'd', 'e'];
      const randomElement = dataSeeder.getRandomElement(testArray);

      expect(testArray).toContain(randomElement);
    });

    test('should generate random numbers within range', () => {
      const randomInt = dataSeeder.getRandomNumber(10, 20);
      const randomFloat = dataSeeder.getRandomNumber(10.5, 20.5, 2);

      expect(randomInt).toBeGreaterThanOrEqual(10);
      expect(randomInt).toBeLessThan(20);
      expect(Number.isInteger(randomInt)).toBe(true);

      expect(randomFloat).toBeGreaterThanOrEqual(10.5);
      expect(randomFloat).toBeLessThan(20.5);
    });
  });

  describe('Full Data Seeding', () => {
    test('should seed all data types successfully', async () => {
      // Mock successful creation responses
      mockBasketballData.createTeam.mockImplementation((team) => 
        Promise.resolve({ id: `team_${Math.random()}`, ...team })
      );
      mockBasketballData.createPlayer.mockImplementation((player) => 
        Promise.resolve({ id: `player_${Math.random()}`, ...player })
      );
      mockBasketballData.createGame.mockImplementation((game) => 
        Promise.resolve({ id: `game_${Math.random()}`, ...game })
      );
      mockBasketballData.createScoutingReport.mockImplementation((report) => 
        Promise.resolve({ id: `report_${Math.random()}`, ...report })
      );

      const result = await dataSeeder.seedAllData();

      expect(result).toHaveProperty('players');
      expect(result).toHaveProperty('teams');
      expect(result).toHaveProperty('games');
      expect(result).toHaveProperty('reports');

      expect(result.players).toBeGreaterThan(0);
      expect(result.teams).toBeGreaterThan(0);
      expect(result.games).toBeGreaterThan(0);
      expect(result.reports).toBeGreaterThan(0);

      expect(mockBasketballData.createTeam).toHaveBeenCalled();
      expect(mockBasketballData.createPlayer).toHaveBeenCalled();
      expect(mockBasketballData.createGame).toHaveBeenCalled();
      expect(mockBasketballData.createScoutingReport).toHaveBeenCalled();
    });

    test('should handle seeding errors gracefully', async () => {
      // Mock some creation failures
      mockBasketballData.createTeam.mockRejectedValue(new Error('Team creation failed'));

      await expect(dataSeeder.seedAllData()).rejects.toThrow();
    });

    test('should log progress during seeding', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      mockBasketballData.createTeam.mockResolvedValue({ id: 'team1' });
      mockBasketballData.createPlayer.mockResolvedValue({ id: 'player1' });
      mockBasketballData.createGame.mockResolvedValue({ id: 'game1' });
      mockBasketballData.createScoutingReport.mockResolvedValue({ id: 'report1' });

      await dataSeeder.seedAllData();

      expect(consoleSpy).toHaveBeenCalledWith('Starting data seeding...');
      expect(consoleSpy).toHaveBeenCalledWith('Creating teams...');
      expect(consoleSpy).toHaveBeenCalledWith('Creating players...');
      expect(consoleSpy).toHaveBeenCalledWith('Data seeding completed successfully!');

      consoleSpy.mockRestore();
    });
  });

  describe('Data Quality and Validation', () => {
    test('should generate unique player names within reasonable limits', () => {
      const players = dataSeeder.generatePlayers(20);
      const fullNames = players.map(p => `${p.firstName} ${p.lastName}`);
      const uniqueNames = new Set(fullNames);

      // Should have good variety (at least 80% unique)
      expect(uniqueNames.size).toBeGreaterThan(fullNames.length * 0.8);
    });

    test('should generate realistic statistical distributions', () => {
      const players = dataSeeder.generatePlayers(50);
      
      // Test that different positions have different average stats
      const pgPlayers = players.filter(p => p.position === 'PG');
      const cPlayers = players.filter(p => p.position === 'C');

      if (pgPlayers.length > 0 && cPlayers.length > 0) {
        const avgPgAssists = pgPlayers.reduce((sum, p) => sum + p.stats.assists, 0) / pgPlayers.length;
        const avgCAssists = cPlayers.reduce((sum, p) => sum + p.stats.assists, 0) / cPlayers.length;
        
        // Point guards should average more assists than centers
        expect(avgPgAssists).toBeGreaterThan(avgCAssists);
      }
    });

    test('should generate valid email addresses', () => {
      const players = dataSeeder.generatePlayers(5);
      
      players.forEach(player => {
        expect(player.profile.email).toMatch(/^[a-z]+\.[a-z]+@email\.com$/);
      });
    });

    test('should generate diverse schools and leagues', () => {
      const teams = dataSeeder.generateTeams(10);
      const schools = teams.map(t => t.school);
      const leagues = teams.map(t => t.league);

      const uniqueSchools = new Set(schools);
      const uniqueLeagues = new Set(leagues);

      expect(uniqueSchools.size).toBeGreaterThan(1);
      expect(uniqueLeagues.size).toBeGreaterThan(1);
    });
  });
});
