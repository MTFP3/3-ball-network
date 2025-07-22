// Mock video service
const videoService = {
  uploadVideo: jest.fn((file, metadata) => {
    return new Promise((resolve, reject) => {
      // Validate file
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        reject(new Error('File too large'));
        return;
      }

      // Check file type
      if (!file.type.startsWith('video/')) {
        reject(new Error('Invalid file type'));
        return;
      }

      // Check file signature to prevent spoofing
      if (file.name.includes('malicious')) {
        reject(new Error('Security validation failed'));
        return;
      }

      // Simulate successful upload
      setTimeout(() => {
        resolve({
          success: true,
          videoId: 'test-video-id',
          url: 'https://example.com/video.mp4',
          metadata: {
            ...metadata,
            uploadedAt: new Date().toISOString(),
          },
        });
      }, 100);
    });
  }),

  deleteVideo: jest.fn(() => Promise.resolve({ success: true })),

  getVideoMetadata: jest.fn(() =>
    Promise.resolve({ title: 'Test Video', duration: 120 })
  ),

  validateFile: jest.fn(file => {
    if (!file) return { valid: false, error: 'No file provided' };
    if (file.size > 50 * 1024 * 1024)
      return { valid: false, error: 'File too large' };
    if (!file.type.startsWith('video/'))
      return { valid: false, error: 'Invalid file type' };
    return { valid: true };
  }),

  getUploadProgress: jest.fn(() => ({ progress: 0 })),

  sanitizeMetadata: jest.fn(metadata => {
    // Remove any script tags or dangerous content
    const sanitized = {};
    for (const [key, value] of Object.entries(metadata || {})) {
      if (typeof value === 'string') {
        sanitized[key] = value.replace(/<script[^>]*>.*?<\/script>/gi, '');
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }),
};

module.exports = videoService;
