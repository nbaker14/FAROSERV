// VisitHistory — full visit log with JotForm photos, geo, tank data + Supabase tab
(function() {
  var h = htm.bind(React.createElement);
  var PAGE_SIZE = 50;

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
    var hr = d.getHours(), mn = d.getMinutes();
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() + ' ' +
      String(hr).padStart(2, '0') + ':' + String(mn).padStart(2, '0');
  }

  var visitTypes = { routine: 'Rutinaria', emergency: 'Emergencia', installation: 'Instalaci\u00f3n' };
  var typeBadge = { routine: 'badge-ok', emergency: 'badge-overdue', installation: 'badge-warn' };
  var workBadge = {
    'MANTENIMIENTO': 'badge-ok',
    'VISITA EMERGENCIA': 'badge-overdue',
    'INSTALACION': 'badge-warn',
    'DESINSTALACION': 'badge-overdue',
    'VISITA TECNICA': 'badge-warn',
    'OTRO': 'badge-ok',
  };
  var tankBadge = {
    'LLENO': 'badge-ok',
    'MITAD': 'badge-warn',
    'POR CAMBIAR': 'badge-overdue',
  };

  // ─── Photo Lightbox ───
  function Lightbox(props) {
    if (!props.src) return null;
    return h`
      <div class="modal-overlay" onClick=${props.onClose}
        style=${{ cursor: 'pointer', zIndex: 300 }}>
        <div style=${{ maxWidth: '90vw', maxHeight: '90vh', position: 'relative' }}
          onClick=${function(e) { e.stopPropagation(); }}>
          <img src=${props.src} alt=${props.alt || 'Foto'}
            style=${{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '6px', display: 'block' }} />
          <div style=${{ color: '#fff', textAlign: 'center', padding: '10px 0', fontSize: '13px' }}>
            ${props.alt || ''}
          </div>
          <button onClick=${props.onClose}
            style=${{ position: 'absolute', top: '-12px', right: '-12px', width: '32px', height: '32px',
              borderRadius: '50%', background: '#1A1A1A', color: '#fff', border: 'none',
              fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            \u00d7
          </button>
        </div>
      </div>
    `;
  }

  // ─── Supabase Visits Tab (unchanged) ───
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

  // ─── JotForm Submissions Tab (expanded with photos + geo + tank) ───
  function JotFormTab() {
    var loading = React.useState(true), setLoading = loading[1]; loading = loading[0];
    var subs = React.useState([]), setSubs = subs[1]; subs = subs[0];
    var total = React.useState(0), setTotal = total[1]; total = total[0];
    var page = React.useState(0), setPage = page[1]; page = page[0];
    var search = React.useState(''), setSearch = search[1]; search = search[0];
    var debouncedSearch = React.useState(''), setDebouncedSearch = debouncedSearch[1]; debouncedSearch = debouncedSearch[0];
    var expanded = React.useState(null), setExpanded = expanded[1]; expanded = expanded[0];
    var lightbox = React.useState(null), setLightbox = lightbox[1]; lightbox = lightbox[0];

    // Debounce search input
    React.useEffect(function() {
      var t = setTimeout(function() { setDebouncedSearch(search); setPage(0); }, 400);
      return function() { clearTimeout(t); };
    }, [search]);

    // Load data whenever page or debouncedSearch changes
    React.useEffect(function() {
      setLoading(true);
      var offset = page * PAGE_SIZE;
      var promise = debouncedSearch.trim()
        ? JotForm.searchSubmissions(debouncedSearch.trim(), offset, PAGE_SIZE)
        : JotForm.fetchSubmissions(offset, PAGE_SIZE);
      promise.then(function(res) {
        setSubs(res.submissions);
        setTotal(parseInt(res.total) || 0);
        setLoading(false);
      }).catch(function() {
        setSubs([]); setTotal(0); setLoading(false);
      });
    }, [page, debouncedSearch]);

    var totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

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
          <div>
            ${subs.length === 0 && h`<div class="card"><div class="empty-state"><div class="empty-state-text">No se encontraron reportes</div></div></div>`}
            ${subs.map(function(s) {
              var isExpanded = expanded === s.id;
              var hasPhotos = s.photos && s.photos.length > 0;
              var hasGeo = s.geo && (s.geo.latitude || s.geo.street);
              var tankClass = tankBadge[s.capacidadTanque] || 'badge-ok';

              return h`
                <div key=${s.id} class="card" style=${{ marginBottom: '8px' }}>
                  <!-- Summary Row -->
                  <div class="table-row table-row-clickable"
                    style=${{ gridTemplateColumns: '1fr', padding: '14px 18px', borderBottom: isExpanded ? '1px solid var(--border)' : 'none' }}
                    onClick=${function() { setExpanded(isExpanded ? null : s.id); }}>
                    <div>
                      <div style=${{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div style=${{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <span style=${{ fontWeight: 600, fontSize: '14px' }}>${s.cliente || '\u2014'}</span>
                          <span class=${'badge ' + (workBadge[s.trabajoRealizado] || 'badge-ok')}>${s.trabajoRealizado || 'N/A'}</span>
                          ${s.capacidadTanque && h`
                            <span class=${'badge ' + tankClass} style=${{ fontSize: '8px' }}>CO2: ${s.capacidadTanque}</span>
                          `}
                          ${hasPhotos && h`<span style=${{ fontSize: '11px', color: 'var(--text-dim)' }}>${s.photos.length} fotos</span>`}
                        </div>
                        <span style=${{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-dim)' }}>
                          ${formatDateTime(s.created_at)}
                        </span>
                      </div>
                      <div style=${{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '12px', color: 'var(--text-dim)', flexWrap: 'wrap' }}>
                        <span>${s.ciudad || ''}</span>
                        <span>${s.marca || ''}</span>
                        <span>${s.tecnico || ''}</span>
                        ${hasGeo && s.geo.street && h`
                          <span style=${{ fontSize: '11px' }}>${s.geo.street}${s.geo.neighborhood ? ', ' + s.geo.neighborhood : ''}</span>
                        `}
                      </div>
                    </div>
                  </div>

                  <!-- Expanded Detail -->
                  ${isExpanded && h`
                    <div style=${{ padding: '18px' }}>
                      <!-- Info Grid -->
                      <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: hasPhotos ? '20px' : '0' }}>
                        <div>
                          <div class="form-label" style=${{ marginBottom: '4px' }}>Novedades</div>
                          <div style=${{ fontSize: '13px' }}>${s.notas || 'Ninguna'}</div>
                        </div>
                        <div>
                          <div class="form-label" style=${{ marginBottom: '4px' }}>Trabajo pendiente</div>
                          <div style=${{ fontSize: '13px' }}>${s.trabajoPendiente || 'Ninguno'}</div>
                        </div>
                        <div>
                          <div class="form-label" style=${{ marginBottom: '4px' }}>Tanque CO2</div>
                          <div style=${{ fontSize: '13px' }}>
                            ${s.capacidadTanque ? h`<span class=${'badge ' + tankClass}>${s.capacidadTanque}</span>` : '\u2014'}
                          </div>
                        </div>
                        ${hasGeo && h`
                          <div>
                            <div class="form-label" style=${{ marginBottom: '4px' }}>Ubicaci\u00f3n</div>
                            <div style=${{ fontSize: '13px' }}>
                              ${s.geo.street || ''}${s.geo.neighborhood ? ', ' + s.geo.neighborhood : ''}
                              ${s.geo.city ? ', ' + s.geo.city : ''}
                            </div>
                            ${s.geo.latitude && s.geo.longitude && h`
                              <a href=${'https://www.google.com/maps?q=' + s.geo.latitude + ',' + s.geo.longitude}
                                target="_blank" rel="noopener"
                                style=${{ fontSize: '11px', color: 'var(--amber)', textDecoration: 'none', display: 'inline-block', marginTop: '4px' }}>
                                Ver en Google Maps \u2192
                              </a>
                            `}
                          </div>
                        `}
                        <div>
                          <div class="form-label" style=${{ marginBottom: '4px' }}>ID Reporte</div>
                          <div style=${{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-dim)' }}>${s.id}</div>
                        </div>
                      </div>

                      <!-- Photos Grid -->
                      ${hasPhotos && h`
                        <div>
                          <div class="form-label" style=${{ marginBottom: '10px' }}>Fotos del reporte</div>
                          <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                            ${s.photos.map(function(p, i) {
                              return h`
                                <div key=${i} style=${{ cursor: 'pointer' }}
                                  onClick=${function() { setLightbox({ src: p.url, alt: p.label }); }}>
                                  <div style=${{
                                    width: '100%', paddingBottom: '75%', position: 'relative',
                                    borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)',
                                    background: 'var(--chip)',
                                  }}>
                                    <img src=${p.url} alt=${p.label}
                                      loading="lazy"
                                      style=${{
                                        position: 'absolute', inset: '0', width: '100%', height: '100%',
                                        objectFit: 'cover',
                                      }} />
                                  </div>
                                  <div style=${{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px', textAlign: 'center',
                                    fontFamily: 'var(--mono)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    ${p.label}
                                  </div>
                                </div>
                              `;
                            })}
                          </div>
                        </div>
                      `}
                    </div>
                  `}
                </div>
              `;
            })}
          </div>

        `}

        <!-- Pagination (always visible) -->
        ${total > PAGE_SIZE && h`
          <div class="pagination" style=${{ marginTop: '16px', padding: '12px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '4px' }}>
            <button class="pagination-btn" disabled=${page === 0 || loading}
              onClick=${function() { setPage(page - 1); window.scrollTo(0, 0); }}>\u2190 Anterior</button>
            <span class="pagination-info">
              P\u00e1g. ${page + 1} de ${totalPages} \u00b7 ${total.toLocaleString()} reportes
            </span>
            <button class="pagination-btn" disabled=${page >= totalPages - 1 || loading}
              onClick=${function() { setPage(page + 1); window.scrollTo(0, 0); }}>Siguiente \u2192</button>
          </div>
        `}

        <!-- Photo Lightbox -->
        ${lightbox && h`<${Lightbox}
          src=${lightbox.src}
          alt=${lightbox.alt}
          onClose=${function() { setLightbox(null); }}
        />`}
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
