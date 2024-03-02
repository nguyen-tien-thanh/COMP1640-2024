const { jsonToObject } = require("../utils/jsonToObject");
const homeRoutes = require("./homeRoutes");
const magazineRoutes = require("./magazineRoutes");
const facultyRoutes = require("./facultyRoutes");

function route(app) {
  app.use((req, res, next) => {
    if (req.isAuthenticated()) {
      res.locals.user = jsonToObject(req.user);
    } else {
      res.locals.user = null;
    }
    next();
  });

  app.use("/faculty", facultyRoutes);
  app.use("/magazine", magazineRoutes);
  app.use("/", homeRoutes);
}

module.exports = route;
