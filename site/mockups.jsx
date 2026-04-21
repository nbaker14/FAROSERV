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

function SaludDashboard() {
  const c = {
    bg: '#F4F6F5', ink: '#0F1F1C', border: '#DCE3E0', textDim: '#6B7673',
    green: '#2F7D5F', amber: '#D4921A', red: '#B23F2E', blue: '#2E5F8C',
    panel: '#fff',
  };
  const F = `"Space Grotesk", sans-serif`;
  const M = `"JetBrains Mono", monospace`;
  const records = [
    { name: 'María Fernanda Álava', dept: 'Producción', exam: 'Audiometría', status: 'vigente', exp: '14 oct 2026', risk: 'bajo' },
    { name: 'Carlos Jiménez Ruiz', dept: 'Planta', exam: 'Espirometría', status: 'vence-pronto', exp: '02 may 2026', risk: 'medio' },
    { name: 'Andrea Cevallos M.', dept: 'Logística', exam: 'Visual', status: 'vigente', exp: '22 nov 2026', risk: 'bajo' },
    { name: 'José Luis Moreira', dept: 'Producción', exam: 'Preempleo', status: 'vencido', exp: '08 abr 2026', risk: 'alto' },
    { name: 'Patricia Zambrano V.', dept: 'Administración', exam: 'Anual', status: 'vigente', exp: '18 sep 2026', risk: 'bajo' },
    { name: 'Freddy Mendoza C.', dept: 'Bodega', exam: 'Trabajo en altura', status: 'vence-pronto', exp: '29 abr 2026', risk: 'medio' },
  ];
  const sColor = { vigente: c.green, 'vence-pronto': c.amber, vencido: c.red };
  const sLabel = { vigente: 'VIGENTE', 'vence-pronto': 'VENCE PRONTO', vencido: 'VENCIDO' };

  return (
    <div style={{ width: 1100, height: 720, background: c.bg, fontFamily: F, color: c.ink, position: 'relative', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 200, background: '#fff', borderRight: `1px solid ${c.border}`, padding: '22px 0' }}>
        <div style={{ padding: '0 22px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="10" fill="none" stroke={c.ink} strokeWidth="1" opacity="0.3"/><circle cx="11" cy="11" r="6" fill="none" stroke={c.ink} strokeWidth="1.2" opacity="0.6"/><circle cx="11" cy="11" r="2.5" fill={c.green}/></svg>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>Salud OK</div>
        </div>
        {[
          { l: 'Panel general', active: true },
          { l: 'Empleados' },
          { l: 'Exámenes' },
          { l: 'Vencimientos' },
          { l: 'Accidentalidad' },
          { l: 'Cumplimiento' },
          { l: 'Reportes' },
        ].map((m, i) => (
          <div key={i} style={{
            padding: '10px 22px', fontSize: 13, color: m.active ? c.ink : c.textDim,
            background: m.active ? c.bg : 'transparent',
            borderLeft: m.active ? `2px solid ${c.green}` : '2px solid transparent',
            fontWeight: m.active ? 600 : 400,
          }}>{m.l}</div>
        ))}
        <div style={{ position: 'absolute', bottom: 18, left: 22, right: 22, fontSize: 10.5, color: c.textDim, fontFamily: M, lineHeight: 1.5 }}>
          EMPRESA<br/>
          <span style={{ color: c.ink, fontWeight: 500, fontSize: 11 }}>Industrias del Litoral S.A.</span>
        </div>
      </div>
      {/* Main */}
      <div style={{ marginLeft: 200, padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 11, color: c.textDim, letterSpacing: '0.2em', fontFamily: M, marginBottom: 6 }}>PANEL GENERAL · ABRIL 2026</div>
            <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em' }}>Salud Ocupacional</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ padding: '8px 14px', border: `1px solid ${c.border}`, fontSize: 12, background: '#fff', borderRadius: 4 }}>Abril 2026 ▾</div>
            <div style={{ padding: '8px 14px', background: c.ink, color: '#fff', fontSize: 12, borderRadius: 4 }}>Exportar informe</div>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
          {[
            { k: 'Empleados activos', v: '428' },
            { k: 'Exámenes vigentes', v: '87%', color: c.green },
            { k: 'Por vencer (30d)', v: '34', color: c.amber },
            { k: 'Vencidos', v: '12', color: c.red },
          ].map((k, i) => (
            <div key={i} style={{ background: '#fff', border: `1px solid ${c.border}`, padding: '16px 18px', borderRadius: 4 }}>
              <div style={{ fontSize: 10.5, color: c.textDim, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{k.k}</div>
              <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', color: k.color || c.ink, lineHeight: 1 }}>{k.v}</div>
            </div>
          ))}
        </div>

        {/* Compliance ring + accidentality */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 10, marginBottom: 14 }}>
          <div style={{ background: '#fff', border: `1px solid ${c.border}`, padding: 18, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 18 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke={c.border} strokeWidth="10"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke={c.green} strokeWidth="10"
                strokeDasharray={`${0.87 * 2 * Math.PI * 40} ${2 * Math.PI * 40}`}
                strokeDashoffset={0} strokeLinecap="butt" transform="rotate(-90 50 50)"/>
              <text x="50" y="48" textAnchor="middle" fontFamily={F} fontSize="22" fontWeight="600" fill={c.ink}>87%</text>
              <text x="50" y="62" textAnchor="middle" fontFamily={M} fontSize="8" fill={c.textDim} letterSpacing="1">COMPLIANCE</text>
            </svg>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Cumplimiento general</div>
              <div style={{ fontSize: 11.5, color: c.textDim, lineHeight: 1.5 }}>
                372 de 428 empleados con exámenes vigentes. Meta: 95%.
              </div>
            </div>
          </div>
          <div style={{ background: '#fff', border: `1px solid ${c.border}`, padding: 18, borderRadius: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: c.textDim, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Accidentalidad por mes</div>
              <div style={{ fontSize: 11, color: c.green, fontFamily: M }}>−40% vs. 2025</div>
            </div>
            <svg width="100%" height="90" viewBox="0 0 400 90" preserveAspectRatio="none">
              <polyline fill="none" stroke={c.blue} strokeWidth="1.8"
                points="0,30 50,42 100,38 150,55 200,48 250,62 300,58 350,72 400,68"/>
              <polyline fill={c.blue} fillOpacity="0.08" stroke="none"
                points="0,30 50,42 100,38 150,55 200,48 250,62 300,58 350,72 400,68 400,90 0,90"/>
              {[30,42,38,55,48,62,58,72,68].map((y,i)=>(<circle key={i} cx={i*50} cy={y} r="2.5" fill={c.blue}/>))}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: c.textDim, fontFamily: M, marginTop: 6 }}>
              {['AGO','SEP','OCT','NOV','DIC','ENE','FEB','MAR','ABR'].map(m => <span key={m}>{m}</span>)}
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', border: `1px solid ${c.border}`, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: `1px solid ${c.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Exámenes próximos a vencer</div>
            <div style={{ fontSize: 11, color: c.textDim, fontFamily: M }}>34 registros · vista resumida</div>
          </div>
          <div style={{ padding: '10px 18px', display: 'grid', gridTemplateColumns: '1.6fr 1fr 1.1fr 1fr 0.8fr 0.9fr', gap: 10, fontSize: 10, color: c.textDim, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: M, borderBottom: `1px solid ${c.border}` }}>
            <span>Empleado</span><span>Departamento</span><span>Examen</span><span>Vence</span><span>Riesgo</span><span style={{textAlign:'right'}}>Estado</span>
          </div>
          {records.map((r, i) => (
            <div key={i} style={{
              padding: '12px 18px', display: 'grid', gridTemplateColumns: '1.6fr 1fr 1.1fr 1fr 0.8fr 0.9fr', gap: 10,
              fontSize: 12.5, alignItems: 'center', borderBottom: i < records.length - 1 ? `1px solid ${c.border}` : 'none',
            }}>
              <span style={{ fontWeight: 500 }}>{r.name}</span>
              <span style={{ color: c.textDim }}>{r.dept}</span>
              <span>{r.exam}</span>
              <span style={{ fontFamily: M, color: c.textDim, fontSize: 11.5 }}>{r.exp}</span>
              <span style={{ fontSize: 10.5, fontFamily: M, textTransform: 'uppercase', letterSpacing: '0.08em',
                color: r.risk === 'alto' ? c.red : r.risk === 'medio' ? c.amber : c.textDim }}>{r.risk}</span>
              <span style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'inline-block', padding: '3px 8px', borderRadius: 2,
                  background: sColor[r.status] + '22', color: sColor[r.status],
                  fontSize: 9.5, fontFamily: M, letterSpacing: '0.1em', fontWeight: 600,
                }}>{sLabel[r.status]}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LineasDashboard, SaludDashboard });
