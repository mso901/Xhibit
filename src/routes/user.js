const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");

const router = express.Router();
/* GET users listing. */
// router.get("/", function (req, res, next) {
//   res.send("respond with a resource");
// });

router.post("/signin", async (req, res, next) => {
  try {
    // 아까 local로 등록한 인증과정 실행
    passport.authenticate("local", (passportError, user, info) => {
      // 인증이 실패했거나 유저 데이터가 없다면 에러 발생
      if (passportError || !user) {
        res.status(400).json({ message: info.reason });
        return;
      }
      // user데이터를 통해 로그인 진행
      req.login(user, { session: false }, (loginError) => {
        if (loginError) {
          res.send(loginError);
          return;
        }
        // 클라이언트에게 JWT생성 후 반환
        const token = jwt.sign(
          { _id: user.id, name: user.name }, //맞는지 확인할려고 name까지 넣음 , elice시크릿 키 같은 경우 .dev 사용해야될듯
          "elice",
          {
            expiresIn: "24h",
          }
        );
        console.log("토큰", token);
        // res.cookie("jwt", token, {
        //   path: "/", // 쿠키가 적용되는 경로 지정, 기본값 '/'이며 모든 경로에 쿠키 사용 가능
        //   httpOnly: true, // 기본값 false, true인경우 클라이언트에서 document.cookie로 접근 X (보안 관련)
        //   secure: true, // 기본값 false, true인경우 HTTPS에서만 쿠키를 사용가능하게 만든다.
        //   sameSite: "none",
        //   // strict는 동일 출처에서만, lax는 쿠키가 일부 상황에서 다른 출처로 전송 가능, none는 모든 경우 허용(sameSite)
        //   maxAge: 60 * 60 * 1000, // 쿠키 유효기간 이 경우는 1시간
        // }); // 쿠키 전송

        res.status(200).json({ token });
        // res.status(200).end();
      });
    })(req, res);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 회원가입
router.post("/signup", async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!email || !name || !password) {
      return res.status(400).end();
    }

    const user = await User.create({
      email,
      name,
      password: hashedPassword,
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
