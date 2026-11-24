-- ==============================================================================
-- DELAAFRO — Migration : Ajout de la Gamme Locksés et Alignement des 4 Gammes
-- ==============================================================================

-- 1. Aligner la Gamme Complète (5 Soins - 18 000 FCFA)
UPDATE public.products
SET name = 'Gamme Complète DELAAFRO (5 Soins)',
    category_label = 'Rituel Royal 5 Soins',
    subtitle = 'La routine intégrale 5 soins : Shampoing Doux, Sérum Capillaire, Spray Hydratant, Baume Nourrissant & Leave-in Démêlant',
    short_description = 'L’intégralité des 5 soins fondamentaux DELAAFRO : Shampoing Doux, Sérum Capillaire, Spray Hydratant, Baume Nourrissant et Leave-in Démêlant.',
    long_description = 'Véritable célébration de la beauté crépue, la Gamme Complète DELAAFRO réunit les 5 soins indispensables de la marque formulés au Bénin : Shampoing Doux nettoyant, Sérum Capillaire fortifiant, Spray Hydratant rafraîchissant, Baume Nourrissant intense et Leave-in Démêlant protecteur.',
    composition = ARRAY[
        'Shampoing Doux (Nettoie · Hydrate · Respecte le cuir chevelu)',
        'Sérum Capillaire (Forte porosité · Stimule la pousse)',
        'Spray Hydratant (Hydrate · Assouplit · Rafraîchit)',
        'Baume Nourrissant (Hydrate · Répare · Protège)',
        'Leave-in Démêlant (Démêle facilement · Hydrate intensément · Protège de la casse)'
    ],
    price = 18000,
    original_price = 21500,
    images = ARRAY[
        '/products/gammes/gamme-complete-5-soins-officielle.jpg',
        '/products/gammes/gamme-complete-5-soins-alignes-2.jpg',
        '/products/gammes/gamme-complete-5-soins-pochette.jpg',
        '/products/gammes/gamme-complete-packshot.jpg'
    ],
    display_order = 1
WHERE slug = 'gamme-complete';

-- 2. Aligner la Gamme Hydratation (4 Soins - 15 000 FCFA)
UPDATE public.products
SET name = 'Gamme Hydratation (4 Soins)',
    category_label = 'Rituel 4 Soins',
    subtitle = 'Le rituel hydratant 4 soins : Shampoing Doux, Sérum Capillaire, Spray Hydratant & Baume Nourrissant',
    short_description = 'Quatre soins synergiques pour restaurer la souplesse naturelle du cheveu crépu : Shampoing Doux, Sérum Capillaire, Spray Hydratant et Baume Nourrissant.',
    long_description = 'Spécialement conçue pour enrayer la sécheresse chronique des cheveux crépus. L’association du shampoing protecteur, du spray désaltérant, du baume nourrissant réparateur et du sérum capillaire fortifiant offre une hydratation profonde et un toucher soyeux immédiat.',
    composition = ARRAY[
        'Shampoing Doux (Nettoie · Hydrate · Respecte le cuir chevelu)',
        'Sérum Capillaire (Forte porosité · Stimule la pousse)',
        'Spray Hydratant (Hydrate · Assouplit · Rafraîchit)',
        'Baume Nourrissant (Hydrate · Répare · Protège)'
    ],
    price = 15000,
    original_price = 17500,
    images = ARRAY[
        '/products/gammes/gamme-hydratation-4-soins-officielle.jpg',
        '/products/gammes/gamme-hydratation-4-soins-pierre.jpg',
        '/products/gammes/gamme-hydratation-packshot.jpg'
    ],
    display_order = 2
WHERE slug = 'gamme-hydratation';

