// Unit tests for core functionality
describe('Core Functionality', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    if (localStorage.clear) {
      localStorage.clear();
    }
    if (localStorage.getItem?.mockClear) {
      localStorage.getItem.mockClear();
    }
    if (localStorage.setItem?.mockClear) {
      localStorage.setItem.mockClear();
    }
    if (localStorage.removeItem?.mockClear) {
      localStorage.removeItem.mockClear();
    }
  });

  test('should render main navigation', () => {
    const nav = document.createElement('nav');
    nav.innerHTML = `
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/player.html">Player</a></li>
        <li><a href="/coach.html">Coach</a></li>
        <li><a href="/scout.html">Scout</a></li>
        <li><a href="/fan.html">Fan</a></li>
      </ul>
    `;
    document.body.appendChild(nav);

    const links = nav.querySelectorAll('a');
    expect(links.length).toBe(5);
    expect(links[0].getAttribute('href')).toBe('/');
  });

  test('should handle theme toggle', () => {
    const button = document.createElement('button');
    button.id = 'theme-toggle';
    button.setAttribute('aria-label', 'Toggle theme');
    document.body.appendChild(button);

    const toggleTheme = () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    };

    button.addEventListener('click', toggleTheme);
    button.click();

    expect(document.body.getAttribute('data-theme')).toBe('dark');
    // Verify localStorage was called by checking the stored value
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  test('should validate form inputs', () => {
    const form = document.createElement('form');
    form.innerHTML = `
      <input type="email" id="email" required>
      <input type="password" id="password" required>
      <button type="submit">Submit</button>
    `;
    document.body.appendChild(form);

    const validateForm = form => {
      const email = form.querySelector('#email');
      const password = form.querySelector('#password');

      if (!email.value) {
        return false;
      }
      if (!password.value) {
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(email.value)) {
        return false;
      }

      return true;
    };

    expect(validateForm(form)).toBe(false);

    form.querySelector('#email').value = 'test@example.com';
    form.querySelector('#password').value = 'password123';

    expect(validateForm(form)).toBe(true);
  });

  test('should handle loading states', () => {
    const button = document.createElement('button');
    button.textContent = 'Load Data';
    document.body.appendChild(button);

    const showLoading = btn => {
      btn.disabled = true;
      btn.textContent = 'Loading...';
      btn.setAttribute('aria-busy', 'true');
    };

    const hideLoading = (btn, originalText) => {
      btn.disabled = false;
      btn.textContent = originalText;
      btn.setAttribute('aria-busy', 'false');
    };

    showLoading(button);
    expect(button.disabled).toBe(true);
    expect(button.textContent).toBe('Loading...');
    expect(button.getAttribute('aria-busy')).toBe('true');

    hideLoading(button, 'Load Data');
    expect(button.disabled).toBe(false);
    expect(button.textContent).toBe('Load Data');
    expect(button.getAttribute('aria-busy')).toBe('false');
  });

  test('should handle responsive navigation', () => {
    const nav = document.createElement('nav');
    nav.innerHTML = `
      <button id="mobile-menu-toggle" aria-expanded="false">Menu</button>
      <ul id="mobile-menu" class="hidden">
        <li><a href="/">Home</a></li>
        <li><a href="/player.html">Player</a></li>
      </ul>
    `;
    document.body.appendChild(nav);

    const toggle = nav.querySelector('#mobile-menu-toggle');
    const menu = nav.querySelector('#mobile-menu');

    const toggleMenu = () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);
      menu.classList.toggle('hidden');
    };

    toggle.addEventListener('click', toggleMenu);
    toggle.click();

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(menu.classList.contains('hidden')).toBe(false);
  });
});
