import {
  API_ROOT,
  API_URL,
  DEFAULT_IMAGE,
  attacherImageFallback,
  choisirGalerieLocaleEvenement,
  construireSourcesImage,
} from "./utilitaire.js";

const OPTIONS_API_URL = API_ROOT + "/api/event-options";
const DETAIL_URL = "../detail-evenement/evenement.html";

const TYPES_PAR_SELECT = {
  pedestre: 1,
  trail: 2,
  vtt: 3,
};

const MOTS_CLES_PAR_PAGE = {
  cirquedelabeil: ["labeil"],
  cornichelaroux: ["lauroux", "corniche"],
  lavaldenize: ["laval", "nize"],
  lesfenestrettes: ["fenestrettes"],
  lagardiole: ["gardiole"],
  lacdusalagou: ["salagou"],
  chapellestamans: ["chapelle", "saint-amans", "villecun"],
  cirquedemoureze: ["moureze"],
};

// Partie liste des evenements
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

function formaterDate(valeur, texteVide) {
  if (!valeur) {
    return texteVide;
  }

  const date = new Date(valeur);
  if (Number.isNaN(date.getTime())) {
    return String(valeur).trim() || texteVide;
  }

  return date.toISOString().split("T")[0];
}

function formaterHeure(valeur, texteVide) {
  if (!valeur) {
    return texteVide;
  }

  return String(valeur).slice(0, 5);
}

function formaterTarifListe(valeur) {
  if (valeur === null || valeur === undefined || valeur === "") {
    return "Non renseigne";
  }

  return String(valeur) + " EUR";
}

function construireLienDetail(id) {
  return DETAIL_URL + "?id=" + id;
}

