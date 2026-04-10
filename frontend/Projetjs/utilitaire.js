import { loadHeader } from "./header.js";
import { loadFooter } from "./footer.js";

const EVENTS_API_URL = "http://localhost:3000/api/events";

function initialiserCarrousel() {
  const container = document.querySelector(".carrousel-container");
  const boutonPrecedent = document.querySelector(".prev");
  const boutonSuivant = document.querySelector(".next");
  const compteur = document.getElementById("detail-gallery-counter");

  if (!container) {
    return;
  }

  let index = 0;

  function recupererImages() {
    return container.querySelectorAll("img");
  }

  function afficherImage() {
    const images = recupererImages();
    if (images.length === 0) {
      return;
    }

    if (index >= images.length) {
      index = 0;
    }

    if (index < 0) {
      index = images.length - 1;
    }

    container.style.transform = "translateX(-" + index * 100 + "%)";

    if (compteur) {
      compteur.hidden = images.length <= 1;
      compteur.textContent = String(index + 1) + " / " + String(images.length);
    }

    if (boutonPrecedent) {
      boutonPrecedent.hidden = images.length <= 1;
    }

    if (boutonSuivant) {
      boutonSuivant.hidden = images.length <= 1;
    }
  }

  if (boutonSuivant) {
    boutonSuivant.addEventListener("click", function imageSuivante() {
      const images = recupererImages();
      if (images.length === 0) {
        return;
      }

      index += 1;

      if (index >= images.length) {
        index = 0;
      }

      afficherImage();
    });
  }

  if (boutonPrecedent) {
    boutonPrecedent.addEventListener("click", function imagePrecedente() {
      const images = recupererImages();
      if (images.length === 0) {
        return;
      }

      index -= 1;

      if (index < 0) {
        index = images.length - 1;
      }

      afficherImage();
    });
  }

  afficherImage();

  window.actualiserCarrouselDetail = function actualiserCarrouselDetail() {
    index = 0;
    afficherImage();
  };
}

function initialiserMenuBurger() {
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".menu");
  const body = document.body;

  if (!burger || !menu) {
    return;
  }

  burger.addEventListener("click", function gererMenuBurger() {
    burger.classList.toggle("active");
    menu.classList.toggle("active");
    body.classList.toggle("menu-open");
  });
}

function normaliserRecherche(valeur) {
  return String(valeur || "").trim().replace(/\s+/g, " ");
}

function initialiserRechercheHeader() {
  const formulaireRecherche = document.querySelector(".search-bar");
  const champRecherche = document.querySelector(".search-bar input");

  if (!formulaireRecherche || !champRecherche) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const rechercheUrl = normaliserRecherche(params.get("q"));

  if (rechercheUrl !== "") {
    champRecherche.value = rechercheUrl;
  }

  formulaireRecherche.addEventListener("submit", function gererRecherche(event) {
    event.preventDefault();

    const recherche = normaliserRecherche(champRecherche.value);
    const destination = new URL("../Projethtml/event.html", window.location.href);

    if (recherche !== "") {
      destination.searchParams.set("q", recherche);
    }

    window.location.href = destination.pathname + destination.search;
  });
}

function initialiserAsideToggle() {
  const aside = document.getElementById("aside-menu");
  const bouton = document.querySelector(".toggle-aside");

  if (!aside || !bouton) {
    return;
  }

  function fermerAside() {
    aside.classList.remove("open");
    bouton.classList.remove("open");
    bouton.innerHTML = "&#9654;";
    bouton.setAttribute("aria-expanded", "false");
  }

  function ouvrirOuFermerAside() {
    const asideOuverte = aside.classList.toggle("open");
    bouton.classList.toggle("open", asideOuverte);
    bouton.innerHTML = asideOuverte ? "&#10005;" : "&#9654;";
    bouton.setAttribute("aria-expanded", String(asideOuverte));
  }

  bouton.addEventListener("click", ouvrirOuFermerAside);

  document.addEventListener("click", function fermerAuClicExterieur(event) {
    if (
      aside.classList.contains("open") &&
      !aside.contains(event.target) &&
      !bouton.contains(event.target)
    ) {
      fermerAside();
    }
  });
}

async function chargerAsideLiens() {
  const liste = document.getElementById("aside-list");
  if (!liste) {
    return;
  }

  try {
    const response = await fetch(EVENTS_API_URL);
    if (!response.ok) {
      throw new Error("Erreur API " + response.status);
    }

    const events = await response.json();
    liste.innerHTML = "";

    const fichierActuel = window.location.pathname.split("/").pop().toLowerCase();
    const idActuel = Number(new URLSearchParams(window.location.search).get("id"));

    for (let index = 0; index < events.length; index += 1) {
      const evenement = events[index];
      const idEvenement = Number(evenement.ID_evenement);
      const li = document.createElement("li");
      const lien = document.createElement("a");

      lien.href = "../detail-evenement/evenement.html?id=" + idEvenement;
      lien.textContent = evenement.Nom || "Evenement";

      if (fichierActuel === "evenement.html" && idActuel === idEvenement) {
        lien.classList.add("active");
      }

      li.appendChild(lien);
      liste.appendChild(li);
    }
  } catch (error) {
    console.error("Erreur chargement aside :", error);
  }
}

function demarrerPage() {
  loadHeader();
  loadFooter();
  initialiserRechercheHeader();
  initialiserMenuBurger();
  initialiserCarrousel();
  initialiserAsideToggle();
  chargerAsideLiens();
}

document.addEventListener("DOMContentLoaded", demarrerPage);
