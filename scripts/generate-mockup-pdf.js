import puppeteer from 'puppeteer-core';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = '/tmp/delaafro-mockups';

const PAGES = [
  {
    id: '01-accueil',
    title: "Page d'Accueil",
    path: '/',
    description: "Hero, Gammes, Produits vedettes, Routine en 4 etapes, Avis clientes, Footer",
    hasDesktop: true,
    hasMobile: true,
  },
  {
    id: '02-nos-gammes',
    title: 'Nos Gammes Capillaires',
    path: '/nos-gammes',
    description: "Affiche interactive, Gammes Complete, Hydratation, Essentielle et Lockses",
    hasDesktop: true,
    hasMobile: true,
  },
  {
    id: '03-boutique',
    title: 'Boutique (Catalogue Complet)',
    path: '/boutique',
    description: "Catalogue de tous les soins et gammes, filtres par categorie et prix en FCFA",
    hasDesktop: true,
    hasMobile: true,
  },
  {
    id: '04-accessoires',
    title: 'Accessoires & Protection',
    path: '/accessoires',
    description: "Bonnets en satin prestige, vaporisateurs 360, brosses demelantes et kits",
    hasDesktop: true,
    hasMobile: true,
  },
  {
    id: '05-produit-soin',
    title: 'Fiche Produit - Soin Individuel',
    path: '/produit/shampoing-doux',
    description: "Shampoing Doux au Savon Noir & Karite : galerie photos, bienfaits, conseils",
    hasDesktop: true,
    hasMobile: true,
  },
  {
    id: '06-produit-gamme',
    title: 'Fiche Produit - Gamme Complete',
    path: '/produit/gamme-complete',
    description: "Rituel complet 5 soins officiels : packshot, composition, commande WhatsApp",
    hasDesktop: true,
    hasMobile: true,
  },
  {
    id: '07-produit-accessoire',
    title: 'Fiche Produit - Accessoire',
    path: '/produit/bonnet-en-satin-prestige',
    description: "Bonnet Satin Reversible Double Face : selection des coloris, commande",
    hasDesktop: true,
    hasMobile: true,
  },
  {
    id: '08-routine',
    title: 'Ma Routine Capillaire',
    path: '/ma-routine',
    description: "Diagnostic de porosite (Forte / Faible), etapes pas-a-pas et soins conseilles",
    hasDesktop: true,
    hasMobile: true,
  },
  {
    id: '09-temoignages',
    title: 'Elles ont Sublime leur Afro',
    path: '/elles-ont-sublime-leur-afro',
    description: "Galerie de temoignages reels avec photos avant/apres et avis certifiees",
    hasDesktop: true,
    hasMobile: true,
  },
  {
    id: '10-a-propos',
    title: "A Propos - L'Ame de DELAAFRO",
    path: '/a-propos',
    description: "Manifeste fondateur, savoir-faire artisanal, piliers Terre Cuite / Or / Feuille",
    hasDesktop: true,
    hasMobile: true,
  },
  {
    id: '11-contact',
    title: 'Contact & Service Client',
    path: '/contact',
    description: "Conseils WhatsApp directs, expeditions Benin & international, FAQ complete",
    hasDesktop: true,
    hasMobile: true,
  },
  {
    id: '12-panier-mobile',
    title: 'Panier de Commande (Mobile)',
    path: '/panier',
    description: "Recapitulatif des soins choisis, emballage cadeau, saisie adresse & WhatsApp",
    hasDesktop: false,
    hasMobile: true,
  },
];