function normaliserTexte(valeur) {
  return String(valeur || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function evenementCorrespondRecherche(evenement, recherche) {
  if (recherche === "") {
    return true;
  }

  const texteEvenement = normaliserTexte(
    evenement.nom +
      " " +
      evenement.date +
      " " +
      evenement.heureDepart +
      " " +
      evenement.difficulte +
      " " +
      evenement.tarif +
      " " +
      evenement.lieuRdv
  );

  return texteEvenement.includes(recherche);
}

function preparerEvenementListe(apiEvenement) {
  const sourcesImage = construireSourcesImage(apiEvenement, null);

  return {
    id: Number(apiEvenement.ID_evenement),
    nom: apiEvenement.Nom || "Evenement",
    date: formaterDate(apiEvenement.Date_event, "Date inconnue"),
    heureDepart: formaterHeure(apiEvenement.Heure_de_depart, "Non renseignee"),
    difficulte: apiEvenement.difficulte || "Non renseignee",
    tarif: formaterTarifListe(apiEvenement.Tarif),
    lieuRdv: apiEvenement.Lieu_de_rdv || "",
    accessibilite: convertirEnBooleen(apiEvenement.Accessibilite),
    imageSrc: sourcesImage.imageSrc,
    fallbackImageSrc: sourcesImage.fallbackImageSrc,
  };
}

function creerCarteEvenement(evenement) {
  const bloc = document.createElement("div");
  bloc.className = "evenement";

  const lien = document.createElement("a");
  lien.href = construireLienDetail(evenement.id);

  const image = document.createElement("img");
  image.alt = evenement.nom;

  const zoneTitre = document.createElement("div");
  zoneTitre.className = "titre-evenement";

  const titre = document.createElement("h3");
  titre.textContent = evenement.nom;

  const zoneDetails = document.createElement("div");
  zoneDetails.className = "details-evenement";
  const details = [
    "Date : " + evenement.date,
    "Heure de depart : " + evenement.heureDepart,
    "Difficulte : " + evenement.difficulte,
    "Tarif : " + evenement.tarif,
    "Accessibilite : " + (evenement.accessibilite ? "Oui" : "Non"),
  ];

  for (let index = 0; index < details.length; index += 1) {
    const paragraphe = document.createElement("p");
    paragraphe.textContent = details[index];
    zoneDetails.appendChild(paragraphe);
  }

  zoneTitre.appendChild(titre);
  zoneTitre.appendChild(zoneDetails);
  lien.appendChild(image);
  lien.appendChild(zoneTitre);
  bloc.appendChild(lien);

  attacherImageFallback(
    image,
    evenement.imageSrc,
    evenement.fallbackImageSrc
  );

  return bloc;
}

function afficherEvenements(evenements) {
  const liste = document.getElementById("liste-evenements");
  if (!liste) {
    return;
  }

  liste.innerHTML = "";

  if (evenements.length === 0) {
    liste.innerHTML = "<p>Aucun evenement a afficher pour le moment.</p>";
    return;
  }

  for (let index = 0; index < evenements.length; index += 1) {
    const evenement = evenements[index];
    const carte = creerCarteEvenement(evenement);
    liste.appendChild(carte);
  }
}

function activerClicMobile() {
  const cartes = document.querySelectorAll(".evenement");

  for (let index = 0; index < cartes.length; index += 1) {
    const carte = cartes[index];

    carte.addEventListener("click", function gererClicMobile(event) {
      if (window.innerWidth > 850) {
        return;
      }

      if (carte.classList.contains("active")) {
        return;
      }

      event.preventDefault();

      for (let i = 0; i < cartes.length; i += 1) {
        cartes[i].classList.remove("active");
      }

      carte.classList.add("active");
    });
  }
}

async function chargerEvenementsListe() {
  const liste = document.getElementById("liste-evenements");
  if (!liste) {
    return;
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Erreur API " + response.status);
    }

    const donnees = await response.json();
    const evenements = [];

    if (Array.isArray(donnees)) {
      for (let index = 0; index < donnees.length; index += 1) {
        evenements.push(preparerEvenementListe(donnees[index]));
      }
    }

    const recherche = normaliserTexte(
      new URLSearchParams(window.location.search).get("q")
    );
    const evenementsFiltres = [];

    for (let index = 0; index < evenements.length; index += 1) {
      const evenement = evenements[index];

      if (evenementCorrespondRecherche(evenement, recherche)) {
        evenementsFiltres.push(evenement);
      }
    }

    afficherEvenements(evenementsFiltres);
    activerClicMobile();
  } catch (error) {
    console.error("Erreur chargement evenements :", error);
    liste.innerHTML = "<p>Impossible de charger les evenements pour le moment.</p>";
  }
}

// Partie formulaire nouvel evenement
function afficherMessageFormulaire(message, type) {
  const zoneMessage = document.getElementById("event-form-message");

  if (!zoneMessage) {
    return;
  }

  zoneMessage.textContent = message;
  zoneMessage.className = "event-form-message " + type;
}

function remplirDifficultes(difficultes) {
  const select = document.getElementById("difficulte-options");

  if (!select || !Array.isArray(difficultes)) {
    return;
  }

  select.innerHTML = "";

  const optionVide = document.createElement("option");
  optionVide.value = "";
  optionVide.textContent = "-- Choisir --";
  select.appendChild(optionVide);

  for (let index = 0; index < difficultes.length; index += 1) {
    const difficulte = difficultes[index];
    const option = document.createElement("option");
    option.value = difficulte.ID_difficulte;
    option.textContent = difficulte.Nom;
    select.appendChild(option);
  }
}

function creerCaseMateriel(nom, valeur, texte) {
  const label = document.createElement("label");
  const input = document.createElement("input");

  input.type = "checkbox";
  input.name = nom;
  input.value = valeur;

  label.appendChild(input);
  label.appendChild(document.createTextNode(" " + texte));

  return {
    label: label,
    input: input,
  };
}

function creerLigneMateriel(materiel) {
  const ligne = document.createElement("div");
  const nomMateriel = document.createElement("span");
  const choix = document.createElement("div");
  const recommande = creerCaseMateriel(
    "materiels[]",
    materiel.ID_materiel,
    "Recommande"
  );
  const obligatoire = creerCaseMateriel(
    "materiels_obligatoires[]",
    materiel.ID_materiel,
    "Obligatoire"
  );

  ligne.className = "materiel-ligne";
  nomMateriel.className = "materiel-nom";
  choix.className = "materiel-choix";

  nomMateriel.textContent = materiel.nom;

  obligatoire.input.addEventListener("change", function cocherRecommande() {
    if (obligatoire.input.checked) {
      recommande.input.checked = true;
    }
  });

  recommande.input.addEventListener("change", function decocherObligatoire() {
    if (!recommande.input.checked) {
      obligatoire.input.checked = false;
    }
  });

  choix.appendChild(recommande.label);
  choix.appendChild(obligatoire.label);
  ligne.appendChild(nomMateriel);
  ligne.appendChild(choix);

  return ligne;
}

function initialiserCasesMateriel(liste) {
  const casesObligatoires = liste.querySelectorAll(
    'input[name="materiels_obligatoires[]"]'
  );

  for (let index = 0; index < casesObligatoires.length; index += 1) {
    const obligatoire = casesObligatoires[index];
    const recommande = liste.querySelector(
      'input[name="materiels[]"][value="' + obligatoire.value + '"]'
    );

    if (!recommande) {
      continue;
    }

    obligatoire.addEventListener("change", function cocherRecommande() {
      if (obligatoire.checked) {
        recommande.checked = true;
      }
    });

    recommande.addEventListener("change", function decocherObligatoire() {
      if (!recommande.checked) {
        obligatoire.checked = false;
      }
    });
  }
}

function remplirMateriels(materiels) {
  const liste = document.getElementById("materiels-options");

  if (!liste || !Array.isArray(materiels)) {
    return;
  }

  if (liste.querySelector("input")) {
    initialiserCasesMateriel(liste);
    return;
  }

  liste.innerHTML = "";

  for (let index = 0; index < materiels.length; index += 1) {
    liste.appendChild(creerLigneMateriel(materiels[index]));
  }

  initialiserCasesMateriel(liste);
}

async function chargerOptionsFormulaire() {
  try {
    const reponse = await fetch(OPTIONS_API_URL);

    if (!reponse.ok) {
      throw new Error("Erreur API " + reponse.status);
    }

    const options = await reponse.json();
    remplirDifficultes(options.difficultes);
    remplirMateriels(options.materiels);
  } catch (error) {
    console.error("Erreur chargement options formulaire :", error);
    afficherMessageFormulaire(
      "Impossible de charger le materiel recommande pour le moment.",
      "erreur"
    );
  }
}

function convertirListeNombres(valeurs) {
  const nombres = [];

  for (let index = 0; index < valeurs.length; index += 1) {
    const nombre = Number(valeurs[index]);

    if (Number.isInteger(nombre) && nombre > 0 && !nombres.includes(nombre)) {
      nombres.push(nombre);
    }
  }

  return nombres;
}

function preparerDonneesFormulaire(formulaire) {
  const formData = new FormData(formulaire);
  const donnees = {};
  const champs = [
    "Nom",
    "Descriptif",
    "Date_event",
    "Heure_de_depart",
    "Heure_d_arrivee",
    "Lieu_de_rdv",
    "Lieu_d_arrivee",
    "Tarif",
    "Carte_parcours",
    "Denivele",
    "Altitude_maximale",
    "Point_d_eau_ravitaillement",
    "ID_difficulte",
  ];
  const accessibilite = String(formData.get("Accessibilite") || "").trim();
  const typeRandonnee = String(formData.get("type_randonnee") || "").trim();
  const materiels = convertirListeNombres(formData.getAll("materiels[]"));
  const materielsObligatoires = convertirListeNombres(
    formData.getAll("materiels_obligatoires[]")
  );

  for (let index = 0; index < champs.length; index += 1) {
    const nomChamp = champs[index];
    const valeur = String(formData.get(nomChamp) || "").trim();

    if (valeur !== "") {
      donnees[nomChamp] = valeur;
    }
  }

  if (accessibilite !== "") {
    donnees.Accessibilite = Number(accessibilite);
  }

  for (let index = 0; index < materielsObligatoires.length; index += 1) {
    const idMateriel = materielsObligatoires[index];

    if (!materiels.includes(idMateriel)) {
      materiels.push(idMateriel);
    }
  }

  if (materiels.length > 0) {
    donnees.materiels = materiels;
  }

  if (materielsObligatoires.length > 0) {
    donnees.materiels_obligatoires = materielsObligatoires;
  }

  if (typeRandonnee !== "" && TYPES_PAR_SELECT[typeRandonnee]) {
    donnees.types = [TYPES_PAR_SELECT[typeRandonnee]];
  }

  return donnees;
}

async function envoyerFormulaire(event) {
  event.preventDefault();

  const formulaire = event.currentTarget;
  const donnees = preparerDonneesFormulaire(formulaire);

  if (!donnees.Nom || !donnees.ID_difficulte) {
    afficherMessageFormulaire(
      "Le nom de l'evenement et le niveau de difficulte sont obligatoires.",
      "erreur"
    );
    return;
  }

  try {
    afficherMessageFormulaire("Envoi de l'evenement en cours...", "info");

    const reponse = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(donnees),
    });
    const resultat = await reponse.json();

    if (!reponse.ok) {
      throw new Error(resultat.message || "Erreur API " + reponse.status);
    }

    formulaire.reset();
    afficherMessageFormulaire(
      "Evenement cree avec l'identifiant " + resultat.id + ".",
      "succes"
    );
  } catch (error) {
    console.error("Erreur envoi evenement :", error);
    afficherMessageFormulaire(error.message, "erreur");
  }
}

function demarrerFormulaireEvenement() {
  const formulaire = document.getElementById("event-form");

  if (!formulaire) {
    return;
  }

  chargerOptionsFormulaire();
  formulaire.addEventListener("submit", envoyerFormulaire);
}

// Partie page detail
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
    description: description,
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
    const input = document.getElementById(ligneInfo.idInput);
    const ligne = document.createElement("li");
    const titre = document.createElement("strong");

    if (input) {
      input.value = ligneInfo.valeur;
    }

    titre.textContent = ligneInfo.label + " : ";
    ligne.appendChild(titre);
    ligne.appendChild(document.createTextNode(ligneInfo.valeur));
    fragment.appendChild(ligne);
  }

  liste.appendChild(fragment);
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

  const inputs = document.querySelectorAll(".detail-inputs-evenement input");

  for (let index = 0; index < inputs.length; index += 1) {
    inputs[index].value = "";
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

async function chargerPageDetail() {
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

function demarrerToutesLesPages() {
  chargerEvenementsListe();
  demarrerFormulaireEvenement();
  chargerPageDetail();
}

document.addEventListener("DOMContentLoaded", demarrerToutesLesPages);

//test
