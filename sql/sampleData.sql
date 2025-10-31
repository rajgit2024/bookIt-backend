-- sampleData.sql

-- Experiences
INSERT INTO experiences (title, description, image_url, base_price)
VALUES
('Sunset Kayak Tour', 'Enjoy an evening kayak tour with a beautiful sunset.', 'https://images.unsplash.com/photo-1', 25.00),
('City Food Walk', 'Explore the best local bites with a friendly guide.', 'https://images.unsplash.com/photo-2', 40.00),
('Mountain Hike', 'A moderate hike with great views and picnic.', 'https://images.unsplash.com/photo-3', 30.00)
RETURNING id;

-- Slots
INSERT INTO slots (experience_id, slot_date, available_seats, price)
VALUES
(1, CURRENT_DATE + INTERVAL '3 day', 10, 25.00),
(1, CURRENT_DATE + INTERVAL '4 day', 8, 25.00),
(2, CURRENT_DATE + INTERVAL '2 day', 12, 40.00),
(3, CURRENT_DATE + INTERVAL '5 day', 15, 30.00);

-- Promo codes
INSERT INTO promo_codes (code, discount_percent, flat_discount, max_uses, used_count)
VALUES
('SAVE10', 10, NULL, NULL, 0),
('FLAT100', NULL, 100.00, NULL, 0);
