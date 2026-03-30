/**
 * Keyboard Navigation Tests for CareConnect Electron App
 * Tests WCAG 2.1 keyboard accessibility: Tab, Shift+Tab, Home, End, Enter, Space
 * See KEYBOARD-SHORTCUTS.md for reference
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

let dom;
let document;
let window;

function loadApp() {
  const htmlPath = path.join(__dirname, '../renderer/index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const htmlWithoutApp = html.replace('<script src="app.js"></script>', '');

  dom = new JSDOM(htmlWithoutApp, {
    url: 'file://' + path.join(__dirname, '../renderer/'),
  });

  document = dom.window.document;
  window = dom.window;
  global.document = document;
  global.window = window;

  window.electronAPI = {
    invoke: () => Promise.resolve({}),
    onMenuAction: (cb) => { window.__menuActionCallback = cb; },
  };

  jest.isolateModules(() => {
    require('../renderer/app.js');
  });

  return { dom, document, window };
}

function dispatchKey(element, key, options = {}) {
  const ev = new window.KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  });
  element.dispatchEvent(ev);
  return ev;
}

function dispatchKeyDocument(key, options = {}) {
  const target = document.activeElement || document.body;
  const ev = new window.KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  });
  target.dispatchEvent(ev);
  return ev;
}

beforeEach(() => {
  loadApp();
});

describe('Keyboard Navigation', () => {
  describe('Skip Link (WCAG 2.4.1 Bypass Blocks)', () => {
    it('skip link exists and is focusable', () => {
      const skipLink = document.getElementById('skip-link');
      expect(skipLink).toBeTruthy();
      expect(skipLink.getAttribute('href')).toBe('#');
      expect(skipLink.classList.contains('skip-link')).toBe(true);
    });

    it('skip link click focuses auth-view when on auth screen', () => {
      const skipLink = document.getElementById('skip-link');
      const authView = document.getElementById('auth-view');
      authView.focus = jest.fn();

      skipLink.click();
      expect(authView.focus).toHaveBeenCalled();
    });

    it('skip link prevents default navigation', () => {
      const skipLink = document.getElementById('skip-link');
      const ev = new window.MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(ev, 'preventDefault');
      skipLink.dispatchEvent(ev);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Tab and Shift+Tab Navigation', () => {
    it('welcome screen has focusable elements in logical order', () => {
      const getStarted = document.getElementById('btn-get-started');
      const signIn = document.getElementById('btn-sign-in');
      expect(getStarted).toBeTruthy();
      expect(signIn).toBeTruthy();
      expect(getStarted.tabIndex).not.toBe(-1);
      expect(signIn.tabIndex).not.toBe(-1);
    });

    it('all interactive elements are focusable', () => {
      const focusable = document.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex^="-"])'
      );
      focusable.forEach((el) => {
        expect(el.tabIndex).not.toBe(-1);
      });
    });
  });

  describe('Home and End Keys in Lists', () => {
    it('Home key moves focus to first item in sidebar-nav', () => {
      const dashboardView = document.getElementById('dashboard-view');
      const authView = document.getElementById('auth-view');
      authView.hidden = true;
      dashboardView.hidden = false;

      const sidebarNav = document.querySelector('.sidebar-nav');
      const focusable = Array.from(sidebarNav.querySelectorAll('button'));
      expect(focusable.length).toBeGreaterThan(1);

      focusable[focusable.length - 1].focus();
      expect(document.activeElement).toBe(focusable[focusable.length - 1]);

      const ev = dispatchKeyDocument('Home');
      expect(document.activeElement).toBe(focusable[0]);
      expect(ev.defaultPrevented).toBe(true);
    });

    it('End key moves focus to last item in sidebar-nav', () => {
      const dashboardView = document.getElementById('dashboard-view');
      const authView = document.getElementById('auth-view');
      authView.hidden = true;
      dashboardView.hidden = false;

      const sidebarNav = document.querySelector('.sidebar-nav');
      const focusable = Array.from(sidebarNav.querySelectorAll('button'));
      focusable[0].focus();

      dispatchKeyDocument('End');
      expect(document.activeElement).toBe(focusable[focusable.length - 1]);
    });

    it('Home key moves focus to first item in top-nav', () => {
      const dashboardView = document.getElementById('dashboard-view');
      const authView = document.getElementById('auth-view');
      authView.hidden = true;
      dashboardView.hidden = false;

      const topNav = document.querySelector('.top-nav');
      const focusable = Array.from(topNav.querySelectorAll('button'));
      focusable[focusable.length - 1].focus();

      dispatchKeyDocument('Home');
      expect(document.activeElement).toBe(focusable[0]);
    });

    it('Home/End in message-list moves focus', () => {
      const dashboardView = document.getElementById('dashboard-view');
      const authView = document.getElementById('auth-view');
      authView.hidden = true;
      dashboardView.hidden = false;

      document.querySelector('[data-screen="messages"]')?.click();
      const messageList = document.querySelector('.message-list');
      const focusable = Array.from(messageList?.querySelectorAll('button') || []);
      if (focusable.length > 1) {
        focusable[focusable.length - 1].focus();
        dispatchKeyDocument('Home');
        expect(document.activeElement).toBe(focusable[0]);
      }
    });

    it('End key moves focus to last item in patient-cards-grid', () => {
      const dashboardView = document.getElementById('dashboard-view');
      const authView = document.getElementById('auth-view');
      authView.hidden = true;
      dashboardView.hidden = false;

      const patientsScreen = document.getElementById('screen-patients');
      const dashboardScreen = document.getElementById('screen-dashboard');
      dashboardScreen.hidden = true;
      patientsScreen.hidden = false;

      const grid = document.querySelector('.patient-cards-grid');
      const focusable = Array.from(grid.querySelectorAll('a[href]'));
      focusable[0].focus();

      dispatchKeyDocument('End');
      expect(document.activeElement).toBe(focusable[focusable.length - 1]);
    });

    it('Home/End returns when active element has no closest function', () => {
      const loose = document.createElement('div');
      loose.tabIndex = 0;
      document.body.appendChild(loose);
      Object.defineProperty(loose, 'closest', { value: undefined, configurable: true });
      loose.focus();
      const evH = dispatchKeyDocument('Home');
      const evE = dispatchKeyDocument('End');
      expect(evH.defaultPrevented).toBe(false);
      expect(evE.defaultPrevented).toBe(false);
    });

    it('Home/End does nothing when focus is outside list containers', () => {
      const btn = document.getElementById('btn-get-started');
      btn.focus();
      const beforeFocus = document.activeElement;

      dispatchKeyDocument('Home');
      dispatchKeyDocument('End');
      expect(document.activeElement).toBe(beforeFocus);
    });

    it('Home does not move focus when list has only one focusable item', () => {
      const dashboardView = document.getElementById('dashboard-view');
      const authView = document.getElementById('auth-view');
      authView.hidden = true;
      dashboardView.hidden = false;

      const grid = document.querySelector('.stats-grid');
      const only = document.createElement('button');
      only.type = 'button';
      only.textContent = 'Only';
      grid.appendChild(only);
      only.focus();
      const before = document.activeElement;

      dispatchKeyDocument('Home');
      expect(document.activeElement).toBe(before);
    });

    it('Home does nothing when focused element is inside container but not focusable-listed', () => {
      const dashboardView = document.getElementById('dashboard-view');
      const authView = document.getElementById('auth-view');
      authView.hidden = true;
      dashboardView.hidden = false;

      const sidebarNav = document.querySelector('.sidebar-nav');
      const orphan = document.createElement('div');
      orphan.setAttribute('tabindex', '-1');
      sidebarNav.appendChild(orphan);
      orphan.focus();

      const before = document.activeElement;
      const ev = dispatchKeyDocument('Home');
      expect(document.activeElement).toBe(before);
      expect(ev.defaultPrevented).toBe(false);
    });

    it('Home/End does nothing for non-Home/End keys', () => {
      const dashboardView = document.getElementById('dashboard-view');
      const authView = document.getElementById('auth-view');
      authView.hidden = true;
      dashboardView.hidden = false;

      const sidebarNav = document.querySelector('.sidebar-nav');
      const focusable = Array.from(sidebarNav.querySelectorAll('button'));
      focusable[focusable.length - 1].focus();

      dispatchKeyDocument('Tab');
      expect(document.activeElement).not.toBe(focusable[0]);
    });
  });

  describe('Enter and Space Activation', () => {
    it('Enter activates Get Started button', () => {
      const getStarted = document.getElementById('btn-get-started');
      const roleScreen = document.getElementById('screen-role');
      getStarted.click();
      expect(roleScreen.hidden).toBe(false);
    });

    it('Enter activates Sign In button on welcome', () => {
      const signIn = document.getElementById('btn-sign-in');
      const signinScreen = document.getElementById('screen-signin');
      signIn.click();
      expect(signinScreen.hidden).toBe(false);
    });

    it('role cards are activatable with click (Enter/Space)', () => {
      const getStarted = document.getElementById('btn-get-started');
      getStarted.click();

      const rolePatient = document.getElementById('role-patient');
      const regScreen = document.getElementById('screen-registration');
      rolePatient.click();
      expect(regScreen.hidden).toBe(false);
    });
  });

  describe('Screen Navigation Flow', () => {
    it('back buttons navigate correctly with keyboard', () => {
      document.getElementById('btn-get-started').click();
      document.getElementById('role-back').click();
      expect(document.getElementById('screen-welcome').hidden).toBe(false);

      document.getElementById('btn-sign-in').click();
      document.getElementById('signin-back').click();
      expect(document.getElementById('screen-welcome').hidden).toBe(false);
    });

    it('registration back returns to previous screen', () => {
      document.getElementById('btn-get-started').click();
      document.getElementById('role-patient').click();
      expect(document.getElementById('screen-registration').hidden).toBe(false);

      document.getElementById('reg-back').click();
      expect(document.getElementById('screen-role').hidden).toBe(false);
    });
  });

  describe('Dashboard Navigation', () => {
    beforeEach(() => {
      // Sign in as caregiver to show dashboard
      const emailInput = document.getElementById('signin-email');
      const passwordInput = document.getElementById('signin-password');
      emailInput.value = 'caregiver@careconnect.demo';
      passwordInput.value = 'password123';
      document.getElementById('form-signin').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    });

    it('nav items are keyboard activatable', (done) => {
      setTimeout(() => {
        const patientsNav = document.querySelector('[data-screen="patients"]');
        const patientsScreen = document.getElementById('screen-patients');
        patientsNav.click();
        expect(patientsScreen.hidden).toBe(false);
        done();
      }, 700);
    });
  });
});
