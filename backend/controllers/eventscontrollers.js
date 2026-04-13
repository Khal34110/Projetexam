import db from "../config/database.js";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";

// Ce fichier gere toute la logique des evenements :
// lecture, creation, modification, suppression, QR code et options du formulaire.

const VISUGPX_PAR_EVENEMENT = {
  181: "1396026536",
  182: "VmDvHr49ic",
  184: "pmq6TDdLdm",
  185: "b99fLSWept",
  186: "ZDbgqV1MC6",
  187: "dVDRCZBjbA",
  188: "2E7mUbDTaB",
  189: "8bp7t25aGe",
  190: "OaaT4QghLe",
  191: "3jzqjxcPoM",
  192: "1388832725",
  193: "VRQgTSBMjS",
  194: "1313403190",
  195: "TDlE8KwZwL",
  202: "1389540432",
  210: "kqziG5RpE7",
  211: "QuNakLbE94",
  213: "1376776185",
  214: "cCjgd0L1kC",
  215: "f2YJDF0ecp",
  216: "z8zbdfTEys",
  217: "StET63iYYz",
  218: "n257wf27ox",
  219: "nwyGL0Xfrr",
};

function idEstInvalide(id) {
  return !Number.isInteger(id) || id <= 0;
}

function nettoyerValeur(valeur) {
  if (typeof valeur === "string") {
    return valeur.trim();
  }

  return valeur;
}

function recupererValeur(body, nomsPossibles) {
  if (!body || typeof body !== "object") {
    return undefined;
  }

  for (let index = 0; index < nomsPossibles.length; index += 1) {
    const nom = nomsPossibles[index];

    if (Object.prototype.hasOwnProperty.call(body, nom)) {
      return nettoyerValeur(body[nom]);
    }
  }

  return undefined;
}

function recupererPremierChampPresent(body, nomsPossibles) {
  if (!body || typeof body !== "object") {
    return {
      estPresent: false,
      valeur: undefined,
    };
  }

  for (let index = 0; index < nomsPossibles.length; index += 1) {
    const nom = nomsPossibles[index];

    if (Object.prototype.hasOwnProperty.call(body, nom)) {
      return {
        estPresent: true,
        valeur: body[nom],
      };
    }
  }

  return {
    estPresent: false,
    valeur: undefined,
  };
}

function convertirEnListe(valeur) {
  if (valeur === undefined || valeur === null || valeur === "") {
    return [];
  }

  if (Array.isArray(valeur)) {
    return valeur;
  }

  return [valeur];
}

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

