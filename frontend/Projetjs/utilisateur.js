import { API_ROOT } from "./utilitaire.js";

function afficherMessageElement(element, message, type) {
  if (!element) {
    return;
  }

  element.textContent = message || "";
  element.classList.remove("is-error", "is-success");

  if (type) {
    element.classList.add(type);
  }
}

function recupererUtilisateurConnecte() {
  try {
    const contenu = window.localStorage.getItem("rdh_user");

    if (!contenu) {
      return null;
    }

    return JSON.parse(contenu);
  } catch (error) {
    console.error("Erreur lecture utilisateur :", error);
    return null;
  }
}

function nettoyerTelephone(valeur) {
  return String(valeur || "").trim();
}

function lireDonneesInscription(formulaire) {
  const formData = new FormData(formulaire);

  return {
    nom: String(formData.get("nom") || "").trim(),
    prenom: String(formData.get("prenom") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    numero_de_telephone: nettoyerTelephone(
      formData.get("numero_de_telephone")
    ),
    mot_de_passe: String(formData.get("mot_de_passe") || ""),
    confirmation_mot_de_passe: String(
      formData.get("confirmation_mot_de_passe") || ""
    ),
  };
}

function validerInscription(donnees) {
  const champs = [
    ["nom", "Le nom est obligatoire."],
    ["prenom", "Le prenom est obligatoire."],
    ["email", "L'email est obligatoire."],
    ["numero_de_telephone", "Le numero de telephone est obligatoire."],
    ["mot_de_passe", "Le mot de passe est obligatoire."],
    [
      "confirmation_mot_de_passe",
      "La confirmation du mot de passe est obligatoire.",
    ],
  ];

  for (let index = 0; index < champs.length; index += 1) {
    const cle = champs[index][0];
    const message = champs[index][1];

    if (!donnees[cle]) {
      return message;
    }
  }

  if (donnees.mot_de_passe !== donnees.confirmation_mot_de_passe) {
    return "Les deux mots de passe ne correspondent pas.";
  }

  if (donnees.mot_de_passe.length < 6) {
    return "Le mot de passe doit contenir au moins 6 caracteres.";
  }

  return "";
}

async function envoyerInscription(event) {
  event.preventDefault();

  const formulaire = event.currentTarget;
  const message = document.getElementById("signup-feedback");
  const bouton = formulaire.querySelector('button[type="submit"]');
  const donnees = lireDonneesInscription(formulaire);
  const erreurValidation = validerInscription(donnees);

  if (erreurValidation) {
    afficherMessageElement(message, erreurValidation, "is-error");
    return;
  }

  const payload = {
    nom: donnees.nom,
    prenom: donnees.prenom,
    email: donnees.email,
    numero_de_telephone: donnees.numero_de_telephone,
    mot_de_passe: donnees.mot_de_passe,
  };

  bouton.disabled = true;
  afficherMessageElement(message, "Inscription en cours...", "");

  try {
    const reponse = await fetch(API_ROOT + "/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const contenu = await reponse.json().catch(function ignorerErreurJson() {
      return {};
    });

    if (!reponse.ok) {
      throw new Error(contenu.message || "Impossible de finaliser l'inscription.");
    }

    formulaire.reset();
    afficherMessageElement(
      message,
      "Inscription confirmee. Vous pouvez maintenant vous connecter.",
      "is-success"
    );
  } catch (error) {
    afficherMessageElement(
      message,
      error.message || "Une erreur est survenue pendant l'inscription.",
      "is-error"
    );
  } finally {
    bouton.disabled = false;
  }
}

function lireDonneesConnexion(formulaire) {
  const formData = new FormData(formulaire);

  return {
    email: String(formData.get("email") || "").trim(),
    mot_de_passe: String(formData.get("mot_de_passe") || ""),
  };
}

async function envoyerConnexion(event) {
  event.preventDefault();

  const formulaire = event.currentTarget;
  const bouton = formulaire.querySelector('button[type="submit"]');
  const message = document.getElementById("login-feedback");
  const donnees = lireDonneesConnexion(formulaire);

  if (!donnees.email || !donnees.mot_de_passe) {
    afficherMessageElement(
      message,
      "Merci de renseigner votre email et votre mot de passe.",
      "is-error"
    );
    return;
  }

  bouton.disabled = true;
  afficherMessageElement(message, "Connexion en cours...", "");

  try {
    const reponse = await fetch(API_ROOT + "/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(donnees),
    });

    const contenu = await reponse.json().catch(function ignorerErreurJson() {
      return {};
    });

    if (!reponse.ok) {
      throw new Error(contenu.message || "Connexion impossible.");
    }

    if (contenu.utilisateur) {
      localStorage.setItem("rdh_user", JSON.stringify(contenu.utilisateur));
    }

    afficherMessageElement(
      message,
      "Connexion reussie. Redirection en cours...",
      "is-success"
    );

    window.setTimeout(function rediriger() {
      const params = new URLSearchParams(window.location.search);
      const retour = params.get("retour");

      if (retour === "formevenements") {
        window.location.href = "../Projethtml/formevenements.html";
        return;
      }

      window.location.href = "../Projethtml/accueil.html";
    }, 800);
  } catch (error) {
    afficherMessageElement(
      message,
      error.message || "Une erreur est survenue pendant la connexion.",
      "is-error"
    );
  } finally {
    bouton.disabled = false;
  }
}

