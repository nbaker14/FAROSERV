// Fake product dashboards — rendered as React/SVG and used as screenshots

function LineasDashboard() {
  const c = {
    bg: '#F7F5F0', ink: '#1A1A1A', border: '#E5E1D6', textDim: '#6B6B6B',
    amber: '#D97A2B', green: '#4A8F5C', red: '#C0432B', yellow: '#D4A73A',
    chip: '#EFEAE0',
  };
  const F = `"Space Grotesk", sans-serif`;
  const M = `"JetBrains Mono", monospace`;
  const lines = [
    { id: 'LN-041', loc: 'Bar La Ronda · Quito', beer: 'Pilsener', days: 3, last: '12 abr', next: '19 abr', status: 'warn' },
    { id: 'LN-018', loc: 'Restaurante El Puerto · GYE', beer: 'Club Premium', days: -2, last: '04 abr', next: '18 abr', status: 'overdue' },
    { id: 'LN-077', loc: 'Hotel Oro Verde · GYE', beer: 'Heineken', days: 9, last: '16 abr', next: '30 abr', status: 'ok' },
    { id: 'LN-112', loc: 'Cervecería Bandido · CUE', beer: 'Club Verde', days: 5, last: '14 abr', next: '21 abr', status: 'warn' },
    { id: 'LN-205', loc: 'Resto Bar Zazu · UIO', beer: 'Corona', days: 14, last: '18 abr', next: '05 may', status: 'ok' },
    { id: 'LN-089', loc: 'La Liebre · UIO', beer: 'Pilsener Light', days: -5, last: '01 abr', next: '15 abr', status: 'overdue' },
  ];
  const statusColor = { ok: c.green, warn: c.yellow, overdue: c.red };
  const statusLabel = { ok: 'AL DÍA', warn: 'POR VENCER', overdue: 'VENCIDO' };

  return (
    <div style={{ width: 1100, height: 720, background: c.bg, fontFamily: F, color: c.ink, padding: 0, position: 'relative', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ height: 56, background: c.ink, display: 'flex', alignItems: 'center', padding: '0 28px', color: '#F7F5F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, letterSpacing: '-0.01em', fontSize: 17 }}>
          <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="10" fill="none" stroke="#fff" strokeWidth="1" opacity="0.4"/><circle cx="11" cy="11" r="6" fill="none" stroke="#fff" strokeWidth="1.2" opacity="0.7"/><circle cx="11" cy="11" r="2.5" fill={c.amber}/></svg>
          LÍNEAS
          <span style={{ fontSize: 11, fontFamily: M, opacity: 0.5, marginLeft: 8, letterSpacing: '0.1em' }}>/ ALMACENES JUAN ELJURI</span>
        </div>
        <div style={{ flex: 1 }}/>
        <div style={{ fontSize: 12, opacity: 0.7 }}>Luis Cedeño · Técnico · Guayaquil</div>
      </div>
      {/* Page header */}
      <div style={{ padding: '28px 28px 16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: c.textDim, letterSpacing: '0.2em', fontFamily: M, marginBottom: 8 }}>MANTENIMIENTO · SEMANA 16</div>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>Líneas de cerveza</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ padding: '8px 14px', border: `1px solid ${c.border}`, fontSize: 12, background: '#fff', borderRadius: 4 }}>Filtrar</div>
          <div style={{ padding: '8px 14px', background: c.ink, color: '#fff', fontSize: 12, fontWeight: 500, borderRadius: 4 }}>+ Registrar limpieza</div>
        </div>
      </div>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, padding: '0 28px' }}>
        {[
          { k: 'Líneas activas', v: '247', sub: 'en 89 establecimientos' },
          { k: 'Al día', v: '182', sub: '74%', color: c.green },
          { k: 'Por vencer (≤7 días)', v: '41', sub: 'requieren visita', color: c.yellow },
          { k: 'Vencidas', v: '24', sub: 'prioridad alta', color: c.red },
        ].map((k, i) => (
          <div key={i} style={{ background: '#fff', border: `1px solid ${c.border}`, padding: '18px 18px 16px', borderRadius: 4 }}>
            <div style={{ fontSize: 11, color: c.textDim, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>{k.k}</div>
            <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em', color: k.color || c.ink, lineHeight: 1 }}>{k.v}</div>
            <div style={{ fontSize: 11, color: c.textDim, marginTop: 8 }}>{k.sub}</div>
          </div>
        ))}
      </div>
      {/* Body: table + next visits */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 12, padding: '16px 28px' }}>
        <div style={{ background: '#fff', border: `1px solid ${c.border}`, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${c.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Próximos mantenimientos</div>
            <div style={{ fontSize: 11, color: c.textDim, fontFamily: M }}>ordenado por fecha</div>
          </div>
          <div style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: '70px 1.6fr 1fr 0.6fr 0.7fr 0.9fr', gap: 10, fontSize: 10, color: c.textDim, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: M, borderBottom: `1px solid ${c.border}` }}>
            <span>Línea</span><span>Cliente</span><span>Cerveza</span><span style={{textAlign:'right'}}>Días</span><span>Próxima</span><span style={{textAlign:'right'}}>Estado</span>
          </div>
          {lines.map((l, i) => (
            <div key={l.id} style={{
              padding: '14px', display: 'grid', gridTemplateColumns: '70px 1.6fr 1fr 0.6fr 0.7fr 0.9fr', gap: 10,
              fontSize: 12.5, alignItems: 'center', borderBottom: i < lines.length - 1 ? `1px solid ${c.border}` : 'none',
            }}>
              <span style={{ fontFamily: M, color: c.textDim }}>{l.id}</span>
              <span style={{ fontWeight: 500 }}>{l.loc}</span>
              <span style={{ color: c.textDim }}>{l.beer}</span>
              <span style={{ textAlign: 'right', fontFamily: M, color: l.days < 0 ? c.red : l.days < 7 ? c.yellow : c.textDim, fontWeight: 500 }}>
                {l.days < 0 ? `−${Math.abs(l.days)}` : `+${l.days}`}
              </span>
              <span style={{ fontFamily: M, color: c.textDim, fontSize: 11 }}>{l.next}</span>
              <span style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'inline-block', padding: '3px 8px', borderRadius: 2,
                  background: statusColor[l.status] + '22', color: statusColor[l.status],
                  fontSize: 9.5, fontFamily: M, letterSpacing: '0.1em', fontWeight: 600,
                }}>{statusLabel[l.status]}</span>
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: '#fff', border: `1px solid ${c.border}`, borderRadius: 4, padding: 18 }}>
            <div style={{ fontSize: 11, color: c.textDim, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Limpiezas por mes</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 110, borderBottom: `1px solid ${c.border}`, paddingBottom: 4 }}>
              {[58, 72, 65, 81, 94, 88, 102, 96].map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: '100%', height: v, background: i === 7 ? c.amber : c.ink, opacity: i === 7 ? 1 : 0.8 }}/>
                  <div style={{ fontSize: 9, color: c.textDim, fontFamily: M }}>{['SEP','OCT','NOV','DIC','ENE','FEB','MAR','ABR'][i]}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: c.textDim, marginTop: 12, fontFamily: M }}>
              Promedio: 82 limpiezas/mes · <span style={{ color: c.green }}>+17% vs. año anterior</span>
            </div>
          </div>
          <div style={{ background: c.ink, color: '#F7F5F0', border: `1px solid ${c.ink}`, borderRadius: 4, padding: 18 }}>
            <div style={{ fontSize: 11, opacity: 0.6, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Alerta crítica</div>
            <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.45, marginBottom: 14 }}>
              24 líneas con mantenimiento vencido. Reprogramar rutas de esta semana para priorizar.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ padding: '8px 12px', background: c.amber, color: c.ink, fontSize: 11.5, fontWeight: 600, borderRadius: 3 }}>Ver ruta sugerida</div>
              <div style={{ padding: '8px 12px', border: '1px solid rgba(255,255,255,0.2)', fontSize: 11.5, borderRadius: 3 }}>Exportar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FletesXDashboard() {
  const c = {
    bg: '#F5F4F0', ink: '#1A2A52', border: '#E0DDD4', textDim: '#6B6B6B',
    orange: '#F37021', yellow: '#FBB040', green: '#3A8F5C', red: '#C0432B',
    navy: '#1A2A52',
  };
  const F = `"Space Grotesk", sans-serif`;
  const M = `"JetBrains Mono", monospace`;
  const movements = [
    { id: 'FX-1042', route: 'Guayaquil → Quito', type: 'propio', driver: 'R. Méndez', plate: 'GYE-4821', status: 'transit', eta: '14:30' },
    { id: 'FX-1043', route: 'Durán → Machala', type: 'tercero', driver: 'J. Villacrés', plate: 'AZG-0917', status: 'transit', eta: '11:15' },
    { id: 'FX-1044', route: 'Guayaquil → Cuenca', type: 'propio', driver: 'M. Cedeño', plate: 'GYE-3305', status: 'loading', eta: '—' },
    { id: 'FX-1045', route: 'Quito → Ambato', type: 'tercero', driver: 'P. Ramos', plate: 'PCH-2244', status: 'delivered', eta: '09:40' },
    { id: 'FX-1046', route: 'Guayaquil → Manta', type: 'propio', driver: 'L. Bravo', plate: 'GYE-5510', status: 'transit', eta: '16:00' },
    { id: 'FX-1047', route: 'Cuenca → Guayaquil', type: 'tercero', driver: 'A. Parra', plate: 'XBA-1183', status: 'transit', eta: '13:20' },
  ];
  const statusColor = { transit: c.orange, loading: c.yellow, delivered: c.green };
  const statusLabel = { transit: 'EN RUTA', loading: 'CARGANDO', delivered: 'ENTREGADO' };
  const typeLabel = { propio: 'PROPIO', tercero: 'TERCERO' };
  const typeColor = { propio: c.navy, tercero: c.orange };

  return (
    <div style={{ width: 1100, height: 720, background: c.bg, fontFamily: F, color: c.ink, padding: 0, position: 'relative', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ height: 56, background: c.navy, display: 'flex', alignItems: 'center', padding: '0 28px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, letterSpacing: '-0.01em', fontSize: 17 }}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <rect x="2" y="7" width="20" height="11" rx="2" fill="none" stroke="#fff" strokeWidth="1.4" opacity="0.5"/>
            <path d="M6 7V5.5A1.5 1.5 0 0 1 7.5 4h9A1.5 1.5 0 0 1 18 5.5V7" fill="none" stroke="#fff" strokeWidth="1.2" opacity="0.3"/>
            <rect x="8" y="10" width="8" height="2" rx="1" fill={c.orange}/>
            <rect x="10" y="13.5" width="4" height="1.5" rx="0.75" fill={c.yellow} opacity="0.7"/>
          </svg>
          FLETESX
          <span style={{ fontSize: 11, fontFamily: M, opacity: 0.5, marginLeft: 8, letterSpacing: '0.1em' }}>/ CENTRO DE CONTROL</span>
        </div>
        <div style={{ flex: 1 }}/>
        <div style={{ fontSize: 12, opacity: 0.7 }}>Carlos Reyes · Dispatch · Guayaquil</div>
      </div>
      {/* Page header */}
      <div style={{ padding: '28px 28px 16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: c.textDim, letterSpacing: '0.2em', fontFamily: M, marginBottom: 8 }}>OPERACIONES · 12 MAYO 2026</div>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>Movimientos activos</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ padding: '8px 14px', border: `1px solid ${c.border}`, fontSize: 12, background: '#fff', borderRadius: 4 }}>Filtrar</div>
          <div style={{ padding: '8px 14px', background: c.navy, color: '#fff', fontSize: 12, fontWeight: 500, borderRadius: 4 }}>+ Nuevo despacho</div>
        </div>
      </div>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, padding: '0 28px' }}>
        {[
          { k: 'Movimientos hoy', v: '38', sub: '24 propios · 14 terceros' },
          { k: 'En ruta', v: '26', sub: '68% del total', color: c.orange },
          { k: 'Entregas a tiempo', v: '94%', sub: 'últimos 30 días', color: c.green },
          { k: 'BASC compliance', v: '97%', sub: 'evidencia completa', color: c.green },
        ].map((k, i) => (
          <div key={i} style={{ background: '#fff', border: `1px solid ${c.border}`, padding: '18px 18px 16px', borderRadius: 4 }}>
            <div style={{ fontSize: 11, color: c.textDim, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>{k.k}</div>
            <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em', color: k.color || c.ink, lineHeight: 1 }}>{k.v}</div>
            <div style={{ fontSize: 11, color: c.textDim, marginTop: 8 }}>{k.sub}</div>
          </div>
        ))}
      </div>
      {/* Body: table + side panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 12, padding: '16px 28px' }}>
        <div style={{ background: '#fff', border: `1px solid ${c.border}`, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${c.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Despachos del día</div>
            <div style={{ fontSize: 11, color: c.textDim, fontFamily: M }}>flota propia + terceros</div>
          </div>
          <div style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: '65px 1.4fr 0.7fr 1fr 0.6fr 0.9fr', gap: 10, fontSize: 10, color: c.textDim, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: M, borderBottom: `1px solid ${c.border}` }}>
            <span>ID</span><span>Ruta</span><span>Tipo</span><span>Conductor</span><span>ETA</span><span style={{textAlign:'right'}}>Estado</span>
          </div>
          {movements.map((m, i) => (
            <div key={m.id} style={{
              padding: '14px', display: 'grid', gridTemplateColumns: '65px 1.4fr 0.7fr 1fr 0.6fr 0.9fr', gap: 10,
              fontSize: 12.5, alignItems: 'center', borderBottom: i < movements.length - 1 ? `1px solid ${c.border}` : 'none',
            }}>
              <span style={{ fontFamily: M, color: c.textDim }}>{m.id}</span>
              <span style={{ fontWeight: 500 }}>{m.route}</span>
              <span>
                <span style={{
                  display: 'inline-block', padding: '2px 6px', borderRadius: 2,
                  background: typeColor[m.type] + '18', color: typeColor[m.type],
                  fontSize: 9.5, fontFamily: M, letterSpacing: '0.08em', fontWeight: 600,
                }}>{typeLabel[m.type]}</span>
              </span>
              <span style={{ color: c.textDim }}>{m.driver}</span>
              <span style={{ fontFamily: M, color: c.textDim, fontSize: 11 }}>{m.eta}</span>
              <span style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'inline-block', padding: '3px 8px', borderRadius: 2,
                  background: statusColor[m.status] + '22', color: statusColor[m.status],
                  fontSize: 9.5, fontFamily: M, letterSpacing: '0.1em', fontWeight: 600,
                }}>{statusLabel[m.status]}</span>
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: '#fff', border: `1px solid ${c.border}`, borderRadius: 4, padding: 18 }}>
            <div style={{ fontSize: 11, color: c.textDim, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Flota propia vs. terceros</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <svg width="90" height="90" viewBox="0 0 90 90">
                <circle cx="45" cy="45" r="35" fill="none" stroke={c.border} strokeWidth="12"/>
                <circle cx="45" cy="45" r="35" fill="none" stroke={c.navy} strokeWidth="12"
                  strokeDasharray={`${0.63 * 2 * Math.PI * 35} ${2 * Math.PI * 35}`}
                  strokeLinecap="butt" transform="rotate(-90 45 45)"/>
                <circle cx="45" cy="45" r="35" fill="none" stroke={c.orange} strokeWidth="12"
                  strokeDasharray={`${0.37 * 2 * Math.PI * 35} ${2 * Math.PI * 35}`}
                  strokeDashoffset={`${-0.63 * 2 * Math.PI * 35}`}
                  strokeLinecap="butt" transform="rotate(-90 45 45)"/>
              </svg>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: c.navy }}/>
                  <span style={{ fontSize: 12 }}>Propia <strong>63%</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: c.orange }}/>
                  <span style={{ fontSize: 12 }}>Terceros <strong>37%</strong></span>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: c.textDim, marginTop: 14, fontFamily: M }}>
              Misma evidencia BASC en ambos canales
            </div>
          </div>
          <div style={{ background: '#fff', border: `1px solid ${c.border}`, borderRadius: 4, padding: 18 }}>
            <div style={{ fontSize: 11, color: c.textDim, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Entregas por mes</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 90, borderBottom: `1px solid ${c.border}`, paddingBottom: 4 }}>
              {[42, 58, 53, 67, 74, 71, 88, 82].map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: '100%', height: v, background: i === 7 ? c.orange : c.navy, opacity: i === 7 ? 1 : 0.8 }}/>
                  <div style={{ fontSize: 9, color: c.textDim, fontFamily: M }}>{['OCT','NOV','DIC','ENE','FEB','MAR','ABR','MAY'][i]}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: c.textDim, marginTop: 12, fontFamily: M }}>
              Tendencia: <span style={{ color: c.green }}>+31% en 8 meses</span>
            </div>
          </div>
          <div style={{ background: c.navy, color: '#fff', borderRadius: 4, padding: 18 }}>
            <div style={{ fontSize: 11, opacity: 0.6, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>BASC · Alerta</div>
            <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.45, marginBottom: 14 }}>
              2 movimientos terceros sin foto de sello de seguridad. Evidencia pendiente antes de cierre.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ padding: '8px 12px', background: c.orange, color: '#fff', fontSize: 11.5, fontWeight: 600, borderRadius: 3 }}>Ver pendientes</div>
              <div style={{ padding: '8px 12px', border: '1px solid rgba(255,255,255,0.2)', fontSize: 11.5, borderRadius: 3 }}>Notificar conductor</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LineasDashboard, FletesXDashboard });
