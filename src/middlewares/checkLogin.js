const checkLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.render("error", {
      noHeader: true,
      layout: "main",
      statusCode: 401,
      message: "Unauthorized. Please log in.",
    });
  }
};

module.exports = checkLogin;
