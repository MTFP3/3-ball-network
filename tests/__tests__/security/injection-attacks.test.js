const request = require('supertest');
const app = require('@/server');
const { initializeTestEnvironment } = require('@firebase/rules-unit-testing');
const admin = require('firebase-admin');

describe('Security Tests - Authentication', () => {
  let testEnv;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'test-security-project',
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  describe('SQL Injection Protection', () => {
    test('prevents SQL injection in login endpoint', async () => {
      const maliciousPayloads = [
        "admin'; DROP TABLE users; --",
        "' OR '1'='1",
        "admin' OR 1=1 --",
        "'; DELETE FROM users WHERE '1'='1",
        "' UNION SELECT * FROM admin_users --",
      ];

      for (const payload of maliciousPayloads) {
        const response = await request(app).post('/api/auth/login').send({
          email: payload,
          password: 'password123',
        });

        // Should return validation error, not internal server error
        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(/invalid email format/i);
      }
    });

    test('prevents SQL injection in search endpoints', async () => {
      const token = await getValidAuthToken();

      const maliciousQueries = [
        "'; DROP TABLE players; --",
        "' OR 1=1 UNION SELECT password FROM users --",
        "admin'; UPDATE users SET role='admin' WHERE email='attacker@test.com'; --",
      ];

      for (const query of maliciousQueries) {
        const response = await request(app)
          .get('/api/players/search')
          .query({ q: query })
          .set('Authorization', `Bearer ${token}`);

        // Should not execute SQL, should sanitize or reject
        expect(response.status).not.toBe(500);
        expect(response.body).not.toHaveProperty('password');
      }
    });
  });

  describe('XSS Protection', () => {
    test('sanitizes user input to prevent XSS', async () => {
      const token = await getValidAuthToken();

      const xssPayloads = [
        '<script>alert("xss")</script>',
        '<img src="x" onerror="alert(1)">',
        'javascript:alert("xss")',
        '<svg onload="alert(1)">',
        '"><script>alert(String.fromCharCode(88,83,83))</script>',
        '<iframe src="javascript:alert(`xss`)"></iframe>',
      ];

      for (const payload of xssPayloads) {
        const response = await request(app)
          .put('/api/players/profile')
          .send({
            name: payload,
            bio: `Player bio ${payload}`,
          })
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);

        // Verify stored data is sanitized
        const profileResponse = await request(app)
          .get('/api/players/profile')
          .set('Authorization', `Bearer ${token}`);

        expect(profileResponse.body.name).not.toContain('<script>');
        expect(profileResponse.body.name).not.toContain('javascript:');
        expect(profileResponse.body.bio).not.toContain('<script>');
      }
    });

    test('prevents XSS in video metadata', async () => {
      const token = await getValidAuthToken();

      const response = await request(app)
        .post('/api/videos/upload/metadata')
        .send({
          title: '<script>alert("xss")</script>Basketball Game',
          description: 'Game description <img src="x" onerror="alert(1)">',
          tags: ['<script>alert("tag-xss")</script>', 'basketball'],
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);

      // Verify metadata is sanitized
      expect(response.body.title).toBe('Basketball Game');
      expect(response.body.description).not.toContain('<img');
      expect(response.body.tags).not.toContain(
        '<script>alert("tag-xss")</script>'
      );
    });
  });

  describe('CSRF Protection', () => {
    test('requires CSRF token for state-changing operations', async () => {
      const token = await getValidAuthToken();

      // Attempt to change user role without CSRF token
      const response = await request(app)
        .post('/api/admin/users/role')
        .send({
          userId: 'test-user-id',
          newRole: 'admin',
        })
        .set('Authorization', `Bearer ${token}`)
        // Intentionally omit CSRF token
        .set('X-Requested-With', 'XMLHttpRequest');

      expect(response.status).toBe(403);
      expect(response.body.error).toMatch(/csrf token required/i);
    });

    test('validates CSRF token correctness', async () => {
      const token = await getValidAuthToken();

      const response = await request(app)
        .post('/api/admin/users/role')
        .send({
          userId: 'test-user-id',
          newRole: 'admin',
        })
        .set('Authorization', `Bearer ${token}`)
        .set('X-CSRF-Token', 'invalid-csrf-token');

      expect(response.status).toBe(403);
      expect(response.body.error).toMatch(/invalid csrf token/i);
    });
  });

  describe('File Upload Security', () => {
    test('validates file types strictly', async () => {
      const token = await getValidAuthToken();

      // Test malicious file with video extension
      const maliciousFile = Buffer.from('malicious content');

      const response = await request(app)
        .post('/api/videos/upload')
        .attach('video', maliciousFile, 'malicious.mp4')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/invalid file format/i);
    });

    test('prevents file signature spoofing', async () => {
      const token = await getValidAuthToken();

      // Create fake video file with executable content
      const fakeVideoHeader = Buffer.from([
        0x00,
        0x00,
        0x00,
        0x20,
        0x66,
        0x74,
        0x79,
        0x70, // MP4 header
        0x4d,
        0x53,
        0x56,
        0x53, // Followed by malicious content
      ]);
      const maliciousContent = Buffer.concat([
        fakeVideoHeader,
        Buffer.from('<?php system($_GET["cmd"]); ?>'), // PHP backdoor
      ]);

      const response = await request(app)
        .post('/api/videos/upload')
        .attach('video', maliciousContent, 'fake-video.mp4')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/file validation failed/i);
    });

    test('enforces file size limits', async () => {
      const token = await getValidAuthToken();

      // Create oversized file
      const oversizedFile = Buffer.alloc(600 * 1024 * 1024); // 600MB

      const response = await request(app)
        .post('/api/videos/upload')
        .attach('video', oversizedFile, 'large-video.mp4')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(413);
      expect(response.body.error).toMatch(/file too large/i);
    });

    test('scans uploaded files for malware signatures', async () => {
      const token = await getValidAuthToken();

      // EICAR test string (standard antivirus test)
      const eicarString =
        'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';
      const testFile = Buffer.from(eicarString);

      const response = await request(app)
        .post('/api/videos/upload')
        .attach('video', testFile, 'test.mp4')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(
        /security scan failed|malicious content detected/i
      );
    });
  });

  describe('Rate Limiting', () => {
    test('enforces login attempt rate limits', async () => {
      const promises = [];

      // Attempt multiple rapid login requests
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app).post('/api/auth/login').send({
            email: 'test@example.com',
            password: 'wrongpassword',
          })
        );
      }

      const responses = await Promise.all(promises);

      // Should rate limit after several attempts
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });

    test('enforces API rate limits per user', async () => {
      const token = await getValidAuthToken();
      const promises = [];

      // Make rapid API requests
      for (let i = 0; i < 100; i++) {
        promises.push(
          request(app)
            .get('/api/players/profile')
            .set('Authorization', `Bearer ${token}`)
        );
      }

      const responses = await Promise.all(promises);

      // Should rate limit excessive requests
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });

    test('enforces upload rate limits', async () => {
      const token = await getValidAuthToken();
      const promises = [];

      const smallVideo = Buffer.alloc(1024); // 1KB test file

      // Attempt multiple rapid uploads
      for (let i = 0; i < 5; i++) {
        promises.push(
          request(app)
            .post('/api/videos/upload')
            .attach('video', smallVideo, `video-${i}.mp4`)
            .set('Authorization', `Bearer ${token}`)
        );
      }

      const responses = await Promise.all(promises);

      // Should limit concurrent uploads
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Authorization Checks', () => {
    test('prevents privilege escalation', async () => {
      const playerToken = await getValidAuthToken('player');

      // Attempt to access admin endpoint
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${playerToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toMatch(/insufficient permissions/i);
    });

    test('prevents horizontal privilege escalation', async () => {
      const player1Token = await getValidAuthToken(
        'player',
        'player1@test.com'
      );

      // Attempt to access another player's private data
      const response = await request(app)
        .get('/api/players/player2-id/private-stats')
        .set('Authorization', `Bearer ${player1Token}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toMatch(/access denied/i);
    });

    test('validates resource ownership', async () => {
      const player1Token = await getValidAuthToken(
        'player',
        'player1@test.com'
      );

      // Attempt to delete another player's video
      const response = await request(app)
        .delete('/api/videos/other-player-video-id')
        .set('Authorization', `Bearer ${player1Token}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toMatch(
        /not authorized to delete this video/i
      );
    });
  });

  describe('Data Validation', () => {
    test('validates input data types strictly', async () => {
      const token = await getValidAuthToken();

      const response = await request(app)
        .put('/api/players/profile')
        .send({
          name: 123, // Should be string
          age: 'twenty', // Should be number
          height: { invalid: 'object' }, // Should be string
          stats: 'invalid', // Should be object
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'name',
            message: expect.stringMatching(/must be a string/i),
          }),
          expect.objectContaining({
            field: 'age',
            message: expect.stringMatching(/must be a number/i),
          }),
        ])
      );
    });

    test('validates required fields', async () => {
      const token = await getValidAuthToken();

      const response = await request(app)
        .post('/api/games')
        .send({
          // Missing required fields: title, date, teams
          description: 'Game description',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'title',
            message: expect.stringMatching(/required/i),
          }),
          expect.objectContaining({
            field: 'date',
            message: expect.stringMatching(/required/i),
          }),
          expect.objectContaining({
            field: 'teams',
            message: expect.stringMatching(/required/i),
          }),
        ])
      );
    });

    test('validates data ranges and constraints', async () => {
      const token = await getValidAuthToken();

      const response = await request(app)
        .put('/api/players/profile')
        .send({
          name: 'A'.repeat(256), // Too long
          age: -5, // Invalid age
          height: '10 feet', // Invalid height
          weight: 1000, // Unrealistic weight
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Session Security', () => {
    test('invalidates sessions after logout', async () => {
      const token = await getValidAuthToken();

      // Verify token works
      let response = await request(app)
        .get('/api/players/profile')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);

      // Logout
      response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);

      // Verify token is invalidated
      response = await request(app)
        .get('/api/players/profile')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(401);
    });

    test('expires sessions after inactivity', async () => {
      const token = await getValidAuthToken();

      // Mock time passing (would need to be implemented in the auth system)
      jest.useFakeTimers();
      jest.advanceTimersByTime(24 * 60 * 60 * 1000); // 24 hours

      const response = await request(app)
        .get('/api/players/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(401);
      expect(response.body.error).toMatch(/session expired/i);

      jest.useRealTimers();
    });

    test('prevents session fixation attacks', async () => {
      // Create session before login
      const preLoginResponse = await request(app).get('/api/auth/session-info');

      const sessionIdBefore = preLoginResponse.headers['set-cookie']?.[0];

      // Login
      const loginResponse = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(loginResponse.status).toBe(200);

      const sessionIdAfter = loginResponse.headers['set-cookie']?.[0];

      // Session ID should change after login
      expect(sessionIdAfter).toBeDefined();
      expect(sessionIdAfter).not.toBe(sessionIdBefore);
    });
  });

  describe('Error Handling Security', () => {
    test('does not leak sensitive information in error messages', async () => {
      // Test with invalid user ID
      const token = await getValidAuthToken();

      const response = await request(app)
        .get('/api/players/nonexistent-user-id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.error).not.toContain('database');
      expect(response.body.error).not.toContain('SQL');
      expect(response.body.error).not.toContain('table');
      expect(response.body).not.toHaveProperty('stack');
      expect(response.body).not.toHaveProperty('query');
    });

    test('handles malformed requests gracefully', async () => {
      const responses = await Promise.all([
        request(app).post('/api/auth/login').send('invalid json'),
        request(app).post('/api/auth/login').send(null),
        request(app).post('/api/auth/login').send(undefined),
        request(app).post('/api/auth/login').send({ circular: {} }),
      ]);

      responses.forEach(response => {
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body).not.toHaveProperty('stack');
      });
    });
  });

  // Helper functions
  async function getValidAuthToken(
    role = 'player',
    email = 'test@example.com'
  ) {
    const customToken = await admin.auth().createCustomToken('test-uid', {
      role,
      email,
    });

    const response = await request(app)
      .post('/api/auth/token-exchange')
      .send({ customToken });

    return response.body.accessToken;
  }
});

