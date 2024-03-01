class HomeController {
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
    return res.render("home");
  }
}

module.exports = new HomeController();
