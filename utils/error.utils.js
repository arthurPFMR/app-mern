// Fonction de gestion d'erreur pour línscription______________________________
module.exports.signUpErrors = (err) => {
  let errors = { pseudo: "", email: "", password: "" };
  // -------------------
  if (err.message.includes("pseudo"))
    errors.pseudo = "Désolé, le pseudo est incorrect ou déjà utilisé";
  // 11000 code erreur depuis mongoDB
  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
    errors.pseudo = "Ce pseudo existe déjà";
  // -------------------
  if (err.message.includes("email"))
    errors.email = "Désolé, l'email est incoreect";

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
    errors.email = "Cet email existe déjà";
  // -------------------
  if (err.message.includes("password"))
    errors.password = "Le mot de passe doit contenir 6 caractères au minimum";

  return errors;
};

//
//
// Fonction de gestion d'erreur pour la connexion_____________________________
module.exports.signInErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message.includes("email"))
    errors.email = "Désolé l'email saisit est incorrect";

  if (err.message.includes("password"))
    errors.password = "Le mot de passe saisit est ne correspond pas";

  return errors;
};

//
//
// Fonction de gestion d'erreur pour l'upload de límg de profil
module.exports.uploadErrors = (err) => {
  let errors = { format: "", maxSize: "" };

  if (err.message.includes("invalide file"))
    errors.format = "Format incompatible";

  if (err.message.includes("max size"))
    errors.maxSize = "Le fichier ne doit pas dépasser 500ko";

  return errors;
};
