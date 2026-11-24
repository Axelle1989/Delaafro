-- ==============================================================================
-- DELAAFRO — Script de Seed Inicial (Données Réelles & Produits Officiels Bénin)
-- ==============================================================================

-- 1. INSÉRER LES CATÉGORIES
INSERT INTO public.categories (slug, name, description, display_order)
VALUES
    ('gammes', 'Gammes Complètes', 'Rituels complets synergiques de soins capillaires', 1),
    ('soins-individuels', 'Soins Individuels', 'Shampoing, spray, sérum et baume botaniques', 2),
    ('accessoires', 'Accessoires & Satin', 'Outils de coiffage doux et satins de nuit protecteurs', 3)
ON CONFLICT (slug) DO NOTHING;

-- 2. INSÉRER LES PRODUITS OFFICIELS
INSERT INTO public.products (
    id, name, slug, category, category_label, subtitle,
    short_description, long_description, composition, benefits,
    usage_instructions, price, original_price, images, variants,
    badge, is_featured, is_published, in_stock, display_order
)
VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'Gamme Complète DELAAFRO (5 Soins)',
    'gamme-complete',
    'gamme',
    'Rituel Royal 5 Soins',
    'La routine intégrale 5 soins : Shampoing Doux, Sérum Capillaire, Spray Hydratant, Baume Nourrissant & Leave-in Démêlant',
    'L’intégralité des 5 soins fondamentaux DELAAFRO : Shampoing Doux, Sérum Capillaire, Spray Hydratant, Baume Nourrissant et Leave-in Démêlant.',
    'Véritable célébration de la beauté crépue, la Gamme Complète DELAAFRO réunit les 5 soins indispensables de la marque formulés au Bénin : Shampoing Doux nettoyant, Sérum Capillaire fortifiant, Spray Hydratant rafraîchissant, Baume Nourrissant intense et Leave-in Démêlant protecteur.',
    ARRAY[
        'Shampoing Doux (Nettoie · Hydrate · Respecte le cuir chevelu)',
        'Sérum Capillaire (Forte porosité · Stimule la pousse)',
        'Spray Hydratant (Hydrate · Assouplit · Rafraîchit)',
        'Baume Nourrissant (Hydrate · Répare · Protège)',
        'Leave-in Démêlant (Démêle facilement · Hydrate intensément · Protège de la casse)'
    ],
    ARRAY[
        'Protocole 100% complet de la racine aux pointes',
        'Stop net à la casse et aux pointes abîmées',
        'Cheveux crépus 4A-4C souples, nourris et malléables',
        'Cuir chevelu sain et pousse active stimulée'
    ],
    'Suivre le rituel le jour du shampoing (wash day) puis entretenir au quotidien avec le spray, le leave-in et le baume.',
    18000,
    21500,
    ARRAY[
        '/products/gammes/gamme-complete-5-soins-alignes-2.jpg',
        '/products/gammes/gamme-complete-5-soins-pochette.jpg'
    ],
    '[]'::jsonb,
    'Coup de Cœur',
    true,
    true,
    true,
    1
),
(
    '00000000-0000-0000-0000-000000000002',
    'Gamme Hydratation (4 Soins)',
    'gamme-hydratation',
    'gamme',
    'Rituel 4 Soins',
    'Le rituel hydratant 4 soins : Shampoing Doux, Sérum Capillaire, Spray Hydratant & Baume Nourrissant',
    'Quatre soins synergiques pour restaurer la souplesse naturelle du cheveu crépu : Shampoing Doux, Sérum Capillaire, Spray Hydratant et Baume Nourrissant.',
    'Spécialement conçue pour enrayer la sécheresse chronique des cheveux crépus. L’association du shampoing protecteur, du spray désaltérant, du baume nourrissant réparateur et du sérum capillaire fortifiant offre une hydratation profonde et un toucher soyeux immédiat.',
    ARRAY[
        'Shampoing Doux (Nettoie · Hydrate · Respecte le cuir chevelu)',
        'Sérum Capillaire (Forte porosité · Stimule la pousse)',
        'Spray Hydratant (Hydrate · Assouplit · Rafraîchit)',
        'Baume Nourrissant (Hydrate · Répare · Protège)'
    ],
    ARRAY[
        'Hydratation profonde longue durée sans effet carton',
        'Démêlage tout en douceur sans arracher la fibre',
        'Nutrition intense des pointes et brillance naturelle satinée'
    ],
    'Laver le cuir chevelu avec le shampoing doux, vaporiser le spray sur les longueurs, sceller avec le baume nourrissant et masser le cuir chevelu avec le sérum capillaire.',
    15000,
    17500,
    ARRAY[
        '/products/gammes/gamme-hydratation-4-soins-officielle.jpg',
        '/products/gammes/gamme-hydratation-4-soins-pierre.jpg'
    ],
    '[]'::jsonb,
    'Best-seller',
    true,
    true,
    true,
    2
),
(
    '00000000-0000-0000-0000-000000000003',
    'Gamme Essentielle (3 Soins)',
    'gamme-essentielle',
    'gamme',
    'Rituel 3 Soins',
    'Le trio fondamental : Shampoing Doux, Sérum Capillaire & Baume Nourrissant',
    'Le trio indispensable composé du Shampoing Doux, du Sérum Capillaire fortifiant et du Baume Nourrissant intense.',
    'La formule épurée idéale pour celles qui recherchent une routine simple et redoutablement efficace : le Shampoing Doux pour purifier sans décaper, le Baume Nourrissant pour hydrater et réparer la fibre en profondeur, et le Sérum Capillaire pour stimuler la pousse saine et sceller l’hydratation.',
    ARRAY[
        'Shampoing Doux (Nettoie · Hydrate · Respecte le cuir chevelu)',
        'Sérum Capillaire (Forte porosité · Stimule la pousse)',
        'Baume Nourrissant (Hydrate · Répare · Protège)'
    ],
    ARRAY[
        'Les 3 piliers essentiels pour laver, nourrir et fortifier',
        'Assouplit instantanément la fibre crépue et prévient la casse',
        'Favorise la croissance saine et apporte une brillance éclatante'
    ],
    'Laver les cheveux avec le shampoing doux, appliquer le baume nourrissant pour sceller l’hydratation, puis masser le cuir chevelu avec le sérum capillaire.',
    12000,
    14000,
    ARRAY[
        '/products/gammes/gamme-essentielle-3-soins-officielle.jpg',
        '/products/gammes/gamme-essentielle-portrait-afro.jpg',
        '/products/gammes/gamme-essentielle-trio-sachet-transparent.jpg',
        '/products/gammes/gamme-essentielle-3-soins-pochette.jpg'
    ],
    '[]'::jsonb,
    'Promo',
    true,
    true,
    true,
    3
),
(
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
),
(
    '00000000-0000-0000-0000-000000000004',
    'Shampoing Doux Respectueux',
    'shampoing-doux',
    'soin',
    'Nettoyant Doux',
    'Nettoie · Hydrate · Respecte le cuir chevelu',
    'Mousse onctueuse formulée sans sulfates agressifs, pour un cuir chevelu propre et des longueurs respectées.',
    'Nettoie efficacement impuretés et dépôts tout en préservant le film hydrolipidique.',
    ARRAY['Base lavante douce végétale', 'Actifs botaniques adoucissants', 'Glycérine végétale'],
    ARRAY['Nettoie en douceur', 'Hydrate la fibre dès le lavage', 'Respecte le cuir chevelu sensible'],
    'Masser le cuir chevelu du bout des doigts puis rincer abondamment à l’eau tiède.',
    3500,
    NULL,
    ARRAY[
        '/products/soins/shampoing-doux/shampoing-doux-principale.jpg'
    ],
    '[]'::jsonb,
    'Best-seller',
    true,
    true,
    true,
    4
),
(
    '00000000-0000-0000-0000-000000000005',
    'Spray Hydratant Quotidien',
    'spray-hydratant',
    'soin',
    'Brume Désaltérante',
    'Hydrate · Assouplit · Rafraîchit',
    'Véritable rosée végétale pour réhydrater les cheveux crépus sans les détremper.',
    'La première étape indispensable de la routine.',
    ARRAY['Eau pure', 'Gel d’aloe vera frais', 'Extraits floraux bienfaisants'],
    ARRAY['Hydrate intensément', 'Assouplit la fibre crépue', 'Rafraîchit instantanément'],
    'Vaporiser uniformément sur l’ensemble de la chevelure avant le coiffage.',
    3500,
    NULL,
    ARRAY[
        '/products/soins/spray-hydratant/spray-hydratant-principale.jpg'
    ],
    '[]'::jsonb,
    'Best-seller',
    true,
    true,
    true,
    5
),
(
    '00000000-0000-0000-0000-000000000006',
    'Sérum Capillaire Fortifiant – Forte Porosité',
    'serum-capillaire',
    'soin',
    'Élixir Précieux',
    'Cheveux à forte porosité · Stimule la pousse',
    'Synergie d’huiles précieuses béninoises pour stimuler la microcirculation, nourrir les follicules et sceller l’hydratation.',
    'Formule adaptée aux cuticules ouvertes (forte porosité).',
    ARRAY['Huile de Ricin pure pressée à froid', 'Huiles végétales nobles', 'Extraits botaniques fortifiants'],
    ARRAY['Stimule la pousse et densifie', 'Scelle les pointes sans effet gras', 'Comble les cuticules ouvertes'],
    'Appliquer quelques gouttes à la racine et sur les pointes 3 fois par semaine.',
    4500,
    NULL,
    ARRAY[
        '/products/soins/serum-forte-porosite/serum-capillaire-principale.jpg'
    ],
    '[]'::jsonb,
    'Idéal cheveux à forte porosité',
    true,
    true,
    true,
    6
),
(
    '00000000-0000-0000-0000-000000000007',
    'Baume Nourrissant Intense',
    'baume-nourrissant',
    'soin',
    'Soin Protecteur Intense',
    'Hydrate · Répare · Protège',
    'Texture riche et onctueuse qui gaine la tige capillaire et protège durablement contre le dessèchement.',
    'Le soin cocon indispensable pour les pointes sèches et abîmées.',
    ARRAY['Beurre végétal pur béninois', 'Huiles douces nourrissantes', 'Actifs réparateurs'],
    ARRAY['Hydrate en profondeur', 'Répare la fibre abîmée', 'Protège des agressions climatiques'],
    'Chauffer une noisette entre les paumes et répartir des mi-longueurs aux pointes.',
    4500,
    NULL,
    ARRAY['/products/soins/baume-nourrissant/baume-nourrissant-principale.jpg'],
    '[]'::jsonb,
    'Best-seller',
    true,
    true,
    true,
    7
),
(
    '00000000-0000-0000-0000-000000000008',
    'Leave-in Démêlant Protecteur',
    'leave-in-demelant',
    'soin',
    'Soin Démêlant Quotidien',
    'Démêle facilement · Hydrate intensément · Protège de la casse',
    'Fluide onctueux sans rinçage qui glisse sur la fibre pour défaire les nœuds sans douleur et protéger la boucle.',
    'Le soin quotidien par excellence pour les textures 4A à 4C.',
    ARRAY['Extrait d’Aloe Vera pur', 'Huiles végétales douces béninoises', 'Actifs démêlants naturels'],
    ARRAY['Démêle facilement sans douleur', 'Hydrate intensément sans alourdir', 'Protège contre la casse'],
    'Appliquer sur cheveux humides ou secs section par section avant le démêlage.',
    4000,
    NULL,
    ARRAY[
        '/products/soins/leave-in-demelant/leave-in-demelant-principale.jpg'
    ],
    '[]'::jsonb,
    'Nouveau',
    true,
    true,
    true,
    8
),
(
    '00000000-0000-0000-0000-000000000009',
    'Kit Accessoires Capillaires Professionnel (8 pièces)',
    'kit-accessoires-complet',
    'accessoire',
    'Kit Professionnel Afro',
    'L’arsenal complet de coiffage doux : démêlage, brumisation, soin et satin',
    'Kit comprenant : Brumisateur 360°, Brosse démêlante souple aérée, Brosse stimulante cuir chevelu en silicone, Peignes professionnels, Chouchou satin et pinces.',
    'Conçu sur-mesure pour préserver les cheveux crépus de la casse.',
    ARRAY['Brumisateur 360°', 'Brosse démêlante aérée', 'Brosse silicone cuir chevelu', 'Peigne large à crochet', 'Peigne à queue', 'Chouchou satin'],
    ARRAY['Démêlage sans douleur', 'Brumisation 360° ultra-fine', 'Satin anti-casse'],
    'À utiliser au quotidien pour un démêlage et coiffage sans casse.',
    8500,
    11000,
    ARRAY[
        '/products/accessoires/kits/kit-accessoires-violet.jpg',
        '/products/accessoires/kits/kit-accessoires-noir.jpg',
        '/products/accessoires/kits/kit-accessoires-rose.jpg'
    ],
    '[
        {"name": "Noir Ébène Mat", "colorHex": "#1F1E1D", "image": "/products/accessoires/kits/kit-accessoires-noir.jpg", "inStock": true},
        {"name": "Violet / Lilas Royal", "colorHex": "#9B72CF", "image": "/products/accessoires/kits/kit-accessoires-violet.jpg", "inStock": true},
        {"name": "Rose Douceur", "colorHex": "#EAA9BA", "image": "/products/accessoires/kits/kit-accessoires-rose.jpg", "inStock": true}
    ]'::jsonb,
    'Coup de Cœur',
    true,
    true,
    true,
    9
)
ON CONFLICT (id) DO NOTHING;

