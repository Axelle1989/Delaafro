-- ==============================================================================
-- DELAAFRO — Ajout complet du catalogue Accessoires dans Supabase
-- Exécuter dans Supabase > SQL Editor > New query > Run
-- ==============================================================================

INSERT INTO public.products (
    id, name, slug, category, category_label, subtitle,
    short_description, long_description, composition, benefits,
    usage_instructions, price, original_price, images, variants,
    badge, is_featured, is_published, in_stock, display_order
)
VALUES
(
    '00000000-0000-0000-0000-000000000010',
    'Brumisateur Continu 360° Ultra-Fin',
    'brumisateur-continu-360',
    'accessoire',
    'Accessoire Quotidien',
    'Brume ultra-fine en continu pour une hydratation uniforme sans goutter',
    'Flacon ergonomique haute pression délivrant un nuage de micro-gouttelettes même tête en bas.',
    'Une seule pression prolongée libère un jet continu de plusieurs secondes. Idéal pour vos mélanges d’eau de source et lotion hydratante.',
    ARRAY[]::text[],
    ARRAY['Diffusion 360° même inversé', 'Brumisation continue ultra-légère', 'Flacon étanche et résistant'],
    'Remplir avec de l’eau minérale ou lotion florale et vaporiser chaque matin.',
    3000,
    NULL,
    ARRAY[
        '/products/accessoires/brumisateurs/brumisateurs-continus-multicolores.jpg',
        '/products/accessoires/kits/kit-accessoires-noir.jpg',
        '/products/accessoires/kits/kit-accessoires-violet.jpg'
    ],
    '[
        {"name": "Multicolore Pastel", "colorName": "Pastel", "colorHex": "#D99A6C", "image": "/products/accessoires/brumisateurs/brumisateurs-continus-multicolores.jpg", "inStock": true},
        {"name": "Noir Ébène", "colorName": "Noir Ébène", "colorHex": "#1F1E1D", "image": "/products/accessoires/kits/kit-accessoires-noir.jpg", "inStock": true},
        {"name": "Violet Lilas", "colorName": "Violet Lilas", "colorHex": "#9B72CF", "image": "/products/accessoires/kits/kit-accessoires-violet.jpg", "inStock": true}
    ]'::jsonb,
    NULL,
    false,
    true,
    true,
    10
),
(
    '00000000-0000-0000-0000-000000000011',
    'Flacons Applicateurs à Peigne Intégré (Trio)',
    'flacons-applicateurs-trio',
    'accessoire',
    'Application Précise',
    'Application directe et uniforme des huiles et lotions sur le cuir chevelu',
    'Flacons gradués avec embout peigne multi-dents pour distribuer vos soins au plus près des racines sans en mettre sur les longueurs.',
    'Parfait pour appliquer le sérum fortifiant ou vos bains d’huiles directement sur le cuir chevelu tout en coiffant délicatement.',
    ARRAY[]::text[],
    ARRAY['Distribution propre et ciblée', 'Graduations précises en ml', 'Idéal nattes, tresses et locks'],
    'Verser l’huile ou la lotion dans le flacon, visser le peigne et presser délicatement en traçant des raies.',
    3000,
    NULL,
    ARRAY[
        '/products/accessoires/flacons-applicateurs/flacons-applicateurs-peigne-trio.jpg',
        '/products/accessoires/flacons-applicateurs/flacons-applicateurs-trio-couleurs.jpg'
    ],
    '[
        {"name": "Bleu Ciel", "colorName": "Bleu", "colorHex": "#2596BE", "image": "/products/accessoires/flacons-applicateurs/flacons-applicateurs-peigne-trio.jpg", "inStock": true},
        {"name": "Rose Fuchsia", "colorName": "Rose", "colorHex": "#FF1493", "image": "/products/accessoires/flacons-applicateurs/flacons-applicateurs-peigne-trio.jpg", "inStock": true},
        {"name": "Violet Royal", "colorName": "Violet", "colorHex": "#8E44AD", "image": "/products/accessoires/flacons-applicateurs/flacons-applicateurs-peigne-trio.jpg", "inStock": true}
    ]'::jsonb,
    'Nouveau',
    true,
    true,
    true,
    11
),
(
    '00000000-0000-0000-0000-000000000012',
    'Chouchous en Satin Protecteur (Assortiment)',
    'scrunchies-satin-assortis',
    'accessoire',
    'Protection Anti-Casse',
    'Maintien doux sans frottement ni traction sur la fibre',
    'Lot de chouchous en satin doux haute densité, idéaux pour attacher vos cheveux sans casser les pointes ni marquer les longueurs.',
    'Le satin préserve le film lipidique de vos cheveux crépus contrairement au coton qui absorbe l’hydratation. Indispensable pour la méthode ananas (pineapple) avant le coucher.',
    ARRAY[]::text[],
    ARRAY['Zéro casse à l’attache', 'Conserve l’hydratation', 'Élastique interne résistant et doux'],
    'Utiliser au quotidien pour vos chignons, afro puffs ou pour protéger vos longueurs la nuit.',
    2000,
    NULL,
    ARRAY[
        '/products/accessoires/scrunchies-et-pinces/scrunchies-satin-assortis.jpg'
    ],
    '[
        {"name": "Teintes Chocolat & Caramel", "colorName": "Chocolat", "colorHex": "#8A3A1A", "image": "/products/accessoires/scrunchies-et-pinces/scrunchies-satin-assortis.jpg", "inStock": true}
    ]'::jsonb,
    NULL,
    false,
    true,
    true,
    12
),
(
    '00000000-0000-0000-0000-000000000013',
    'Kit Coiffage Précision & Bordures',
    'kit-brosses-peignes-coiffage',
    'accessoire',
    'Accessoire Coiffage',
    'Peigne à queue métal, brosse edge control et peigne de traçage',
    'Trio indispensable pour des tracés nets, des nattes impeccables et des bordures (baby hair) parfaitement sculptées.',
    'Ce set permet de réaliser des séparations nettes au millimètre près pour vos tresses ou vanilles, et de fixer vos petits cheveux de bordure en douceur.',
    ARRAY[]::text[],
    ARRAY['Tracés de raies nets et précis', 'Brosse spéciale bordures douce', 'Pinces professionnelles incluses'],
    'Utiliser le peigne à queue métallique pour tracer les raies, puis la brosse fine pour coucher les bordures avec une touche de baume.',
    2500,
    NULL,
    ARRAY[
        '/products/accessoires/brosses-et-peignes/kit-brosses-et-peignes-coiffage-rose.jpg'
    ],
    '[]'::jsonb,
    'Best-seller',
    true,
    true,
    true,
    13
),
(
    '00000000-0000-0000-0000-000000000014',
    'Brosse Démêlante Ergonomique Ajourée',
    'brosse-demelante-ergonomique',
    'accessoire',
    'Accessoire Délicat',
    'Picots souples et corps aéré qui glissent à travers les nœuds sans casser',
    'L’accessoire incontournable pour respecter l’élasticité naturelle du cheveu crépu 3C à 4C.',
    'Sa structure alvéolée brevetée et ses picots flexibles s’écartent délicatement lorsqu’ils rencontrent une résistance.',
    ARRAY[]::text[],
    ARRAY['Zéro douleur au démêlage', 'Sèche rapidement et se nettoie en un clin d’œil', 'Manche ergonomique antidérapant'],
    'Toujours utiliser sur cheveux imprégnés d’eau et de spray ou baume en partant des pointes vers les racines.',
    2500,
    NULL,
    ARRAY[
        '/products/accessoires/kits/kit-accessoires-rose.jpg',
        '/products/accessoires/kits/kit-accessoires-violet.jpg',
        '/products/accessoires/kits/kit-accessoires-noir.jpg'
    ],
    '[
        {"name": "Rose Douceur", "colorName": "Rose Douceur", "colorHex": "#EAA9BA", "image": "/products/accessoires/kits/kit-accessoires-rose.jpg", "inStock": true},
        {"name": "Violet / Lilas", "colorName": "Violet / Lilas", "colorHex": "#9B72CF", "image": "/products/accessoires/kits/kit-accessoires-violet.jpg", "inStock": true},
        {"name": "Noir Ébène", "colorName": "Noir Ébène", "colorHex": "#1F1E1D", "image": "/products/accessoires/kits/kit-accessoires-noir.jpg", "inStock": true}
    ]'::jsonb,
    'Best-seller',
    true,
    true,
    true,
    14
),
(
    '00000000-0000-0000-0000-000000000015',
    'Kit Coiffage Complet Violet & Pince Fleur (6 pièces)',
    'kit-accessoires-violet-fleur',
    'accessoire',
    'Kit Coiffage Violet',
    'Brumisateur 360°, brosse démêlante souple, brosse plate, brosse baby hair, peigne à queue & pince fleur',
    'Coffret complet assorti en violet lilas : tout le nécessaire pour hydrater, démêler sans casse, tracer et fixer vos coiffures afro.',
    'Ce kit 6 pièces harmonisé réunit nos outils les plus demandés : un brumisateur continu 360° violet, une brosse démêlante souple ajourée, une brosse plate lissante, une brosse double face spéciale bordures (baby hair), un peigne à queue métallique et une pince fleur maintien doux.',
    ARRAY['Brumisateur continu 360° violet dégradé', 'Brosse démêlante souple ajourée violette', 'Brosse plate anti-statique', 'Brosse double face bordures & baby hair', 'Peigne à queue fine tige métallique', 'Grande pince fleur violette maintien doux'],
    ARRAY['Set 6 pièces assorti prêt à l’emploi', 'Démêlage doux et brumisation homogène', 'Idéal pour les wash days et coiffures protectrices'],
    'Humidifier les longueurs avec le brumisateur 360°, séparer avec la pince fleur et le peigne à queue, puis démêler en douceur des pointes vers les racines.',
    7500,
    9000,
    ARRAY[
        '/products/accessoires/kits/kit-coiffage-complet-violet-pince.jpg'
    ],
    '[
        {"name": "Violet Lilas & Fleur", "colorName": "Violet", "colorHex": "#9B72CF", "image": "/products/accessoires/kits/kit-coiffage-complet-violet-pince.jpg", "inStock": true}
    ]'::jsonb,
    'Nouveau',
    true,
    true,
    true,
    15
),
(
    '00000000-0000-0000-0000-000000000016',
    'Peigne Démêlant Dents Larges Spécial Afro',
    'peigne-demelant-dents-larges',
    'accessoire',
    'Démêlage Sans Casse',
    'Dents larges arrondies qui glissent sur les boucles et cheveux crépus 4A–4C',
    'Peigne robuste à dents larges espacées pour démêler sous la douche ou sur cheveux hydratés sans tirer ni casser la fibre.',
    'Indispensable de toute routine afro, ce peigne à dents larges limite les frottements mécaniques et préserve la définition naturelle de vos boucles. Disponible en plusieurs teintes vibrantes et classiques.',
    ARRAY[]::text[],
    ARRAY['Dents larges lisses anti-accrochage', 'Réduit la casse lors du wash day', 'Manche ergonomique ou format poche au choix'],
    'Toujours démêler par sections sur cheveux humidifiés avec le spray ou le leave-in, en commençant par les pointes.',
    1500,
    NULL,
    ARRAY[
        '/products/accessoires/brosses-et-peignes/peignes-demelants-dents-larges-duo.jpg',
        '/products/accessoires/brosses-et-peignes/peignes-dents-larges-multicolores.jpg'
    ],
    '[
        {"name": "Noir Classique", "colorName": "Noir", "colorHex": "#1F1E1D", "image": "/products/accessoires/brosses-et-peignes/peignes-demelants-dents-larges-duo.jpg", "inStock": true},
        {"name": "Rose Fuchsia", "colorName": "Rose", "colorHex": "#E91E8C", "image": "/products/accessoires/brosses-et-peignes/peignes-demelants-dents-larges-duo.jpg", "inStock": true},
        {"name": "Turquoise / Menthe", "colorName": "Turquoise", "colorHex": "#48C9B0", "image": "/products/accessoires/brosses-et-peignes/peignes-dents-larges-multicolores.jpg", "inStock": true},
        {"name": "Violet Lilas", "colorName": "Violet", "colorHex": "#9B72CF", "image": "/products/accessoires/brosses-et-peignes/peignes-dents-larges-multicolores.jpg", "inStock": true},
        {"name": "Jaune Soleil", "colorName": "Jaune", "colorHex": "#F4D03F", "image": "/products/accessoires/brosses-et-peignes/peignes-dents-larges-multicolores.jpg", "inStock": true},
        {"name": "Rose Pastel", "colorName": "Rose Pastel", "colorHex": "#F7A8C8", "image": "/products/accessoires/brosses-et-peignes/peignes-dents-larges-multicolores.jpg", "inStock": true}
    ]'::jsonb,
    'Nouveau',
    true,
    true,
    true,
    16
),
(
    '00000000-0000-0000-0000-000000000017',
    'Peigne Afro Volume (Afro Pick)',
    'peigne-afro-volume-pick',
    'accessoire',
    'Volume & Mise en Forme',
    'Dents longues spéciales pour soulever les racines et sculpter un afro majestueux',
    'Le peigne afro iconique pour décoller les racines et donner du volume instantané à votre couronne sans défaire vos boucles.',
    'Conçu pour épouser la densité des cheveux crépus et frisés, cet Afro Pick soulève délicatement la base du cheveu afin d’apporter rondeur, hauteur et harmonie à votre afro en quelques gestes.',
    ARRAY[]::text[],
    ARRAY['Apporte un volume immédiat dès la racine', 'Respecte la forme des boucles aux pointes', 'Léger, solide et facile à glisser dans un sac'],
    'Insérer le peigne à la racine et soulever délicatement vers le haut sans tirer jusqu’aux pointes.',
    1500,
    NULL,
    ARRAY[
        '/products/accessoires/brosses-et-peignes/peigne-afro-volume-pick.jpg'
    ],
    '[
        {"name": "Noir Ébène", "colorName": "Noir", "colorHex": "#1F1E1D", "image": "/products/accessoires/brosses-et-peignes/peigne-afro-volume-pick.jpg", "inStock": true},
        {"name": "Rose Doux", "colorName": "Rose", "colorHex": "#F4A3B8", "image": "/products/accessoires/brosses-et-peignes/peigne-afro-volume-pick.jpg", "inStock": true}
    ]'::jsonb,
    'Coup de Cœur',
    true,
    true,
    true,
    17
),
(
    '00000000-0000-0000-0000-000000000018',
    'Ensemble Bandeaux & Chouchous en Satin Doux',
    'ensemble-bandeaux-chouchous-satin',
    'accessoire',
    'Satin & Élégance',
    'Bandeaux larges et chouchous satinés aux teintes neutres & chocolat',
    'Collection chic de bandeaux souples et chouchous en satin (Noir, Chocolat, Caramel, Crème, Blanc) pour protéger vos bordures avec style.',
    'Alliez protection capillaire et élégance au quotidien. Nos bandeaux larges maintiennent les cheveux sans comprimer les tempes, tandis que les chouchous en satin glissent sur la fibre sans jamais provoquer de casse.',
    ARRAY[]::text[],
    ARRAY['Protège les bordures et les tempes sans tension', 'Satin doux qui n’absorbe pas l’hydratation', 'Teintes neutres faciles à assortir à toutes vos tenues'],
    'Porter le bandeau pour dégager le visage avec élégance ou fixer vos bordures après application du soin, et utiliser les chouchous pour vos chignons et coiffures de nuit.',
    2500,
    NULL,
    ARRAY[
        '/products/accessoires/scrunchies-et-pinces/ensemble-bandeaux-chouchous-satin.jpg'
    ],
    '[
        {"name": "Noir Ébène", "colorName": "Noir", "colorHex": "#1A1A1A", "image": "/products/accessoires/scrunchies-et-pinces/ensemble-bandeaux-chouchous-satin.jpg", "inStock": true},
        {"name": "Chocolat Intense", "colorName": "Chocolat", "colorHex": "#4A2C1D", "image": "/products/accessoires/scrunchies-et-pinces/ensemble-bandeaux-chouchous-satin.jpg", "inStock": true},
        {"name": "Caramel Doré", "colorName": "Caramel", "colorHex": "#B67B43", "image": "/products/accessoires/scrunchies-et-pinces/ensemble-bandeaux-chouchous-satin.jpg", "inStock": true},
        {"name": "Crème & Blanc Perle", "colorName": "Crème", "colorHex": "#F3E8DC", "image": "/products/accessoires/scrunchies-et-pinces/ensemble-bandeaux-chouchous-satin.jpg", "inStock": true}
    ]'::jsonb,
    'Nouveau',
    true,
    true,
    true,
    18
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    category_label = EXCLUDED.category_label,
    subtitle = EXCLUDED.subtitle,
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    composition = EXCLUDED.composition,
    benefits = EXCLUDED.benefits,
    usage_instructions = EXCLUDED.usage_instructions,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    images = EXCLUDED.images,
    variants = EXCLUDED.variants,
    badge = EXCLUDED.badge,
    is_featured = EXCLUDED.is_featured,
    is_published = EXCLUDED.is_published,
    in_stock = EXCLUDED.in_stock,
    display_order = EXCLUDED.display_order;
