import {
  API_ROOT,
  API_URL,
  DEFAULT_IMAGE,
  attacherImageFallback,
  choisirGalerieLocaleEvenement,
  construireSourcesImage,
} from "./utilitaire.js";
import {
  MOTS_CLES_PAR_PAGE,
  convertirEnBooleen,
  creerDescriptionEvenement,
  formaterDate,
  formaterHeure,
  nettoyerDescription,
  normaliserTexte,
  reparerTexteMalEncode,
} from "./event-outils.js";

// Page detail d'un evenement.
function recupererIdDepuisAnciennePage(listeEvenements, nomPage) {
  const page = String(nomPage || "").trim().toLowerCase();
  const motsCles = MOTS_CLES_PAR_PAGE[page];

  if (!motsCles) {
    return 0;
  }

  for (let index = 0; index < listeEvenements.length; index += 1) {
    const evenement = listeEvenements[index];
    const texteEvenement = normaliserTexte(
      (evenement.Nom || "") + " " + (evenement.Carte_parcours || "")
    );

    for (let i = 0; i < motsCles.length; i += 1) {
      if (texteEvenement.includes(normaliserTexte(motsCles[i]))) {
        return Number(evenement.ID_evenement);
      }
    }
  }

  return 0;
}

function formaterOuiNon(valeur) {
  if (valeur === null || valeur === undefined || valeur === "") {
    return "Non renseignee";
  }

  return convertirEnBooleen(valeur) ? "Oui" : "Non";
}

function formaterValeurDetail(valeur, suffixe) {
  if (valeur === null || valeur === undefined || valeur === "") {
    return "Non renseignee";
  }

  return String(valeur) + (suffixe || "");
}

