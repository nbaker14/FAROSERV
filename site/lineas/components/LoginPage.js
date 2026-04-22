// LoginPage component
(function() {
  var h = htm.bind(React.createElement);

  function LoginPage(props) {
    var _s = React.useState, _r = React.useRef;
    var userRef = _r(null);
    var passRef = _r(null);
    var error = _s(''), setError = error[1]; error = error[0];
    var loading = _s(false), setLoading = loading[1]; loading = loading[0];

    function handleSubmit(e) {
      e.preventDefault();
      setError('');
      setLoading(true);
      var user = userRef.current.value.trim();
      var pass = passRef.current.value;
      setTimeout(function() {
        if (Auth.login(user, pass)) {
          window.location.hash = '#/dashboard';
        } else {
          setError('Usuario o contraseña incorrectos');
        }
        setLoading(false);
      }, 400);
    }

    return h`
      <div class="login-wrapper">
        <div class="login-card">
          <div class="login-logo">
            <svg width="26" height="26" viewBox="0 0 22 22">
              <circle cx="11" cy="11" r="10" fill="none" stroke="#fff" strokeWidth="1" opacity="0.4"/>
              <circle cx="11" cy="11" r="6" fill="none" stroke="#fff" strokeWidth="1.2" opacity="0.7"/>
              <circle cx="11" cy="11" r="2.5" fill="#D97A2B"/>
            </svg>
            LÍNEAS
          </div>
          <div class="login-subtitle">ALMACENES JUAN ELJURI</div>
          <div class="login-desc">
            Plataforma de seguimiento y control de mantenimiento de líneas de cerveza.
            Gestiona técnicos, clientes, rutas y el historial de limpiezas en un solo lugar.
          </div>
          <form onSubmit=${handleSubmit}>
            <label class="login-label">Usuario</label>
            <input ref=${userRef} class="login-input" type="text" placeholder="Ingresa tu usuario" autocomplete="username" />
            <label class="login-label">Contraseña</label>
            <input ref=${passRef} class="login-input" type="password" placeholder="••••••••" autocomplete="current-password" />
            <button class="login-btn" type="submit" disabled=${loading}>
              ${loading ? 'Ingresando...' : 'Ingresar'}
            </button>
            ${error && h`<div class="login-error">${error}</div>`}
          </form>
        </div>
      </div>
    `;
  }

  window.LoginPage = LoginPage;
})();
