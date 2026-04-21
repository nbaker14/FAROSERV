// FAROSERV site sections

function Nav() {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h);
  }, []);
  const link = { color: BRAND.text, textDecoration: 'none', fontSize: 13, letterSpacing: '0.04em', opacity: 0.75, transition: 'opacity .15s' };
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      padding: '18px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(11,13,18,0.78)' : 'transparent',
      backdropFilter: scrolled ? 'blur(14px)' : 'none',
      borderBottom: scrolled ? `1px solid ${BRAND.line}` : '1px solid transparent',
      transition: 'all .2s',
    }}>
      <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: BRAND.text }}>
        <PulseMark size={28} />
        <span style={{ fontWeight: 600, fontSize: 16, letterSpacing: '-0.01em' }}>FAROSERV</span>
      </a>
      <div style={{ display: 'flex', gap: 36 }}>
        <a href="#modelo" style={link} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0.75}>Modelo</a>
        <a href="#productos" style={link} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0.75}>Productos</a>
        <a href="#proceso" style={link} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0.75}>Proceso</a>
        <a href="#contacto" style={link} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0.75}>Contacto</a>
      </div>
      <a href="https://wa.me/593998055872?text=Hola%20FAROSERV%2C%20me%20interesar%C3%ADa%20conversar%20sobre%20un%20proyecto%20nuevo" target="_blank" rel="noreferrer" style={{
        textDecoration: 'none', color: BRAND.ink, background: BRAND.amber,
        padding: '10px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600, letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
      }}>Hablemos →</a>
    </nav>
  );
}

function Hero() {
  return (
    <section id="top" style={{
      minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.15fr 1fr',
      alignItems: 'center', padding: '120px 48px 80px', gap: 60, position: 'relative',
    }}>
      <div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 14px',
          border: `1px solid ${BRAND.lineStrong}`, borderRadius: 999, fontSize: 12,
          color: BRAND.textDim, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 32,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: BRAND.amber }}/>
          Estudio de tecnología · Ecuador
        </div>
        <h1 style={{
          fontSize: 'clamp(48px, 6vw, 84px)', fontWeight: 600, letterSpacing: '-0.035em',
          lineHeight: 0.98, margin: 0, color: BRAND.text, textWrap: 'balance',
        }}>
          Guiando el futuro<br/>por medio de<br/>
          <span style={{ fontStyle: 'italic', fontWeight: 400, color: BRAND.amber }}>tecnología.</span>
        </h1>
        <p style={{
          marginTop: 28, fontSize: 19, lineHeight: 1.55, color: BRAND.textDim,
          maxWidth: 520, textWrap: 'pretty',
        }}>
          Construimos apps y plataformas a medida para empresas, y operamos nuestros propios productos SaaS. Trabajamos codo a codo con cada cliente, en ciclos mensuales, sin presupuestos infinitos.
        </p>
        <div style={{ marginTop: 40, display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href="#productos" style={{
            textDecoration: 'none', color: BRAND.ink, background: BRAND.text,
            padding: '14px 26px', borderRadius: 999, fontSize: 14, fontWeight: 600,
          }}>Ver lo que hacemos</a>
          <a href="#modelo" style={{
            textDecoration: 'none', color: BRAND.text, padding: '14px 6px',
            fontSize: 14, fontWeight: 500, borderBottom: `1px solid ${BRAND.lineStrong}`,
          }}>Cómo trabajamos →</a>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <PulseAnimated size={440} />
      </div>
      <div style={{
        position: 'absolute', bottom: 28, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 11, color: BRAND.textFaint, letterSpacing: '0.18em', textTransform: 'uppercase',
      }}>
        <span>FAROSERV · 2026</span>
        <span>B2B · LATAM</span>
        <span>Guayaquil · Quito</span>
      </div>
    </section>
  );
}

