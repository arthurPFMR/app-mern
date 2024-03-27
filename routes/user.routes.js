const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const uploadController = require("../controllers/upload.controller");

// Route authentification
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);

// Routes pour la gestion des users dans la DB
router.get("/", userController.getAllUsers); // Récupération de tous les users
router.get("/:id", userController.userInfo); // Récupération des infos d'un user par son id
router.put("/:id", userController.updateUser); // Mis à jour des infos d'un user
router.delete("/:id", userController.deleteUser); // Suppression d'un user

// Import  de multer + route upload img profil
import("multer").then((multerModule) => {
  multer = multerModule.default;
  const upload = multer();

  router.post("/upload", upload.single("file"), uploadController.uploadProfil);
});

module.exports = router;
