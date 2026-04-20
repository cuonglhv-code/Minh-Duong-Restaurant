-- Seed Categories
INSERT INTO menu_categories (name_vi, name_en, slug, icon, sort_order) VALUES
('Các Món Chim', 'Bird Dishes', 'chim', '🐦', 1),
('Ba Ba & Ếch', 'Turtle & Frog', 'ba-ba-ech', '🐢', 2),
('Cua & Cá', 'Crab & Fish', 'cua-ca', '🦀', 3),
('Đặc Sản Khác', 'Other Specialties', 'dac-san', '🌿', 4),
('Đồ Uống', 'Drinks', 'do-uong', '🥤', 5);

-- Bird Dishes
INSERT INTO menu_items 
(category_id, name_vi, name_en, description_vi, description_en, 
 price, price_unit, is_signature, tags, sort_order)
SELECT 
  c.id,
  item.name_vi, item.name_en, item.desc_vi, item.desc_en,
  item.price, item.unit, item.signature, item.tags::text[], item.sort
FROM menu_categories c,
(VALUES
  ('Chim To Dần Quay', 'Roasted Sparrow', 
   'Vàng ươm, da giòn tan, thịt ngọt đậm vị đồng quê',
   'Golden crispy skin, sweet countryside flavour',
   185000, 'phần', true, ARRAY['tươi sống','đặc sản','#1'], 1),
  ('Chim Hầm Sả Ớt', 'Bird Braised with Lemongrass',
   'Vị cay nồng, sả ớt quyện thịt chim mềm tan',
   'Aromatic lemongrass and chili braised bird',
   175000, 'phần', false, ARRAY['tươi sống','cay'], 2),
  ('Chim Xào Lăn', 'Stir-fried Bird',
   'Xào lăn gia vị đậm đà, thơm nức mũi',
   'Richly seasoned stir-fried bird',
   170000, 'phần', false, ARRAY['tươi sống'], 3),
  ('Vịt Trời Nướng Than Hoa', 'Charcoal Grilled Wild Duck',
   'Béo ngậy, nướng than cháy cạnh đặc trưng',
   'Rich flavour, charcoal grilled to perfection',
   250000, 'phần', true, ARRAY['tươi sống','đặc sản'], 4),
  ('Ngỗng Quay Giòn Da', 'Crispy Roasted Goose',
   'Da giòn tan, thịt mềm béo ngậy đặc trưng',
   'Crispy skin with tender, rich goose meat',
   320000, 'phần', true, ARRAY['tươi sống','đặc sản'], 5)
) AS item(name_vi, name_en, desc_vi, desc_en, price, unit, signature, tags, sort)
WHERE c.slug = 'chim';

-- Ba Ba & Ếch
INSERT INTO menu_items 
(category_id, name_vi, name_en, description_vi, description_en,
 price, price_unit, is_signature, tags, sort_order)
SELECT c.id, item.name_vi, item.name_en, item.desc_vi, item.desc_en,
  item.price, item.unit, item.signature, item.tags::text[], item.sort
FROM menu_categories c,
(VALUES
  ('Ba Ba Thiên Nhiên Nấu Chuối Đậu', 'Wild Turtle with Banana & Tofu',
   'Ba ba tươi chọn sống, nấu chuối xanh đậu phụ thơm ngon',
   'Fresh wild turtle cooked with green banana and tofu',
   320000, 'kg', true, ARRAY['tươi sống','đặc sản','theo cân'], 1),
  ('Ba Ba Rang Muối', 'Salt Roasted Turtle',
   'Rang muối giòn, vị đậm đà khó quên',
   'Crispy salt-roasted turtle, unforgettable flavour',
   320000, 'kg', false, ARRAY['tươi sống','theo cân'], 2),
  ('Ba Ba Hầm Thuốc Bắc', 'Turtle Stewed with Medicine',
   'Hầm thuốc bắc bổ dưỡng, giải cảm',
   'Stewed with medicinal herbs, very nutritious',
   350000, 'phần', false, ARRAY['tươi sống','bổ'], 3),
  ('Ếch Đồng Rang Muối', 'Salt Fried Field Frog',
   'Tươi giòn, rang muối ớt chuẩn vị đồng',
   'Crispy field frog with salt and chili',
   145000, 'phần', true, ARRAY['tươi sống','đặc sản'], 4),
  ('Ếch Hầm Tiêu Xanh', 'Frog with Green Pepper',
   'Hầm tiêu xanh, vị cay nhẹ thanh tao',
   'Braised with green pepper, delicately spicy',
   150000, 'phần', false, ARRAY['tươi sống'], 5)
) AS item(name_vi, name_en, desc_vi, desc_en, price, unit, signature, tags, sort)
WHERE c.slug = 'ba-ba-ech';

-- Cua & Cá
INSERT INTO menu_items
(category_id, name_vi, name_en, description_vi, description_en,
 price, price_unit, is_signature, tags, sort_order)
