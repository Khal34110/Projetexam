export function loadFooter() {
  const footer = document.querySelector(".footer");
  if (!footer) {
    return;
  }

  footer.innerHTML = `
    <a href="../Projethtml/contact.html">Nous contacter</a>
    <p>Copyright &copy; 2026<br>Powered by Khaled</p>
    <a href="../Projethtml/mentionsLegales.html">Mentions legales</a>
    <a href="../Projethtml/politiqueconf.html">Politique de confidentialite</a>
  `;
}
