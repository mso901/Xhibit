const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      res.json({ result: true });
      next();
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

// // 발급된 토큰은 token1에 넣어서 검증하면됨
// const token1 =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM4ODQ2N2JiZjBiOGQ2YTAwMzU1ZWMiLCJuYW1lIjoidGVzdCIsImlhdCI6MTcxNTA2ODk0NywiZXhwIjoxNzE1MTU1MzQ3fQ.CYSOt1DFliv6nxSb4ThcftHzOBxdS4VUM1e2yvunIMg";

// jwt.verify(token1, "elice", (err, decoded) => {
//   console.log(decoded);
// });

// // 시크릿키가 다를 경우 에러케이스
// jwt.verify(token1, "elice123123", (err, decoded) => {
//   console.log(err);
// });

// //다음과 같이 임시로 권환을 확인하는 API를 만들어 봤다
// // passport.authenticate메서드를 통해 JWT를 복호화 후 권한이 있는지 확인하며 권한이 있다면 true를 반환해주는 API이다.

module.exports = router;
