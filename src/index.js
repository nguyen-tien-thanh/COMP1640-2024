const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const route = require("./routes");
const connectToMongoDB = require("./config/db");

const hbs = exphbs.create({
  helpers: require("./utils/helpers"),
  extname: ".hbs",
});

const helpers = require("handlebars-helpers")();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));
app.use(express.static("src/resources/public"));

route(app);

app.listen(process.env.PORT, async () => {
  console.log(
    `\nWebsite available on: \x1b[33mhttp://localhost:${process.env.PORT}\x1b[0m`
  );
  await connectToMongoDB();
});
