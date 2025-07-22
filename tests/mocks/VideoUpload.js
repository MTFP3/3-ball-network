// Mock VideoUpload component
const React = require('react');

const VideoUpload = props => {
  const { showMetadata, isUploading, onUpload, onFileSelect } = props || {};

  const elements = [
    // Upload area with instructions
    React.createElement(
      'div',
      {
        key: 'upload-area',
        'data-testid': 'upload-area',
        className: 'upload-area',
        'aria-label': 'Video upload area',
      },
      'Drag and drop your video here or click to browse'
    ),

    // Format instructions
    React.createElement(
      'div',
      {
        key: 'format-info',
        'data-testid': 'format-info',
      },
      'Supported formats: MP4, MOV, AVI'
    ),

    // File input with label
    React.createElement(
      'label',
      {
        key: 'file-label',
        htmlFor: 'file-input',
      },
      'Select Video File'
    ),
    React.createElement('input', {
      key: 'file',
      id: 'file-input',
      'data-testid': 'file-input',
      type: 'file',
      accept: 'video/*',
      'aria-required': 'true',
    }),

    // Upload button
    React.createElement(
      'button',
      {
        key: 'upload',
        'data-testid': 'upload-button',
        type: 'button',
        disabled: !props?.file || isUploading,
        'aria-label': 'Upload selected video',
      },
      isUploading ? 'Uploading...' : 'Upload Video'
    ),

    // Progress indicator
    React.createElement(
      'div',
      {
        key: 'progress',
        'data-testid': 'progress-indicator',
        'aria-live': 'polite',
        'aria-label': 'Upload progress',
      },
      `Progress: ${props?.progress || 0}%`
    ),

    // Progress bar
    React.createElement('div', {
      key: 'progress-bar',
      'data-testid': 'progress-bar',
      role: 'progressbar',
      'aria-valuenow': props?.progress || 0,
      'aria-valuemin': 0,
      'aria-valuemax': 100,
    }),

    // Error display
    React.createElement(
      'div',
      {
        key: 'error-message',
        'data-testid': 'error-message',
        'aria-live': 'assertive',
        style: { display: props?.error ? 'block' : 'none' },
      },
      props?.error || ''
    ),

    // Success message
    React.createElement(
      'div',
      {
        key: 'success-message',
        'data-testid': 'success-message',
        'aria-live': 'polite',
        style: { display: props?.success ? 'block' : 'none' },
      },
      props?.success || ''
    ),
  ];

  // Add metadata form if requested
  if (showMetadata) {
    elements.push(
      React.createElement(
        'div',
        {
          key: 'metadata-form',
          'data-testid': 'metadata-form',
          className: 'metadata-form',
        },
        [
          React.createElement(
            'label',
            {
              key: 'game-date-label',
              htmlFor: 'game-date',
            },
            'Game Date'
          ),
          React.createElement('input', {
            key: 'game-date',
            id: 'game-date',
            'data-testid': 'game-date',
            type: 'date',
          }),
          React.createElement(
            'label',
            {
              key: 'opponent-label',
              htmlFor: 'opponent',
            },
            'Opponent'
          ),
          React.createElement('input', {
            key: 'opponent',
            id: 'opponent',
            'data-testid': 'opponent',
            type: 'text',
            placeholder: 'Enter opponent name',
          }),
          React.createElement(
            'label',
            {
              key: 'title-label',
              htmlFor: 'video-title',
            },
            'Video Title'
          ),
          React.createElement('input', {
            key: 'title',
            id: 'video-title',
            'data-testid': 'video-title',
            type: 'text',
            placeholder: 'Enter video title',
          }),
          React.createElement(
            'label',
            {
              key: 'description-label',
              htmlFor: 'video-description',
            },
            'Description'
          ),
          React.createElement('textarea', {
            key: 'description',
            id: 'video-description',
            'data-testid': 'video-description',
            placeholder: 'Enter video description',
          }),
        ]
      )
    );
  }

  return React.createElement(
    'div',
    {
      'data-testid': 'video-upload',
      className: 'video-upload',
      role: 'form',
      'aria-label': 'Video upload form',
    },
    elements.filter(Boolean)
  );
};

module.exports = VideoUpload;
