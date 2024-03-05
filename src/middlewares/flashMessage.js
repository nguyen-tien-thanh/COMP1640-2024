const flashMiddleware = (req, res, next) => {
  const errorMessage = req.flash("error")[0] || "";
  res.locals.error = { message: errorMessage };

  const successMessage = req.flash("success")[0] || "";
  res.locals.success = { message: successMessage };

  next();
};

module.exports = flashMiddleware;
