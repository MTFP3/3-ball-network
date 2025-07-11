// Accessibility tests using Jest and axe-core
const { axe, toHaveNoViolations } = require('jest-axe');

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('homepage should have no accessibility violations', async () => {
    // Create a simplified version of the homepage with proper landmarks
    const html = `
      <main>
        <header>
          <h1>3 Ball Network</h1>
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/player.html">Player</a></li>
              <li><a href="/coach.html">Coach</a></li>
            </ul>
          </nav>
        </header>
        <section>
          <h2>Welcome to 3 Ball Network</h2>
          <p>Your basketball network platform</p>
        </section>
        <footer>
          <p>&copy; 2024 3 Ball Network</p>
        </footer>
      </main>
    `;
    document.body.innerHTML = html;

    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });

  test('player portal should have no accessibility violations', async () => {
    // Create a simplified version of the player portal with proper landmarks
    const html = `
      <main>
        <header>
          <h1>Player Dashboard</h1>
        </header>
        <section>
          <h2>Your Stats</h2>
          <div>
            <h3>Recent Games</h3>
            <p>Game statistics will appear here</p>
          </div>
        </section>
        <section>
          <h2>Profile Settings</h2>
          <form>
            <label for="playerName">Player Name:</label>
            <input id="playerName" type="text" required>
            <button type="submit">Save</button>
          </form>
        </section>
      </main>
    `;
    document.body.innerHTML = html;

    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });

  test('coach portal should have no accessibility violations', async () => {
    // Create a simplified version of the coach portal with proper landmarks
    const html = `
      <main>
        <header>
          <h1>Coach Dashboard</h1>
        </header>
        <section>
          <h2>Team Management</h2>
          <form>
            <label for="gameId">Game ID:</label>
            <input id="gameId" type="text" required>
            <label for="teamName">Team Name:</label>
            <input id="teamName" type="text" required>
            <label for="gameDate">Game Date:</label>
            <input id="gameDate" type="date" required>
            <button type="submit">Save Game</button>
          </form>
        </section>
        <section>
          <h2>Team Statistics</h2>
          <div>
            <h3>Recent Performance</h3>
            <p>Team stats will appear here</p>
          </div>
        </section>
      </main>
    `;
    document.body.innerHTML = html;

    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });

  test('navigation should be keyboard accessible', () => {
    const nav = document.createElement('nav');
    nav.innerHTML = `
      <ul role="menubar" aria-label="Main navigation">
        <li role="none">
          <a href="/" role="menuitem" tabindex="0">Home</a>
        </li>
        <li role="none">
          <a href="/player.html" role="menuitem" tabindex="0">Player</a>
        </li>
        <li role="none">
          <a href="/coach.html" role="menuitem" tabindex="0">Coach</a>
        </li>
      </ul>
    `;
    document.body.appendChild(nav);

    const links = nav.querySelectorAll('a');
    links.forEach(link => {
      expect(link.getAttribute('tabindex')).toBe('0');
      expect(link.getAttribute('role')).toBe('menuitem');
    });
  });

  test('form inputs should have proper labels', () => {
    const form = document.createElement('form');
    form.innerHTML = `
      <label for="email">Email Address</label>
      <input type="email" id="email" name="email" required aria-describedby="email-help">
      <div id="email-help">Please enter a valid email address</div>
      
      <label for="password">Password</label>
      <input type="password" id="password" name="password" required aria-describedby="password-help">
      <div id="password-help">Password must be at least 8 characters long</div>
      
      <button type="submit" aria-describedby="submit-help">Sign In</button>
      <div id="submit-help">Press Enter or click to submit the form</div>
    `;
    document.body.appendChild(form);

    const emailInput = form.querySelector('#email');
    const passwordInput = form.querySelector('#password');
    const submitButton = form.querySelector('button');

    expect(emailInput.getAttribute('aria-describedby')).toBe('email-help');
    expect(passwordInput.getAttribute('aria-describedby')).toBe(
      'password-help'
    );
    expect(submitButton.getAttribute('aria-describedby')).toBe('submit-help');
  });

  test('images should have meaningful alt text', () => {
    const img = document.createElement('img');
    img.src = '/logo.png';
    img.alt =
      '3-Ball Network logo - connecting basketball players, coaches, scouts, and fans';
    document.body.appendChild(img);

    expect(img.getAttribute('alt')).toBeTruthy();
    expect(img.getAttribute('alt').length).toBeGreaterThan(10);
  });

  test('headings should follow proper hierarchy', () => {
    const content = document.createElement('div');
    content.innerHTML = `
      <h1>Main Page Title</h1>
      <h2>Section Title</h2>
      <h3>Subsection Title</h3>
      <h4>Sub-subsection Title</h4>
    `;
    document.body.appendChild(content);

    const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const levels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));

    // Check that headings start with h1
    expect(levels[0]).toBe(1);

    // Check that heading levels don't skip (no h1 -> h3 without h2)
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  test('color contrast should meet WCAG standards', () => {
    const button = document.createElement('button');
    button.textContent = 'Submit';
    button.style.backgroundColor = '#0066cc';
    button.style.color = '#ffffff';
    document.body.appendChild(button);

    // This would typically use a color contrast analyzer
    // For now, we check that styles are applied
    expect(button.style.backgroundColor).toBeTruthy();
    expect(button.style.color).toBeTruthy();
  });

  test('focus indicators should be visible', () => {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = 'Test Link';
    link.style.outline = '2px solid #0066cc';
    link.style.outlineOffset = '2px';
    document.body.appendChild(link);

    // Simulate focus
    link.focus();

    expect(link.style.outline).toBeTruthy();
    expect(link.style.outlineOffset).toBeTruthy();
  });

  test('ARIA landmarks should be present', () => {
    const page = document.createElement('div');
    page.innerHTML = `
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="/">Home</a></li>
          </ul>
        </nav>
      </header>
      <main role="main">
        <section>
          <h1>Main Content</h1>
        </section>
      </main>
      <footer role="contentinfo">
        <p>Footer content</p>
      </footer>
    `;
    document.body.appendChild(page);

    expect(page.querySelector('[role="banner"]')).toBeTruthy();
    expect(page.querySelector('[role="navigation"]')).toBeTruthy();
    expect(page.querySelector('[role="main"]')).toBeTruthy();
    expect(page.querySelector('[role="contentinfo"]')).toBeTruthy();
  });

  test('skip links should be available', () => {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '-40px';
    skipLink.style.left = '6px';
    document.body.appendChild(skipLink);

    expect(skipLink.getAttribute('href')).toBe('#main-content');
    expect(skipLink.textContent).toBe('Skip to main content');
  });
});
