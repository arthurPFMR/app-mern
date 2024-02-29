const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

// Fonction pour récupérer tous les users de la DB
module.exports.getAllUsers = async (req, res) => {
  // Récupération de tous les users, en excluant le champ "password"
  const users = await UserModel.find().select("-password");
  // Envoi des utilisateurs en tant que réponse JSON avec le statut 200
  res.status(200).json(users);
};

// Fonction pour obtenir les informations sur un users spécifique
module.exports.userInfo = (req, res) => {
  // Vérification de la validité de l'identifiant passé en paramètre de la requête
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  // Recherche de l'user dans la DB par l'identifiant
  UserModel.findById(req.params.id, (err, docs) => {
    // Pas d'erreur = envoi des informations de l'user en tant que réponse
    if (!err) res.send(docs);
    else console.log("ID unknown" + err);
  }).select("-password");
};
