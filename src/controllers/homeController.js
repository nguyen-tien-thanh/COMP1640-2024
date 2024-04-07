const User = require("../models/User");

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