function Model() {
  const pillars = [
    { k: 'Sin presupuestos gigantes', v: 'Se acabaron los proyectos de seis cifras que terminan en features que nunca se usan.' },
    { k: 'Planes mensuales', v: 'Un fee predecible cubre diseño, desarrollo, infraestructura y soporte continuo.' },
    { k: 'Construimos contigo', v: 'Iteramos al lado de tu equipo. Escuchamos el cambio y lo implementamos en semanas.' },
    { k: 'Producto que evoluciona', v: 'El software se adapta al uso real. Sin volver a cotizar cada mejora.' },
  ];
  return (
    <section id="modelo" style={{ padding: '140px 48px', borderTop: `1px solid ${BRAND.line}` }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: BRAND.amber, marginBottom: 18 }}>
            El modelo
          </div>
          <h2 style={{
            fontSize: 'clamp(36px, 3.6vw, 52px)', fontWeight: 500, letterSpacing: '-0.025em',
            lineHeight: 1.02, margin: 0, color: BRAND.text,
          }}>
            Un servicio continuo, no un proyecto cerrado.
          </h2>
          <p style={{ marginTop: 22, fontSize: 16, lineHeight: 1.55, color: BRAND.textDim, textWrap: 'pretty' }}>
            El software ya no se entrega y se olvida. Diseñamos la relación para que el producto siga vivo, con un plan mensual que hace sentido para el cliente y para nuestro equipo.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: BRAND.line, border: `1px solid ${BRAND.line}` }}>
          {pillars.map((p, i) => (
            <div key={i} style={{ background: BRAND.ink, padding: '36px 32px', minHeight: 200 }}>
              <div style={{ fontSize: 11, color: BRAND.textFaint, letterSpacing: '0.18em', marginBottom: 20, fontFamily: '"JetBrains Mono", monospace' }}>
                0{i+1}
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, color: BRAND.text, letterSpacing: '-0.015em', marginBottom: 10 }}>
                {p.k}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: BRAND.textDim }}>
                {p.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProduct({ p, reverse }) {
  const [hover, setHover] = React.useState(false);
  const Mockup = p.mockup ? window[p.mockup] : null;
  const isPublic = p.category === 'Plataforma pública';
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 0,
      background: BRAND.panel, border: `1px solid ${BRAND.line}`,
      direction: reverse ? 'rtl' : 'ltr',
    }}>
      <div style={{ padding: '44px 40px', direction: 'ltr', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <div style={{
              fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '5px 10px',
              border: `1px solid ${BRAND.line}`, color: BRAND.textDim, borderRadius: 3,
              fontFamily: '"JetBrains Mono", monospace',
            }}>{p.category}</div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: BRAND.textDim,
              fontFamily: '"JetBrains Mono", monospace',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: p.color, boxShadow: `0 0 10px ${p.color}` }}/>
              {p.badge}
            </div>
          </div>
          <div style={{ fontSize: 11, color: BRAND.textFaint, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
            {p.industry}
          </div>
          <div style={{ fontSize: 42, fontWeight: 600, letterSpacing: '-0.025em', color: BRAND.text, marginBottom: 8, lineHeight: 1 }}>
            {p.name}
          </div>
          <div style={{ fontSize: 15, color: BRAND.textDim, marginBottom: 22 }}>{p.tagline}</div>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: BRAND.textDim, margin: 0, textWrap: 'pretty' }}>
            {p.description}
          </p>
        </div>
        {isPublic ? (
          <a href={`https://${p.url}`} target="_blank" rel="noreferrer"
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
            style={{
              marginTop: 32, display: 'inline-flex', alignItems: 'center', gap: 10,
              textDecoration: 'none', color: BRAND.amber, fontSize: 14, fontWeight: 500,
              fontFamily: '"JetBrains Mono", monospace', alignSelf: 'flex-start',
              borderBottom: `1px solid ${hover ? BRAND.amber : 'transparent'}`, paddingBottom: 3,
              transition: 'border-color .15s',
            }}>
            {p.url}
            <span style={{ transform: hover ? 'translateX(3px)' : 'none', transition: 'transform .15s' }}>↗</span>
          </a>
        ) : (
          <div style={{
            marginTop: 32, fontSize: 12, color: BRAND.textFaint,
            fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.08em',
            textTransform: 'uppercase', alignSelf: 'flex-start',
          }}>
            Plataforma privada · {p.url}
          </div>
        )}
      </div>
      <div style={{
        direction: 'ltr', background: '#0A0C11', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400,
        borderLeft: reverse ? 'none' : `1px solid ${BRAND.line}`,
        borderRight: reverse ? `1px solid ${BRAND.line}` : 'none',
      }}>
        {p.screenshot && (
          <img src={p.screenshot} alt={`${p.name} dashboard`}
            style={{ width: '92%', height: 'auto', borderRadius: 4, boxShadow: '0 18px 50px rgba(0,0,0,.4)' }} />
        )}
        {Mockup && (
          <div style={{
            width: '92%', aspectRatio: '1100 / 720', borderRadius: 4, overflow: 'hidden',
            boxShadow: '0 18px 50px rgba(0,0,0,.4)', position: 'relative', background: '#fff',
          }}>
            <div style={{
              width: 1100, height: 720, transform: 'scale(var(--mk-scale))', transformOrigin: '0 0',
              position: 'absolute', top: 0, left: 0,
            }} ref={(el) => {
              if (!el) return;
              const ro = new ResizeObserver(() => {
                const w = el.parentElement.clientWidth;
                el.style.setProperty('--mk-scale', (w / 1100));
              });
              ro.observe(el.parentElement);
              el.style.setProperty('--mk-scale', (el.parentElement.clientWidth / 1100));
            }}>
              <Mockup />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ p }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: BRAND.panel, border: `1px solid ${hover ? BRAND.lineStrong : BRAND.line}`,
        padding: '36px 32px 32px', position: 'relative', transition: 'all .2s',
        transform: hover ? 'translateY(-3px)' : 'translateY(0)',
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <div style={{
          fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '5px 10px',
          border: `1px solid ${BRAND.line}`, color: BRAND.textDim, borderRadius: 3,
          fontFamily: '"JetBrains Mono", monospace',
        }}>{p.category}</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: BRAND.textDim,
          fontFamily: '"JetBrains Mono", monospace',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: p.color,
            boxShadow: `0 0 10px ${p.color}` }}/>
          {p.badge}
        </div>
      </div>
      <div style={{ fontSize: 11, color: BRAND.textFaint, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
        {p.industry}
      </div>
      <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: BRAND.text, marginBottom: 6 }}>
        {p.name}
      </div>
      <div style={{ fontSize: 13, color: BRAND.textDim, marginBottom: 20 }}>{p.tagline}</div>
      <p style={{ fontSize: 14, lineHeight: 1.55, color: BRAND.textDim, margin: 0, minHeight: 86, textWrap: 'pretty' }}>
        {p.description}
      </p>
      <div style={{
        marginTop: 24, paddingTop: 20, borderTop: `1px solid ${BRAND.line}`,
        fontSize: 12, color: BRAND.textFaint, fontFamily: '"JetBrains Mono", monospace',
      }}>
        {p.url}
      </div>
    </div>
  );
}

