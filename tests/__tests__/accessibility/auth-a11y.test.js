const { render, screen } = require('@testing-library/react');
const { axe, toHaveNoViolations } = require('jest-axe');
const React = require('react');
require('@testing-library/jest-dom');

// Import components to test
const AuthForm = require('@/components/auth/AuthForm');
const VideoUpload = require('@/components/video/VideoUpload');
const PlayerDashboard = require('@/components/dashboards/PlayerDashboard');
const AnalyticsChart = require('@/components/analytics/AnalyticsChart');

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Accessibility Tests - Authentication', () => {
  test('login form has no accessibility violations', async () => {
    const { container } = render(
      React.createElement(AuthForm, { mode: 'login' })
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('signup form has proper ARIA labels', () => {
    render(React.createElement(AuthForm, { mode: 'signup' }));

    // Check form has proper labeling
    expect(screen.getByRole('form')).toHaveAttribute('aria-labelledby');

    // Check required fields are marked
    expect(screen.getByLabelText(/email/i)).toHaveAttribute(
      'aria-required',
      'true'
    );
    expect(screen.getByLabelText(/password/i)).toHaveAttribute(
      'aria-required',
      'true'
    );

    // Check password requirements are described
    expect(screen.getByLabelText(/password/i)).toHaveAttribute(
      'aria-describedby'
    );
    expect(
      screen.getByText(/password must be at least 8 characters/i)
    ).toHaveAttribute('id');
  });

  test('error messages are announced to screen readers', async () => {
    const { rerender } = render(
      React.createElement(AuthForm, { mode: 'login', errors: {} })
    );

    // Add error state
    rerender(
      React.createElement(AuthForm, {
        mode: 'login',
        errors: { email: 'Email is required' },
      })
    );

    const errorMessage = screen.getByText(/email is required/i);
    expect(errorMessage).toHaveAttribute('role', 'alert');
    expect(errorMessage).toHaveAttribute('aria-live', 'polite');
  });

  test('form validation provides clear feedback', () => {
    render(
      React.createElement(AuthForm, {
        mode: 'signup',
        errors: {
          email: 'Please enter a valid email address',
          password: 'Password must contain at least one uppercase letter',
        },
      })
    );

    // Check that errors are associated with their inputs
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(passwordInput).toHaveAttribute('aria-invalid', 'true');

    // Check error messages exist and are linked
    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    expect(screen.getByText(/password must contain/i)).toBeInTheDocument();
  });
});

describe('Accessibility Tests - Video Upload', () => {
  test('video upload component has no accessibility violations', async () => {
    const { container } = render(
      React.createElement(VideoUpload, {
        onUploadComplete: jest.fn(),
        onUploadError: jest.fn(),
      })
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('drag and drop area is accessible', () => {
    render(
      React.createElement(VideoUpload, {
        onUploadComplete: jest.fn(),
        onUploadError: jest.fn(),
      })
    );

    const dropZone = screen.getByTestId('video-drop-zone');

    // Check it's focusable and has proper role
    expect(dropZone).toHaveAttribute('tabIndex', '0');
    expect(dropZone).toHaveAttribute('role', 'button');
    expect(dropZone).toHaveAttribute('aria-label');

    // Check it has keyboard instructions
    expect(
      screen.getByText(/press enter or space to select files/i)
    ).toBeInTheDocument();
  });

  test('upload progress is announced', () => {
    render(
      React.createElement(VideoUpload, {
        onUploadComplete: jest.fn(),
        onUploadError: jest.fn(),
        uploadProgress: 50,
        isUploading: true,
      })
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    expect(progressBar).toHaveAttribute('aria-label', 'Upload progress: 50%');

    // Check live region for progress announcements
    const progressAnnouncement = screen.getByLabelText(/upload progress/i);
    expect(progressAnnouncement).toHaveAttribute('aria-live', 'polite');
  });

  test('file validation errors are accessible', () => {
    render(
      React.createElement(VideoUpload, {
        onUploadComplete: jest.fn(),
        onUploadError: jest.fn(),
        validationError: 'File size exceeds 500MB limit',
      })
    );

    const errorMessage = screen.getByText(/file size exceeds 500mb limit/i);
    expect(errorMessage).toHaveAttribute('role', 'alert');
    expect(errorMessage).toHaveAttribute('aria-live', 'assertive');
  });
});

describe('Accessibility Tests - Dashboard', () => {
  const mockPlayerData = {
    name: 'Test Player',
    stats: { points: 100, assists: 50, rebounds: 75 },
    videos: [
      { id: '1', title: 'Game 1', uploadDate: '2024-01-15' },
      { id: '2', title: 'Practice', uploadDate: '2024-01-20' },
    ],
    highlights: ['highlight1', 'highlight2'],
  };

  test('player dashboard has no accessibility violations', async () => {
    const { container } = render(
      React.createElement(PlayerDashboard, { playerData: mockPlayerData })
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('dashboard navigation is accessible', () => {
    render(
      React.createElement(PlayerDashboard, { playerData: mockPlayerData })
    );

    // Check main navigation has proper structure
    const navigation = screen.getByRole('navigation');
    expect(navigation).toHaveAttribute('aria-label', 'Main navigation');

    // Check navigation items are properly labeled
    const navItems = screen.getAllByRole('link');
    navItems.forEach(item => {
      expect(item).toHaveAccessibleName();
    });

    // Check current page is indicated
    const currentPage = screen.getByRole('link', { current: 'page' });
    expect(currentPage).toHaveAttribute('aria-current', 'page');
  });

  test('stats cards are accessible', () => {
    render(
      React.createElement(PlayerDashboard, { playerData: mockPlayerData })
    );

    // Check stats are in a meaningful structure
    const statsRegion = screen.getByRole('region', { name: /statistics/i });
    expect(statsRegion).toBeInTheDocument();

    // Check individual stats have proper labels
    expect(screen.getByText(/100 points/i)).toBeInTheDocument();
    expect(screen.getByText(/50 assists/i)).toBeInTheDocument();
    expect(screen.getByText(/75 rebounds/i)).toBeInTheDocument();

    // Check stats have proper semantic meaning
    const pointsStat = screen.getByText('Points').closest('[role="group"]');
    expect(pointsStat).toHaveAttribute('aria-labelledby');
  });

  test('video grid is accessible', () => {
    render(
      React.createElement(PlayerDashboard, { playerData: mockPlayerData })
    );

    // Check video grid has proper structure
    const videoGrid = screen.getByRole('grid');
    expect(videoGrid).toHaveAttribute('aria-label', 'Your videos');

    // Check video items are accessible
    const videoItems = screen.getAllByRole('gridcell');
    expect(videoItems).toHaveLength(2);

    videoItems.forEach(item => {
      expect(item).toHaveAccessibleName();

      // Check video actions are accessible
      const playButton = item.querySelector('[aria-label*="Play"]');
      if (playButton) {
        expect(playButton).toHaveAttribute('aria-label');
      }
    });
  });
});

describe('Accessibility Tests - Analytics Charts', () => {
  const mockChartData = {
    type: 'shooting',
    data: [
      { x: 10, y: 15, made: true },
      { x: 25, y: 30, made: false },
      { x: 35, y: 20, made: true },
    ],
    title: 'Shooting Chart - Last 5 Games',
  };

  test('analytics chart has no accessibility violations', async () => {
    const { container } = render(
      React.createElement(AnalyticsChart, { chartData: mockChartData })
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('chart has proper alternative text', () => {
    render(React.createElement(AnalyticsChart, { chartData: mockChartData }));

    // Check chart has title
    expect(
      screen.getByText(/shooting chart - last 5 games/i)
    ).toBeInTheDocument();

    // Check chart has alt text or description
    const chartContainer = screen.getByRole('img', { name: /shooting chart/i });
    expect(chartContainer).toHaveAttribute('aria-label');

    // Check data table alternative is provided
    const dataTable = screen.getByRole('table', { hidden: true });
    expect(dataTable).toHaveAttribute('aria-label', 'Shooting data table');
  });

  test('chart data is available in table format', () => {
    render(
      React.createElement(AnalyticsChart, {
        chartData: mockChartData,
        showDataTable: true,
      })
    );

    // Check data table is present
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Check table has proper headers
    expect(screen.getByColumnHeader(/x position/i)).toBeInTheDocument();
    expect(screen.getByColumnHeader(/y position/i)).toBeInTheDocument();
    expect(screen.getByColumnHeader(/result/i)).toBeInTheDocument();

    // Check data rows
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4); // Header + 3 data rows
  });

  test('chart controls are accessible', () => {
    render(
      React.createElement(AnalyticsChart, {
        chartData: mockChartData,
        showControls: true,
      })
    );

    // Check filter controls
    const filterSelect = screen.getByLabelText(/filter by game type/i);
    expect(filterSelect).toBeInTheDocument();
    expect(filterSelect).toHaveAttribute('aria-describedby');

    // Check toggle buttons
    const toggleDataTable = screen.getByRole('button', {
      name: /toggle data table/i,
    });
    expect(toggleDataTable).toHaveAttribute('aria-pressed');

    // Check zoom controls
    const zoomIn = screen.getByRole('button', { name: /zoom in/i });
    const zoomOut = screen.getByRole('button', { name: /zoom out/i });

    expect(zoomIn).toBeInTheDocument();
    expect(zoomOut).toBeInTheDocument();
  });
});

describe('Accessibility Tests - Form Controls', () => {
  test('custom select components are accessible', () => {
    const CustomSelect = require('@/components/common/CustomSelect');

    render(
      React.createElement(CustomSelect, {
        label: 'Position',
        options: [
          { value: 'guard', label: 'Guard' },
          { value: 'forward', label: 'Forward' },
          { value: 'center', label: 'Center' },
        ],
        value: 'guard',
        onChange: jest.fn(),
      })
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-label', 'Position');
    expect(select).toHaveAttribute('aria-expanded', 'false');
    expect(select).toHaveAttribute('aria-haspopup', 'listbox');

    // Check options are properly structured
    fireEvent.click(select);

    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);

    options.forEach(option => {
      expect(option).toHaveAttribute('aria-selected');
    });
  });

  test('date picker is accessible', () => {
    const DatePicker = require('@/components/common/DatePicker');

    render(
      React.createElement(DatePicker, {
        label: 'Game Date',
        value: '2024-01-15',
        onChange: jest.fn(),
      })
    );

    const input = screen.getByLabelText(/game date/i);
    expect(input).toHaveAttribute('type', 'date');
    expect(input).toHaveAttribute('aria-describedby');

    // Check helper text
    expect(
      screen.getByText(/select the date of the game/i)
    ).toBeInTheDocument();
  });

  test('file input is accessible', () => {
    const FileInput = require('@/components/common/FileInput');

    render(
      React.createElement(FileInput, {
        label: 'Upload Video',
        accept: '.mp4,.mov,.avi',
        onChange: jest.fn(),
      })
    );

    const input = screen.getByLabelText(/upload video/i);
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', '.mp4,.mov,.avi');
    expect(input).toHaveAttribute('aria-describedby');

    // Check file requirements are described
    expect(
      screen.getByText(/accepted formats: mp4, mov, avi/i)
    ).toBeInTheDocument();
  });
});

describe('Accessibility Tests - Color Contrast', () => {
  test('meets WCAG AA contrast requirements', async () => {
    const { container } = render(
      React.createElement('div', {
        className: 'app-theme',
        children: [
          React.createElement('h1', { key: 'title' }, 'Dashboard'),
          React.createElement(
            'button',
            {
              key: 'primary-btn',
              className: 'btn-primary',
            },
            'Upload Video'
          ),
          React.createElement(
            'p',
            {
              key: 'text',
              className: 'text-secondary',
            },
            'Secondary text content'
          ),
        ],
      })
    );

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });

    expect(results).toHaveNoViolations();
  });

  test('maintains contrast in dark mode', async () => {
    const { container } = render(
      React.createElement('div', {
        className: 'app-theme dark-mode',
        children: [
          React.createElement('h1', { key: 'title' }, 'Dashboard'),
          React.createElement(
            'button',
            {
              key: 'primary-btn',
              className: 'btn-primary',
            },
            'Upload Video'
          ),
          React.createElement(
            'a',
            {
              key: 'link',
              href: '#',
              className: 'link-primary',
            },
            'View Profile'
          ),
        ],
      })
    );

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });

    expect(results).toHaveNoViolations();
  });
});

describe('Accessibility Tests - Focus Management', () => {
  test('manages focus correctly in modals', () => {
    const Modal = require('@/components/common/Modal');

    const { rerender } = render(
      React.createElement(Modal, {
        isOpen: false,
        title: 'Test Modal',
        children: React.createElement('p', {}, 'Modal content'),
      })
    );

    // Store initial focus
    const initialFocus = document.activeElement;

    // Open modal
    rerender(
      React.createElement(Modal, {
        isOpen: true,
        title: 'Test Modal',
        children: React.createElement('p', {}, 'Modal content'),
      })
    );

    // Focus should be on modal
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(document.activeElement).toBe(
      modal.querySelector('[tabindex="-1"]') || modal
    );

    // Close modal
    rerender(
      React.createElement(Modal, {
        isOpen: false,
        title: 'Test Modal',
        children: React.createElement('p', {}, 'Modal content'),
      })
    );

    // Focus should return to initial element
    expect(document.activeElement).toBe(initialFocus);
  });

  test('maintains focus order in complex layouts', () => {
    const ComplexForm = require('@/components/forms/ComplexForm');

    render(React.createElement(ComplexForm));

    // Get all focusable elements
    const focusableElements = screen
      .getAllByRole('textbox')
      .concat(screen.getAllByRole('button'))
      .concat(screen.getAllByRole('combobox'))
      .sort((a, b) => {
        const aIndex = parseInt(a.getAttribute('tabindex') || '0');
        const bIndex = parseInt(b.getAttribute('tabindex') || '0');
        return aIndex - bIndex;
      });

    // Verify tab order makes logical sense
    expect(focusableElements[0]).toHaveAttribute(
      'data-testid',
      'first-name-input'
    );
    expect(focusableElements[1]).toHaveAttribute(
      'data-testid',
      'last-name-input'
    );
    expect(focusableElements[2]).toHaveAttribute('data-testid', 'email-input');
    // ... continue for logical order
  });
});

describe('Accessibility Tests - Screen Reader Support', () => {
  test('provides proper landmark structure', () => {
    const AppLayout = require('@/components/layout/AppLayout');

    render(
      React.createElement(AppLayout, {
        children: React.createElement('div', {}, 'Content'),
      })
    );

    // Check for proper landmarks
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('navigation')).toBeInTheDocument(); // nav
    expect(screen.getByRole('main')).toBeInTheDocument(); // main content
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer

    // Check landmarks have labels when multiple exist
    const navElements = screen.getAllByRole('navigation');
    if (navElements.length > 1) {
      navElements.forEach(nav => {
        expect(nav).toHaveAttribute('aria-label');
      });
    }
  });

  test('announces dynamic content changes', () => {
    const DynamicContent = require('@/components/common/DynamicContent');

    const { rerender } = render(
      React.createElement(DynamicContent, {
        status: 'loading',
        message: 'Loading data...',
      })
    );

    // Check loading state is announced
    expect(screen.getByText(/loading data/i)).toHaveAttribute(
      'aria-live',
      'polite'
    );

    // Update to success state
    rerender(
      React.createElement(DynamicContent, {
        status: 'success',
        message: 'Data loaded successfully',
      })
    );

    // Check success is announced
    expect(screen.getByText(/data loaded successfully/i)).toHaveAttribute(
      'aria-live',
      'polite'
    );

    // Update to error state
    rerender(
      React.createElement(DynamicContent, {
        status: 'error',
        message: 'Failed to load data',
      })
    );

    // Check error is announced assertively
    expect(screen.getByText(/failed to load data/i)).toHaveAttribute(
      'aria-live',
      'assertive'
    );
  });

  test('provides skip links for keyboard navigation', () => {
    const MainLayout = require('@/components/layout/MainLayout');

    render(React.createElement(MainLayout));

    // Check skip links exist
    const skipLinks = screen.getAllByText(/skip to/i);
    expect(skipLinks.length).toBeGreaterThan(0);

    // Check skip links are positioned correctly
    const skipToMain = screen.getByText(/skip to main content/i);
    expect(skipToMain).toHaveAttribute('href', '#main-content');

    // Check skip links are visually hidden but focusable
    expect(skipToMain).toHaveClass('sr-only-focusable');
  });
});
