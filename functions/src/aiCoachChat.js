const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

admin.initializeApp();
const db = admin.firestore();

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

exports.onNewCoachChat = functions.firestore
  .document("chats/{playerId}/messages/{messageId}")
  .onCreate(async (snap, context) => {
    const { playerId } = context.params;
    const data = snap.data();

    if (data.sender === "ai") return null; // Skip AI replies

    const statsSnap = await db.collection("players").doc(playerId).get();
    const playerData = statsSnap.exists ? statsSnap.data() : {};

    const prompt = `You are an AI basketball coach.
Player: ${playerData.name || "Unknown"}
Height: ${playerData.height || "-"}, Weight: ${playerData.weight || "-"}
Average Grade: ${playerData.avgGrade || "N/A"}
Stats: Points ${playerData.stats?.points || 0}, Rebounds ${playerData.stats?.rebounds || 0}, Assists ${playerData.stats?.assists || 0}, Steals ${playerData.stats?.steals || 0}, Blocks ${playerData.stats?.blocks || 0}

The player asked: "${data.text}"
Give a helpful and specific coaching response.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300
    });

    const reply = completion.data.choices[0].message.content;

    await db
      .collection("chats")
      .doc(playerId)
      .collection("messages")
      .add({
        sender: "ai",
        text: reply,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

    return null;
  });