/*
  # Seed Initial Data for FlossUp Platform

  1. Sample Data
    - Labs and their services
    - Sample products for shop
    - Sample courses and videos
    - Demo user profiles

  2. Categories and Reference Data
    - Product categories
    - Course categories
    - Dental specializations
*/

-- Insert sample labs
INSERT INTO labs (id, name, description, location, phone, email, rating, reviews_count, turnaround_days, specialties, certifications, image_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'ProDental Laboratory', 'Leading dental laboratory with over 15 years of experience in precision dental work.', '123 Lab Street, Dental City', '(555) 123-4567', 'orders@prodental.com', 4.9, 1247, '3-7 days', ARRAY['Crown & Bridge', 'Implant Restoration', 'Orthodontics'], ARRAY['ISO 13485', 'FDA Registered', 'CE Marked'], 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=400'),
('550e8400-e29b-41d4-a716-446655440002', 'Precision Dental Lab', 'State-of-the-art digital laboratory specializing in CAD/CAM technology and cosmetic restorations.', '456 Tech Avenue, Innovation District', '(555) 234-5678', 'info@precisionlab.com', 4.8, 892, '2-6 days', ARRAY['Digital Dentistry', 'CAD/CAM', 'Cosmetic Work'], ARRAY['ISO 9001', 'Digital Certified', 'Quality Assured'], 'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=400'),
('550e8400-e29b-41d4-a716-446655440003', 'Elite Dental Solutions', 'Premium laboratory focusing on complex prosthodontic cases and full mouth reconstructions.', '789 Premium Plaza, Luxury District', '(555) 345-6789', 'service@elitedental.com', 4.7, 654, '4-8 days', ARRAY['Prosthodontics', 'Full Mouth Reconstruction', 'Dentures'], ARRAY['Premium Certified', 'Prosthodontic Specialist', 'Quality Excellence'], 'https://images.pexels.com/photos/3786249/pexels-photo-3786249.jpeg?auto=compress&cs=tinysrgb&w=400'),
('550e8400-e29b-41d4-a716-446655440004', 'Express Dental Lab', 'Fast-turnaround laboratory specializing in emergency and rush dental work.', '321 Speed Street, Fast Track City', '(555) 456-7890', 'rush@expresslab.com', 4.6, 423, '1-4 days', ARRAY['Rush Orders', 'Emergency Cases', 'Same Day Service'], ARRAY['Speed Certified', 'Emergency Ready', 'Rush Specialist'], 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400');

-- Insert lab services
INSERT INTO lab_services (lab_id, name, description, price, turnaround_days, category) VALUES
-- ProDental Laboratory services
('550e8400-e29b-41d4-a716-446655440001', 'Crown & Bridge', 'High-quality porcelain crowns and bridges', 350.00, '5-7 days', 'Restorative'),
('550e8400-e29b-41d4-a716-446655440001', 'Implant Restoration', 'Custom implant crowns and abutments', 450.00, '7-10 days', 'Implantology'),
('550e8400-e29b-41d4-a716-446655440001', 'Orthodontic Appliance', 'Custom orthodontic devices', 200.00, '3-5 days', 'Orthodontics'),
('550e8400-e29b-41d4-a716-446655440001', 'Night Guard', 'Custom night guards for bruxism', 150.00, '3-5 days', 'Protective'),

-- Precision Dental Lab services
('550e8400-e29b-41d4-a716-446655440002', 'Crown & Bridge', 'CAD/CAM precision crowns and bridges', 380.00, '4-6 days', 'Restorative'),
('550e8400-e29b-41d4-a716-446655440002', 'Porcelain Veneers', 'Ultra-thin cosmetic veneers', 520.00, '6-8 days', 'Cosmetic'),
('550e8400-e29b-41d4-a716-446655440002', 'Inlays & Onlays', 'Precision ceramic inlays and onlays', 290.00, '4-6 days', 'Restorative'),
('550e8400-e29b-41d4-a716-446655440002', 'Implant Restoration', 'Digital implant solutions', 480.00, '6-8 days', 'Implantology'),

-- Elite Dental Solutions services
('550e8400-e29b-41d4-a716-446655440003', 'Complete Denture', 'Full upper and lower dentures', 800.00, '10-14 days', 'Prosthodontics'),
('550e8400-e29b-41d4-a716-446655440003', 'Partial Denture', 'Custom partial dentures', 600.00, '7-10 days', 'Prosthodontics'),
('550e8400-e29b-41d4-a716-446655440003', 'Crown & Bridge', 'Premium prosthodontic restorations', 420.00, '6-8 days', 'Restorative'),
('550e8400-e29b-41d4-a716-446655440003', 'Full Mouth Reconstruction', 'Complete smile makeover', 2500.00, '14-21 days', 'Prosthodontics'),

-- Express Dental Lab services
('550e8400-e29b-41d4-a716-446655440004', 'Crown & Bridge', 'Fast-track crowns and bridges', 320.00, '2-4 days', 'Restorative'),
('550e8400-e29b-41d4-a716-446655440004', 'Denture Repair', 'Emergency denture repairs', 120.00, '1-2 days', 'Repair'),
('550e8400-e29b-41d4-a716-446655440004', 'Night Guard', 'Quick turnaround night guards', 130.00, '2-3 days', 'Protective'),
('550e8400-e29b-41d4-a716-446655440004', 'Emergency Service', 'Same-day emergency work', 200.00, 'Same Day', 'Emergency');

-- Insert sample products
INSERT INTO products (name, description, price, category, subcategory, brand, sku, stock_quantity, images, specifications) VALUES
('Digital X-Ray Sensor', 'High-resolution digital X-ray sensor with USB connectivity', 2899.00, 'Radiology', 'Digital Sensors', 'DentalTech Pro', 'DTP-XR-001', 15, ARRAY['https://images.pexels.com/photos/3786249/pexels-photo-3786249.jpeg?auto=compress&cs=tinysrgb&w=400'], '{"resolution": "20 lp/mm", "connectivity": "USB 2.0", "warranty": "2 years"}'),
('Ultrasonic Scaler', 'Professional ultrasonic scaler with multiple tips', 899.00, 'Surgery', 'Scalers', 'ProClean', 'PC-US-002', 8, ARRAY['https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=400'], '{"frequency": "28-32 kHz", "power": "Adjustable", "tips_included": "5"}'),
('LED Curing Light', 'High-intensity LED curing light for composite resins', 459.00, 'Restorative', 'Curing Lights', 'BrightCure', 'BC-LED-003', 25, ARRAY['https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=400'], '{"wavelength": "420-480 nm", "intensity": "1200 mW/cm²", "battery": "Rechargeable"}'),
('Surgical Burs Set', 'Complete set of surgical burs for various procedures', 189.00, 'Surgery', 'Burs', 'SurgicalPro', 'SP-BUR-004', 50, ARRAY['https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=400'], '{"material": "Tungsten Carbide", "set_size": "20 pieces", "sterilizable": "Yes"}'),
('Dental Implant Kit', 'Complete implant system with abutments', 1299.00, 'Implantology', 'Implant Systems', 'ImplantMax', 'IM-KIT-005', 12, ARRAY['https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=400'], '{"material": "Titanium Grade 4", "sizes": "3.5-5.0mm", "surface": "SLA treated"}');

-- Insert sample courses
INSERT INTO courses (title, description, price, duration_hours, level, category, thumbnail_url, is_published, enrollment_count, rating) VALUES
('Advanced Endodontics Masterclass', 'Comprehensive course covering modern endodontic techniques and case management', 299.00, 12, 'Advanced', 'Endodontics', 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=400', true, 156, 4.8),
('Digital Impressions Workshop', 'Learn the latest digital impression techniques and technologies', 199.00, 8, 'Intermediate', 'Digital Dentistry', 'https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=400', true, 203, 4.7),
('Pediatric Dentistry Fundamentals', 'Essential skills for treating young patients', 149.00, 6, 'Beginner', 'Pediatric Dentistry', 'https://images.pexels.com/photos/4269697/pexels-photo-4269697.jpeg?auto=compress&cs=tinysrgb&w=400', true, 89, 4.9),
('Cosmetic Dentistry Trends 2024', 'Latest trends and techniques in cosmetic dentistry', 249.00, 10, 'Intermediate', 'Cosmetic Dentistry', 'https://images.pexels.com/photos/3786249/pexels-photo-3786249.jpeg?auto=compress&cs=tinysrgb&w=400', true, 134, 4.6);

-- Insert sample videos
INSERT INTO videos (title, description, video_url, thumbnail_url, duration_seconds, type, category, views_count, likes_count, comments_count, is_published) VALUES
('Root Canal Technique Masterclass', 'Complete step-by-step root canal procedure demonstration', 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=400', 3600, 'lecture', 'Endodontics', 1247, 89, 23, true),
('Digital Impression Tips', 'Quick tips for better digital impressions', 'https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://images.pexels.com/photos/3779706/pexels-photo-3779706.jpeg?auto=compress&cs=tinysrgb&w=400', 45, 'reel', 'Digital Dentistry', 892, 67, 12, true),
('Pediatric Patient Management', 'Effective techniques for managing anxious children', 'https://images.pexels.com/photos/4269697/pexels-photo-4269697.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://images.pexels.com/photos/4269697/pexels-photo-4269697.jpeg?auto=compress&cs=tinysrgb&w=400', 2400, 'lecture', 'Pediatric Dentistry', 654, 45, 18, true),
('Perfect Shade Matching', '30-second tip for accurate shade selection', 'https://images.pexels.com/photos/3786249/pexels-photo-3786249.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://images.pexels.com/photos/3786249/pexels-photo-3786249.jpeg?auto=compress&cs=tinysrgb&w=400', 30, 'reel', 'Cosmetic Dentistry', 1156, 98, 31, true),
('Implant Surgery Fundamentals', 'Comprehensive guide to dental implant placement', 'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=400', 4200, 'lecture', 'Implantology', 789, 56, 19, true),
('Sterilization Quick Check', 'Essential sterilization protocol reminder', 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=400', 60, 'reel', 'Infection Control', 567, 34, 8, true);