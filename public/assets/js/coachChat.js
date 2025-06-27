import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

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

const playerId = localStorage.getItem("playerId") || "demoPlayer";
const chatRef = collection(db, "chats", playerId, "messages");
const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");

onSnapshot(query(chatRef, orderBy("timestamp")), snapshot => {
  chatBox.innerHTML = "";
  snapshot.forEach(doc => {
    const msg = doc.data();
    const bubble = document.createElement("div");
    bubble.style.margin = "10px 0";
    bubble.style.padding = "10px";
    bubble.style.borderRadius = "10px";
    bubble.style.background = msg.sender === "ai" ? "#eef" : "#def";
    bubble.textContent = `${msg.sender === "ai" ? "Coach" : "You"}: ${msg.text}`;
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
  });
});

window.sendCoachMessage = async () => {
  const text = chatInput.value.trim();
  if (!text) return;
  await addDoc(chatRef, {
    sender: "player",
    text,
    timestamp: serverTimestamp()
  });
  chatInput.value = "";
};