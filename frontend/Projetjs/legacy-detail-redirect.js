import { API_URL } from "./event-image-utils.js";

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

function normaliserTexte(texte) {
  return String(texte || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function trouverIdEvenement(listeEvenements, motsCles) {
  for (let index = 0; index < listeEvenements.length; index += 1) {
    const evenement = listeEvenements[index];
    const texteEvenement = normaliserTexte(
      (evenement.Nom || "") + " " + (evenement.Carte_parcours || "")
    );

    for (let i = 0; i < motsCles.length; i += 1) {
      const motCle = normaliserTexte(motsCles[i]);

      if (texteEvenement.includes(motCle)) {
        return Number(evenement.ID_evenement);
      }
    }
  }

  return 0;
}

async function redirigerAnciennePage() {
  const nomPage = window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "")
    .toLowerCase();

  const motsCles = MOTS_CLES_PAR_PAGE[nomPage];
  if (!motsCles) {
    return;
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      return;
    }

    const donnees = await response.json();
    if (!Array.isArray(donnees)) {
      return;
    }

    const idEvenement = trouverIdEvenement(donnees, motsCles);
    if (idEvenement <= 0) {
      return;
    }

    window.location.replace("./evenement.html?id=" + idEvenement);
  } catch (error) {
    console.error("Erreur redirect detail legacy :", error);
  }
}

redirigerAnciennePage();
