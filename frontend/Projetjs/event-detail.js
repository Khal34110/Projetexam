import {
  API_URL,
  DEFAULT_IMAGE,
  attacherImageFallback,
  choisirGalerieLocaleEvenement,
  construireSourcesImage,
} from "./event-image-utils.js";

function convertirEnBooleen(valeur) {
  if (typeof valeur === "boolean") {
    return valeur;
  }

  if (typeof valeur === "number") {
    return valeur === 1;
  }

  if (typeof valeur === "string") {
    const texte = valeur.trim().toLowerCase();
    return texte === "1" || texte === "true" || texte === "oui";
  }

  return false;
}

function formaterOuiNon(valeur) {
  if (valeur === null || valeur === undefined || valeur === "") {
    return "Non renseignee";
  }

  return convertirEnBooleen(valeur) ? "Oui" : "Non";
}

function formaterDate(valeur) {
  if (!valeur) {
    return "Non renseignee";
  }

  const date = new Date(valeur);
  if (Number.isNaN(date.getTime())) {
    return String(valeur).trim() || "Non renseignee";
  }

  return date.toISOString().split("T")[0];
}

function formaterHeure(valeur) {
  if (!valeur) {
    return "Non renseignee";
  }

  return String(valeur).slice(0, 5);
}

function formaterValeur(valeur, suffixe) {
  if (valeur === null || valeur === undefined || valeur === "") {
    return "Non renseignee";
  }

  return String(valeur) + (suffixe || "");
}

function texteExiste(valeur) {
  return String(valeur || "").trim() !== "";
}

function construireLienDocument(chemin) {
  const valeur = String(chemin || "").trim();

  if (valeur === "") {
    return "";
  }

  if (/^https?:\/\//i.test(valeur)) {
    return valeur;
  }

  if (valeur.startsWith("/")) {
    return "http://localhost:3000" + valeur;
  }

  if (valeur.startsWith("../") || valeur.startsWith("./")) {
    return valeur;
  }

  return "http://localhost:3000/" + valeur.replace(/^\/+/, "");
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

async function chargerListeEvenements() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Erreur API " + response.status);
  }

  const donnees = await response.json();
  if (Array.isArray(donnees)) {
    return donnees;
  }

  return [];
}

async function chargerDetailEvenement(id) {
  const response = await fetch(API_URL + "/" + id);

  if (!response.ok) {
    throw new Error("Erreur API " + response.status);
  }

  return response.json();
}

function trouverResumeEvenement(liste, id) {
  for (let index = 0; index < liste.length; index += 1) {
    const evenement = liste[index];

    if (Number(evenement.ID_evenement) === id) {
      return evenement;
    }
  }

  return null;
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
    nom = detailApi.Nom;
  } else if (resumeApi && resumeApi.Nom) {
    nom = resumeApi.Nom;
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
    lieuRdv = detailApi.Lieu_de_rdv;
  } else if (resumeApi && resumeApi.Lieu_de_rdv) {
    lieuRdv = resumeApi.Lieu_de_rdv;
  }

  let accessibilite = null;
  if (detailApi && detailApi.Accessibilite !== undefined) {
    accessibilite = detailApi.Accessibilite;
  } else if (resumeApi && resumeApi.Accessibilite !== undefined) {
    accessibilite = resumeApi.Accessibilite;
  }

  let difficulte = "Non renseignee";
  if (resumeApi && resumeApi.difficulte) {
    difficulte = resumeApi.difficulte;
  } else if (detailApi && detailApi.difficulte) {
    difficulte = detailApi.difficulte;
  } else if (detailApi && detailApi.ID_difficulte) {
    difficulte = "Niveau " + detailApi.ID_difficulte;
  }

  const description =
    (detailApi && detailApi.Descriptif) ||
    "Aucune description detaillee n'est disponible pour cet evenement.";

  const carteParcours =
    (detailApi && detailApi.Carte_parcours) ||
    (resumeApi && resumeApi.Carte_parcours) ||
    "";
  const visugpxIframeUrl =
    String(
      (detailApi && detailApi.visugpx_iframe_url) ||
        (resumeApi && resumeApi.visugpx_iframe_url) ||
        ""
    ).trim();
  const visugpxPageUrl =
    String(
      (detailApi && detailApi.visugpx_url) ||
        (resumeApi && resumeApi.visugpx_url) ||
        ""
    ).trim();
  const lienDocument = construireLienDocument(carteParcours);

  let lienCarte = "";
  let lienCarteTexte = "";

  if (texteExiste(carteParcours) && visugpxIframeUrl === "") {
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
      const urlImage = construireLienDocument(image && image.Url);
      ajouterImageSiAbsente(images, urlImage);
    }
  }

  return {
    id: idEvenement,
    nom: nom,
    description: description,
    imageSrc: sourcesImage.imageSrc,
    fallbackImageSrc: sourcesImage.fallbackImageSrc,
    imageAlt: nom,
    date: formaterDate(date),
    heureDepart: formaterHeure(heureDepart),
    heureArrivee: formaterHeure(detailApi && detailApi.Heure_d_arrivee),
    lieuRdv: formaterValeur(lieuRdv),
    lieuArrivee: formaterValeur(detailApi && detailApi.Lieu_d_arrivee),
    tarif:
      detailApi && detailApi.Tarif
        ? String(detailApi.Tarif) + " EUR"
        : "Non renseigne",
    accessibilite: formaterOuiNon(accessibilite),
    difficulte: difficulte,
    denivele: formaterValeur(detailApi && detailApi.Denivele, " m"),
    altitudeMax: formaterValeur(
      detailApi && detailApi.Altitude_maximale,
      " m"
    ),
    pointEau: formaterOuiNon(
      detailApi && detailApi.Point_d_eau_ravitaillement
    ),
    materiels:
      detailApi && Array.isArray(detailApi.materiels)
        ? detailApi.materiels
        : [],
    images: images,
    carteParcours: carteParcours,
    lienCarte: lienCarte,
    lienCarteTexte: lienCarteTexte,
    visugpxPageUrl: visugpxPageUrl,
    visugpxIframeUrl: visugpxIframeUrl,
    qrCodeUrl:
      visugpxPageUrl !== "" ? construireUrlQrCodeEvenement(idEvenement) : "",
  };
}

