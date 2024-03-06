const bcrypt = require("bcrypt");
const User = require("../models/User");
const Role = require("../models/Role");

const passport = require("passport");

class HomeController {
  logout(req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.session.destroy();
      res.redirect("/");
    });
  }

  login(req, res, next) {
    return res.render("Login", {
      noHeader: true,
      title: "Login",
      email: req.flash("email"),
    });
  }

  async validate(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        req.flash("error", "Internal Server Error");
        return next(err);
      }
      if (!user) {
        req.flash("error", info.message);
        return res.redirect("/login");
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }

        res.redirect("/");
      });
    })(req, res, next);
  }

  register(req, res, next) {
    return res.render("Register", {
      noHeader: true,
      title: "Register",
    });
  }

  async store(req, res, next) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      req.flash("error", "Missing information");
      return res.redirect("back");
    }

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        req.flash("error", "Email already registered");
        return res.redirect("back");
      }

      const hash = bcrypt.hashSync(password, 10);

      const user = new User({
        ...req.body,
        password: hash,
      });

      await user.save();
      req.flash("success", "Successfully registered");
      req.flash("email", email);

      return res.redirect("/login");
    } catch (error) {
      req.flash("error", "An error occurred. Try again later");
      return res.redirect("back");
    }
  }

  privacy(req, res, next) {
    return res.render("privacy", {
      noBanner: true,
      title: "Privacy Policy",
    });
  }

  terms(req, res, next) {
    return res.render("terms", {
      noBanner: true,
      title: "Terms & Conditions",
    });
  }

  index(req, res, next) {
    return res.render("home", { title: "Home" });
  }
}

module.exports = new HomeController();
