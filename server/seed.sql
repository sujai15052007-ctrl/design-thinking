USE reroot;

INSERT INTO shelters (name, address, phone, accepts, lat, lng, opening_hours)
SELECT s.name, s.address, s.phone, s.accepts, s.lat, s.lng, s.opening_hours
FROM (
  SELECT 'Greater Vancouver Food Bank - Vancouver' AS name, '8345 Winston St, Burnaby, BC' AS address, '+1-604-876-3601' AS phone, JSON_ARRAY('Produce','Bakery','Dairy','Pantry','Prepared Meals') AS accepts, 49.2217 AS lat, -122.9804 AS lng, 'Mon-Fri 08:00-16:00' AS opening_hours
  UNION ALL SELECT 'The Salvation Army Vancouver Harbour Light', '119 E Cordova St, Vancouver, BC', '+1-604-646-6845', JSON_ARRAY('Produce','Bakery','Pantry','Prepared Meals'), 49.2821, -123.1032, 'Daily 09:00-17:00'
  UNION ALL SELECT 'Union Gospel Mission', '601 E Hastings St, Vancouver, BC', '+1-604-253-3323', JSON_ARRAY('Produce','Bakery','Dairy','Prepared Meals'), 49.2811, -123.0956, 'Daily 08:00-18:00'
  UNION ALL SELECT 'Quest Food Exchange', '2020 Dundas St, Vancouver, BC', '+1-604-602-0186', JSON_ARRAY('Produce','Bakery','Dairy','Pantry'), 49.2844, -123.0648, 'Mon-Sat 09:00-17:00'
  UNION ALL SELECT 'Mount Pleasant Neighbourhood House', '800 E Broadway, Vancouver, BC', '+1-604-879-8208', JSON_ARRAY('Produce','Bakery','Pantry'), 49.2627, -123.0877, 'Mon-Fri 09:00-17:00'
  UNION ALL SELECT 'Kitsilano Neighbourhood House', '2305 W 7th Ave, Vancouver, BC', '+1-604-736-3588', JSON_ARRAY('Produce','Bakery','Dairy','Pantry'), 49.2655, -123.1582, 'Mon-Fri 09:00-17:00'
  UNION ALL SELECT 'North Shore Neighbourhood House', '225 E 2nd St, North Vancouver, BC', '+1-604-987-8138', JSON_ARRAY('Produce','Bakery','Pantry','Prepared Meals'), 49.3112, -123.0781, 'Mon-Fri 09:00-16:30'
  UNION ALL SELECT 'Richmond Food Bank', '100-5800 Cedarbridge Way, Richmond, BC', '+1-604-271-5609', JSON_ARRAY('Produce','Bakery','Dairy','Pantry'), 49.1684, -123.1360, 'Mon-Fri 09:00-16:00'
) AS s
WHERE NOT EXISTS (SELECT 1 FROM shelters existing WHERE existing.name = s.name);

INSERT INTO badges (code, name, description, icon, tier)
VALUES
  ('first-save', 'First Save', 'Rescue your first item from waste.', 'Seedling', 'bronze'),
  ('7-day-streak', '7-Day Streak', 'Take action for seven consecutive days.', 'Flame', 'silver'),
  ('10-donations', '10 Donations', 'Complete ten food donations.', 'HandHeart', 'gold'),
  ('zero-waste-week', 'Zero-Waste Week', 'Rescue or cook seven food items.', 'Recycle', 'gold'),
  ('community-hero', 'Community Hero', 'Earn 1,000 Eco Points.', 'Trophy', 'diamond')
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), icon = VALUES(icon), tier = VALUES(tier);

INSERT INTO users (name, email, password_hash, role, units, eco_score, streak, last_active_date)
VALUES
  ('ReRoot Home Demo', 'home@reroot.local', '$2b$10$tnAh2ddCqJ35CXrpFbeWoeClAukH59FqH4099EQxNibdXTU9bqunS', 'home', 'metric', 120, 3, CURDATE()),
  ('ReRoot Business Demo', 'business@reroot.local', '$2b$10$tnAh2ddCqJ35CXrpFbeWoeClAukH59FqH4099EQxNibdXTU9bqunS', 'business', 'metric', 245, 5, CURDATE()),
  ('ReRoot NGO Demo', 'ngo@reroot.local', '$2b$10$tnAh2ddCqJ35CXrpFbeWoeClAukH59FqH4099EQxNibdXTU9bqunS', 'ngo', 'metric', 0, 0, NULL)
ON DUPLICATE KEY UPDATE email = VALUES(email);
