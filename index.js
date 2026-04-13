import express from "express";
import cors from "cors";
import routesEvenements from "./backend/routes/events.js";
import routesUtilisateurs from "./backend/routes/users.js";

// Fichier principal du serveur.
// Il lance Express, sert le frontend et branche les routes API.

const app = express();
const port = process.env.PORT || 3000;
const PAGES_DETAIL_LEGACY = [
  "chapellestamans",
  "cirquedelabeil",
  "cirquedemoureze",
  "cornichelaroux",
  "lacdusalagou",
  "lagardiole",
  "lavaldenize",
  "lesfenestrettes",
];

// Le front peut appeler le back depuis le navigateur
app.use(cors());

// Express lit le JSON envoye dans req.body
app.use(express.json());

// Les fichiers HTML, CSS et JS du front sont servis ici
app.use(express.static("frontend"));

app.get("/detail-evenement/:page.html", function redirigerAncienDetail(req, res, next) {
  const page = String(req.params.page || "").trim().toLowerCase();

  if (!PAGES_DETAIL_LEGACY.includes(page)) {
    return next();
  }

  return res.redirect("/detail-evenement/evenement.html?page=" + encodeURIComponent(page));
});

app.use(function gererErreurJson(err, req, res, next) {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      message: "Le JSON envoye est invalide",
      detail: err.message,
    });
  }

  return next(err);
});

app.get("/", function envoyerAccueil(req, res) {
  res.redirect("/Projethtml/accueil.html");
});

app.use("/api", routesEvenements);
app.use("/api", routesUtilisateurs);

app.listen(port, function demarrerServeur() {
  console.log("Serveur demarre sur le port " + port);
});
