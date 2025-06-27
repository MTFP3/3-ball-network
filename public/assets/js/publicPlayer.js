require('dotenv').config(); // 👈 loads your .env file

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore,
  doc,
  getDoc
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { Chart } from 'https://cdn.jsdelivr.net/npm/chart.js';

const firebaseConfig = {
  apiKey: "AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0",
  authDomain: "ball-network-web.firebaseapp.com",
  projectId: "ball-network-web",
  storageBucket: "ball-network-web.appspot.com",
  messagingSenderId: "740915998465",
  appId: "1:740915998465:web:59ac026f3f4c2ec5da3500"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const urlParams = new URLSearchParams(window.location.search);
const playerId = urlParams.get("id") || "demoPlayer";

async function loadPublicPlayer() {
  const ref = doc(db, "players", playerId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  document.getElementById("playerName").textContent = data.name;
  document.getElementById("name").textContent = data.name;
  document.getElementById("position").textContent = data.position;
  document.getElementById("height").textContent = data.height;
  document.getElementById("weight").textContent = data.weight;
  document.getElementById("school").textContent = data.school;
  document.getElementById("state").textContent = data.state;
  document.getElementById("rating").textContent = data.rating || "TBD";
  document.getElementById("avgGrade").textContent = data.avgGameGrade?.letter || "-";
  document.getElementById("profilePic").src = data.photoUrl || "/assets/images/default-avatar.png";
  document.getElementById("resumePreview").src = data.resumeUrl || "https://example.com/sample-resume.pdf";
  document.getElementById("highlightVideo").src = data.highlightUrl || "";

  if (data.heatmap?.shotLocations) renderHeatmap(data.heatmap.shotLocations);
}

function renderHeatmap(locations) {
  const ctx = document.getElementById("heatmapChart").getContext("2d");
  const made = locations.filter(s => s.result === "made").map(p => ({ x: p.x, y: p.y }));
  const missed = locations.filter(s => s.result === "missed").map(p => ({ x: p.x, y: p.y }));

  new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        { label: "Made Shots", data: made, pointStyle: "circle", backgroundColor: "green" },
        { label: "Missed Shots", data: missed, pointStyle: "x", backgroundColor: "red" }
      ]
    },
    options: {
      scales: {
        x: { min: 0, max: 100 },
        y: { min: 0, max: 100 }
      },
      plugins: {
        legend: { position: "top" }
      }
    }
  });
}

loadPublicPlayer();