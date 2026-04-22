// VisitHistory — paginated visit log with tabs for Supabase + JotForm data
(function() {
  var h = htm.bind(React.createElement);
  var PAGE_SIZE = 20;

  function formatDate(dateStr) {
    if (!dateStr) return '\u2014';
    var d = new Date(dateStr + 'T00:00:00');
    var months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  function formatDateTime(dtStr) {
    if (!dtStr) return '\u2014';
    var d = new Date(dtStr);
    var months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    var h2 = d.getHours(), m = d.getMinutes();
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() + ' ' +
      String(h2).padStart(2,'0') + ':' + String(m).padStart(2,'0');
  }

  var visitTypes = { routine: 'Rutinaria', emergency: 'Emergencia', installation: 'Instalaci\u00f3n' };
  var typeBadge = { routine: 'badge-ok', emergency: 'badge-overdue', installation: 'badge-warn' };

  // ─── Supabase Visits Tab ───
  function SupabaseTab() {
    var loading = React.useState(true), setLoading = loading[1]; loading = loading[0];
    var visits = React.useState([]), setVisits = visits[1]; visits = visits[0];
    var total = React.useState(0), setTotal = total[1]; total = total[0];
    var page = React.useState(0), setPage = page[1]; page = page[0];
    var filterType = React.useState(''), setFilterType = filterType[1]; filterType = filterType[0];
    var search = React.useState(''), setSearch = search[1]; search = search[0];

    function loadVisits() {
      setLoading(true);
      var query = db.from('visits')
        .select('*, beer_lines(line_code, beer_brand, clients(name, city)), technicians(name)', { count: 'exact' })
        .order('visit_date', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      if (filterType) query = query.eq('visit_type', filterType);
      query.then(function(res) {
        var data = res.data || [];
        if (search) {
          var s = search.toLowerCase();
          data = data.filter(function(v) {
            var cn = v.beer_lines && v.beer_lines.clients ? v.beer_lines.clients.name : '';
            var lc = v.beer_lines ? v.beer_lines.line_code : '';
            var tn = v.technicians ? v.technicians.name : '';
            return cn.toLowerCase().indexOf(s) !== -1 || lc.toLowerCase().indexOf(s) !== -1 || tn.toLowerCase().indexOf(s) !== -1;
          });
        }
        setVisits(data); setTotal(res.count || 0); setLoading(false);
      });
    }

    React.useEffect(loadVisits, [page, filterType]);
    React.useEffect(function() {
      var t = setTimeout(loadVisits, 300);
      return function() { clearTimeout(t); };
    }, [search]);

    var totalPages = Math.ceil(total / PAGE_SIZE);

    return h`
      <div>
        <div class="search-bar">
          <input class="search-input" type="text" placeholder="Buscar por cliente, l\u00ednea o t\u00e9cnico..."
            value=${search} onInput=${function(e) { setSearch(e.target.value); setPage(0); }} />
          <select class="form-select" style=${{ width: 'auto', minWidth: '150px' }}
            value=${filterType} onChange=${function(e) { setFilterType(e.target.value); setPage(0); }}>
            <option value="">Todos los tipos</option>
            <option value="routine">Rutinaria</option>
            <option value="emergency">Emergencia</option>
            <option value="installation">Instalaci\u00f3n</option>
          </select>
        </div>
        ${loading ? h`<div class="loading"><div class="spinner" />Cargando...</div>` : h`
          <div class="card">
            <div class="table-head" style=${{ gridTemplateColumns: '80px 1.2fr 0.8fr 0.8fr 0.7fr 0.6fr 1fr' }}>
              <span>L\u00ednea</span><span>Cliente</span><span>Cerveza</span>
              <span>T\u00e9cnico</span><span>Fecha</span><span>Tipo</span><span>Notas</span>
            </div>
            ${visits.length === 0 && h`<div class="empty-state"><div class="empty-state-text">No se encontraron visitas</div></div>`}
            ${visits.map(function(v) {
              var line = v.beer_lines || {}; var client = line.clients || {}; var tech = v.technicians || {};
              return h`
                <div key=${v.id} class="table-row" style=${{ gridTemplateColumns: '80px 1.2fr 0.8fr 0.8fr 0.7fr 0.6fr 1fr' }}>
                  <span style=${{ fontFamily: 'var(--mono)', color: 'var(--text-dim)', fontSize: '11px' }}>${line.line_code || '\u2014'}</span>
                  <span style=${{ fontWeight: 500, fontSize: '12px' }}>${client.name || '\u2014'}${client.city ? ' \u00b7 ' + client.city : ''}</span>
                  <span style=${{ color: 'var(--text-dim)', fontSize: '12px' }}>${line.beer_brand || '\u2014'}</span>
                  <span style=${{ fontSize: '12px' }}>${tech.name || '\u2014'}</span>
                  <span style=${{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-dim)' }}>${formatDate(v.visit_date)}</span>
                  <span><span class=${'badge ' + (typeBadge[v.visit_type] || 'badge-ok')}>${visitTypes[v.visit_type] || v.visit_type}</span></span>
                  <span style=${{ fontSize: '12px', color: 'var(--text-dim)' }}>${v.notes || '\u2014'}</span>
                </div>
              `;
            })}
          </div>
          ${totalPages > 1 && h`
            <div class="pagination">
              <button class="pagination-btn" disabled=${page === 0} onClick=${function() { setPage(page - 1); }}>\u2190 Anterior</button>
              <span class="pagination-info">P\u00e1g. ${page + 1} de ${totalPages}</span>
              <button class="pagination-btn" disabled=${page >= totalPages - 1} onClick=${function() { setPage(page + 1); }}>Siguiente \u2192</button>
            </div>
          `}
        `}
      </div>
    `;
  }

  // ─── JotForm Submissions Tab ───
  function JotFormTab() {
    var loading = React.useState(true), setLoading = loading[1]; loading = loading[0];
    var subs = React.useState([]), setSubs = subs[1]; subs = subs[0];
    var total = React.useState(0), setTotal = total[1]; total = total[0];
    var page = React.useState(0), setPage = page[1]; page = page[0];
    var search = React.useState(''), setSearch = search[1]; search = search[0];
    var expanded = React.useState(null), setExpanded = expanded[1]; expanded = expanded[0];

    function load() {
      setLoading(true);
      var offset = page * PAGE_SIZE;
      var promise = search.trim()
        ? JotForm.searchSubmissions(search.trim(), offset, PAGE_SIZE)
        : JotForm.fetchSubmissions(offset, PAGE_SIZE);
      promise.then(function(res) {
        setSubs(res.submissions);
        setTotal(res.total);
        setLoading(false);
      }).catch(function() {
        setSubs([]); setTotal(0); setLoading(false);
      });
    }

    React.useEffect(load, [page]);
    React.useEffect(function() {
      var t = setTimeout(function() { setPage(0); load(); }, 400);
      return function() { clearTimeout(t); };
    }, [search]);

    var totalPages = Math.ceil(total / PAGE_SIZE);

    return h`
      <div>
        <div class="search-bar">
          <input class="search-input" type="text" placeholder="Buscar por nombre de local..."
            value=${search} onInput=${function(e) { setSearch(e.target.value); }} />
          <div class="pagination-info" style=${{ display: 'flex', alignItems: 'center' }}>
            ${total.toLocaleString()} reportes en JotForm
          </div>
        </div>

        ${loading ? h`<div class="loading"><div class="spinner" />Cargando reportes de JotForm...</div>` : h`
          <div class="card">
            <div class="table-head" style=${{ gridTemplateColumns: '1.3fr 0.7fr 0.8fr 0.8fr 0.8fr 0.7fr' }}>
              <span>Local</span><span>Ciudad</span><span>Marca</span>
              <span>T\u00e9cnico</span><span>Trabajo</span><span>Fecha</span>
            </div>
            ${subs.length === 0 && h`<div class="empty-state"><div class="empty-state-text">No se encontraron reportes</div></div>`}
            ${subs.map(function(s) {
              var isExpanded = expanded === s.id;
              return h`
                <div key=${s.id}>
                  <div class="table-row table-row-clickable"
                    style=${{ gridTemplateColumns: '1.3fr 0.7fr 0.8fr 0.8fr 0.8fr 0.7fr' }}
                    onClick=${function() { setExpanded(isExpanded ? null : s.id); }}>
                    <span style=${{ fontWeight: 500, fontSize: '12.5px' }}>${s.cliente || '\u2014'}</span>
                    <span style=${{ color: 'var(--text-dim)', fontSize: '12px' }}>${s.ciudad || '\u2014'}</span>
                    <span style=${{ fontSize: '12px' }}>${s.marca || '\u2014'}</span>
                    <span style=${{ fontSize: '12px' }}>${s.tecnico || '\u2014'}</span>
                    <span>
                      <span class="badge badge-ok">${s.trabajoRealizado || 'N/A'}</span>
                    </span>
                    <span style=${{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-dim)' }}>${formatDateTime(s.created_at)}</span>
                  </div>
                  ${isExpanded && h`
                    <div style=${{ padding: '12px 14px 16px', background: 'var(--chip)', borderBottom: '1px solid var(--border)' }}>
                      <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                        <div>
                          <div style=${{ color: 'var(--text-dim)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Novedades</div>
                          <div>${s.notas || 'Ninguna'}</div>
                        </div>
                        <div>
                          <div style=${{ color: 'var(--text-dim)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Trabajo pendiente</div>
                          <div>${s.trabajoPendiente || 'Ninguno'}</div>
                        </div>
                        <div>
                          <div style=${{ color: 'var(--text-dim)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Capacidad tanque CO2</div>
                          <div>${s.capacidadTanque || '\u2014'}</div>
                        </div>
                        <div>
                          <div style=${{ color: 'var(--text-dim)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>ID Reporte</div>
                          <div style=${{ fontFamily: 'var(--mono)', fontSize: '11px' }}>${s.id}</div>
                        </div>
                      </div>
                    </div>
                  `}
                </div>
              `;
            })}
          </div>
          ${totalPages > 1 && h`
            <div class="pagination">
              <button class="pagination-btn" disabled=${page === 0} onClick=${function() { setPage(page - 1); }}>\u2190 Anterior</button>
              <span class="pagination-info">P\u00e1g. ${page + 1} de ${totalPages}</span>
              <button class="pagination-btn" disabled=${page >= totalPages - 1} onClick=${function() { setPage(page + 1); }}>Siguiente \u2192</button>
            </div>
          `}
        `}
      </div>
    `;
  }

  // ─── Main Component with Tabs ───
  function VisitHistory() {
    var tab = React.useState('jotform'), setTab = tab[1]; tab = tab[0];

    return h`
      <div>
        <div class="page-header">
          <div>
            <div class="page-header-label">REGISTRO</div>
            <div class="page-header-title">Historial de visitas</div>
          </div>
        </div>

        <div class="tabs">
          <button class=${'tab' + (tab === 'jotform' ? ' active' : '')}
            onClick=${function() { setTab('jotform'); }}>
            JotForm (campo)
          </button>
          <button class=${'tab' + (tab === 'supabase' ? ' active' : '')}
            onClick=${function() { setTab('supabase'); }}>
            Sistema (Supabase)
          </button>
        </div>

        ${tab === 'jotform' ? h`<${JotFormTab} />` : h`<${SupabaseTab} />`}
      </div>
    `;
  }

  window.VisitHistory = VisitHistory;
})();
