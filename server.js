const express = require("express");
const bodyParser = require("body-parser");

// Importation des routes définies
const userRoutes = require("./routes/user.routes");

// Configuration des variables d'environnement
require("dotenv").config({ path: "./config/.env" });
// Connexion à la DB
require("./config/db");

// Création de l'app Express
const app = express();

// Utilisation de bodyParser pour traiter les requêtes au format JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRoutes);

// Démarrage du serveur Express
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
