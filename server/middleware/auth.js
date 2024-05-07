const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const loginRequired = require("./login-required");

router.post("/", loginRequired, async (req, res, next) => {
  try {
    console.log("쿠키 확인", req);
    res.status(200).end();
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
