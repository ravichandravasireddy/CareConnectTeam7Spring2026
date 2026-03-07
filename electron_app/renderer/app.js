/**
 * CareConnect Electron - Auth screens navigation and form logic
 * Aligned with Flutter and React Native app flows
 */

const MOCK_PATIENT_EMAIL = 'patient@careconnect.demo';
const MOCK_CAREGIVER_EMAIL = 'caregiver@careconnect.demo';
const MOCK_PASSWORD = 'password123';

const authView = document.getElementById('auth-view');
const dashboardView = document.getElementById('dashboard-view');
const app = document.getElementById('app');

const screens = {
  welcome: document.getElementById('screen-welcome'),
  role: document.getElementById('screen-role'),
  signin: document.getElementById('screen-signin'),
  registration: document.getElementById('screen-registration'),
};

const dashboardScreens = {
  dashboard: document.getElementById('screen-dashboard'),
  patients: document.getElementById('screen-patients'),
  'patient-detail': document.getElementById('screen-patient-detail'),
  communication: document.getElementById('screen-communication'),
};

const PATIENTS = {
  john: { name: 'John Doe', meta: 'ID: 12345 • Age: 72 • Male', initials: 'JD' },
  mary: { name: 'Mary Johnson', meta: 'ID: 12346 • Age: 65 • Female', initials: 'MJ' },
  robert: { name: 'Robert Smith', meta: 'ID: 12347 • Age: 68 • Male', initials: 'RS' },
};

const statusAnnounce = document.getElementById('status-announce');

function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    if (el) {
      el.hidden = key !== name;
      el.setAttribute('aria-hidden', key !== name ? 'true' : 'false');
    }
  });
  const target = screens[name];
  if (target) {
    if (typeof window.runAxeCheck === 'function') {
      window.runAxeCheck('auth:' + name);
    }
    announce(`${name} screen`);
  }
}

function showDashboardView() {
  authView.hidden = true;
  dashboardView.hidden = false;
  app.classList.add('dashboard-mode');
  showDashboardScreen('dashboard');
  announce('Caregiver dashboard');
}

function showAuthView() {
  dashboardView.hidden = true;
  authView.hidden = false;
  app.classList.remove('dashboard-mode');
  showScreen('welcome');
  announce('Welcome screen');
}

function showDashboardScreen(name, patientId) {
  Object.entries(dashboardScreens).forEach(([key, el]) => {
    if (el) {
      el.hidden = key !== name;
    }
  });
  const navMap = { dashboard: 'dashboard', patients: 'patients', 'patient-detail': 'patients', communication: 'messages' };
  const activeNav = navMap[name] || 'dashboard';
  document.querySelectorAll('.nav-item, .top-nav-item').forEach((btn) => {
    const screen = btn.getAttribute('data-screen');
    btn.classList.toggle('active', screen === activeNav);
    btn.setAttribute('aria-current', screen === activeNav ? 'page' : null);
  });
  const breadcrumbEl = document.getElementById('breadcrumb-text');
  if (breadcrumbEl) {
    if (name === 'patient-detail' && patientId && PATIENTS[patientId]) {
      const patient = PATIENTS[patientId];
      breadcrumbEl.innerHTML = '<button type="button" class="link-btn" id="breadcrumb-patients">Patients</button> <span class="breadcrumb-sep">›</span> ' + escapeHtml(patient.name);
      document.getElementById('breadcrumb-patients')?.addEventListener('click', () => showDashboardScreen('patients'));
    } else if (name === 'patients') {
      breadcrumbEl.textContent = 'Patients';
    } else {
      const labels = { dashboard: 'Dashboard', communication: 'Communication Center' };
      breadcrumbEl.textContent = labels[name] || 'Dashboard';
    }
  }
  if (name === 'patient-detail' && patientId && PATIENTS[patientId]) {
    const p = PATIENTS[patientId];
    const elName = document.getElementById('patient-detail-name');
    const elMeta = document.getElementById('patient-detail-meta');
    const elAvatar = document.getElementById('patient-detail-avatar');
    if (elName) elName.textContent = p.name;
    if (elMeta) elMeta.textContent = p.meta;
    if (elAvatar) elAvatar.textContent = p.initials;
  }
  if (typeof window.runAxeCheck === 'function') {
    window.runAxeCheck('dashboard:' + name);
  }
  announce(`${name} screen`);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function announce(message) {
  if (statusAnnounce) {
    statusAnnounce.textContent = message;
  }
}

let selectedRole = 'patient';
let prevScreen = 'signin';

// ----- Skip link (WCAG 2.4.1 Bypass Blocks) -----
document.getElementById('skip-link')?.addEventListener('click', (e) => {
  e.preventDefault();
  const main = document.getElementById('main-content');
  const auth = document.getElementById('auth-view');
  if (auth && !auth.hidden && auth.focus) auth.focus();
  else if (main) main.focus();
});

// ----- Navigation -----
document.getElementById('btn-get-started')?.addEventListener('click', () => showScreen('role'));
document.getElementById('btn-sign-in')?.addEventListener('click', () => showScreen('signin'));

document.getElementById('role-back')?.addEventListener('click', () => showScreen('welcome'));
document.getElementById('role-patient')?.addEventListener('click', () => {
  selectedRole = 'patient';
  prevScreen = 'role';
  showScreen('registration');
});
document.getElementById('role-caregiver')?.addEventListener('click', () => {
  selectedRole = 'caregiver';
  prevScreen = 'role';
  showScreen('registration');
});

document.getElementById('signin-back')?.addEventListener('click', () => showScreen('welcome'));
document.getElementById('signin-to-register')?.addEventListener('click', () => {
  prevScreen = 'signin';
  showScreen('registration');
});

document.getElementById('reg-back')?.addEventListener('click', () => showScreen(prevScreen));
document.getElementById('reg-to-signin')?.addEventListener('click', () => showScreen('signin'));

// ----- Password visibility toggles -----
function setupToggle(btnId, inputId, labelShow = 'Show password', labelHide = 'Hide password') {
  const btn = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.textContent = isPassword ? labelHide : labelShow;
    btn.setAttribute('aria-label', isPassword ? labelHide : labelShow);
    announce(isPassword ? 'Password visible' : 'Password hidden');
  });
}

