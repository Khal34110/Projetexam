export const API_ROOT = "http://localhost:3000";
export const API_URL = API_ROOT + "/api/events";
export const DEFAULT_IMAGE =
  "../image/occitanie-rando-randonnee-herault-puechabon-balcons-herault-30-1024x768.webp";

const WIKIMEDIA_FILE_PATH_URL =
  "https://commons.wikimedia.org/wiki/Special:FilePath/";

function construireImageWikimedia(nomFichier) {
  return WIKIMEDIA_FILE_PATH_URL + encodeURIComponent(nomFichier);
}

function construireGalerieWikimedia(nomsFichiers) {
  const galerie = [];

  for (let index = 0; index < nomsFichiers.length; index += 1) {
    galerie.push(construireImageWikimedia(nomsFichiers[index]));
  }

  return galerie;
}

function fusionnerGaleries(galerieLocale, galerieWeb) {
  const galerie = [];
  const listes = [galerieLocale || [], galerieWeb || []];

  for (let index = 0; index < listes.length; index += 1) {
    const liste = listes[index];

    for (let i = 0; i < liste.length; i += 1) {
      const image = String(liste[i] || "").trim();

      if (image === "") {
        continue;
      }

      if (!galerie.includes(image)) {
        galerie.push(image);
      }
    }
  }

  return galerie;
}

const GALERIE_SALAGOU_WEB = construireGalerieWikimedia([
  "257 Lac de Salagou au sud de Lodève.JPG",
  "98LacDuSalagou01.jpg",
  "Basaltic Columns at Lac du Salagou in France.jpg",
  "Celles (34) vue sur le lac du Salagou.jpg",
  "Le Lac du Salagou et les collines rouges environnantes.jpg",
]);

const GALERIE_LABEIL_WEB = construireGalerieWikimedia([
  "Cirque de Labeil Panorama-Sud.jpg",
  "Grotte de Labeil P1010534mod.jpg",
]);

const GALERIE_MOUREZE_WEB = construireGalerieWikimedia([
  "Mourèze.jpg",
  "Mourèze Roch.JPG",
]);

const GALERIE_THAU_WEB = construireGalerieWikimedia([
  "Étang de Thau, Sète cf01.jpg",
  "Coucher de soleil sur l'étang de Thau.jpg",
  "Dawn on Sète and the Étang de Thau.jpg",
  "Lido de Thau, Sète, Hérault 01.jpg",
  "Sunrise on the Étang de Thau.jpg",
]);

const GALERIE_MINERVOIS_WEB = construireGalerieWikimedia([
  "Vigne Minervois.jpg",
  "Wineyards in Peyriac-Minervois.jpg",
  "Vineyards, Minerve cf01.jpg",
  "Vineyards, Minerve cf02.jpg",
  "House and vineyards, Minerve cf01.jpg",
]);

const GALERIE_NAVACELLES_WEB = construireGalerieWikimedia([
  "Cirque-de-navacelles.JPG",
  "Cirque de Navacelles.jpg",
  "Cirque de Navacelles (7).jpg",
  "Cirque de Navacelles 838-840mod.jpg",
  "Cirque de Navacelles 402-403mod.jpg",
]);

const GALERIE_PIC_SAINT_LOUP_WEB = construireGalerieWikimedia([
  "11 lzn (2531949880).jpg",
  "197 Le pic Saint-Loup et la montagne d'Hortus 1 (vus depuis le Mas de Bouis).JPG",
  "199 Le pic Saint-Loup vu depuis la route entre Saint-Martin-de-Londres et Saint-Mathieu-de-Tréviers.JPG",
  "Croix pic St Loup.jpg",
]);

const GALERIE_SAINT_GUILHEM_WEB = construireGalerieWikimedia([
  "Vue village Saint-Guilhem-le-Désert.jpg",
  "Ancien Moulin de l'Abbaye de Saint-Guilhem-le-Désert.jpg",
  "Autre vue du Cirque de l'Infernet.jpg",
  "Font Chaude 850-852mod.jpg",
  "Vue sur la cascade et l'abbaye de Saint-Guilhem-le-Désert.jpg",
]);

