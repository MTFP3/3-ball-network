/**
 * Sample data seeder for basketball application
 * Creates realistic test data for development and testing
 */

class DataSeeder {
  constructor() {
    this.basketballData = window.basketballData;
    this.sampleData = {
      positions: ['PG', 'SG', 'SF', 'PF', 'C'],
      schools: [
        'Lincoln High School',
        'Washington Prep',
        'Roosevelt Academy',
        'Jefferson High',
        'Madison Central',
        'Kennedy Preparatory',
        'Wilson High School',
        'Adams Charter School'
      ],
      leagues: [
        'CIF Southern Section',
        'NorCal High School League',
        'Metro Athletic Conference',
        'Pacific Coast League',
        'Valley Conference'
      ],
      firstNames: [
        'Marcus', 'Jamal', 'Tyler', 'Jordan', 'Darius', 'Kevin', 'Anthony', 'Michael',
        'Chris', 'Brandon', 'Isaiah', 'Malik', 'Trevor', 'Cameron', 'Devin', 'Austin',
        'Xavier', 'Jalen', 'Terrell', 'Quinton', 'Lamar', 'Derek', 'Andre', 'Sean'
      ],
      lastNames: [
        'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez',
        'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
        'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White'
      ]
    };
  }

  /**
   * Generate sample players
   */
  generatePlayers(count = 50) {
    const players = [];
    
    for (let i = 0; i < count; i++) {
      const firstName = this.getRandomElement(this.sampleData.firstNames);
      const lastName = this.getRandomElement(this.sampleData.lastNames);
      const position = this.getRandomElement(this.sampleData.positions);
      const school = this.getRandomElement(this.sampleData.schools);
      const graduationYear = this.getRandomNumber(2024, 2027);
      
      const player = {
        firstName,
        lastName,
        position,
        school,
        graduationYear,
        profile: {
          firstName,
          lastName,
          position,
          height: this.generateHeight(position),
          weight: this.generateWeight(position),
          birthDate: this.generateBirthDate(graduationYear),
          school,
          graduationYear,
          phoneNumber: this.generatePhoneNumber(),
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
          bio: `Talented ${position} from ${school} with strong fundamentals and work ethic.`
        },
        stats: this.generateStats(position),
        recruitment: {
          status: this.getRandomElement(['uncommitted', 'verbally_committed', 'signed']),
          interests: this.generateInterests(),
          offers: this.generateOffers(),
          visits: []
        },
        academics: {
          gpa: this.getRandomNumber(2.5, 4.0, 2),
          satScore: this.getRandomNumber(900, 1600),
          actScore: this.getRandomNumber(18, 36)
        }
      };
      
      players.push(player);
    }
    
    return players;
  }

  /**
   * Generate sample teams
   */
  generateTeams(count = 16) {
    const teams = [];
    
    for (let i = 0; i < count; i++) {
      const school = this.sampleData.schools[i % this.sampleData.schools.length];
      const mascots = ['Eagles', 'Lions', 'Tigers', 'Bears', 'Hawks', 'Wildcats', 'Panthers', 'Bulldogs'];
      const mascot = this.getRandomElement(mascots);
      
      const team = {
        name: `${school} ${mascot}`,
        school: school,
        league: this.getRandomElement(this.sampleData.leagues),
        division: this.getRandomElement(['Division I', 'Division II', 'Division III']),
        conference: this.getRandomElement(['North', 'South', 'East', 'West']),
        coach: this.generateCoachName(),
        season: {
          year: 2024,
          wins: this.getRandomNumber(5, 25),
          losses: this.getRandomNumber(2, 15),
          conference: this.getRandomElement(['North', 'South', 'East', 'West'])
        },
        stats: {
          pointsPerGame: this.getRandomNumber(45, 85, 1),
          reboundsPerGame: this.getRandomNumber(25, 45, 1),
          assistsPerGame: this.getRandomNumber(8, 20, 1),
          fieldGoalPercentage: this.getRandomNumber(35, 55, 1)
        },
        colors: {
          primary: this.getRandomElement(['#FF0000', '#0000FF', '#008000', '#800080', '#FFA500']),
          secondary: this.getRandomElement(['#FFFFFF', '#000000', '#C0C0C0', '#FFD700'])
        }
      };
      
      teams.push(team);
    }
    
    return teams;
  }