function preparerDonneesEvenement(body) {
  const evenement = {};

  const nom = recupererValeur(body, ["nom", "Nom"]);
  if (nom !== undefined) {
    evenement.Nom = nom;
  }

  const descriptif = recupererValeur(body, ["descriptif", "Descriptif"]);
  if (descriptif !== undefined) {
    evenement.Descriptif = descriptif;
  }

  const carteParcours = recupererValeur(body, [
    "carte_parcours",
    "Carte_parcours",
    "carteParcours",
    "pdf",
  ]);
  if (carteParcours !== undefined) {
    evenement.Carte_parcours = carteParcours;
  }

  const dateEvent = recupererValeur(body, ["date_event", "Date_event"]);
  if (dateEvent !== undefined) {
    evenement.Date_event = dateEvent;
  }

  const heureDepart = recupererValeur(body, [
    "heure_de_depart",
    "Heure_de_depart",
  ]);
  if (heureDepart !== undefined) {
    evenement.Heure_de_depart = heureDepart;
  }

  const heureArrivee = recupererValeur(body, [
    "heure_d_arrivee",
    "Heure_d_arrivee",
  ]);
  if (heureArrivee !== undefined) {
    evenement.Heure_d_arrivee = heureArrivee;
  }

  const lieuRdv = recupererValeur(body, ["lieu_de_rdv", "Lieu_de_rdv"]);
  if (lieuRdv !== undefined) {
    evenement.Lieu_de_rdv = lieuRdv;
  }

  const lieuArrivee = recupererValeur(body, [
    "lieu_d_arrivee",
    "Lieu_d_arrivee",
  ]);
  if (lieuArrivee !== undefined) {
    evenement.Lieu_d_arrivee = lieuArrivee;
  }

  const tarif = recupererValeur(body, ["tarif", "Tarif"]);
  if (tarif !== undefined) {
    evenement.Tarif = tarif;
  }

  const accessibilite = recupererValeur(body, [
    "accessibilite",
    "Accessibilite",
  ]);
  if (accessibilite !== undefined) {
    evenement.Accessibilite = accessibilite;
  }

  const denivele = recupererValeur(body, ["denivele", "Denivele"]);
  if (denivele !== undefined) {
    evenement.Denivele = denivele;
  }

  const altitudeMaximale = recupererValeur(body, [
    "altitude_maximale",
    "Altitude_maximale",
  ]);
  if (altitudeMaximale !== undefined) {
    evenement.Altitude_maximale = altitudeMaximale;
  }

  const pointEau = recupererValeur(body, [
    "point_d_eau_ravitaillement",
    "Point_d_eau_ravitaillement",
  ]);
  if (pointEau !== undefined) {
    evenement.Point_d_eau_ravitaillement = pointEau;
  }

  const idDifficulte = recupererValeur(body, [
    "id_difficulte",
    "ID_difficulte",
  ]);
  if (idDifficulte !== undefined) {
    evenement.ID_difficulte = idDifficulte;
  }

  return evenement;
}

function normaliserListeIdsMateriels(valeurs) {
  const liste = convertirEnListe(valeurs);
  const ids = [];

  for (let index = 0; index < liste.length; index += 1) {
    const id = Number(liste[index]);

    if (idEstInvalide(id)) {
      throw new Error("Chaque ID_materiel doit etre un entier positif");
    }

    if (!ids.includes(id)) {
      ids.push(id);
    }
  }

  return ids;
}

function normaliserListeIdsTypes(valeurs) {
  const liste = convertirEnListe(valeurs);
  const ids = [];

  for (let index = 0; index < liste.length; index += 1) {
    const id = Number(liste[index]);

    if (idEstInvalide(id)) {
      throw new Error("Chaque ID_type doit etre un entier positif");
    }

    if (!ids.includes(id)) {
      ids.push(id);
    }
  }

  return ids;
}

function extraireMaterielDepuisElement(element) {
  if (element === null || element === undefined || element === "") {
    return null;
  }

  if (typeof element === "object" && !Array.isArray(element)) {
    const idBrut = recupererValeur(element, [
      "id_materiel",
      "ID_materiel",
      "id",
      "value",
    ]);
    const obligatoireBrut = recupererValeur(element, [
      "obligatoire",
      "Obligatoire",
      "required",
    ]);

    const id = Number(idBrut);

    if (idEstInvalide(id)) {
      throw new Error("Chaque ID_materiel doit etre un entier positif");
    }

    return {
      ID_materiel: id,
      Obligatoire: convertirEnBooleen(obligatoireBrut),
    };
  }

  const id = Number(element);

  if (idEstInvalide(id)) {
    throw new Error("Chaque ID_materiel doit etre un entier positif");
  }

  return {
    ID_materiel: id,
    Obligatoire: false,
  };
}

