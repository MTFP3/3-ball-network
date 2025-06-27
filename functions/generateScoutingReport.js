
require('dotenv').config(); // 👈 loads your .env file

const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.generateScoutingReport = functions.firestore
  .document('playerStats/{gameId}/plays/{playId}')
  .onWrite(async (change, context) => {
    const { gameId } = context.params;
    const playsSnap = await db.collection(`playerStats/${gameId}/plays`).get();

    const playerPlays = {};
    playsSnap.forEach(doc => {
      const d = doc.data();
      if (!playerPlays[d.playerId]) playerPlays[d.playerId] = [];
      playerPlays[d.playerId].push(d);
    });

    for (const [playerId, plays] of Object.entries(playerPlays)) {
      const strengths = [];
      const areasForImprovement = [];
      const counts = {};
      plays.forEach(p => {
        counts[p.type] = (counts[p.type] || 0) + 1;
      });

      if ((counts.rebound || 0) >= 5) strengths.push('Rebounding');
      if ((counts.steal || 0) >= 3) strengths.push('Defensive Instincts');
      if ((counts.turnover || 0) >= 4) areasForImprovement.push('Turnover Control');
      if ((counts.foul || 0) >= 3) areasForImprovement.push('Discipline');

      const grade = strengths.length >= 2 ? 'A-' : strengths.length === 1 ? 'B' : 'C';

      const summary = `Player ${playerId} showed ${strengths.length ? strengths.join(", ") : "no standout strengths"} with ${plays.length} total plays.`;

      await db.doc(`scoutingReports/${gameId}_${playerId}`).set({
        playerId,
        gameId,
        report: summary,
        strengths,
        areasForImprovement,
        grade,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    return null;
  });