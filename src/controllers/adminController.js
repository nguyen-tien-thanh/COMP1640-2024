const express = require("express");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");

const User = require("../models/User");
const Contribution = require("../models/Contribution");
const Role = require("../models/Role");
const Faculty = require("../models/Faculty");

const { jsonToObject, multipleJsonToObject } = require("../utils/jsonToObject");

class AdminController {
  async index(req, res, next) {
    try {
      Promise.all([
        Contribution.find({})
          .populate("faculty")
          .populate("user")
          .sort({ createdAt: 1 }),
        Faculty.find({}).sort({ name: 1 }),
      ]).then(([contributions, faculties]) => {
        return res.render("admin", {
          layout: "adminLayout",
          title: "Management",
          noHeader: true,
          contributions: multipleJsonToObject(contributions),
          faculties: multipleJsonToObject(faculties),
        });
      });
    } catch (err) {
      console.error(err);
      req.flash("error", "Internal server error");
      return res.redirect("back");
    }
  }

  async manageUser(req, res, next) {
    try {
      const users = await User.find({}).populate("role");
      const roles = await Role.find({});

      return res.render("admin/manage-user", {
        layout: "adminLayout",
        title: "Users Management",
        noHeader: true,
        users: multipleJsonToObject(users),
        roles: multipleJsonToObject(roles),
      });
    } catch (err) {
      console.error(err);
      req.flash("error", "Internal server error");
      return res.redirect("back");
    }
  }

  async manageFaculty(req, res, next) {
    try {
      const users = await User.find({}).populate("role");
      const faculties = await Faculty.find({})
        .populate({ path: "coordinator", select: "_id name" })
        .populate({ path: "users", select: "_id name" })
        .sort({ createdAt: -1 });

      return res.render("admin/manage-faculty", {
        layout: "adminLayout",
        title: "Faculties Management",
        noHeader: true,
        users: multipleJsonToObject(users),
        faculties: multipleJsonToObject(faculties),
      });
    } catch (err) {
      console.error(err);
      req.flash("error", "Internal server error");
      return res.redirect("back");
    }
  }

  async manageContribution(req, res, next) {
    try {
      const contributions = await Contribution.find({})
        .populate({ path: "faculty", select: "_id name" })
        .populate({ path: "user", select: "_id name" })
        .sort({ createdAt: -1 });

      return res.render("admin/manage-contribution", {
        layout: "adminLayout",
        title: "Contributions Management",
        noHeader: true,
        contributions: multipleJsonToObject(contributions),
      });
    } catch (err) {
      console.error(err);
      req.flash("error", "Internal server error");
      return res.redirect("back");
    }
  }

  async download(req, res, next) {
    try {
      const contributions = await Contribution.find({}).populate("user");

      const masterArchive = archiver("zip");

      const masterZipFileName = "contributions.zip";
      res.attachment(masterZipFileName);

      masterArchive.pipe(res);

      fs.mkdirSync("./temp");
      for (const contribution of contributions) {
        const userFolderName = `${contribution._id} - ${contribution.user.name}`;
        const contributionFolder = path.join("./temp", userFolderName);

        const parentDirectory = path.dirname(contributionFolder);
        if (!fs.existsSync(parentDirectory)) {
          fs.mkdirSync(parentDirectory, { recursive: true });
        }

        fs.mkdirSync(contributionFolder);

        for (const file of contribution.files) {
          const filePath = path.join("./src/resources/public/uploads", file);
          const fileName = path.basename(filePath);
          fs.copyFileSync(filePath, path.join(contributionFolder, fileName));
        }

        const txtFileName = "contribution_info.txt";
        const txtFilePath = path.join(contributionFolder, txtFileName);
        const contributionFiles = contribution.files.map(
          (file) => `\n- ${file}`
        );

        const contributionInfo = `Contribution ID: ${
          contribution._id
        }\nOwner: ${contribution.user.name}\nContent: ${
          contribution.content ? contribution.content : null
        }\nIs Published: ${contribution.isPublished}\nCreated at: ${
          contribution.createdAt
        }\nFiles: ${contributionFiles}\n`;

        fs.writeFileSync(txtFilePath, contributionInfo);

        masterArchive.directory(contributionFolder, userFolderName);
      }

      await masterArchive.finalize();
      await rimraf.sync("./temp");
    } catch (err) {
      console.error(err);
      await rimraf.sync("./temp");
      res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = new AdminController();
