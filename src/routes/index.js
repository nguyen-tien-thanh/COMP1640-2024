const { jsonToObject } = require("../utils/jsonToObject");
const homeRoutes = require("./homeRoutes");
const contributionRoutes = require("./contributionRoutes");
const facultyRoutes = require("./facultyRoutes");
const commentRoutes = require("./commentRoutes");

function route(app) {
  app.use((req, res, next) => {
    if (req.isAuthenticated()) {
      res.locals.user = jsonToObject(req.user);
    } else {
      res.locals.user = null;
    }
    next();
  });

  app.use("/comment", commentRoutes);
  app.use("/faculty", facultyRoutes);
  app.use("/contribution", contributionRoutes);
  app.use("/", homeRoutes);
}

module.exports = route;