function construireLienDocumentDetail(chemin) {
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

function construireUrlQrCodeEvenement(idEvenement) {
  const id = Number(idEvenement);

  if (!Number.isInteger(id) || id <= 0) {
    return "";
  }

  return API_URL + "/" + id + "/qrcode";
}

function ajouterImageSiAbsente(listeImages, urlImage) {
  const url = String(urlImage || "").trim();

  if (url === "") {
    return;
  }

  if (listeImages.includes(url)) {
    return;
  }

  listeImages.push(url);
}

function preparerDonneesEvenement(detailApi, resumeApi) {
  const sourcesImage = construireSourcesImage(detailApi, resumeApi);
  const idEvenement = Number(
    (detailApi && detailApi.ID_evenement) ||
      (resumeApi && resumeApi.ID_evenement) ||
      0
  );

  let nom = "Evenement";
  if (detailApi && detailApi.Nom) {
    nom = reparerTexteMalEncode(detailApi.Nom);
  } else if (resumeApi && resumeApi.Nom) {
    nom = reparerTexteMalEncode(resumeApi.Nom);
  }

  let date = "";
  if (detailApi && detailApi.Date_event) {
    date = detailApi.Date_event;
  } else if (resumeApi && resumeApi.Date_event) {
    date = resumeApi.Date_event;
  }

  let heureDepart = "";
  if (detailApi && detailApi.Heure_de_depart) {
    heureDepart = detailApi.Heure_de_depart;
  } else if (resumeApi && resumeApi.Heure_de_depart) {
    heureDepart = resumeApi.Heure_de_depart;
  }

  let lieuRdv = "";
  if (detailApi && detailApi.Lieu_de_rdv) {
    lieuRdv = reparerTexteMalEncode(detailApi.Lieu_de_rdv);
  } else if (resumeApi && resumeApi.Lieu_de_rdv) {
    lieuRdv = reparerTexteMalEncode(resumeApi.Lieu_de_rdv);
  }

  let accessibilite = null;
  if (detailApi && detailApi.Accessibilite !== undefined) {
    accessibilite = detailApi.Accessibilite;
  } else if (resumeApi && resumeApi.Accessibilite !== undefined) {
    accessibilite = resumeApi.Accessibilite;
  }

  let difficulte = "Non renseignee";
  if (resumeApi && resumeApi.difficulte) {
    difficulte = reparerTexteMalEncode(resumeApi.difficulte);
  } else if (detailApi && detailApi.difficulte) {
    difficulte = reparerTexteMalEncode(detailApi.difficulte);
  } else if (detailApi && detailApi.ID_difficulte) {
    difficulte = "Niveau " + detailApi.ID_difficulte;
  }

  const description = nettoyerDescription(
    (detailApi && detailApi.Descriptif) ||
      (resumeApi && resumeApi.Descriptif) ||
      creerDescriptionEvenement(detailApi || resumeApi || {})
  );

  const carteParcours =
    (detailApi && detailApi.Carte_parcours) ||
    (resumeApi && resumeApi.Carte_parcours) ||
    "";
  const visugpxIframeUrl = String(
    (detailApi && detailApi.visugpx_iframe_url) ||
      (resumeApi && resumeApi.visugpx_iframe_url) ||
      ""
  ).trim();
  const visugpxPageUrl = String(
    (detailApi && detailApi.visugpx_url) ||
      (resumeApi && resumeApi.visugpx_url) ||
      ""
  ).trim();
  const lienDocument = construireLienDocumentDetail(carteParcours);

  let lienCarte = "";
  let lienCarteTexte = "";

  if (String(carteParcours || "").trim() !== "" && visugpxIframeUrl === "") {
    lienCarte = lienDocument;
    lienCarteTexte = "Ouvrir le document parcours";
  } else if (visugpxPageUrl !== "") {
    lienCarte = visugpxPageUrl;
    lienCarteTexte = "Ouvrir la trace sur VisuGPX";
  }

  const images = [];
  const galerieLocale = choisirGalerieLocaleEvenement(detailApi, resumeApi);

  for (let index = 0; index < galerieLocale.length; index += 1) {
    ajouterImageSiAbsente(images, galerieLocale[index]);
  }

  ajouterImageSiAbsente(images, sourcesImage.imageSrc);

  if (detailApi && Array.isArray(detailApi.images)) {
    for (let index = 0; index < detailApi.images.length; index += 1) {
      const image = detailApi.images[index];
      const urlImage = construireLienDocumentDetail(image && image.Url);
      ajouterImageSiAbsente(images, urlImage);
    }
  }

  let tarif = "Non renseigne";
  if (detailApi && detailApi.Tarif) {
    tarif = String(detailApi.Tarif) + " EUR";
  }

  let materiels = [];
  if (detailApi && Array.isArray(detailApi.materiels)) {
    materiels = detailApi.materiels;
  }

  let qrCodeUrl = "";
  if (visugpxPageUrl !== "") {
    qrCodeUrl = construireUrlQrCodeEvenement(idEvenement);
  }

  return {
    id: idEvenement,
    nom: nom,
    description:
      description ||
      "Aucune description detaillee n'est disponible pour cet evenement.",
    imageSrc: sourcesImage.imageSrc,
    fallbackImageSrc: sourcesImage.fallbackImageSrc,
    imageAlt: nom,
    date: formaterDate(date, "Non renseignee"),
    heureDepart: formaterHeure(heureDepart, "Non renseignee"),
    heureArrivee: formaterHeure(
      detailApi && detailApi.Heure_d_arrivee,
      "Non renseignee"
    ),
    lieuRdv: formaterValeurDetail(lieuRdv),
    lieuArrivee: formaterValeurDetail(detailApi && detailApi.Lieu_d_arrivee),
    tarif: tarif,
    accessibilite: formaterOuiNon(accessibilite),
    difficulte: difficulte,
    denivele: formaterValeurDetail(detailApi && detailApi.Denivele, " m"),
    altitudeMax: formaterValeurDetail(
      detailApi && detailApi.Altitude_maximale,
      " m"
    ),
    pointEau: formaterOuiNon(
      detailApi && detailApi.Point_d_eau_ravitaillement
    ),
    materiels: materiels,
    images: images,
    carteParcours: carteParcours,
    lienCarte: lienCarte,
    lienCarteTexte: lienCarteTexte,
    visugpxPageUrl: visugpxPageUrl,
    visugpxIframeUrl: visugpxIframeUrl,
    qrCodeUrl: qrCodeUrl,
  };
}

function remplirListeInformations(evenement) {
  const liste = document.getElementById("detail-info-list");
  if (!liste) {
    return;
  }

  liste.innerHTML = "";
  const lignes = [
    {
      idInput: "detail-input-date",
      label: "Date",
      valeur: evenement.date,
    },
    {
      idInput: "detail-input-heure-depart",
      label: "Heure de depart",
      valeur: evenement.heureDepart,
    },
    {
      idInput: "detail-input-heure-arrivee",
      label: "Heure d'arrivee",
      valeur: evenement.heureArrivee,
    },
    {
      idInput: "detail-input-lieu-rdv",
      label: "Lieu de rendez-vous",
      valeur: evenement.lieuRdv,
    },
    {
      idInput: "detail-input-lieu-arrivee",
      label: "Lieu d'arrivee",
      valeur: evenement.lieuArrivee,
    },
    {
      idInput: "detail-input-tarif",
      label: "Tarif",
      valeur: evenement.tarif,
    },
    {
      idInput: "detail-input-accessibilite",
      label: "Accessibilite",
      valeur: evenement.accessibilite,
    },
    {
      idInput: "detail-input-difficulte",
      label: "Difficulte",
      valeur: evenement.difficulte,
    },
    {
      idInput: "detail-input-denivele",
      label: "Denivele",
      valeur: evenement.denivele,
    },
    {
      idInput: "detail-input-altitude-max",
      label: "Altitude maximale",
      valeur: evenement.altitudeMax,
    },
    {
      idInput: "detail-input-point-eau",
      label: "Point d'eau / ravitaillement",
      valeur: evenement.pointEau,
    },
  ];
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < lignes.length; index += 1) {
    const ligneInfo = lignes[index];
    const valeurElement = document.getElementById(ligneInfo.idInput);
    const ligne = document.createElement("li");
    const titre = document.createElement("strong");

    if (valeurElement) {
      if ("value" in valeurElement) {
        valeurElement.value = ligneInfo.valeur;
      } else {
        valeurElement.textContent = ligneInfo.valeur;
      }
    }

    titre.textContent = ligneInfo.label + " : ";
    ligne.appendChild(titre);
    ligne.appendChild(document.createTextNode(ligneInfo.valeur));
    fragment.appendChild(ligne);
  }

  liste.appendChild(fragment);
}

