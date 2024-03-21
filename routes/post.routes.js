const router = require("express").Router();
const postController = require("../controllers/post.controller");

// CRUD
router.get("/", postController.readPost);
router.post("/", postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);
// Gestion des likes/unlikes d'un post (id du post)
router.patch("/like-post/:id", postController.likePost);
router.patch("/unlike-post/:id", postController.unlikePost);

// Comments
router.patch("/comment-post/:id", postController.commentPost);
router.patch("/edit-comment-post/:id", postController.editCommentPost);
router.delete("/delete-comment-post/:id", postController.deleteCommentPost);

module.exports = router;