  /**
   * Generate sample games
   */
  generateGames(teams, count = 100) {
    const games = [];
    
    for (let i = 0; i < count; i++) {
      const homeTeam = this.getRandomElement(teams);
      let awayTeam = this.getRandomElement(teams);
      
      // Ensure different teams
      while (awayTeam.id === homeTeam.id) {
        awayTeam = this.getRandomElement(teams);
      }
      
      const gameDate = this.generateGameDate();
      const isCompleted = gameDate < new Date();
      
      const game = {
        homeTeam: homeTeam.id,
        awayTeam: awayTeam.id,
        homeTeamName: homeTeam.name,
        awayTeamName: awayTeam.name,
        date: gameDate,
        location: `${homeTeam.school} Gymnasium`,
        status: isCompleted ? 'completed' : this.getRandomElement(['scheduled', 'in-progress']),
        score: isCompleted ? {
          home: this.getRandomNumber(45, 85),
          away: this.getRandomNumber(45, 85)
        } : { home: 0, away: 0 },
        quarter: isCompleted ? 4 : this.getRandomNumber(1, 4),
        timeRemaining: isCompleted ? '00:00' : this.generateTimeRemaining(),
        isPlayoff: this.getRandomNumber(1, 10) > 8, // 20% chance of playoff game
        season: 2024,
        attendance: this.getRandomNumber(50, 500)
      };
      
      games.push(game);
    }
    
    return games;
  }

  /**
   * Generate sample scouting reports
   */
  generateScoutingReports(players, count = 30) {
    const reports = [];
    
    for (let i = 0; i < count; i++) {
      const player = this.getRandomElement(players);
      
      const report = {
        playerId: player.id,
        scoutId: 'scout_' + this.getRandomNumber(1, 10),
        date: this.generateScoutingDate(),
        ratings: {
          overall: this.getRandomNumber(6, 10, 1),
          shooting: this.getRandomNumber(5, 10, 1),
          ballHandling: this.getRandomNumber(5, 10, 1),
          defense: this.getRandomNumber(5, 10, 1),
          athleticism: this.getRandomNumber(5, 10, 1),
          basketball_iq: this.getRandomNumber(5, 10, 1),
          leadership: this.getRandomNumber(5, 10, 1)
        },
        notes: this.generateScoutingNotes(player),
        strengths: this.generateStrengths(player.position),
        weaknesses: this.generateWeaknesses(),
        recommendations: this.generateRecommendations(),
        recruitmentLevel: this.getRandomElement(['D1', 'D2', 'D3', 'NAIA', 'Junior College']),
        isPublic: this.getRandomNumber(1, 10) > 3 // 70% public
      };
      
      reports.push(report);
    }
    
    return reports;
  }

