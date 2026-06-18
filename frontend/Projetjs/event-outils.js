const DETAIL_URL = "detail-evenement/evenement.html";

export const TYPES_PAR_SELECT = {
  pedestre: 1,
  trail: 2,
  vtt: 3,
};

export const MOTS_CLES_PAR_PAGE = {
  cirquedelabeil: ["labeil"],
  cornichelaroux: ["lauroux", "corniche"],
  lavaldenize: ["laval", "nize"],
  lesfenestrettes: ["fenestrettes"],
  lagardiole: ["gardiole"],
  lacdusalagou: ["salagou"],
  chapellestamans: ["chapelle", "saint-amans", "villecun"],
  cirquedemoureze: ["moureze"],
};

export function convertirEnBooleen(valeur) {
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

export function formaterDate(valeur, texteVide) {
  if (!valeur) {
    return texteVide;
  }

  const date = new Date(valeur);
  if (Number.isNaN(date.getTime())) {
    return String(valeur).trim() || texteVide;
  }

  return date.toISOString().split("T")[0];
}

export function formaterHeure(valeur, texteVide) {
  if (!valeur) {
    return texteVide;
  }

  return String(valeur).slice(0, 5);
}

export function formaterTarifListe(valeur) {
  if (valeur === null || valeur === undefined || valeur === "") {
    return "Non renseigne";
  }

  return String(valeur) + " EUR";
}

export function construireLienDetail(id) {
  return DETAIL_URL + "?id=" + id;
}

export function normaliserTexte(valeur) {
  return String(valeur || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function reparerTexteMalEncode(valeur) {
  const texte = String(valeur || "").trim();

  if (texte === "") {
    return "";
  }

  // On ne tente une relecture UTF-8 que sur des motifs typiques de mojibake.
  // Les vrais caracteres francais comme "œ" ne doivent surtout pas declencher
  // cette correction, sinon on casse un texte deja valide.
  if (!/(?:Ã.|Â|â€|Å“|Å’|�)/.test(texte)) {
    return texte;
  }

  try {
    const codes = [];

    for (let index = 0; index < texte.length; index += 1) {
      codes.push(texte.charCodeAt(index) & 255);
    }

    const octets = new Uint8Array(codes);

    return new TextDecoder("utf-8", { fatal: false }).decode(octets);
  } catch (error) {
    return texte;
  }
}

export function nettoyerDescription(valeur) {
  const texte = reparerTexteMalEncode(valeur)
    .replace(/\s+/g, " ")
    .trim();

  if (texte === "") {
    return "";
  }

  return texte;
}

export function creerDescriptionEvenement(apiEvenement) {
  const descriptionSource = nettoyerDescription(apiEvenement.Descriptif);
  if (descriptionSource !== "") {
    return descriptionSource;
  }

  const nom = reparerTexteMalEncode(apiEvenement.Nom || "Cet evenement");
  const lieu = reparerTexteMalEncode(apiEvenement.Lieu_de_rdv || "");
  const difficulte = reparerTexteMalEncode(apiEvenement.difficulte || "");
  const morceaux = [];

  morceaux.push(nom + " vous propose une sortie nature soignee");

  if (lieu !== "") {
    morceaux.push("au depart de " + lieu);
  }

  if (difficulte !== "") {
    morceaux.push("avec un niveau " + difficulte.toLowerCase());
  }

  return morceaux.join(", ") + ".";
}
