-- ==============================================================================
-- DELAAFRO — Migration de mise à jour des chemins d'images officiels
-- ==============================================================================

-- 1. Mise à jour des images de la Gamme Complète (5 Soins - 18 000 FCFA)
UPDATE public.products
SET name = 'Gamme Complète DELAAFRO (5 Soins)',
    subtitle = 'La routine intégrale 5 soins : Shampoing, Leave-in, Spray, Huile de Pousse & Beurre',
    price = 18000,
    original_price = 21500,
    images = ARRAY[
    '/products/gammes/gamme-complete-5-soins-officielle.jpg',
    '/products/gammes/gamme-complete-5-soins-pochette.jpg',
    '/products/gammes/gamme-complete-5-soins-alignes.jpg',
    '/products/gammes/gamme-complete-packshot.jpg'
]
WHERE slug = 'gamme-complete';

-- 2. Mise à jour des images de la Gamme Hydratation (4 Soins - 15 000 FCFA)
UPDATE public.products
SET name = 'Gamme Hydratation Intense (4 Soins)',
    subtitle = 'Infusion désaltérante : Shampoing, Beurre, Huile Unique & Spray',
    price = 15000,
    original_price = 17500,
    images = ARRAY[
    '/products/gammes/gamme-hydratation-4-soins-officielle.jpg',
    '/products/gammes/gamme-hydratation-packshot.jpg',
    '/products/gammes/kit-complet-sur-afro.jpg'
]
WHERE slug = 'gamme-hydratation';

-- 3. Mise à jour des images de la Gamme Essentielle (3 Soins - 12 000 FCFA)
UPDATE public.products
SET name = 'Gamme Essentielle (3 Soins)',
    subtitle = 'Le trio fondamental : Shampoing Doux, Baume Nourrissant & Sérum Capillaire',
    price = 12000,
    original_price = 14000,
    images = ARRAY[
    '/products/gammes/gamme-essentielle-3-soins-officielle.jpg',
    '/products/gammes/gamme-essentielle-3-soins-pochette.jpg',
    '/products/gammes/gamme-essentielle-3-soins-sachet.jpg',
    '/products/gammes/gamme-essentielle-packshot.jpg'
]
WHERE slug = 'gamme-essentielle';

-- 4. Mise à jour du Shampoing Doux
UPDATE public.products
SET images = ARRAY[
    '/products/soins/shampoing-doux/shampoing-doux-principale.jpg'
]
WHERE slug = 'shampoing-doux';

-- 5. Mise à jour du Spray Hydratant
UPDATE public.products
SET name = 'Spray Hydratant Quotidien',
    subtitle = 'Hydrate · Assouplit · Rafraîchit au quotidien',
    images = ARRAY[
        '/products/soins/spray-hydratant/spray-hydratant-principale.jpg'
    ]
WHERE slug = 'spray-hydratant' OR slug = 'lait-capillaire';

-- 6. Mise à jour du Sérum Capillaire (Forte Porosité)
UPDATE public.products
SET name = 'Sérum Capillaire Fortifiant – Forte Porosité',
    subtitle = 'Spécialement formulé pour cheveux à forte porosité · Stimule la pousse',
    badge = 'Idéal cheveux à forte porosité',
    images = ARRAY[
        '/products/soins/serum-forte-porosite/serum-capillaire-principale.jpg'
    ]
WHERE slug = 'serum-capillaire';

-- 7. Mise à jour du Baume Nourrissant
UPDATE public.products
SET name = 'Baume Nourrissant Intense (Beurre Capillaire)',
    subtitle = 'Nourrit · Répare · Assouplit',
    images = ARRAY[
        '/products/soins/baume-nourrissant/baume-nourrissant-principale.jpg'
    ]
WHERE slug = 'baume-nourrissant';

-- 8. Mise à jour du Leave-in Démêlant
UPDATE public.products
SET name = 'Leave-in Démêlant Protecteur',
    subtitle = 'Démêle facilement · Hydrate intensément · Protège de la casse',
    images = ARRAY[
        '/products/soins/leave-in-demelant/leave-in-demelant-principale.jpg'
    ]
WHERE slug = 'leave-in-demelant';

-- 9. Mise à jour du Kit Accessoires
UPDATE public.products
SET images = ARRAY[
    '/products/accessoires/kits/kit-accessoires-violet.jpg',
    '/products/accessoires/kits/kit-accessoires-noir.jpg',
    '/products/accessoires/kits/kit-accessoires-rose.jpg'
],
variants = '[
    {"name": "Noir Ébène Mat", "colorHex": "#1F1E1D", "image": "/products/accessoires/kits/kit-accessoires-noir.jpg", "inStock": true},
    {"name": "Violet / Lilas Royal", "colorHex": "#9B72CF", "image": "/products/accessoires/kits/kit-accessoires-violet.jpg", "inStock": true},
    {"name": "Rose Douceur", "colorHex": "#EAA9BA", "image": "/products/accessoires/kits/kit-accessoires-rose.jpg", "inStock": true}
]'::jsonb
WHERE slug = 'kit-accessoires-complet';