function Products() {
  return (
    <section id="productos" style={{ padding: '140px 48px', borderTop: `1px solid ${BRAND.line}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60, gap: 40, flexWrap: 'wrap' }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: BRAND.amber, marginBottom: 18 }}>
            Productos
          </div>
          <h2 style={{
            fontSize: 'clamp(36px, 3.6vw, 52px)', fontWeight: 500, letterSpacing: '-0.025em',
            lineHeight: 1.02, margin: 0, color: BRAND.text, textWrap: 'balance',
          }}>
            Software propio y software a medida.
          </h2>
          <p style={{ marginTop: 22, fontSize: 16, lineHeight: 1.55, color: BRAND.textDim, textWrap: 'pretty' }}>
            Operamos plataformas que vendemos directamente al mercado y construimos soluciones privadas para cada cliente. Todas las soluciones B2B.
          </p>
        </div>
        <div style={{
          display: 'flex', gap: 22, fontSize: 12, color: BRAND.textDim,
          fontFamily: '"JetBrains Mono", monospace',
        }}>
          <div>
            <div style={{ color: BRAND.text, fontSize: 22, fontWeight: 600, fontFamily: 'inherit' }}>2</div>
            <div style={{ letterSpacing: '0.08em' }}>PÚBLICOS</div>
          </div>
          <div>
            <div style={{ color: BRAND.text, fontSize: 22, fontWeight: 600, fontFamily: 'inherit' }}>2</div>
            <div style={{ letterSpacing: '0.08em' }}>A MEDIDA</div>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 56 }}>
        <div style={{ fontSize: 11, color: BRAND.textFaint, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 20, fontFamily: '"JetBrains Mono", monospace' }}>
          — Productos propios
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {PRODUCTS.filter(p => p.category === 'Plataforma pública').map((p, i) => (
            <FeaturedProduct key={p.id} p={p} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: BRAND.textFaint, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 20, fontFamily: '"JetBrains Mono", monospace' }}>
          — Soluciones privadas para clientes
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 24 }}>
          {PRODUCTS.filter(p => p.category === 'A medida' && p.mockup).map((p, i) => (
            <FeaturedProduct key={p.id} p={p} reverse={i % 2 === 0} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 1, background: BRAND.line, border: `1px solid ${BRAND.line}` }}>
          {PRODUCTS.filter(p => p.category === 'A medida' && !p.mockup).map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="proceso" style={{ padding: '140px 48px', borderTop: `1px solid ${BRAND.line}`, background: BRAND.panelWarm }}>
      <div style={{ maxWidth: 900, marginBottom: 60 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: BRAND.amber, marginBottom: 18 }}>
          Proceso
        </div>
        <h2 style={{
          fontSize: 'clamp(36px, 3.6vw, 52px)', fontWeight: 500, letterSpacing: '-0.025em',
          lineHeight: 1.02, margin: 0, color: BRAND.text, textWrap: 'balance',
        }}>
          Construir juntos, escuchar siempre.
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
        {PROCESS.map((s, i) => (
          <div key={i} style={{ borderTop: `1px solid ${BRAND.lineStrong}`, paddingTop: 28 }}>
            <div style={{
              fontSize: 12, color: BRAND.amber, fontFamily: '"JetBrains Mono", monospace',
              letterSpacing: '0.1em', marginBottom: 28,
            }}>{s.step}</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: BRAND.text, letterSpacing: '-0.015em', marginBottom: 14 }}>
              {s.title}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.55, color: BRAND.textDim, textWrap: 'pretty' }}>
              {s.body}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contacto" style={{ padding: '140px 48px 100px', borderTop: `1px solid ${BRAND.line}` }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: BRAND.amber, marginBottom: 18 }}>
            Contacto
          </div>
          <h2 style={{
            fontSize: 'clamp(44px, 5vw, 72px)', fontWeight: 500, letterSpacing: '-0.03em',
            lineHeight: 0.98, margin: 0, color: BRAND.text, textWrap: 'balance',
          }}>
            ¿Tienes una idea o un problema que resolver?
          </h2>
          <p style={{ marginTop: 22, fontSize: 17, lineHeight: 1.55, color: BRAND.textDim, textWrap: 'pretty', maxWidth: 480 }}>
            Conversemos sobre el problema. En pocos días te decimos si encajamos, qué alcance tiene y qué plan mensual tiene sentido.
          </p>
        </div>
        <div style={{
          background: BRAND.panel, border: `1px solid ${BRAND.line}`, padding: 40,
        }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: BRAND.textFaint, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
              Escríbenos
            </div>
            <a href="mailto:ventas@faroserv.com" style={{
              fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', color: BRAND.text,
              textDecoration: 'none', borderBottom: `1px solid ${BRAND.lineStrong}`, paddingBottom: 2,
            }}>ventas@faroserv.com</a>
          </div>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: BRAND.textFaint, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
              WhatsApp
            </div>
            <div style={{ fontSize: 18, color: BRAND.text, fontFamily: '"JetBrains Mono", monospace' }}>
              +593 99 805 5872
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: BRAND.textFaint, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
              Oficina
            </div>
            <div style={{ fontSize: 15, color: BRAND.text, lineHeight: 1.55 }}>
              Guayaquil, Ecuador<br/>
              <span style={{ color: BRAND.textDim }}>Trabajamos remoto con clientes en toda LATAM.</span>
            </div>
          </div>
          <a href="https://wa.me/593998055872?text=Hola%20FAROSERV%2C%20me%20interesar%C3%ADa%20conversar%20sobre%20un%20proyecto%20nuevo" target="_blank" rel="noreferrer" style={{
            marginTop: 36, display: 'inline-flex', alignItems: 'center', gap: 10,
            textDecoration: 'none', color: BRAND.ink, background: BRAND.amber,
            padding: '14px 24px', borderRadius: 999, fontSize: 14, fontWeight: 600,
          }}>Agendar una conversación →</a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      padding: '48px', borderTop: `1px solid ${BRAND.line}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: 12, color: BRAND.textFaint, letterSpacing: '0.08em',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <PulseMark size={22} color={BRAND.textDim} accent={BRAND.amber}/>
        <span>FAROSERV © 2026</span>
      </div>
      <span style={{ textTransform: 'uppercase' }}>Guiando el futuro por medio de tecnología</span>
      <span style={{ fontFamily: '"JetBrains Mono", monospace' }}>v.2026.04</span>
    </footer>
  );
}

Object.assign(window, { Nav, Hero, Model, Products, Process, Contact, Footer });
