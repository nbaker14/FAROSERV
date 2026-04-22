// App — hash router with auth guard
(function() {
  var h = htm.bind(React.createElement);

  function App() {
    var hashState = React.useState(window.location.hash || '#/login');
    var hash = hashState[0], setHash = hashState[1];

    React.useEffect(function() {
      function onHash() { setHash(window.location.hash || '#/login'); }
      window.addEventListener('hashchange', onHash);
      return function() { window.removeEventListener('hashchange', onHash); };
    }, []);

    // Auth guard: redirect to login if not authenticated
    if (!Auth.isLoggedIn()) {
      if (hash !== '#/login') {
        window.location.hash = '#/login';
      }
      return h`<${LoginPage} />`;
    }

    // Redirect from login/root to dashboard if already logged in
    if (hash === '#/login' || hash === '' || hash === '#' || hash === '#/') {
      window.location.hash = '#/dashboard';
      return null;
    }

    // Route to page
    var page;
    if (hash === '#/dashboard') {
      page = h`<${DashboardPage} />`;
    } else if (hash.indexOf('#/clients') === 0) {
      page = h`<${ClientsPage} />`;
    } else if (hash === '#/routes') {
      page = h`<${RoutesPage} />`;
    } else if (hash === '#/history') {
      page = h`<${VisitHistory} />`;
    } else {
      page = h`<${DashboardPage} />`;
    }

    return h`<${Layout} currentHash=${hash}>${page}<//>`;
  }

  // Mount
  var root = ReactDOM.createRoot(document.getElementById('app'));
  root.render(h`<${App} />`);
})();
