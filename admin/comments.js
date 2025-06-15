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
 * Render comments list.
 * @param {Array} comments
 */
function renderCommentsList(comments) {
  const commentsList = document.getElementById('comments-list');
  if (!commentsList) return;
  if (!comments.length) {
    commentsList.innerHTML = '<li class="list-group-item">No comments found.</li>';
    return;
  }
  commentsList.innerHTML = '';
  comments.forEach(c => {
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
        ${c.attachmentUrl ? `<a href="${sanitize(c.attachmentUrl)}" target="_blank" class="badge bg-info text-dark mt-1">Attachment</a>` : ''}
      </div>
      <div>
        <button class="btn btn-sm btn-primary me-2" onclick="window.openEditCommentModal('${c.id}')"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-danger" onclick="window.deleteComment('${c.id}')"><i class="bi bi-trash"></i></button>
      </div>
    `;
    commentsList.appendChild(li);
  });
}

/**
 * Load comments from Firestore and render them
 */
export async function loadComments() {
  const commentsList = document.getElementById('comments-list');
  if (!commentsList) return;
  commentsList.innerHTML = '<li class="list-group-item">Loading...</li>';
  try {
    const q = query(collection(db, COLLECTIONS.comments), orderBy('date', 'desc'));
    const snap = await getDocs(q);
    const comments = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    renderCommentsList(comments);
  } catch (e) {
    commentsList.innerHTML = '<li class="list-group-item text-danger">Failed to load comments.</li>';
    if (window && typeof window.reportError === 'function') {
      window.reportError(e, { section: 'comments' });
    }
  }
}

/**
 * Add a new comment (with optional attachment)
 */
export async function addComment(data, file) {
  try {
    let attachmentUrl = "";
    if (file) {
      const storage = getStorage();
      const storageRef = ref(storage, `comments/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      attachmentUrl = await getDownloadURL(storageRef);
    }
    const docRef = await addDoc(collection(db, COLLECTIONS.comments), { ...data, attachmentUrl });
    if (typeof logAudit === 'function') await logAudit("createComment", { id: docRef.id, ...data });
    showMessage("Comment added!", "success");
    return docRef.id;
  } catch (err) {
    showMessage("Failed to add comment.", "danger");
    throw err;
  }
}

/**
 * Update a comment (with optional attachment)
 */
export async function updateComment(id, data, file, oldAttachmentUrl = "") {
  try {
    let attachmentUrl = oldAttachmentUrl;
    if (file) {
      const storage = getStorage();
      const storageRef = ref(storage, `comments/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      attachmentUrl = await getDownloadURL(storageRef);
      // Optionally delete old attachment
      if (oldAttachmentUrl) {
        try {
          const oldRef = ref(storage, oldAttachmentUrl);
          await deleteObject(oldRef);
        } catch {}
      }
    }
    await updateDoc(doc(db, COLLECTIONS.comments, id), { ...data, attachmentUrl });
    if (typeof logAudit === 'function') await logAudit("updateComment", { id, ...data });
    showMessage("Comment updated!", "success");
  } catch (err) {
    showMessage("Failed to update comment.", "danger");
    throw err;
  }
}

/**
 * Delete a comment (and its attachment if present)
 */
async function deleteCommentById(id) {
  try {
    const docRef = doc(db, COLLECTIONS.comments, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.attachmentUrl) {
        try {
          const storage = getStorage();
          const attRef = ref(storage, data.attachmentUrl);
          await deleteObject(attRef);
        } catch {}
      }
    }
    await deleteDoc(docRef);
    if (typeof logAudit === 'function') await logAudit("deleteComment", { id });
  } catch (err) {
    showMessage("Failed to delete comment.", "danger");
    throw err;
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
      await deleteCommentById(id);
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

/**
 * Show modal for adding or editing a comment.
 * @param {string|null} id
 */
window.openEditCommentModal = async function(id = null) {
  let comment = {
    author: "",
    text: "",
    date: new Date().toISOString().slice(0, 16),
    attachmentUrl: ""
  };
  let isEdit = false;
  if (id) {
    const docSnap = await getDoc(doc(db, COLLECTIONS.comments, id));
    if (docSnap.exists()) {
      comment = { id, ...docSnap.data() };
      isEdit = true;
    }
  }
  // Modal HTML
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal" style="display:block;">
      <div class="modal-dialog">
        <form class="modal-content" id="comment-form">
          <div class="modal-header">
            <h5 class="modal-title">${isEdit ? 'Edit Comment' : 'Add Comment'}</h5>
            <button type="button" class="btn-close" id="close-modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Author</label>
              <input type="text" class="form-control" name="author" value="${sanitize(comment.author)}">
            </div>
            <div class="mb-3">
              <label class="form-label">Date</label>
              <input type="datetime-local" class="form-control" name="date" value="${comment.date ? sanitize(comment.date).slice(0,16) : ''}">
            </div>
            <div class="mb-3">
              <label class="form-label">Comment</label>
              <textarea class="form-control" name="text" rows="3" required>${sanitize(comment.text)}</textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Attachment</label>
              <input type="file" class="form-control" name="attachment">
              ${comment.attachmentUrl ? `<a href="${sanitize(comment.attachmentUrl)}" target="_blank" class="badge bg-info text-dark mt-1">Current Attachment</a>` : ''}
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
  modal.querySelector('#comment-form').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      author: form.author.value.trim(),
      text: form.text.value.trim(),
      date: form.date.value
    };
    const file = form.attachment.files[0];
    try {
      if (isEdit) {
        await updateComment(id, data, file, comment.attachmentUrl);
      } else {
        await addComment(data, file);
      }
      document.body.removeChild(modal);
      if (typeof loadComments === 'function') loadComments();
    } catch {}
  };
};

/**
 * Initialize the Comments section.
 */
export function initCommentsSection() {
  const section = document.getElementById('comments-section');
  section.style.display = '';
  section.innerHTML = `
    <div class="mb-3 d-flex justify-content-between align-items-center">
      <h2 class="mb-0">Comments</h2>
      <button class="btn btn-primary" id="add-comment-btn">Add Comment</button>
    </div>
    <ul id="comments-list" class="list-group mb-3">Loading...</ul>
  `;
  document.getElementById('add-comment-btn').onclick = () => window.openEditCommentModal();
  loadComments();
}
