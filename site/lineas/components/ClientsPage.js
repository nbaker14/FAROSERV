// ClientsPage — client list with search/filter
(function() {
  var h = htm.bind(React.createElement);

  function ClientsPage() {
    var loading = React.useState(true), setLoading = loading[1]; loading = loading[0];
    var clients = React.useState([]), setClients = clients[1]; clients = clients[0];
    var search = React.useState(''), setSearch = search[1]; search = search[0];
    var filterCity = React.useState(''), setFilterCity = filterCity[1]; filterCity = filterCity[0];
    var showForm = React.useState(false), setShowForm = showForm[1]; showForm = showForm[0];
    var editId = React.useState(null), setEditId = editId[1]; editId = editId[0];

    function loadClients() {
      setLoading(true);
      db.from('clients').select('*, technicians(name)').eq('is_active', true).order('name')
        .then(function(res) {
          setClients(res.data || []);
          setLoading(false);
        });
    }

    React.useEffect(loadClients, []);

    // Get unique cities
    var cities = [];
    clients.forEach(function(c) {
      if (c.city && cities.indexOf(c.city) === -1) cities.push(c.city);
    });
    cities.sort();

    // Filter
    var filtered = clients.filter(function(c) {
      var matchSearch = !search ||
        c.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
        (c.contact_name && c.contact_name.toLowerCase().indexOf(search.toLowerCase()) !== -1);
      var matchCity = !filterCity || c.city === filterCity;
      return matchSearch && matchCity;
    });

    if (showForm || editId) {
      return h`<${ClientForm}
        clientId=${editId}
        onClose=${function() { setShowForm(false); setEditId(null); }}
        onSave=${function() { setShowForm(false); setEditId(null); loadClients(); }}
      />`;
    }

    // Check hash for detail view
    var hash = window.location.hash;
    var detailMatch = hash.match(/^#\/clients\/(.+)$/);
    if (detailMatch && detailMatch[1] !== 'new') {
      return h`<${ClientDetail} clientId=${detailMatch[1]} />`;
    }

    if (loading) {
      return h`<div class="loading"><div class="spinner" />Cargando clientes...</div>`;
    }

    return h`
      <div>
        <div class="page-header">
          <div>
            <div class="page-header-label">GESTI\u00d3N</div>
            <div class="page-header-title">Clientes</div>
          </div>
          <div class="page-header-actions">
            <button class="btn btn-primary" onClick=${function() { setShowForm(true); }}>+ Nuevo cliente</button>
          </div>
        </div>

        <div class="search-bar">
          <input class="search-input" type="text" placeholder="Buscar por nombre o contacto..."
            value=${search} onInput=${function(e) { setSearch(e.target.value); }} />
          <select class="form-select" style=${{ width: 'auto', minWidth: '150px' }}
            value=${filterCity} onChange=${function(e) { setFilterCity(e.target.value); }}>
            <option value="">Todas las ciudades</option>
            ${cities.map(function(c) { return h`<option key=${c} value=${c}>${c}</option>`; })}
          </select>
        </div>

        <div class="card">
          <div class="table-head" style=${{ gridTemplateColumns: '1.5fr 0.8fr 1fr 0.8fr 0.6fr 0.5fr' }}>
            <span>Cliente</span><span>Ciudad</span><span>Contacto</span>
            <span>T\u00e9cnico</span><span>Frecuencia</span><span style=${{ textAlign: 'right' }}>Acc.</span>
          </div>
          ${filtered.length === 0 && h`
            <div class="empty-state">
              <div class="empty-state-text">No se encontraron clientes</div>
            </div>
          `}
          ${filtered.map(function(c) {
            var techName = c.technicians ? c.technicians.name : '—';
            return h`
              <div key=${c.id} class="table-row table-row-clickable"
                   style=${{ gridTemplateColumns: '1.5fr 0.8fr 1fr 0.8fr 0.6fr 0.5fr' }}
                   onClick=${function() { window.location.hash = '#/clients/' + c.id; }}>
                <span style=${{ fontWeight: 500 }}>
                  ${c.name}
                  ${c.is_emergency && h`<span class="badge badge-emergency" style=${{ marginLeft: '8px', fontSize: '8px', padding: '2px 5px' }}>!</span>`}
                </span>
                <span style=${{ color: 'var(--text-dim)' }}>${c.city}</span>
                <span style=${{ color: 'var(--text-dim)', fontSize: '12px' }}>${c.contact_name || '—'}</span>
                <span style=${{ fontSize: '12px' }}>${techName}</span>
                <span style=${{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-dim)' }}>${c.visit_frequency_days}d</span>
                <span style=${{ textAlign: 'right' }}>
                  <button class="btn btn-sm btn-outline" onClick=${function(e) {
                    e.stopPropagation();
                    setEditId(c.id);
                  }}>Editar</button>
                </span>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  window.ClientsPage = ClientsPage;
})();
