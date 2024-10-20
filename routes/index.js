const express = require("express");
const router = express.Router();

const isAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    return next();
  }
  res.redirect("/login");
};

router.use("/", require("./main"));
router.use("/login", require("./login"));
router.use("/admin", isAdmin, require("./admin"));

module.exports = router;
