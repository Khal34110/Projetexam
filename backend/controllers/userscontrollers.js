import db from "../config/database.js";
import bcrypt from "bcrypt";
import { idEstInvalide, recupererValeur } from "../../frontend/Projetjs/helpers.js";

// Ce fichier gere les utilisateurs :
// lecture, creation, modification et suppression.

const COLONNES_UTILISATEUR =
  "ID_utilisateur, Nom, Prenom, Email, Numero_de_telephone, ID_role";

const CHAMPS_OBLIGATOIRES = [
  "nom",
  "prenom",
  "email",
  "numero_de_telephone",
  "mot_de_passe",
];

function valeurVide(valeur) {
  if (valeur === null || valeur === undefined) {
    return true;
  }

  if (typeof valeur === "string" && valeur.trim() === "") {
    return true;
  }

  return false;
}

function preparerDonneesUtilisateur(body) {
  const utilisateur = {};

  const nom = recupererValeur(body, ["nom", "Nom"]);
  if (nom !== undefined) {
    utilisateur.Nom = nom;
  }

  const prenom = recupererValeur(body, ["prenom", "Prenom"]);
  if (prenom !== undefined) {
    utilisateur.Prenom = prenom;
  }

  const email = recupererValeur(body, ["email", "Email"]);
  if (email !== undefined) {
    utilisateur.Email = email;
  }

  const telephone = recupererValeur(body, [
    "numero_de_telephone",
    "Numero_de_telephone",
  ]);
  if (telephone !== undefined) {
    utilisateur.Numero_de_telephone = telephone;
  }

  const motDePasse = recupererValeur(body, ["mot_de_passe", "Mot_de_passe"]);
  if (motDePasse !== undefined) {
    utilisateur.Mot_de_passe = motDePasse;
  }

  const idRole = recupererValeur(body, ["id_role", "ID_role"]);
  if (idRole !== undefined) {
    utilisateur.ID_role = idRole;
  }

  return utilisateur;
}

