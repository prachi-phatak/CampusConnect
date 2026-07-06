-- Seed data for CampusConnect

-- Assuming we already have a user from auth.users (you should create one manually and get its ID if you want to link it).
-- For this seed, we will create dummy UUIDs for users if we need, but foreign key to auth.users might fail if we don't have real users.
-- We'll skip inserting into `profiles` directly if we don't have `auth.users` IDs, but to test queries, let's insert some dummy profiles.
-- NOTE: If you run this in Supabase, you might need to insert a real user via Auth first, then use their ID.
-- For demo purposes, we will disable triggers temporarily if we need to force insert, or just use real UUIDs.

-- 1. Dummy profiles (using arbitrary UUIDs - make sure to replace these or create them in auth first)
-- UUIDs used:
-- Admin User: 'd0000000-0000-0000-0000-000000000001'
-- Student 1: 'd0000000-0000-0000-0000-000000000002'

-- 2. Dummy Clubs
INSERT INTO clubs (id, name, slug, description, banner_url, logo_url)
VALUES 
('c0000000-0000-0000-0000-000000000001', 'Tech Club', 'tech-club', 'A club for tech enthusiasts and developers.', 'https://placehold.co/800x400/000000/FFF?text=Tech+Club', 'https://placehold.co/200x200/000000/FFF?text=TC'),
('c0000000-0000-0000-0000-000000000002', 'Art & Design', 'art-design', 'Exploring creativity through various mediums.', 'https://placehold.co/800x400/FF0000/FFF?text=Art+Club', 'https://placehold.co/200x200/FF0000/FFF?text=AC'),
('c0000000-0000-0000-0000-000000000003', 'Music Society', 'music-society', 'For those who love playing and listening to music.', 'https://placehold.co/800x400/00FF00/FFF?text=Music+Society', 'https://placehold.co/200x200/00FF00/FFF?text=MS')
ON CONFLICT (id) DO NOTHING;

-- 3. Dummy Events
INSERT INTO events (id, club_id, title, description, banner_url, event_date, location)
VALUES
('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Hackathon 2024', 'Annual college hackathon. Build something awesome in 24 hours!', 'https://placehold.co/800x400/000000/FFF?text=Hackathon', NOW() + INTERVAL '7 days', 'Main Auditorium'),
('e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'Watercolor Workshop', 'Learn the basics of watercolor painting.', 'https://placehold.co/800x400/FF0000/FFF?text=Workshop', NOW() + INTERVAL '3 days', 'Art Studio 3'),
('e0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'Open Mic Night', 'Showcase your talent or just come to enjoy the performances.', 'https://placehold.co/800x400/00FF00/FFF?text=Open+Mic', NOW() + INTERVAL '14 days', 'Student Center')
ON CONFLICT (id) DO NOTHING;

-- 4. Dummy Posts (without author_id for now as we don't have real users, but schema allows null if we didn't specify NOT NULL. Wait, author_id might fail FK constraint if not real. We will skip posts/comments for now or use a known user ID if you have one.)
-- You can manually add posts in the Supabase dashboard after creating a user.