setupToggle('signin-toggle-pw', 'signin-password');
setupToggle('reg-toggle-pw', 'reg-password');
setupToggle('reg-toggle-confirm', 'reg-confirm', 'Show confirm password', 'Hide confirm password');

// ----- Forgot Password -----
document.getElementById('btn-forgot-password')?.addEventListener('click', () => {
  announce('Forgot password feature coming soon');
  if (window.electronAPI?.invoke) {
    window.electronAPI.invoke('show-message', {
      type: 'info',
      title: 'Coming Soon',
      message: 'Forgot password feature coming soon',
    });
  } else {
    alert('Forgot password feature coming soon');
  }
});

// ----- Terms & Privacy links -----
document.getElementById('link-terms')?.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('reg-terms')?.focus();
  announce('Terms of Service');
});
document.getElementById('link-privacy')?.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('reg-terms')?.focus();
  announce('Privacy Policy');
});

// ----- Sign In Form -----
const formSignIn = document.getElementById('form-signin');
const emailInput = document.getElementById('signin-email');
const passwordInput = document.getElementById('signin-password');
const emailError = document.getElementById('signin-email-error');
const passwordError = document.getElementById('signin-password-error');
const btnSignInSubmit = document.getElementById('btn-signin-submit');

function clearSignInErrors() {
  if (emailError) emailError.textContent = '';
  if (passwordError) passwordError.textContent = '';
  emailInput?.classList.remove('error');
  passwordInput?.classList.remove('error');
}

formSignIn?.addEventListener('submit', (e) => {
  e.preventDefault();
  clearSignInErrors();

  const email = emailInput?.value?.trim() || '';
  const password = passwordInput?.value || '';

  let valid = true;
  if (!email) {
    if (emailError) emailError.textContent = 'Email is required';
    emailInput?.classList.add('error');
    valid = false;
  } else if (!email.includes('@')) {
    if (emailError) emailError.textContent = 'Enter a valid email';
    emailInput?.classList.add('error');
    valid = false;
  }
  if (!password) {
    if (passwordError) passwordError.textContent = 'Password is required';
    passwordInput?.classList.add('error');
    valid = false;
  }

  if (!valid) {
    announce('Form validation failed. Please fix the errors.');
    return;
  }

  btnSignInSubmit.disabled = true;
  btnSignInSubmit.textContent = 'Signing in...';

  // Simulate API delay (mock auth)
  setTimeout(() => {
    const normalizedEmail = email.toLowerCase();
    const normalizedPassword = password;

    if (normalizedEmail === MOCK_PATIENT_EMAIL && normalizedPassword === MOCK_PASSWORD) {
      announce('Sign in successful as patient');
      if (window.electronAPI?.invoke) {
        window.electronAPI.invoke('show-message', {
          type: 'info',
          title: 'Sign In Successful',
          message: 'Welcome back! You are signed in as a Care Recipient.',
        });
      } else {
        alert('Sign in successful as patient');
      }
      showDashboardView();
    } else if (normalizedEmail === MOCK_CAREGIVER_EMAIL && normalizedPassword === MOCK_PASSWORD) {
      announce('Sign in successful as caregiver');
      if (window.electronAPI?.invoke) {
        window.electronAPI.invoke('show-message', {
          type: 'info',
          title: 'Sign In Successful',
          message: 'Welcome back! You are signed in as a Caregiver.',
        });
      } else {
        alert('Sign in successful as caregiver');
      }
      showDashboardView();
    } else {
      if (passwordError) passwordError.textContent = 'Invalid email or password';
      passwordInput?.classList.add('error');
      announce('Sign in failed. Invalid email or password.');
    }

    btnSignInSubmit.disabled = false;
    btnSignInSubmit.textContent = 'Sign In';
  }, 600);
});