function remplirResumeDetail(evenement) {
  const resumes = [
    {
      id: "detail-summary-date",
      valeur: evenement.date,
    },
    {
      id: "detail-summary-lieu",
      valeur: evenement.lieuRdv,
    },
    {
      id: "detail-summary-difficulte",
      valeur: evenement.difficulte,
    },
    {
      id: "detail-summary-tarif",
      valeur: evenement.tarif,
    },
  ];

  for (let index = 0; index < resumes.length; index += 1) {
    const item = resumes[index];
    const element = document.getElementById(item.id);

    if (element) {
      element.textContent = item.valeur || "-";
    }
  }
}

function remplirListeMateriels(evenement) {
  const listeObligatoire = document.getElementById("detail-materiel-obligatoire");
  const listeRecommande = document.getElementById("detail-materiel-recommande");

  if (!listeObligatoire || !listeRecommande) {
    return;
  }

  listeObligatoire.innerHTML = "";
  listeRecommande.innerHTML = "";

  let aMaterielObligatoire = false;
  let aMaterielRecommande = false;
  const materiels = Array.isArray(evenement.materiels) ? evenement.materiels : [];

  for (let index = 0; index < materiels.length; index += 1) {
    const materiel = materiels[index];
    const nomMateriel = materiel.nom || "Materiel";
    const ligne = document.createElement("label");
    const input = document.createElement("input");
    const texte = document.createElement("span");
    const listeCible = materiel.obligatoire ? listeObligatoire : listeRecommande;

    ligne.className = "detail-materiel-input";
    input.type = "checkbox";
    input.checked = true;
    input.disabled = true;
    texte.textContent = nomMateriel;

    ligne.appendChild(input);
    ligne.appendChild(texte);

    if (materiel.obligatoire) {
      aMaterielObligatoire = true;
    } else {
      aMaterielRecommande = true;
    }

    listeCible.appendChild(ligne);
  }

  if (!aMaterielObligatoire) {
    listeObligatoire.innerHTML =
      '<p class="detail-materiel-vide">Aucun materiel obligatoire</p>';
  }

  if (!aMaterielRecommande) {
    listeRecommande.innerHTML =
      '<p class="detail-materiel-vide">Aucun materiel recommande</p>';
  }
}

async function partagerCarte(evenement, zoneStatus) {
  const urlCarte = String(evenement.visugpxPageUrl || "").trim();

  async function copierLien() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(urlCarte);

      if (zoneStatus) {
        zoneStatus.textContent = "Lien de la carte copie.";
      }

      return;
    }

    if (zoneStatus) {
      zoneStatus.textContent = "Copie automatique indisponible.";
    }
  }

  if (urlCarte === "") {
    if (zoneStatus) {
      zoneStatus.textContent = "Aucune carte a partager.";
    }

    return;
  }

  try {
    if (navigator.share) {
      await navigator.share({
        title: evenement.nom,
        text: "Carte VisuGPX de l'evenement " + evenement.nom,
        url: urlCarte,
      });

      if (zoneStatus) {
        zoneStatus.textContent = "Partage ouvert.";
      }

      return;
    }

    await copierLien();
  } catch (error) {
    if (error && error.name === "AbortError") {
      return;
    }

    console.error("Erreur partage carte :", error);
    await copierLien();
  }
}

