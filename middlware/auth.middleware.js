const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

//
//
// Fonction middleware 'checkUser'_____________________________________________
module.exports.checkUser = (req, res, next) => {
  // Récupération du token jwt depuis les cookies de la requête
  const token = req.cookies.jwt;

  if (token) {
    // Vérification du token
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      // Si une erreur se produit lors de la vérification
      if (err) {
        // On définit 'user' comme null dans les variables locales de la réponse
        res.locals.user = null;
        // On supprime le cookie 'jwt'
        res.cookie("jwt", "", { maxAge: 1 });
        // On passe au middleware suivant
        next();
      } else {
        // Si la vérification est réussie, on récupère l'user correspondant à l'ID du token décodé
        let user = await UserModel.findById(decodedToken.id);
        // On définit 'user' dans les variables locales de la réponse avec les infos de l'user récupéré
        res.locals.user = user;
        next();
      }
    });
  } else {
    // Si aucun token n'est présent, on définit 'user' comme null dans les variables locales de la réponse
    res.locals.user = null;
    next();
  }
};

module.exports.requireAuth = (req, res, next) => {
  // Récupération du token jwt depuis les cookies de la requête
  const token = req.cookies.jwt;
  if (token) {
    // Si une erreur se produit lors de la vérification
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        // On log l'erreur
        console.log(err);
        // Pas de next() car pas de token
      } else {
        // Si la vérification est réussie, on log l'ID du token décodé
        console.log(decodedToken.id);
        // On passe au middleware suivant
        next();
      }
    });
  } else {
    // Si aucun token n'est présent, on log "No token !"
    console.log("No token !");
    // Pas de next() car pas de token
  }
};