function lireDonneesReinitialisation(formulaire) {
  const formData = new FormData(formulaire);

  return {
    email: String(formData.get("email") || "").trim(),
    mot_de_passe: String(formData.get("mot_de_passe") || ""),
    confirmation_mot_de_passe: String(
      formData.get("confirmation_mot_de_passe") || ""
    ),
  };
}

async function envoyerReinitialisation(event) {
  event.preventDefault();

  const formulaire = event.currentTarget;
  const bouton = formulaire.querySelector('button[type="submit"]');
  const message = document.getElementById("reset-feedback");
  const donnees = lireDonneesReinitialisation(formulaire);

  if (!donnees.email || !donnees.mot_de_passe || !donnees.confirmation_mot_de_passe) {
    afficherMessageElement(message, "Merci de remplir tous les champs.", "is-error");
    return;
  }

  if (donnees.mot_de_passe !== donnees.confirmation_mot_de_passe) {
    afficherMessageElement(message, "Les deux mots de passe ne correspondent pas.", "is-error");
    return;
  }

  if (donnees.mot_de_passe.length < 6) {
    afficherMessageElement(
      message,
      "Le mot de passe doit contenir au moins 6 caracteres.",
      "is-error"
    );
    return;
  }

  bouton.disabled = true;
  afficherMessageElement(message, "Reinitialisation en cours...", "");

  try {
    const reponse = await fetch(API_ROOT + "/api/users/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: donnees.email,
        mot_de_passe: donnees.mot_de_passe,
      }),
    });

    const contenu = await reponse.json().catch(function ignorerErreurJson() {
      return {};
    });

    if (!reponse.ok) {
      throw new Error(
        contenu.message || "Impossible de reinitialiser le mot de passe."
      );
    }

    formulaire.reset();
    afficherMessageElement(
      message,
      "Mot de passe mis a jour. Vous pouvez vous connecter.",
      "is-success"
    );

    window.setTimeout(function rediriger() {
      window.location.href = "../Projethtml/connexion.html";
    }, 900);
  } catch (error) {
    afficherMessageElement(
      message,
      error.message || "Une erreur est survenue.",
      "is-error"
    );
  } finally {
    bouton.disabled = false;
  }
}

function remplirProfil(utilisateur) {
  const prenom = utilisateur.prenom || utilisateur.Prenom || "-";
  const nom = utilisateur.nom || utilisateur.Nom || "-";
  const email = utilisateur.email || utilisateur.Email || "-";
  const telephone =
    utilisateur.numero_de_telephone || utilisateur.Numero_de_telephone || "-";

  document.getElementById("profile-prenom").textContent = prenom;
  document.getElementById("profile-nom").textContent = nom;
  document.getElementById("profile-email").textContent = email;
  document.getElementById("profile-telephone").textContent = telephone;

  const champPrenom = document.getElementById("edit-prenom");
  const champNom = document.getElementById("edit-nom");
  const champEmail = document.getElementById("edit-email");
  const champTelephone = document.getElementById("edit-telephone");

  if (champPrenom) {
    champPrenom.value = prenom === "-" ? "" : prenom;
  }
  if (champNom) {
    champNom.value = nom === "-" ? "" : nom;
  }
  if (champEmail) {
    champEmail.value = email === "-" ? "" : email;
  }
  if (champTelephone) {
    champTelephone.value = telephone === "-" ? "" : telephone;
  }
}

async function enregistrerProfil(event) {
  event.preventDefault();

  const utilisateur = recupererUtilisateurConnecte();
  const formulaire = event.currentTarget;
  const bouton = formulaire.querySelector('button[type="submit"]');

  if (!utilisateur || !(utilisateur.id || utilisateur.ID_utilisateur)) {
    window.location.href = "../Projethtml/connexion.html";
    return;
  }

  const formData = new FormData(formulaire);
  const donnees = {
    prenom: String(formData.get("prenom") || "").trim(),
    nom: String(formData.get("nom") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    numero_de_telephone: String(
      formData.get("numero_de_telephone") || ""
    ).trim(),
  };

  if (!donnees.prenom || !donnees.nom || !donnees.email || !donnees.numero_de_telephone) {
    afficherMessageElement(
      document.getElementById("profile-feedback"),
      "Merci de remplir tous les champs.",
      "is-error"
    );
    return;
  }

  bouton.disabled = true;
  afficherMessageElement(
    document.getElementById("profile-feedback"),
    "Mise a jour en cours...",
    ""
  );

  try {
    const id = utilisateur.id || utilisateur.ID_utilisateur;
    const reponse = await fetch(API_ROOT + "/api/users/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(donnees),
    });
    const contenu = await reponse.json().catch(function ignorerErreurJson() {
      return {};
    });

    if (!reponse.ok) {
      throw new Error(contenu.message || "Impossible de modifier le profil.");
    }

    const utilisateurMaj = {
      id: id,
      ID_utilisateur: utilisateur.ID_utilisateur,
      prenom: donnees.prenom,
      Prenom: donnees.prenom,
      nom: donnees.nom,
      Nom: donnees.nom,
      email: donnees.email,
      Email: donnees.email,
      numero_de_telephone: donnees.numero_de_telephone,
      Numero_de_telephone: donnees.numero_de_telephone,
      id_role: utilisateur.id_role,
      ID_role: utilisateur.ID_role,
    };

    window.localStorage.setItem("rdh_user", JSON.stringify(utilisateurMaj));
    remplirProfil(utilisateurMaj);
    afficherMessageElement(
      document.getElementById("profile-feedback"),
      "Profil mis a jour avec succes.",
      "is-success"
    );
  } catch (error) {
    afficherMessageElement(
      document.getElementById("profile-feedback"),
      error.message || "Une erreur est survenue.",
      "is-error"
    );
  } finally {
    bouton.disabled = false;
  }
}

