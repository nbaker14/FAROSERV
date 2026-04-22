// JotForm API wrapper — full field extraction including photos + geo
window.JotForm = (function() {
  var API_KEY = '44b5fb661f8b3763953b2e75d1033014';
  var FORM_ID = '210397942899070';
  var BASE = 'https://api.jotform.com';

  // Cache the total submission count
  var _cachedTotal = null;

  function getAnswer(answers, fieldId) {
    var a = answers[fieldId];
    if (!a) return '';
    return a.prettyFormat || a.answer || '';
  }

  // Parse geo stamp text into structured object
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

    // Photos — extract URLs
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
      if (val) {
        photos.push({ label: pf.label, url: val });
      }
    }

    // Geo location — parse from geo stamp (field 16 or 74)
    var geoRaw = getAnswer(a, '16') || getAnswer(a, '74');
    var geo = parseGeo(geoRaw);

    // Coordinates from field 75
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

  // Get total submission count from the form endpoint (cached)
  function getTotalCount() {
    if (_cachedTotal !== null) {
      return Promise.resolve(_cachedTotal);
    }
    return fetch(BASE + '/form/' + FORM_ID + '?apiKey=' + API_KEY)
      .then(function(r) { return r.json(); })
      .then(function(json) {
        _cachedTotal = parseInt(json.content.count) || 0;
        return _cachedTotal;
      });
  }

  function fetchSubmissions(offset, limit) {
    offset = offset || 0;
    limit = limit || 50;
    var url = BASE + '/form/' + FORM_ID + '/submissions'
      + '?apiKey=' + API_KEY
      + '&limit=' + limit
      + '&offset=' + offset
      + '&orderby=created_at,DESC';

    return Promise.all([
      fetch(url).then(function(r) { return r.json(); }),
      getTotalCount(),
    ]).then(function(results) {
      var json = results[0];
      var totalCount = results[1];
      var content = json.content || [];
      return {
        submissions: content.map(parseSubmission),
        total: totalCount,
      };
    });
  }

  function searchSubmissions(term, offset, limit) {
    offset = offset || 0;
    limit = limit || 50;
    var filter = encodeURIComponent(JSON.stringify({ '8:contains': term }));
    var url = BASE + '/form/' + FORM_ID + '/submissions'
      + '?apiKey=' + API_KEY
      + '&limit=' + limit
      + '&offset=' + offset
      + '&orderby=created_at,DESC'
      + '&filter=' + filter;

    return fetch(url)
      .then(function(r) { return r.json(); })
      .then(function(json) {
        var content = json.content || [];
        // For search, we don't know the true total — if we got a full page,
        // there are probably more. Use a high estimate so pagination shows.
        var hasMore = content.length >= limit;
        var estimatedTotal = hasMore ? offset + limit + limit : offset + content.length;
        return {
          submissions: content.map(parseSubmission),
          total: estimatedTotal,
        };
      });
  }

  return {
    fetchSubmissions: fetchSubmissions,
    searchSubmissions: searchSubmissions,
    parseSubmission: parseSubmission,
    getTotalCount: getTotalCount,
  };
})();