const GALERIE_MONTPELLIER_NUIT_WEB = construireGalerieWikimedia([
  "Montpellier at night (19418833568).jpg",
  "Comedie, Montpellier with fountain (14080865470).jpg",
  "Montpellier Comedie illuminee.jpg",
  "Montpellier Antigone Nuit.jpg",
  "Château d'eau du Peyrou (4325552758).jpg",
]);

const GALERIE_CANAL_MIDI_WEB = construireGalerieWikimedia([
  "Canal-du-Midi.jpg",
  "Canal du Midi, Villeneuve-lès-Béziers.jpg",
  "Pont-Canal de l'Orb, Béziers.JPG",
  "Béziers Péniche et ses barriques Canal du Midi.jpg",
  "Sète canal du Midi.jpg",
]);

const GALERIE_CAROUX_WEB = construireGalerieWikimedia([
  "Massif du Caroux, Saint-Martin-de-l'Arçon, Hérault.jpg",
  "Ascension dans le massif du Caroux.jpg",
  "Caroux 1.jpg",
]);

const GALERIE_MONTAGNE_NOIRE_WEB = construireGalerieWikimedia([
  "Montagne Noire.JPG",
  "Montagne Noire from Lagardiolle.jpg",
  "Fontiers-Cabardès-plaisance-juillet 2025.jpg",
  "Gueytes-et-Labastide.jpg",
]);

const GALERIE_AGDE_WEB = construireGalerieWikimedia([
  "Cap d'Agde.jpg",
  "Cap d'Agde - Le port et le mont Saint-Loup.jpg",
  "Cap d'Agde - Digue Richelieu et port.jpg",
  "Rochelongue 030 Cap d'Agde.JPG",
]);

const GALERIE_GARRIGUE_WEB = construireGalerieWikimedia([
  "Garrigue, Pinet, Hérault.jpg",
  "Fabrègues Plain, Fabrègues, Hérault 01.jpg",
  "Fabrègues Plain, Fabrègues, Hérault 02.jpg",
]);

const GALERIE_GARDIOLE_WEB = construireGalerieWikimedia([
  "Gardiole3.jpg",
  "Sète from La Gardiole Mountain, Hérault 01.jpg",
  "Fabrègues Plain, Fabrègues, Hérault 01.jpg",
  "Fabrègues Plain, Fabrègues, Hérault 02.jpg",
]);

const GALERIE_BEZIERS_WEB = construireGalerieWikimedia([
  "View of Béziers.jpg",
  "Pont-Canal de l'Orb, Béziers.JPG",
  "Cathédrale Saint-Nazaire à Béziers003.JPG",
  "Béziers, Cathédrale Saint-Nazaire PM 37875.jpg",
]);

const GALERIE_AIGOUAL_WEB = construireGalerieWikimedia([
  "Mont Aigoual 395-396mod.jpg",
  "L'observatoire du Mont Aigoual.jpg",
  "Mont Aigoual 403-404mod.jpg",
  "Forêt Aigoual.JPG",
]);

const GALERIE_CEVENNES_WEB = construireGalerieWikimedia([
  "00 0214 Col du Pas - Cévennes.jpg",
  "00 1271 Cevennen (Cévennes) - Frankreich.jpg",
  "00 1272 Cevennen (Cévennes) - Frankreich.jpg",
]);

const GALERIE_LODEVE_WEB = construireGalerieWikimedia([
  "View of Lodeve 01.jpg",
  "View of Lodeve 02.jpg",
  "View of Lodeve 03.jpg",
  "Lodève vue générale.JPG",
]);

const GALERIE_HAUT_LANGUEDOC_WEB = construireGalerieWikimedia([
  "Haut-Languedoc, Rosis cf06.jpg",
  "Haut-Languedoc, Rosis cf14.jpg",
  "Ruisseau du Vialais, Haut-Languedoc, Rosis cf06.jpg",
  "Massif du Caroux, Saint-Martin-de-l'Arçon, Hérault.jpg",
]);

const GALERIE_VEZOLES_WEB = construireGalerieWikimedia([
  "Lac de Vézoles, Hérault 01.jpg",
  "Lac de Vézoles, Hérault 07.jpg",
  "Foliage, Vézoles Lake.jpg",
  "Foliage, Vézoles Lake 02.jpg",
]);

