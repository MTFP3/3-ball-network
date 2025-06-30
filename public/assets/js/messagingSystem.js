// Real-Time Messaging System
class MessagingSystem {
  constructor(userId, userRole) {
    this.userId = userId;
    this.userRole = userRole;
    this.conversations = new Map();
    this.activeConversation = null;
    this.init();
  }

  async init() {
    await this.initializeFirebase();
    this.setupMessagingUI();
    this.loadConversations();
    this.setupRealTimeListeners();
  }

  async initializeFirebase() {
    const { initializeApp } = await import(
      'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js'
    );
    const {
      getFirestore,
      onSnapshot,
      collection,
      addDoc,
      query,
      orderBy,
      where,
    } = await import(
      'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js'
    );

    const firebaseConfig = {
      apiKey: 'AIzaSyD4XJLc3_CLGvOhMysQTx2fabgZQt3y5g0',
      authDomain: 'ball-network-web.firebaseapp.com',
      projectId: 'ball-network-web',
      storageBucket: 'ball-network-web.appspot.com',
      messagingSenderId: '740915998465',
      appId: '1:740915998465:web:59ac026f3f4c2ec5da3500',
    };

    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    this.onSnapshot = onSnapshot;
    this.collection = collection;
    this.addDoc = addDoc;
    this.query = query;
    this.orderBy = orderBy;
    this.where = where;
  }