-- 3. PARAMÈTRES GLOBAUX & WHATSAPP
INSERT INTO public.settings (key, value)
VALUES (
    'main',
    '{
        "whatsappNumber": "22945483473",
        "whatsappDisplayNumber": "+229 45 48 34 73",
        "announcementText": "✨ Livraison partout, même hors du Bénin • Frais et délais confirmés avec vous sur WhatsApp 🌍",
        "heroBadge": "Rituels Capillaires Naturels d’Exception",
        "heroTitle": "La noblesse du naturel, l’excellence du soin.",
        "heroSubtitle": "Révélez la beauté authentique et la vigueur de vos cheveux crépus grâce à des formulations botaniques béninoises gorgées d’actifs nobles.",
        "instagramUrl": "https://www.instagram.com/delaafro_",
        "facebookUrl": "https://www.facebook.com/dela.afro/",
        "snapchatUrl": "https://www.snapchat.com/@delaeliiiiii",
        "pinterestUrl": "https://www.pinterest.com/DelaAfro/",
        "tiktokUrl": "https://tiktok.com/@delaafro",
        "deliveryNotice": "Livraison partout, même hors du Bénin. Frais et délais confirmés avec vous sur WhatsApp selon votre destination.",
        "openingHours": "Lundi au Samedi : 08h00 – 19h30",
        "giftWrapPrice": 500,
        "giftWrapEnabled": true
    }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
