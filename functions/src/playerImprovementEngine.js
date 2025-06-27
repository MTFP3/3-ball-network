const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

admin.initializeApp();
const db = admin.firestore();

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

exports.runPlayerImprovementEngine = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const playersSnap = await db.collection("players").get();

  for (const doc of playersSnap.docs) {
    const playerId = doc.id;
    const player = doc.data();
    const stats = player.stats || {};

    const prompt = `You are a basketball skills trainer. Analyze this player's current performance and give 3 focused areas for improvement along with suggested drills. 

Player: ${player.name}
Position: ${player.position || "Unknown"}
Points: ${stats.points || 0}
Assists: ${stats.assists || 0}
Rebounds: ${stats.rebounds || 0}
Steals: ${stats.steals || 0}
Blocks: ${stats.blocks || 0}
Turnovers: ${stats.turnovers || 0}
Game Grade Average: ${player.avgGrade || "N/A"}

Return a list of improvement areas + drills.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300
    });

    const plan = completion.data.choices[0].message.content;

    await db.collection("playerImprovement").doc(playerId).set({
      plan,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  console.log("✅ Player Improvement Engine ran for all players");
  return null;
});