function ajouterLigneInformation(label, valeur) {
  const liste = document.getElementById("detail-info-list");
  if (!liste) {
    return;
  }

  const ligne = document.createElement("li");
  const titre = document.createElement("strong");
  titre.textContent = label + " : ";

  ligne.appendChild(titre);
  ligne.appendChild(document.createTextNode(valeur));
  liste.appendChild(ligne);
}

function remplirInputDetail(idInput, valeur) {
  const input = document.getElementById(idInput);

  if (!input) {
    return;
  }

  input.value = valeur;
}

function viderInputsDetailEvenement() {
  const inputs = document.querySelectorAll(".detail-inputs-evenement input");

  for (let index = 0; index < inputs.length; index += 1) {
    inputs[index].value = "";
  }
}

function remplirListeInformations(evenement) {
  const liste = document.getElementById("detail-info-list");
  if (!liste) {
    return;
  }

  liste.innerHTML = "";

  remplirInputDetail("detail-input-date", evenement.date);
  remplirInputDetail("detail-input-heure-depart", evenement.heureDepart);
  remplirInputDetail("detail-input-heure-arrivee", evenement.heureArrivee);
  remplirInputDetail("detail-input-lieu-rdv", evenement.lieuRdv);
  remplirInputDetail("detail-input-lieu-arrivee", evenement.lieuArrivee);
  remplirInputDetail("detail-input-tarif", evenement.tarif);
  remplirInputDetail("detail-input-accessibilite", evenement.accessibilite);
  remplirInputDetail("detail-input-difficulte", evenement.difficulte);
  remplirInputDetail("detail-input-denivele", evenement.denivele);
  remplirInputDetail("detail-input-altitude-max", evenement.altitudeMax);
  remplirInputDetail("detail-input-point-eau", evenement.pointEau);

  ajouterLigneInformation("Date", evenement.date);
  ajouterLigneInformation("Heure de depart", evenement.heureDepart);
  ajouterLigneInformation("Heure d'arrivee", evenement.heureArrivee);
  ajouterLigneInformation("Lieu de rendez-vous", evenement.lieuRdv);
  ajouterLigneInformation("Lieu d'arrivee", evenement.lieuArrivee);
  ajouterLigneInformation("Tarif", evenement.tarif);
  ajouterLigneInformation("Accessibilite", evenement.accessibilite);
  ajouterLigneInformation("Difficulte", evenement.difficulte);
  ajouterLigneInformation("Denivele", evenement.denivele);
  ajouterLigneInformation("Altitude maximale", evenement.altitudeMax);
  ajouterLigneInformation("Point d'eau / ravitaillement", evenement.pointEau);
}

function ajouterMaterielDansListe(liste, nomMateriel) {
  const ligne = document.createElement("label");
  const input = document.createElement("input");
  const texte = document.createElement("span");

  ligne.className = "detail-materiel-input";
  input.type = "checkbox";
  input.checked = true;
  input.disabled = true;
  texte.textContent = nomMateriel;

  ligne.appendChild(input);
  ligne.appendChild(texte);
  liste.appendChild(ligne);
}

