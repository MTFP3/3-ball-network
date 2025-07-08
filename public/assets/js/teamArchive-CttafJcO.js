import"./modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-glEpLKVF.js";import"./modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-BGxEsOWE-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-Bt-Pzaey-CYcforwy-CYcforwy-CYcforwy-CYcforwy.js";import"./modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV-C2dq2EgV.js";import{initializeApp as s}from"https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";import{getFirestore as p,collection as c,getDocs as m}from"https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";/* empty css                                         */require("dotenv").config();const l={apiKey:"AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0",authDomain:"ball-network-web.firebaseapp.com",projectId:"ball-network-web",storageBucket:"ball-network-web.appspot.com",messagingSenderId:"740915998465",appId:"1:740915998465:web:59ac026f3f4c2ec5da3500"},d=s(l),g=p(d),n=new URLSearchParams(window.location.search).get("team")||"demoTeam";document.getElementById("teamTitle").textContent=`📘 Team Archive: ${n}`;const r=document.getElementById("seasonList"),h=c(g,`teamArchive/${n}/seasons`);m(h).then(a=>{if(a.empty){r.innerHTML="<p>No historical data available yet.</p>";return}a.forEach(i=>{const e=i.data(),t=document.createElement("div");t.className="card",t.innerHTML=`
      <h3>${e.year} Season</h3>
      <p><strong>Record:</strong> ${e.record}</p>
      <p><strong>Top Players:</strong> ${e.topPlayers?.join(", ")||"N/A"}</p>
      <p><strong>Tags:</strong> ${e.tags?.join(", ")||"None"}</p>
      <h4>Game History:</h4>
      <ul>
        ${(e.games||[]).map(o=>`<li>${o.date}: ${o.opponent} — ${o.score}</li>`).join("")}
      </ul>
    `,r.appendChild(t)})});
//# sourceMappingURL=teamArchive-CttafJcO.js.map
