// Layout component — top bar + sidebar + main content area
(function() {
  var h = htm.bind(React.createElement);

  var navItems = [
    { hash: '#/dashboard', icon: '\u25A3', label: 'Dashboard' },
    { hash: '#/clients',   icon: '\u2302', label: 'Clientes' },
    { hash: '#/routes',    icon: '\u2699', label: 'Rutas' },
    { hash: '#/history',   icon: '\u2630', label: 'Historial' },
  ];

  function useIsMobile(bp) {
    bp = bp || 768;
    var s = React.useState(window.innerWidth < bp);
    var mobile = s[0], set = s[1];
    React.useEffect(function() {
      var fn = function() { set(window.innerWidth < bp); };
      window.addEventListener('resize', fn);
      return function() { window.removeEventListener('resize', fn); };
    }, [bp]);
    return mobile;
  }

  function Layout(props) {
    var currentHash = props.currentHash || '#/dashboard';
    var sidebarOpen = React.useState(false);
    var open = sidebarOpen[0], setOpen = sidebarOpen[1];
    var isMobile = useIsMobile();

    // Close sidebar on navigation (mobile)
    React.useEffect(function() { setOpen(false); }, [currentHash]);

    function handleLogout() {
      Auth.logout();
    }

    return h`
      <div>
        <!-- Top Bar -->
        <div class="topbar">
          ${isMobile && h`
            <button class="hamburger" onClick=${function() { setOpen(!open); }}>
              ${open ? '\u2715' : '\u2630'}
            </button>
          `}
          <div class="topbar-logo">
            <svg width="22" height="22" viewBox="0 0 22 22">
              <circle cx="11" cy="11" r="10" fill="none" stroke="#fff" strokeWidth="1" opacity="0.4"/>
              <circle cx="11" cy="11" r="6" fill="none" stroke="#fff" strokeWidth="1.2" opacity="0.7"/>
              <circle cx="11" cy="11" r="2.5" fill="#D97A2B"/>
            </svg>
            LÍNEAS
            <span class="topbar-org">/ ALMACENES JUAN ELJURI</span>
          </div>
          <div class="topbar-right">
            <span>Demo</span>
            <button class="topbar-logout" onClick=${handleLogout}>Salir</button>
          </div>
        </div>

        <!-- Sidebar Overlay (mobile) -->
        <div class=${'sidebar-overlay' + (open ? ' open' : '')}
             onClick=${function() { setOpen(false); }} />

        <!-- Sidebar -->
        <div class=${'sidebar' + (open ? ' open' : '')}>
          ${navItems.map(function(item) {
            var active = currentHash === item.hash ||
              (item.hash === '#/clients' && currentHash.indexOf('#/clients') === 0);
            return h`
              <a key=${item.hash}
                 class=${'sidebar-link' + (active ? ' active' : '')}
                 href=${item.hash}>
                <span class="sidebar-icon">${item.icon}</span>
                ${item.label}
              </a>
            `;
          })}
        </div>

        <!-- Main Content -->
        <div class="main-content">
          ${props.children}
        </div>
      </div>
    `;
  }

  window.Layout = Layout;
  window.useIsMobile = useIsMobile;
})();
