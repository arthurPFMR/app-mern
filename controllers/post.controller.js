const postModel = require("../models/post.model");
const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId; // Pour manipuler les ID de MongoDB

//
//
// Fonction de création d'un post______________________________________________
module.exports.createPost = async (req, res) => {
  // Création d'un nouvel objet post avec les données de la requête
  const newPost = new postModel({
    posterId: req.body.posterId,
    message: req.body.message,
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    // Tentative de sauvegarde du new post dans la BD
    const post = await newPost.save();
    // Si sauvegarde ok, réponse 201 + post
    return res.status(201).json(post);
  } catch (err) {
    // Si erreur, log de l'erreur
    return res.status(400).send(err);
  }
};

//
//
// Fonction pour afficher un post______________________________________________
module.exports.readPost = async (req, res) => {
  try {
    // Tentative de recherche de tous les posts dans la BD
    const docs = await PostModel.find();
    // Si recherche ok, les posts sont envoyés en réponse
    res.send(docs);
  } catch (err) {
    // Si erreur, log de l'erreur
    console.log("Failed to get data : " + err);
  }
};

//
//
// Fonction pour mettre à jour un post_________________________________________
module.exports.updatePost = async (req, res) => {
  // Vérification de la validité de l'id passé en paramètre de la requête
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Unknown ID : " + req.params.id);

  // Création d'un objet avec les MAJ
  const updatedRecord = {
    message: req.body.message,
  };

  try {
    // Si MAJ ok, le post mis à jour est envoyé en réponse
    const docs = await PostModel.findByIdAndUpdate(
      req.params.id,
      { $set: updatedRecord },
      { new: true }
    );
    res.send(docs);
  } catch (err) {
    // Si erreur, log de l'erreur
    console.log("Failed to update :" + err);
  }
};

//
//
// Fonction pour supprimer un post_____________________________________________
module.exports.deletePost = async (req, res) => {
  // Vérification de la validité de l'id passé en paramètre de la requête
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Unknown ID : " + req.params.id);

  try {
    // Tentative de suppression du post dans la BD
    const docs = await PostModel.findByIdAndDelete(req.params.id);
    // Si la suppression ok, le post supprimé est envoyé en réponse
    if (!docs) throw Error("No post found");
    res.send(docs);
  } catch (err) {
    // Si erreur, log de l'erreur
    console.log("Failed to delete :" + err);
  }
};

//
//
// Fonction pour liker un post_________________________________________________
module.exports.likePost = async (req, res) => {
  // Vérification de la validité de l'id passé en paramètre de la requête
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Unknown ID : " + req.params.id);

  try {
    // Tentative de mise à jour du post dans la base de données
    const post = await PostModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likers: req.body.id } },
      { new: true }
    );

    // Si une erreur se produit lors de la mise à jour du post, une réponse avec un statut 400 est renvoyée, contenant l'erreur
    if (!post) return res.status(400).send("Post not found");

    // Tentative de mise à jour de l'utilisateur dans la base de données
    const user = await UserModel.findByIdAndUpdate(
      req.body.id,
      { $addToSet: { likes: req.params.id } },
      { new: true }
    );

    // Si une erreur se produit lors de la mise à jour de l'utilisateur, une réponse avec un statut 400 est renvoyée, contenant l'erreur
    if (!user) return res.status(400).send("User not found");

    // Si tout se passe bien, une réponse avec un statut 200 est renvoyée, contenant le post et l'utilisateur mis à jour
    return res.status(200).json({ post, user });
  } catch (err) {
    // Si une erreur se produit lors de l'exécution du code, une réponse avec un statut 400 est renvoyée, contenant l'erreur
    return res.status(400).send(err);
  }
};


//
//
// Fonction pour unliker un post_________________________________________________
module.exports.unlikePost = async (req, res) => {
  // Vérification de la validité de l'id passé en paramètre de la requête
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Unknown ID : " + req.params.id);
};
