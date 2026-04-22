// JotForm API wrapper — full field extraction including photos + geo
window.JotForm = (function() {
  var API_KEY = '44b5fb661f8b3763953b2e75d1033014';
  var FORM_ID = '210397942899070';
  var BASE = 'https://api.jotform.com';

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

  function fetchSubmissions(offset, limit) {
    offset = offset || 0;
    limit = limit || 20;
    var url = BASE + '/form/' + FORM_ID + '/submissions'
      + '?apiKey=' + API_KEY
      + '&limit=' + limit
      + '&offset=' + offset
      + '&orderby=created_at,DESC';

    return fetch(url)
      .then(function(r) { return r.json(); })
      .then(function(json) {
        var content = json.content || [];
        return {
          submissions: content.map(parseSubmission),
          total: json.resultSet ? json.resultSet.count : content.length,
        };
      });
  }

  function searchSubmissions(term, offset, limit) {
    offset = offset || 0;
    limit = limit || 20;
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
        return {
          submissions: content.map(parseSubmission),
          total: json.resultSet ? json.resultSet.count : content.length,
        };
      });
  }

  return {
    fetchSubmissions: fetchSubmissions,
    searchSubmissions: searchSubmissions,
    parseSubmission: parseSubmission,
  };
})();
