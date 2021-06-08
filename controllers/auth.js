const crypto = require ('crypto');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

// Le paramètre next est important pour la gestion des erreurs
exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password
      // password sera crypté avant qu'on le sauvegarde
    });

    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};


exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return next(new ErrorResponse("Veuillez saisir un email et un mot de passe", 400));
  }

  // On vérifie si l'utilisateur existe dans notre BDD en cherchant un utilisateur par son email car son email est unique. 
  // On retourne également le password afin de vérifier qu'ils correspondent avec la fonction isMatch.
  try {
    const user = await User.findOne({email}).select("+password");

    if(!user) {
      return next(new ErrorResponse("Identifiants invalides", 401));
    }

    const isMatch = await user.matchPasswords(password);

    if(!isMatch) {
      return next(new ErrorResponse("Identifiants invalides", 401));
    }

    sendToken(user, 200, res);

  } catch (error) {
    res.status(500).json({success: false, error: error.message});
  }
}

exports.forgotpassword = async (req, res, next) => {
  const {email} = req.body;

  try {
    const user = await User.findOne({email});

    if(!user) {
      return next(new ErrorResponse("Le mail n'a pas pu être envoyé", 404))
    }

    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

    const message = `
      <h1>Vous avez demandé une réinitialisation de votre mot de passe</h1>
      <p>Veuillez suivre ce lien afin de réinitialiser votre mot de passe</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `

    try {
      await sendEmail({
        to: user.email,
        subject: "Password reset request",
        text: message
      });

      res.status(200).json({success: true, data: "Email envoyé"});

    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse("Le mail n'a pas pu être envoyé", 500));
    }

  } catch (error) {
    next(error);
  }
}

exports.resetpassword = async (req, res, next) => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      // $gt : greater than
      resetPasswordExpire: {$gt: Date.now()}
    })

    if(!user) {
      return next(new ErrorResponse("Token de réinitialisation invalide", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: "Mot de passe réinitialisé avec succès"
    })

  } catch (error) {
    next(error);
  }
}

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({success:true, token});
}