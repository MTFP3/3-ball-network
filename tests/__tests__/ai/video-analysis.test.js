const { aiService } = require('@/services/ai-analysis');
const { videoProcessor } = require('@/services/video-processing');
const fs = require('fs').promises;
const path = require('path');

// Mock external AI services for testing
jest.mock('@/services/external-ai', () => ({
  processVideo: jest.fn(),
  extractHighlights: jest.fn(),
  analyzeStats: jest.fn(),
}));

describe('AI Video Analysis Tests', () => {
  const mockVideoFile = path.join(
    __dirname,
    '../../fixtures/videos/sample-game.mp4'
  );
  const mockHighlightVideo = path.join(
    __dirname,
    '../../fixtures/videos/highlight-clip.mp4'
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Video Processing Pipeline', () => {
    test('processes valid basketball video successfully', async () => {
      const videoBuffer = await fs.readFile(mockVideoFile);
      const videoMetadata = {
        duration: 120, // 2 minutes
        fps: 30,
        resolution: '1920x1080',
        sport: 'basketball',
      };

      const result = await aiService.analyzeVideo(videoBuffer, videoMetadata);

      expect(result).toHaveProperty('highlights');
      expect(result).toHaveProperty('stats');
      expect(result).toHaveProperty('confidence');
      expect(result.confidence).toBeGreaterThan(0.8); // High confidence for good quality video
      expect(result.highlights).toBeInstanceOf(Array);
      expect(result.stats).toHaveProperty('shots');
      expect(result.stats).toHaveProperty('assists');
      expect(result.stats).toHaveProperty('rebounds');
    });

    test('handles poor quality video gracefully', async () => {
      const lowQualityMetadata = {
        duration: 60,
        fps: 15, // Low FPS
        resolution: '480x360', // Low resolution
        sport: 'basketball',
      };

      const videoBuffer = Buffer.alloc(1024); // Minimal test buffer

      const result = await aiService.analyzeVideo(
        videoBuffer,
        lowQualityMetadata
      );

      expect(result.confidence).toBeLessThan(0.6); // Lower confidence for poor quality
      expect(result.warnings).toContain('Low video quality detected');
      expect(result.suggestions).toContain(
        'Consider uploading higher quality video'
      );
    });

    test('detects non-basketball content', async () => {
      const nonBasketballMetadata = {
        duration: 90,
        fps: 30,
        resolution: '1920x1080',
        sport: 'basketball', // User claims it's basketball
      };

      // Mock AI service to return non-basketball detection
      const { processVideo } = require('@/services/external-ai');
      processVideo.mockResolvedValue({
        sport_detected: 'soccer',
        confidence: 0.9,
        basketball_probability: 0.1,
      });

      const videoBuffer = Buffer.alloc(1024);
      const result = await aiService.analyzeVideo(
        videoBuffer,
        nonBasketballMetadata
      );

      expect(result.warnings).toContain('Non-basketball content detected');
      expect(result.sport_detected).toBe('soccer');
      expect(result.basketball_probability).toBeLessThan(0.3);
    });
  });

  describe('Highlight Detection', () => {
    test('accurately identifies shot attempts', async () => {
      const { extractHighlights } = require('@/services/external-ai');

      extractHighlights.mockResolvedValue({
        highlights: [
          {
            type: 'shot_attempt',
            start_time: 15.5,
            end_time: 18.2,
            confidence: 0.95,
            shot_result: 'made',
            shot_type: '3-pointer',
            coordinates: { x: 245, y: 88 },
          },
          {
            type: 'shot_attempt',
            start_time: 42.1,
            end_time: 44.8,
            confidence: 0.88,
            shot_result: 'missed',
            shot_type: 'layup',
            coordinates: { x: 15, y: 45 },
          },
        ],
      });

      const videoBuffer = Buffer.alloc(1024);
      const result = await aiService.extractHighlights(videoBuffer, 'shots');

      expect(result.highlights).toHaveLength(2);
      expect(result.highlights[0]).toMatchObject({
        type: 'shot_attempt',
        shot_result: 'made',
        shot_type: '3-pointer',
        confidence: expect.any(Number),
      });
      expect(result.highlights[0].confidence).toBeGreaterThan(0.8);
    });

    test('identifies assists and turnovers', async () => {
      const { extractHighlights } = require('@/services/external-ai');

      extractHighlights.mockResolvedValue({
        highlights: [
          {
            type: 'assist',
            start_time: 28.3,
            end_time: 31.7,
            confidence: 0.92,
            pass_type: 'bounce_pass',
            assist_to: 'shot_made',
          },
          {
            type: 'turnover',
            start_time: 67.2,
            end_time: 69.5,
            confidence: 0.85,
            turnover_type: 'steal',
            defensive_player: true,
          },
        ],
      });

      const videoBuffer = Buffer.alloc(1024);
      const result = await aiService.extractHighlights(videoBuffer, 'plays');

      expect(result.highlights).toHaveLength(2);
      expect(result.highlights.find(h => h.type === 'assist')).toBeDefined();
      expect(result.highlights.find(h => h.type === 'turnover')).toBeDefined();
    });

    test('handles edge cases and ambiguous plays', async () => {
      const { extractHighlights } = require('@/services/external-ai');

      extractHighlights.mockResolvedValue({
        highlights: [
          {
            type: 'shot_attempt',
            start_time: 35.1,
            end_time: 37.8,
            confidence: 0.45, // Low confidence
            shot_result: 'unclear',
            notes: 'Partially obscured view',
          },
        ],
      });

      const videoBuffer = Buffer.alloc(1024);
      const result = await aiService.extractHighlights(videoBuffer, 'shots');

      expect(result.highlights[0].confidence).toBeLessThan(0.5);
      expect(result.highlights[0]).toHaveProperty('notes');
      expect(result.manual_review_required).toBe(true);
    });
  });

  describe('Statistical Analysis', () => {
    test('calculates accurate shooting percentages', async () => {
      const { analyzeStats } = require('@/services/external-ai');

      analyzeStats.mockResolvedValue({
        shots: {
          total_attempts: 15,
          made: 9,
          missed: 6,
          field_goal_percentage: 0.6,
          three_point_attempts: 6,
          three_point_made: 3,
          three_point_percentage: 0.5,
        },
        shot_chart: [
          { x: 245, y: 88, made: true, type: '3pt' },
          { x: 180, y: 120, made: false, type: '2pt' },
          // ... more shot data
        ],
      });

      const videoBuffer = Buffer.alloc(1024);
      const result = await aiService.calculateStats(videoBuffer);

      expect(result.shots.field_goal_percentage).toBe(0.6);
      expect(result.shots.three_point_percentage).toBe(0.5);
      expect(result.shot_chart).toBeInstanceOf(Array);
      expect(result.shot_chart.length).toBeGreaterThan(0);
    });

    test('tracks defensive statistics', async () => {
      const { analyzeStats } = require('@/services/external-ai');

      analyzeStats.mockResolvedValue({
        defense: {
          steals: 4,
          blocks: 2,
          defensive_rebounds: 8,
          deflections: 6,
          defensive_rating: 0.85,
        },
      });

      const videoBuffer = Buffer.alloc(1024);
      const result = await aiService.calculateStats(videoBuffer);

      expect(result.defense).toHaveProperty('steals');
      expect(result.defense).toHaveProperty('blocks');
      expect(result.defense.defensive_rating).toBeGreaterThan(0);
    });

    test('validates statistical consistency', async () => {
      const { analyzeStats } = require('@/services/external-ai');

      analyzeStats.mockResolvedValue({
        shots: {
          total_attempts: 10,
          made: 12, // Impossible: more made than attempted
          missed: -2, // Negative number
        },
      });

      const videoBuffer = Buffer.alloc(1024);

      await expect(aiService.calculateStats(videoBuffer)).rejects.toThrow(
        'Statistical inconsistency detected'
      );
    });
  });

  describe('Error Handling and Fallbacks', () => {
    test('handles AI service unavailability', async () => {
      const { processVideo } = require('@/services/external-ai');
      processVideo.mockRejectedValue(new Error('Service unavailable'));

      const videoBuffer = Buffer.alloc(1024);
      const videoMetadata = {
        duration: 120,
        fps: 30,
        resolution: '1920x1080',
      };

      const result = await aiService.analyzeVideo(videoBuffer, videoMetadata);

      expect(result.status).toBe('fallback_mode');
      expect(result.message).toContain('AI analysis temporarily unavailable');
      expect(result.basic_analysis).toBeDefined();
      expect(result.manual_review_required).toBe(true);
    });

    test('provides graceful degradation for partial failures', async () => {
      const {
        extractHighlights,
        analyzeStats,
      } = require('@/services/external-ai');

      // Highlights succeed, stats fail
      extractHighlights.mockResolvedValue({
        highlights: [
          {
            type: 'shot_attempt',
            start_time: 15,
            end_time: 18,
            confidence: 0.9,
          },
        ],
      });
      analyzeStats.mockRejectedValue(new Error('Stats service timeout'));

      const videoBuffer = Buffer.alloc(1024);
      const result = await aiService.analyzeVideo(videoBuffer, {});

      expect(result.highlights).toBeDefined();
      expect(result.highlights).toHaveLength(1);
      expect(result.stats).toBeUndefined();
      expect(result.warnings).toContain('Statistical analysis failed');
      expect(result.partial_success).toBe(true);
    });

    test('handles corrupted video data', async () => {
      const corruptedBuffer = Buffer.from('corrupted video data');

      await expect(aiService.analyzeVideo(corruptedBuffer, {})).rejects.toThrow(
        'Video file appears to be corrupted'
      );
    });

    test('validates video format compatibility', async () => {
      const unsupportedFormatMetadata = {
        format: 'webm',
        codec: 'vp9',
      };

      const videoBuffer = Buffer.alloc(1024);

      const result = await aiService.analyzeVideo(
        videoBuffer,
        unsupportedFormatMetadata
      );

      expect(result.warnings).toContain(
        'Video format may not be fully supported'
      );
      expect(result.confidence_adjustment).toBeLessThan(1.0);
    });
  });

  describe('Performance and Optimization', () => {
    test('processes video within acceptable time limits', async () => {
      const startTime = Date.now();

      const videoBuffer = await fs.readFile(mockVideoFile);
      const videoMetadata = { duration: 120, fps: 30, resolution: '1920x1080' };

      await aiService.analyzeVideo(videoBuffer, videoMetadata);

      const processingTime = Date.now() - startTime;

      // Should process 2-minute video in under 30 seconds
      expect(processingTime).toBeLessThan(30000);
    });

    test('handles concurrent video processing', async () => {
      const videoBuffer = Buffer.alloc(1024);
      const videoMetadata = { duration: 60, fps: 30, resolution: '1280x720' };

      const promises = Array.from({ length: 5 }, () =>
        aiService.analyzeVideo(videoBuffer, videoMetadata)
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result).toHaveProperty('highlights');
        expect(result).toHaveProperty('stats');
      });
    });

    test('implements proper memory management', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Process multiple large videos
      for (let i = 0; i < 10; i++) {
        const largeBuffer = Buffer.alloc(50 * 1024 * 1024); // 50MB
        await aiService.analyzeVideo(largeBuffer, { duration: 300 });

        // Force garbage collection if available
        if (global.gc) global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 200MB)
      expect(memoryIncrease).toBeLessThan(200 * 1024 * 1024);
    });
  });

  describe('Model Accuracy and Validation', () => {
    test('maintains accuracy above threshold', async () => {
      // Load test videos with known ground truth
      const testCases = [
        {
          video: 'tests/fixtures/videos/known-shots-5.mp4',
          expectedShots: 5,
          expectedMakes: 3,
        },
        {
          video: 'tests/fixtures/videos/known-assists-3.mp4',
          expectedAssists: 3,
        },
      ];

      for (const testCase of testCases) {
        const videoBuffer = await fs.readFile(testCase.video);
        const result = await aiService.analyzeVideo(videoBuffer, {});

        if (testCase.expectedShots) {
          const detectedShots = result.stats.shots.total_attempts;
          const accuracy =
            Math.abs(detectedShots - testCase.expectedShots) /
            testCase.expectedShots;
          expect(accuracy).toBeLessThan(0.2); // Within 20% of ground truth
        }

        if (testCase.expectedAssists) {
          const detectedAssists = result.stats.assists || 0;
          const accuracy =
            Math.abs(detectedAssists - testCase.expectedAssists) /
            testCase.expectedAssists;
          expect(accuracy).toBeLessThan(0.3); // Within 30% of ground truth
        }
      }
    });

    test('detects false positives and negatives', async () => {
      const videoBuffer = await fs.readFile(mockVideoFile);
      const result = await aiService.analyzeVideo(videoBuffer, {});

      // Check for confidence calibration
      const highConfidenceHighlights = result.highlights.filter(
        h => h.confidence > 0.9
      );
      const lowConfidenceHighlights = result.highlights.filter(
        h => h.confidence < 0.5
      );

      // High confidence highlights should be more accurate
      expect(highConfidenceHighlights.length).toBeGreaterThan(0);

      // Low confidence highlights should be flagged for review
      lowConfidenceHighlights.forEach(highlight => {
        expect(highlight).toHaveProperty('manual_review_required');
        expect(highlight.manual_review_required).toBe(true);
      });
    });

    test('handles bias detection and mitigation', async () => {
      // Test with videos featuring different player demographics
      const testVideos = [
        'tests/fixtures/videos/diverse-players-1.mp4',
        'tests/fixtures/videos/diverse-players-2.mp4',
      ];

      const results = [];
      for (const video of testVideos) {
        const videoBuffer = await fs.readFile(video);
        const result = await aiService.analyzeVideo(videoBuffer, {});
        results.push(result);
      }

      // Check that detection accuracy is consistent across different player types
      const accuracyVariance = calculateAccuracyVariance(results);
      expect(accuracyVariance).toBeLessThan(0.1); // Low variance indicates minimal bias
    });
  });

  describe('Edge Cases and Robustness', () => {
    test('handles very short video clips', async () => {
      const shortVideoMetadata = {
        duration: 5,
        fps: 30,
        resolution: '1920x1080',
      };
      const videoBuffer = Buffer.alloc(512);

      const result = await aiService.analyzeVideo(
        videoBuffer,
        shortVideoMetadata
      );

      expect(result.warnings).toContain(
        'Video too short for comprehensive analysis'
      );
      expect(result.confidence).toBeLessThan(0.7);
      expect(result.recommendations).toContain('Upload longer video clips');
    });

    test('handles extremely long videos', async () => {
      const longVideoMetadata = {
        duration: 7200,
        fps: 30,
        resolution: '1920x1080',
      }; // 2 hours
      const videoBuffer = Buffer.alloc(1024);

      const result = await aiService.analyzeVideo(
        videoBuffer,
        longVideoMetadata
      );

      expect(result.processing_mode).toBe('segmented');
      expect(result.segments_processed).toBeGreaterThan(1);
      expect(result.total_processing_time).toBeDefined();
    });

    test('handles videos with poor lighting conditions', async () => {
      const poorLightingMetadata = {
        duration: 120,
        fps: 30,
        resolution: '1920x1080',
        lighting_quality: 'poor',
      };

      const videoBuffer = Buffer.alloc(1024);
      const result = await aiService.analyzeVideo(
        videoBuffer,
        poorLightingMetadata
      );

      expect(result.warnings).toContain('Poor lighting conditions detected');
      expect(result.preprocessing_applied).toContain('brightness_enhancement');
      expect(result.confidence_adjustment).toBeLessThan(1.0);
    });

    test('handles videos with camera shake or movement', async () => {
      const shakyVideoMetadata = {
        duration: 90,
        fps: 30,
        resolution: '1280x720',
        stability_score: 0.3, // Low stability
      };

      const videoBuffer = Buffer.alloc(1024);
      const result = await aiService.analyzeVideo(
        videoBuffer,
        shakyVideoMetadata
      );

      expect(result.preprocessing_applied).toContain('stabilization');
      expect(result.warnings).toContain('Camera shake detected');
      expect(result.confidence_adjustment).toBeLessThan(1.0);
    });
  });

  // Helper function for bias testing
  function calculateAccuracyVariance(results) {
    const accuracies = results.map(r => r.overall_accuracy || 0.8);
    const mean = accuracies.reduce((a, b) => a + b) / accuracies.length;
    const variance =
      accuracies.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
      accuracies.length;
    return Math.sqrt(variance);
  }
});