  /**
   * Seed all data
   */
  async seedAllData() {
    try {
      console.log('Starting data seeding...');
      
      // Generate sample data
      const players = this.generatePlayers(50);
      const teams = this.generateTeams(16);
      
      console.log('Creating teams...');
      const createdTeams = [];
      for (const team of teams) {
        try {
          const createdTeam = await this.basketballData.createTeam(team);
          createdTeams.push({ ...team, id: createdTeam.id });
          console.log(`Created team: ${team.name}`);
        } catch (error) {
          console.error(`Error creating team ${team.name}:`, error);
        }
      }
      
      console.log('Creating players...');
      const createdPlayers = [];
      for (const player of players) {
        try {
          const createdPlayer = await this.basketballData.createPlayer(player);
          createdPlayers.push({ ...player, id: createdPlayer.id });
          console.log(`Created player: ${player.firstName} ${player.lastName}`);
        } catch (error) {
          console.error(`Error creating player ${player.firstName} ${player.lastName}:`, error);
        }
      }
      
      console.log('Creating games...');
      const games = this.generateGames(createdTeams, 50);
      for (const game of games) {
        try {
          await this.basketballData.createGame(game);
          console.log(`Created game: ${game.homeTeamName} vs ${game.awayTeamName}`);
        } catch (error) {
          console.error('Error creating game:', error);
        }
      }
      
      console.log('Creating scouting reports...');
      const reports = this.generateScoutingReports(createdPlayers, 25);
      for (const report of reports) {
        try {
          await this.basketballData.createScoutingReport(report);
          console.log(`Created scouting report for player ${report.playerId}`);
        } catch (error) {
          console.error('Error creating scouting report:', error);
        }
      }
      
      console.log('Data seeding completed successfully!');
      return {
        players: createdPlayers.length,
        teams: createdTeams.length,
        games: games.length,
        reports: reports.length
      };
      
    } catch (error) {
      console.error('Error during data seeding:', error);
      throw error;
    }
  }

  // Helper methods
  getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  getRandomNumber(min, max, decimals = 0) {
    const random = Math.random() * (max - min) + min;
    return decimals > 0 ? parseFloat(random.toFixed(decimals)) : Math.floor(random);
  }

  generateHeight(position) {
    const heightRanges = {
      'PG': [68, 74], // 5'8" - 6'2"
      'SG': [70, 76], // 5'10" - 6'4"
      'SF': [72, 78], // 6'0" - 6'6"
      'PF': [74, 80], // 6'2" - 6'8"
      'C': [76, 84]   // 6'4" - 7'0"
    };
    
    const range = heightRanges[position] || [70, 76];
    const inches = this.getRandomNumber(range[0], range[1]);
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  }

  generateWeight(position) {
    const weightRanges = {
      'PG': [150, 190],
      'SG': [160, 200],
      'SF': [180, 220],
      'PF': [200, 240],
      'C': [220, 280]
    };
    
    const range = weightRanges[position] || [170, 200];
    return this.getRandomNumber(range[0], range[1]);
  }

  generateBirthDate(graduationYear) {
    const birthYear = graduationYear - 18;
    const month = this.getRandomNumber(1, 12);
    const day = this.getRandomNumber(1, 28);
    return new Date(birthYear, month - 1, day);
  }

  generatePhoneNumber() {
    const area = this.getRandomNumber(200, 999);
    const exchange = this.getRandomNumber(200, 999);
    const number = this.getRandomNumber(1000, 9999);
    return `(${area}) ${exchange}-${number}`;
  }

  generateStats(position) {
    const baseStats = {
      'PG': { points: 12, rebounds: 4, assists: 8, steals: 2.5, blocks: 0.3 },
      'SG': { points: 16, rebounds: 5, assists: 3, steals: 1.8, blocks: 0.5 },
      'SF': { points: 14, rebounds: 7, assists: 4, steals: 1.5, blocks: 1.0 },
      'PF': { points: 12, rebounds: 9, assists: 2, steals: 1.0, blocks: 1.5 },
      'C': { points: 10, rebounds: 11, assists: 1.5, steals: 0.8, blocks: 2.5 }
    };
    
    const base = baseStats[position] || baseStats['SF'];
    
    return {
      season: 2024,
      gamesPlayed: this.getRandomNumber(15, 30),
      points: this.getRandomNumber(base.points - 5, base.points + 10, 1),
      rebounds: this.getRandomNumber(base.rebounds - 2, base.rebounds + 5, 1),
      assists: this.getRandomNumber(base.assists - 1, base.assists + 3, 1),
      steals: this.getRandomNumber(base.steals - 0.5, base.steals + 1, 1),
      blocks: this.getRandomNumber(base.blocks - 0.2, base.blocks + 1, 1),
      fieldGoalPercentage: this.getRandomNumber(35, 60, 1),
      threePointPercentage: this.getRandomNumber(25, 45, 1),
      freeThrowPercentage: this.getRandomNumber(60, 90, 1)
    };
  }

