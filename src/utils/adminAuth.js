// Client-side admin auth.
// The admin panel uses a single hardcoded account (changeable password stored
// in localStorage) — there is no server-side session or JWT.
const HARDCODED_USERNAME = 'admin';
const HARDCODED_PASSWORD = 'olaflex82736';

export function getStoredPassword() {
  return localStorage.getItem('olaflex_admin_password') || HARDCODED_PASSWORD;
}

export function verifyAdmin(username, password) {
  return username === HARDCODED_USERNAME && password === getStoredPassword();
}

export function setAdminPassword(newPassword) {
  localStorage.setItem('olaflex_admin_password', newPassword);
}

export function isLoggedIn() {
  return localStorage.getItem('olaflex_admin_session') === 'true';
}

export function loginAdmin() {
  localStorage.setItem('olaflex_admin_session', 'true');
}

export function logoutAdmin() {
  localStorage.removeItem('olaflex_admin_session');
}
