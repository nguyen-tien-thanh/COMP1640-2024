const isAdmin = (req, res, next) => {
  if (req.user.role.name === "Administrator") {
    return next();
  } else {
    renderForbidden(res);
  }
};

const isManager = (req, res, next) => {
  if (
    req.user.role.name === "Marketing Manager" ||
    req.user.role.name === "Administrator"
  ) {
    return next();
  } else {
    renderForbidden(res);
  }
};

const isCoordinator = (req, res, next) => {
  if (
    req.user.role.name === "Marketing Coordinator" ||
    req.user.role.name === "Administrator"
  ) {
    return next();
  } else {
    renderForbidden(res);
  }
};

const isStudent = (req, res, next) => {
  if (
    req.user.role.name === "Student" ||
    req.user.role.name === "Administrator" ||
    req.user.role.name === "Marketing Coordinator"
  ) {
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
