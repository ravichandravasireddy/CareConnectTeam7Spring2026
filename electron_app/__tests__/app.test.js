/**
 * Unit tests for CareConnect Electron renderer (app.js)
 * Covers auth flow, forms, navigation, and UI logic
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

let document;
let window;

function loadApp(options = {}) {
  const { withElectronAPI = true } = options;
  const htmlPath = path.join(__dirname, '../renderer/index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const htmlWithoutApp = html.replace('<script src="app.js"></script>', '');

  const dom = new JSDOM(htmlWithoutApp, {
    url: 'file://' + path.join(__dirname, '../renderer/'),
  });

  document = dom.window.document;
  window = dom.window;
  global.document = document;
  global.window = window;

  if (withElectronAPI) {
    window.electronAPI = {
      invoke: () => Promise.resolve({}),
      onMenuAction: (cb) => { window.__menuActionCallback = cb; },
    };
  } else {
    delete window.electronAPI;
    const alertMock = jest.fn();
    window.alert = alertMock;
    global.alert = alertMock;
  }

  jest.isolateModules(() => {
    require('../renderer/app.js');
  });

  return { document, window };
}

beforeEach(() => {
  loadApp();
});

describe('Welcome Screen', () => {
  it('shows welcome screen by default', () => {
    const welcome = document.getElementById('screen-welcome');
    expect(welcome.hidden).toBe(false);
  });

  it('Get Started navigates to role selection', () => {
    document.getElementById('btn-get-started').click();
    expect(document.getElementById('screen-role').hidden).toBe(false);
  });

  it('Sign In navigates to signin screen', () => {
    document.getElementById('btn-sign-in').click();
    expect(document.getElementById('screen-signin').hidden).toBe(false);
  });
});

describe('Role Selection', () => {
  beforeEach(() => {
    document.getElementById('btn-get-started').click();
  });

  it('Back returns to welcome', () => {
    document.getElementById('role-back').click();
    expect(document.getElementById('screen-welcome').hidden).toBe(false);
  });

  it('Care Recipient navigates to registration', () => {
    document.getElementById('role-patient').click();
    expect(document.getElementById('screen-registration').hidden).toBe(false);
  });

  it('Caregiver navigates to registration', () => {
    document.getElementById('role-caregiver').click();
    expect(document.getElementById('screen-registration').hidden).toBe(false);
  });
});

describe('Sign In Screen', () => {
  beforeEach(() => {
    document.getElementById('btn-sign-in').click();
  });

  it('Back returns to welcome', () => {
    document.getElementById('signin-back').click();
    expect(document.getElementById('screen-welcome').hidden).toBe(false);
  });

  it('Sign Up navigates to registration', () => {
    document.getElementById('signin-to-register').click();
    expect(document.getElementById('screen-registration').hidden).toBe(false);
  });

  it('validates empty email', () => {
    const form = document.getElementById('form-signin');
    form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    expect(document.getElementById('signin-email-error').textContent).toContain('required');
  });

  it('validates invalid email format', () => {
    document.getElementById('signin-email').value = 'invalid';
    document.getElementById('signin-password').value = 'pass';
    document.getElementById('form-signin').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    expect(document.getElementById('signin-email-error').textContent).toContain('valid email');
  });

  it('validates empty password', () => {
    document.getElementById('signin-email').value = 'test@test.com';
    document.getElementById('form-signin').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    expect(document.getElementById('signin-password-error').textContent).toContain('required');
  });

  it('signs in successfully as patient', (done) => {
    document.getElementById('signin-email').value = 'patient@careconnect.demo';
    document.getElementById('signin-password').value = 'password123';
    document.getElementById('form-signin').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

    setTimeout(() => {
      expect(document.getElementById('dashboard-view').hidden).toBe(false);
      expect(document.getElementById('auth-view').hidden).toBe(true);
      done();
    }, 700);
  });

  it('signs in successfully as caregiver', (done) => {
    document.getElementById('signin-email').value = 'caregiver@careconnect.demo';
    document.getElementById('signin-password').value = 'password123';
    document.getElementById('form-signin').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

    setTimeout(() => {
      expect(document.getElementById('dashboard-view').hidden).toBe(false);
      done();
    }, 700);
  });

  it('shows error for invalid credentials', (done) => {
    document.getElementById('signin-email').value = 'wrong@test.com';
    document.getElementById('signin-password').value = 'wrongpass';
    document.getElementById('form-signin').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

    setTimeout(() => {
      expect(document.getElementById('signin-password-error').textContent).toContain('Invalid');
      done();
    }, 700);
  });

  it('password toggle shows/hides password', () => {
    const input = document.getElementById('signin-password');
    const btn = document.getElementById('signin-toggle-pw');
    expect(input.type).toBe('password');
    btn.click();
    expect(input.type).toBe('text');
    expect(btn.textContent).toBe('Hide password');
    btn.click();
    expect(input.type).toBe('password');
    expect(btn.textContent).toContain('Show');
  });

  it('forgot password triggers announcement', () => {
    document.getElementById('btn-forgot-password').click();
    expect(document.getElementById('status-announce').textContent).toContain('Forgot password');
  });

  it('forgot password invokes electronAPI when available', () => {
    const invokeSpy = jest.fn().mockResolvedValue({});
    window.electronAPI.invoke = invokeSpy;
    document.getElementById('btn-sign-in').click();
    document.getElementById('btn-forgot-password').click();
    expect(invokeSpy).toHaveBeenCalledWith('show-message', expect.objectContaining({
      type: 'info',
      title: 'Coming Soon',
      message: 'Forgot password feature coming soon',
    }));
  });
});

describe('Fallback when electronAPI not available', () => {
  beforeEach(() => {
    loadApp({ withElectronAPI: false });
  });

  it('forgot password uses alert fallback', () => {
    document.getElementById('btn-sign-in').click();
    document.getElementById('btn-forgot-password').click();
    expect(window.alert).toHaveBeenCalledWith('Forgot password feature coming soon');
  });

  it('sign in as patient uses alert fallback', (done) => {
    document.getElementById('btn-sign-in').click();
    document.getElementById('signin-email').value = 'patient@careconnect.demo';
    document.getElementById('signin-password').value = 'password123';
    document.getElementById('form-signin').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

    setTimeout(() => {
      expect(window.alert).toHaveBeenCalledWith('Sign in successful as patient');
      expect(document.getElementById('dashboard-view').hidden).toBe(false);
      done();
    }, 700);
  });

  it('sign in as caregiver uses alert fallback', (done) => {
    document.getElementById('btn-sign-in').click();
    document.getElementById('signin-email').value = 'caregiver@careconnect.demo';
    document.getElementById('signin-password').value = 'password123';
    document.getElementById('form-signin').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

    setTimeout(() => {
      expect(window.alert).toHaveBeenCalledWith('Sign in successful as caregiver');
      expect(document.getElementById('dashboard-view').hidden).toBe(false);
      done();
    }, 700);
  });

  it('registration uses alert fallback', (done) => {
    document.getElementById('btn-get-started').click();
    document.getElementById('role-patient').click();
    document.getElementById('reg-email').value = 'new@test.com';
    document.getElementById('reg-password').value = 'password123';
    document.getElementById('reg-confirm').value = 'password123';
    document.getElementById('reg-terms').checked = true;
    document.getElementById('form-registration').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

    setTimeout(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Account created|Welcome/));
      done();
    }, 900);
  });
});

describe('Registration Screen', () => {
  beforeEach(() => {
    document.getElementById('btn-get-started').click();
    document.getElementById('role-patient').click();
  });

  it('Back returns to role selection', () => {
    document.getElementById('reg-back').click();
    expect(document.getElementById('screen-role').hidden).toBe(false);
  });

  it('Sign In navigates to signin', () => {
    document.getElementById('reg-to-signin').click();
    expect(document.getElementById('screen-signin').hidden).toBe(false);
  });

  it('validates password length', () => {
    document.getElementById('reg-email').value = 'test@test.com';
    document.getElementById('reg-password').value = 'short';
    document.getElementById('reg-confirm').value = 'short';
    document.getElementById('reg-terms').checked = true;
    document.getElementById('form-registration').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    expect(document.getElementById('reg-password-error').textContent).toContain('8 characters');
  });

  it('validates empty confirm password', () => {
    document.getElementById('reg-email').value = 'test@test.com';
    document.getElementById('reg-password').value = 'password123';
    document.getElementById('reg-confirm').value = '';
    document.getElementById('reg-terms').checked = true;
    document.getElementById('form-registration').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    expect(document.getElementById('reg-confirm-error').textContent).toContain('confirm');
  });

  it('validates password confirmation match', () => {
    document.getElementById('reg-email').value = 'test@test.com';
    document.getElementById('reg-password').value = 'password123';
    document.getElementById('reg-confirm').value = 'different';
    document.getElementById('reg-terms').checked = true;
    document.getElementById('form-registration').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    expect(document.getElementById('reg-confirm-error').textContent).toContain('do not match');
  });

  it('validates invalid email format in registration', () => {
    document.getElementById('reg-email').value = 'invalid-email';
    document.getElementById('reg-password').value = 'password123';
    document.getElementById('reg-confirm').value = 'password123';
    document.getElementById('reg-terms').checked = true;
    document.getElementById('form-registration').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    expect(document.getElementById('reg-email-error').textContent).toContain('valid email');
  });

  it('validates terms agreement', () => {
    document.getElementById('reg-email').value = 'test@test.com';
    document.getElementById('reg-password').value = 'password123';
    document.getElementById('reg-confirm').value = 'password123';
    document.getElementById('form-registration').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    expect(document.getElementById('reg-terms-error').textContent).toContain('agree');
  });

  it('registers successfully and navigates to signin', (done) => {
    document.getElementById('reg-email').value = 'new@test.com';
    document.getElementById('reg-password').value = 'password123';
    document.getElementById('reg-confirm').value = 'password123';
    document.getElementById('reg-terms').checked = true;
    document.getElementById('form-registration').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

    setTimeout(() => {
      expect(document.getElementById('screen-signin').hidden).toBe(false);
      done();
    }, 900);
  });

  it('registration password toggle works', () => {
    const input = document.getElementById('reg-password');
    const btn = document.getElementById('reg-toggle-pw');
    btn.click();
    expect(input.type).toBe('text');
    btn.click();
    expect(input.type).toBe('password');
  });

  it('registration confirm password toggle works', () => {
    const input = document.getElementById('reg-confirm');
    const btn = document.getElementById('reg-toggle-confirm');
    btn.click();
    expect(input.type).toBe('text');
  });

  it('Terms link focuses reg-terms', () => {
    const termsLink = document.getElementById('link-terms');
    const regTerms = document.getElementById('reg-terms');
    regTerms.focus = jest.fn();
    termsLink.click();
    expect(regTerms.focus).toHaveBeenCalled();
  });

  it('Privacy link focuses reg-terms', () => {
    const privacyLink = document.getElementById('link-privacy');
    const regTerms = document.getElementById('reg-terms');
    regTerms.focus = jest.fn();
    privacyLink.click();
    expect(regTerms.focus).toHaveBeenCalled();
  });
});

describe('Dashboard Navigation', () => {
  function signIn() {
    document.getElementById('btn-sign-in').click();
    document.getElementById('signin-email').value = 'caregiver@careconnect.demo';
    document.getElementById('signin-password').value = 'password123';
    document.getElementById('form-signin').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  }

  it('dashboard nav shows patients screen', (done) => {
    signIn();
    setTimeout(() => {
      document.querySelector('[data-screen="patients"]').click();
      expect(document.getElementById('screen-patients').hidden).toBe(false);
      done();
    }, 700);
  });

  it('dashboard nav shows communication screen for messages', (done) => {
    signIn();
    setTimeout(() => {
      document.querySelector('[data-screen="messages"]').click();
      expect(document.getElementById('screen-communication').hidden).toBe(false);
      done();
    }, 700);
  });

  it('patient card click shows patient detail', (done) => {
    signIn();
    setTimeout(() => {
      document.querySelector('[data-screen="patients"]').click();
      document.querySelector('.patient-card[data-patient-id="john"]').click();
      expect(document.getElementById('screen-patient-detail').hidden).toBe(false);
      expect(document.getElementById('patient-detail-name').textContent).toBe('John Doe');
      done();
    }, 700);
  });

  it('patient detail back returns to patients', (done) => {
    signIn();
    setTimeout(() => {
      document.querySelector('[data-screen="patients"]').click();
      document.querySelector('.patient-card[data-patient-id="mary"]').click();
      document.getElementById('patient-detail-back').click();
      expect(document.getElementById('screen-patients').hidden).toBe(false);
      done();
    }, 700);
  });

  it('sign out returns to auth view', (done) => {
    signIn();
    setTimeout(() => {
      document.getElementById('btn-sign-out').click();
      expect(document.getElementById('auth-view').hidden).toBe(false);
      expect(document.getElementById('dashboard-view').hidden).toBe(true);
      done();
    }, 700);
  });

  it('schedule and reports nav show dashboard', (done) => {
    signIn();
    setTimeout(() => {
      document.querySelector('[data-screen="schedule"]').click();
      expect(document.getElementById('screen-dashboard').hidden).toBe(false);
      document.querySelector('[data-screen="reports"]').click();
      expect(document.getElementById('screen-dashboard').hidden).toBe(false);
      done();
    }, 700);
  });

  it('health and settings nav show dashboard (handleNavClick else branch)', (done) => {
    signIn();
    setTimeout(() => {
      document.querySelector('[data-screen="health"]')?.click();
      expect(document.getElementById('screen-dashboard').hidden).toBe(false);
      document.querySelector('[data-screen="settings"]')?.click();
      expect(document.getElementById('screen-dashboard').hidden).toBe(false);
      done();
    }, 700);
  });

  it('video call button announces coming soon', (done) => {
    signIn();
    setTimeout(() => {
      document.getElementById('btn-start-video').click();
      expect(document.getElementById('status-announce').textContent).toContain('video');
      done();
    }, 700);
  });
});

describe('Menu Actions (electronAPI)', () => {
  it('onMenuAction go-dashboard navigates when dashboard visible', (done) => {
    document.getElementById('btn-sign-in').click();
    document.getElementById('signin-email').value = 'caregiver@careconnect.demo';
    document.getElementById('signin-password').value = 'password123';
    document.getElementById('form-signin').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

    setTimeout(() => {
      const cb = window.__menuActionCallback;
      expect(cb).toBeDefined();
      cb('go-dashboard');
      expect(document.getElementById('screen-dashboard').hidden).toBe(false);
      done();
    }, 700);
  });

  it('onMenuAction go-patients navigates', (done) => {
    document.getElementById('btn-sign-in').click();
    document.getElementById('signin-email').value = 'caregiver@careconnect.demo';
    document.getElementById('signin-password').value = 'password123';
    document.getElementById('form-signin').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

    setTimeout(() => {
      const cb = window.__menuActionCallback;
      expect(cb).toBeDefined();
      cb('go-patients');
      expect(document.getElementById('screen-patients').hidden).toBe(false);
      done();
    }, 700);
  });

  it('onMenuAction shows dashboard first when auth view visible', (done) => {
    const cb = window.__menuActionCallback;
    expect(cb).toBeDefined();
    expect(document.getElementById('dashboard-view').hidden).toBe(true);
    cb('go-dashboard');
    expect(document.getElementById('dashboard-view').hidden).toBe(false);
    expect(document.getElementById('screen-dashboard').hidden).toBe(false);
    done();
  });

  it('onMenuAction ignores unknown action without error', () => {
    const cb = window.__menuActionCallback;
    expect(() => cb('unknown-action')).not.toThrow();
  });
});

describe('Status Announce (Screen Reader)', () => {
  it('announces screen changes', () => {
    const status = document.getElementById('status-announce');
    document.getElementById('btn-get-started').click();
    expect(status.textContent).toContain('role');
  });
});

describe('Skip Link', () => {
  it('focuses main content when on dashboard', (done) => {
    document.getElementById('btn-sign-in').click();
    document.getElementById('signin-email').value = 'caregiver@careconnect.demo';
    document.getElementById('signin-password').value = 'password123';
    document.getElementById('form-signin').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

    setTimeout(() => {
      const main = document.getElementById('main-content');
      main.focus = jest.fn();
      document.getElementById('skip-link').click();
      expect(main.focus).toHaveBeenCalled();
      done();
    }, 700);
  });
});
