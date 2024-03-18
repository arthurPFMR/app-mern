const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

//
//
// Fonction pour récupérer tous les users de la DB_________________________________
module.exports.getAllUsers = async (req, res) => {
  // Récupération de tous les users, en excluant le champ "password"
  const users = await UserModel.find().select("-password");
  // Envoi des users en tant que réponse JSON avec le statut 200
  res.status(200).json(users);
};

//
//
// Fonction pour obtenir les informations sur un user spécifique___________________
module.exports.userInfo = async (req, res) => {
  try {
    // Vérification de la validité de l'id passé en paramètre de la requête
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);

    // Recherche de l'utilisateur dans la DB par l'identifiant
    const user = await UserModel.findById(req.params.id).select("-password");

    // Pas d'erreur = envoi des informations de l'utilisateur en tant que réponse
    res.send(user);
  } catch (err) {
    // Gestion des erreurs
    console.log("Internal Server Error: " + err);
    res.status(500).send("Internal Server Error");
  }
};

//
//
// Fonction de mis a jour d'un user________________________________________________
module.exports.updateUser = async (req, res) => {
  try {
    // Vérification de la validité de l'id passé en paramètre de la requête
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);

    // Mise à jour de l'user dans la DB
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        // Dans MongoDB, l’opérateur $set est utilisé pour mettre à jour la valeur d’un champ spécifique dans un document. Si le champ n’existe pas, $set l’ajoutera avec la valeur spécifiée.
        $set: {
          bio: req.body.bio,
        },
      },
      // Option passée à la méthode findOneAndUpdate de Mongoose
      { new: true, upsert: true, setDefaultsOnInsert: true }
      // new: true : option indiquant que la méthode doit renvoyer le document après la maj. Si cette option n’est pas définie ou est définie à false, la méthode renverra le document avant la maj.
      // upsert: true : cette option crée un nouveau document si aucun doc ne correspond à la condition de recherche. Dans ce cas, si aucun user ne correspond à l’ID spécifié, un nouvel user sera créé.
      // setDefaultsOnInsert: true : si un nouveau document est créé via l'option upsert: true, cette option appliquera les valeurs par défaut définies dans le modèle Mongoose à ce nouveau document.
    );

    // Pas d'erreur = envoi des informations (MAJ) de l'user
    res.send(updatedUser);
  } catch (err) {
    // Gestion des erreurs
    console.log("Internal Server Error: " + err);
    res.status(500).json({ message: err });
  }
};

//
//
// Fonction pour supprimer un user_________________________________________________
module.exports.deleteUser = async (req, res) => {
  try {
    // Vérification de la validité de l'id passé en paramètre de la requête
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);

    // Suppression de l'user dans la DB
    const result = await UserModel.findByIdAndDelete(req.params.id);

    // Vérification du résultat de la suppression
    if (result) {
      res.status(200).json({ message: "Successfully deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    // Gestion des erreurs
    console.log("Internal Server Error: " + err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
