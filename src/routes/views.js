const express = require("express");
const path = require("path");

const router = express.Router();

router.use("/", serveStatic("main"));
router.use("/signup", serveStatic("signUp"));
router.use("/signin", serveStatic("signIn"));
router.use("/otherspage", serveStatic("othersPage"));
router.use("/mypage", serveStatic("myPage"));
router.use("/welcomePage", serveStatic("welcomePage"));

function serveStatic(resource) {
  const resourcePath = path.join(__dirname, `/views/${resource}`);
  const option = { index: `${resource}.html` };

  return express.static(resourcePath, option);
}

module.exports = router;
