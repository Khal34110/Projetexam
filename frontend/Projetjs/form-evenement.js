const OPTIONS_API_URL = "http://localhost:3000/api/event-options";
const EVENTS_API_URL = "http://localhost:3000/api/events";

const TYPES_PAR_SELECT = {
  pedestre: 1,
  trail: 2,
  vtt: 3,
};

function afficherMessage(message, type) {
  const zoneMessage = document.getElementById("event-form-message");

  if (!zoneMessage) {
    return;
  }

  zoneMessage.textContent = message;
  zoneMessage.className = "event-form-message " + type;
}

function viderElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function ajouterOption(select, valeur, texte) {
  const option = document.createElement("option");
  option.value = valeur;
  option.textContent = texte;
  select.appendChild(option);
}

function remplirDifficultes(difficultes) {
  const select = document.getElementById("difficulte-options");

  if (!select || !Array.isArray(difficultes)) {
    return;
  }

  viderElement(select);
  ajouterOption(select, "", "-- Choisir --");

  for (let index = 0; index < difficultes.length; index += 1) {
    const difficulte = difficultes[index];
    ajouterOption(select, difficulte.ID_difficulte, difficulte.Nom);
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

  viderElement(liste);

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
    afficherMessage(
      "Impossible de charger le materiel recommande pour le moment.",
      "erreur"
    );
  }
}

function lireValeur(formData, nom) {
  return String(formData.get(nom) || "").trim();
}

function ajouterChampSiRempli(objet, nom, valeur) {
  if (valeur !== "") {
    objet[nom] = valeur;
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
  const nom = lireValeur(formData, "Nom") || lireValeur(formData, "nom_randonnee");
  const dateEvent =
    lireValeur(formData, "Date_event") || lireValeur(formData, "date_evenement");
  const lieuRdv =
    lireValeur(formData, "Lieu_de_rdv") || lireValeur(formData, "lieu_rdv");
  const heureDepart =
    lireValeur(formData, "Heure_de_depart") || lireValeur(formData, "heure_depart");
  const heureArrivee =
    lireValeur(formData, "Heure_d_arrivee") || lireValeur(formData, "heure_arrivee");
  const lieuArrivee =
    lireValeur(formData, "Lieu_d_arrivee") || lireValeur(formData, "arrivee");
  const denivele =
    lireValeur(formData, "Denivele") || lireValeur(formData, "denivele");
  const pointEau =
    lireValeur(formData, "Point_d_eau_ravitaillement") ||
    (lireValeur(formData, "ravitaillement") === "oui" ? "1" : "");
  const accessibilite = lireValeur(formData, "accessibilite");
  const typeRandonnee = lireValeur(formData, "type_randonnee");
  const materiels = convertirListeNombres(formData.getAll("materiels[]"));
  const materielsObligatoires = convertirListeNombres(
    formData.getAll("materiels_obligatoires[]")
  );

  ajouterChampSiRempli(donnees, "Nom", nom);
  ajouterChampSiRempli(donnees, "Descriptif", lireValeur(formData, "Descriptif"));
  ajouterChampSiRempli(donnees, "Date_event", dateEvent);
  ajouterChampSiRempli(donnees, "Heure_de_depart", heureDepart);
  ajouterChampSiRempli(donnees, "Heure_d_arrivee", heureArrivee);
  ajouterChampSiRempli(donnees, "Lieu_de_rdv", lieuRdv);
  ajouterChampSiRempli(donnees, "Lieu_d_arrivee", lieuArrivee);
  ajouterChampSiRempli(donnees, "Tarif", lireValeur(formData, "Tarif"));
  ajouterChampSiRempli(
    donnees,
    "Carte_parcours",
    lireValeur(formData, "Carte_parcours")
  );
  ajouterChampSiRempli(donnees, "Denivele", denivele);
  ajouterChampSiRempli(
    donnees,
    "Altitude_maximale",
    lireValeur(formData, "Altitude_maximale")
  );
  ajouterChampSiRempli(donnees, "Point_d_eau_ravitaillement", pointEau);
  ajouterChampSiRempli(donnees, "ID_difficulte", lireValeur(formData, "ID_difficulte"));

  if (accessibilite !== "") {
    donnees.Accessibilite = accessibilite === "oui" ? 1 : 0;
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

  if (Object.prototype.hasOwnProperty.call(TYPES_PAR_SELECT, typeRandonnee)) {
    donnees.types = [TYPES_PAR_SELECT[typeRandonnee]];
  }

  return donnees;
}

async function envoyerFormulaire(event) {
  event.preventDefault();

  const formulaire = event.currentTarget;
  const donnees = preparerDonneesFormulaire(formulaire);

  if (!donnees.Nom || !donnees.ID_difficulte) {
    afficherMessage(
      "Le nom de l'evenement et le niveau de difficulte sont obligatoires.",
      "erreur"
    );
    return;
  }

  try {
    afficherMessage("Envoi de l'evenement en cours...", "info");

    const reponse = await fetch(EVENTS_API_URL, {
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
    afficherMessage("Evenement cree avec l'identifiant " + resultat.id + ".", "succes");
  } catch (error) {
    console.error("Erreur envoi evenement :", error);
    afficherMessage(error.message, "erreur");
  }
}

function demarrerFormulaireEvenement() {
  const formulaire = document.getElementById("event-form");

  chargerOptionsFormulaire();

  if (formulaire) {
    formulaire.addEventListener("submit", envoyerFormulaire);
  }
}

document.addEventListener("DOMContentLoaded", demarrerFormulaireEvenement);
