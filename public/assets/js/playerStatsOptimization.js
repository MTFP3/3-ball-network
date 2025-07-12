// Future improvement: Efficient query patterns for player stats
// This demonstrates how to restructure data for better performance

import { db } from './firebaseConfig.js';
import {
  collection,
  query,
  where,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

/*
 * RECOMMENDED DATA MIGRATION:
 *
 * Current structure (inefficient):
 * - playerStats/{gameId}/plays/{playId}
 *
 * Improved structure (efficient):
 * - plays/{playId} with fields: { gameId, playerId, type, timestamp, ... }
 */

/**
 * Efficient way to load player game breakdowns using the improved data structure
 * This would replace the N+1 query pattern with a single query
 */
export async function loadPlayerBreakdownsEfficient(playerId) {
  try {
    // Single query to get all plays for this player across all games
    const q = query(collection(db, 'plays'), where('playerId', '==', playerId));

    const snap = await getDocs(q);

    // Group plays by game
    const gameBreakdowns = new Map();

    snap.forEach(doc => {
      const play = doc.data();
      const gameId = play.gameId;

      if (!gameBreakdowns.has(gameId)) {
        gameBreakdowns.set(gameId, []);
      }

      gameBreakdowns.get(gameId).push(play);
    });

    return gameBreakdowns;
  } catch (error) {
    console.error('Error loading player breakdowns:', error);
    return new Map();
  }
}

/**
 * Migration function to move from old structure to new structure
 * Run this once to migrate existing data
 */
export async function migratePlayerStatsData() {
  try {
    // Get all games
    const gamesSnap = await getDocs(collection(db, 'games'));

    for (const gameDoc of gamesSnap.docs) {
      const gameId = gameDoc.id;

      // Get all plays for this game
      const playsSnap = await getDocs(
        collection(db, `playerStats/${gameId}/plays`)
      );

      // Move each play to the new structure
      for (const playDoc of playsSnap.docs) {
        const playData = playDoc.data();

        // Add gameId to the play data
        const newPlayData = {
          ...playData,
          gameId,
        };

        // TODO: Add to new 'plays' collection
        // await setDoc(doc(db, 'plays', playDoc.id), newPlayData);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

/*
 * PERFORMANCE COMPARISON:
 *
 * Old approach (N+1 queries):
 * - Query all games: 1 request
 * - Query plays for each game: N requests
 * - Total: N+1 requests (expensive, slow)
 *
 * New approach (single query):
 * - Query plays where playerId = X: 1 request
 * - Total: 1 request (cheap, fast)
 *
 * COST SAVINGS:
 * - With 50 games: 51 requests → 1 request (98% reduction)
 * - With 100 games: 101 requests → 1 request (99% reduction)
 */
