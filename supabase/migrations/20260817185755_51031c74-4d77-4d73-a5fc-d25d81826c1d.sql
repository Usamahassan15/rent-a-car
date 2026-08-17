INSERT INTO public.categories (slug,name,description,icon,sort_order)
SELECT v.* FROM (VALUES
('luxury','Luxury Cars','Rolls Royce, Mercedes, Range Rover and more','crown',1),
('suv','SUV','Prado, Fortuner, Revo and family SUVs','mountain',2),
('sedan','Sedan','Corolla, Civic, City and executive sedans','car',3),
('wedding','Wedding Cars','Decorated luxury cars for your big day','heart',4),
('sports','Sports Cars','BMW i8, Porsche Panamera and performance cars','zap',5),
('bulletproof','Bulletproof','B6 armoured vehicles with security chauffeur','shield',6),
('executive','Executive','Corporate travel with premium comfort','briefcase',7),
('airport','Airport Transfer','24/7 airport pick and drop across Pakistan','plane',8),
('limousine','Limousine','Stretch limos for weddings and events','sparkles',9),
('vintage','Vintage Cars','Classic cars for weddings and photoshoots','clock',10),
('hi-roof','Hi Roof','12 seater group travel vans','bus',11),
('grand-cabin','Grand Cabin','Family and group travel in comfort','users',12),
('coaster','Coaster','22 seater saloon coaches for tours','bus',13)
) AS v(slug,name,description,icon,sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.slug = v.slug);

INSERT INTO public.cities (slug,name,description,is_featured,sort_order)
SELECT v.* FROM (VALUES
('islamabad','Islamabad','Luxury car rental with chauffeur in Islamabad — airport transfers, weddings, corporate and intercity travel.',true,1),
('rawalpindi','Rawalpindi','Luxury car rental with chauffeur in Rawalpindi — airport transfers, weddings, corporate and intercity travel.',true,2),
('lahore','Lahore','Luxury car rental with chauffeur in Lahore — airport transfers, weddings, corporate and intercity travel.',true,3),
('karachi','Karachi','Luxury car rental with chauffeur in Karachi — airport transfers, weddings, corporate and intercity travel.',true,4),
('faisalabad','Faisalabad','Luxury car rental with chauffeur in Faisalabad — airport transfers, weddings, corporate and intercity travel.',false,5),
('multan','Multan','Luxury car rental with chauffeur in Multan — airport transfers, weddings, corporate and intercity travel.',false,6),
('peshawar','Peshawar','Luxury car rental with chauffeur in Peshawar — airport transfers, weddings, corporate and intercity travel.',false,7),
('murree','Murree','Luxury car rental with chauffeur in Murree — airport transfers, weddings, corporate and intercity travel.',false,8),
('abbottabad','Abbottabad','Luxury car rental with chauffeur in Abbottabad — airport transfers, weddings, corporate and intercity travel.',false,9),
('sialkot','Sialkot','Luxury car rental with chauffeur in Sialkot — airport transfers, weddings, corporate and intercity travel.',false,10),
('gujranwala','Gujranwala','Luxury car rental with chauffeur in Gujranwala — airport transfers, weddings, corporate and intercity travel.',false,11),
('hyderabad','Hyderabad','Luxury car rental with chauffeur in Hyderabad — airport transfers, weddings, corporate and intercity travel.',false,12)
) AS v(slug,name,description,is_featured,sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.cities c WHERE c.slug = v.slug);

INSERT INTO public.deals (slug,title,subtitle,description,discount_percent,code,is_active)
SELECT v.* FROM (VALUES
('wedding-season','Wedding Season Special','Up to 20% off decorated luxury cars','Book any wedding package car for 2+ days and get 20% off plus complimentary floral decoration.',20,'WEDDING20',true),
('corporate-monthly','Corporate Monthly Fleet','Save 25% on monthly contracts','Monthly corporate contracts with dedicated chauffeur, maintenance and replacement vehicle guarantee.',25,'CORP25',true),
('airport-transfer','Airport Transfer Flat Rate','Islamabad & Lahore airports','Fixed flat rate airport pick & drop, 24/7 with flight tracking and 60 minutes free waiting.',10,'AIRPORT10',true),
('weekend-getaway','Murree Weekend Getaway','3-day SUV package','Prado, Fortuner or Revo for 3 days with driver, fuel allowance and unlimited hill-station kilometers.',15,'MURREE15',true)
) AS v(slug,title,subtitle,description,discount_percent,code,is_active)
WHERE NOT EXISTS (SELECT 1 FROM public.deals d WHERE d.slug = v.slug);

