const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

// Schema pour le modèle user
const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      unique: true,
      trim: true, // Supprime les espaces avant et après la chaîne
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail], // Validation de l'email en utilisant le module validator (regex)
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 64,
      minlength: 6,
    },
    picture: {
      type: String,
      default: "../client/public/upload/profil/random-user.png",
    },
    bio: {
      type: String,
      max: 1000,
    },
    likes: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Joue la fct avant de sauvegarder un user dans la DB
userSchema.pre("save", async function (next) {
  // Génération de sel pour le hachage du MDP
  const salt = await bcrypt.genSalt();
  // Hachage du MDP avant la sauvegarde
  this.password = await bcrypt.hash(this.password, salt);
  // = Passer à la prochaine étape
  next();
});
// "function" afin de pouvoir utiliser this (pour ne pas perdre le contexte de scope)
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    // Stoppe et déclenche l'erreur
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

// Création du modèle user à partir du userSchema
const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
