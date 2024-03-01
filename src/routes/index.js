const homeRoutes = require("./homeRoutes");

function route(app) {
  app.use("/", homeRoutes);
}

module.exports = route;