const GALERIE_VILLECUN_WEB = construireGalerieWikimedia([
  "Olmet et Villecun (Hérault).jpg",
]);

const REGLES_IMAGES = [
  {
    motsCles: ["salagou"],
    marqueursImage: ["salagou"],
    image: "../image/lac_du_salagou1.jpg",
    galerie: fusionnerGaleries(
      [
        "../image/lac_du_salagou1.jpg",
        "../image/lac_du_salagou2.jpg",
        "../image/lac_du_salagou3.jpg",
        "../image/lac_du_salagou4.jpg",
        "../image/lac_du_salagou5.jpg",
        "../image/lac_du_salagou6.jpg",
        "../image/lac_du_salagou7.jpeg",
        "../image/lac_du_salagou8.jpeg",
        "../image/lac_du_salagou9.jpeg",
        "../image/lac_du_salagou10.jpeg",
      ],
      GALERIE_SALAGOU_WEB
    ),
  },
  {
    motsCles: ["moureze"],
    marqueursImage: ["moureze"],
    image: "../image/moureze-1.jpg",
    galerie: fusionnerGaleries(
      [
        "../image/Cirque-de-Moureze-occitanie.jpg",
        "../image/moureze-1.jpg",
        "../image/moureze-2.jpg",
        "../image/moureze-3.jpg",
        "../image/moureze-4.jpg",
        "../image/moureze-5.jpg",
        "../image/moureze-6.jpg",
        "../image/moureze-7.jpg",
        "../image/moureze-8.jpg",
        "../image/moureze-9.jpg",
        "../image/moureze-10.jpg",
      ],
      GALERIE_MOUREZE_WEB
    ),
  },
  {
    motsCles: ["gardiole"],
    marqueursImage: ["gardiole"],
    image: "../image/gardiole-11.jpg",
    galerie: fusionnerGaleries(
      [
        "../image/LA-GARDIOLE.jpg",
        "../image/gardiole-1.jpg",
        "../image/gardiole-2.jpg",
        "../image/gardiole-3.jpg",
        "../image/gardiole-4.jpg",
        "../image/gardiole-5.jpg",
        "../image/gardiole-6.jpg",
        "../image/gardiole-7.jpg",
        "../image/gardiole-8.jpg",
        "../image/gardiole-9.jpg",
        "../image/gardiole-10.jpg",
        "../image/gardiole-11.jpg",
      ],
      GALERIE_GARDIOLE_WEB
    ),
  },
  {
    motsCles: ["fenestrettes"],
    marqueursImage: ["fenestrettes"],
    image: "../image/Fenestrettes-10.jpg",
    galerie: fusionnerGaleries(
      [
        "../image/Fenestrettes-1.jpg",
        "../image/Fenestrettes-2.jpg",
        "../image/Fenestrettes-3.jpg",
        "../image/Fenestrettes-4.jpg",
        "../image/Fenestrettes-5.jpg",
        "../image/Fenestrettes-6.jpg",
        "../image/Fenestrettes-7.jpg",
        "../image/Fenestrettes-8.jpg",
        "../image/Fenestrettes-9.jpg",
        "../image/Fenestrettes-10.jpg",
      ],
      GALERIE_SAINT_GUILHEM_WEB
    ),
  },
  {
    motsCles: ["labeil"],
    marqueursImage: ["labeil"],
    image: "../image/Rando-du-cirque-de-Labeil_1.jpg",
    galerie: fusionnerGaleries(
      [
        "../image/Rando-du-cirque-de-Labeil_1.jpg",
        "../image/Rando-du-cirque-de-Labeil_2.jpg",
        "../image/Rando-du-cirque-de-Labeil_3.jpg",
        "../image/Rando-du-cirque-de-Labeil_4.jpg",
        "../image/Rando-du-cirque-de-Labeil_5.jpg",
        "../image/Rando-du-cirque-de-Labeil_6.jpg",
        "../image/Rando-du-cirque-de-Labeil_7.jpeg",
        "../image/Rando-du-cirque-de-Labeil_8.jpeg",
      ],
      GALERIE_LABEIL_WEB
    ),
  },
  {
    motsCles: ["lauroux", "corniche"],
    marqueursImage: ["lauroux", "corniche"],
    image: "../image/Corniches-de-Lauroux_1.jpg",
    galerie: [
      "../image/Corniches-de-Lauroux_1.jpg",
      "../image/Corniches-de-Lauroux_2.jpg",
      "../image/Corniches-de-Lauroux_3.jpg",
      "../image/Corniches-de-Lauroux_4.jpg",
      "../image/Corniches-de-Lauroux_5.jpg",
      "../image/Corniches-de-Lauroux_6.jpg",
      "../image/Corniches-de-Lauroux_7.jpg",
      "../image/Corniches-de-Lauroux_8.jpg",
    ],
  },
  {
    motsCles: ["laval", "nize"],
    marqueursImage: ["laval", "nize"],
    image: "../image/Laval de Nize.jpg",
    galerie: [
      "../image/Laval de Nize.jpg",
      "../image/Laval de Nize_2.jpg",
      "../image/Laval de Nize_3.jpg",
      "../image/Laval de Nize_4.jpeg",
      "../image/Laval de Nize_5.jpeg",
      "../image/Laval de Nize_6.jpeg",
      "../image/Laval de Nize_7.jpg",
      "../image/Laval de Nize_8.jpg",
    ],
  },
  {
    motsCles: ["chapelle", "saint-amans", "villecun"],
    marqueursImage: ["chapellesaintamans", "saintamans", "chapelle"],
    image: "../image/chapellesaintamans-1.jpg",
    galerie: fusionnerGaleries(
      [
        "../image/chapellesaintamans-1.jpg",
        "../image/chapellesaintamans-2.jpg",
        "../image/chapellesaintamans-3.jpg",
        "../image/chapellesaintamans-4.jpg",
        "../image/chapellesaintamans-5.jpg",
        "../image/chapellesaintamans-6.jpg",
        "../image/chapellesaintamans-7.jpg",
        "../image/chapellesaintamans-8.jpg",
        "../image/chapellesaintamans-9.jpg",
        "../image/chapellesaintamans-10.jpg",
      ],
      GALERIE_VILLECUN_WEB
    ),
  },
  {
    motsCles: ["pic saint-loup", "saint-loup", "montpellier hills"],
    marqueursImage: ["seranne", "brendle", "loup"],
    image: "../image/sur-la-seranne-e-brendle.jpg",
    galerie: fusionnerGaleries(
      [
        "../image/sur-la-seranne-e-brendle.jpg",
        "../image/sur-la-seranne-e-brendle-1.jpg",
      ],
      GALERIE_PIC_SAINT_LOUP_WEB
    ),
  },
  {
    motsCles: ["saint-guilhem", "guilhem"],
    marqueursImage: ["gorge", "herault", "guilhem"],
    image: "../image/gorge-de-l-herault-pres-ancienne-graviere-visorando-228220.jpg",
    galerie: fusionnerGaleries(
      ["../image/gorge-de-l-herault-pres-ancienne-graviere-visorando-228220.jpg"],
      GALERIE_SAINT_GUILHEM_WEB
    ),
  },
  {
    motsCles: ["navacelles"],
    marqueursImage: ["gorge", "herault", "navacelles"],
    image: GALERIE_NAVACELLES_WEB[0],
    galerie: GALERIE_NAVACELLES_WEB,
  },
  {
    motsCles: ["marche marine", "etang de thau", "thau"],
    marqueursImage: ["thau", "sete", "bouzigues", "lido"],
    image: GALERIE_THAU_WEB[0],
    galerie: GALERIE_THAU_WEB,
  },
  {
    motsCles: ["course des vignes", "minervois"],
    marqueursImage: ["minervois", "vigne", "vignoble", "minerve"],
    image: GALERIE_MINERVOIS_WEB[0],
    galerie: GALERIE_MINERVOIS_WEB,
  },
  {
    motsCles: ["nocturne montpellier"],
    marqueursImage: ["montpellier", "comedie", "peyrou", "antigone"],
    image: GALERIE_MONTPELLIER_NUIT_WEB[0],
    galerie: GALERIE_MONTPELLIER_NUIT_WEB,
  },
  {
    motsCles: ["canal du midi"],
    marqueursImage: ["canal", "midi", "beziers", "orb"],
    image: GALERIE_CANAL_MIDI_WEB[0],
    galerie: GALERIE_CANAL_MIDI_WEB,
  },
  {
    motsCles: ["caroux"],
    marqueursImage: ["caroux", "heric", "espinouse"],
    image: GALERIE_CAROUX_WEB[0],
    galerie: GALERIE_CAROUX_WEB,
  },
  {
    motsCles: ["montagne noire"],
    marqueursImage: ["montagne noire", "pic de nore", "cabardes"],
    image: GALERIE_MONTAGNE_NOIRE_WEB[0],
    galerie: GALERIE_MONTAGNE_NOIRE_WEB,
  },
  {
    motsCles: ["agde"],
    marqueursImage: ["agde", "cap d'agde", "capdagde", "rochelongue"],
    image: GALERIE_AGDE_WEB[0],
    galerie: GALERIE_AGDE_WEB,
  },
  {
    motsCles: ["garrigue"],
    marqueursImage: ["garrigue", "fabregues", "gardiole", "pinet"],
    image: GALERIE_GARRIGUE_WEB[0],
    galerie: GALERIE_GARRIGUE_WEB,
  },
  {
    motsCles: ["beziers"],
    marqueursImage: ["beziers", "orb", "canal", "cathedrale"],
    image: GALERIE_BEZIERS_WEB[0],
    galerie: GALERIE_BEZIERS_WEB,
  },
  {
    motsCles: ["aigoual"],
    marqueursImage: ["aigoual", "observatoire", "foret"],
    image: GALERIE_AIGOUAL_WEB[0],
    galerie: GALERIE_AIGOUAL_WEB,
  },
  {
    motsCles: ["cevennes"],
    marqueursImage: ["cevennes", "cevenne", "col du pas"],
    image: GALERIE_CEVENNES_WEB[0],
    galerie: GALERIE_CEVENNES_WEB,
  },
  {
    motsCles: ["lodeve", "lodève"],
    marqueursImage: ["lodeve", "lodève"],
    image: GALERIE_LODEVE_WEB[0],
    galerie: GALERIE_LODEVE_WEB,
  },
  {
    motsCles: ["haut-languedoc"],
    marqueursImage: ["haut-languedoc", "rosis", "caroux"],
    image: GALERIE_HAUT_LANGUEDOC_WEB[0],
    galerie: GALERIE_HAUT_LANGUEDOC_WEB,
  },
  {
    motsCles: ["vesoles", "vezoles", "vézoles"],
    marqueursImage: ["vezoles", "vézoles", "fraisse-sur-agout"],
    image: GALERIE_VEZOLES_WEB[0],
    galerie: GALERIE_VEZOLES_WEB,
  },
];

