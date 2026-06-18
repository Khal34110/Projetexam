// Petites fonctions communes aux controleurs.

export function idEstInvalide(id) {
  return !Number.isInteger(id) || id <= 0;
}

export function nettoyerValeur(valeur) {
  if (typeof valeur === "string") {
    return valeur.trim();
  }

  return valeur;
}

export function recupererValeur(body, nomsPossibles) {
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
