// Mock AI service
const aiService = {
  analyzeVideo: jest.fn(() =>
    Promise.resolve({
      analysis: { accuracy: 85, feedback: 'Good shooting form' },
      processingTime: 2000,
    })
  ),
  getAnalysisStatus: jest.fn(() => Promise.resolve({ status: 'completed' })),
  validateVideoFormat: jest.fn(() => ({ valid: true })),
};

module.exports = aiService;