const MOTS_IGNORES = [
  "rando",
  "randonnee",
  "trail",
  "course",
  "balade",
  "marche",
  "vtt",
  "nature",
  "patrimoine",
  "de",
  "du",
  "des",
  "la",
  "le",
  "les",
  "et",
  "a",
  "au",
  "aux",
  "sur",
  "sud",
  "nord",
  "est",
  "ouest",
  "lac",
  "mont",
  "montagne",
  "foret",
  "canal",
];

function normaliserTexte(texte) {
  return String(texte || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function construireUrlDepuisChemin(chemin) {
  const valeur = String(chemin || "").trim();

  if (valeur === "") {
    return "";
  }

  if (/^https?:\/\//i.test(valeur)) {
    return valeur;
  }

  if (valeur.startsWith("/")) {
    return API_ROOT + valeur;
  }

  if (valeur.startsWith("../") || valeur.startsWith("./")) {
    return valeur;
  }

  return API_ROOT + "/" + valeur.replace(/^\/+/, "");
}

function recupererCheminImage(source) {
  if (!source) {
    return "";
  }

  if (source.image_url) {
    return source.image_url;
  }

  if (source.imageUrl) {
    return source.imageUrl;
  }

  return "";
}

function construireTexteEvenement(evenementPrincipal, evenementSecondaire) {
  let texte = "";

  if (evenementPrincipal) {
    texte += " " + (evenementPrincipal.Nom || "");
    texte += " " + (evenementPrincipal.Carte_parcours || "");
  }

  if (evenementSecondaire) {
    texte += " " + (evenementSecondaire.Nom || "");
    texte += " " + (evenementSecondaire.Carte_parcours || "");
  }

  return normaliserTexte(texte);
}

function trouverRegleImage(texteEvenement) {
  for (let index = 0; index < REGLES_IMAGES.length; index += 1) {
    const regle = REGLES_IMAGES[index];

    for (let i = 0; i < regle.motsCles.length; i += 1) {
      const motCle = normaliserTexte(regle.motsCles[i]);

      if (texteEvenement.includes(motCle)) {
        return regle;
      }
    }
  }

  return null;
}

function extraireMotsSpecifiques(texteEvenement) {
  const mots = texteEvenement.split(/[^a-z0-9]+/);
  const resultat = [];

  for (let index = 0; index < mots.length; index += 1) {
    const mot = mots[index];

    if (mot.length < 4) {
      continue;
    }

    if (MOTS_IGNORES.includes(mot)) {
      continue;
    }

    if (!resultat.includes(mot)) {
      resultat.push(mot);
    }
  }

  return resultat;
}

function imageApiCorrespond(texteEvenement, cheminImage) {
  const imageNormalisee = normaliserTexte(cheminImage);
  if (imageNormalisee === "") {
    return false;
  }

  const regle = trouverRegleImage(texteEvenement);
  if (regle) {
    for (let index = 0; index < regle.marqueursImage.length; index += 1) {
      const marqueur = normaliserTexte(regle.marqueursImage[index]);

      if (imageNormalisee.includes(marqueur)) {
        return true;
      }
    }

    return false;
  }

  const motsSpecifiques = extraireMotsSpecifiques(texteEvenement);
  for (let index = 0; index < motsSpecifiques.length; index += 1) {
    const mot = motsSpecifiques[index];

    if (imageNormalisee.includes(mot)) {
      return true;
    }
  }

  return false;
}

export function choisirImageEvenement(evenementPrincipal, evenementSecondaire) {
  const texteEvenement = construireTexteEvenement(
    evenementPrincipal,
    evenementSecondaire
  );

  const regle = trouverRegleImage(texteEvenement);
  if (regle) {
    return regle.image;
  }

  return DEFAULT_IMAGE;
}

export function choisirGalerieLocaleEvenement(
  evenementPrincipal,
  evenementSecondaire
) {
  const texteEvenement = construireTexteEvenement(
    evenementPrincipal,
    evenementSecondaire
  );

  const regle = trouverRegleImage(texteEvenement);
  if (!regle || !Array.isArray(regle.galerie)) {
    return [];
  }

  return regle.galerie.slice();
}

export function construireSourcesImage(evenementPrincipal, evenementSecondaire) {
  const texteEvenement = construireTexteEvenement(
    evenementPrincipal,
    evenementSecondaire
  );
  const fallbackImageSrc = choisirImageEvenement(
    evenementPrincipal,
    evenementSecondaire
  );

  let cheminImage = recupererCheminImage(evenementPrincipal);
  if (cheminImage === "") {
    cheminImage = recupererCheminImage(evenementSecondaire);
  }

  let imageSrc = fallbackImageSrc;
  if (imageApiCorrespond(texteEvenement, cheminImage)) {
    const imageDepuisApi = construireUrlDepuisChemin(cheminImage);

    if (imageDepuisApi !== "") {
      imageSrc = imageDepuisApi;
    }
  }

  return {
    imageSrc,
    fallbackImageSrc,
  };
}

export function attacherImageFallback(imageElement, imageSrc, fallbackImageSrc) {
  if (!imageElement) {
    return;
  }

  imageElement.src = imageSrc;

  if (imageSrc !== fallbackImageSrc) {
    imageElement.addEventListener(
      "error",
      function remplacerImage() {
        imageElement.src = fallbackImageSrc;
      },
      { once: true }
    );
  }
}
