import { db, COLLECTIONS, showMessage, logAudit } from './admin.js';
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
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
 * Load site settings from Firestore and render form.
 */
export async function loadSettings() {
  const section = document.getElementById('settings-section');
  section.innerHTML = '<div>Loading settings...</div>';
  let settings = {
    siteName: '',
    siteDescription: '',
    logoUrl: ''
  };
  try {
    const docSnap = await getDoc(doc(db, COLLECTIONS.settings, 'main'));
    if (docSnap.exists()) {
      settings = { ...settings, ...docSnap.data() };
    }
  } catch (e) {
    showMessage('Failed to load settings.', 'danger');
  }

  section.innerHTML = `
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <h2 class="mb-0">Site Settings</h2>
    </div>
    <form id="settings-form" class="mb-3" autocomplete="off">
      <div class="mb-3">
        <label class="form-label">Site Name</label>
        <input type="text" class="form-control" name="siteName" value="${sanitize(settings.siteName)}" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Site Description</label>
        <textarea class="form-control" name="siteDescription" rows="2">${sanitize(settings.siteDescription)}</textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">Logo</label>
        <input type="file" class="form-control" name="logo">
        ${settings.logoUrl ? `<img src="${sanitize(settings.logoUrl)}" style="width:80px;height:80px;object-fit:contain;margin-top:8px;background:#fff;border-radius:8px;">` : ''}
      </div>
      <button type="submit" class="btn btn-success">Save Settings</button>
    </form>
  `;

  section.querySelector('#settings-form').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      siteName: form.siteName.value.trim(),
      siteDescription: form.siteDescription.value.trim()
    };
    let logoUrl = settings.logoUrl || '';
    const file = form.logo.files[0];
    if (file) {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `settings/logo_${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        logoUrl = await getDownloadURL(storageRef);
        // Optionally delete old logo
        if (settings.logoUrl) {
          try {
            const oldRef = ref(storage, settings.logoUrl);
            await deleteObject(oldRef);
          } catch {}
        }
      } catch (err) {
        showMessage("Logo upload failed.", "danger");
        return;
      }
    }
    data.logoUrl = logoUrl;

    try {
      const settingsRef = doc(db, COLLECTIONS.settings, 'main');
      const docSnap = await getDoc(settingsRef);
      if (docSnap.exists()) {
        await updateDoc(settingsRef, data);
        if (typeof logAudit === 'function') await logAudit("updateSettings", data);
      } else {
        await setDoc(settingsRef, data);
        if (typeof logAudit === 'function') await logAudit("createSettings", data);
      }
      showMessage("Settings saved!", "success");
      loadSettings();
    } catch (err) {
      showMessage("Failed to save settings.", "danger");
    }
  };
}

/**
 * Initialize the Settings section.
 */
export function initSettingsSection() {
  const section = document.getElementById('settings-section');
  section.style.display = '';
  loadSettings();
}