// ----- Registration Form -----
const formReg = document.getElementById('form-registration');
const regEmail = document.getElementById('reg-email');
const regPassword = document.getElementById('reg-password');
const regConfirm = document.getElementById('reg-confirm');
const regTerms = document.getElementById('reg-terms');
const regEmailError = document.getElementById('reg-email-error');
const regPasswordError = document.getElementById('reg-password-error');
const regConfirmError = document.getElementById('reg-confirm-error');
const regTermsError = document.getElementById('reg-terms-error');
const btnRegSubmit = document.getElementById('btn-reg-submit');

function clearRegErrors() {
  [regEmailError, regPasswordError, regConfirmError, regTermsError].forEach((el) => {
    if (el) el.textContent = '';
  });
  [regEmail, regPassword, regConfirm].forEach((el) => el?.classList.remove('error'));
}

formReg?.addEventListener('submit', (e) => {
  e.preventDefault();
  clearRegErrors();

  const email = regEmail?.value?.trim() || '';
  const password = regPassword?.value || '';
  const confirm = regConfirm?.value || '';
  const agreed = regTerms?.checked ?? false;

  let valid = true;

  if (email && !email.includes('@')) {
    if (regEmailError) regEmailError.textContent = 'Enter a valid email';
    regEmail?.classList.add('error');
    valid = false;
  }

  if (!password) {
    if (regPasswordError) regPasswordError.textContent = 'Password is required';
    regPassword?.classList.add('error');
    valid = false;
  } else if (password.length < 8) {
    if (regPasswordError) regPasswordError.textContent = 'At least 8 characters required';
    regPassword?.classList.add('error');
    valid = false;
  }

  if (!confirm) {
    if (regConfirmError) regConfirmError.textContent = 'Please confirm your password';
    regConfirm?.classList.add('error');
    valid = false;
  } else if (confirm !== password) {
    if (regConfirmError) regConfirmError.textContent = 'Passwords do not match';
    regConfirm?.classList.add('error');
    valid = false;
  }

  if (!agreed) {
    if (regTermsError) regTermsError.textContent = 'Please agree to the Terms of Service and Privacy Policy';
    valid = false;
  }

  if (!valid) {
    announce('Form validation failed. Please fix the errors.');
    return;
  }

  btnRegSubmit.disabled = true;
  btnRegSubmit.textContent = 'Creating account...';

  const defaultFirst = selectedRole === 'caregiver' ? 'Caregiver' : 'Care Recipient';
  const defaultLast = 'User';
  const defaultEmail = selectedRole === 'caregiver' ? 'caregiver.user@careconnect.demo' : 'patient.user@careconnect.demo';
  const defaultPhone = '(555) 555-0101';

  const firstName = document.getElementById('reg-first')?.value?.trim() || defaultFirst;
  const lastName = document.getElementById('reg-last')?.value?.trim() || defaultLast;
  const finalEmail = email || defaultEmail;
  const phone = document.getElementById('reg-phone')?.value?.trim() || defaultPhone;

  setTimeout(() => {
    announce(`Registration successful as ${selectedRole}`);
    if (window.electronAPI?.invoke) {
      window.electronAPI.invoke('show-message', {
        type: 'info',
        title: 'Account Created',
        message: `Welcome ${firstName} ${lastName}! Email: ${finalEmail}. Role: ${selectedRole === 'patient' ? 'Care Recipient' : 'Caregiver'}`,
      });
    } else {
      alert(`Account created! Welcome ${firstName} ${lastName}`);
    }
    formReg.reset();
    btnRegSubmit.disabled = false;
    btnRegSubmit.textContent = 'Create Account';
    showScreen('signin');
  }, 800);
});