function recupererElementsDetail() {
  return {
    titre: document.getElementById("detail-name"),
    description: document.getElementById("detail-description"),
    status: document.getElementById("detail-status"),
    liste: document.getElementById("detail-info-list"),
    listeObligatoire: document.getElementById("detail-materiel-obligatoire"),
    listeRecommande: document.getElementById("detail-materiel-recommande"),
    galerie: document.getElementById("detail-gallery"),
    texteCarte: document.getElementById("detail-map-text"),
    lienCarte: document.getElementById("detail-map-link"),
    blocCarte: document.getElementById("detail-map-frame-container"),
    iframeCarte: document.getElementById("detail-map-iframe"),
    blocQr: document.getElementById("detail-map-qr-card"),
    imageQr: document.getElementById("detail-map-qr-image"),
    lienQr: document.getElementById("detail-map-qr-link"),
    boutonPartagerCarte: document.getElementById("detail-map-share-button"),
    statusPartageCarte: document.getElementById("detail-map-share-status"),
  };
}

function afficherErreur(message) {
  const elements = recupererElementsDetail();

  if (elements.titre) {
    elements.titre.textContent = "Evenement introuvable";
  }

  if (elements.description) {
    elements.description.textContent = message;
  }

  if (elements.status) {
    elements.status.textContent = "Erreur de chargement";
  }

  if (elements.liste) {
    elements.liste.innerHTML = "";
  }

  const resumeItems = document.querySelectorAll(".detail-summary-value");
  for (let index = 0; index < resumeItems.length; index += 1) {
    resumeItems[index].textContent = "-";
  }

  const valeursInfo = document.querySelectorAll(
    ".detail-inputs-evenement input, .detail-info-value"
  );

  for (let index = 0; index < valeursInfo.length; index += 1) {
    if ("value" in valeursInfo[index]) {
      valeursInfo[index].value = "";
    } else {
      valeursInfo[index].textContent = "-";
    }
  }

  if (elements.listeObligatoire) {
    elements.listeObligatoire.innerHTML = "";
  }

  if (elements.listeRecommande) {
    elements.listeRecommande.innerHTML = "";
  }

  if (elements.galerie) {
    elements.galerie.innerHTML = "";
    elements.galerie.style.transform = "translateX(0)";

    const image = document.createElement("img");
    image.id = "detail-image";
    image.src = DEFAULT_IMAGE;
    image.alt = "Evenement introuvable";
    elements.galerie.appendChild(image);
  }

  if (elements.texteCarte) {
    elements.texteCarte.textContent = "Aucun document parcours disponible.";
  }

  if (elements.blocCarte) {
    elements.blocCarte.hidden = true;
  }

  if (elements.iframeCarte) {
    elements.iframeCarte.removeAttribute("src");
  }

  if (elements.lienCarte) {
    elements.lienCarte.hidden = true;
    elements.lienCarte.removeAttribute("href");
    elements.lienCarte.textContent = "Ouvrir le document parcours";
  }

  if (elements.blocQr) {
    elements.blocQr.hidden = true;
  }

  if (elements.imageQr) {
    elements.imageQr.removeAttribute("src");
    elements.imageQr.onerror = null;
  }

  if (elements.lienQr) {
    elements.lienQr.removeAttribute("href");
  }

  if (elements.boutonPartagerCarte) {
    elements.boutonPartagerCarte.disabled = true;
    elements.boutonPartagerCarte.onclick = null;
  }

  if (elements.statusPartageCarte) {
    elements.statusPartageCarte.textContent = "";
  }

  if (typeof window.actualiserCarrouselDetail === "function") {
    window.actualiserCarrouselDetail();
  }
}

