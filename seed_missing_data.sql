-- =============================================
-- BEST POSTS MAYO 2026 (Mock Data)
-- =============================================
insert into best_posts (mes, campaign_id, plataforma, criterio, posicion, titulo, descripcion, url, thumbnail_url, valor_metrica, formato, fecha_publicacion)
values 
  ('2026-05-01', (select id from campaigns where nombre = 'Mundialmente Rico'), 'facebook', 'mejores', 1, 'Lanzamiento MR', 'Post lanzamiento campaña', '#', 'https://picsum.photos/seed/mr1/400/400', 15000, 'imagen', '2026-05-05'),
  ('2026-05-01', (select id from campaigns where nombre = 'Mundialmente Rico'), 'facebook', 'mejores', 2, 'Receta 1', 'Video de receta con producto', '#', 'https://picsum.photos/seed/receta1/400/400', 12500, 'video', '2026-05-12'),
  ('2026-05-01', (select id from campaigns where nombre = 'Mundialmente Rico'), 'facebook', 'peores', 1, 'Post Feriado', 'Post reactivo', '#', 'https://picsum.photos/seed/holi/400/400', 1200, 'imagen', '2026-05-01'),

  ('2026-05-01', (select id from campaigns where nombre = 'Mundialmente Rico'), 'instagram', 'mejores', 1, 'Reel de Campaña', 'El reel oficial MR', '#', 'https://picsum.photos/seed/reelmr/400/600', 8500, 'reel', '2026-05-06'),
  ('2026-05-01', (select id from campaigns where nombre = 'Mundialmente Rico'), 'instagram', 'mejores', 2, 'Carrusel de Productos', 'Variedad de pollo', '#', 'https://picsum.photos/seed/carru1/400/400', 7300, 'carrusel', '2026-05-15'),
  ('2026-05-01', (select id from campaigns where nombre = 'Mundialmente Rico'), 'instagram', 'peores', 1, 'Story Promocional', 'Story de fin de semana', '#', 'https://picsum.photos/seed/story/400/600', 950, 'story', '2026-05-20'),

  ('2026-05-01', (select id from campaigns where nombre = 'Mundialmente Rico'), 'tiktok', 'mejores', 1, 'Trend Tyson', 'Participación en trend', '#', 'https://picsum.photos/seed/trend1/400/600', 45000, 'video', '2026-05-18'),
  ('2026-05-01', (select id from campaigns where nombre = 'Mundialmente Rico'), 'tiktok', 'mejores', 2, 'Receta Rápida', 'Video receta 30s', '#', 'https://picsum.photos/seed/trend2/400/600', 32000, 'video', '2026-05-22'),
  ('2026-05-01', (select id from campaigns where nombre = 'Mundialmente Rico'), 'tiktok', 'peores', 1, 'Post Informativo', 'Cierre de ciclo mensual', '#', 'https://picsum.photos/seed/trend3/400/600', 2100, 'video', '2026-05-30')
on conflict (mes, campaign_id, plataforma, criterio, posicion) do nothing;

-- =============================================
-- SENTIMENT MAYO 2026 (Mock Data)
-- =============================================
insert into sentiment_monthly (mes, campaign_id, porcentaje_positivo, porcentaje_neutro, porcentaje_negativo, descripcion)
values 
  ('2026-05-01', (select id from campaigns where nombre = 'Mundialmente Rico'), 65.5, 25.0, 9.5, 'La audiencia respondió positivamente a la nueva campaña. Los comentarios negativos se centran en distribución.')
on conflict (mes, campaign_id) do nothing;

insert into sentiment_comments (sentiment_id, screenshot_url, tipo, orden)
values 
  ((select id from sentiment_monthly where mes = '2026-05-01' limit 1), 'https://picsum.photos/seed/com1/600/200', 'positivo', 1),
  ((select id from sentiment_monthly where mes = '2026-05-01' limit 1), 'https://picsum.photos/seed/com2/600/200', 'positivo', 2),
  ((select id from sentiment_monthly where mes = '2026-05-01' limit 1), 'https://picsum.photos/seed/com3/600/200', 'neutro', 3),
  ((select id from sentiment_monthly where mes = '2026-05-01' limit 1), 'https://picsum.photos/seed/com4/600/200', 'negativo', 4);

-- =============================================
-- COMPETENCIA MAYO 2026 (Mock Data)
-- =============================================
insert into competition_monthly (mes, plataforma, cuenta, es_tyson, comunidad, tasa_crecimiento, num_posts, etr, accion_mundial, percepcion_audiencia, ejemplo_url)
values
  -- Facebook
  ('2026-05-01', 'facebook', 'Tyson', true, 8357, 0.45, 12, 5.2, null, null, null),
  ('2026-05-01', 'facebook', 'Competidor A', false, 12500, 1.2, 20, 4.1, 'Lanzamiento regional', 'Buena receptividad', '#'),
  ('2026-05-01', 'facebook', 'Competidor B', false, 5400, -0.5, 5, 2.5, null, null, null),
  
  -- Instagram
  ('2026-05-01', 'instagram', 'Tyson', true, 667, 4.3, 10, 8.2, null, null, null),
  ('2026-05-01', 'instagram', 'Competidor A', false, 3400, 2.1, 15, 6.5, null, null, null),
  ('2026-05-01', 'instagram', 'Competidor B', false, 8200, 0.8, 18, 5.8, 'Sorteos semanales', 'Alta participación', '#'),
  
  -- TikTok
  ('2026-05-01', 'tiktok', 'Tyson', true, 2911, 2.5, 8, 12.4, null, null, null),
  ('2026-05-01', 'tiktok', 'Competidor A', false, 15000, 5.0, 30, 9.8, 'Campañas con influencers', 'Alta viralidad', '#')
on conflict (mes, plataforma, cuenta) do nothing;
