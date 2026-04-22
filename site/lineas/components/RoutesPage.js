// RoutesPage — route planning + technician assignment
(function() {
  var h = htm.bind(React.createElement);

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    var d = new Date(dateStr + 'T00:00:00');
    var months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  var statusLabels = { planned: 'PLANIFICADA', in_progress: 'EN CURSO', completed: 'COMPLETADA' };
  var statusBadge = { planned: 'badge-warn', in_progress: 'badge-ok', completed: 'badge-ok' };

  function RoutesPage() {
    var loading = React.useState(true), setLoading = loading[1]; loading = loading[0];
    var routes = React.useState([]), setRoutes = routes[1]; routes = routes[0];
    var techs = React.useState([]), setTechs = techs[1]; techs = techs[0];
    var clients = React.useState([]), setClients = clients[1]; clients = clients[0];
    var selected = React.useState(null), setSelected = selected[1]; selected = selected[0];
    var stops = React.useState([]), setStops = stops[1]; stops = stops[0];

    // Create route form
    var showCreate = React.useState(false), setShowCreate = showCreate[1]; showCreate = showCreate[0];
    var newName = React.useState(''), setNewName = newName[1]; newName = newName[0];
    var newTech = React.useState(''), setNewTech = newTech[1]; newTech = newTech[0];
    var newDate = React.useState(''), setNewDate = newDate[1]; newDate = newDate[0];
    var saving = React.useState(false), setSaving = saving[1]; saving = saving[0];

    // Add stop
    var showAddStop = React.useState(false), setShowAddStop = showAddStop[1]; showAddStop = showAddStop[0];
    var stopClient = React.useState(''), setStopClient = stopClient[1]; stopClient = stopClient[0];

    function loadData() {
      setLoading(true);
      Promise.all([
        db.from('routes').select('*, technicians(name, city)').order('route_date', { ascending: false }),
        db.from('technicians').select('*').eq('is_active', true).order('name'),
        db.from('clients').select('*').eq('is_active', true).order('name'),
      ]).then(function(results) {
        setRoutes(results[0].data || []);
        setTechs(results[1].data || []);
        setClients(results[2].data || []);
        setLoading(false);
      });
    }

    React.useEffect(loadData, []);

    function loadStops(routeId) {
      db.from('route_stops').select('*, clients(name, city, address)')
        .eq('route_id', routeId)
        .order('stop_order')
        .then(function(res) { setStops(res.data || []); });
    }

    function selectRoute(route) {
      setSelected(route);
      loadStops(route.id);
    }

    function createRoute() {
      if (!newName.trim() || !newTech || !newDate) return;
      setSaving(true);
      db.from('routes').insert({
        name: newName.trim(),
        technician_id: newTech,
        route_date: newDate,
      }).select('*, technicians(name, city)').then(function(res) {
        setSaving(false);
        if (res.error) { alert('Error: ' + res.error.message); return; }
        setShowCreate(false);
        setNewName(''); setNewTech(''); setNewDate('');
        loadData();
      });
    }

    function addStop() {
      if (!stopClient || !selected) return;
      var nextOrder = stops.length + 1;
      db.from('route_stops').insert({
        route_id: selected.id,
        client_id: stopClient,
        stop_order: nextOrder,
      }).select('*, clients(name, city, address)').then(function(res) {
        if (res.error) { alert('Error: ' + res.error.message); return; }
        setShowAddStop(false);
        setStopClient('');
        loadStops(selected.id);
      });
    }

    function toggleStop(stopId, completed) {
      db.from('route_stops').update({ is_completed: !completed }).eq('id', stopId)
        .then(function() { loadStops(selected.id); });
    }

    function updateRouteStatus(routeId, status) {
      db.from('routes').update({ status: status }).eq('id', routeId).select('*, technicians(name, city)')
        .then(function(res) {
          if (res.data && res.data[0]) setSelected(res.data[0]);
          loadData();
        });
    }

    if (loading) {
      return h`<div class="loading"><div class="spinner" />Cargando rutas...</div>`;
    }

    return h`
      <div>
        <div class="page-header">
          <div>
            <div class="page-header-label">PLANIFICACI\u00d3N</div>
            <div class="page-header-title">Rutas</div>
          </div>
          <div class="page-header-actions">
            <button class="btn btn-primary" onClick=${function() { setShowCreate(true); }}>+ Nueva ruta</button>
          </div>
        </div>

        <div style=${{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.2fr' : '1fr', gap: '16px' }}>
          <!-- Route List -->
          <div class="card">
            <div class="card-header">
              <div class="card-header-title">Rutas</div>
              <div class="card-header-sub">${routes.length} total</div>
            </div>
            ${routes.length === 0 && h`
              <div class="empty-state"><div class="empty-state-text">No hay rutas creadas</div></div>
            `}
            ${routes.map(function(r) {
              var techName = r.technicians ? r.technicians.name : '—';
              var isActive = selected && selected.id === r.id;
              return h`
                <div key=${r.id}
                  class="table-row table-row-clickable"
                  style=${{ gridTemplateColumns: '1fr', background: isActive ? 'var(--chip)' : '' ,cursor: 'pointer' }}
                  onClick=${function() { selectRoute(r); }}>
                  <div>
                    <div style=${{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style=${{ fontWeight: 600, fontSize: '13px' }}>${r.name}</span>
                      <span class=${'badge ' + (statusBadge[r.status] || 'badge-warn')}>${statusLabels[r.status] || r.status}</span>
                    </div>
                    <div style=${{ fontSize: '12px', color: 'var(--text-dim)' }}>
                      ${techName} \u00b7 ${formatDate(r.route_date)}
                    </div>
                  </div>
                </div>
              `;
            })}
          </div>

          <!-- Route Detail -->
          ${selected && h`
            <div>
              <div class="card" style=${{ marginBottom: '12px' }}>
                <div class="card-header">
                  <div>
                    <div class="card-header-title">${selected.name}</div>
                    <div style=${{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>
                      ${selected.technicians ? selected.technicians.name + ' \u00b7 ' + selected.technicians.city : ''} \u00b7 ${formatDate(selected.route_date)}
                    </div>
                  </div>
                  <div style=${{ display: 'flex', gap: '6px' }}>
                    ${selected.status === 'planned' && h`
                      <button class="btn btn-sm btn-primary" onClick=${function() { updateRouteStatus(selected.id, 'in_progress'); }}>Iniciar</button>
                    `}
                    ${selected.status === 'in_progress' && h`
                      <button class="btn btn-sm btn-amber" onClick=${function() { updateRouteStatus(selected.id, 'completed'); }}>Completar</button>
                    `}
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-header">
                  <div class="card-header-title">Paradas (${stops.length})</div>
                  <button class="btn btn-sm btn-outline" onClick=${function() { setShowAddStop(true); }}>+ Parada</button>
                </div>
                ${stops.length === 0 && h`
                  <div class="empty-state" style=${{ padding: '32px 20px' }}>
                    <div class="empty-state-text">No hay paradas en esta ruta</div>
                  </div>
                `}
                ${stops.map(function(s) {
                  var client = s.clients || {};
                  return h`
                    <div key=${s.id} class="stop-item">
                      <div class=${'stop-number' + (s.is_completed ? ' completed' : '')}
                           style=${{ cursor: 'pointer' }}
                           onClick=${function() { toggleStop(s.id, s.is_completed); }}>
                        ${s.is_completed ? '\u2713' : s.stop_order}
                      </div>
                      <div class="stop-info">
                        <div class="stop-name" style=${{ textDecoration: s.is_completed ? 'line-through' : 'none' }}>
                          ${client.name || 'Cliente'}
                        </div>
                        <div class="stop-meta">${client.city || ''}${client.address ? ' \u00b7 ' + client.address : ''}</div>
                      </div>
                    </div>
                  `;
                })}
              </div>
            </div>
          `}
        </div>

        <!-- Create Route Modal -->
        ${showCreate && h`
          <div class="modal-overlay" onClick=${function(e) { if (e.target === e.currentTarget) setShowCreate(false); }}>
            <div class="modal">
              <div class="modal-header">
                <div class="modal-title">Nueva ruta</div>
                <button class="modal-close" onClick=${function() { setShowCreate(false); }}>\u00d7</button>
              </div>
              <div class="modal-body">
                <div class="form-group">
                  <label class="form-label">Nombre de la ruta</label>
                  <input class="form-input" type="text" value=${newName}
                    onInput=${function(e) { setNewName(e.target.value); }}
                    placeholder="Ej: Ruta Norte Guayaquil" />
                </div>
                <div class="form-group">
                  <label class="form-label">T\u00e9cnico</label>
                  <select class="form-select" value=${newTech} onChange=${function(e) { setNewTech(e.target.value); }}>
                    <option value="">Seleccionar...</option>
                    ${techs.map(function(t) {
                      return h`<option key=${t.id} value=${t.id}>${t.name} — ${t.city}</option>`;
                    })}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Fecha</label>
                  <input class="form-input" type="date" value=${newDate}
                    onInput=${function(e) { setNewDate(e.target.value); }} />
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-outline" onClick=${function() { setShowCreate(false); }}>Cancelar</button>
                <button class="btn btn-primary" onClick=${createRoute} disabled=${saving || !newName || !newTech || !newDate}>
                  ${saving ? 'Creando...' : 'Crear ruta'}
                </button>
              </div>
            </div>
          </div>
        `}

        <!-- Add Stop Modal -->
        ${showAddStop && h`
          <div class="modal-overlay" onClick=${function(e) { if (e.target === e.currentTarget) setShowAddStop(false); }}>
            <div class="modal">
              <div class="modal-header">
                <div class="modal-title">Agregar parada</div>
                <button class="modal-close" onClick=${function() { setShowAddStop(false); }}>\u00d7</button>
              </div>
              <div class="modal-body">
                <div class="form-group">
                  <label class="form-label">Cliente</label>
                  <select class="form-select" value=${stopClient} onChange=${function(e) { setStopClient(e.target.value); }}>
                    <option value="">Seleccionar cliente...</option>
                    ${clients.map(function(c) {
                      return h`<option key=${c.id} value=${c.id}>${c.name} — ${c.city}</option>`;
                    })}
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-outline" onClick=${function() { setShowAddStop(false); }}>Cancelar</button>
                <button class="btn btn-primary" onClick=${addStop} disabled=${!stopClient}>Agregar</button>
              </div>
            </div>
          </div>
        `}
      </div>
    `;
  }

  window.RoutesPage = RoutesPage;
})();