  generateInterests() {
    const colleges = [
      'UCLA', 'Duke', 'UNC', 'Kentucky', 'Kansas', 'Gonzaga', 'Villanova',
      'Michigan State', 'Arizona', 'Louisville', 'Syracuse', 'Florida'
    ];
    
    const count = this.getRandomNumber(2, 6);
    const interests = [];
    
    for (let i = 0; i < count; i++) {
      const college = this.getRandomElement(colleges);
      if (!interests.includes(college)) {
        interests.push(college);
      }
    }
    
    return interests;
  }

  generateOffers() {
    const offers = [];
    const offerCount = this.getRandomNumber(0, 4);
    
    for (let i = 0; i < offerCount; i++) {
      offers.push({
        school: this.getRandomElement(['State University', 'Tech College', 'Community College']),
        level: this.getRandomElement(['D1', 'D2', 'D3', 'NAIA']),
        scholarship: this.getRandomElement(['Full', 'Partial', 'Academic']),
        date: this.generateScoutingDate()
      });
    }
    
    return offers;
  }

  generateCoachName() {
    const coachNames = [
      'Coach Johnson', 'Coach Williams', 'Coach Davis', 'Coach Miller',
      'Coach Wilson', 'Coach Moore', 'Coach Taylor', 'Coach Anderson'
    ];
    return this.getRandomElement(coachNames);
  }

  generateGameDate() {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
    const oneMonthFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    const randomTime = threeMonthsAgo.getTime() + Math.random() * (oneMonthFromNow.getTime() - threeMonthsAgo.getTime());
    return new Date(randomTime);
  }

  generateScoutingDate() {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000));
    
    const randomTime = sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime());
    return new Date(randomTime);
  }

  generateTimeRemaining() {
    const minutes = this.getRandomNumber(0, 12);
    const seconds = this.getRandomNumber(0, 59);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  generateScoutingNotes(player) {
    const notes = [
      `${player.firstName} shows great potential with strong fundamentals.`,
      `Excellent court vision and basketball IQ. Needs to work on consistency.`,
      `Athletic player with good size for position. Developing skill set.`,
      `Strong work ethic and coachable attitude. Good team player.`,
      `Natural scorer with good range. Could improve defensive intensity.`
    ];
    return this.getRandomElement(notes);
  }

  generateStrengths(position) {
    const positionStrengths = {
      'PG': ['Ball handling', 'Court vision', 'Leadership', 'Speed'],
      'SG': ['Shooting', 'Scoring', 'Athletic ability', 'Perimeter defense'],
      'SF': ['Versatility', 'Size', 'Basketball IQ', 'Rebounding'],
      'PF': ['Post play', 'Rebounding', 'Strength', 'Mid-range shooting'],
      'C': ['Post presence', 'Shot blocking', 'Rebounding', 'Interior defense']
    };
    
    const strengths = positionStrengths[position] || positionStrengths['SF'];
    const count = this.getRandomNumber(2, 4);
    return strengths.slice(0, count);
  }

  generateWeaknesses() {
    const weaknesses = [
      'Needs to improve strength',
      'Inconsistent shooting',
      'Turnovers in traffic',
      'Defensive positioning',
      'Free throw shooting',
      'Conditioning'
    ];
    
    const count = this.getRandomNumber(1, 3);
    return weaknesses.slice(0, count);
  }

  generateRecommendations() {
    const recommendations = [
      'Continue developing skills with current training program.',
      'Focus on strength and conditioning during off-season.',
      'Work with shooting coach to improve consistency.',
      'Attend elite basketball camps for exposure.',
      'Maintain academic standards for college eligibility.'
    ];
    
    return this.getRandomElement(recommendations);
  }
}

// Create global instance
window.dataSeeder = new DataSeeder();

// Export for ES6 modules
export default DataSeeder;