INSERT INTO public.blog_posts (slug,title,excerpt,content,cover_image,author,tags,published,published_at)
SELECT v.* FROM (VALUES
('best-luxury-cars-for-weddings-in-pakistan','Best Luxury Cars for Weddings in Pakistan (2026 Guide)','From Rolls Royce Phantom to Mercedes S-Class — the wedding cars every couple asks for.','Choosing a wedding car in Pakistan comes down to three things: presence, comfort and reliability. The Rolls Royce Phantom remains the ultimate statement car for baraat entries, while the Mercedes S-Class offers massage seats and a whisper-quiet cabin for the bride and groom. For larger families, a matching convoy of Range Rovers or a stretch limousine keeps the whole party together.

Book at least 3 weeks ahead during wedding season (November to February). Confirm decoration policy, chauffeur dress code, and how many hours the booking covers. At Regal Auto every wedding booking includes a uniformed chauffeur, full insurance and a backup vehicle on standby.','/__l5e/assets-v1/dbb255b7-aa39-463d-a555-f8f7f896c38e/car-rolls.jpg','Regal Auto',ARRAY['wedding','luxury','guide'],true,now() - interval '0 days'),
('rent-a-car-with-driver-vs-self-drive','Rent a Car With Driver vs Self Drive in Pakistan','Which option actually saves you money and stress on Pakistani roads?','Self-drive rentals look cheaper on paper, but city traffic, parking, fuel management and unfamiliar intercity routes add up fast. A chauffeur-driven rental includes a professional driver who knows the routes, handles parking and stays with the vehicle.

For business travel and airport transfers, chauffeur service wins every time — you keep working while someone else drives. For long hill-station trips, an experienced mountain driver is a safety upgrade, not a luxury. All Regal Auto vehicles come with a trained chauffeur included in the daily rate.','/__l5e/assets-v1/dbb255b7-aa39-463d-a555-f8f7f896c38e/car-rolls.jpg','Regal Auto',ARRAY['guide','chauffeur'],true,now() - interval '9 days'),
('corporate-car-rental-checklist','Corporate Car Rental Checklist for Companies','What to verify before signing a monthly fleet contract.','A solid corporate rental contract covers vehicle age, maintenance schedule, replacement guarantee, driver vetting, insurance limits, and monthly kilometer allowance. Ask for documented driver background checks and a single point of contact for escalations.

Regal Auto corporate contracts include monthly servicing, 24/7 replacement within two hours, vetted chauffeurs and consolidated monthly invoicing with GST documentation.','/__l5e/assets-v1/dbb255b7-aa39-463d-a555-f8f7f896c38e/car-rolls.jpg','Regal Auto',ARRAY['corporate','business'],true,now() - interval '18 days'),
('islamabad-airport-transfer-guide','Islamabad Airport Transfer: Complete Guide','Timings, flat rates and how to avoid missing your flight.','Islamabad International Airport sits about 30 km from Blue Area, which means 45 to 70 minutes depending on traffic. For international departures, leave three hours before your flight; for domestic, two hours is comfortable.

Our airport service tracks your flight number, adjusts pickup automatically for delays and includes 60 minutes of free waiting time. Meet-and-greet inside arrivals is available on request.','/__l5e/assets-v1/dbb255b7-aa39-463d-a555-f8f7f896c38e/car-rolls.jpg','Regal Auto',ARRAY['airport','islamabad','guide'],true,now() - interval '27 days')
) AS v(slug,title,excerpt,content,cover_image,author,tags,published,published_at)
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts b WHERE b.slug = v.slug);

INSERT INTO public.vehicles (slug,name,brand,model,category_id,city_id,description,images,price_per_day,price_per_week,price_per_month,seats,transmission,fuel,year,features,rating,review_count,is_featured,published,is_available,driver_included,insurance_included,mileage_limit_km,security_deposit)
SELECT v.slug, v.name, v.brand, v.name,
       (SELECT id FROM public.categories c WHERE c.slug = v.cat_slug),
       (SELECT id FROM public.cities ct WHERE ct.name = v.city_name),
       v.name || ' available for rent in ' || v.city_name || ' and across Pakistan with a professional chauffeur, full insurance and 24/7 support. Ideal for weddings, corporate travel, airport transfers and intercity trips.',
       v.images, v.price_per_day, v.price_per_day * 6, v.price_per_day * 22,
       v.seats, v.transmission::transmission_type, v.fuel::fuel_type, v.year, v.features,
       v.rating, v.review_count, v.is_featured, true, true, true, true, 300, v.price_per_day * 2
FROM (VALUES
('toyota-prado-v8','Toyota Prado V8','Toyota','suv','Islamabad',ARRAY['/__l5e/assets-v1/b2005c87-411b-4657-bd6e-45f572d563de/car-prado.jpg'],35000,7,'automatic','petrol',2021,ARRAY['Sunroof','Leather Seats','4x4','Cruise Control','Reverse Camera'],4.9,46,true),
('toyota-revo','Toyota Revo','Toyota','suv','Islamabad',ARRAY['/__l5e/assets-v1/45ce497b-b4b2-4c6a-a7cd-fbc80c1e213f/car-fortuner.jpg'],18000,5,'automatic','diesel',2022,ARRAY['4x4','Bluetooth','Reverse Camera','Alloy Wheels'],4.6,18,false),
('toyota-vigo','Toyota Vigo','Toyota','suv','Rawalpindi',ARRAY['/__l5e/assets-v1/45ce497b-b4b2-4c6a-a7cd-fbc80c1e213f/car-fortuner.jpg'],14000,5,'manual','diesel',2016,ARRAY['4x4','AC','Bluetooth'],4.6,18,false),
('bulletproof-prado','Bulletproof Prado','Toyota','bulletproof','Islamabad',ARRAY['/__l5e/assets-v1/b2005c87-411b-4657-bd6e-45f572d563de/car-prado.jpg'],95000,5,'automatic','petrol',2020,ARRAY['B6 Armour','Trained Security Chauffeur','Tinted Glass','Run-flat Tyres'],4.9,46,true),
('audi-a3','Audi A3','Audi','sedan','Lahore',ARRAY['/__l5e/assets-v1/13b7c0c5-c602-4628-b578-3a27de2cd8d4/car-audi-a6.jpg'],22000,5,'automatic','petrol',2019,ARRAY['Sunroof','Virtual Cockpit','Apple CarPlay'],4.6,18,false),
('audi-a4','Audi A4','Audi','executive','Lahore',ARRAY['/__l5e/assets-v1/13b7c0c5-c602-4628-b578-3a27de2cd8d4/car-audi-a6.jpg'],30000,5,'automatic','petrol',2021,ARRAY['Quattro','Sunroof','B&O Audio','Ambient Lighting'],4.6,18,false),
('audi-a5','Audi A5','Audi','luxury','Karachi',ARRAY['/__l5e/assets-v1/13b7c0c5-c602-4628-b578-3a27de2cd8d4/car-audi-a6.jpg'],38000,4,'automatic','petrol',2021,ARRAY['Sport Coupe','Sunroof','B&O Audio'],4.6,18,false),
('mercedes-c-class','Mercedes C-Class','Mercedes-Benz','executive','Islamabad',ARRAY['/__l5e/assets-v1/d91afc73-27d1-4577-95d4-1bbf11f1480a/car-mercedes-s.jpg'],35000,5,'automatic','petrol',2021,ARRAY['Panoramic Roof','Burmester Audio','Ambient Lighting'],4.6,18,false),
('mercedes-e-class','Mercedes E-Class','Mercedes-Benz','luxury','Lahore',ARRAY['/__l5e/assets-v1/d91afc73-27d1-4577-95d4-1bbf11f1480a/car-mercedes-s.jpg'],48000,5,'automatic','petrol',2022,ARRAY['Massage Seats','Burmester Audio','Panoramic Roof','Chauffeur'],4.9,46,true),
('mercedes-g-class','Mercedes G-Class','Mercedes-Benz','luxury','Islamabad',ARRAY['/__l5e/assets-v1/497d55ba-77bf-41c7-8239-15a84a178e31/car-range-rover.jpg'],150000,5,'automatic','petrol',2022,ARRAY['G-Wagon Icon','Burmester Audio','4x4','Massage Seats'],4.9,46,true),
('porsche-panamera','Porsche Panamera','Porsche','sports','Karachi',ARRAY['/__l5e/assets-v1/857ec8a1-5e3d-4c70-8155-526ac127bc36/car-bmw-i8.jpg'],180000,4,'automatic','petrol',2021,ARRAY['Sport Chrono','Bose Audio','Air Suspension'],4.9,46,true),
('rolls-royce-replica','Rolls Royce Replica','Rolls Royce','wedding','Lahore',ARRAY['/__l5e/assets-v1/dbb255b7-aa39-463d-a555-f8f7f896c38e/car-rolls.jpg'],60000,4,'automatic','petrol',2019,ARRAY['Wedding Decor Option','Starlight Roof Look','Chauffeur'],4.6,18,false),
('rolls-royce-limo','Rolls Royce Limo','Rolls Royce','limousine','Islamabad',ARRAY['/__l5e/assets-v1/8952c70d-32b3-4086-96cf-42773377a583/car-limo.jpg'],145000,8,'automatic','petrol',2018,ARRAY['Stretch Limo','Champagne Cooler','Mood Lighting','Chauffeur'],4.9,46,true),
('fortuner-sigma','Fortuner Sigma','Toyota','suv','Rawalpindi',ARRAY['/__l5e/assets-v1/45ce497b-b4b2-4c6a-a7cd-fbc80c1e213f/car-fortuner.jpg'],26000,7,'automatic','diesel',2022,ARRAY['4x4','Sunroof','Leather Seats','Reverse Camera'],4.6,18,false),
('fortuner-legender','Fortuner Legender','Toyota','suv','Islamabad',ARRAY['/__l5e/assets-v1/45ce497b-b4b2-4c6a-a7cd-fbc80c1e213f/car-fortuner.jpg'],32000,7,'automatic','diesel',2023,ARRAY['4x4','JBL Audio','360 Camera','Powered Tailgate'],4.9,46,true),
('range-rover-vogue','Range Rover Vogue','Land Rover','luxury','Islamabad',ARRAY['/__l5e/assets-v1/497d55ba-77bf-41c7-8239-15a84a178e31/car-range-rover.jpg'],90000,5,'automatic','petrol',2021,ARRAY['Air Suspension','Meridian Audio','Panoramic Roof'],4.9,46,true),
('range-rover-sport','Range Rover Sport','Land Rover','luxury','Lahore',ARRAY['/__l5e/assets-v1/497d55ba-77bf-41c7-8239-15a84a178e31/car-range-rover.jpg'],75000,5,'automatic','diesel',2021,ARRAY['Terrain Response','Meridian Audio','Sport Mode'],4.6,18,false),
('kia-carnival','Kia Carnival','Kia','grand-cabin','Islamabad',ARRAY['/__l5e/assets-v1/d77e8495-96ff-429b-8d43-6c9a3695f006/car-grand-cabin.jpg'],25000,11,'automatic','petrol',2022,ARRAY['Captain Seats','Rear AC','Sliding Doors','USB Ports'],4.6,18,false),
('kia-sorento','Kia Sorento','Kia','suv','Karachi',ARRAY['/__l5e/assets-v1/45ce497b-b4b2-4c6a-a7cd-fbc80c1e213f/car-fortuner.jpg'],19000,7,'automatic','petrol',2022,ARRAY['Panoramic Roof','Cruise Control','Reverse Camera'],4.6,18,false),
('kia-sportage','Kia Sportage','Kia','suv','Lahore',ARRAY['/__l5e/assets-v1/45ce497b-b4b2-4c6a-a7cd-fbc80c1e213f/car-fortuner.jpg'],15000,5,'automatic','petrol',2022,ARRAY['Panoramic Roof','Cruise Control','Bluetooth'],4.6,18,false),
('honda-brv','Honda BRV','Honda','suv','Rawalpindi',ARRAY['/__l5e/assets-v1/8c321429-040a-4755-9a87-27e762d731ec/car-civic.jpg'],12500,7,'automatic','petrol',2021,ARRAY['7 Seater','Rear AC','Bluetooth'],4.6,18,false),
('corolla-gli','Corolla GLI','Toyota','sedan','Islamabad',ARRAY['/__l5e/assets-v1/1a22c138-2960-4d91-901b-4770840807d4/car-corolla.jpg'],11000,5,'manual','petrol',2022,ARRAY['AC','Bluetooth','Reverse Camera'],4.6,18,false),
('hyundai-sonata','Hyundai Sonata','Hyundai','executive','Karachi',ARRAY['/__l5e/assets-v1/1a22c138-2960-4d91-901b-4770840807d4/car-corolla.jpg'],20000,5,'automatic','petrol',2022,ARRAY['Sunroof','Ventilated Seats','Cruise Control'],4.6,18,false),
('gmc-limousine','GMC Limousine','GMC','limousine','Islamabad',ARRAY['/__l5e/assets-v1/8952c70d-32b3-4086-96cf-42773377a583/car-limo.jpg'],130000,14,'automatic','petrol',2017,ARRAY['Stretch Limo','LED Bar','Sound System','Chauffeur'],4.9,46,true),
('cadillac-limousine','Cadillac Limousine','Cadillac','limousine','Lahore',ARRAY['/__l5e/assets-v1/8952c70d-32b3-4086-96cf-42773377a583/car-limo.jpg'],125000,12,'automatic','petrol',2016,ARRAY['Stretch Limo','Mini Bar','Mood Lighting','Chauffeur'],4.6,18,false),
('tundra-limousine','Tundra Limousine','Toyota','limousine','Islamabad',ARRAY['/__l5e/assets-v1/8952c70d-32b3-4086-96cf-42773377a583/car-limo.jpg'],110000,10,'automatic','petrol',2015,ARRAY['Monster Limo','Sound System','LED Lighting'],4.6,18,false),
('hi-roof','Hi Roof','Toyota','hi-roof','Rawalpindi',ARRAY['/__l5e/assets-v1/d77e8495-96ff-429b-8d43-6c9a3695f006/car-grand-cabin.jpg'],13000,12,'manual','diesel',2018,ARRAY['12 Seater','AC','Luggage Space'],4.6,18,false),
('coaster-saloon','Coaster Saloon','Toyota','coaster','Islamabad',ARRAY['/__l5e/assets-v1/d77e8495-96ff-429b-8d43-6c9a3695f006/car-grand-cabin.jpg'],30000,22,'manual','diesel',2019,ARRAY['Saloon Seats','AC','LED TV','Curtains'],4.6,18,false),
('vintage-classic','Vintage Classic','Vintage','vintage','Lahore',ARRAY['/__l5e/assets-v1/dbb255b7-aa39-463d-a555-f8f7f896c38e/car-rolls.jpg'],70000,4,'manual','petrol',1965,ARRAY['Classic Wedding Car','Decor Option','Chauffeur'],4.6,18,false),
('open-roof-jeep','Open Roof Jeep','Jeep','suv','Murree',ARRAY['/__l5e/assets-v1/b2005c87-411b-4657-bd6e-45f572d563de/car-prado.jpg'],24000,4,'manual','petrol',2019,ARRAY['Open Roof','4x4','Off-road Tyres'],4.6,18,false)
) AS v(slug,name,brand,cat_slug,city_name,images,price_per_day,seats,transmission,fuel,year,features,rating,review_count,is_featured)
WHERE NOT EXISTS (SELECT 1 FROM public.vehicles ev WHERE ev.slug = v.slug);

UPDATE public.vehicles v SET category_id = c.id
FROM public.categories c
WHERE v.category_id IS NULL AND c.slug = CASE
  WHEN v.slug IN ('rolls-royce-phantom','mercedes-s-class','range-rover-autobiography','audi-a6') THEN 'luxury'
  WHEN v.slug IN ('toyota-prado','toyota-fortuner') THEN 'suv'
  WHEN v.slug IN ('toyota-corolla','honda-civic') THEN 'sedan'
  WHEN v.slug = 'bmw-i8' THEN 'sports'
  WHEN v.slug = 'mercedes-limousine' THEN 'limousine'
  WHEN v.slug = 'toyota-grand-cabin' THEN 'grand-cabin'
  ELSE 'luxury' END;

UPDATE public.vehicles v SET city_id = (SELECT id FROM public.cities WHERE name = 'Islamabad')
WHERE v.city_id IS NULL;

INSERT INTO public.reviews (author_name, rating, comment, approved)
SELECT v.author_name, v.rating, v.comment, v.approved
FROM (VALUES
('Ahmed Raza',5,'Booked the Prado for a Murree trip. Spotless car, punctual chauffeur, zero issues.',true),
('Fatima Khan',5,'The Mercedes S-Class made our wedding entry perfect. Driver was very professional.',true),
('Bilal Ahmed',5,'Used their corporate monthly package for our team. Billing and service both clean.',true),
('Sana Malik',4,'Great airport pickup service, driver waited even though our flight was late.',true),
('Usman Tariq',5,'Rolls Royce Phantom for baraat — worth every rupee. Highly recommended.',true),
('Hina Shah',5,'Fortuner Legender was brand new and the rates were fair compared to others.',true)
) AS v(author_name,rating,comment,approved)
WHERE NOT EXISTS (SELECT 1 FROM public.reviews r WHERE r.author_name = v.author_name AND r.comment = v.comment);

CREATE OR REPLACE FUNCTION public.claim_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RETURN EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin' AND user_id = auth.uid());
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;

DROP POLICY IF EXISTS reviews_admin_all ON public.reviews;
CREATE POLICY reviews_admin_all ON public.reviews FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

GRANT SELECT ON public.categories, public.cities, public.deals, public.blog_posts, public.vehicles, public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories, public.cities, public.deals, public.blog_posts, public.vehicles, public.reviews TO authenticated;
GRANT ALL ON public.categories, public.cities, public.deals, public.blog_posts, public.vehicles, public.reviews TO service_role;