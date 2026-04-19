-- ==========================================
-- 5. SEED DATA
-- ==========================================

INSERT INTO public.services (name, slug, description, base_price, icon_name) VALUES
('Cinematography', 'cinema', '8K RAW visuals for films.', 15000, 'Camera'),
('Mapping & Survey', 'mapping', 'Lidar and 3D terrain modeling.', 25000, 'Map'),
('Surveillance', 'security', '24/7 thermal site monitoring.', 20000, 'Shield'),
('Academy', 'training', 'DGCA Pilot Certification courses.', 5000, 'GraduationCap');

INSERT INTO public.courses (title, description, level, price, duration_days, is_published) VALUES
('Basic Drone Pilot', 'Learn to fly safely and legally.', 'Beginner', 12000, 5, TRUE),
('Advanced Cinematography', 'Master 3D camera tracking.', 'Advanced', 35000, 10, TRUE);