SELECT c.id, item.name_vi, item.name_en, item.desc_vi, item.desc_en,
  item.price, item.unit, item.signature, item.tags::text[], item.sort
FROM menu_categories c,
(VALUES
  ('Cua Sông Rang Me', 'River Crab in Tamarind Sauce',
   'Chắc thịt, sốt me chua ngọt đặc trưng',
   'Meaty river crab in sweet tamarind sauce',
   180000, 'phần', true, ARRAY['tươi sống','đặc sản'], 1),
  ('Cua Sốt Ớt Chua Ngọt', 'Sweet Chili Crab',
   'Sốt ớt chua ngọt, cua chắc thịt tươi ngon',
   'Sweet and sour chili sauce over fresh crab',
   185000, 'phần', false, ARRAY['tươi sống','cay'], 2),
  ('Cua Hấp Bia', 'Beer Steamed Crab',
   'Hấp bia tươi mát, thịt cua ngọt chắc',
   'Beer steamed with fresh crab meat',
   175000, 'phần', true, ARRAY['tươi sống','đặc sản'], 3),
  ('Cá Quả Nướng Riềng Mẻ', 'Grilled Snakehead Fish',
   'Nướng than hoa, ướp riềng mẻ truyền thống',
   'Charcoal grilled with traditional galangal marinade',
   220000, 'con', true, ARRAY['tươi sống','đặc sản'], 4),
  ('Cá Quả Hấp Gừng Hành', 'Steamed Snakehead Fish',
   'Hấp gừng hành thơm nồng, giữ trọn vị tươi',
   'Steamed with ginger and onion, fresh flavor',
   195000, 'con', false, ARRAY['tươi sống'], 5)
) AS item(name_vi, name_en, desc_vi, desc_en, price, unit, signature, tags, sort)
WHERE c.slug = 'cua-ca';

-- Other Specialties
INSERT INTO menu_items
(category_id, name_vi, name_en, description_vi, description_en,
 price, price_unit, is_signature, tags, sort_order)
SELECT c.id, item.name_vi, item.name_en, item.desc_vi, item.desc_en,
  item.price, item.unit, item.signature, item.tags::text[], item.sort
FROM menu_categories c,
(VALUES
  ('Ốc Bươu Xào Lá Lốt', 'Stir-fried Apple Snails',
   'Xào lá lốt thơm, ăn kèm bánh tráng',
   'Stir-fried with fragrant betel leaves',
   95000, 'phần', false, ARRAY['tươi sống'], 1),
  ('Ốc Bươu Hấp Sả', 'Lemongrass Steamed Snails',
   'Hấp sả thơm nồng, ăn với bún',
   'Steamed with lemongrass, served with rice noodles',
   105000, 'phần', false, ARRAY['tươi sống'], 2),
  ('Cá Lóc Chiên Giòn', 'Crispy Fried Snakehead',
   'Chiên giòn da, chấm mắm riềng cực ngon',
   'Crispy fried with dipping sauce',
   165000, 'phần', true, ARRAY['tươi sống','đặc sản'], 3),
  ('Rau Muống Xào Tỏi', 'Stir-fried Water Spinach',
   'Xào tỏi thơm lựng, món ăn kèm đặc trưng',
   'Stir-fried with garlic, perfect side dish',
   65000, 'phần', false, ARRAY['đồng quê'], 4)
) AS item(name_vi, name_en, desc_vi, desc_en, price, unit, signature, tags, sort)
WHERE c.slug = 'dac-san';

-- Drinks
INSERT INTO menu_items
(category_id, name_vi, name_en, description_vi, description_en,
 price, price_unit, is_signature, tags, sort_order)
SELECT c.id, item.name_vi, item.name_en, item.desc_vi, item.desc_en,
  item.price, item.unit, item.signature, item.tags::text[], item.sort
FROM menu_categories c,
(VALUES
  ('Nước Ép Rau Má Mật Ong', 'Pennywort Honey Juice',
   'Thanh mát tự nhiên, tốt cho sức khoẻ',
   'Fresh natural, great for health',
   35000, 'ly', false, ARRAY['tự nhiên'], 1),
  ('Nước Sâm Mát', 'Herbal Cooling Drink',
   'Thảo mộc tự nhiên, giải nhiệt đồng quê',
   'Natural herbs, countryside cooling drink',
   30000, 'ly', false, ARRAY['tự nhiên'], 2),
  ('Bia Hơi Hà Nội', 'Hanoi Draught Beer',
   'Bia hơi tươi mát, uống cùng bạn bè',
   'Fresh draught beer, great with friends',
   15000, 'cốc', false, ARRAY[], 3),
  ('Trà Đá', 'Iced Tea',
   'Trà đá thanh mát',
   'Refreshing iced tea',
   15000, 'cốc', false, ARRAY[], 4)
) AS item(name_vi, name_en, desc_vi, desc_en, price, unit, signature, tags, sort)
WHERE c.slug = 'do-uong';