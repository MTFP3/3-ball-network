import { db, COLLECTIONS, showMessage, showConfirm, logAudit } from './admin.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// Utility to sanitize output
function sanitize(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"'`=\/]/g, s => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "`": "&#96;",
    "=": "&#61;",
    "/": "&#47;"
  })[s] || s);
}

/**
 * Render the players table.
 * @param {Array} players
 */
function renderPlayersTable(players) {
  const list = document.getElementById('players-list');
  if (!list) return;
  if (!players.length) {
    list.innerHTML = `<div class="alert alert-info">No players found.</div>`;
    return;
  }
  list.innerHTML = `
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th><input type="checkbox" id="select-all-players"></th>
          <th>Name</th>
          <th>Team</th>
          <th>Position</th>
          <th>Photo</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="players-tbody"></tbody>
    </table>
    <button class="btn btn-danger btn-sm mt-2" id="bulk-delete-players-btn">Delete Selected</button>
  `;
  const tbody = document.getElementById('players-tbody');
  players.forEach(player => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" class="player-checkbox" value="${player.id}"></td>
      <td>${sanitize(player.name)}</td>
      <td>${sanitize(player.team || "")}</td>
      <td>${sanitize(player.position || "")}</td>
      <td>
        ${player.photoUrl ? `<img src="${sanitize(player.photoUrl)}" alt="Photo" style="width:40px;height:40px;object-fit:cover;border-radius:50%;">` : ''}
      </td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="window.openEditPlayerModal('${player.id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="window.deletePlayer('${player.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Select all checkbox
  document.getElementById('select-all-players').onclick = function() {
    document.querySelectorAll('.player-checkbox').forEach(cb => cb.checked = this.checked);
  };

  // Bulk delete
  document.getElementById('bulk-delete-players-btn').onclick = function() {
    const ids = Array.from(document.querySelectorAll('.player-checkbox:checked')).map(cb => cb.value);
    bulkDeletePlayers(ids);
  };
}

/**
 * Load players from Firestore and render.
 */
export async function loadPlayers() {
  const q = query(collection(db, COLLECTIONS.players), orderBy("name"));
  const snap = await getDocs(q);
  const players = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  renderPlayersTable(players);
}

/**
 * Bulk delete players by IDs.
 * @param {string[]} ids
 */
export function bulkDeletePlayers(ids) {
  if (!Array.isArray(ids) || !ids.length) {
    showMessage("No players selected.", "warning");
    return;
  }
  showConfirm(`Delete ${ids.length} players?`, async (confirmed) => {
    if (!confirmed) return;
    for (const id of ids) {
      await deletePlayerById(id);
    }
    showMessage("Players deleted!", "success");
    if (typeof loadPlayers === 'function') loadPlayers();
  });
}

/**
 * Delete a player by ID (and photo if present)
 */
async function deletePlayerById(id) {
  try {
    const docRef = doc(db, COLLECTIONS.players, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.photoUrl) {
        try {
          const storage = getStorage();
          const photoRef = ref(storage, data.photoUrl);
          await deleteObject(photoRef);
        } catch {}
      }
    }
    await deleteDoc(docRef);
    if (typeof logAudit === 'function') await logAudit("deletePlayer", { id });
  } catch (err) {
    showMessage("Failed to delete player.", "danger");
  }
}

// Single player delete for row action
window.deletePlayer = function(id) {
  showConfirm('Delete this player?', async (confirmed) => {
    if (!confirmed) return;
    await deletePlayerById(id);
    showMessage("Player deleted!", "success");
    if (typeof loadPlayers === 'function') loadPlayers();
  });
};

/**
 * Show modal for adding or editing a player.
 * @param {string|null} id
 */
window.openEditPlayerModal = async function(id = null) {
  let player = {
    name: "",
    team: "",
    position: "",
    photoUrl: ""
  };
  let isEdit = false;
  if (id) {
    const docSnap = await getDoc(doc(db, COLLECTIONS.players, id));
    if (docSnap.exists()) {
      player = { id, ...docSnap.data() };
      isEdit = true;
    }
  }
  // Modal HTML
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal" style="display:block;">
      <div class="modal-dialog">
        <form class="modal-content" id="player-form">
          <div class="modal-header">
            <h5 class="modal-title">${isEdit ? 'Edit Player' : 'Add Player'}</h5>
            <button type="button" class="btn-close" id="close-modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" name="name" value="${sanitize(player.name)}" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Team</label>
              <input type="text" class="form-control" name="team" value="${sanitize(player.team)}">
            </div>
            <div class="mb-3">
              <label class="form-label">Position</label>
              <input type="text" class="form-control" name="position" value="${sanitize(player.position)}">
            </div>
            <div class="mb-3">
              <label class="form-label">Photo</label>
              <input type="file" class="form-control" name="photo">
              ${player.photoUrl ? `<img src="${sanitize(player.photoUrl)}" style="width:60px;height:60px;object-fit:cover;margin-top:8px;border-radius:50%;">` : ''}
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-success">${isEdit ? 'Update' : 'Create'}</button>
            <button type="button" class="btn btn-secondary" id="close-modal2">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Close modal
  modal.querySelectorAll('#close-modal, #close-modal2').forEach(btn => {
    btn.onclick = () => document.body.removeChild(modal);
  });

  // Form submit
  modal.querySelector('#player-form').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value.trim(),
      team: form.team.value.trim(),
      position: form.position.value.trim()
    };
    let photoUrl = player.photoUrl || "";
    const file = form.photo.files[0];
    if (file) {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `players/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        photoUrl = await getDownloadURL(storageRef);
        // Optionally delete old photo
        if (isEdit && player.photoUrl) {
          try {
            const oldRef = ref(storage, player.photoUrl);
            await deleteObject(oldRef);
          } catch {}
        }
      } catch (err) {
        showMessage("Photo upload failed.", "danger");
        return;
      }
    }
    data.photoUrl = photoUrl;

    try {
      if (isEdit) {
        await updateDoc(doc(db, COLLECTIONS.players, id), data);
        if (typeof logAudit === 'function') await logAudit("updatePlayer", { id, ...data });
        showMessage("Player updated!", "success");
      } else {
        await addDoc(collection(db, COLLECTIONS.players), data);
        if (typeof logAudit === 'function') await logAudit("createPlayer", data);
        showMessage("Player added!", "success");
      }
      document.body.removeChild(modal);
      if (typeof loadPlayers === 'function') loadPlayers();
    } catch (err) {
      showMessage("Failed to save player.", "danger");
    }
  };
};

/**
 * Initialize the Players section.
 */
export function initPlayersSection() {
  const section = document.getElementById('players-section');
  section.style.display = '';
  section.innerHTML = `
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <h2 class="mb-0">Players</h2>
      <button class="btn btn-primary" id="add-player-btn">Add Player</button>
    </div>
    <div id="players-list">Loading players...</div>
  `;
  document.getElementById('add-player-btn').onclick = () => window.openEditPlayerModal();
  loadPlayers();
}