require('dotenv').config(); // 👈 loads your .env file

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { PDFDocument, rgb } = require('pdf-lib');
const { writeFileSync } = require('fs');
const { tmpdir } = require('os');
const { join } = require('path');
admin.initializeApp();
const db = admin.firestore();

exports.generateDailyReports = functions.pubsub.schedule('every 24 hours').onRun(async () => {
  console.log('📅 Generating daily reports...');
  const playersSnap = await db.collection('players').get();

  for (const doc of playersSnap.docs) {
    const playerId = doc.id;
    const player = doc.data();
    const highlightsSnap = await db.collection(`players/${playerId}/highlights`).get();

    // Get all games for this player and their grades
    const gamesSnap = await db.collection('games').where('players', 'array-contains', playerId).get();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 750]);
    const { width, height } = page.getSize();
    const fontSize = 14;

    page.drawText(`📄 DAILY REPORT — ${player.name}`, {
      x: 50,
      y: height - 50,
      size: 18,
      color: rgb(0, 0, 0)
    });

    page.drawText(`Position: ${player.position || '-'} | Rating: ${player.rating || 'N/A'}`, {
      x: 50,
      y: height - 80,
      size: fontSize
    });
    page.drawText(`School: ${player.school || '-'} | Grade: ${player.gradeLevel || '-'}`, {
      x: 50,
      y: height - 100,
      size: fontSize
    });

    let y = height - 140;
    page.drawText('📊 Latest Highlights:', { x: 50, y, size: fontSize });
    y -= 20;
    highlightsSnap.forEach((clip, index) => {
      const clipData = clip.data();
      if (clipData.clipUrl) {
        page.drawText(`${index + 1}. ${clipData.type || 'Highlight'} — ${clipData.clipUrl}`, { x: 60, y, size: 10 });
        y -= 12;
      }
    });

    y -= 20;
    page.drawText('🧠 Game Grades:', { x: 50, y, size: fontSize });
    y -= 20;
    gamesSnap.forEach((g, index) => {
      const game = g.data();
      // Try to find this player's grade in the game
      let gradeLetter = "-";
      if (game.playersData && Array.isArray(game.playersData)) {
        const playerData = game.playersData.find(p => p.playerId === playerId);
        if (playerData && playerData.grade && playerData.grade.letter) {
          gradeLetter = playerData.grade.letter;
        }
      } else if (game.grade && game.playerId === playerId) {
        gradeLetter = game.grade.letter || "-";
      }
      page.drawText(`${index + 1}. ${game.date || 'Unknown'}: Grade ${gradeLetter}`, { x: 60, y, size: 10 });
      y -= 12;
    });

    const pdfBytes = await pdfDoc.save();
    const filePath = join(tmpdir(), `${playerId}_daily_report.pdf`);
    writeFileSync(filePath, pdfBytes);

    await admin.storage().bucket().upload(filePath, {
      destination: `reports/${playerId}/daily.pdf`,
      metadata: { contentType: 'application/pdf' }
    });

    console.log(`✅ Report saved for ${player.name}`);
  }

  return null;
});