export async function getUserApiStatus(req, res) {
  try {
    await db.query("SELECT 1");
    return res.json({ status: "ok" });
  } catch (error) {
    console.error("Erreur getUserApiStatus :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function loginUser(req, res) {
  const email = recupererValeur(req.body, ["email", "Email"]);
  const motDePasse = recupererValeur(req.body, ["mot_de_passe", "Mot_de_passe"]);

  if (valeurVide(email) || valeurVide(motDePasse)) {
    return res.status(400).json({
      message: "Email et mot de passe obligatoires",
    });
  }

  try {
    const requete =
      "SELECT ID_utilisateur, Nom, Prenom, Email, Numero_de_telephone, ID_role, Mot_de_passe " +
      "FROM utilisateurs WHERE Email = ? LIMIT 1";
    const [utilisateurs] = await db.query(requete, [String(email).trim()]);

    if (utilisateurs.length === 0) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const utilisateur = utilisateurs[0];

    if (
      !utilisateur.Mot_de_passe ||
      String(utilisateur.Mot_de_passe).length < 60
    ) {
      return res.status(400).json({
        message:
          "Ce compte utilise un ancien mot de passe incompatible. Merci de recreer le compte ou de reinitialiser le mot de passe.",
      });
    }

    const motDePasseValide = await bcrypt.compare(
      String(motDePasse),
      utilisateur.Mot_de_passe
    );

    if (!motDePasseValide) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    return res.json({
      message: "Connexion reussie",
      utilisateur: {
        id: utilisateur.ID_utilisateur,
        nom: utilisateur.Nom,
        prenom: utilisateur.Prenom,
        email: utilisateur.Email,
        numero_de_telephone: utilisateur.Numero_de_telephone,
        id_role: utilisateur.ID_role,
      },
    });
  } catch (error) {
    console.error("Erreur loginUser :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function resetUserPassword(req, res) {
  const email = recupererValeur(req.body, ["email", "Email"]);
  const motDePasse = recupererValeur(req.body, ["mot_de_passe", "Mot_de_passe"]);

  if (valeurVide(email) || valeurVide(motDePasse)) {
    return res.status(400).json({
      message: "Email et nouveau mot de passe obligatoires",
    });
  }

  if (String(motDePasse).length < 6) {
    return res.status(400).json({
      message: "Le mot de passe doit contenir au moins 6 caracteres",
    });
  }

  try {
    const [utilisateurs] = await db.query(
      "SELECT ID_utilisateur FROM utilisateurs WHERE Email = ? LIMIT 1",
      [String(email).trim()]
    );

    if (utilisateurs.length === 0) {
      return res.status(404).json({ message: "Compte introuvable" });
    }

    const motDePasseHash = await bcrypt.hash(String(motDePasse), 10);

    await db.query(
      "UPDATE utilisateurs SET Mot_de_passe = ? WHERE ID_utilisateur = ?",
      [motDePasseHash, utilisateurs[0].ID_utilisateur]
    );

    return res.json({ message: "Mot de passe reinitialise" });
  } catch (error) {
    console.error("Erreur resetUserPassword :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function getUsers(req, res) {
  try {
    const requete =
      "SELECT " +
      COLONNES_UTILISATEUR +
      " FROM utilisateurs ORDER BY ID_utilisateur ASC";
    const [utilisateurs] = await db.query(requete);

    return res.json(utilisateurs);
  } catch (error) {
    console.error("Erreur getUsers :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function getUserById(req, res) {
  const id = Number(req.params.id);

  if (idEstInvalide(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const requete =
      "SELECT " +
      COLONNES_UTILISATEUR +
      " FROM utilisateurs WHERE ID_utilisateur = ?";
    const [utilisateurs] = await db.query(requete, [id]);

    if (utilisateurs.length === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    return res.json(utilisateurs[0]);
  } catch (error) {
    console.error("Erreur getUserById :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function createUser(req, res) {
  for (let index = 0; index < CHAMPS_OBLIGATOIRES.length; index += 1) {
    const champ = CHAMPS_OBLIGATOIRES[index];
    const valeur = recupererValeur(req.body, [champ]);

    if (valeurVide(valeur)) {
      return res.status(400).json({
        message: "Le champ " + champ + " est obligatoire",
      });
    }
  }

  const utilisateur = preparerDonneesUtilisateur(req.body);

  if (utilisateur.ID_role === undefined) {
    utilisateur.ID_role = 4;
  }

  utilisateur.ID_role = Number(utilisateur.ID_role);
  if (idEstInvalide(utilisateur.ID_role)) {
    return res.status(400).json({ message: "id_role invalide" });
  }

  try {
    utilisateur.Mot_de_passe = await bcrypt.hash(utilisateur.Mot_de_passe, 10);

    const requete = "INSERT INTO utilisateurs SET ?";
    const [resultat] = await db.query(requete, utilisateur);

    return res.status(201).json({
      message: "Utilisateur cree",
      id: resultat.insertId,
    });
  } catch (error) {
    console.error("Erreur createUser :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function updateUser(req, res) {
  const id = Number(req.params.id);

  if (idEstInvalide(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  const utilisateur = preparerDonneesUtilisateur(req.body);
  const cles = Object.keys(utilisateur);

  if (cles.length === 0) {
    return res.status(400).json({
      message: "Aucune donnee a modifier",
    });
  }

  for (let index = 0; index < cles.length; index += 1) {
    const cle = cles[index];

    if (valeurVide(utilisateur[cle])) {
      return res.status(400).json({
        message: "Le champ " + cle + " ne peut pas etre vide",
      });
    }
  }

  if (Object.prototype.hasOwnProperty.call(utilisateur, "ID_role")) {
    utilisateur.ID_role = Number(utilisateur.ID_role);

    if (idEstInvalide(utilisateur.ID_role)) {
      return res.status(400).json({ message: "id_role invalide" });
    }
  }

  try {
    if (Object.prototype.hasOwnProperty.call(utilisateur, "Mot_de_passe")) {
      utilisateur.Mot_de_passe = await bcrypt.hash(
        utilisateur.Mot_de_passe,
        10
      );
    }

    const requete = "UPDATE utilisateurs SET ? WHERE ID_utilisateur = ?";
    const [resultat] = await db.query(requete, [utilisateur, id]);

    if (resultat.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    return res.json({ message: "Utilisateur modifie" });
  } catch (error) {
    console.error("Erreur updateUser :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function deleteUser(req, res) {
  const id = Number(req.params.id);

  if (idEstInvalide(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const requete = "DELETE FROM utilisateurs WHERE ID_utilisateur = ?";
    const [resultat] = await db.query(requete, [id]);

    if (resultat.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    return res.json({ message: "Utilisateur supprime" });
  } catch (error) {
    console.error("Erreur deleteUser :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
