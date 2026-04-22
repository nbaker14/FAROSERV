// ClientDetail — single client view with beer lines + visit history
(function() {
  var h = htm.bind(React.createElement);

  function daysUntil(dateStr) {
    if (!dateStr) return null;
    var today = new Date(); today.setHours(0,0,0,0);
    var d = new Date(dateStr + 'T00:00:00'); d.setHours(0,0,0,0);
    return Math.round((d - today) / 86400000);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    var d = new Date(dateStr + 'T00:00:00');
    var months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  function ClientDetail(props) {
    var clientId = props.clientId;
    var loading = React.useState(true), setLoading = loading[1]; loading = loading[0];
    var client = React.useState(null), setClient = client[1]; client = client[0];
    var lines = React.useState([]), setLines = lines[1]; lines = lines[0];
    var visits = React.useState([]), setVisits = visits[1]; visits = visits[0];
    var tab = React.useState('lines'), setTab = tab[1]; tab = tab[0];

    // Add line modal
    var showAddLine = React.useState(false), setShowAddLine = showAddLine[1]; showAddLine = showAddLine[0];
    var newCode = React.useState(''), setNewCode = newCode[1]; newCode = newCode[0];
    var newBrand = React.useState(''), setNewBrand = newBrand[1]; newBrand = newBrand[0];
    var savingLine = React.useState(false), setSavingLine = savingLine[1]; savingLine = savingLine[0];

    function loadData() {
      setLoading(true);
      Promise.all([
        db.from('clients').select('*, technicians(name, city, phone)').eq('id', clientId).single(),
        db.from('beer_lines').select('*').eq('client_id', clientId).eq('is_active', true).order('line_code'),
        db.from('visits').select('*, beer_lines!inner(line_code, client_id), technicians(name)')
          .eq('beer_lines.client_id', clientId)
          .order('visit_date', { ascending: false })
          .limit(50),
      ]).then(function(results) {
        setClient(results[0].data);
        setLines(results[1].data || []);
        setVisits(results[2].data || []);
        setLoading(false);
      });
    }

    React.useEffect(loadData, [clientId]);

    function addLine() {
      if (!newCode.trim() || !newBrand.trim()) return;
      setSavingLine(true);
      db.from('beer_lines').insert({
        line_code: newCode.trim(),
        client_id: clientId,
        beer_brand: newBrand.trim(),
      }).select().then(function(res) {
        setSavingLine(false);
        if (res.error) { alert('Error: ' + res.error.message); return; }
        setShowAddLine(false);
        setNewCode('');
        setNewBrand('');
        loadData();
      });
    }

    if (loading) {
      return h`<div class="loading"><div class="spinner" />Cargando cliente...</div>`;
    }

    if (!client) {
      return h`<div class="empty-state"><div class="empty-state-text">Cliente no encontrado</div>
        <a href="#/clients" class="btn btn-outline">Volver a clientes</a></div>`;
    }

    var tech = client.technicians;

    // Compute line statuses
    var lineStatuses = {};
    lines.forEach(function(l) { lineStatuses[l.id] = { last: null, next: null }; });
    visits.forEach(function(v) {
      var ls = lineStatuses[v.beer_line_id];
      if (!ls) return;
      if (!ls.last || v.visit_date > ls.last) {
        ls.last = v.visit_date;
        ls.next = v.next_visit_date;
      }
    });

    var visitTypes = { routine: 'Rutinaria', emergency: 'Emergencia', installation: 'Instalaci\u00f3n' };

    return h`
      <div>
        <div class="detail-header">
          <button class="detail-back" onClick=${function() { window.location.hash = '#/clients'; }}>\u2190 Clientes</button>
          <div>
            <div class="page-header-title" style=${{ marginBottom: '4px' }}>
              ${client.name}
              ${client.is_emergency && h`<span class="badge badge-emergency" style=${{ marginLeft: '10px', fontSize: '9px', verticalAlign: 'middle' }}>EMERGENCIA</span>`}
            </div>
            <div style=${{ fontSize: '13px', color: 'var(--text-dim)' }}>
              ${client.city}${client.address ? ' \u00b7 ' + client.address : ''}
            </div>
          </div>
        </div>

        <!-- Info Cards -->
        <div class="kpi-grid" style=${{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '20px' }}>
          <div class="kpi-card">
            <div class="kpi-label">Contacto</div>
            <div style=${{ fontSize: '14px', fontWeight: 500 }}>${client.contact_name || '—'}</div>
            <div class="kpi-sub">${client.contact_phone || 'Sin tel\u00e9fono'}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">T\u00e9cnico asignado</div>
            <div style=${{ fontSize: '14px', fontWeight: 500 }}>${tech ? tech.name : 'Sin asignar'}</div>
            <div class="kpi-sub">${tech ? tech.city + (tech.phone ? ' \u00b7 ' + tech.phone : '') : ''}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Frecuencia de visita</div>
            <div style=${{ fontSize: '14px', fontWeight: 500 }}>Cada ${client.visit_frequency_days} d\u00edas</div>
            <div class="kpi-sub">${lines.length} l\u00ednea${lines.length !== 1 ? 's' : ''} activa${lines.length !== 1 ? 's' : ''}</div>
          </div>
        </div>

        ${client.notes && h`
          <div class="card" style=${{ padding: '14px 18px', marginBottom: '20px', fontSize: '13px', color: 'var(--text-dim)' }}>
            <strong style=${{ color: 'var(--ink)' }}>Notas:</strong> ${client.notes}
          </div>
        `}

        <!-- Tabs -->
        <div class="tabs">
          <button class=${'tab' + (tab === 'lines' ? ' active' : '')} onClick=${function() { setTab('lines'); }}>
            L\u00edneas (${lines.length})
          </button>
          <button class=${'tab' + (tab === 'visits' ? ' active' : '')} onClick=${function() { setTab('visits'); }}>
            Visitas (${visits.length})
          </button>
        </div>

        ${tab === 'lines' && h`
          <div>
            <div style=${{ marginBottom: '12px' }}>
              <button class="btn btn-primary btn-sm" onClick=${function() { setShowAddLine(true); }}>+ Agregar l\u00ednea</button>
            </div>
            <div class="card">
              <div class="table-head" style=${{ gridTemplateColumns: '100px 1.2fr 1fr 0.8fr 0.6fr' }}>
                <span>C\u00f3digo</span><span>Cerveza</span><span>\u00daltima visita</span><span>Pr\u00f3xima</span><span style=${{ textAlign: 'right' }}>Estado</span>
              </div>
              ${lines.length === 0 && h`<div class="empty-state"><div class="empty-state-text">No hay l\u00edneas registradas</div></div>`}
              ${lines.map(function(l) {
                var ls = lineStatuses[l.id] || {};
                var days = daysUntil(ls.next);
                var status = days === null ? 'ok' : days < 0 ? 'overdue' : days <= 7 ? 'warn' : 'ok';
                var labels = { ok: 'AL D\u00cdA', warn: 'POR VENCER', overdue: 'VENCIDO' };
                return h`
                  <div key=${l.id} class="table-row" style=${{ gridTemplateColumns: '100px 1.2fr 1fr 0.8fr 0.6fr' }}>
                    <span style=${{ fontFamily: 'var(--mono)', color: 'var(--text-dim)' }}>${l.line_code}</span>
                    <span style=${{ fontWeight: 500 }}>${l.beer_brand}</span>
                    <span style=${{ color: 'var(--text-dim)', fontSize: '12px' }}>${formatDate(ls.last)}</span>
                    <span style=${{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-dim)' }}>${formatDate(ls.next)}</span>
                    <span style=${{ textAlign: 'right' }}>
                      <span class=${'badge badge-' + status}>${labels[status]}</span>
                    </span>
                  </div>
                `;
              })}
            </div>
          </div>
        `}

        ${tab === 'visits' && h`
          <div class="card">
            <div class="table-head" style=${{ gridTemplateColumns: '100px 0.8fr 0.8fr 0.6fr 1.2fr' }}>
              <span>L\u00ednea</span><span>Fecha</span><span>T\u00e9cnico</span><span>Tipo</span><span>Notas</span>
            </div>
            ${visits.length === 0 && h`<div class="empty-state"><div class="empty-state-text">No hay visitas registradas</div></div>`}
            ${visits.map(function(v) {
              var lineCode = v.beer_lines ? v.beer_lines.line_code : '—';
              var techName = v.technicians ? v.technicians.name : '—';
              return h`
                <div key=${v.id} class="table-row" style=${{ gridTemplateColumns: '100px 0.8fr 0.8fr 0.6fr 1.2fr' }}>
                  <span style=${{ fontFamily: 'var(--mono)', color: 'var(--text-dim)' }}>${lineCode}</span>
                  <span style=${{ fontSize: '12px' }}>${formatDate(v.visit_date)}</span>
                  <span style=${{ fontSize: '12px', color: 'var(--text-dim)' }}>${techName}</span>
                  <span><span class="badge badge-ok">${visitTypes[v.visit_type] || v.visit_type}</span></span>
                  <span style=${{ fontSize: '12px', color: 'var(--text-dim)' }}>${v.notes || '—'}</span>
                </div>
              `;
            })}
          </div>
        `}

        <!-- Add Line Modal -->
        ${showAddLine && h`
          <div class="modal-overlay" onClick=${function(e) { if (e.target === e.currentTarget) setShowAddLine(false); }}>
            <div class="modal">
              <div class="modal-header">
                <div class="modal-title">Agregar l\u00ednea de cerveza</div>
                <button class="modal-close" onClick=${function() { setShowAddLine(false); }}>\u00d7</button>
              </div>
              <div class="modal-body">
                <div class="form-group">
                  <label class="form-label">C\u00f3digo de l\u00ednea</label>
                  <input class="form-input" type="text" value=${newCode}
                    onInput=${function(e) { setNewCode(e.target.value); }}
                    placeholder="Ej: LN-050" />
                </div>
                <div class="form-group">
                  <label class="form-label">Marca de cerveza</label>
                  <select class="form-select" value=${newBrand} onChange=${function(e) { setNewBrand(e.target.value); }}>
                    <option value="">Seleccionar...</option>
                    ${['Pilsener','Club Premium','Club Verde','Heineken','Corona','Budweiser','Pilsener Light','Stella Artois'].map(function(b) {
                      return h`<option key=${b} value=${b}>${b}</option>`;
                    })}
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-outline" onClick=${function() { setShowAddLine(false); }}>Cancelar</button>
                <button class="btn btn-primary" onClick=${addLine} disabled=${savingLine || !newCode || !newBrand}>
                  ${savingLine ? 'Guardando...' : 'Agregar'}
                </button>
              </div>
            </div>
          </div>
        `}
      </div>
    `;
  }

  window.ClientDetail = ClientDetail;
})();
