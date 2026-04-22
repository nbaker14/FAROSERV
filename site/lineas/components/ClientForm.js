// ClientForm — create/edit client
(function() {
  var h = htm.bind(React.createElement);

  function ClientForm(props) {
    var clientId = props.clientId;
    var onClose = props.onClose;
    var onSave = props.onSave;

    var loading = React.useState(!!clientId), setLoading = loading[1]; loading = loading[0];
    var saving = React.useState(false), setSaving = saving[1]; saving = saving[0];
    var techs = React.useState([]), setTechs = techs[1]; techs = techs[0];

    var name = React.useState(''), setName = name[1]; name = name[0];
    var city = React.useState(''), setCity = city[1]; city = city[0];
    var address = React.useState(''), setAddress = address[1]; address = address[0];
    var contactName = React.useState(''), setContactName = contactName[1]; contactName = contactName[0];
    var contactPhone = React.useState(''), setContactPhone = contactPhone[1]; contactPhone = contactPhone[0];
    var frequency = React.useState(14), setFrequency = frequency[1]; frequency = frequency[0];
    var isEmergency = React.useState(false), setIsEmergency = isEmergency[1]; isEmergency = isEmergency[0];
    var techId = React.useState(''), setTechId = techId[1]; techId = techId[0];
    var notes = React.useState(''), setNotes = notes[1]; notes = notes[0];

    React.useEffect(function() {
      db.from('technicians').select('*').eq('is_active', true).order('name')
        .then(function(res) { setTechs(res.data || []); });

      if (clientId) {
        db.from('clients').select('*').eq('id', clientId).single()
          .then(function(res) {
            if (res.data) {
              var c = res.data;
              setName(c.name || '');
              setCity(c.city || '');
              setAddress(c.address || '');
              setContactName(c.contact_name || '');
              setContactPhone(c.contact_phone || '');
              setFrequency(c.visit_frequency_days || 14);
              setIsEmergency(c.is_emergency || false);
              setTechId(c.assigned_technician_id || '');
              setNotes(c.notes || '');
            }
            setLoading(false);
          });
      }
    }, [clientId]);

    function handleSubmit(e) {
      e.preventDefault();
      if (!name.trim() || !city.trim()) return;
      setSaving(true);

      var data = {
        name: name.trim(),
        city: city.trim(),
        address: address.trim() || null,
        contact_name: contactName.trim() || null,
        contact_phone: contactPhone.trim() || null,
        visit_frequency_days: parseInt(frequency) || 14,
        is_emergency: isEmergency,
        assigned_technician_id: techId || null,
        notes: notes.trim() || null,
      };

      var query;
      if (clientId) {
        query = db.from('clients').update(data).eq('id', clientId).select();
      } else {
        query = db.from('clients').insert(data).select();
      }

      query.then(function(res) {
        setSaving(false);
        if (res.error) { alert('Error: ' + res.error.message); return; }
        onSave();
      });
    }

    if (loading) {
      return h`<div class="loading"><div class="spinner" />Cargando...</div>`;
    }

    return h`
      <div>
        <div class="page-header">
          <div>
            <div class="page-header-label">${clientId ? 'EDITAR' : 'NUEVO'}</div>
            <div class="page-header-title">${clientId ? 'Editar cliente' : 'Nuevo cliente'}</div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <form onSubmit=${handleSubmit}>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Nombre del establecimiento *</label>
                  <input class="form-input" type="text" value=${name}
                    onInput=${function(e) { setName(e.target.value); }}
                    placeholder="Ej: Bar La Ronda" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Ciudad *</label>
                  <select class="form-select" value=${city} onChange=${function(e) { setCity(e.target.value); }} required>
                    <option value="">Seleccionar...</option>
                    <option value="Guayaquil">Guayaquil</option>
                    <option value="Quito">Quito</option>
                    <option value="Cuenca">Cuenca</option>
                    <option value="Ambato">Ambato</option>
                    <option value="Manta">Manta</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Direcci\u00f3n</label>
                <input class="form-input" type="text" value=${address}
                  onInput=${function(e) { setAddress(e.target.value); }}
                  placeholder="Calle, n\u00famero, sector..." />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Nombre de contacto</label>
                  <input class="form-input" type="text" value=${contactName}
                    onInput=${function(e) { setContactName(e.target.value); }}
                    placeholder="Nombre del encargado" />
                </div>
                <div class="form-group">
                  <label class="form-label">Tel\u00e9fono de contacto</label>
                  <input class="form-input" type="text" value=${contactPhone}
                    onInput=${function(e) { setContactPhone(e.target.value); }}
                    placeholder="09XXXXXXXX" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">T\u00e9cnico asignado</label>
                  <select class="form-select" value=${techId} onChange=${function(e) { setTechId(e.target.value); }}>
                    <option value="">Sin asignar</option>
                    ${techs.map(function(t) {
                      return h`<option key=${t.id} value=${t.id}>${t.name} — ${t.city}</option>`;
                    })}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Frecuencia de visita</label>
                  <select class="form-select" value=${frequency} onChange=${function(e) { setFrequency(e.target.value); }}>
                    <option value="7">Cada 7 d\u00edas</option>
                    <option value="14">Cada 14 d\u00edas</option>
                    <option value="21">Cada 21 d\u00edas</option>
                    <option value="30">Cada 30 d\u00edas</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-toggle">
                  <input type="checkbox" checked=${isEmergency}
                    onChange=${function(e) { setIsEmergency(e.target.checked); }} />
                  Marcar como emergencia (prioridad alta)
                </label>
              </div>

              <div class="form-group">
                <label class="form-label">Notas</label>
                <textarea class="form-textarea" value=${notes}
                  onInput=${function(e) { setNotes(e.target.value); }}
                  placeholder="Observaciones sobre el cliente..." />
              </div>

              <div style=${{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button class="btn btn-primary" type="submit" disabled=${saving}>
                  ${saving ? 'Guardando...' : clientId ? 'Guardar cambios' : 'Crear cliente'}
                </button>
                <button class="btn btn-outline" type="button" onClick=${onClose}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  window.ClientForm = ClientForm;
})();
