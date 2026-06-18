// Ce fichier regroupe le code commun a plusieurs pages :
// images, header, footer, recherche, menu burger, carrousel et aside.

function determinerApiRoot() {
  if (typeof window === "undefined" || !window.location) {
    return "http://localhost:3000";
  }

  const protocole = window.location.protocol;
  const nomHote = window.location.hostname;
  const port = window.location.port;
  const estEnHttp = protocole === "http:" || protocole === "https:";
  const estEnLocal =
    nomHote === "localhost" || nomHote === "127.0.0.1" || nomHote === "";

  if (estEnHttp && port === "3000") {
    return "";
  }

  if (estEnHttp && estEnLocal) {
    return protocole + "//" + (nomHote || "localhost") + ":3000";
  }

  if (estEnHttp) {
    return "";
  }

  return "http://localhost:3000";
}

export const API_ROOT = determinerApiRoot();
export const API_URL = API_ROOT + "/api/events";
export const DEFAULT_IMAGE = cheminImage(
  "occitanie-rando-randonnee-herault-puechabon-balcons-herault-30-1024x768.webp"
);

const WIKIMEDIA_FILE_PATH_URL =
  "https://commons.wikimedia.org/wiki/Special:FilePath/";

function creerUrlWikimedia(nomFichier) {
  return WIKIMEDIA_FILE_PATH_URL + encodeURIComponent(nomFichier);
}

