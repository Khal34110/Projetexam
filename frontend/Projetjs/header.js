export function loadHeader() {
  const header = document.getElementById("header");
  if (!header) {
    return;
  }

  header.innerHTML = `
    <a href="../Projethtml/accueil.html">
      <img
        src="../image/image logo.png"
        class="logo"
        alt="Logo Randonnee Herault"
      >
    </a>

    <p class="site-title">Randonn&eacute;e de l'H&eacute;rault</p>

    <a href="../Projethtml/connexion.html">
      <img class="user" src="../image/telechargement4.png" alt="Utilisateur">
    </a>

    <button class="burger" aria-label="Menu">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <nav class="menu">
      <ul>
        <li><a href="../Projethtml/accueil.html">ACCUEIL</a></li>
        <li><a href="../Projethtml/Apropos.html">&Agrave; PROPOS</a></li>
        <li><a href="../Projethtml/event.html">&Eacute;V&Eacute;NEMENTS</a></li>
        <li><a href="../Projethtml/inscription.html">INSCRIPTION</a></li>
        <li><a href="../Projethtml/contact.html">CONTACT</a></li>
      </ul>
    </nav>

    <form class="search-bar">
      <input type="search" placeholder="Rechercher..." name="search">
    </form>
  `;
}
