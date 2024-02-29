const UserModel = require("../models/user.model");

// Fonction pour gérer l'inscription d'un nouvel user
module.exports.signUp = async (req, res) => {
  // Extraction des champs pseudo/email/password du corps de la requête
  const { pseudo, email, password } = req.body;
  try {
    // Création d'un nouvel user en utilisant le modèle UserModel
    const user = await UserModel.create({ pseudo, email, password });
     // Envoi d'une réponse avec statut + identifiant de l'user créé
    res.status(201).json({ user: user._id });
  } catch (err) {
    // En cas d'erreur lors de la création de l'user, envoi d'une réponse avec statut + erreur
    res.status(200).send({ err });
  }
};
