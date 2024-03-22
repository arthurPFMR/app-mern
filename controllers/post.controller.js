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
    const docs = await newPost.save();
    // Si sauvegarde ok, réponse 201 + post
    return res.status(201).json(docs);
  } catch (err) {
    // Si erreur, log de l'erreur
    return res.status(400).send(err);
  }
};

//
//
// Fonction pour afficher les post____________________________________________
module.exports.readPost = async (req, res) => {
  try {
    // Tentative de recherche de tous les posts dans la BD
    const docs = await PostModel.find();
    // Si recherche ok, les posts sont envoyés en réponse (affichage + récent)
    res.send(docs).sort({ createdAt: -1 });
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
    if (!docs) throw Error("No post found ");
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
    // Tentative de MAJ du post dans la BD
    const docs = await PostModel.findByIdAndUpdate(
      req.params.id,
      // $addToSet = ajout
      { $addToSet: { likers: req.body.id } },
      { new: true }
    );

    // Si erreur lors de la MAJ du post, réponse 400 + erreur
    if (!docs) return res.status(400).send("Post not found");

    // Tentative de MAJ de l'user dans la BD
    const user = await UserModel.findByIdAndUpdate(
      req.body.id,
      // $addToSet = ajout
      { $addToSet: { likes: req.params.id } },
      { new: true }
    );

    // Si erreur lors de la MAJ de l'user, réponse 400 + l'erreur
    if (!user) return res.status(400).send("User not found");

    // Si ok, réponse 200 + le post et l'user mis à jour
    return res.status(200).json({ post, user });
  } catch (err) {
    // Si erreur, réponse 400 + l'erreur
    return res.status(400).send(err);
  }
};

//
//
// Fonction pour unliker un post______________________________________________
module.exports.unlikePost = async (req, res) => {
  // Vérification de la validité de l'id passé en paramètre de la requête
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Unknown ID : " + req.params.id);

  try {
    // Tentative de MAJ du post dans la BD
    const docs = await PostModel.findByIdAndUpdate(
      req.params.id,
      // $pull = suppression
      { $pull: { likers: req.body.id } },
      { new: true }
    );

    // Si erreur lors de la MAJ du post, réponse 400 + erreur
    if (!docs) return res.status(400).send("Post not found :" + err);

    // Tentative de MAJ de l'user dans la BD
    const user = await UserModel.findByIdAndUpdate(
      req.body.id,
      // $pull = suppression
      { $pull: { likes: req.params.id } },
      { new: true }
    );

    // Si erreur lors de la MAJ de l'user, réponse 400 + l'erreur
    if (!user) return res.status(400).send("User not found :" + err);

    // Si ok, réponse 200 + le post et l'user mis à jour
    return res.status(200).json({ post, user });
  } catch (err) {
    // Si erreur, réponse 400 + l'erreur
    return res.status(400).send(err);
  }
};

//
//
// Fonction pour commenter un post____________________________________________
module.exports.commentPost = async (req, res) => {
  // Vérification de la validité de l'id passé en paramètre de la requête
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Unknown ID : " + req.params.id);

  try {
    // Tentative de MAJ du post selon l'id dans la BD
    const docs = await PostModel.findByIdAndUpdate(
      // ID du post à mettre à jour
      req.params.id,
      {
        // $push = ajout d'un nouveau commentaire au tableau comments du post
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true }
    );
    // Aucun docs = erreur
    if (!docs) return res.status(404).send("No comment found :" + err);
    // Sinon envoie du docs MAJ
    else return res.send(docs);
  } catch (err) {
    // Si erreur, réponse 400 + l'erreur
    return res.status(400).send(err);
  }
};

//
//
// Fonction d'édition d'un commentaire_______________________________________
module.exports.editCommentPost = async (req, res) => {
  // Vérification de la validité de l'id passé en paramètre de la requête
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Unknown ID : " + req.params.id);

  try {
    // Tentative de MAJ du post selon l'id dans la BD
    const docs = await PostModel.findById(req.params.id);

    // Recherche du  commentaire à modifier dans le tableau comments du post
    const theComment = docs.comments.find((comment) =>
      comment._id.equals(req.body.commentId)
    );

    // Commentaire non trouvé = réponse 404 + erreur
    if (!theComment) return res.status(404).send("Comment not found :" + err);
    // Commentaire MAJ avec le texte fourni dans la requête.
    theComment.text = req.body.text;

    // Gestion des erreurs éventuelles lors de l'enregistrement du post MAJ
    try {
      // Enregistrement du post MAJ dans la BD
      const updatedDocs = await docs.save();
      // Si le post save ok, il est envoyé en réponse
      return res.status(200).send(updatedDocs);
    } catch (err) {
      // Si erreur, réponse 500 + erreur
      return res.status(500).send(err);
    }
  } catch (err) {
    // Si erreur, réponse 500 + erreur
    return res.status(500).send(err);
  }
};

//
//
//  Fonction pour supprimer un commentaire_____________________________________
module.exports.deleteCommentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Unknown ID : " + req.params.id);

  try {
    // Tentative de MAJ du post selon l'id dans la BD
    const docs = await PostModel.findByIdAndUpdate(
      // ID du post à mettre à jour
      req.params.id,
      {
        // $pull = supprimer
        $pull: {
          comments: {
            _id: req.body.commentId, // ID du commentaire à supprimer
          },
        },
      },
      { new: true }
    );
    // Aucun docs = erreur
    if (!docs) {
      return res.status(404).send("Post not found");
    }
    // Si aucun docs a été trouvé et MAJ, il est envoyé en réponse
    return res.send(docs);
  } catch (err) {
    // Si erreur, réponse 400 + erreur
    return res.status(400).send(err);
  }
};