function ajouterMessageMaterielVide(liste, message) {
  const ligne = document.createElement("p");
  ligne.className = "detail-materiel-vide";
  ligne.textContent = message;
  liste.appendChild(ligne);
}

function remplirListeMateriels(evenement) {
  const listeObligatoire = document.getElementById("detail-materiel-obligatoire");
  const listeRecommande = document.getElementById("detail-materiel-recommande");

  if (!listeObligatoire || !listeRecommande) {
    return;
  }

  listeObligatoire.innerHTML = "";
  listeRecommande.innerHTML = "";

  let compteurObligatoire = 0;
  let compteurRecommande = 0;

  for (let index = 0; index < evenement.materiels.length; index += 1) {
    const materiel = evenement.materiels[index];
    const nomMateriel = materiel.nom || "Materiel";

    if (materiel.obligatoire) {
      ajouterMaterielDansListe(listeObligatoire, nomMateriel);
      compteurObligatoire += 1;
    } else {
      ajouterMaterielDansListe(listeRecommande, nomMateriel);
      compteurRecommande += 1;
    }
  }

  if (compteurObligatoire === 0) {
    ajouterMessageMaterielVide(listeObligatoire, "Aucun materiel obligatoire");
  }

  if (compteurRecommande === 0) {
    ajouterMessageMaterielVide(listeRecommande, "Aucun materiel recommande");
  }
}

async function copierLienCarte(urlCarte, zoneStatus) {
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

async function partagerCarte(evenement, zoneStatus) {
  const urlCarte = String(evenement.visugpxPageUrl || "").trim();

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

    await copierLienCarte(urlCarte, zoneStatus);
  } catch (error) {
    if (error && error.name === "AbortError") {
      return;
    }

    console.error("Erreur partage carte :", error);
    await copierLienCarte(urlCarte, zoneStatus);
  }
}

function afficherErreur(message) {
  const titre = document.getElementById("detail-name");
  const description = document.getElementById("detail-description");
  const status = document.getElementById("detail-status");
  const liste = document.getElementById("detail-info-list");
  const listeObligatoire = document.getElementById("detail-materiel-obligatoire");
  const listeRecommande = document.getElementById("detail-materiel-recommande");
  const galerie = document.getElementById("detail-gallery");
  const texteCarte = document.getElementById("detail-map-text");
  const lienCarte = document.getElementById("detail-map-link");
  const blocCarte = document.getElementById("detail-map-frame-container");
  const iframeCarte = document.getElementById("detail-map-iframe");
  const blocQr = document.getElementById("detail-map-qr-card");
  const imageQr = document.getElementById("detail-map-qr-image");
  const lienQr = document.getElementById("detail-map-qr-link");
  const boutonPartagerCarte = document.getElementById("detail-map-share-button");
  const statusPartageCarte = document.getElementById("detail-map-share-status");

  if (titre) {
    titre.textContent = "Evenement introuvable";
  }

  if (description) {
    description.textContent = message;
  }

  if (status) {
    status.textContent = "Erreur de chargement";
  }

  if (liste) {
    liste.innerHTML = "";
  }

  viderInputsDetailEvenement();

  if (listeObligatoire) {
    listeObligatoire.innerHTML = "";
  }

  if (listeRecommande) {
    listeRecommande.innerHTML = "";
  }

  if (galerie) {
    galerie.innerHTML = "";
    galerie.style.transform = "translateX(0)";

    const image = document.createElement("img");
    image.id = "detail-image";
    image.src = DEFAULT_IMAGE;
    image.alt = "Evenement introuvable";
    galerie.appendChild(image);
  }

  if (texteCarte) {
    texteCarte.textContent = "Aucun document parcours disponible.";
  }

  if (blocCarte) {
    blocCarte.hidden = true;
  }

  if (iframeCarte) {
    iframeCarte.removeAttribute("src");
  }

  if (lienCarte) {
    lienCarte.hidden = true;
    lienCarte.removeAttribute("href");
    lienCarte.textContent = "Ouvrir le document parcours";
  }

  if (blocQr) {
    blocQr.hidden = true;
  }

  if (imageQr) {
    imageQr.removeAttribute("src");
    imageQr.onerror = null;
  }

  if (lienQr) {
    lienQr.removeAttribute("href");
  }

  if (boutonPartagerCarte) {
    boutonPartagerCarte.disabled = true;
    boutonPartagerCarte.onclick = null;
  }

  if (statusPartageCarte) {
    statusPartageCarte.textContent = "";
  }

  if (typeof window.actualiserCarrouselDetail === "function") {
    window.actualiserCarrouselDetail();
  }
}

