const postModel = require("../models/post.model");
const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
// 
// 
// Fonction de création d'un post
module.exports.createPost = async (req, res) => {
  const newPost = new postModel({
    posterId: req.body.posterId,
    message: req.body.message,
    video: req.body.video,
    likers: [],
    commets: [],
  });

  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
};

// 
// 
// Fonction pour afficher un post
module.exports.readPost = async (req, res) => {
  try {
    const docs = await PostModel.find();
    res.send(docs);
  } catch (err) {
    console.log("Error to get data : " + err);
  }
};

// 
// 
// Fonction pour mettre à jour un post
module.exports.updatePost = (req, res) => {};

// 
// 
// Fonction pour supprimer un post
module.exports.deletePost = (req, res) => {};
