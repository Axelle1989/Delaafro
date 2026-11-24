# 🌿 DELAAFRO — Site Vitrine & E-commerce WhatsApp

> **« La noblesse du naturel, l’excellence du soin. »**  
> Marque béninoise de rituels capillaires naturels d'exception pour cheveux crépus (types 4A, 4B, 4C).  
> Direction artistique : **Or & Terre** (cuivre, or métallique, terracotta chaleureuse et crème soyeuse).

---

## ✨ Points Clés du Projet

- **100% WhatsApp Checkout** : Les commandes et paniers génèrent un message WhatsApp pré-formaté et encodé envoyé directement au numéro officiel béninois (`+229 45 48 34 73` / `22945483473`).
- **Direction Artistique & Design System** : Palette authentique *Or & Terre*, typographies contrastées (*Playfair Display*, *Cormorant Garamond* et *Plus Jakarta Sans*), micro-interactions soignées, reflets métalliques (*golden sheen*), animations 60 fps (Lenis smooth scroll, Framer Motion, parallaxe et curseur discret sur desktop).
- **Catalogue & Gammes** :
  - **Gamme Hydratation** (15 000 FCFA — 4 soins pour cheveux secs)
  - **Gamme Complète** (18 000 FCFA — routine royale 5 étoiles)
  - **Gamme Essentielle** (12 000 FCFA — les 3 piliers indispensables)
  - **Soins Individuels & Accessoires** : Brosses démêlantes souples (noir, violet, rose), brumisateurs continus 360°, ensembles nuit en satin de soie, peignes de traçage et flacons applicateurs gradués.
- **Pages Dédiées** :
  - `/nos-gammes` : Les 3 grands rituels complets avec composition détaillée
  - `/accessoires` : Grille filtrable avec sélecteur de teintes interactif
  - `/ma-routine` : Le Protocole en 4 Temps + Quiz capillaire interactif avec recommandation & bouton WhatsApp
  - `/livraison` : Grille des zones et frais d'expédition au Bénin + option Sachet Cadeau signature
  - `/a-propos` : L'histoire et les engagements botaniques de la marque
- **Panier & Emballage Cadeau** : Option sachet cadeau prestige avec visuel officiel, total dynamique et message WhatsApp complet.
- **Avis Clients Vérifiés** : Formulaire public avec anti-spam (honeypot + limitation 1 envoi/min), modération en 3 onglets dans l'admin (En attente, Publiés, Masqués) et avatar monogramme élégant par défaut.
- **Back-Office Admin Sécurisé (`/admin`)** :
  - Aucun lien visible sur le site public
  - Balise `noindex, nofollow`
  - Authentification Supabase Auth avec bouton afficher/masquer le mot de passe
  - Gestion des produits (teintes, porosité forte, photos à remplacer par packshot studio)

---

## 📁 Où ranger une nouvelle photo ?

Aucun fichier image ne doit être placé directement à la racine de `public/`. Rangez toute nouvelle photo dans le dossier approprié sous `public/products/` :

```text
public/
├── brand/                         (logos, monogramme, favicon)
└── products/
    ├── gammes/                    (photos d'ensemble des rituels)
    │   ├── kit-complet-sur-afro.jpg
    │   └── gamme-essentielle-trio.jpg
    ├── soins/
    │   ├── shampoing-doux/        (shampoing-doux-portrait.jpg)
    │   ├── spray-hydratant/       (spray-hydratant-en-main.jpg)
    │   ├── serum-forte-porosite/  (serum-gros-plan.jpg, vue dessus...)
    │   ├── baume-nourrissant/
    │   └── lait-capillaire/
    ├── accessoires/
    │   ├── kits/                  (kit-accessoires-noir.jpg, violet, rose...)
    │   ├── brumisateurs/          (brumisateurs-continus-multicolores.jpg...)
    │   ├── brosses-et-peignes/    (kit-brosses-et-peignes-coiffage-rose.jpg...)
    │   ├── massage-cuir-chevelu/  (brosses massantes silicone)
    │   ├── flacons-applicateurs/  (flacons-applicateurs-trio-couleurs.jpg...)
    │   └── scrunchies-et-pinces/  (scrunchies-satin-assortis.jpg...)
    ├── lifestyle/                 (photos en situation portées par des modèles, galerie)
    └── packaging/                 (sachet-cadeau-delaafro.jpg, emballages)
```

### Règle de nommage des fichiers
- En minuscules uniquement
- Kebab-case avec tirets (ex. `brumisateur-continu-rose.jpg`, `serum-gros-plan.jpg`)
- Sans espaces, sans accents, sans parenthèses `(1)`
- Variantes de couleur : suffixe `-noir`, `-violet`, `-rose`, etc.

### Script de vérification
Pour vérifier qu'aucune image n'est manquante ou cassée :
```bash
npm run check:images
```
Ce script est également exécuté automatiquement avant chaque build (`npm run build`).

---

## 🚀 Démarrage Rapide en Local

### 1. Prérequis
- Node.js version 18 ou supérieure
- npm version 9 ou supérieure

### 2. Installation et Lancement
```bash
# Cloner ou naviguer dans le dossier du projet
cd DELAFRO

# Installer les dépendances
npm install

# Lancer la vérification des images
npm run check:images

# Lancer le serveur de développement local
npm run dev
```

L'application est disponible immédiatement sur : **`http://localhost:5173`**  
L'espace d'administration sécurisé est sur : **`http://localhost:5173/admin`**

---

## 🔑 Accès à l'Administration (/admin)

### Mode Démo Local (sans Supabase)
Si aucune variable Supabase n'est présente dans `.env`, vous pouvez vous connecter avec n'importe quel email valide et un mot de passe de 6 caractères minimum.

### Mode Production avec Supabase
1. Créez votre projet sur [Supabase.com](https://supabase.com).
2. Dans le **SQL Editor**, exécutez `supabase/schema.sql` puis `supabase/seed.sql`.
3. Si vous aviez déjà des données antérieures, exécutez `supabase/migrations/update-image-paths.sql`.
4. Dans **Storage**, créez deux buckets publics :
   - `testimonials` (images des avis clients)
   - `product-images` (images produits uploadées depuis l'admin)
5. Dans **Authentication > Users**, créez votre utilisateur administrateur.
6. Renseignez votre fichier `.env` :
   ```env
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre-cle-anon
   ```

---

## 🌐 Déploiement sur Vercel

1. Poussez votre code sur GitHub.
2. Créez un nouveau projet sur [Vercel](https://vercel.com).
3. Renseignez les variables d'environnement `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`.
4. Cliquez sur **Deploy**. Le build vérifiera automatiquement les images et compilera le bundle.