function preparerMaterielsEvenement(body) {
  const materielsBruts = recupererPremierChampPresent(body, [
    "materiels",
    "Materiels",
    "materiels[]",
    "materiel",
    "materiel[]",
  ]);
  const materielsObligatoiresBruts = recupererPremierChampPresent(body, [
    "materiels_obligatoires",
    "materielsObligatoires",
    "materiels_obligatoires[]",
  ]);

  if (!materielsBruts.estPresent && !materielsObligatoiresBruts.estPresent) {
    return {
      estPresent: false,
      materiels: [],
    };
  }

  const idsObligatoires = normaliserListeIdsMateriels(
    materielsObligatoiresBruts.valeur
  );
  const listeBrute = convertirEnListe(materielsBruts.valeur);
  const materiels = [];

  for (let index = 0; index < listeBrute.length; index += 1) {
    const materiel = extraireMaterielDepuisElement(listeBrute[index]);

    if (materiel === null) {
      continue;
    }

    const indexExistant = materiels.findIndex(function trouverMateriel(
      existant
    ) {
      return existant.ID_materiel === materiel.ID_materiel;
    });
    const obligatoire =
      materiel.Obligatoire || idsObligatoires.includes(materiel.ID_materiel);

    if (indexExistant >= 0) {
      materiels[indexExistant].Obligatoire =
        materiels[indexExistant].Obligatoire || obligatoire;
      continue;
    }

    materiels.push({
      ID_materiel: materiel.ID_materiel,
      Obligatoire: obligatoire,
    });
  }

  for (let index = 0; index < idsObligatoires.length; index += 1) {
    const idMateriel = idsObligatoires[index];
    const existe = materiels.find(function verifierMateriel(materiel) {
      return materiel.ID_materiel === idMateriel;
    });

    if (!existe) {
      materiels.push({
        ID_materiel: idMateriel,
        Obligatoire: true,
      });
    }
  }

  return {
    estPresent: true,
    materiels: materiels,
  };
}

function preparerTypesEvenement(body) {
  const typesBruts = recupererPremierChampPresent(body, [
    "types",
    "Types",
    "types[]",
    "type",
    "type[]",
    "id_type",
    "ID_type",
    "id_types",
    "ID_types",
  ]);

  if (!typesBruts.estPresent) {
    return {
      estPresent: false,
      types: [],
    };
  }

  return {
    estPresent: true,
    types: normaliserListeIdsTypes(typesBruts.valeur),
  };
}

