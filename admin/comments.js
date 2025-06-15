import { db, storage, COLLECTIONS, sanitize, showMessage, showConfirm } from './admin.js';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

// Load comments from Firestore and render them
export async function loadComments() {
  const commentsList = document.getElementById('comments-list');
  if (!commentsList) return;
  commentsList.innerHTML = '<li class="list-group-item">Loading...</li>';
  try {
    const q = query(collection(db, COLLECTIONS.comments), orderBy('date', 'desc'));
    const snap = await getDocs(q);
    if (snap.empty) {
      commentsList.innerHTML = '<li class="list-group-item">No comments found.</li>';
      return;
    }
    commentsList.innerHTML = '';
    snap.forEach(docSnap => {
      const c = docSnap.data();
      // Handle Firestore Timestamp or string date
      let dateStr = '';
      if (c.date && typeof c.date.toDate === 'function') {
        dateStr = c.date.toDate().toLocaleString();
      } else if (typeof c.date === 'string') {
        dateStr = c.date;
      }
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <div>
          <b>${sanitize(c.author || 'Anonymous')}</b> <span class="text-muted" style="font-size:0.9em;">${sanitize(dateStr)}</span>
          <div>${sanitize(c.text)}</div>
        </div>
        <button class="btn btn-sm btn-danger" onclick="deleteComment('${docSnap.id}')"><i class="bi bi-trash"></i></button>
      `;
      commentsList.appendChild(li);
    });
  } catch (e) {
    commentsList.innerHTML = '<li class="list-group-item text-danger">Failed to load comments.</li>';
    if (window && typeof window.reportError === 'function') {
      window.reportError(e, { section: 'comments' });
    }
  }
}

// Delete a comment with confirmation
window.deleteComment = function(id) {
  if (typeof window.showConfirm !== 'function' || typeof window.showMessage !== 'function') {
    alert('Required admin functions are missing.');
    return;
  }
  window.showConfirm('Delete this comment?', async (confirmed) => {
    if (!confirmed) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.comments, id));
      await loadComments();
      window.showMessage('Comment deleted!', 'success');
    } catch (e) {
      window.showMessage('Failed to delete comment.', 'danger');
      if (typeof window.reportError === 'function') {
        window.reportError(e, { action: 'deleteComment', id });
      }
    }
  });
};

// Optionally, call loadComments when the comments section is shown
// Example: in admin.js, when switching to comments section, call loadComments();

export function initCommentsSection() {
  document.getElementById('comments-section').style.display = '';
}
