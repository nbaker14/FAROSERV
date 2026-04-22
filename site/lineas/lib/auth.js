// Simple demo auth with sessionStorage
window.Auth = {
  login: function(user, pass) {
    var cfg = window.LINEAS_CONFIG;
    if (user === cfg.DEMO_USER && pass === cfg.DEMO_PASS) {
      sessionStorage.setItem('lineas_auth', 'true');
      return true;
    }
    return false;
  },
  logout: function() {
    sessionStorage.removeItem('lineas_auth');
    window.location.hash = '#/login';
  },
  isLoggedIn: function() {
    return sessionStorage.getItem('lineas_auth') === 'true';
  }
};
