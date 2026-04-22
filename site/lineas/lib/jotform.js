// JotForm API wrapper — full field extraction including photos + geo
window.JotForm = (function() {
  var API_KEY = '44b5fb661f8b3763953b2e75d1033014';
  var FORM_ID = '210397942899070';
  var BASE = 'https://api.jotform.com';

  var _cachedTotal = null;

  function getAnswer(answers, fieldId) {
    var a = answers[fieldId];
    if (!a) return '';
    return a.prettyFormat || a.answer || '';
  }

  function parseGeo(raw) {
    if (!raw) return null;
    var lines = raw.split('\n');
    var geo = {};
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;
      var parts = line.split(':');
      if (parts.length < 2) continue;
      var key = parts[0].trim().toLowerCase().replace(/\s+/g, '_');
      var val = parts.slice(1).join(':').trim();
      geo[key] = val;
    }
    return geo;
  }

  function parseSubmission(sub) {
    var a = sub.answers || {};

    var photos = [];
    var photoFields = [
      { id: '17', label: 'Reporte firmado' },
      { id: '26', label: 'Tanque CO2' },
      { id: '32', label: 'Regulador CO2' },
      { id: '67', label: 'Temperatura chiller' },
    ];
    for (var i = 0; i < photoFields.length; i++) {
      var pf = photoFields[i];
      var val = getAnswer(a, pf.id);
      if (val) photos.push({ label: pf.label, url: val });
    }

    var geoRaw = getAnswer(a, '16') || getAnswer(a, '74');
    var geo = parseGeo(geoRaw);
    var coordsRaw = getAnswer(a, '75');
    if (coordsRaw && !geo) geo = {};
    if (coordsRaw && geo) {
      var latMatch = coordsRaw.match(/Latitude:\s*([-\d.]+)/);
      var lngMatch = coordsRaw.match(/Longitude:\s*([-\d.]+)/);
      if (latMatch) geo.latitude = latMatch[1];
      if (lngMatch) geo.longitude = lngMatch[1];
    }

    return {
      id: sub.id,
      created_at: sub.created_at,
      cliente: getAnswer(a, '8'),
      ciudad: getAnswer(a, '7'),
      marca: getAnswer(a, '3'),
      tecnico: getAnswer(a, '11'),
      trabajoRealizado: getAnswer(a, '25'),
      notas: getAnswer(a, '18'),
      trabajoPendiente: getAnswer(a, '22'),
      capacidadTanque: getAnswer(a, '31'),
      photos: photos,
      geo: geo,
    };
  }

  function getTotalCount() {
    if (_cachedTotal !== null) return Promise.resolve(_cachedTotal);
    return fetch(BASE + '/form/' + FORM_ID + '?apiKey=' + API_KEY)
      .then(function(r) { return r.json(); })
      .then(function(json) {
        _cachedTotal = parseInt(json.content.count) || 0;
        return _cachedTotal;
      });
  }

  // Build filter object from dropdown filters
  // JotForm uses "q" + fieldId for exact match (case insensitive)
  function buildFilter(filters) {
    var f = {};
    if (filters.ciudad) f.q7 = filters.ciudad;
    if (filters.marca) f.q3 = filters.marca;
    if (filters.trabajo) f.q25 = filters.trabajo;
    if (filters.tecnico) f.q11 = filters.tecnico;
    if (Object.keys(f).length === 0) return '';
    return '&filter=' + encodeURIComponent(JSON.stringify(f));
  }

  function fetchSubmissions(offset, limit, filters) {
    offset = offset || 0;
    limit = limit || 50;
    filters = filters || {};
    var filterStr = buildFilter(filters);
    var url = BASE + '/form/' + FORM_ID + '/submissions'
      + '?apiKey=' + API_KEY
      + '&limit=' + limit
      + '&offset=' + offset
      + '&orderby=created_at,DESC'
      + filterStr;

    var promises = [
      fetch(url).then(function(r) { return r.json(); }),
    ];
    // Only fetch total when no filters are applied
    if (!filterStr) {
      promises.push(getTotalCount());
    }

    return Promise.all(promises).then(function(results) {
      var json = results[0];
      var content = json.content || [];
      var subs = content.map(parseSubmission);
      // When filtering, we estimate total: if full page returned, there's more
      var total;
      if (filterStr) {
        total = content.length < limit ? offset + content.length : offset + limit + limit;
      } else {
        total = results[1]; // cached total
      }
      return { submissions: subs, total: total };
    });
  }

  return {
    fetchSubmissions: fetchSubmissions,
    parseSubmission: parseSubmission,
    getTotalCount: getTotalCount,
  };
})();
