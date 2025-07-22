const {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} = require('@firebase/rules-unit-testing');
const {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

describe('Firestore Security Rules', () => {
  let testEnv;
  let authenticatedDb;
  let unauthenticatedDb;
  let playerDb;
  let coachDb;
  let adminDb;

  const projectId = 'test-3ball-network';

  beforeAll(async () => {
    // Initialize test environment with security rules
    testEnv = await initializeTestEnvironment({
      projectId,
      firestore: {
        rules: fs.readFileSync(
          path.join(__dirname, '../../../firestore.rules'),
          'utf8'
        ),
        host: 'localhost',
        port: 8080,
      },
    });

    // Create authenticated contexts for different user types
    authenticatedDb = testEnv.authenticatedContext('test-user').firestore();
    unauthenticatedDb = testEnv.unauthenticatedContext().firestore();

    playerDb = testEnv
      .authenticatedContext('player-user', {
        uid: 'player-user',
        role: 'player',
        email: 'player@test.com',
      })
      .firestore();

    coachDb = testEnv
      .authenticatedContext('coach-user', {
        uid: 'coach-user',
        role: 'coach',
        email: 'coach@test.com',
      })
      .firestore();

    adminDb = testEnv
      .authenticatedContext('admin-user', {
        uid: 'admin-user',
        role: 'admin',
        email: 'admin@test.com',
      })
      .firestore();
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  describe('Authentication Requirements', () => {
    test('denies access to unauthenticated users', async () => {
      await assertFails(
        setDoc(doc(unauthenticatedDb, 'players/test-player'), {
          name: 'Test Player',
          email: 'test@example.com',
        })
      );
    });

    test('allows access to authenticated users', async () => {
      await assertSucceeds(
        setDoc(doc(authenticatedDb, 'players/test-user'), {
          name: 'Test User',
          email: 'test@example.com',
          uid: 'test-user',
        })
      );
    });
  });

  describe('Player Collection Rules', () => {
    test('allows players to create their own profile', async () => {
      await assertSucceeds(
        setDoc(doc(playerDb, 'players/player-user'), {
          name: 'Player Name',
          email: 'player@test.com',
          uid: 'player-user',
          role: 'player',
          stats: {},
          createdAt: new Date(),
        })
      );
    });

    test('prevents players from creating profiles for others', async () => {
      await assertFails(
        setDoc(doc(playerDb, 'players/other-user'), {
          name: 'Other Player',
          email: 'other@test.com',
          uid: 'other-user',
          role: 'player',
        })
      );
    });

    test('allows players to read their own profile', async () => {
      // First create the profile
      await setDoc(doc(playerDb, 'players/player-user'), {
        name: 'Player Name',
        email: 'player@test.com',
        uid: 'player-user',
        role: 'player',
        private: true,
      });

      await assertSucceeds(getDoc(doc(playerDb, 'players/player-user')));
    });

    test('allows coaches to read player profiles', async () => {
      // Create a player profile
      await setDoc(doc(playerDb, 'players/player-user'), {
        name: 'Player Name',
        email: 'player@test.com',
        uid: 'player-user',
        role: 'player',
        public: true,
      });

      await assertSucceeds(getDoc(doc(coachDb, 'players/player-user')));
    });

    test('prevents players from reading private profiles of others', async () => {
      const otherPlayerDb = testEnv
        .authenticatedContext('other-player', {
          uid: 'other-player',
          role: 'player',
        })
        .firestore();

      // Create a private player profile
      await setDoc(doc(otherPlayerDb, 'players/other-player'), {
        name: 'Other Player',
        email: 'other@test.com',
        uid: 'other-player',
        role: 'player',
        private: true,
      });

      await assertFails(getDoc(doc(playerDb, 'players/other-player')));
    });

    test('allows players to update their own profiles', async () => {
      // Create initial profile
      await setDoc(doc(playerDb, 'players/player-user'), {
        name: 'Player Name',
        email: 'player@test.com',
        uid: 'player-user',
        role: 'player',
      });

      await assertSucceeds(
        updateDoc(doc(playerDb, 'players/player-user'), {
          name: 'Updated Name',
          stats: { points: 100 },
        })
      );
    });

    test('prevents players from changing their role', async () => {
      // Create initial profile
      await setDoc(doc(playerDb, 'players/player-user'), {
        name: 'Player Name',
        email: 'player@test.com',
        uid: 'player-user',
        role: 'player',
      });

      await assertFails(
        updateDoc(doc(playerDb, 'players/player-user'), {
          role: 'admin',
        })
      );
    });
  });

  describe('Games Collection Rules', () => {
    test('allows coaches to create games', async () => {
      await assertSucceeds(
        addDoc(collection(coachDb, 'games'), {
          title: 'Championship Game',
          date: new Date(),
          teams: ['Team A', 'Team B'],
          createdBy: 'coach-user',
          status: 'scheduled',
        })
      );
    });

    test('prevents players from creating games', async () => {
      await assertFails(
        addDoc(collection(playerDb, 'games'), {
          title: 'Championship Game',
          date: new Date(),
          teams: ['Team A', 'Team B'],
          createdBy: 'player-user',
        })
      );
    });

    test('allows all authenticated users to read public games', async () => {
      // Create a public game as coach
      const gameRef = await addDoc(collection(coachDb, 'games'), {
        title: 'Public Game',
        date: new Date(),
        teams: ['Team A', 'Team B'],
        createdBy: 'coach-user',
        public: true,
      });

      await assertSucceeds(getDoc(doc(playerDb, 'games', gameRef.id)));
    });

    test('prevents access to private games by non-participants', async () => {
      // Create a private game as coach
      const gameRef = await addDoc(collection(coachDb, 'games'), {
        title: 'Private Game',
        date: new Date(),
        teams: ['Team A', 'Team B'],
        createdBy: 'coach-user',
        private: true,
        participants: ['coach-user'],
      });

      await assertFails(getDoc(doc(playerDb, 'games', gameRef.id)));
    });
  });

  describe('Highlights Collection Rules', () => {
    test('allows players to create highlights for their own videos', async () => {
      await assertSucceeds(
        addDoc(collection(playerDb, 'highlights'), {
          videoId: 'video-123',
          playerId: 'player-user',
          startTime: 30,
          endTime: 45,
          type: 'shot',
          createdBy: 'player-user',
        })
      );
    });

    test('prevents players from creating highlights for others', async () => {
      await assertFails(
        addDoc(collection(playerDb, 'highlights'), {
          videoId: 'video-123',
          playerId: 'other-player',
          startTime: 30,
          endTime: 45,
          type: 'shot',
          createdBy: 'player-user',
        })
      );
    });

    test('allows coaches to create highlights for any player', async () => {
      await assertSucceeds(
        addDoc(collection(coachDb, 'highlights'), {
          videoId: 'video-123',
          playerId: 'player-user',
          startTime: 30,
          endTime: 45,
          type: 'shot',
          createdBy: 'coach-user',
        })
      );
    });
  });

  describe('Analytics Collection Rules', () => {
    test('allows reading analytics for own data', async () => {
      // Create analytics data
      await setDoc(doc(adminDb, 'analytics/player-stats'), {
        playerId: 'player-user',
        stats: { points: 100, games: 10 },
        createdAt: new Date(),
      });

      // Player can read their own analytics
      await assertSucceeds(getDoc(doc(playerDb, 'analytics/player-stats')));
    });

    test('allows coaches and admins to read all analytics', async () => {
      // Create analytics data
      await setDoc(doc(adminDb, 'analytics/team-stats'), {
        teamId: 'team-123',
        stats: { wins: 10, losses: 5 },
        createdAt: new Date(),
      });

      await assertSucceeds(getDoc(doc(coachDb, 'analytics/team-stats')));

      await assertSucceeds(getDoc(doc(adminDb, 'analytics/team-stats')));
    });

    test('prevents regular players from reading others analytics', async () => {
      // Create analytics data for another player
      await setDoc(doc(adminDb, 'analytics/other-player-stats'), {
        playerId: 'other-player',
        stats: { points: 200, games: 15 },
        createdAt: new Date(),
      });

      await assertFails(getDoc(doc(playerDb, 'analytics/other-player-stats')));
    });
  });

  describe('Admin Collection Rules', () => {
    test('allows only admins to read admin data', async () => {
      await setDoc(doc(adminDb, 'admin/system-config'), {
        aiModelVersion: '2.1',
        maxUploadSize: 500,
        updatedAt: new Date(),
      });

      await assertSucceeds(getDoc(doc(adminDb, 'admin/system-config')));

      await assertFails(getDoc(doc(playerDb, 'admin/system-config')));

      await assertFails(getDoc(doc(coachDb, 'admin/system-config')));
    });

    test('allows only admins to write admin data', async () => {
      await assertSucceeds(
        setDoc(doc(adminDb, 'admin/new-config'), {
          setting: 'value',
          updatedBy: 'admin-user',
        })
      );

      await assertFails(
        setDoc(doc(playerDb, 'admin/hack-attempt'), {
          malicious: 'data',
        })
      );
    });
  });

  describe('Flags Collection Rules', () => {
    test('allows users to create flags for inappropriate content', async () => {
      await assertSucceeds(
        addDoc(collection(playerDb, 'flags'), {
          contentId: 'video-123',
          contentType: 'video',
          reason: 'inappropriate',
          reportedBy: 'player-user',
          createdAt: new Date(),
        })
      );
    });

    test('allows admins to read and update flags', async () => {
      const flagRef = await addDoc(collection(playerDb, 'flags'), {
        contentId: 'video-123',
        contentType: 'video',
        reason: 'inappropriate',
        reportedBy: 'player-user',
        status: 'pending',
      });

      await assertSucceeds(getDoc(doc(adminDb, 'flags', flagRef.id)));

      await assertSucceeds(
        updateDoc(doc(adminDb, 'flags', flagRef.id), {
          status: 'resolved',
          resolvedBy: 'admin-user',
          resolvedAt: new Date(),
        })
      );
    });

    test('prevents regular users from reading others flags', async () => {
      const flagRef = await addDoc(collection(playerDb, 'flags'), {
        contentId: 'video-123',
        contentType: 'video',
        reason: 'inappropriate',
        reportedBy: 'player-user',
      });

      const otherPlayerDb = testEnv
        .authenticatedContext('other-player', {
          uid: 'other-player',
          role: 'player',
        })
        .firestore();

      await assertFails(getDoc(doc(otherPlayerDb, 'flags', flagRef.id)));
    });
  });

  describe('Data Validation Rules', () => {
    test('enforces required fields on player profiles', async () => {
      await assertFails(
        setDoc(doc(playerDb, 'players/player-user'), {
          name: 'Player Name',
          // Missing required fields: email, uid
        })
      );
    });

    test('validates email format', async () => {
      await assertFails(
        setDoc(doc(playerDb, 'players/player-user'), {
          name: 'Player Name',
          email: 'invalid-email',
          uid: 'player-user',
        })
      );
    });

    test('enforces data types', async () => {
      await assertFails(
        setDoc(doc(playerDb, 'players/player-user'), {
          name: 'Player Name',
          email: 'player@test.com',
          uid: 'player-user',
          stats: 'invalid-stats-type', // Should be object
        })
      );
    });

    test('validates game data structure', async () => {
      await assertFails(
        addDoc(collection(coachDb, 'games'), {
          title: 'Game',
          // Missing required fields: date, teams
          createdBy: 'coach-user',
        })
      );
    });
  });

  describe('Performance and Scalability', () => {
    test('allows efficient querying with proper indexes', async () => {
      // Create multiple player profiles
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          setDoc(doc(adminDb, `players/player-${i}`), {
            name: `Player ${i}`,
            email: `player${i}@test.com`,
            uid: `player-${i}`,
            role: 'player',
            team: i < 5 ? 'Team A' : 'Team B',
            active: true,
          })
        );
      }
      await Promise.all(promises);

      // Query should work efficiently with indexed fields
      await assertSucceeds(
        getDocs(
          query(
            collection(coachDb, 'players'),
            where('team', '==', 'Team A'),
            where('active', '==', true)
          )
        )
      );
    });

    test('handles batch operations correctly', async () => {
      const batch = [];

      // Batch create multiple highlights
      for (let i = 0; i < 5; i++) {
        batch.push(
          addDoc(collection(playerDb, 'highlights'), {
            videoId: `video-${i}`,
            playerId: 'player-user',
            startTime: i * 10,
            endTime: i * 10 + 5,
            type: 'shot',
            createdBy: 'player-user',
          })
        );
      }

      await assertSucceeds(Promise.all(batch));
    });
  });
});
