const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/resources/public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const handleFileUpload = (req, res, next) => {
  upload.array("files", 10)(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      req.flash("error", "File upload error");
      return res.redirect("back");
    } else if (err) {
      req.flash("error", "Internal server error");
      return res.redirect("back");
    }
    next();
  });
};

module.exports = { handleFileUpload, upload };