function afficherDetail(evenement) {
  document.title = evenement.nom + " | Evenement";

  const titre = document.getElementById("detail-name");
  const description = document.getElementById("detail-description");
  const status = document.getElementById("detail-status");
  const galerie = document.getElementById("detail-gallery");
  const texteCarte = document.getElementById("detail-map-text");
  const lienCarte = document.getElementById("detail-map-link");
  const blocCarte = document.getElementById("detail-map-frame-container");
  const iframeCarte = document.getElementById("detail-map-iframe");
  const blocQr = document.getElementById("detail-map-qr-card");
  const imageQr = document.getElementById("detail-map-qr-image");
  const lienQr = document.getElementById("detail-map-qr-link");
  const boutonPartagerCarte = document.getElementById("detail-map-share-button");
  const statusPartageCarte = document.getElementById("detail-map-share-status");

  if (titre) {
    titre.textContent = evenement.nom;
  }

  if (description) {
    description.textContent = evenement.description;
  }

  if (status) {
    status.textContent = "Detail charge depuis la base";
  }

  if (galerie) {
    galerie.innerHTML = "";
    galerie.style.transform = "translateX(0)";

    if (evenement.images.length === 0) {
      const image = document.createElement("img");
      image.id = "detail-image";
      image.alt = evenement.imageAlt;
      galerie.appendChild(image);

      attacherImageFallback(
        image,
        evenement.imageSrc,
        evenement.fallbackImageSrc
      );
    } else {
      for (let index = 0; index < evenement.images.length; index += 1) {
        const urlImage = evenement.images[index];
        const image = document.createElement("img");

        if (index === 0) {
          image.id = "detail-image";
        }

        image.alt = evenement.imageAlt;
        galerie.appendChild(image);

        attacherImageFallback(
          image,
          urlImage,
          evenement.fallbackImageSrc
        );
      }
    }

    if (typeof window.actualiserCarrouselDetail === "function") {
      window.actualiserCarrouselDetail();
    }
  }

  remplirListeInformations(evenement);
  remplirListeMateriels(evenement);

  if (blocCarte) {
    blocCarte.hidden = evenement.visugpxIframeUrl === "";
  }

  if (iframeCarte) {
    if (evenement.visugpxIframeUrl) {
      iframeCarte.src = evenement.visugpxIframeUrl;
      iframeCarte.title = "Carte interactive " + evenement.nom;
    } else {
      iframeCarte.removeAttribute("src");
      iframeCarte.title = "Aucune carte interactive";
    }
  }

  if (texteCarte) {
    if (evenement.visugpxIframeUrl) {
      texteCarte.textContent = "Carte interactive VisuGPX disponible.";
    } else if (evenement.lienCarte) {
      texteCarte.textContent =
        "Document parcours disponible : " + evenement.carteParcours;
    } else {
      texteCarte.textContent = "Aucun document parcours disponible.";
    }
  }

  if (lienCarte) {
    if (evenement.lienCarte) {
      lienCarte.hidden = false;
      lienCarte.href = evenement.lienCarte;
      lienCarte.textContent =
        evenement.lienCarteTexte || "Ouvrir le document parcours";
    } else {
      lienCarte.hidden = true;
      lienCarte.removeAttribute("href");
      lienCarte.textContent = "Ouvrir le document parcours";
    }
  }

  if (blocQr) {
    blocQr.hidden = evenement.qrCodeUrl === "";
  }

  if (imageQr) {
    if (evenement.qrCodeUrl !== "") {
      imageQr.onerror = function masquerQrCode() {
        if (blocQr) {
          blocQr.hidden = true;
        }

        imageQr.removeAttribute("src");
      };
      imageQr.src = evenement.qrCodeUrl;
      imageQr.alt = "QR code de la carte VisuGPX " + evenement.nom;
    } else {
      imageQr.removeAttribute("src");
      imageQr.alt = "Aucun QR code disponible";
      imageQr.onerror = null;
    }
  }

  if (lienQr) {
    if (evenement.visugpxPageUrl !== "") {
      lienQr.href = evenement.visugpxPageUrl;
    } else {
      lienQr.removeAttribute("href");
    }
  }

  if (statusPartageCarte) {
    statusPartageCarte.textContent = "";
  }

  if (boutonPartagerCarte) {
    boutonPartagerCarte.disabled = evenement.visugpxPageUrl === "";
    boutonPartagerCarte.onclick = function gererPartageCarte() {
      partagerCarte(evenement, statusPartageCarte);
    };
  }
}

async function chargerPageDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    afficherErreur("L'identifiant de l'evenement est invalide.");
    return;
  }

  try {
    const listeEvenements = await chargerListeEvenements();
    const detailEvenement = await chargerDetailEvenement(id);
    const resumeEvenement = trouverResumeEvenement(listeEvenements, id);
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

document.addEventListener("DOMContentLoaded", chargerPageDetail);
