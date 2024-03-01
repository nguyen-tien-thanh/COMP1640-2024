const mongoose = require("mongoose");

const Faculty = mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("Faculty", Faculty);