function afficherDetail(evenement) {
  document.title = evenement.nom + " | Evenement";

  const elements = recupererElementsDetail();

  if (elements.titre) {
    elements.titre.textContent = evenement.nom;
  }

  if (elements.description) {
    elements.description.textContent = evenement.description;
  }

  if (elements.status) {
    elements.status.textContent = "Detail charge depuis la base";
  }

  if (elements.galerie) {
    const images = evenement.images.length > 0 ? evenement.images : [evenement.imageSrc];

    elements.galerie.innerHTML = "";
    elements.galerie.style.transform = "translateX(0)";

    for (let index = 0; index < images.length; index += 1) {
      const image = document.createElement("img");

      if (index === 0) {
        image.id = "detail-image";
      }

      image.alt = evenement.imageAlt;
      elements.galerie.appendChild(image);
      attacherImageFallback(image, images[index], evenement.fallbackImageSrc);
    }

    if (typeof window.actualiserCarrouselDetail === "function") {
      window.actualiserCarrouselDetail();
    }
  }

  remplirListeInformations(evenement);
  remplirResumeDetail(evenement);
  remplirListeMateriels(evenement);

  if (elements.blocCarte) {
    elements.blocCarte.hidden = evenement.visugpxIframeUrl === "";
  }

  if (elements.iframeCarte) {
    if (evenement.visugpxIframeUrl) {
      elements.iframeCarte.src = evenement.visugpxIframeUrl;
      elements.iframeCarte.title = "Carte interactive " + evenement.nom;
    } else {
      elements.iframeCarte.removeAttribute("src");
      elements.iframeCarte.title = "Aucune carte interactive";
    }
  }

  if (elements.texteCarte) {
    if (evenement.visugpxIframeUrl) {
      elements.texteCarte.textContent = "Carte interactive VisuGPX disponible.";
    } else if (evenement.lienCarte) {
      elements.texteCarte.textContent =
        "Document parcours disponible : " + evenement.carteParcours;
    } else {
      elements.texteCarte.textContent = "Aucun document parcours disponible.";
    }
  }

  if (elements.lienCarte) {
    if (evenement.lienCarte) {
      elements.lienCarte.hidden = false;
      elements.lienCarte.href = evenement.lienCarte;
      elements.lienCarte.textContent =
        evenement.lienCarteTexte || "Ouvrir le document parcours";
    } else {
      elements.lienCarte.hidden = true;
      elements.lienCarte.removeAttribute("href");
      elements.lienCarte.textContent = "Ouvrir le document parcours";
    }
  }

  if (elements.blocQr) {
    elements.blocQr.hidden = evenement.qrCodeUrl === "";
  }

  if (elements.imageQr) {
    if (evenement.qrCodeUrl !== "") {
      elements.imageQr.onerror = function masquerQrCode() {
        if (elements.blocQr) {
          elements.blocQr.hidden = true;
        }

        elements.imageQr.removeAttribute("src");
      };
      elements.imageQr.src = evenement.qrCodeUrl;
      elements.imageQr.alt = "QR code de la carte VisuGPX " + evenement.nom;
    } else {
      elements.imageQr.removeAttribute("src");
      elements.imageQr.alt = "Aucun QR code disponible";
      elements.imageQr.onerror = null;
    }
  }

  if (elements.lienQr) {
    if (evenement.visugpxPageUrl !== "") {
      elements.lienQr.href = evenement.visugpxPageUrl;
    } else {
      elements.lienQr.removeAttribute("href");
    }
  }

  if (elements.statusPartageCarte) {
    elements.statusPartageCarte.textContent = "";
  }

  if (elements.boutonPartagerCarte) {
    elements.boutonPartagerCarte.disabled = evenement.visugpxPageUrl === "";
    elements.boutonPartagerCarte.onclick = function gererPartageCarte() {
      partagerCarte(evenement, elements.statusPartageCarte);
    };
  }
}

export async function chargerPageDetail() {
  const titre = document.getElementById("detail-name");
  if (!titre) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const page = params.get("page");
  let id = Number(params.get("id"));

  try {
    const responseListe = await fetch(API_URL);
    if (!responseListe.ok) {
      throw new Error("Erreur API " + responseListe.status);
    }

    const donneesListe = await responseListe.json();
    const listeEvenements = Array.isArray(donneesListe) ? donneesListe : [];

    if (!Number.isInteger(id) || id <= 0) {
      id = recupererIdDepuisAnciennePage(listeEvenements, page);
    }

    if (!Number.isInteger(id) || id <= 0) {
      afficherErreur("L'identifiant de l'evenement est invalide.");
      return;
    }

    const responseDetail = await fetch(API_URL + "/" + id);
    if (!responseDetail.ok) {
      throw new Error("Erreur API " + responseDetail.status);
    }

    const detailEvenement = await responseDetail.json();
    let resumeEvenement = null;

    for (let index = 0; index < listeEvenements.length; index += 1) {
      const evenement = listeEvenements[index];

      if (Number(evenement.ID_evenement) === id) {
        resumeEvenement = evenement;
        break;
      }
    }

    const evenement = preparerDonneesEvenement(
      detailEvenement,
      resumeEvenement
    );

    afficherDetail(evenement);
  } catch (error) {
    console.error("Erreur chargement detail evenement :", error);
    afficherErreur("Impossible de charger cet evenement pour le moment.");
  }
}
