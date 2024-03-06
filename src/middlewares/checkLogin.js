const checkLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.render("error", {
      noHeader: true,
      statusCode: 401,
      message: "Unauthorized. Please log in.",
    });
  }
};

module.exports = checkLogin;