function imageLocaleExiste(urlImage) {
  const url = String(urlImage || "").trim();

  if (url === "") {
    return false;
  }

  if (/^https?:\/\//i.test(url)) {
    return true;
  }

  if (!url.startsWith("/")) {
    return false;
  }

  const cheminRelatif = url.replace(/^\/+/, "").replace(/\//g, path.sep);
  const cheminAbsolu = path.join(process.cwd(), "frontend", cheminRelatif);

  return fs.existsSync(cheminAbsolu);
}

function extraireVisugpxId(valeur) {
  const texte = String(valeur || "").trim();

  if (texte === "") {
    return "";
  }

  if (/^https?:\/\/www\.visugpx\.com\//i.test(texte)) {
    const morceaux = texte.split("/");
    const dernierMorceau = morceaux[morceaux.length - 1].split("?")[0];
    return dernierMorceau.trim();
  }

  if (/^[a-zA-Z0-9]+$/.test(texte)) {
    return texte;
  }

  return "";
}

function trouverVisugpxIdParEvenement(evenement) {
  const idEvenement = Number(evenement && evenement.ID_evenement);

  if (!Number.isInteger(idEvenement) || idEvenement <= 0) {
    return "";
  }

  return VISUGPX_PAR_EVENEMENT[idEvenement] || "";
}

function construireUrlVisugpx(visugpxId) {
  const id = extraireVisugpxId(visugpxId);

  if (id === "") {
    return "";
  }

  return "https://www.visugpx.com/" + id;
}

function construireUrlVisugpxIframe(visugpxId) {
  const url = construireUrlVisugpx(visugpxId);

  if (url === "") {
    return "";
  }

  return url + "?iframe&maponly";
}

function ajouterInfosVisugpx(evenement) {
  if (!evenement || typeof evenement !== "object") {
    return evenement;
  }

  const visugpxIdExistant =
    extraireVisugpxId(evenement.Carte_parcours) ||
    extraireVisugpxId(evenement.Visugpx_id) ||
    extraireVisugpxId(evenement.visugpx_id);

  const visugpxId =
    visugpxIdExistant || trouverVisugpxIdParEvenement(evenement);

  evenement.visugpx_id = visugpxId;
  evenement.visugpx_url = construireUrlVisugpx(visugpxId);
  evenement.visugpx_iframe_url = construireUrlVisugpxIframe(visugpxId);

  return evenement;
}

async function recupererImagesEvenement(idEvenement) {
  const requete =
    "SELECT ID_image, Nom, Url FROM images WHERE ID_evenement = ? ORDER BY ID_image ASC";
  const [images] = await db.query(requete, [idEvenement]);

  const urlsAjoutees = [];
  const imagesValides = [];

  for (let index = 0; index < images.length; index += 1) {
    const image = images[index];
    const url = String(image.Url || "").trim();

    if (url === "") {
      continue;
    }

    if (!imageLocaleExiste(url)) {
      continue;
    }

    if (urlsAjoutees.includes(url)) {
      continue;
    }

    urlsAjoutees.push(url);
    imagesValides.push({
      ID_image: image.ID_image,
      Nom: image.Nom || "",
      Url: url,
    });
  }

  return imagesValides;
}

async function normaliserImagePrincipaleEvenement(evenement, imagesValides) {
  if (!evenement || typeof evenement !== "object") {
    return evenement;
  }

  const imagePrincipale = String(evenement.image_url || "").trim();
  if (imageLocaleExiste(imagePrincipale)) {
    evenement.image_url = imagePrincipale;
    return evenement;
  }

  const listeImagesValides = Array.isArray(imagesValides)
    ? imagesValides
    : await recupererImagesEvenement(Number(evenement.ID_evenement));

  if (listeImagesValides.length > 0) {
    evenement.image_url = listeImagesValides[0].Url;
    return evenement;
  }

  evenement.image_url = "";
  return evenement;
}

async function recupererMaterielsEvenement(idEvenement, connexion) {
  const executant = connexion || db;
  const requete =
    "SELECT m.ID_materiel, m.nom, e.Obligatoire " +
    "FROM equiper e " +
    "INNER JOIN materiels_recommandes m ON m.ID_materiel = e.ID_materiel " +
    "WHERE e.ID_evenement = ? " +
    "ORDER BY e.Obligatoire DESC, m.nom ASC";
  const [materiels] = await executant.query(requete, [idEvenement]);

  return materiels.map(function formatterMateriel(materiel) {
    return {
      ID_materiel: materiel.ID_materiel,
      nom: materiel.nom || "",
      obligatoire: Number(materiel.Obligatoire) === 1,
    };
  });
}

async function recupererTypesEvenement(idEvenement, connexion) {
  const executant = connexion || db;
  const requete =
    "SELECT t.ID_type, t.Nom, t.Descriptif " +
    "FROM appartenir a " +
    "INNER JOIN types t ON t.ID_type = a.ID_type " +
    "WHERE a.ID_evenement = ? " +
    "ORDER BY t.Nom ASC";
  const [types] = await executant.query(requete, [idEvenement]);

  return types.map(function formatterType(type) {
    return {
      ID_type: type.ID_type,
      Nom: type.Nom || "",
      Descriptif: type.Descriptif || "",
    };
  });
}

async function verifierMaterielsExistants(materiels, connexion) {
  if (!Array.isArray(materiels) || materiels.length === 0) {
    return;
  }

  const executant = connexion || db;
  const ids = materiels.map(function recupererId(materiel) {
    return materiel.ID_materiel;
  });
  const placeholders = ids.map(function placeholder() {
    return "?";
  });
  const requete =
    "SELECT ID_materiel FROM materiels_recommandes WHERE ID_materiel IN (" +
    placeholders.join(", ") +
    ")";
  const [resultat] = await executant.query(requete, ids);
  const idsExistants = resultat.map(function recupererIdMateriel(ligne) {
    return Number(ligne.ID_materiel);
  });
  const idsManquants = ids.filter(function verifierId(idMateriel) {
    return !idsExistants.includes(idMateriel);
  });

  if (idsManquants.length > 0) {
    throw new Error(
      "Certains materiels n'existent pas : " + idsManquants.join(", ")
    );
  }
}

async function verifierTypesExistants(types, connexion) {
  if (!Array.isArray(types) || types.length === 0) {
    return;
  }

  const executant = connexion || db;
  const placeholders = types.map(function placeholder() {
    return "?";
  });
  const requete =
    "SELECT ID_type FROM types WHERE ID_type IN (" + placeholders.join(", ") + ")";
  const [resultat] = await executant.query(requete, types);
  const idsExistants = resultat.map(function recupererIdType(ligne) {
    return Number(ligne.ID_type);
  });
  const idsManquants = types.filter(function verifierId(idType) {
    return !idsExistants.includes(idType);
  });

  if (idsManquants.length > 0) {
    throw new Error("Certains types n'existent pas : " + idsManquants.join(", "));
  }
}

async function synchroniserMaterielsEvenement(idEvenement, materiels, connexion) {
  const executant = connexion || db;
  await executant.query("DELETE FROM equiper WHERE ID_evenement = ?", [
    idEvenement,
  ]);

  if (!Array.isArray(materiels) || materiels.length === 0) {
    return;
  }

  const placeholders = materiels.map(function placeholder() {
    return "(?, ?, ?)";
  });
  const parametres = [];

  for (let index = 0; index < materiels.length; index += 1) {
    const materiel = materiels[index];
    parametres.push(
      idEvenement,
      materiel.ID_materiel,
      materiel.Obligatoire ? 1 : 0
    );
  }

  const requete =
    "INSERT INTO equiper (ID_evenement, ID_materiel, Obligatoire) VALUES " +
    placeholders.join(", ");
  await executant.query(requete, parametres);
}

async function synchroniserTypesEvenement(idEvenement, types, connexion) {
  const executant = connexion || db;
  await executant.query("DELETE FROM appartenir WHERE ID_evenement = ?", [
    idEvenement,
  ]);

  if (!Array.isArray(types) || types.length === 0) {
    return;
  }

  const placeholders = types.map(function placeholder() {
    return "(?, ?)";
  });
  const parametres = [];

  for (let index = 0; index < types.length; index += 1) {
    parametres.push(idEvenement, types[index]);
  }

  const requete =
    "INSERT INTO appartenir (ID_evenement, ID_type) VALUES " +
    placeholders.join(", ");
  await executant.query(requete, parametres);
}

async function evenementExiste(idEvenement, connexion) {
  const executant = connexion || db;
  const [resultat] = await executant.query(
    "SELECT 1 FROM evenements WHERE ID_evenement = ? LIMIT 1",
    [idEvenement]
  );

  return resultat.length > 0;
}

export async function getEvents(req, res) {
  try {
    const requete =
      "SELECT * FROM vue_evenements_liste ORDER BY ID_evenement ASC";
    const [evenements] = await db.query(requete);

    for (let index = 0; index < evenements.length; index += 1) {
      ajouterInfosVisugpx(evenements[index]);
      await normaliserImagePrincipaleEvenement(evenements[index]);
    }

    return res.json(evenements);
  } catch (error) {
    console.error("Erreur getEvents :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function getEventFormOptions(req, res) {
  try {
    const [difficultes] = await db.query(
      "SELECT ID_difficulte, Nom, Descriptif " +
        "FROM niveau_difficulte ORDER BY ID_difficulte ASC"
    );
    const [materiels] = await db.query(
      "SELECT ID_materiel, nom FROM materiels_recommandes ORDER BY ID_materiel ASC"
    );
    const [types] = await db.query(
      "SELECT ID_type, Nom, Descriptif FROM types ORDER BY ID_type ASC"
    );

    return res.json({
      difficultes: difficultes,
      materiels: materiels,
      types: types,
    });
  } catch (error) {
    console.error("Erreur getEventFormOptions :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function getEventById(req, res) {
  const id = Number(req.params.id);

  if (idEstInvalide(id)) {
    return res.status(400).json({ message: "ID evenement invalide" });
  }

  try {
    const requete =
      "SELECT e.*, d.Nom AS difficulte, " +
      "(SELECT i.Url FROM images i WHERE i.ID_evenement = e.ID_evenement ORDER BY i.ID_image ASC LIMIT 1) AS image_url " +
      "FROM evenements e " +
      "LEFT JOIN niveau_difficulte d ON d.ID_difficulte = e.ID_difficulte " +
      "WHERE e.ID_evenement = ?";
    const [resultat] = await db.query(requete, [id]);

    if (resultat.length === 0) {
      return res.status(404).json({ message: "Evenement introuvable" });
    }

    const evenement = resultat[0];
    ajouterInfosVisugpx(evenement);
    evenement.images = await recupererImagesEvenement(id);
    await normaliserImagePrincipaleEvenement(evenement, evenement.images);
    evenement.materiels = await recupererMaterielsEvenement(id);
    evenement.types = await recupererTypesEvenement(id);

    return res.json(evenement);
  } catch (error) {
    console.error("Erreur getEventById :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function getEventQrCode(req, res) {
  const id = Number(req.params.id);

  if (idEstInvalide(id)) {
    return res.status(400).json({ message: "ID evenement invalide" });
  }

  try {
    const requete = "SELECT ID_evenement, Carte_parcours FROM evenements WHERE ID_evenement = ?";
    const [resultat] = await db.query(requete, [id]);

    if (resultat.length === 0) {
      return res.status(404).json({ message: "Evenement introuvable" });
    }

    const evenement = resultat[0];
    ajouterInfosVisugpx(evenement);

    if (String(evenement.visugpx_url || "").trim() === "") {
      return res.status(404).json({
        message: "Aucune carte VisuGPX disponible pour cet evenement",
      });
    }

    const qrCodeSvg = await QRCode.toString(evenement.visugpx_url, {
      type: "svg",
      width: 220,
      margin: 1,
      errorCorrectionLevel: "M",
      color: {
        dark: "#0B4A30",
        light: "#FFFFFF",
      },
    });

    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");

    return res.send(qrCodeSvg);
  } catch (error) {
    console.error("Erreur getEventQrCode :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function createEvent(req, res) {
  const evenement = preparerDonneesEvenement(req.body);
  let materielsEvenement;
  let typesEvenement;

  try {
    materielsEvenement = preparerMaterielsEvenement(req.body);
    typesEvenement = preparerTypesEvenement(req.body);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  if (!Object.prototype.hasOwnProperty.call(evenement, "ID_difficulte")) {
    return res.status(400).json({
      message: "Le champ ID_difficulte est obligatoire",
    });
  }

  const idDifficulte = Number(evenement.ID_difficulte);
  if (idEstInvalide(idDifficulte)) {
    return res.status(400).json({
      message: "ID_difficulte doit etre un entier positif",
    });
  }

  evenement.ID_difficulte = idDifficulte;

  let connexion;
  try {
    connexion = await db.getConnection();
    await connexion.beginTransaction();

    await verifierMaterielsExistants(materielsEvenement.materiels, connexion);
    await verifierTypesExistants(typesEvenement.types, connexion);

    const requete = "INSERT INTO evenements SET ?";
    const [resultat] = await connexion.query(requete, [evenement]);

    await synchroniserMaterielsEvenement(
      resultat.insertId,
      materielsEvenement.materiels,
      connexion
    );
    await synchroniserTypesEvenement(
      resultat.insertId,
      typesEvenement.types,
      connexion
    );

    await connexion.commit();

    return res.status(201).json({
      message: "Evenement cree",
      id: resultat.insertId,
    });
  } catch (error) {
    if (connexion) {
      await connexion.rollback();
    }

    if (
      error instanceof Error &&
      (error.message.includes("materiels") || error.message.includes("types"))
    ) {
      return res.status(400).json({ message: error.message });
    }

    console.error("Erreur createEvent :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  } finally {
    if (connexion) {
      connexion.release();
    }
  }
}

export async function updateEvent(req, res) {
  const id = Number(req.params.id);

  if (idEstInvalide(id)) {
    return res.status(400).json({ message: "ID evenement invalide" });
  }

  const evenement = preparerDonneesEvenement(req.body);
  let materielsEvenement;
  let typesEvenement;

  try {
    materielsEvenement = preparerMaterielsEvenement(req.body);
    typesEvenement = preparerTypesEvenement(req.body);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  if (
    Object.keys(evenement).length === 0 &&
    !materielsEvenement.estPresent &&
    !typesEvenement.estPresent
  ) {
    return res.status(400).json({
      message: "Aucune donnee valide a modifier",
    });
  }

  if (Object.prototype.hasOwnProperty.call(evenement, "ID_difficulte")) {
    const idDifficulte = Number(evenement.ID_difficulte);

    if (idEstInvalide(idDifficulte)) {
      return res.status(400).json({
        message: "ID_difficulte doit etre un entier positif",
      });
    }

    evenement.ID_difficulte = idDifficulte;
  }

  let connexion;
  try {
    connexion = await db.getConnection();
    await connexion.beginTransaction();

    const existe = await evenementExiste(id, connexion);

    if (!existe) {
      await connexion.rollback();
      return res.status(404).json({ message: "Evenement introuvable" });
    }

    if (Object.keys(evenement).length > 0) {
      const requete = "UPDATE evenements SET ? WHERE ID_evenement = ?";
      await connexion.query(requete, [evenement, id]);
    }

    if (materielsEvenement.estPresent) {
      await verifierMaterielsExistants(materielsEvenement.materiels, connexion);
      await synchroniserMaterielsEvenement(
        id,
        materielsEvenement.materiels,
        connexion
      );
    }

    if (typesEvenement.estPresent) {
      await verifierTypesExistants(typesEvenement.types, connexion);
      await synchroniserTypesEvenement(id, typesEvenement.types, connexion);
    }

    await connexion.commit();

    return res.json({ message: "Evenement modifie" });
  } catch (error) {
    if (connexion) {
      await connexion.rollback();
    }

    if (
      error instanceof Error &&
      (error.message.includes("materiels") || error.message.includes("types"))
    ) {
      return res.status(400).json({ message: error.message });
    }

    console.error("Erreur updateEvent :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  } finally {
    if (connexion) {
      connexion.release();
    }
  }
}

export async function deleteEvent(req, res) {
  const id = Number(req.params.id);

  if (idEstInvalide(id)) {
    return res.status(400).json({ message: "ID evenement invalide" });
  }

  let connexion;
  try {
    connexion = await db.getConnection();
    await connexion.beginTransaction();

    await connexion.query("DELETE FROM appartenir WHERE ID_evenement = ?", [id]);
    await connexion.query("DELETE FROM equiper WHERE ID_evenement = ?", [id]);
    await connexion.query("DELETE FROM participer WHERE ID_evenement = ?", [id]);

    const requete = "DELETE FROM evenements WHERE ID_evenement = ?";
    const [resultat] = await connexion.query(requete, [id]);

    if (resultat.affectedRows === 0) {
      await connexion.rollback();
      return res.status(404).json({ message: "Evenement introuvable" });
    }

    await connexion.commit();

    return res.json({ message: "Evenement supprime" });
  } catch (error) {
    if (connexion) {
      await connexion.rollback();
    }

    console.error("Erreur deleteEvent :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  } finally {
    if (connexion) {
      connexion.release();
    }
  }
}
