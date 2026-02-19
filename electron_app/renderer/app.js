/**
 * CareConnect Electron - Auth screens navigation and form logic
 * Aligned with Flutter and React Native app flows
 */

const MOCK_PATIENT_EMAIL = 'patient@careconnect.demo';
const MOCK_CAREGIVER_EMAIL = 'caregiver@careconnect.demo';
const MOCK_PASSWORD = 'password123';

const screens = {
  welcome: document.getElementById('screen-welcome'),
  role: document.getElementById('screen-role'),
  signin: document.getElementById('screen-signin'),
  registration: document.getElementById('screen-registration'),
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
    announce(`${name} screen`);
  }
}

function announce(message) {
  if (statusAnnounce) {
    statusAnnounce.textContent = message;
  }
}

let selectedRole = 'patient';
let prevScreen = 'signin';

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
      // TODO: Navigate to patient dashboard
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
      // TODO: Navigate to caregiver dashboard
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

// Start on welcome screen
showScreen('welcome');