-- 3. Aligner la Gamme Essentielle (3 Soins - 12 000 FCFA)
UPDATE public.products
SET name = 'Gamme Essentielle (3 Soins)',
    category_label = 'Rituel 3 Soins',
    subtitle = 'Le trio fondamental : Shampoing Doux, Sérum Capillaire & Baume Nourrissant',
    short_description = 'Le trio indispensable composé du Shampoing Doux, du Sérum Capillaire fortifiant et du Baume Nourrissant intense.',
    long_description = 'La formule épurée idéale pour celles qui recherchent une routine simple et redoutablement efficace : le Shampoing Doux pour purifier sans décaper, le Baume Nourrissant pour hydrater et réparer la fibre en profondeur, et le Sérum Capillaire pour stimuler la pousse saine et sceller l’hydratation.',
    composition = ARRAY[
        'Shampoing Doux (Nettoie · Hydrate · Respecte le cuir chevelu)',
        'Sérum Capillaire (Forte porosité · Stimule la pousse)',
        'Baume Nourrissant (Hydrate · Répare · Protège)'
    ],
    price = 12000,
    original_price = 14000,
    images = ARRAY[
        '/products/gammes/gamme-essentielle-3-soins-officielle.jpg',
        '/products/gammes/gamme-essentielle-portrait-afro.jpg',
        '/products/gammes/gamme-essentielle-trio-sachet-transparent.jpg',
        '/products/gammes/gamme-essentielle-3-soins-pochette.jpg',
        '/products/gammes/gamme-essentielle-packshot.jpg'
    ],
    display_order = 3
WHERE slug = 'gamme-essentielle';

-- 4. Insérer ou Mettre à jour la Gamme Locksés (3 Soins - 12 000 FCFA)
INSERT INTO public.products (
    id, name, slug, category, category_label, subtitle,
    short_description, long_description, composition, benefits,
    usage_instructions, price, original_price, images, variants,
    badge, is_featured, is_published, in_stock, display_order
)
VALUES (
    '00000000-0000-0000-0000-000000000010',
    'Gamme Locksés (3 Soins)',
    'gamme-lockses',
    'gamme',
    'Rituel Locksés',
    'Le trio dédié aux locks : Shampoing Doux, Sérum Capillaire & Spray Hydratant',
    'Le trio fondamental conçu spécifiquement pour l’entretien des cheveux locksés : Shampoing Doux sans résidus, Sérum Capillaire fortifiant et Spray Hydratant rafraîchissant.',
    'Pensée pour répondre aux besoins précis des locks, la Gamme Locksés DELAAFRO offre un rituel léger, nourrissant et purifiant formulé au Bénin. Le Shampoing Doux nettoie le cuir chevelu et les départs de locks sans laisser de résidus ni alourdir. Le Spray Hydratant désaltère, assouplit et rafraîchit la fibre entre les lavages. Le Sérum Capillaire nourrit le cuir chevelu en profondeur, apaise les tiraillements et stimule une pousse vigoureuse et saine.',
    ARRAY[
        'Shampoing Doux (Nettoie · Hydrate · Respecte le cuir chevelu)',
        'Sérum Capillaire (Forte porosité)',
        'Spray Hydratant (Hydrate · Assouplit · Rafraîchit)'
    ],
    ARRAY[
        'Nettoie efficacement le cuir chevelu sans laisser de dépôts ni résidus dans les locks',
        'Hydrate et rafraîchit les locks au quotidien pour éviter le dessèchement et la casse',
        'Nourrit le cuir chevelu en profondeur et stimule une croissance vigoureuse',
        'Formulation légère 100% végétale qui préserve la propreté et la légèreté des locks'
    ],
    'Laver le cuir chevelu et les locks avec le Shampoing Doux en massant délicatement, puis rincer abondamment. Au quotidien ou entre les lavages, vaporiser le Spray Hydratant sur toute la longueur des locks. Appliquer quelques gouttes de Sérum Capillaire directement sur le cuir chevelu 2 à 3 fois par semaine en massant doucement.',
    12000,
    NULL,
    ARRAY[
        '/products/gammes/gamme-lockses-trio-plateau.jpg'
    ],
    '[]'::jsonb,
    'Nouveau',
    true,
    true,
    true,
    4
)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    category_label = EXCLUDED.category_label,
    subtitle = EXCLUDED.subtitle,
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    composition = EXCLUDED.composition,
    benefits = EXCLUDED.benefits,
    usage_instructions = EXCLUDED.usage_instructions,
    price = EXCLUDED.price,
    images = EXCLUDED.images,
    badge = EXCLUDED.badge,
    is_featured = EXCLUDED.is_featured,
    is_published = EXCLUDED.is_published,
    in_stock = EXCLUDED.in_stock,
    display_order = EXCLUDED.display_order;

-- 5. Mettre à jour les paramètres de livraison internationaux
UPDATE public.settings
SET value = value || '{
    "announcementText": "✨ Livraison partout, même hors du Bénin • Frais et délais confirmés avec vous sur WhatsApp 🌍",
    "deliveryNotice": "Livraison partout, même hors du Bénin. Frais et délais confirmés avec vous sur WhatsApp selon votre destination."
}'::jsonb
WHERE key = 'main';
