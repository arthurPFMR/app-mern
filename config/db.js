const mongoose = require("mongoose");

// Connexion à la DB
mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USER_PASS +
      "@clustertest.6demt23.mongodb.net/react-node"
  )
  // Connexion OK
  .then(() => console.log("Connected to  mongoDB"))
  // Erreur à la connexion
  .catch((err) => console.log("Failed to connected to mongoDB", err));