function initialiserBasculeEdition() {
  const bouton = document.getElementById("profile-edit-toggle");
  const formulaire = document.getElementById("profile-form");

  if (!bouton || !formulaire) {
    return;
  }

  bouton.addEventListener("click", function gererBasculeEdition() {
    const estOuvert = !formulaire.hidden;
    formulaire.hidden = estOuvert;
    bouton.setAttribute("aria-expanded", String(!estOuvert));
  });
}

async function supprimerCompte() {
  const utilisateur = recupererUtilisateurConnecte();

  if (!utilisateur || !(utilisateur.id || utilisateur.ID_utilisateur)) {
    window.location.href = "../Projethtml/connexion.html";
    return;
  }

  const confirmer = window.confirm(
    "Voulez-vous vraiment supprimer votre compte ? Cette action est definitive."
  );

  if (!confirmer) {
    return;
  }

  const id = utilisateur.id || utilisateur.ID_utilisateur;

  try {
    const reponse = await fetch(API_ROOT + "/api/users/" + id, {
      method: "DELETE",
    });
    const contenu = await reponse.json().catch(function ignorerErreurJson() {
      return {};
    });

    if (!reponse.ok) {
      throw new Error(contenu.message || "Suppression impossible.");
    }

    window.localStorage.removeItem("rdh_user");
    window.alert("Compte supprime.");
    window.location.href = "../Projethtml/accueil.html";
  } catch (error) {
    window.alert(error.message || "Une erreur est survenue pendant la suppression du compte.");
  }
}

async function chargerProfil() {
  const utilisateur = recupererUtilisateurConnecte();

  if (!utilisateur || !(utilisateur.id || utilisateur.ID_utilisateur)) {
    window.location.href = "../Projethtml/connexion.html";
    return;
  }

  remplirProfil(utilisateur);

  const id = utilisateur.id || utilisateur.ID_utilisateur;

  try {
    const reponse = await fetch(API_ROOT + "/api/users/" + id);
    const contenu = await reponse.json().catch(function ignorerErreurJson() {
      return {};
    });

    if (!reponse.ok) {
      throw new Error(contenu.message || "Impossible de charger le profil.");
    }

    const utilisateurMaj = {
      id: contenu.ID_utilisateur,
      nom: contenu.Nom,
      prenom: contenu.Prenom,
      email: contenu.Email,
      numero_de_telephone: contenu.Numero_de_telephone,
      id_role: contenu.ID_role,
    };

    window.localStorage.setItem("rdh_user", JSON.stringify(utilisateurMaj));
    remplirProfil(utilisateurMaj);
  } catch (error) {
    afficherMessageElement(
      document.getElementById("profile-feedback"),
      "Profil charge depuis la session locale.",
      "is-error"
    );
  }

  const boutonSuppression = document.getElementById("profile-delete-account");
  const formulaire = document.getElementById("profile-form");

  if (boutonSuppression) {
    boutonSuppression.addEventListener("click", supprimerCompte);
  }
  if (formulaire) {
    formulaire.addEventListener("submit", enregistrerProfil);
  }

  initialiserBasculeEdition();
}

function demarrerUtilisateur() {
  const formulaireConnexion = document.getElementById("login-form");
  if (formulaireConnexion) {
    formulaireConnexion.addEventListener("submit", envoyerConnexion);
  }

  const formulaireInscription = document.getElementById("signup-form");
  if (formulaireInscription) {
    formulaireInscription.addEventListener("submit", envoyerInscription);
  }

  const formulaireReinitialisation = document.getElementById("reset-password-form");
  if (formulaireReinitialisation) {
    formulaireReinitialisation.addEventListener(
      "submit",
      envoyerReinitialisation
    );
  }

  if (document.getElementById("profile-grid")) {
    chargerProfil();
  }
}

document.addEventListener("DOMContentLoaded", demarrerUtilisateur);