// Strip any character outside standard WinAnsi ASCII range (0x20 - 0x7E, plus common Latin1)
function safeText(str) {
  if (!str) return '';
  return str
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function buildPDF() {
  console.log('--- Assembling High-Resolution PDF ---');
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Colors
  const cBrunNuit = rgb(42 / 255, 20 / 255, 9 / 255);
  const cTerracotta = rgb(181 / 255, 83 / 255, 43 / 255);
  const cOr = rgb(232 / 255, 183 / 255, 126 / 255);
  const cCreme = rgb(248 / 255, 235 / 255, 221 / 255);
  const cWhite = rgb(1, 1, 1);

  // 1. COVER PAGE (1100 x 750 pt)
  const cover = pdfDoc.addPage([1100, 750]);
  const { width: cW, height: cH } = cover.getSize();

  // Background
  cover.drawRectangle({
    x: 0,
    y: 0,
    width: cW,
    height: cH,
    color: cBrunNuit,
  });

  // Top Gold accent
  cover.drawRectangle({
    x: 0,
    y: cH - 12,
    width: cW,
    height: 12,
    color: cOr,
  });

  // Inner border
  cover.drawRectangle({
    x: 40,
    y: 40,
    width: cW - 80,
    height: cH - 80,
    borderColor: cOr,
    borderWidth: 1.5,
  });

  // Eyebrow
  cover.drawText('MAISON DELAAFRO - COTONOU, BENIN', {
    x: 80,
    y: cH - 110,
    size: 15,
    font: fontBold,
    color: cOr,
  });

  // Main Title
  cover.drawText('DOSSIER DES MAQUETTES INTEGRALES DU SITE', {
    x: 80,
    y: cH - 160,
    size: 32,
    font: fontBold,
    color: cCreme,
  });

  // Subtitle
  cover.drawText(
    'Captures Haute Definition de toutes les pages - Vues Ordinateur (PC) & Telephone (Mobile) du haut en bas',
    {
      x: 80,
      y: cH - 195,
      size: 15,
      font: fontRegular,
      color: cOr,
    }
  );

  // Golden separator line
  cover.drawRectangle({
    x: 80,
    y: cH - 215,
    width: cW - 160,
    height: 2,
    color: cTerracotta,
  });

  // Sommaire Title
  cover.drawText('SOMMAIRE DES MAQUETTES :', {
    x: 80,
    y: cH - 250,
    size: 14,
    font: fontBold,
    color: cOr,
  });

  let curY = cH - 280;
  let colX = 80;

  PAGES.forEach((item, idx) => {
    if (idx === 6) {
      colX = cW / 2 + 20;
      curY = cH - 280;
    }

    const num = `${String(idx + 1).padStart(2, '0')}.`;
    cover.drawText(`${num} ${safeText(item.title)}`, {
      x: colX,
      y: curY,
      size: 13,
      font: fontBold,
      color: cWhite,
    });

    const routeText = `URL : ${item.path}  ${item.hasDesktop ? '[PC & Mobile]' : '[Mobile Seul]'}`;
    cover.drawText(safeText(routeText), {
      x: colX + 24,
      y: curY - 16,
      size: 10,
      font: fontRegular,
      color: cOr,
    });

    curY -= 45;
  });

  // Bottom Notice
  cover.drawText(
    'DELAAFRO - Soins Capillaires Naturels au Karite Brut & Huiles Botaniques Beninoises',
    {
      x: 80,
      y: 65,
      size: 11,
      font: fontRegular,
      color: rgb(200 / 255, 180 / 255, 160 / 255),
    }
  );

  // 2. EMBED EACH CAPTURE
  const capturesList = [];
  for (const page of PAGES) {
    if (page.hasDesktop) {
      const f = path.join(OUTPUT_DIR, `${page.id}-desktop.jpg`);
      if (fs.existsSync(f)) {
        capturesList.push({
          title: page.title,
          device: 'ORDINATEUR (PC)',
          path: page.path,
          file: f,
          isMobile: false,
        });
      }
    }
    if (page.hasMobile) {
      const f = path.join(OUTPUT_DIR, `${page.id}-mobile.jpg`);
      if (fs.existsSync(f)) {
        capturesList.push({
          title: page.title,
          device: 'TELEPHONE (MOBILE)',
          path: page.path,
          file: f,
          isMobile: true,
        });
      }
    }
  }

  console.log(`Found ${capturesList.length} captures to embed into PDF.`);

  let pageIndex = 1;
  const totalPages = capturesList.length + 1;

  for (const cap of capturesList) {
    pageIndex++;
    console.log(`Adding page [${pageIndex}/${totalPages}]: ${cap.title} (${cap.device})...`);

    const imgBytes = fs.readFileSync(cap.file);
    const embeddedImg = await pdfDoc.embedJpg(imgBytes);

    const headerHeight = 75;
    const pageWidth = cap.isMobile ? 650 : 1200;
    const imgDisplayWidth = pageWidth;
    const imgDisplayHeight = Math.round(embeddedImg.height * (imgDisplayWidth / embeddedImg.width));
    const pageHeight = imgDisplayHeight + headerHeight;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Header Background
    page.drawRectangle({
      x: 0,
      y: pageHeight - headerHeight,
      width: pageWidth,
      height: headerHeight,
      color: cBrunNuit,
    });

    // Top Accent line
    page.drawRectangle({
      x: 0,
      y: pageHeight - 4,
      width: pageWidth,
      height: 4,
      color: cap.isMobile ? cTerracotta : cOr,
    });

    // Bottom Accent line
    page.drawRectangle({
      x: 0,
      y: pageHeight - headerHeight,
      width: pageWidth,
      height: 2,
      color: cTerracotta,
    });

    // Device Badge
    const deviceBadge = cap.isMobile ? '[VUE TELEPHONE - MOBILE]' : '[VUE ORDINATEUR - PC]';
    page.drawText(safeText(deviceBadge), {
      x: 25,
      y: pageHeight - 24,
      size: cap.isMobile ? 11 : 12,
      font: fontBold,
      color: cap.isMobile ? cTerracotta : cOr,
    });

    // Page Title
    page.drawText(safeText(`DELAAFRO - ${cap.title}`), {
      x: 25,
      y: pageHeight - 46,
      size: cap.isMobile ? 17 : 22,
      font: fontBold,
      color: cWhite,
    });

    // Route Info
    const infoText = `Route : https://delaafro.com${cap.path}  |  Capture integrale du haut en bas  |  Page ${pageIndex} sur ${totalPages}`;
    page.drawText(safeText(infoText), {
      x: 25,
      y: pageHeight - 64,
      size: cap.isMobile ? 9 : 11,
      font: fontRegular,
      color: cCreme,
    });

    // Full page image
    page.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: imgDisplayWidth,
      height: imgDisplayHeight,
    });
  }

  console.log('--- Saving PDF ---');
  const pdfBytes = await pdfDoc.save();

  const finalPdfProject = '/home/axelle/DELAFRO/MAQUETTE_DELAAFRO_PC_ET_MOBILE.pdf';
  const finalPdfArtifact = '/home/axelle/.gemini/antigravity/brain/1a5dfa92-0467-499a-824a-3aa781150dcd/MAQUETTE_DELAAFRO_PC_ET_MOBILE.pdf';

  fs.writeFileSync(finalPdfProject, pdfBytes);
  fs.writeFileSync(finalPdfArtifact, pdfBytes);

  const stats = fs.statSync(finalPdfProject);
  console.log(`\n========================================`);
  console.log(`PDF GENERATION TERMINEE AVEC SUCCES !`);
  console.log(`========================================`);
  console.log(`Fichier Projet : ${finalPdfProject}`);
  console.log(`Fichier Artifact : ${finalPdfArtifact}`);
  console.log(`Taille totale : ${(stats.size / 1024 / 1024).toFixed(2)} Mo`);
  console.log(`Nombre total de pages : ${totalPages}`);
}

buildPDF().catch((err) => {
  console.error('Erreur lors de la creation du PDF:', err);
  process.exit(1);
});
