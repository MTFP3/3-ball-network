// Removed broken modulepreload import;
// Removed broken modulepreload import;
// Removed broken modulepreload import;
import { initializeApp as m } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getFirestore as g,
  doc as d,
  getDoc as u,
  getDocs as y,
  collection as f,
  setDoc,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase.js';
import $ from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
import {
  getStorage as L,
  ref as S,
  getDownloadURL as k,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js';
import { F as b } from './teamComparison.js';
import { firebaseConfig } from './firebaseConfig.js';
import {
  createPlayerCard,
  createTagList,
  createLoadingIndicator,
  createErrorMessage,
  clearContainer,
  safeText,
  safeAttr,
} from './uiComponents.js';

const w = m(firebaseConfig),
  c = g(w),
  v = L(w),
  i = localStorage.getItem('scoutId') || 'demoScout';
b('visit', i, 'scout');
const I = document.getElementById('searchBar'),
  l = document.getElementById('playerTable');
I.addEventListener('input', E);
let s = [];
(async function () {
  const o = d(c, 'scouts', i),
    t = await u(o);
  if (!t.exists()) {
    const errorMsg = createErrorMessage('Scout profile not found.');
    clearContainer(document.body);
    document.body.appendChild(errorMsg);
    return;
  }
  if (t.data().approved === !1) {
    const pendingMsg = createLoadingIndicator(
      'Your account is pending admin approval.'
    );
    clearContainer(document.body);
    document.body.appendChild(pendingMsg);
    return;
  }
  C();
})();
async function C() {
  const o = await y(f(c, 'players'));
  ((s = []),
    o.forEach(t => {
      const e = t.data();
      s.push({ id: t.id, ...e });
    }),
    h(s));
}
function h(o) {
  clearContainer(l);
  o.forEach(t => {
    const e = document.createElement('div');
    e.classList.add('player-row');

    // Create secure player information display
    const playerInfo = document.createElement('div');
    playerInfo.classList.add('player-info');

    const name = document.createElement('strong');
    safeText(name, t.name);

    const details = document.createElement('span');
    safeText(
      details,
      ` — ${t.position || 'N/A'} | ${t.state || 'N/A'} | Rating: ${t.rating || 'N/A'}`
    );

    playerInfo.appendChild(name);
    playerInfo.appendChild(details);
    e.appendChild(playerInfo);

    // Create action buttons container
    const actions = document.createElement('div');
    actions.classList.add('player-actions');

    // Profile link
    const profileLink = document.createElement('a');
    safeAttr(profileLink, 'href', `/public/player.html?id=${t.id}`);
    safeAttr(profileLink, 'target', '_blank');
    safeText(profileLink, 'View Profile');
    actions.appendChild(profileLink);

    // Contact button if coach exists
    if (t.coachId) {
      const contactBtn = document.createElement('button');
      safeText(contactBtn, 'Request Contact');
      contactBtn.addEventListener('click', () =>
        requestContact(t.id, t.coachId)
      );
      actions.appendChild(contactBtn);
    }

    // Report link
    const reportLink = document.createElement('a');
    safeAttr(reportLink, 'id', `reportLink-${t.id}`);
    safeAttr(reportLink, 'target', '_blank');
    safeText(reportLink, 'Loading report...');
    actions.appendChild(reportLink);

    e.appendChild(actions);
    l.appendChild(e);

    // Load report asynchronously
    const r = S(v, `reports/${t.id}/daily.pdf`);
    k(r)
      .then(n => {
        safeAttr(reportLink, 'href', n);
        safeText(reportLink, '📄 Daily Report (PDF)');
      })
      .catch(() => {
        safeText(reportLink, 'No report available yet');
      });
  });
}
function E() {
  const o = I.value.toLowerCase(),
    t = s.filter(
      e =>
        e.name.toLowerCase().includes(o) ||
        (e.position && e.position.toLowerCase().includes(o)) ||
        (e.state && e.state.toLowerCase().includes(o))
    );
  h(t);
}
window.requestContact = async function (o, t) {
  const e = d(c, 'contactRequests', `${i}_${o}`);
  await setDoc(e, {
    scoutId: i,
    playerId: o,
    coachId: t,
    requestedAt: new Date(),
  });
  await b('contact', i, 'scout');
  alert('📩 Contact request sent to coach!');
};
window.searchReports = async function () {
  const o = document.getElementById('searchPlayerId').value.trim(),
    t = document.getElementById('searchGameId').value.trim(),
    e = document.getElementById('reportList');

  clearContainer(e);

  const title = document.createElement('h3');
  safeText(title, '🔍 Results:');
  e.appendChild(title);

  const reportsSnap = await y(f(c, 'scoutingReports'));
  reportsSnap.forEach(r => {
    const n = r.data();
    if ((o && !n.playerId.includes(o)) || (t && !n.gameId.includes(t))) {
      return;
    }

    const reportDiv = document.createElement('div');
    reportDiv.classList.add('scout-report');

    // Create report fields securely
    const fields = [
      { label: 'Player:', value: n.playerId },
      { label: 'Game:', value: n.gameId },
      { label: 'Grade:', value: n.grade },
      { label: 'Summary:', value: n.report },
      { label: 'Strengths:', value: n.strengths?.join(', ') || 'N/A' },
      {
        label: 'Needs Work:',
        value: n.areasForImprovement?.join(', ') || 'N/A',
      },
    ];

    fields.forEach(field => {
      const fieldDiv = document.createElement('div');
      const label = document.createElement('strong');
      safeText(label, field.label);
      const value = document.createElement('span');
      safeText(value, ` ${field.value}`);
      fieldDiv.appendChild(label);
      fieldDiv.appendChild(value);
      reportDiv.appendChild(fieldDiv);
    });

    // Download button
    const downloadBtn = document.createElement('button');
    safeText(downloadBtn, 'Download PDF');
    downloadBtn.addEventListener('click', () =>
      downloadScoutReport(n.playerId, n.gameId, n)
    );
    reportDiv.appendChild(downloadBtn);

    const hr = document.createElement('hr');
    reportDiv.appendChild(hr);

    e.appendChild(reportDiv);
  });
};
// Make requestContact function available
function requestContact(playerId, coachId) {
  return window.requestContact(playerId, coachId);
}

// Make downloadScoutReport function available
function downloadScoutReport(playerId, gameId, reportData) {
  return window.downloadScoutReport(playerId, gameId, reportData);
}

window.downloadScoutReport = function (o, t, e) {
  const r = new $();
  r.text(`Scouting Report - Player ${o}`, 10, 10);
  r.text(`Game: ${t}`, 10, 20);
  r.text(`Grade: ${e.grade}`, 10, 30);
  r.text(`Summary: ${e.report}`, 10, 40);
  r.text(`Strengths: ${e.strengths?.join(', ') || 'N/A'}`, 10, 50);
  r.text(
    `Areas for Improvement: ${e.areasForImprovement?.join(', ') || 'N/A'}`,
    10,
    60
  );
  r.save(`Scouting_Report_${o}_${t}.pdf`);
};

// Secure tags display
const R = m(firebaseConfig),
  B = g(R),
  T = localStorage.getItem('playerId') || 'demoPlayer',
  M = d(B, 'players', T),
  p = await u(M),
  j = p.exists() ? p.data() : {},
  P = document.getElementById('smartTags');

if (P) {
  const tagList = createTagList(j.tags || [], { extraClass: 'smart-tags' });
  clearContainer(P);
  P.appendChild(tagList);
}
//# sourceMappingURL=scout.js.map
