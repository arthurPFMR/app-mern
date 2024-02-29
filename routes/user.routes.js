const router = require("express").Router();

const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");

// Route authentification
router.post("/register", authController.signUp);

// Routes pour la gestion des users dans la DB
router.get("/", userController.getAllUsers); // Récupération de tous les users
router.get("/:id", userController.userInfo); // Récupération des infos d'un user par son id

module.exports = router;