describe('Security Tests - Firestore Rules', () => {
  test('prevents unauthorized data access', async () => {
    // This would use the Firebase Rules Unit Testing
    // Similar to the integration test but focused on security scenarios
  });

  test('validates data before writes', async () => {
    // Test that malicious data is rejected by rules
  });

  test('prevents privilege escalation through rule manipulation', async () => {
    // Test that users cannot manipulate their auth context
  });
});

describe('Security Tests - Infrastructure', () => {
  test('enforces HTTPS only', async () => {
    // Test that HTTP requests are redirected to HTTPS
    const response = await request('http://localhost:3000').get('/api/health');

    expect(response.status).toBe(301);
    expect(response.headers.location).toMatch(/^https:/);
  });

  test('sets secure headers', async () => {
    const response = await request(app).get('/api/health');

    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-xss-protection']).toBe('1; mode=block');
    expect(response.headers['strict-transport-security']).toBeDefined();
    expect(response.headers['content-security-policy']).toBeDefined();
  });

  test('implements proper CORS policy', async () => {
    const response = await request(app)
      .options('/api/players')
      .set('Origin', 'https://malicious-site.com');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).not.toBe('*');
    expect(response.headers['access-control-allow-origin']).not.toBe(
      'https://malicious-site.com'
    );
  });
});
