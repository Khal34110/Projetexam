import {
  API_URL,
  attacherImageFallback,
  construireSourcesImage,
} from "./event-image-utils.js";

const DETAIL_URL = "../detail-evenement/evenement.html";

function convertirAccessibilite(valeur) {
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

function formaterDate(valeur) {
  if (!valeur) {
    return "Date inconnue";
  }

  const date = new Date(valeur);
  if (Number.isNaN(date.getTime())) {
    return String(valeur).trim() || "Date inconnue";
  }

  return date.toISOString().split("T")[0];
}

function formaterHeure(valeur) {
  if (!valeur) {
    return "Non renseignee";
  }

  return String(valeur).slice(0, 5);
}

function formaterTarif(valeur) {
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

function recupererRechercheDepuisUrl() {
  const params = new URLSearchParams(window.location.search);
  return normaliserTexte(params.get("q"));
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

function filtrerEvenementsParRecherche(evenements) {
  const recherche = recupererRechercheDepuisUrl();
  const evenementsFiltres = [];

  for (let index = 0; index < evenements.length; index += 1) {
    const evenement = evenements[index];

    if (evenementCorrespondRecherche(evenement, recherche)) {
      evenementsFiltres.push(evenement);
    }
  }

  return evenementsFiltres;
}

function preparerEvenement(apiEvenement) {
  const sourcesImage = construireSourcesImage(apiEvenement, null);

  return {
    id: Number(apiEvenement.ID_evenement),
    nom: apiEvenement.Nom || "Evenement",
    date: formaterDate(apiEvenement.Date_event),
    heureDepart: formaterHeure(apiEvenement.Heure_de_depart),
    difficulte: apiEvenement.difficulte || "Non renseignee",
    tarif: formaterTarif(apiEvenement.Tarif),
    lieuRdv: apiEvenement.Lieu_de_rdv || "",
    accessibilite: convertirAccessibilite(apiEvenement.Accessibilite),
    imageSrc: sourcesImage.imageSrc,
    fallbackImageSrc: sourcesImage.fallbackImageSrc,
  };
}

function creerDetailTexte(label, valeur) {
  const paragraphe = document.createElement("p");
  paragraphe.textContent = label + " : " + valeur;
  return paragraphe;
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
  zoneDetails.appendChild(creerDetailTexte("Date", evenement.date));
  zoneDetails.appendChild(
    creerDetailTexte("Heure de depart", evenement.heureDepart)
  );
  zoneDetails.appendChild(
    creerDetailTexte("Difficulte", evenement.difficulte)
  );
  zoneDetails.appendChild(creerDetailTexte("Tarif", evenement.tarif));
  zoneDetails.appendChild(
    creerDetailTexte(
      "Accessibilite",
      evenement.accessibilite ? "Oui" : "Non"
    )
  );

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

async function chargerEvenements() {
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
        evenements.push(preparerEvenement(donnees[index]));
      }
    }

    afficherEvenements(filtrerEvenementsParRecherche(evenements));
    activerClicMobile();
  } catch (error) {
    console.error("Erreur chargement evenements :", error);
    liste.innerHTML = "<p>Impossible de charger les evenements pour le moment.</p>";
  }
}

document.addEventListener("DOMContentLoaded", chargerEvenements);
