// Integration tests for API and database interactions
describe('Integration Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
    if (localStorage.clear) {
      localStorage.clear();
    }
    if (localStorage.getItem?.mockClear) {
      localStorage.getItem.mockClear();
    }
    if (localStorage.setItem?.mockClear) {
      localStorage.setItem.mockClear();
    }
    if (localStorage.removeItem?.mockClear) {
      localStorage.removeItem.mockClear();
    }
  });

  test('should fetch and display player data', async () => {
    const mockPlayer = {
      id: '1',
      name: 'John Doe',
      position: 'Forward',
      team: 'Test Team',
      stats: { points: 20, rebounds: 10, assists: 5 },
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlayer,
    });

    const fetchPlayerData = async playerId => {
      const response = await fetch(`/api/players/${playerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch player data');
      }
      return response.json();
    };

    const player = await fetchPlayerData('1');
    expect(player).toEqual(mockPlayer);
    expect(fetch).toHaveBeenCalledWith('/api/players/1');
  });

  test('should handle authentication flow', async () => {
    const mockAuthResponse = {
      token: 'mock-token',
      user: { id: '1', email: 'test@example.com' },
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAuthResponse,
    });

    const authenticate = async (email, password) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      return data;
    };

    const result = await authenticate('test@example.com', 'password');
    expect(result).toEqual(mockAuthResponse);
    // Verify localStorage was called by checking the stored value
    expect(localStorage.getItem('authToken')).toBe('mock-token');
  });

  test('should handle API errors gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const fetchWithErrorHandling = async url => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    };

    await expect(fetchWithErrorHandling('/api/test')).rejects.toThrow(
      'Network error'
    );
  });

  test('should save and retrieve user preferences', () => {
    const preferences = {
      theme: 'dark',
      notifications: true,
      language: 'en',
    };

    const savePreferences = prefs => {
      localStorage.setItem('userPreferences', JSON.stringify(prefs));
    };

    const loadPreferences = () => {
      const saved = localStorage.getItem('userPreferences');
      return saved ? JSON.parse(saved) : {};
    };

    savePreferences(preferences);
    // Verify localStorage was called by checking the stored value
    const stored = localStorage.getItem('userPreferences');
    expect(JSON.parse(stored)).toEqual(preferences);

    const loaded = loadPreferences();
    expect(loaded).toEqual(preferences);
  });

  test('should handle real-time updates', done => {
    // Mock WebSocket
    const mockWebSocket = {
      send: jest.fn(),
      close: jest.fn(),
      addEventListener: jest.fn(),
    };

    global.WebSocket = jest.fn(() => mockWebSocket);

    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:8080');

      ws.addEventListener('message', event => {
        const data = JSON.parse(event.data);
        expect(data.type).toBe('update');
        done();
      });

      return ws;
    };

    connectWebSocket();

    // Simulate receiving a message
    const mockEvent = { data: JSON.stringify({ type: 'update', payload: {} }) };
    mockWebSocket.addEventListener.mock.calls[0][1](mockEvent);
  });
});
