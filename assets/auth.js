// Lightweight client-side auth for development/demo only.
// Stores users in localStorage (NOT secure). Intended for local/static demo.
(function () {
  const AUTH_KEY = 'slg_authenticated';
  const USERS_KEY = 'slg_users';

  function isAuth() {
    return !!localStorage.getItem(AUTH_KEY);
  }

  function getAuthUser() {
    const v = localStorage.getItem(AUTH_KEY);
    return v ? JSON.parse(v) : null;
  }

  function saveAuthUser(user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY);
    // redirect to login
    location.href = 'login.html';
  }

  function registerUser(username, email, password) {
    if (!email || !password) return { ok: false, msg: 'Missing email or password' };
    const key = email.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    if (users[key]) {
      return { ok: false, msg: 'Email already registered' };
    }
    users[key] = { username: username, email: key, password: password };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    saveAuthUser({ username: username, email: key });
    return { ok: true };
  }

  function loginUser(email, password) {
    if (!email || !password) return { ok: false, msg: 'Missing email or password' };
    const key = email.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    const u = users[key];
    if (u && u.password === password) {
      saveAuthUser({ username: u.username, email: u.email });
      return { ok: true };
    }
    return { ok: false, msg: 'Invalid email or password' };
  }

  // Protect pages: if not authenticated and not on login/register, redirect to login
  (function protect() {
    try {
      const path = (location.pathname || '').split('/').pop().toLowerCase();
      const page = path || 'index.html';

      // If already authenticated, don't allow visiting login/register
      if (isAuth() && (page === 'login.html' || page === 'register.html')) {
        // use replace to avoid history push
        location.replace('index.html');
        return;
      }

      // Allow access to login and register pages without auth
      if (page === 'login.html' || page === 'register.html') return;

      // Everything else requires auth
      if (!isAuth()) {
        // preserve attempted path using query param and use replace to avoid loops
        const redirectTo = page || 'index.html';
        const url = 'login.html?redirect=' + encodeURIComponent(redirectTo);
        location.replace(url);
      }
    } catch (err) {
      // If anything fails, log and redirect to login as a safe fallback
      try {
        console.error('Auth protect error', err);
        location.replace('login.html');
      } catch (e) {}
    }
  })();

  // expose API
  window.SLGAuth = {
    isAuth,
    getAuthUser,
    registerUser,
    loginUser,
    logout,
  };
})();
