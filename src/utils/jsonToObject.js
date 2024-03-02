module.exports = {
  multipleJsonToObject: function (mongooses) {
    return mongooses.map((mongoose) => mongoose.toObject());
  },
  jsonToObject: function (mongoose) {
    return mongoose ? mongoose.toObject() : mongoose;
  },
};
