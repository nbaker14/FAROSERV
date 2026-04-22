-- ============================================================
-- BEER LINE MAINTENANCE TRACKER — SCHEMA + SEED DATA
-- Run this entire file in the Supabase SQL Editor.
-- ============================================================

-- ============================================================
-- 1. DROP EXISTING TABLES (clean slate)
-- ============================================================
DROP TABLE IF EXISTS route_stops  CASCADE;
DROP TABLE IF EXISTS routes       CASCADE;
DROP TABLE IF EXISTS visits       CASCADE;
DROP TABLE IF EXISTS beer_lines   CASCADE;
DROP TABLE IF EXISTS clients      CASCADE;
DROP TABLE IF EXISTS technicians  CASCADE;

-- ============================================================
-- 2. CREATE TABLES
-- ============================================================

-- TECHNICIANS
CREATE TABLE technicians (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  city       text        NOT NULL,
  phone      text,
  is_active  boolean     DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- CLIENTS
CREATE TABLE clients (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    text        NOT NULL,
  city                    text        NOT NULL,
  address                 text,
  contact_name            text,
  contact_phone           text,
  visit_frequency_days    integer     DEFAULT 14,
  is_emergency            boolean     DEFAULT false,
  assigned_technician_id  uuid        REFERENCES technicians(id),
  notes                   text,
  is_active               boolean     DEFAULT true,
  created_at              timestamptz DEFAULT now()
);

-- BEER LINES
CREATE TABLE beer_lines (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  line_code  text        UNIQUE NOT NULL,
  client_id  uuid        REFERENCES clients(id) ON DELETE CASCADE,
  beer_brand text        NOT NULL,
  is_active  boolean     DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- VISITS
CREATE TABLE visits (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  beer_line_id           uuid        REFERENCES beer_lines(id),
  technician_id          uuid        REFERENCES technicians(id),
  visit_date             date        NOT NULL,
  next_visit_date        date,
  visit_type             text        DEFAULT 'routine'
                                     CHECK (visit_type IN ('routine','emergency','installation')),
  notes                  text,
  jotform_submission_id  text,
  created_at             timestamptz DEFAULT now()
);

-- ROUTES
CREATE TABLE routes (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  technician_id uuid        REFERENCES technicians(id),
  route_date    date        NOT NULL,
  name          text        NOT NULL,
  status        text        DEFAULT 'planned'
                             CHECK (status IN ('planned','in_progress','completed')),
  created_at    timestamptz DEFAULT now()
);

-- ROUTE STOPS
CREATE TABLE route_stops (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id     uuid        REFERENCES routes(id) ON DELETE CASCADE,
  client_id    uuid        REFERENCES clients(id),
  stop_order   integer     NOT NULL,
  is_completed boolean     DEFAULT false
);

-- ============================================================
-- 3. ROW LEVEL SECURITY — enabled but fully permissive (demo)
-- ============================================================

ALTER TABLE technicians  ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients      ENABLE ROW LEVEL SECURITY;
ALTER TABLE beer_lines   ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits       ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_stops  ENABLE ROW LEVEL SECURITY;

-- Technicians
CREATE POLICY "anon_select_technicians" ON technicians FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_technicians" ON technicians FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_technicians" ON technicians FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_technicians" ON technicians FOR DELETE TO anon USING (true);

-- Clients
CREATE POLICY "anon_select_clients" ON clients FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_clients" ON clients FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_clients" ON clients FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_clients" ON clients FOR DELETE TO anon USING (true);

-- Beer Lines
CREATE POLICY "anon_select_beer_lines" ON beer_lines FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_beer_lines" ON beer_lines FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_beer_lines" ON beer_lines FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_beer_lines" ON beer_lines FOR DELETE TO anon USING (true);

-- Visits
CREATE POLICY "anon_select_visits" ON visits FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_visits" ON visits FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_visits" ON visits FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_visits" ON visits FOR DELETE TO anon USING (true);

-- Routes
CREATE POLICY "anon_select_routes" ON routes FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_routes" ON routes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_routes" ON routes FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_routes" ON routes FOR DELETE TO anon USING (true);

-- Route Stops
CREATE POLICY "anon_select_route_stops" ON route_stops FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_route_stops" ON route_stops FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_route_stops" ON route_stops FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_route_stops" ON route_stops FOR DELETE TO anon USING (true);

-- ============================================================
-- 4. SEED DATA
-- ============================================================

DO $$
DECLARE
  -- Technician UUIDs
  t_luis    uuid;
  t_marco  uuid;
  t_roberto uuid;
  t_carlos uuid;
  t_andres uuid;

  -- Client UUIDs (Guayaquil)
  c_maleconsur    uuid;
  c_laparrilla    uuid;
  c_hoteloro      uuid;
  c_elcangrejo    uuid;
  c_cervearte     uuid;

  -- Client UUIDs (Quito)
  c_lamariscal    uuid;
  c_hotelpichincha uuid;
  c_elaguacate    uuid;
  c_barcentro     uuid;

  -- Client UUIDs (Cuenca)
  c_elbarril      uuid;
  c_hotelcrespo   uuid;
  c_callelong     uuid;

  -- Beer line UUIDs (30 lines across 12 clients)
  bl uuid[] := ARRAY[]::uuid[];
  bl_id uuid;

  -- Route UUIDs
  r1 uuid;
  r2 uuid;
  r3 uuid;

BEGIN

  -- --------------------------------------------------------
  -- TECHNICIANS (5)
  -- --------------------------------------------------------
  INSERT INTO technicians (name, city, phone)
  VALUES ('Luis Cedeno', 'Guayaquil', '0991234567')
  RETURNING id INTO t_luis;

  INSERT INTO technicians (name, city, phone)
  VALUES ('Marco Villavicencio', 'Quito', '0987654321')
  RETURNING id INTO t_marco;

  INSERT INTO technicians (name, city, phone)
  VALUES ('Roberto Sanchez', 'Cuenca', '0976543210')
  RETURNING id INTO t_roberto;

  INSERT INTO technicians (name, city, phone)
  VALUES ('Carlos Medina', 'Guayaquil', '0965432109')
  RETURNING id INTO t_carlos;

  INSERT INTO technicians (name, city, phone)
  VALUES ('Andres Palacios', 'Quito', '0954321098')
  RETURNING id INTO t_andres;

  -- --------------------------------------------------------
  -- CLIENTS (12) — assigned by city
  -- --------------------------------------------------------

  -- ===== GUAYAQUIL (5 clients → Luis & Carlos) =====

  INSERT INTO clients (name, city, address, contact_name, contact_phone,
                       visit_frequency_days, is_emergency, assigned_technician_id, notes)
  VALUES ('Bar Malecon Sur', 'Guayaquil', 'Av. Malecon Simon Bolivar y Calle Loja',
          'Fernando Reyes', '0412345678', 14, false, t_luis,
          'Abre solo jueves a domingo.')
  RETURNING id INTO c_maleconsur;

  INSERT INTO clients (name, city, address, contact_name, contact_phone,
                       visit_frequency_days, is_emergency, assigned_technician_id, notes)
  VALUES ('La Parrilla del Nato', 'Guayaquil', 'Cdla. Kennedy Norte, Calle 3ra',
          'Gonzalo Moran', '0423456789', 7, true, t_luis,
          'Alto consumo, requiere visitas semanales. URGENTE si reporta espuma.')
  RETURNING id INTO c_laparrilla;

  INSERT INTO clients (name, city, address, contact_name, contact_phone,
                       visit_frequency_days, is_emergency, assigned_technician_id, notes)
  VALUES ('Hotel Oro Verde GYE', 'Guayaquil', 'Av. 9 de Octubre y Garcia Moreno',
          'Maria Luisa Toral', '0434567890', 21, false, t_carlos,
          'Contactar recepcion antes de subir.')
  RETURNING id INTO c_hoteloro;

  INSERT INTO clients (name, city, address, contact_name, contact_phone,
                       visit_frequency_days, is_emergency, assigned_technician_id, notes)
  VALUES ('El Cangrejo Rojo', 'Guayaquil', 'Av. Victor Emilio Estrada 821, Urdesa',
          'Patricio Baque', '0445678901', 14, false, t_carlos,
          'Dos pisos, lineas en planta baja.')
  RETURNING id INTO c_elcangrejo;

  INSERT INTO clients (name, city, address, contact_name, contact_phone,
                       visit_frequency_days, is_emergency, assigned_technician_id, notes)
  VALUES ('CerveArte Taproom', 'Guayaquil', 'Calle Numa Pompilio Llona, Las Penas',
          'Diana Velez', '0456789012', 14, false, t_luis,
          'Cerveceria artesanal, lineas delicadas.')
  RETURNING id INTO c_cervearte;

  -- ===== QUITO (4 clients → Marco & Andres) =====

  INSERT INTO clients (name, city, address, contact_name, contact_phone,
                       visit_frequency_days, is_emergency, assigned_technician_id, notes)
  VALUES ('La Mariscal Sports Bar', 'Quito', 'Calle Reina Victoria N24-36 y Lizardo Garcia',
          'Juan Pablo Meneses', '0467890123', 14, false, t_marco,
          'Zona turistica, alto trafico fines de semana.')
  RETURNING id INTO c_lamariscal;

  INSERT INTO clients (name, city, address, contact_name, contact_phone,
                       visit_frequency_days, is_emergency, assigned_technician_id, notes)
  VALUES ('Hotel Pichincha Real', 'Quito', 'Av. Gonzalez Suarez N27-142',
          'Lorena Guaman', '0478901234', 30, false, t_andres,
          'Mantenimiento mensual, bajo consumo.')
  RETURNING id INTO c_hotelpichincha;

  INSERT INTO clients (name, city, address, contact_name, contact_phone,
                       visit_frequency_days, is_emergency, assigned_technician_id, notes)
  VALUES ('Restaurante El Aguacate', 'Quito', 'Calle La Pinta E4-256 y Amazonas',
          'Sofia Paredes', '0489012345', 14, true, t_marco,
          'Emergencia: tiene evento grande cada 2 semanas, lineas deben funcionar.')
  RETURNING id INTO c_elaguacate;

  INSERT INTO clients (name, city, address, contact_name, contact_phone,
                       visit_frequency_days, is_emergency, assigned_technician_id, notes)
  VALUES ('Bar Centro Historico', 'Quito', 'Calle Venezuela N5-46 y Chile, Centro Historico',
          'Ramiro Espinoza', '0490123456', 21, false, t_andres,
          'Acceso dificil, coordinar con anticipacion.')
  RETURNING id INTO c_barcentro;

  -- ===== CUENCA (3 clients → Roberto) =====

  INSERT INTO clients (name, city, address, contact_name, contact_phone,
                       visit_frequency_days, is_emergency, assigned_technician_id, notes)
  VALUES ('El Barril de Cuenca', 'Cuenca', 'Calle Larga 6-78 y Borrero',
          'Miguel Astudillo', '0701234567', 14, false, t_roberto,
          'Bar emblematico, buen mantenimiento previo.')
  RETURNING id INTO c_elbarril;

  INSERT INTO clients (name, city, address, contact_name, contact_phone,
                       visit_frequency_days, is_emergency, assigned_technician_id, notes)
  VALUES ('Hotel Crespo', 'Cuenca', 'Calle Larga 7-93',
          'Andrea Vintimilla', '0712345678', 21, false, t_roberto,
          'Hotel de lujo, coordinar con gerencia.')
  RETURNING id INTO c_hotelcrespo;

  INSERT INTO clients (name, city, address, contact_name, contact_phone,
                       visit_frequency_days, is_emergency, assigned_technician_id, notes)
  VALUES ('Calle Longa Pub', 'Cuenca', 'Calle Larga 1-103 y Av. Todos los Santos',
          'Esteban Ochoa', '0723456789', 7, false, t_roberto,
          'Alto consumo los fines de semana.')
  RETURNING id INTO c_callelong;

  -- --------------------------------------------------------
  -- BEER LINES (~30 total, 2-3 per client)
  -- --------------------------------------------------------

  -- Helper: we INSERT each line individually and collect UUIDs
  -- into an array so we can reference them for visits.

  -- Bar Malecon Sur (3 lines)
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-001', c_maleconsur, 'Pilsener')       RETURNING id INTO bl_id; bl := bl || bl_id;
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-002', c_maleconsur, 'Club Premium')   RETURNING id INTO bl_id; bl := bl || bl_id;
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-003', c_maleconsur, 'Corona')         RETURNING id INTO bl_id; bl := bl || bl_id;

  -- La Parrilla del Nato (3 lines)
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-004', c_laparrilla, 'Pilsener')       RETURNING id INTO bl_id; bl := bl || bl_id;
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-005', c_laparrilla, 'Club Verde')     RETURNING id INTO bl_id; bl := bl || bl_id;
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-006', c_laparrilla, 'Budweiser')      RETURNING id INTO bl_id; bl := bl || bl_id;

  -- Hotel Oro Verde GYE (2 lines)
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-007', c_hoteloro, 'Heineken')         RETURNING id INTO bl_id; bl := bl || bl_id;
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-008', c_hoteloro, 'Stella Artois')    RETURNING id INTO bl_id; bl := bl || bl_id;

  -- El Cangrejo Rojo (2 lines)
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-009', c_elcangrejo, 'Pilsener')       RETURNING id INTO bl_id; bl := bl || bl_id;
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-010', c_elcangrejo, 'Club Premium')   RETURNING id INTO bl_id; bl := bl || bl_id;

  -- CerveArte Taproom (3 lines)
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-011', c_cervearte, 'Pilsener Light')  RETURNING id INTO bl_id; bl := bl || bl_id;
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-012', c_cervearte, 'Club Verde')      RETURNING id INTO bl_id; bl := bl || bl_id;
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-013', c_cervearte, 'Heineken')        RETURNING id INTO bl_id; bl := bl || bl_id;

  -- La Mariscal Sports Bar (3 lines)
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-014', c_lamariscal, 'Pilsener')       RETURNING id INTO bl_id; bl := bl || bl_id;
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-015', c_lamariscal, 'Club Premium')   RETURNING id INTO bl_id; bl := bl || bl_id;
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-016', c_lamariscal, 'Corona')         RETURNING id INTO bl_id; bl := bl || bl_id;

  -- Hotel Pichincha Real (2 lines)
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-017', c_hotelpichincha, 'Heineken')   RETURNING id INTO bl_id; bl := bl || bl_id;
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-018', c_hotelpichincha, 'Stella Artois') RETURNING id INTO bl_id; bl := bl || bl_id;

  -- Restaurante El Aguacate (3 lines)
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-019', c_elaguacate, 'Pilsener')       RETURNING id INTO bl_id; bl := bl || bl_id;
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-020', c_elaguacate, 'Club Verde')     RETURNING id INTO bl_id; bl := bl || bl_id;
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-021', c_elaguacate, 'Budweiser')      RETURNING id INTO bl_id; bl := bl || bl_id;

  -- Bar Centro Historico (2 lines)
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-022', c_barcentro, 'Pilsener')        RETURNING id INTO bl_id; bl := bl || bl_id;
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-023', c_barcentro, 'Club Premium')    RETURNING id INTO bl_id; bl := bl || bl_id;

  -- El Barril de Cuenca (3 lines)
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-024', c_elbarril, 'Pilsener')         RETURNING id INTO bl_id; bl := bl || bl_id;
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-025', c_elbarril, 'Club Verde')       RETURNING id INTO bl_id; bl := bl || bl_id;
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-026', c_elbarril, 'Heineken')         RETURNING id INTO bl_id; bl := bl || bl_id;

  -- Hotel Crespo (2 lines)
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-027', c_hotelcrespo, 'Stella Artois') RETURNING id INTO bl_id; bl := bl || bl_id;
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-028', c_hotelcrespo, 'Heineken')      RETURNING id INTO bl_id; bl := bl || bl_id;

  -- Calle Longa Pub (2 lines)
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-029', c_callelong, 'Pilsener')        RETURNING id INTO bl_id; bl := bl || bl_id;
  INSERT INTO beer_lines (line_code, client_id, beer_brand) VALUES ('LN-030', c_callelong, 'Club Premium')    RETURNING id INTO bl_id; bl := bl || bl_id;

  -- --------------------------------------------------------
  -- VISITS (~40 historical visits over the last 3 months)
  --
  -- Array index reference:
  --   bl[1]  = LN-001 (Malecon Sur / Pilsener)
  --   bl[2]  = LN-002 (Malecon Sur / Club Premium)
  --   bl[3]  = LN-003 (Malecon Sur / Corona)
  --   bl[4]  = LN-004 (La Parrilla / Pilsener)
  --   bl[5]  = LN-005 (La Parrilla / Club Verde)
  --   bl[6]  = LN-006 (La Parrilla / Budweiser)
  --   bl[7]  = LN-007 (Hotel Oro Verde / Heineken)
  --   bl[8]  = LN-008 (Hotel Oro Verde / Stella)
  --   bl[9]  = LN-009 (El Cangrejo / Pilsener)
  --   bl[10] = LN-010 (El Cangrejo / Club Premium)
  --   bl[11] = LN-011 (CerveArte / Pilsener Light)
  --   bl[12] = LN-012 (CerveArte / Club Verde)
  --   bl[13] = LN-013 (CerveArte / Heineken)
  --   bl[14] = LN-014 (Mariscal / Pilsener)
  --   bl[15] = LN-015 (Mariscal / Club Premium)
  --   bl[16] = LN-016 (Mariscal / Corona)
  --   bl[17] = LN-017 (Pichincha / Heineken)
  --   bl[18] = LN-018 (Pichincha / Stella)
  --   bl[19] = LN-019 (Aguacate / Pilsener)
  --   bl[20] = LN-020 (Aguacate / Club Verde)
  --   bl[21] = LN-021 (Aguacate / Budweiser)
  --   bl[22] = LN-022 (BarCentro / Pilsener)
  --   bl[23] = LN-023 (BarCentro / Club Premium)
  --   bl[24] = LN-024 (Barril / Pilsener)
  --   bl[25] = LN-025 (Barril / Club Verde)
  --   bl[26] = LN-026 (Barril / Heineken)
  --   bl[27] = LN-027 (Crespo / Stella)
  --   bl[28] = LN-028 (Crespo / Heineken)
  --   bl[29] = LN-029 (Calle Longa / Pilsener)
  --   bl[30] = LN-030 (Calle Longa / Club Premium)
  -- --------------------------------------------------------

  -- === GUAYAQUIL VISITS (Luis & Carlos) ===

  -- Bar Malecon Sur — on schedule (freq 14), last visit ~10 days ago
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[1], t_luis, CURRENT_DATE - 80, CURRENT_DATE - 66, 'routine', 'Limpieza completa, sin novedades.', 'JF-20250201-001');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[1], t_luis, CURRENT_DATE - 66, CURRENT_DATE - 52, 'routine', 'Todo en orden.', 'JF-20250215-002');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[1], t_luis, CURRENT_DATE - 52, CURRENT_DATE - 38, 'routine', 'Cambio de acoples.', 'JF-20250301-003');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[2], t_luis, CURRENT_DATE - 38, CURRENT_DATE - 24, 'routine', 'Limpieza quimica aplicada.', 'JF-20250315-004');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[1], t_luis, CURRENT_DATE - 10, CURRENT_DATE + 4, 'routine', 'Lineas limpias, presion correcta.', 'JF-20250411-005');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[2], t_luis, CURRENT_DATE - 10, CURRENT_DATE + 4, 'routine', 'Sin novedades.', 'JF-20250411-006');

  -- La Parrilla del Nato — OVERDUE (freq 7, last visit 12 days ago)
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[4], t_luis, CURRENT_DATE - 75, CURRENT_DATE - 68, 'installation', 'Instalacion de 3 lineas nuevas.', 'JF-20250205-007');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[4], t_luis, CURRENT_DATE - 40, CURRENT_DATE - 33, 'routine', 'Limpieza estandar.', 'JF-20250311-008');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[5], t_luis, CURRENT_DATE - 33, CURRENT_DATE - 26, 'routine', 'Se detecto leve acumulacion, limpieza profunda.', 'JF-20250318-009');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[4], t_luis, CURRENT_DATE - 12, CURRENT_DATE - 5, 'routine', 'Revisado, todo OK.', 'JF-20250409-010');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[5], t_luis, CURRENT_DATE - 12, CURRENT_DATE - 5, 'routine', 'Presion baja en linea, ajustada.', 'JF-20250409-011');

  -- Hotel Oro Verde GYE — on schedule (freq 21), last visit 15 days ago
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[7], t_carlos, CURRENT_DATE - 57, CURRENT_DATE - 36, 'routine', 'Mantenimiento preventivo completo.', 'JF-20250223-012');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[8], t_carlos, CURRENT_DATE - 57, CURRENT_DATE - 36, 'routine', 'Linea Stella OK.', 'JF-20250223-013');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[7], t_carlos, CURRENT_DATE - 15, CURRENT_DATE + 6, 'routine', 'Todo en orden, proxima visita programada.', 'JF-20250406-014');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[8], t_carlos, CURRENT_DATE - 15, CURRENT_DATE + 6, 'routine', 'Sin novedades.', 'JF-20250406-015');

  -- El Cangrejo Rojo — about to expire (freq 14, last visit 11 days ago → 3 days left)
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[9], t_carlos, CURRENT_DATE - 53, CURRENT_DATE - 39, 'routine', 'Limpieza completa.', 'JF-20250227-016');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[9], t_carlos, CURRENT_DATE - 11, CURRENT_DATE + 3, 'routine', 'Lineas en buen estado.', 'JF-20250410-017');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[10], t_carlos, CURRENT_DATE - 11, CURRENT_DATE + 3, 'routine', 'Club Premium OK.', 'JF-20250410-018');

  -- CerveArte Taproom — OVERDUE (freq 14, last visit 20 days ago)
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[11], t_luis, CURRENT_DATE - 62, CURRENT_DATE - 48, 'installation', 'Instalacion de lineas artesanales.', 'JF-20250217-019');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[12], t_luis, CURRENT_DATE - 48, CURRENT_DATE - 34, 'routine', 'Mantenimiento de rutina.', 'JF-20250303-020');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[11], t_luis, CURRENT_DATE - 20, CURRENT_DATE - 6, 'routine', 'Limpieza quimica. Proximo mantenimiento urgente.', 'JF-20250401-021');

  -- === QUITO VISITS (Marco & Andres) ===

  -- La Mariscal Sports Bar — on schedule (freq 14), last visit 5 days ago
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[14], t_marco, CURRENT_DATE - 70, CURRENT_DATE - 56, 'routine', 'Primer mantenimiento post-instalacion.', 'JF-20250209-022');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[14], t_marco, CURRENT_DATE - 33, CURRENT_DATE - 19, 'routine', 'Cambio de manguera linea 14.', 'JF-20250319-023');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[15], t_marco, CURRENT_DATE - 33, CURRENT_DATE - 19, 'routine', 'Todo bien.', 'JF-20250319-024');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[14], t_marco, CURRENT_DATE - 5, CURRENT_DATE + 9, 'routine', 'Presion estable, lineas limpias.', 'JF-20250416-025');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[16], t_marco, CURRENT_DATE - 5, CURRENT_DATE + 9, 'routine', 'Corona OK.', 'JF-20250416-026');

  -- Hotel Pichincha Real — on schedule (freq 30), last visit 18 days ago
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[17], t_andres, CURRENT_DATE - 78, CURRENT_DATE - 48, 'routine', 'Mantenimiento mensual.', 'JF-20250202-027');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[17], t_andres, CURRENT_DATE - 18, CURRENT_DATE + 12, 'routine', 'Bajo consumo, lineas en buen estado.', 'JF-20250403-028');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[18], t_andres, CURRENT_DATE - 18, CURRENT_DATE + 12, 'routine', 'Stella Artois sin novedades.', 'JF-20250403-029');

  -- Restaurante El Aguacate — about to expire (freq 14, last visit 12 days ago → 2 days left)
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[19], t_marco, CURRENT_DATE - 60, CURRENT_DATE - 46, 'installation', 'Instalacion completa 3 lineas.', 'JF-20250219-030');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[19], t_marco, CURRENT_DATE - 26, CURRENT_DATE - 12, 'emergency', 'Emergencia: linea taponada. Se destapo y limpio.', 'JF-20250325-031');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[20], t_marco, CURRENT_DATE - 12, CURRENT_DATE + 2, 'routine', 'Linea Club Verde revisada.', 'JF-20250409-032');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[19], t_marco, CURRENT_DATE - 12, CURRENT_DATE + 2, 'routine', 'Pilsener OK post-emergencia.', 'JF-20250409-033');

  -- Bar Centro Historico — OVERDUE (freq 21, last visit 28 days ago)
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[22], t_andres, CURRENT_DATE - 70, CURRENT_DATE - 49, 'routine', 'Primera visita, todo nuevo.', 'JF-20250209-034');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[22], t_andres, CURRENT_DATE - 28, CURRENT_DATE - 7, 'routine', 'Mantenimiento normal.', 'JF-20250324-035');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[23], t_andres, CURRENT_DATE - 28, CURRENT_DATE - 7, 'routine', 'Club Premium linea limpia.', 'JF-20250324-036');

  -- === CUENCA VISITS (Roberto) ===

  -- El Barril de Cuenca — on schedule (freq 14), last visit 8 days ago
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[24], t_roberto, CURRENT_DATE - 64, CURRENT_DATE - 50, 'routine', 'Mantenimiento de rutina.', 'JF-20250215-037');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[25], t_roberto, CURRENT_DATE - 36, CURRENT_DATE - 22, 'routine', 'Club Verde OK.', 'JF-20250315-038');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[24], t_roberto, CURRENT_DATE - 8, CURRENT_DATE + 6, 'routine', 'Lineas en perfecto estado.', 'JF-20250413-039');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[26], t_roberto, CURRENT_DATE - 8, CURRENT_DATE + 6, 'routine', 'Heineken sin novedades.', 'JF-20250413-040');

  -- Hotel Crespo — about to expire (freq 21, last visit 18 days ago → 3 days left)
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[27], t_roberto, CURRENT_DATE - 60, CURRENT_DATE - 39, 'installation', 'Instalacion Stella Artois.', 'JF-20250219-041');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[27], t_roberto, CURRENT_DATE - 18, CURRENT_DATE + 3, 'routine', 'Limpieza de rutina Stella.', 'JF-20250403-042');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[28], t_roberto, CURRENT_DATE - 18, CURRENT_DATE + 3, 'routine', 'Heineken revisada.', 'JF-20250403-043');

  -- Calle Longa Pub — OVERDUE (freq 7, last visit 11 days ago)
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[29], t_roberto, CURRENT_DATE - 46, CURRENT_DATE - 39, 'routine', 'Limpieza rapida.', 'JF-20250305-044');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[30], t_roberto, CURRENT_DATE - 25, CURRENT_DATE - 18, 'routine', 'Club Premium OK.', 'JF-20250326-045');
  INSERT INTO visits (beer_line_id, technician_id, visit_date, next_visit_date, visit_type, notes, jotform_submission_id)
  VALUES (bl[29], t_roberto, CURRENT_DATE - 11, CURRENT_DATE - 4, 'routine', 'Pilsener limpia pero necesita revision pronto.', 'JF-20250410-046');

  -- --------------------------------------------------------
  -- ROUTES (3 routes with stops)
  -- --------------------------------------------------------

  -- Route 1: Completed route from last week — Luis in Guayaquil
  INSERT INTO routes (technician_id, route_date, name, status)
  VALUES (t_luis, CURRENT_DATE - 7, 'Ruta GYE Norte - Semana 15', 'completed')
  RETURNING id INTO r1;

  INSERT INTO route_stops (route_id, client_id, stop_order, is_completed)
  VALUES (r1, c_maleconsur, 1, true);
  INSERT INTO route_stops (route_id, client_id, stop_order, is_completed)
  VALUES (r1, c_laparrilla, 2, true);
  INSERT INTO route_stops (route_id, client_id, stop_order, is_completed)
  VALUES (r1, c_cervearte, 3, true);

  -- Route 2: In-progress route today — Roberto in Cuenca
  INSERT INTO routes (technician_id, route_date, name, status)
  VALUES (t_roberto, CURRENT_DATE, 'Ruta Cuenca Centro - Semana 16', 'in_progress')
  RETURNING id INTO r2;

  INSERT INTO route_stops (route_id, client_id, stop_order, is_completed)
  VALUES (r2, c_elbarril, 1, true);
  INSERT INTO route_stops (route_id, client_id, stop_order, is_completed)
  VALUES (r2, c_hotelcrespo, 2, false);
  INSERT INTO route_stops (route_id, client_id, stop_order, is_completed)
  VALUES (r2, c_callelong, 3, false);

  -- Route 3: Planned route for upcoming week — Marco in Quito
  INSERT INTO routes (technician_id, route_date, name, status)
  VALUES (t_marco, CURRENT_DATE + 3, 'Ruta Quito Mariscal - Semana 17', 'planned')
  RETURNING id INTO r3;

  INSERT INTO route_stops (route_id, client_id, stop_order, is_completed)
  VALUES (r3, c_lamariscal, 1, false);
  INSERT INTO route_stops (route_id, client_id, stop_order, is_completed)
  VALUES (r3, c_elaguacate, 2, false);
  INSERT INTO route_stops (route_id, client_id, stop_order, is_completed)
  VALUES (r3, c_barcentro, 3, false);
  INSERT INTO route_stops (route_id, client_id, stop_order, is_completed)
  VALUES (r3, c_hotelpichincha, 4, false);

END $$;
