import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { analyzeGame } from "./gameAnalyzer.js";

initializeApp();
const db = getFirestore();

export const runGameAnalyzer = onDocumentCreated("games/{gameId}", async (event) => {
  const gameData = event.data?.data();
  if (!gameData || !gameData.videoUrl) return;

  const analysis = analyzeGame(gameData);

  await db.collection("games").doc(event.params.gameId).update({
    analysis,
    analysisTimestamp: new Date().toISOString(),
  });

  console.log("✅ Game analyzed:", event.params.gameId);
});