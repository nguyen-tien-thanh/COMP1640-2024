const mongoose = require("mongoose");

async function connect() {
  mongoose.set("strictQuery", true);
  mongoose.connect(process.env.MONGODB_URI, {});
  mongoose.connection
    .once("open", () => console.log("Database has been connected !!!"))
    .on("error", (error) => {
      console.log("Can not connect to Database !!!", error);
    });
}

module.exports = { connect };
