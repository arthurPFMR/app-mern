const UserModel = require("../models/user.model");
const fs = require("fs");
const { promisify } = require("util");
const { uploadErrors } = require("../utils/error.utils");
const pipeline = promisify(require("stream").pipeline);

module.exports.uploadProfil = async (req, res) => {
  try {
    if (
      req.file.detectedMimeType != "image/jpg" &&
      req.file.detectedMimeType != "image/png" &&
      req.file.detectedMimeType != "image/jpeg"
    )
      throw Error("invalid file");

    if (req.file.size > 500000) throw Error("max size");
  } catch (err) {
    const errors = uploadErrors(err);
    return res.status(201).json({ errors });
  }
  const fileName = req.body.name + ".jpg";

  await pipeline(
    req.file.stream,
    fs.createWriteStream(
      `${__dirname}/../client/public/upload/profil/${fileName}`
    )
  );

  try {
    const user = await UserModel.findByIdAndUpdate(
      req.body.userId,
      { $set: { picture: "../client/public/upload/profil/" + fileName } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.send(user);
  } catch (err) {
    return res.status(500).send(err);
  }
};
