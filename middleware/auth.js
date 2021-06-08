const jwt = require('jsonwebtoken');
const { register } = require('../controllers/auth');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = async(req, res, next) => {
  let token;
  console.log(req.headers.authorization);

  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    // Bearer 4fsqf3d24sfsdfsq
    token = req.headers.authorization.split(" ")[1];
  }

  if(!token) {
    return next(new ErrorResponse("Accès non autorisé", 401))
  }

  try {
    // verify va décrypter le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if(!user) {
      return next(new ErrorResponse("Aucun utilisateur n'a été trouvé avec cet id", 404))
    }
    
    req.user = user;

    next();
  } catch (error) {
    return next(new ErrorResponse("Accès non autorisé", 401));
  }
}