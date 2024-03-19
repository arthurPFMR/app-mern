const express = require("express");
const bodyParser = require("body-parser"); // Middleware pour analyser le corps des requêtes HTTP
const cookieParser = require("cookie-parser"); // Middleware pour analyser les cookies

// Importation des routes utilisateur
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");

// Configuration des variables d'environnement
require("dotenv").config({ path: "./config/.env" });
// Connexion à la DB
require("./config/db");

// Importation des middlewares dáuthentification (jwt)
const { checkUser, requireAuth } = require("./middlware/auth.middleware");

// Création de l'app Express
const app = express();

// Utilisation de bodyParser pour traiter le corps des requêtes au format JSON et urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Utilisation de cookieParser pour analyser les cookies
app.use(cookieParser());

// JWT_________________________________________________________________________
// À chaque requète on vérifie avec checkUser
app.get("*", checkUser);
// Route spécifique pour obtenir l'ID JWT, nécessite une authentification
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

// Utilisation des routes user__________________________________________
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// Démarrage du serveur Express sur le port spécifié dans les variables d'environnement
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
