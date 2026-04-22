// JotForm API wrapper
window.JotForm = (function() {
  var API_KEY = '44b5fb661f8b3763953b2e75d1033014';
  var FORM_ID = '210397942899070';
  var BASE = 'https://api.jotform.com';

  // Field mapping from form question IDs to readable names
  var FIELDS = {
    marca: '3',
    ciudad: '7',
    cliente: '8',
    tecnico: '11',
    notas: '18',
    trabajoPendiente: '22',
    trabajoRealizado: '25',
    capacidadTanque: '31',
  };

  function getAnswer(answers, fieldId) {
    var a = answers[fieldId];
    if (!a) return '';
    // Some fields store answer as .answer, others as .prettyFormat
    return a.prettyFormat || a.answer || '';
  }

  function parseSubmission(sub) {
    var a = sub.answers || {};
    return {
      id: sub.id,
      created_at: sub.created_at,
      cliente: getAnswer(a, FIELDS.cliente),
      ciudad: getAnswer(a, FIELDS.ciudad),
      marca: getAnswer(a, FIELDS.marca),
      tecnico: getAnswer(a, FIELDS.tecnico),
      trabajoRealizado: getAnswer(a, FIELDS.trabajoRealizado),
      notas: getAnswer(a, FIELDS.notas),
      trabajoPendiente: getAnswer(a, FIELDS.trabajoPendiente),
      capacidadTanque: getAnswer(a, FIELDS.capacidadTanque),
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
    // JotForm filter: search by client name (field 8)
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
    FIELDS: FIELDS,
    fetchSubmissions: fetchSubmissions,
    searchSubmissions: searchSubmissions,
    parseSubmission: parseSubmission,
  };
})();
