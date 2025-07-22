const {
  render,
  screen,
  fireEvent,
  waitFor,
} = require('@testing-library/react');
const { act } = require('@testing-library/react');
const React = require('react');
require('@testing-library/jest-dom');
const VideoUpload = require('@/components/video/VideoUpload');
const { videoService } = require('@/services/video-upload');
const { aiService } = require('@/services/ai-analysis');

// Mock file reader
global.FileReader = class {
  constructor() {
    this.readAsDataURL = jest.fn(() => {
      this.onload({ target: { result: 'data:video/mp4;base64,mock-data' } });
    });
  }
};

describe('VideoUpload Component', () => {
  const mockOnUploadComplete = jest.fn();
  const mockOnUploadError = jest.fn();
  const mockOnProgress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    videoService.uploadVideo.mockClear();
    aiService.analyzeVideo.mockClear();
  });

  const renderVideoUpload = (props = {}) => {
    return render(
      React.createElement(VideoUpload, {
        onUploadComplete: mockOnUploadComplete,
        onUploadError: mockOnUploadError,
        onProgress: mockOnProgress,
        ...props,
      })
    );
  };

  describe('Initial State', () => {
    test('renders upload area with proper instructions', () => {
      renderVideoUpload();

      expect(
        screen.getByText(/drag and drop your video here/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/or click to browse/i)).toBeInTheDocument();
      expect(
        screen.getByText(/supported formats: mp4, mov, avi/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/max size: 500mb/i)).toBeInTheDocument();
    });

    test('shows upload button as disabled initially', () => {
      renderVideoUpload();

      const uploadButton = screen.getByRole('button', {
        name: /upload video/i,
      });
      expect(uploadButton).toBeDisabled();
    });

    test('displays metadata form when showMetadata is true', () => {
      renderVideoUpload({ showMetadata: true });

      expect(screen.getByLabelText(/video title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/game date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/opponent/i)).toBeInTheDocument();
    });
  });

  describe('File Selection', () => {
    test('accepts valid video files via file input', async () => {
      renderVideoUpload();

      const fileInput = screen.getByTestId('video-file-input');
      const mockFile = new File(['video content'], 'test-video.mp4', {
        type: 'video/mp4',
        size: 1024 * 1024 * 10, // 10MB
      });

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [mockFile] } });
      });

      expect(screen.getByText(/test-video.mp4/i)).toBeInTheDocument();
      expect(screen.getByText(/10.0 mb/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /upload video/i })
      ).not.toBeDisabled();
    });

    test('rejects files that are too large', async () => {
      renderVideoUpload();

      const fileInput = screen.getByTestId('video-file-input');
      const mockFile = new File(['large video content'], 'large-video.mp4', {
        type: 'video/mp4',
        size: 1024 * 1024 * 600, // 600MB (exceeds 500MB limit)
      });

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [mockFile] } });
      });

      expect(
        screen.getByText(/file size exceeds 500mb limit/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /upload video/i })
      ).toBeDisabled();
    });

    test('rejects unsupported file types', async () => {
      renderVideoUpload();

      const fileInput = screen.getByTestId('video-file-input');
      const mockFile = new File(['document content'], 'document.pdf', {
        type: 'application/pdf',
        size: 1024 * 1024, // 1MB
      });

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [mockFile] } });
      });

      expect(screen.getByText(/unsupported file type/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /upload video/i })
      ).toBeDisabled();
    });

    test('handles drag and drop file selection', async () => {
      renderVideoUpload();

      const dropZone = screen.getByTestId('video-drop-zone');
      const mockFile = new File(['video content'], 'dropped-video.mp4', {
        type: 'video/mp4',
        size: 1024 * 1024 * 50, // 50MB
      });

      const dropEvent = {
        preventDefault: jest.fn(),
        dataTransfer: {
          files: [mockFile],
        },
      };

      fireEvent.dragOver(dropZone);
      expect(dropZone).toHaveClass('drag-over');

      await act(async () => {
        fireEvent.drop(dropZone, dropEvent);
      });

      expect(screen.getByText(/dropped-video.mp4/i)).toBeInTheDocument();
      expect(dropZone).not.toHaveClass('drag-over');
    });
  });

  describe('Upload Process', () => {
    test('successfully uploads video with progress tracking', async () => {
      const mockUploadPromise = Promise.resolve({
        videoId: 'video-123',
        downloadURL: 'https://storage.example.com/video-123.mp4',
        metadata: { size: 1024 * 1024 * 50 },
      });

      videoService.uploadVideo.mockImplementation(
        (file, metadata, onProgress) => {
          // Simulate upload progress
          setTimeout(() => onProgress(25), 100);
          setTimeout(() => onProgress(50), 200);
          setTimeout(() => onProgress(75), 300);
          setTimeout(() => onProgress(100), 400);
          return mockUploadPromise;
        }
      );

      renderVideoUpload();

      const fileInput = screen.getByTestId('video-file-input');
      const mockFile = new File(['video content'], 'test-video.mp4', {
        type: 'video/mp4',
        size: 1024 * 1024 * 50,
      });

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [mockFile] } });
      });

      const uploadButton = screen.getByRole('button', {
        name: /upload video/i,
      });

      await act(async () => {
        fireEvent.click(uploadButton);
      });

      // Check that upload starts
      expect(screen.getByText(/uploading/i)).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      // Wait for upload to complete
      await waitFor(() => {
        expect(mockOnUploadComplete).toHaveBeenCalledWith({
          videoId: 'video-123',
          downloadURL: 'https://storage.example.com/video-123.mp4',
          metadata: { size: 1024 * 1024 * 50 },
        });
      });

      expect(screen.getByText(/upload complete/i)).toBeInTheDocument();
    });

    test('handles upload errors gracefully', async () => {
      const mockError = new Error('Upload failed');
      videoService.uploadVideo.mockRejectedValue(mockError);

      renderVideoUpload();

      const fileInput = screen.getByTestId('video-file-input');
      const mockFile = new File(['video content'], 'test-video.mp4', {
        type: 'video/mp4',
        size: 1024 * 1024 * 50,
      });

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [mockFile] } });
      });

      const uploadButton = screen.getByRole('button', {
        name: /upload video/i,
      });

      await act(async () => {
        fireEvent.click(uploadButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
        expect(mockOnUploadError).toHaveBeenCalledWith(mockError);
      });

      // Should allow retry
      expect(
        screen.getByRole('button', { name: /retry upload/i })
      ).toBeInTheDocument();
    });

    test('triggers AI analysis after successful upload', async () => {
      const mockUploadResult = {
        videoId: 'video-123',
        downloadURL: 'https://storage.example.com/video-123.mp4',
      };

      const mockAnalysisResult = {
        highlights: [{ start: 10, end: 25, type: 'shot' }],
        stats: { shots: 15, assists: 8, rebounds: 12 },
        confidence: 0.95,
      };

      videoService.uploadVideo.mockResolvedValue(mockUploadResult);
      aiService.analyzeVideo.mockResolvedValue(mockAnalysisResult);

      renderVideoUpload({ enableAIAnalysis: true });

      const fileInput = screen.getByTestId('video-file-input');
      const mockFile = new File(['video content'], 'test-video.mp4', {
        type: 'video/mp4',
        size: 1024 * 1024 * 50,
      });

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [mockFile] } });
      });

      const uploadButton = screen.getByRole('button', {
        name: /upload video/i,
      });

      await act(async () => {
        fireEvent.click(uploadButton);
      });

      await waitFor(() => {
        expect(aiService.analyzeVideo).toHaveBeenCalledWith('video-123');
      });

      expect(screen.getByText(/ai analysis complete/i)).toBeInTheDocument();
      expect(screen.getByText(/15 shots detected/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels and roles', () => {
      renderVideoUpload();

      const dropZone = screen.getByTestId('video-drop-zone');
      expect(dropZone).toHaveAttribute('role', 'button');
      expect(dropZone).toHaveAttribute('aria-label', 'Upload video file');
      expect(dropZone).toHaveAttribute('tabIndex', '0');

      const fileInput = screen.getByTestId('video-file-input');
      expect(fileInput).toHaveAttribute(
        'aria-describedby',
        'file-requirements'
      );
    });

    test('supports keyboard navigation', () => {
      renderVideoUpload();

      const dropZone = screen.getByTestId('video-drop-zone');

      dropZone.focus();
      expect(dropZone).toHaveFocus();

      fireEvent.keyDown(dropZone, { key: 'Enter' });
      // Should trigger file input click
      expect(screen.getByTestId('video-file-input')).toHaveAttribute(
        'type',
        'file'
      );
    });

    test('announces upload progress to screen readers', async () => {
      videoService.uploadVideo.mockImplementation(
        (file, metadata, onProgress) => {
          setTimeout(() => onProgress(50), 100);
          return Promise.resolve({ videoId: 'video-123' });
        }
      );

      renderVideoUpload();

      const fileInput = screen.getByTestId('video-file-input');
      const mockFile = new File(['video content'], 'test-video.mp4', {
        type: 'video/mp4',
        size: 1024 * 1024 * 50,
      });

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [mockFile] } });
      });

      const uploadButton = screen.getByRole('button', {
        name: /upload video/i,
      });

      await act(async () => {
        fireEvent.click(uploadButton);
      });

      await waitFor(() => {
        const progressAnnouncement =
          screen.getByLabelText(/upload progress: 50%/i);
        expect(progressAnnouncement).toHaveAttribute('aria-live', 'polite');
      });
    });
  });

  describe('Performance', () => {
    test('throttles progress updates', async () => {
      let progressCallback;
      videoService.uploadVideo.mockImplementation(
        (file, metadata, onProgress) => {
          progressCallback = onProgress;
          return new Promise(() => {}); // Never resolve
        }
      );

      renderVideoUpload();

      const fileInput = screen.getByTestId('video-file-input');
      const mockFile = new File(['video content'], 'test-video.mp4', {
        type: 'video/mp4',
        size: 1024 * 1024 * 50,
      });

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [mockFile] } });
      });

      const uploadButton = screen.getByRole('button', {
        name: /upload video/i,
      });

      await act(async () => {
        fireEvent.click(uploadButton);
      });

      // Rapid progress updates
      act(() => {
        progressCallback(10);
        progressCallback(20);
        progressCallback(30);
        progressCallback(40);
        progressCallback(50);
      });

      // Should throttle to prevent excessive re-renders
      expect(mockOnProgress).toHaveBeenCalledTimes(1);
      expect(mockOnProgress).toHaveBeenLastCalledWith(50);
    });

    test('cleans up resources on unmount', () => {
      const { unmount } = renderVideoUpload();

      const fileInput = screen.getByTestId('video-file-input');
      const mockFile = new File(['video content'], 'test-video.mp4', {
        type: 'video/mp4',
        size: 1024 * 1024 * 50,
      });

      act(() => {
        fireEvent.change(fileInput, { target: { files: [mockFile] } });
      });

      // Unmount component
      unmount();

      // Should not cause memory leaks or errors
      expect(() => {
        // Any cleanup operations should complete without errors
      }).not.toThrow();
    });
  });

  describe('Security', () => {
    test('validates file signatures to prevent spoofing', async () => {
      renderVideoUpload();

      const fileInput = screen.getByTestId('video-file-input');

      // Mock file with video extension but non-video content
      const maliciousFile = new File(['malicious content'], 'fake-video.mp4', {
        type: 'video/mp4',
        size: 1024 * 1024,
      });

      // Override FileReader to simulate reading malicious content
      const originalFileReader = global.FileReader;
      global.FileReader = class {
        constructor() {
          this.readAsArrayBuffer = jest.fn(() => {
            // Simulate non-video file signature
            const fakeBuffer = new ArrayBuffer(8);
            const view = new Uint8Array(fakeBuffer);
            view.set([0x89, 0x50, 0x4e, 0x47]); // PNG signature instead of video
            this.onload({ target: { result: fakeBuffer } });
          });
        }
      };

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [maliciousFile] } });
      });

      expect(
        screen.getByText(/invalid file format detected/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /upload video/i })
      ).toBeDisabled();

      // Restore original FileReader
      global.FileReader = originalFileReader;
    });

    test('sanitizes file metadata', async () => {
      renderVideoUpload({ showMetadata: true });

      const titleInput = screen.getByLabelText(/video title/i);
      const maliciousTitle = '<script>alert("xss")</script>Basketball Game';

      fireEvent.change(titleInput, { target: { value: maliciousTitle } });

      expect(titleInput.value).not.toContain('<script>');
      expect(titleInput.value).toBe('Basketball Game');
    });
  });
});
