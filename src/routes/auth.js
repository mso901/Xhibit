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
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzUxZmVjZmZjMmViYWYxZjBlZjM3OSIsIm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNzE0NzYyODMyLCJleHAiOjE3MTQ4NDkyMzJ9.7DNYMEMw19NMa32xecja7rKjJ8uYVvA8Z_QKzRHx8v0";

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
