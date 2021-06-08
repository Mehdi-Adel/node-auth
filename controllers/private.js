exports.getPrivateData = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: "Vous avez accès aux données privées dans cette route"
  });
};