// ----- Dashboard navigation -----
function handleNavClick(screen) {
  if (screen === 'messages' || screen === 'video') {
    showDashboardScreen('communication');
  } else if (screen === 'patients') {
    showDashboardScreen('patients');
  } else if (screen === 'dashboard') {
    showDashboardScreen('dashboard');
  } else {
    showDashboardScreen('dashboard');
  }
}

document.querySelectorAll('.nav-item').forEach((btn) => {
  btn.addEventListener('click', () => handleNavClick(btn.getAttribute('data-screen')));
});

document.querySelectorAll('.top-nav-item').forEach((btn) => {
  btn.addEventListener('click', () => handleNavClick(btn.getAttribute('data-screen')));
});

document.querySelectorAll('.patient-card').forEach((card) => {
  card.addEventListener('click', (e) => {
    e.preventDefault();
    const id = card.getAttribute('data-patient-id');
    if (id) showDashboardScreen('patient-detail', id);
  });
});

document.getElementById('patient-detail-back')?.addEventListener('click', () => {
  showDashboardScreen('patients');
});

document.getElementById('btn-sign-out')?.addEventListener('click', () => {
  showAuthView();
});

document.getElementById('btn-start-video')?.addEventListener('click', () => {
  announce('Start video call - feature coming soon');
});

// ----- Application menu: Go (nav) actions -----
if (window.electronAPI?.onMenuAction) {
  window.electronAPI.onMenuAction((action) => {
    const goMap = {
      'go-dashboard': () => handleNavClick('dashboard'),
      'go-patients': () => handleNavClick('patients'),
      'go-schedule': () => handleNavClick('schedule'),
      'go-reports': () => handleNavClick('reports'),
      'go-messages': () => handleNavClick('messages'),
    };
    const fn = goMap[action];
    if (fn) {
      if (dashboardView.hidden) showDashboardView();
      fn();
    }
  });
}

// ----- Keyboard: Home / End in lists (per KEYBOARD-SHORTCUTS.md) -----
const LIST_CONTAINER_SELECTORS = [
  '.sidebar-nav',
  '.top-nav',
  '.patient-cards-grid',
  '.message-list',
  '.alert-list',
  '.stats-grid',
  '.trend-period-btns',
  '.patient-detail-actions',
  '.activity-log-list',
].join(', ');

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex^="-"])',
].join(', ');

function getFocusableElements(container) {
  if (!container || !container.querySelectorAll) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
}

function handleListHomeEnd(e) {
  if (e.key !== 'Home' && e.key !== 'End') return;
  const target = e.target;
  if (!target || !target.closest) return;
  const container = target.closest(LIST_CONTAINER_SELECTORS);
  if (!container) return;
  const focusable = getFocusableElements(container);
  if (focusable.length <= 1) return;
  const index = focusable.indexOf(target);
  if (index === -1) return;
  if (e.key === 'Home') {
    focusable[0].focus();
    e.preventDefault();
  } else if (e.key === 'End') {
    focusable[focusable.length - 1].focus();
    e.preventDefault();
  }
}

document.addEventListener('keydown', handleListHomeEnd, true);

// Axe-core accessibility testing (dev only; run after DOM is ready)
(function runAxeInDev() {
  var api = typeof window !== 'undefined' && window.electronAPI;
  if (!api || !api.getIsDev) return;
  api.getIsDev().then(function (isDev) {
    if (!isDev) return;
    var script = document.createElement('script');
    script.src = 'axe.min.js';
    script.onload = function () {
      if (typeof window.axe !== 'undefined') {
        window.runAxeCheck = function (context) {
          return new Promise(function (resolve, reject) {
            window.axe.run(document, {}, function (err, results) {
              if (err) return reject(err);
              var label = 'Axe-core accessibility violations';
              if (context) {
                label += ' (' + context + ')';
              }
              console.log(label + ':', results.violations);
              resolve(results);
            });
          });
        };
        // initial run on first load
        window.runAxeCheck('initial-load');
      }
    };
    script.onerror = function () {
      console.warn('Axe-core not loaded. Run: npm run copy-axe');
    };
    document.head.appendChild(script);
  });
})();
// Start on welcome screen (toggle to showDashboardView() to open dashboard first)
showScreen('welcome');
// showDashboardView();
