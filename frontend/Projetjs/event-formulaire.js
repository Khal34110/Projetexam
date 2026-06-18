import { API_ROOT, API_URL } from "./utilitaire.js";
import { TYPES_PAR_SELECT } from "./event-outils.js";

const OPTIONS_API_URL = API_ROOT + "/api/event-options";

// Formulaire de creation d'evenement.
function utilisateurEstConnecte() {
  const contenu = window.localStorage.getItem("rdh_user");

  if (!contenu) {
    return false;
  }

  try {
    const utilisateur = JSON.parse(contenu);
    return Boolean(utilisateur);
  } catch (error) {
    return false;
  }
}

function redirigerVersConnexion() {
  window.location.href = "../Projethtml/connexion.html?retour=formevenements";
}

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

function lierCasesMateriel(recommande, obligatoire) {
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

  lierCasesMateriel(recommande.input, obligatoire.input);

  choix.appendChild(recommande.label);
  choix.appendChild(obligatoire.label);
  ligne.appendChild(nomMateriel);
  ligne.appendChild(choix);

  return ligne;
}

function remplirMateriels(materiels) {
  const liste = document.getElementById("materiels-options");

  if (!liste || !Array.isArray(materiels)) {
    return;
  }

  if (liste.querySelector("input")) {
    return;
  }

  liste.innerHTML = "";

  for (let index = 0; index < materiels.length; index += 1) {
    liste.appendChild(creerLigneMateriel(materiels[index]));
  }
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

export function demarrerFormulaireEvenement() {
  const formulaire = document.getElementById("event-form");

  if (!formulaire) {
    return;
  }

  if (!utilisateurEstConnecte()) {
    redirigerVersConnexion();
    return;
  }

  chargerOptionsFormulaire();
  formulaire.addEventListener("submit", envoyerFormulaire);
}
