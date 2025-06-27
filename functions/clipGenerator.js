require('dotenv').config(); // 👈 loads your .env file

admin.initializeApp();
const db = admin.firestore();

// Simulated AI analyzer (replace with actual model or video API call)
function detectHighlights(videoUrl) {
  return [
    { playerId: 'player1', start: 12, end: 17, type: 'made_shot' },
    { playerId: 'player2', start: 45, end: 50, type: 'assist' },
    { playerId: 'player1', start: 90, end: 95, type: 'steal' }
  ];
}

exports.generateHighlights = functions.firestore
  .document('games/{gameId}')
  .onCreate(async (snap, context) => {
    const gameId = context.params.gameId;
    const data = snap.data();
    const videoUrl = data.videoUrl;

    if (!videoUrl) return null;

    console.log(`🎬 Processing highlights for: ${gameId}`);

    const highlights = detectHighlights(videoUrl);

    const batch = db.batch();
    for (const clip of highlights) {
      const clipId = `${clip.playerId}_${clip.start}`;
      const clipData = {
        ...clip,
        clipUrl: `${videoUrl}#t=${clip.start},${clip.end}`
      };

      const gameClipRef = db.doc(`games/${gameId}/clips/${clipId}`);
      const playerClipRef = db.doc(`players/${clip.playerId}/highlights/${clipId}`);

      batch.set(gameClipRef, clipData);
      batch.set(playerClipRef, {
        ...clipData,
        gameId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    await batch.commit();
    console.log(`✅ ${highlights.length} clips saved for game ${gameId}`);

    // Optionally update analysis status
    await db.doc(`games/${gameId}`).update({
      analysisStatus: "complete",
      highlightsGeneratedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return null;
  });