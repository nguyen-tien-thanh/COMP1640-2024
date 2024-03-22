const mongoose = require("mongoose");
const Role = require("../models/Role");
const User = require("../models/User");
const bcrypt = require("bcrypt");

async function connect() {
  mongoose.set("strictQuery", true);
  mongoose.connect(process.env.MONGODB_URI, {});
  mongoose.connection
    .once("open", async () => {
      console.log("Database has been connected !!!");
      try {
        console.log("\nMigrating database...");
        await migrateRole();
        await migrateAdmin();
        console.log("Migrating completed.\n");
      } catch (err) {
        console.error(err);
        console.log("Failed to migrate database");
      }
    })
    .on("error", (error) => {
      console.log("Can not connect to Database !!!", error);
    });
}

const migrateRole = async () => {
  const roles = [
    "Administrator",
    "Marketing Manager",
    "Marketing Coordinator",
    "Student",
    "Guest",
  ];
  for (let role of roles) {
    const roleExists = await Role.findOne({ name: role });
    if (!roleExists) {
      const newRole = new Role({ name: role });
      await newRole.save();
    }
  }
  console.log(`Migrate role...`);
};

const migrateAdmin = async () => {
  const role = await Role.findOne({ name: "Administrator" });

  const adminExists = await User.findOne({ email: "admin@gmail.com" });

  if (adminExists) return;

  const user = new User({
    role: role._id,
    name: "Administrator",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("admin", 10),
  });

  await user.save();
  console.log(`Migrate admin...`);
};

module.exports = { connect };
