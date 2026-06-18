import {
  API_URL,
  attacherImageFallback,
  construireSourcesImage,
} from "./utilitaire.js";
import {
  construireLienDetail,
  convertirEnBooleen,
  formaterDate,
  formaterHeure,
  formaterTarifListe,
  normaliserTexte,
  reparerTexteMalEncode,
} from "./event-outils.js";

// Liste des evenements.
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
    nom: reparerTexteMalEncode(apiEvenement.Nom || "Evenement"),
    date: formaterDate(apiEvenement.Date_event, "Date inconnue"),
    heureDepart: formaterHeure(apiEvenement.Heure_de_depart, "Non renseignee"),
    difficulte: reparerTexteMalEncode(apiEvenement.difficulte || "Non renseignee"),
    tarif: formaterTarifListe(apiEvenement.Tarif),
    lieuRdv: reparerTexteMalEncode(apiEvenement.Lieu_de_rdv || ""),
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

function afficherMessageListe(message, type) {
  const liste = document.getElementById("liste-evenements");
  if (!liste) {
    return;
  }

  const typeMessage = type === "erreur" ? "erreur" : "info";
  liste.innerHTML =
    '<div class="message-liste-evenements ' +
    typeMessage +
    '">' +
    message +
    "</div>";
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

export async function chargerEvenementsListe() {
  const liste = document.getElementById("liste-evenements");
  if (!liste) {
    return;
  }

  try {
    afficherMessageListe("Chargement des evenements...", "info");

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
    afficherMessageListe(
      "Impossible de charger les evenements pour le moment. Verifiez que la base de donnees et le serveur API sont disponibles.",
      "erreur"
    );
  }
}
