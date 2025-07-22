// Mock AI analysis service
const aiService = {
  analyzeVideo: jest.fn(() =>
    Promise.resolve({
      analysis: { accuracy: 85, feedback: 'Good shooting form' },
      processingTime: 2000,
    })
  ),
  getAnalysisResults: jest.fn(() =>
    Promise.resolve({
      status: 'completed',
      results: { score: 85 },
    })
  ),
  processAnalysis: jest.fn(() => Promise.resolve({ processed: true })),
};

module.exports = { aiService };
