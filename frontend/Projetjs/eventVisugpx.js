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

export function ajouterInfosVisugpx(evenement) {
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
