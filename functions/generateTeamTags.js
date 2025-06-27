require('dotenv').config(); // 👈 loads your .env file

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.generateTeamTags = functions.firestore
  .document('games/{gameId}')
  .onWrite(async (change, context) => {
    const gameData = change.after.exists ? change.after.data() : null;
    if (!gameData || !gameData.teamName) return null;

    const teamName = gameData.teamName;
    const q = db.collection('games').where('teamName', '==', teamName);
    const snap = await q.get();

    let totalPoints = 0, totalRebounds = 0, totalAssists = 0, totalFouls = 0, totalGames = 0;
    snap.forEach(doc => {
      const g = doc.data();
      totalPoints += g.stats?.points || 0;
      totalRebounds += g.stats?.rebounds || 0;
      totalAssists += g.stats?.assists || 0;
      totalFouls += g.stats?.fouls || 0;
      totalGames++;
    });

    const avgPoints = totalGames ? totalPoints / totalGames : 0;
    const avgRebounds = totalGames ? totalRebounds / totalGames : 0;
    const avgAssists = totalGames ? totalAssists / totalGames : 0;
    const avgFouls = totalGames ? totalFouls / totalGames : 0;

    const tags = [];
    if (avgPoints >= 70) tags.push("Offensive Threat");
    if (avgRebounds >= 35) tags.push("Rebounding Machine");
    if (avgAssists >= 15) tags.push("Ball Movement Team");
    if (avgFouls < 10) tags.push("Disciplined Team");
    if (avgPoints >= 70 && avgAssists >= 15) tags.push("High Tempo Squad");
    if (avgFouls <= 8 && avgRebounds >= 30) tags.push("Defensive Powerhouse");

    await db.collection('teams').doc(teamName).set({ tags }, { merge: true });
    return null;
  });