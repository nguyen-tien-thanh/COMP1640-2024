const { jsonToObject } = require("../utils/jsonToObject");
const homeRoutes = require("./homeRoutes");
const contributionRoutes = require("./contributionRoutes");
const facultyRoutes = require("./facultyRoutes");
const commentRoutes = require("./commentRoutes");
const publicationRoutes = require("./publicationRoutes");
const profileRoutes = require("./profileRoutes");
const adminRoutes = require("./adminRoutes");

const flashMessage = require("../middlewares/flashMessage");
const checkLogin = require("../middlewares/checkLogin");

function route(app) {
  app.use(flashMessage);

  app.use((req, res, next) => {
    if (req.isAuthenticated()) {
      res.locals.user = jsonToObject(req.user);
    } else {
      res.locals.user = null;
    }
    next();
  });

  app.use("/admin", checkLogin, adminRoutes);
  app.use("/profile", checkLogin, profileRoutes);
  app.use("/publication", publicationRoutes);
  app.use("/comment", checkLogin, commentRoutes);
  app.use("/faculty", checkLogin, facultyRoutes);
  app.use("/contribution", checkLogin, contributionRoutes);
  app.use("/", homeRoutes);
}

module.exports = route;
