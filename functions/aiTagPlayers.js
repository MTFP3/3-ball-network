require('dotenv').config(); // 👈 loads your .env file

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.tagPlayersFromVideo = functions.firestore
  .document('games/{gameId}')
  .onUpdate(async (change, context) => {
    const gameId = context.params.gameId;
    const game = change.after.data();

    if (!game.videoUrl || game.analysisStatus !== 'pending-tagging') return null;

    console.log(`🎥 Tagging players for game: ${gameId}`);

    const { videoUrl, teamName, roster, school } = game;
    const playersSnap = await db.collection('players').where('school', '==', school).get();

    const jerseyMap = {};
    playersSnap.forEach(doc => {
      const p = doc.data();
      if (p.jersey) jerseyMap[p.jersey] = doc.id;
    });

    // 🔍 Simulated detection for demo
    const detected = [
      { jersey: 12, type: 'rebound', timestamp: 138 },
      { jersey: 4, type: 'steal', timestamp: 254 }
    ];

    for (const d of detected) {
      const playerId = jerseyMap[d.jersey] || 'unknown';
      await db.collection(`playerStats/${gameId}/plays`).add({
        ...d,
        playerId,
        autoTagged: true
      });
    }

    await db.doc(`games/${gameId}`).update({ taggingStatus: 'complete' });
    console.log('✅ Player tagging complete');
    return null;
  });