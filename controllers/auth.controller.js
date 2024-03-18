const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { signUpErrors, signInErrors } = require("../utils/error.utils");

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

//
//
// Fonction pour gérer l'inscription d'un nouvel user__________________________
module.exports.signUp = async (req, res) => {
  // Extraction des champs pseudo/email/password du corps de la requête
  const { pseudo, email, password } = req.body;
  try {
    // Création d'un nouvel user en utilisant le modèle UserModel
    const user = await UserModel.create({ pseudo, email, password });
    // Envoi d'une réponse avec statut + identifiant de l'user créé
    res.status(201).json({ user: user._id });
  } catch (err) {
    // Gestion des erreurs avec errors.utils
    const errors = signUpErrors(err);
    // En cas d'erreur lors de la création de l'user, envoi d'une réponse avec statut + la const errors
    res.status(200).send({ errors });
  }
};

//
//
// Fonction pour gérer la connexion de user____________________________________
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
    res.status(200).json({ user: user._id });
  } catch (err) {
    // Gestion des erreurs avec errors.utils
    const errors = signInErrors(err)
    res.status(500).json({ errors });
  }
};

//
//
// Fonction pour gérer la déconnexion de user__________________________________
module.exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
