require('dotenv').config();
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.generateSmartTags = functions.firestore
  .document('playerStats/{gameId}/plays/{playId}')
  .onWrite(async (change, context) => {
    const { gameId } = context.params;
    const snap = await db.collection(`playerStats/${gameId}/plays`).get();
    const byPlayer = {};

    snap.forEach(doc => {
      const p = doc.data();
      if (!byPlayer[p.playerId]) byPlayer[p.playerId] = [];
      byPlayer[p.playerId].push(p);
    });

    for (const [playerId, plays] of Object.entries(byPlayer)) {
      const counts = {};
      plays.forEach(p => {
        counts[p.type] = (counts[p.type] || 0) + 1;
      });

      const tags = [];
      if ((counts['3pt'] || 0) >= 3) tags.push('3PT Specialist');
      if ((counts.rebound || 0) >= 10) tags.push('Elite Rebounder');
      if ((counts.block || 0) >= 3) tags.push('Rim Protector');
      if ((counts.steal || 0) >= 3) tags.push('Lockdown Defender');
      if ((counts.transition || 0) >= 5) tags.push('Fast Break Threat');
      if ((counts.clutch || 0) >= 2) tags.push('Clutch Performer');

      await db.collection('players').doc(playerId).update({ tags });
    }

    return null;
  });