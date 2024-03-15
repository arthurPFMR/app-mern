const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Importation des routes définies
const userRoutes = require("./routes/user.routes");

// Configuration des variables d'environnement
require("dotenv").config({ path: "./config/.env" });
// Connexion à la DB
require("./config/db");

// importation de la vérification de user (jwt)
const { checkUser } = require("./middlware/auth.middleware");

// Création de l'app Express
const app = express();

// Utilisation de bodyParser pour traiter les requêtes au format JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// JWT - à chaque requète on vérifie avec checkUser
app.get("*", checkUser);

// Routes
app.use("/api/user", userRoutes);

// Démarrage du serveur Express
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
