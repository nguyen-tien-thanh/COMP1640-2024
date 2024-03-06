const isAdmin = (req, res, next) => {
  if (req.user.role.name === "Administrator") {
    return next();
  } else {
    renderForbidden(res)
  }
};

const renderForbidden = (res) => {
    return res.render("error", {
      noHeader: true,
      statusCode: 403,
      message: "Forbidden. You are not allowed.",
    });
}

module.exports = { isAdmin };