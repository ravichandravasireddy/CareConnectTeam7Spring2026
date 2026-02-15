/**
 * Shared auth helpers for E2E flows.
 * Uses accessibility labels and text matching the app screens.
 */

const credentials = require('../config/testCredentials');

/**
 * From Welcome screen: tap Sign In and wait for sign-in screen.
 */
async function openSignInFromWelcome() {
  await element(by.label('Sign in')).tap();
  await waitFor(element(by.text('Welcome Back')))
    .toBeVisible()
    .withTimeout(10000);
}

/**
 * Fill email and password on sign-in screen and tap Sign In.
 * @param {string} email
 * @param {string} password
 */
async function fillSignInAndSubmit(email, password) {
  await element(by.label('Email address')).tap();
  await element(by.label('Email address')).typeText(email);
  await element(by.label('Password')).tap();
  await element(by.label('Password')).typeText(password);
  await element(by.label('Sign in')).tap();
}

/**
 * Sign in as patient from Welcome screen (direct Sign In button).
 */
async function signInAsPatient() {
  await openSignInFromWelcome();
  await fillSignInAndSubmit(credentials.patient.email, credentials.patient.password);
  await waitFor(element(by.text('Home')))
    .toBeVisible()
    .withTimeout(15000);
}

/**
 * Sign in as caregiver from Welcome screen (direct Sign In button).
 */
async function signInAsCaregiver() {
  await openSignInFromWelcome();
  await fillSignInAndSubmit(credentials.caregiver.email, credentials.caregiver.password);
  await waitFor(element(by.text('Patients')))
    .toBeVisible()
    .withTimeout(15000);
}

module.exports = {
  credentials,
  openSignInFromWelcome,
  fillSignInAndSubmit,
  signInAsPatient,
  signInAsCaregiver,
};
