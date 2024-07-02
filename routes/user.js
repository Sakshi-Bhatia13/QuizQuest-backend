const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("Responded");
});

module.exports = router;
