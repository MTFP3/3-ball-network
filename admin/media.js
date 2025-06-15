import { db, storage, COLLECTIONS, sanitize, showMessage, showConfirm } from './admin.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';

// Load media files and render them
export async function loadMedia() {
  const mediaList = document.getElementById('media-list');
  if (!mediaList) return;
  mediaList.innerHTML = 'Loading...';
  try {
    const listRef = storageRef(storage, 'media');
    const res = await listAll(listRef);
    if (!res.items.length) {
      mediaList.innerHTML = '<div class="text-muted">No media found.</div>';
      return;
    }
    mediaList.innerHTML = '';
    for (const itemRef of res.items) {
      const url = await getDownloadURL(itemRef);
      const div = document.createElement('div');
      div.className = 'm-2 text-center';
      div.style.display = 'inline-block';
      div.innerHTML = `
        <img src="${sanitize(url)}" alt="" style="max-width:120px;max-height:120px;display:block;margin-bottom:4px;border-radius:6px;">
        <button class="btn btn-sm btn-danger" onclick="deleteMedia('${sanitize(itemRef.fullPath)}')"><i class="bi bi-trash"></i></button>
      `;
      mediaList.appendChild(div);
    }
  } catch (e) {
    mediaList.innerHTML = '<div class="text-danger">Failed to load media.</div>';
    if (window && typeof window.reportError === 'function') {
      window.reportError(e, { section: 'media' });
    }
  }
}

// Upload media files
window.uploadMedia = async function() {
  const fileInput = document.getElementById('media-upload');
  const captionInput = document.getElementById('media-caption');
  if (!fileInput || !fileInput.files.length) return;
  const files = Array.from(fileInput.files);
  for (const file of files) {
    try {
      const fileRef = storageRef(storage, `media/${file.name}`);
      await uploadBytes(fileRef, file);
      // Optionally, save metadata to Firestore here
      // await addDoc(collection(db, 'mediaMeta'), { name: file.name, caption: captionInput.value || '', url: await getDownloadURL(fileRef) });
    } catch (e) {
      if (window && typeof window.showMessage === 'function') {
        window.showMessage(`Failed to upload ${file.name}`, 'danger');
      }
      if (window && typeof window.reportError === 'function') {
        window.reportError(e, { section: 'media-upload', file: file.name });
      }
    }
  }
  if (window && typeof window.showMessage === 'function') {
    window.showMessage('Upload complete!', 'success');
  }
  fileInput.value = '';
  if (captionInput) captionInput.value = '';
  loadMedia();
};

// Delete a media file
window.deleteMedia = function(fullPath) {
  if (typeof window.showConfirm !== 'function' || typeof window.showMessage !== 'function') {
    alert('Required admin functions are missing.');
    return;
  }
  window.showConfirm('Delete this media file?', async (confirmed) => {
    if (!confirmed) return;
    try {
      const fileRef = storageRef(storage, fullPath);
      await deleteObject(fileRef);
      loadMedia();
      window.showMessage('Media deleted!', 'success');
    } catch (e) {
      window.showMessage('Failed to delete media.', 'danger');
      if (window && typeof window.reportError === 'function') {
        window.reportError(e, { action: 'deleteMedia', fullPath });
      }
    }
  });
};

// Initialize media section
export function initMediaSection() {
  document.getElementById('media-section').style.display = '';
}

// Optionally, call loadMedia when the media section is shown
// Example: in admin.js, when switching to media section, call loadMedia();