  setupMessagingUI() {
    // Create messaging interface
    const messagingHTML = `
      <div id="messagingWidget" class="messaging-widget collapsed">
        <div class="messaging-header" onclick="messagingSystem.toggleWidget()">
          <div class="header-info">
            <i class="icon-message"></i>
            <span>Messages</span>
          </div>
          <div class="header-actions">
            <span class="unread-count" id="unreadCount">0</span>
            <i class="icon-chevron-up toggle-icon"></i>
          </div>
        </div>
        
        <div class="messaging-content">
          <div class="conversation-list" id="conversationList">
            <div class="conversation-search">
              <input type="text" placeholder="Search conversations..." id="conversationSearch">
            </div>
            <div class="conversations" id="conversations">
              <div class="loading">Loading conversations...</div>
            </div>
          </div>
          
          <div class="chat-area" id="chatArea" style="display: none;">
            <div class="chat-header">
              <button onclick="messagingSystem.backToConversations()" class="back-btn">
                <i class="icon-arrow-left"></i>
              </button>
              <div class="chat-info">
                <div class="chat-name" id="chatName"></div>
                <div class="chat-status" id="chatStatus"></div>
              </div>
              <div class="chat-actions">
                <button onclick="messagingSystem.toggleChatOptions()" class="options-btn">
                  <i class="icon-options"></i>
                </button>
              </div>
            </div>
            
            <div class="messages-container" id="messagesContainer">
              <div class="messages" id="messages"></div>
            </div>
            
            <div class="message-input-area">
              <div class="message-input">
                <input type="text" id="messageInput" placeholder="Type a message..." 
                       onkeypress="messagingSystem.handleKeyPress(event)">
                <button onclick="messagingSystem.sendMessage()" class="send-btn">
                  <i class="icon-send"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add to page
    document.body.insertAdjacentHTML('beforeend', messagingHTML);
  }

  async loadConversations() {
    try {
      const conversationsQuery = this.query(
        this.collection(this.db, 'conversations'),
        this.where('participants', 'array-contains', this.userId),
        this.orderBy('lastMessageTime', 'desc')
      );

      this.onSnapshot(conversationsQuery, snapshot => {
        this.renderConversations(snapshot.docs);
      });
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  }

  renderConversations(conversations) {
    const conversationsContainer = document.getElementById('conversations');

    if (conversations.length === 0) {
      conversationsContainer.innerHTML = `
        <div class="no-conversations">
          <i class="icon-message-empty"></i>
          <p>No conversations yet</p>
          <button onclick="messagingSystem.startNewConversation()" class="btn-primary">
            Start a conversation
          </button>
        </div>
      `;
      return;
    }

    conversationsContainer.innerHTML = conversations
      .map(doc => {
        const data = doc.data();
        const otherParticipant = data.participants.find(p => p !== this.userId);

        return `
        <div class="conversation-item ${data.unread ? 'unread' : ''}" 
             onclick="messagingSystem.openConversation('${doc.id}', '${otherParticipant}')">
          <div class="conversation-avatar">
            <img src="${data.otherParticipantAvatar || '/default-avatar.png'}" alt="Avatar">
            <div class="status-indicator ${data.otherParticipantOnline ? 'online' : 'offline'}"></div>
          </div>
          <div class="conversation-info">
            <div class="conversation-name">${data.otherParticipantName || 'Unknown'}</div>
            <div class="last-message">${data.lastMessage || 'No messages yet'}</div>
          </div>
          <div class="conversation-meta">
            <div class="time">${this.formatTime(data.lastMessageTime)}</div>
            ${data.unreadCount > 0 ? `<div class="unread-badge">${data.unreadCount}</div>` : ''}
          </div>
        </div>
      `;
      })
      .join('');

    // Update total unread count
    const totalUnread = conversations.reduce(
      (sum, doc) => sum + (doc.data().unreadCount || 0),
      0
    );
    document.getElementById('unreadCount').textContent = totalUnread;
    document.getElementById('unreadCount').style.display =
      totalUnread > 0 ? 'block' : 'none';
  }

  async openConversation(conversationId, otherUserId) {
    this.activeConversation = conversationId;

    // Show chat area
    document.getElementById('conversationList').style.display = 'none';
    document.getElementById('chatArea').style.display = 'flex';

    // Load messages
    this.loadMessages(conversationId);

    // Load other user info
    await this.loadOtherUserInfo(otherUserId);
  }

  async loadMessages(conversationId) {
    try {
      const messagesQuery = this.query(
        this.collection(this.db, `conversations/${conversationId}/messages`),
        this.orderBy('timestamp', 'asc')
      );

      this.onSnapshot(messagesQuery, snapshot => {
        this.renderMessages(snapshot.docs);
      });
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  renderMessages(messages) {
    const messagesContainer = document.getElementById('messages');

    messagesContainer.innerHTML = messages
      .map(doc => {
        const data = doc.data();
        const isOwn = data.senderId === this.userId;

        return `
        <div class="message ${isOwn ? 'own' : 'other'}">
          <div class="message-content">
            <div class="message-text">${data.text}</div>
            <div class="message-time">${this.formatTime(data.timestamp)}</div>
          </div>
        </div>
      `;
      })
      .join('');

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  async sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();

    if (!text || !this.activeConversation) return;

    try {
      await this.addDoc(
        this.collection(
          this.db,
          `conversations/${this.activeConversation}/messages`
        ),
        {
          text,
          senderId: this.userId,
          timestamp: new Date(),
          type: 'text',
        }
      );

      input.value = '';
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  async loadOtherUserInfo(userId) {
    // Load and display other user's info in chat header
    document.getElementById('chatName').textContent = 'Loading...';
    document.getElementById('chatStatus').textContent = 'Loading...';
  }

  toggleWidget() {
    const widget = document.getElementById('messagingWidget');
    widget.classList.toggle('collapsed');
  }

  backToConversations() {
    document.getElementById('chatArea').style.display = 'none';
    document.getElementById('conversationList').style.display = 'block';
    this.activeConversation = null;
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  formatTime(timestamp) {
    if (!timestamp) return '';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }

  setupRealTimeListeners() {
    // Setup listeners for real-time updates
    console.log('Setting up real-time messaging listeners');
  }

  startNewConversation() {
    // Open new conversation dialog
    console.log('Starting new conversation');
  }

  toggleChatOptions() {
    // Show chat options menu
    console.log('Toggle chat options');
  }
}

// Global messaging system instance
let messagingSystem;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  const userId = localStorage.getItem('userId') || 'demo-user';
  const userRole = localStorage.getItem('userRole') || 'player';
  messagingSystem = new MessagingSystem(userId, userRole);
  window.messagingSystem = messagingSystem;
});

export { MessagingSystem };
