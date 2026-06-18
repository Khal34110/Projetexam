import { chargerEvenementsListe } from "./event-liste.js";
import { demarrerFormulaireEvenement } from "./event-formulaire.js";
import { chargerPageDetail } from "./event-detail.js";

function demarrerPageListeEvenements() {
  const listeEvenements = document.getElementById("liste-evenements");

  if (listeEvenements) {
    chargerEvenementsListe();
  }
}

function demarrerPageFormulaireEvenement() {
  const formulaireEvenement = document.getElementById("event-form");

  if (formulaireEvenement) {
    demarrerFormulaireEvenement();
  }
}

function demarrerPageDetailEvenement() {
  const titreDetail = document.getElementById("detail-name");

  if (titreDetail) {
    chargerPageDetail();
  }
}

function demarrerToutesLesPages() {
  demarrerPageListeEvenements();
  demarrerPageFormulaireEvenement();
  demarrerPageDetailEvenement();
}

document.addEventListener("DOMContentLoaded", demarrerToutesLesPages);
