// Mock video upload service
const videoService = {
  uploadVideo: jest.fn(() =>
    Promise.resolve({
      success: true,
      videoId: 'test-123',
      url: 'https://mock-url.com/video.mp4',
    })
  ),
  processVideo: jest.fn(() => Promise.resolve({ processed: true })),
  deleteVideo: jest.fn(() => Promise.resolve({ success: true })),
  getUploadProgress: jest.fn(() => ({ progress: 50 })),
  validateFile: jest.fn(() => ({ valid: true, size: 1000000 })),
};

module.exports = { videoService };
