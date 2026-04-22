// Initialize Supabase client
(function() {
  var cfg = window.LINEAS_CONFIG;
  window.db = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
})();
