const isAdmin = (req, res, next) => {
  if (req.user.role.name === "Administrator") {
    return next();
  } else {
    renderForbidden(res);
  }
};

const isManager = (req, res, next) => {
  if (req.user.role.name === "Marketing Manager") {
    return next();
  } else {
    renderForbidden(res);
  }
};

const isCoordinator = (req, res, next) => {
  if (req.user.role.name === "Marketing Coordinator") {
    return next();
  } else {
    renderForbidden(res);
  }
};

const isStudent = (req, res, next) => {
  if (req.user.role.name === "Student") {
    return next();
  } else {
    renderForbidden(res);
  }
};

const renderForbidden = (res) => {
  return res.render("error", {
    noHeader: true,
    statusCode: 403,
    message: "Forbidden. You are not allowed.",
  });
};

module.exports = { isAdmin, isManager, isCoordinator, isStudent };
