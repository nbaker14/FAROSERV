// DashboardPage — KPIs, maintenance table, bar chart, alert panel
(function() {
  var h = htm.bind(React.createElement);

  function getWeekNumber() {
    var d = new Date();
    var start = new Date(d.getFullYear(), 0, 1);
    var diff = (d - start + ((start.getTimezoneOffset() - d.getTimezoneOffset()) * 60000)) / 86400000;
    return Math.ceil((diff + start.getDay() + 1) / 7);
  }

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
    return d.getDate() + ' ' + months[d.getMonth()];
  }

  function getStatus(days) {
    if (days === null) return 'ok';
    if (days < 0) return 'overdue';
    if (days <= 7) return 'warn';
    return 'ok';
  }

  var statusLabels = { ok: 'AL D\u00cdA', warn: 'POR VENCER', overdue: 'VENCIDO' };

  // Quick-add modal for registering a cleaning visit
  function QuickAddModal(props) {
    var lines = props.lines || [];
    var techs = props.technicians || [];
    var onClose = props.onClose;
    var onSave = props.onSave;

    var lineId = React.useState(''), setLineId = lineId[1]; lineId = lineId[0];
    var techId = React.useState(''), setTechId = techId[1]; techId = techId[0];
    var vType = React.useState('routine'), setVType = vType[1]; vType = vType[0];
    var notes = React.useState(''), setNotes = notes[1]; notes = notes[0];
    var saving = React.useState(false), setSaving = saving[1]; saving = saving[0];

    function handleSave() {
      if (!lineId || !techId) return;
      setSaving(true);
      var today = new Date().toISOString().slice(0, 10);
      // Find the line to get its client's frequency
      var line = lines.find(function(l) { return l.id === lineId; });
      var freq = (line && line.clients && line.clients.visit_frequency_days) || 14;
      var next = new Date();
      next.setDate(next.getDate() + freq);
      var nextStr = next.toISOString().slice(0, 10);

      db.from('visits').insert({
        beer_line_id: lineId,
        technician_id: techId,
        visit_date: today,
        next_visit_date: nextStr,
        visit_type: vType,
        notes: notes || null,
      }).select().then(function(res) {
        setSaving(false);
        if (res.error) { alert('Error: ' + res.error.message); return; }
        onSave();
      });
    }

    return h`
      <div class="modal-overlay" onClick=${function(e) { if (e.target === e.currentTarget) onClose(); }}>
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">Registrar limpieza</div>
            <button class="modal-close" onClick=${onClose}>\u00d7</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">L\u00ednea de cerveza</label>
              <select class="form-select" value=${lineId} onChange=${function(e) { setLineId(e.target.value); }}>
                <option value="">Seleccionar l\u00ednea...</option>
                ${lines.map(function(l) {
                  var clientName = l.clients ? l.clients.name : '';
                  return h`<option key=${l.id} value=${l.id}>${l.line_code} — ${clientName} (${l.beer_brand})</option>`;
                })}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">T\u00e9cnico</label>
              <select class="form-select" value=${techId} onChange=${function(e) { setTechId(e.target.value); }}>
                <option value="">Seleccionar t\u00e9cnico...</option>
                ${techs.map(function(t) {
                  return h`<option key=${t.id} value=${t.id}>${t.name} — ${t.city}</option>`;
                })}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Tipo de visita</label>
              <select class="form-select" value=${vType} onChange=${function(e) { setVType(e.target.value); }}>
                <option value="routine">Rutinaria</option>
                <option value="emergency">Emergencia</option>
                <option value="installation">Instalaci\u00f3n</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Notas</label>
              <textarea class="form-textarea" value=${notes}
                onChange=${function(e) { setNotes(e.target.value); }}
                placeholder="Observaciones opcionales..." />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" onClick=${onClose}>Cancelar</button>
            <button class="btn btn-primary" onClick=${handleSave} disabled=${saving || !lineId || !techId}>
              ${saving ? 'Guardando...' : 'Registrar'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function DashboardPage() {
    var loading = React.useState(true), setLoading = loading[1]; loading = loading[0];
    var lines = React.useState([]), setLines = lines[1]; lines = lines[0];
    var techs = React.useState([]), setTechs = techs[1]; techs = techs[0];
    var visits = React.useState([]), setVisits = visits[1]; visits = visits[0];
    var allClients = React.useState([]), setAllClients = allClients[1]; allClients = allClients[0];
    var showModal = React.useState(false), setShowModal = showModal[1]; showModal = showModal[0];

    function loadData() {
      setLoading(true);
      Promise.all([
        db.from('beer_lines').select('*, clients(*)').eq('is_active', true),
        db.from('technicians').select('*').eq('is_active', true),
        db.from('visits').select('*').order('visit_date', { ascending: false }),
        db.from('clients').select('*').eq('is_active', true),
      ]).then(function(results) {
        setLines(results[0].data || []);
        setTechs(results[1].data || []);
        setVisits(results[2].data || []);
        setAllClients(results[3].data || []);
        setLoading(false);
      });
    }

    React.useEffect(loadData, []);

    if (loading) {
      return h`<div class="loading"><div class="spinner" />Cargando dashboard...</div>`;
    }

    // Compute next_visit_date per beer line from latest visit
    var lineMap = {};
    lines.forEach(function(l) {
      lineMap[l.id] = { line: l, latestVisit: null, nextDate: null };
    });
    visits.forEach(function(v) {
      var entry = lineMap[v.beer_line_id];
      if (!entry) return;
      if (!entry.latestVisit || v.visit_date > entry.latestVisit.visit_date) {
        entry.latestVisit = v;
        entry.nextDate = v.next_visit_date;
      }
    });

    // Build display rows
    var rows = [];
    Object.keys(lineMap).forEach(function(lid) {
      var m = lineMap[lid];
      var l = m.line;
      var client = l.clients || {};
      var days = daysUntil(m.nextDate);
      rows.push({
        id: l.line_code,
        lineId: l.id,
        loc: client.name + (client.city ? ' \u00b7 ' + client.city : ''),
        beer: l.beer_brand,
        days: days,
        lastDate: m.latestVisit ? m.latestVisit.visit_date : null,
        nextDate: m.nextDate,
        status: getStatus(days),
      });
    });

    // Sort: overdue first, then by days ascending
    rows.sort(function(a, b) {
      var da = a.days === null ? 999 : a.days;
      var db2 = b.days === null ? 999 : b.days;
      return da - db2;
    });

    // KPIs
    var total = rows.length;
    var okCount = rows.filter(function(r) { return r.status === 'ok'; }).length;
    var warnCount = rows.filter(function(r) { return r.status === 'warn'; }).length;
    var overdueCount = rows.filter(function(r) { return r.status === 'overdue'; }).length;

    // Bar chart: visits per month (last 8 months)
    var monthBuckets = [];
    var monthLabels = [];
    var now = new Date();
    for (var i = 7; i >= 0; i--) {
      var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      var shortMonths = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
      monthLabels.push(shortMonths[d.getMonth()]);
      var count = visits.filter(function(v) { return v.visit_date && v.visit_date.slice(0,7) === key; }).length;
      monthBuckets.push(count);
    }
    var maxBar = Math.max.apply(null, monthBuckets) || 1;
    var avgVisits = Math.round(monthBuckets.reduce(function(a,b){return a+b;},0) / monthBuckets.length);

    // Top 6 rows for display
    var displayRows = rows.slice(0, 8);

    return h`
      <div>
        <div class="page-header">
          <div>
            <div class="page-header-label">MANTENIMIENTO \u00b7 SEMANA ${getWeekNumber()}</div>
            <div class="page-header-title">L\u00edneas de cerveza</div>
          </div>
          <div class="page-header-actions">
            <button class="btn btn-outline">Filtrar</button>
            <button class="btn btn-primary" onClick=${function() { setShowModal(true); }}>+ Registrar limpieza</button>
          </div>
        </div>

        <!-- KPIs -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">L\u00edneas activas</div>
            <div class="kpi-value">${total}</div>
            <div class="kpi-sub">en ${allClients.length} establecimientos</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Al d\u00eda</div>
            <div class="kpi-value" style=${{ color: 'var(--green)' }}>${okCount}</div>
            <div class="kpi-sub">${total > 0 ? Math.round(okCount / total * 100) : 0}%</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Por vencer (\u22647 d\u00edas)</div>
            <div class="kpi-value" style=${{ color: 'var(--yellow)' }}>${warnCount}</div>
            <div class="kpi-sub">requieren visita</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Vencidas</div>
            <div class="kpi-value" style=${{ color: 'var(--red)' }}>${overdueCount}</div>
            <div class="kpi-sub">prioridad alta</div>
          </div>
        </div>

        <!-- Body: Table + Sidebar -->
        <div class="dash-body">
          <div class="card">
            <div class="card-header">
              <div class="card-header-title">Pr\u00f3ximos mantenimientos</div>
              <div class="card-header-sub">ordenado por fecha</div>
            </div>
            <div class="table-head" style=${{ gridTemplateColumns: '70px 1.6fr 1fr 0.6fr 0.7fr 0.9fr' }}>
              <span>L\u00ednea</span><span>Cliente</span><span>Cerveza</span>
              <span style=${{ textAlign: 'right' }}>D\u00edas</span><span>Pr\u00f3xima</span>
              <span style=${{ textAlign: 'right' }}>Estado</span>
            </div>
            ${displayRows.map(function(r, i) {
              var daysColor = r.days !== null && r.days < 0 ? 'var(--red)' : r.days !== null && r.days <= 7 ? 'var(--yellow)' : 'var(--text-dim)';
              var daysText = r.days === null ? '—' : r.days < 0 ? '\u2212' + Math.abs(r.days) : '+' + r.days;
              return h`
                <div key=${r.id} class="table-row" style=${{ gridTemplateColumns: '70px 1.6fr 1fr 0.6fr 0.7fr 0.9fr' }}>
                  <span style=${{ fontFamily: 'var(--mono)', color: 'var(--text-dim)' }}>${r.id}</span>
                  <span style=${{ fontWeight: 500 }}>${r.loc}</span>
                  <span style=${{ color: 'var(--text-dim)' }}>${r.beer}</span>
                  <span style=${{ textAlign: 'right', fontFamily: 'var(--mono)', color: daysColor, fontWeight: 500 }}>${daysText}</span>
                  <span style=${{ fontFamily: 'var(--mono)', color: 'var(--text-dim)', fontSize: '11px' }}>${formatDate(r.nextDate)}</span>
                  <span style=${{ textAlign: 'right' }}>
                    <span class=${'badge badge-' + r.status}>${statusLabels[r.status]}</span>
                  </span>
                </div>
              `;
            })}
            ${rows.length > 8 && h`
              <div style=${{ padding: '12px 14px', textAlign: 'center' }}>
                <a href="#/history" style=${{ color: 'var(--amber)', fontSize: '12px', textDecoration: 'none' }}>
                  Ver todas las ${rows.length} l\u00edneas \u2192
                </a>
              </div>
            `}
          </div>

          <div class="dash-sidebar">
            <!-- Bar Chart -->
            <div class="card" style=${{ padding: '18px' }}>
              <div class="kpi-label" style=${{ marginBottom: '14px' }}>Limpiezas por mes</div>
              <div class="bar-chart">
                ${monthBuckets.map(function(v, i) {
                  var pct = Math.max((v / maxBar) * 100, 4);
                  return h`
                    <div key=${i} class="bar-col">
                      <div class=${'bar' + (i === 7 ? ' current' : '')} style=${{ height: pct + 'px' }} />
                      <div class="bar-label">${monthLabels[i]}</div>
                    </div>
                  `;
                })}
              </div>
              <div class="bar-chart-footer">
                Promedio: ${avgVisits} limpiezas/mes
              </div>
            </div>

            <!-- Alert Panel -->
            ${overdueCount > 0 && h`
              <div class="card-dark">
                <div class="kpi-label">Alerta cr\u00edtica</div>
                <div style=${{ fontSize: '14px', fontWeight: 500, lineHeight: 1.45, margin: '10px 0 14px' }}>
                  ${overdueCount} l\u00ednea${overdueCount !== 1 ? 's' : ''} con mantenimiento vencido. Reprogramar rutas para priorizar.
                </div>
                <div style=${{ display: 'flex', gap: '8px' }}>
                  <a href="#/routes" class="btn btn-amber" style=${{ textDecoration: 'none' }}>Ver rutas</a>
                  <button class="btn" style=${{ border: '1px solid rgba(255,255,255,0.2)', color: '#F7F5F0', background: 'none' }}>Exportar</button>
                </div>
              </div>
            `}

            <!-- Emergency clients -->
            ${function() {
              var emergencies = allClients.filter(function(c) { return c.is_emergency; });
              if (emergencies.length === 0) return null;
              return h`
                <div class="card" style=${{ padding: '18px' }}>
                  <div class="kpi-label" style=${{ marginBottom: '10px' }}>Clientes emergencia</div>
                  ${emergencies.map(function(c) {
                    return h`
                      <div key=${c.id} style=${{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                        <span style=${{ fontSize: '13px', fontWeight: 500 }}>${c.name}</span>
                        <span class="badge badge-emergency">EMERGENCIA</span>
                      </div>
                    `;
                  })}
                </div>
              `;
            }()}
          </div>
        </div>

        ${showModal && h`<${QuickAddModal}
          lines=${lines}
          technicians=${techs}
          onClose=${function() { setShowModal(false); }}
          onSave=${function() { setShowModal(false); loadData(); }}
        />`}
      </div>
    `;
  }

  window.DashboardPage = DashboardPage;
})();