// Une regle simple : quelques mots cles, une image principale
// et une galerie locale seulement si on en a une dans le projet.
const REGLES_IMAGES = [
  {
    motsCles: ["salagou"],
    image: "../image/lac_du_salagou1.jpg",
    galerie: [
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
  },
  {
    motsCles: ["moureze"],
    image: "../image/moureze-1.jpg",
    galerie: [
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
  },
  {
    motsCles: ["gardiole"],
    image: "../image/gardiole-11.jpg",
    galerie: [
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
  },
  {
    motsCles: ["fenestrettes"],
    image: "../image/Fenestrettes-10.jpg",
    galerie: [
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
  },
  {
    motsCles: ["labeil"],
    image: "../image/Rando-du-cirque-de-Labeil_1.jpg",
    galerie: [
      "../image/Rando-du-cirque-de-Labeil_1.jpg",
      "../image/Rando-du-cirque-de-Labeil_2.jpg",
      "../image/Rando-du-cirque-de-Labeil_3.jpg",
      "../image/Rando-du-cirque-de-Labeil_4.jpg",
      "../image/Rando-du-cirque-de-Labeil_5.jpg",
      "../image/Rando-du-cirque-de-Labeil_6.jpg",
      "../image/Rando-du-cirque-de-Labeil_7.jpeg",
      "../image/Rando-du-cirque-de-Labeil_8.jpeg",
    ],
  },
  {
    motsCles: ["lauroux", "corniche"],
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
    image: "../image/chapellesaintamans-1.jpg",
    galerie: [
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
  },
  {
    motsCles: ["pic saint-loup", "saint-loup", "montpellier hills"],
    image: "../image/sur-la-seranne-e-brendle.jpg",
    galerie: [
      "../image/sur-la-seranne-e-brendle.jpg",
      "../image/sur-la-seranne-e-brendle-1.jpg",
    ],
  },
  {
    motsCles: ["saint-guilhem", "guilhem"],
    image: "../image/gorge-de-l-herault-pres-ancienne-graviere-visorando-228220.jpg",
    galerie: [
      "../image/gorge-de-l-herault-pres-ancienne-graviere-visorando-228220.jpg",
      creerUrlWikimedia("Saint-Guilhem-le-Désert.jpg"),
      creerUrlWikimedia("Saint-Guilhem-le-Désert (13).jpg"),
    ],
  },
  {
    motsCles: ["marche marine", "etang de thau", "thau"],
    image: creerUrlWikimedia("Étang de Thau, Sète cf01.jpg"),
    galerie: [
      creerUrlWikimedia("Étang de Thau, Sète cf01.jpg"),
      creerUrlWikimedia("Etang de Thau.jpg"),
    ],
  },
  {
    motsCles: ["course des vignes", "minervois"],
    image: creerUrlWikimedia("Vigne Minervois.jpg"),
    galerie: [
      creerUrlWikimedia("Vigne Minervois.jpg"),
      creerUrlWikimedia("Felines Minervois.jpg"),
    ],
  },
  {
    motsCles: ["navacelles"],
    image: creerUrlWikimedia("Cirque-de-navacelles.JPG"),
    galerie: [
      creerUrlWikimedia("Cirque-de-navacelles.JPG"),
      creerUrlWikimedia("Cirque de Navacelles.jpg"),
      creerUrlWikimedia("Cirque de Navacelles (7).jpg"),
    ],
  },
  {
    motsCles: ["nocturne montpellier"],
    image: creerUrlWikimedia("Montpellier at night (19418833568).jpg"),
    galerie: [
      creerUrlWikimedia("Montpellier at night (19418833568).jpg"),
      creerUrlWikimedia("Montpellier (24422361398).jpg"),
      creerUrlWikimedia("Du-Manoir-ByNight.jpg"),
    ],
  },
  {
    motsCles: ["canal du midi"],
    image: creerUrlWikimedia("Canal-du-Midi.jpg"),
    galerie: [
      creerUrlWikimedia("Canal-du-Midi.jpg"),
      creerUrlWikimedia("Canal du Midi.JPG"),
      creerUrlWikimedia("Canal du Midi (1071857360).jpg"),
    ],
  },
  {
    motsCles: ["caroux"],
    image: creerUrlWikimedia("Caroux 1.jpg"),
    galerie: [
      creerUrlWikimedia("Caroux 1.jpg"),
      creerUrlWikimedia("Caroux 3.jpg"),
    ],
  },
  {
    motsCles: ["montagne noire"],
    image: creerUrlWikimedia("Montagne Noire.JPG"),
    galerie: [
      creerUrlWikimedia("Montagne Noire.JPG"),
      creerUrlWikimedia("Montagne Noire, Hérault 01.jpg"),
      creerUrlWikimedia("Pic Nore.JPG"),
    ],
  },
  {
    motsCles: ["agde"],
    image: creerUrlWikimedia("Cap d'Agde.jpg"),
    galerie: [
      creerUrlWikimedia("Cap d'Agde.jpg"),
      creerUrlWikimedia("Grau d'Agde.jpg"),
      creerUrlWikimedia("Rochelongue 030 Cap d'Agde.JPG"),
    ],
  },
  {
    motsCles: ["garrigue"],
    image: creerUrlWikimedia("Garrigue, Pinet, Hérault.jpg"),
    galerie: [
      creerUrlWikimedia("Garrigue, Pinet, Hérault.jpg"),
      creerUrlWikimedia("Aleppo Pines forest, Pinet, Hérault.jpg"),
      creerUrlWikimedia("Pinet, Hérault 09.jpg"),
    ],
  },
  {
    motsCles: ["beziers"],
    image: creerUrlWikimedia("View of Béziers.jpg"),
    galerie: [
      creerUrlWikimedia("View of Béziers.jpg"),
      creerUrlWikimedia("Béziers.jpg"),
      creerUrlWikimedia("Béziers (52985414626).jpg"),
    ],
  },
  {
    motsCles: ["aigoual"],
    image: creerUrlWikimedia("Mont Aigoual 395-396mod.jpg"),
    galerie: [
      creerUrlWikimedia("Mont Aigoual 395-396mod.jpg"),
      creerUrlWikimedia("Mont Aigoual.jpg"),
      creerUrlWikimedia("Mont Aigoual Est.jpg"),
      creerUrlWikimedia("Panorama du Mont Aigoual.JPG"),
    ],
  },
  {
    motsCles: ["cevennes"],
    image: creerUrlWikimedia("00 0214 Col du Pas - Cévennes.jpg"),
    galerie: [
      creerUrlWikimedia("00 0214 Col du Pas - Cévennes.jpg"),
      creerUrlWikimedia("Cévennes.jpg"),
      creerUrlWikimedia("Parc national des Cévennes.JPG"),
    ],
  },
  {
    motsCles: ["lodeve", "lodève"],
    image: creerUrlWikimedia("View of Lodeve 01.jpg"),
    galerie: [
      creerUrlWikimedia("View of Lodeve 01.jpg"),
      creerUrlWikimedia("Lodève.jpg"),
    ],
  },
  {
    motsCles: ["haut-languedoc"],
    image: creerUrlWikimedia("Haut-Languedoc, Rosis cf06.jpg"),
    galerie: [
      creerUrlWikimedia("Haut-Languedoc, Rosis cf06.jpg"),
      creerUrlWikimedia("Haut-Languedoc, Rosis cf07.jpg"),
      creerUrlWikimedia("Haut-Languedoc, Rosis cf08.jpg"),
      creerUrlWikimedia("Haut-Languedoc, Rosis cf14.jpg"),
    ],
  },
  {
    motsCles: ["vesoles", "vezoles", "vézoles"],
    image: creerUrlWikimedia("Lac de Vézoles, Hérault 01.jpg"),
    galerie: [
      creerUrlWikimedia("Lac de Vézoles, Hérault 01.jpg"),
      creerUrlWikimedia("Lac de Vézoles, Hérault 04.jpg"),
      creerUrlWikimedia("Lac de Vézoles, Hérault 05.jpg"),
      creerUrlWikimedia("Lac de Vézoles, Hérault 06.jpg"),
    ],
  },
];

function normaliserTexte(texte) {
  return String(texte || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function trouverRegleImage(evenementPrincipal, evenementSecondaire) {
  const texteEvenement = normaliserTexte(
    (evenementPrincipal
      ? " " +
        (evenementPrincipal.Nom || "") +
        " " +
        (evenementPrincipal.Carte_parcours || "")
      : "") +
      (evenementSecondaire
        ? " " +
          (evenementSecondaire.Nom || "") +
          " " +
          (evenementSecondaire.Carte_parcours || "")
        : "")
  );

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
    return adapterCheminImageLocal(valeur);
  }

  return API_ROOT + "/" + valeur.replace(/^\/+/, "");
}

function recupererUtilisateurConnecte() {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }

  try {
    const contenu = window.localStorage.getItem("rdh_user");

    if (!contenu) {
      return null;
    }

    const utilisateur = JSON.parse(contenu);

    if (!utilisateur || typeof utilisateur !== "object") {
      return null;
    }

    return utilisateur;
  } catch (error) {
    console.error("Erreur lecture utilisateur connecte :", error);
    return null;
  }
}

function supprimerUtilisateurConnecte() {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  window.localStorage.removeItem("rdh_user");
}

function estPageDetailEvenement() {
  if (typeof window === "undefined" || !window.location) {
    return false;
  }

  return window.location.pathname
    .toLowerCase()
    .includes("/projethtml/detail-evenement/");
}

function cheminProjetHtml(fichier) {
  return estPageDetailEvenement() ? "../" + fichier : "../Projethtml/" + fichier;
}

function cheminImage(fichier) {
  return (estPageDetailEvenement() ? "../../image/" : "../image/") + fichier;
}

function adapterCheminImageLocal(chemin) {
  if (estPageDetailEvenement() && chemin.startsWith("../image/")) {
    return "../" + chemin;
  }

  return chemin;
}

function formaterPrenomUtilisateur(valeur) {
  const prenom = String(valeur || "").trim();

  if (prenom === "") {
    return "";
  }

  return prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase();
}

export function choisirGalerieLocaleEvenement(
  evenementPrincipal,
  evenementSecondaire
) {
  const regle = trouverRegleImage(evenementPrincipal, evenementSecondaire);

  if (!regle || !Array.isArray(regle.galerie)) {
    return [];
  }

    return regle.galerie.map(adapterCheminImageLocal);
}

export function construireSourcesImage(evenementPrincipal, evenementSecondaire) {
  const regle = trouverRegleImage(evenementPrincipal, evenementSecondaire);
  const fallbackImageSrc = adapterCheminImageLocal(
    regle && regle.image ? regle.image : DEFAULT_IMAGE
  );
  let cheminImage = "";

  if (evenementPrincipal) {
    cheminImage =
      evenementPrincipal.image_url || evenementPrincipal.imageUrl || "";
  }

  if (cheminImage === "" && evenementSecondaire) {
    cheminImage =
      evenementSecondaire.image_url || evenementSecondaire.imageUrl || "";
  }

  const imageSrc =
    adapterCheminImageLocal(construireUrlDepuisChemin(cheminImage)) ||
    fallbackImageSrc;

  return {
    imageSrc: imageSrc,
    fallbackImageSrc: fallbackImageSrc,
  };
}

export function attacherImageFallback(
  imageElement,
  imageSrc,
  fallbackImageSrc
) {
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

function loadHeader() {
  const header = document.getElementById("header");
  if (!header) {
    return;
  }

  const utilisateurConnecte = recupererUtilisateurConnecte();
  const prenomUtilisateur = utilisateurConnecte
    ? formaterPrenomUtilisateur(
        String(utilisateurConnecte.prenom || utilisateurConnecte.Prenom || "")
          .trim()
          .split(/\s+/)[0]
      )
    : "";
  const messageUtilisateur =
    prenomUtilisateur !== "" ? "Bonjour, " + prenomUtilisateur : "Connexion";
  const menuUtilisateur = utilisateurConnecte
    ? `
      <div class="user-menu">
        <button type="button" class="user-menu-action" data-user-action="logout">Déconnexion</button>
      </div>
    `
    : "";
  const lienAjoutRandonnee = utilisateurConnecte
    ? '<li><a href="' +
      cheminProjetHtml("formevenements.html") +
      '">Ajouter une randonn&eacute;e</a></li>'
    : "";
  const hrefUtilisateur =
    prenomUtilisateur !== ""
      ? cheminProjetHtml("profil.html")
      : cheminProjetHtml("connexion.html");

  header.innerHTML = `
    <a href="${cheminProjetHtml("accueil.html")}" class="logo-link">
      <img
        src="${cheminImage("image logo.png")}"
        class="logo"
        alt="Logo Randonnee Herault"
      >
    </a>

    <p class="site-title">Randonn&eacute;e de l'H&eacute;rault</p>

    <div class="user-panel">
      <a href="${hrefUtilisateur}" class="user-link" aria-haspopup="${prenomUtilisateur !== "" ? "menu" : "false"}" aria-expanded="false">
        <span class="user-greeting">${messageUtilisateur}</span>
        <img class="user" src="${cheminImage("telechargement4.png")}" alt="Utilisateur">
      </a>
      ${menuUtilisateur}
    </div>

    <button class="burger" aria-label="Menu">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <nav class="menu">
      <ul>
        <li><a href="${cheminProjetHtml("accueil.html")}">Accueil</a></li>
        <li><a href="${cheminProjetHtml("Apropos.html")}">&Agrave; propos</a></li>
        <li><a href="${cheminProjetHtml("event.html")}">&Eacute;v&eacute;nements</a></li>
        ${lienAjoutRandonnee}
        <li><a href="${cheminProjetHtml("inscription.html")}">Inscription</a></li>
        <li><a href="${cheminProjetHtml("contact.html")}">Contact</a></li>
      </ul>
    </nav>

    <form class="search-bar">
      <input type="search" placeholder="Rechercher..." name="search">
    </form>
  `;
}

function loadFooter() {
  const footer = document.querySelector(".footer");
  if (!footer) {
    return;
  }

  footer.innerHTML = `
    <a href="${cheminProjetHtml("contact.html")}">Nous contacter</a>
    <p>Copyright &copy; 2026<br>Powered by Khaled</p>
    <a href="${cheminProjetHtml("mentionsLegales.html")}">Mentions l&eacute;gales</a>
    <a href="${cheminProjetHtml("politiqueconf.html")}">Politique de confidentialit&eacute;</a>
  `;
}

function initialiserLienMenuActif() {
  const liensMenu = document.querySelectorAll(".menu a");
  const cheminActuel = window.location.pathname.toLowerCase();

  for (let index = 0; index < liensMenu.length; index += 1) {
    const lien = liensMenu[index];
    const cheminLien = new URL(lien.href, window.location.href).pathname.toLowerCase();
    const lienEvenements = cheminLien.endsWith("/projethtml/event.html");
    const pageDetailEvenement = cheminActuel.includes("/projethtml/detail-evenement/");

    lien.classList.toggle(
      "active",
      cheminActuel === cheminLien || (pageDetailEvenement && lienEvenements)
    );
  }
}

function initialiserCarrousel() {
  const container = document.querySelector(".carrousel-container");
  const boutonPrecedent = document.querySelector(".prev");
  const boutonSuivant = document.querySelector(".next");
  const compteur = document.getElementById("detail-gallery-counter");

  if (!container) {
    return;
  }

  let index = 0;

  function recupererImages() {
    return container.querySelectorAll("img");
  }

  function afficherImage() {
    const images = recupererImages();
    if (images.length === 0) {
      return;
    }

    if (index >= images.length) {
      index = 0;
    }

    if (index < 0) {
      index = images.length - 1;
    }

    container.style.transform = "translateX(-" + index * 100 + "%)";

    if (compteur) {
      compteur.hidden = images.length <= 1;
      compteur.textContent = String(index + 1) + " / " + String(images.length);
    }

    if (boutonPrecedent) {
      boutonPrecedent.hidden = images.length <= 1;
    }

    if (boutonSuivant) {
      boutonSuivant.hidden = images.length <= 1;
    }
  }

  function changerImage(sens) {
    const images = recupererImages();
    if (images.length === 0) {
      return;
    }

    index += sens;
    afficherImage();
  }

  if (boutonSuivant) {
    boutonSuivant.addEventListener("click", function imageSuivante() {
      changerImage(1);
    });
  }

  if (boutonPrecedent) {
    boutonPrecedent.addEventListener("click", function imagePrecedente() {
      changerImage(-1);
    });
  }

  afficherImage();

  window.actualiserCarrouselDetail = function actualiserCarrouselDetail() {
    index = 0;
    afficherImage();
  };
}

function initialiserMenuBurger() {
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".menu");
  const body = document.body;

  if (!burger || !menu) {
    return;
  }

  burger.addEventListener("click", function gererMenuBurger() {
    burger.classList.toggle("active");
    menu.classList.toggle("active");
    body.classList.toggle("menu-open");
  });
}

function normaliserRecherche(valeur) {
  return String(valeur || "").trim().replace(/\s+/g, " ");
}

function initialiserRechercheHeader() {
  const formulaireRecherche = document.querySelector(".search-bar");
  const champRecherche = document.querySelector(".search-bar input");

  if (!formulaireRecherche || !champRecherche) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const rechercheUrl = normaliserRecherche(params.get("q"));

  if (rechercheUrl !== "") {
    champRecherche.value = rechercheUrl;
  }

  formulaireRecherche.addEventListener("submit", function gererRecherche(event) {
    event.preventDefault();

    const recherche = normaliserRecherche(champRecherche.value);
    const destination = new URL(cheminProjetHtml("event.html"), window.location.href);

    if (recherche !== "") {
      destination.searchParams.set("q", recherche);
    }

    window.location.href = destination.pathname + destination.search;
  });
}

function initialiserAsideToggle() {
  const aside = document.getElementById("aside-menu");
  const bouton = document.querySelector(".toggle-aside");

  if (!aside || !bouton) {
    return;
  }

  function fermerAside() {
    aside.classList.remove("open");
    bouton.classList.remove("open");
    bouton.innerHTML = "&#9654;";
    bouton.setAttribute("aria-expanded", "false");
  }

  function ouvrirOuFermerAside() {
    const asideOuverte = aside.classList.toggle("open");
    bouton.classList.toggle("open", asideOuverte);

    if (asideOuverte) {
      bouton.innerHTML = "&#10005;";
    } else {
      bouton.innerHTML = "&#9654;";
    }

    bouton.setAttribute("aria-expanded", String(asideOuverte));
  }

  bouton.addEventListener("click", ouvrirOuFermerAside);

  document.addEventListener("click", function fermerAuClicExterieur(event) {
    if (
      aside.classList.contains("open") &&
      !aside.contains(event.target) &&
      !bouton.contains(event.target)
    ) {
      fermerAside();
    }
  });

  aside.addEventListener("click", function fermerAuClicLien(event) {
    const lien = event.target.closest("a");

    if (lien) {
      fermerAside();
    }
  });
}

function initialiserMenuUtilisateur() {
  const utilisateur = recupererUtilisateurConnecte();
  const panel = document.querySelector(".user-panel");
  const lien = document.querySelector(".user-link");
  const menu = document.querySelector(".user-menu");

  if (!panel || !lien || !utilisateur || !menu) {
    return;
  }

  menu.addEventListener("click", async function gererActionUtilisateur(event) {
    const bouton = event.target.closest("[data-user-action]");

    if (!bouton) {
      return;
    }

    const action = bouton.getAttribute("data-user-action");

    if (action === "logout") {
      supprimerUtilisateurConnecte();
      window.location.href = cheminProjetHtml("connexion.html");
      return;
    }
  });
}

async function chargerAsideLiens() {
  const liste = document.getElementById("aside-list");
  if (!liste) {
    return;
  }

  liste.innerHTML = '<li class="aside-message">Chargement des evenements...</li>';

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Erreur API " + response.status);
    }

    const events = await response.json();
    liste.innerHTML = "";

    if (!Array.isArray(events) || events.length === 0) {
      liste.innerHTML = '<li class="aside-message">Aucun evenement disponible.</li>';
      return;
    }

    const fichierActuel = window.location.pathname.split("/").pop().toLowerCase();
    const idActuel = Number(new URLSearchParams(window.location.search).get("id"));

    for (let index = 0; index < events.length; index += 1) {
      const evenement = events[index];
      const idEvenement = Number(evenement.ID_evenement);
      const li = document.createElement("li");
      const lien = document.createElement("a");

      lien.href = estPageDetailEvenement()
        ? "evenement.html?id=" + idEvenement
        : "detail-evenement/evenement.html?id=" + idEvenement;
      lien.textContent = evenement.Nom || "Evenement";

      if (fichierActuel === "evenement.html" && idActuel === idEvenement) {
        lien.classList.add("active");
        lien.setAttribute("aria-current", "page");
      }

      li.appendChild(lien);
      liste.appendChild(li);
    }
  } catch (error) {
    console.error("Erreur chargement aside :", error);
    liste.innerHTML = '<li class="aside-message">Impossible de charger la liste.</li>';
  }
}

function demarrerUtilitaire() {
  loadHeader();
  loadFooter();
  initialiserLienMenuActif();
  initialiserRechercheHeader();
  initialiserMenuUtilisateur();
  initialiserMenuBurger();
  initialiserCarrousel();
  initialiserAsideToggle();
  chargerAsideLiens();
}

document.addEventListener("DOMContentLoaded", demarrerUtilitaire);
