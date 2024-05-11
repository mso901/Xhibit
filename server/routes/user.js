const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, Education, Award, Certificate, Project } = require("../models");
const ObjectId = require("mongoose").Types.ObjectId;
const loginRequired = require("../middleware/login-required");

const router = express.Router();

// 유저 로그인
router.post("/signin", async (req, res, next) => {
  try {
    // 아까 local로 등록한 인증과정 실행
    passport.authenticate("local", (passportError, user, info) => {
      console.log(user);
      // 인증이 실패했거나 유저 데이터가 없다면 에러 발생
      if (passportError || !user) {
        res.status(400).json({ message: info.reason });
        return;
      }
      // 유저 삭제 시
      if (user.isDeleted) {
        res.status(409).end();
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
        // ====================================쿠키보내지 않고 sessionStroage사용 테스트
        // console.log("토큰", token);
        // res.cookie("jwt", token, {
        //   path: "/",
        //   // 쿠키가 적용되는 경로 지정, 기본값 '/'이며 모든 경로에 쿠키 사용 가능
        //   httpOnly: true,
        //   // 기본값 false, true인경우 클라이언트에서 document.cookie로 접근 X (보안 관련)
        //   secure: true,
        //   // 기본값 false, true인경우 HTTPS에서만 쿠키를 사용가능하게 만든다.
        //   sameSite: "none",
        //   // strict는 동일 출처에서만, lax는 쿠키가 일부 상황에서 다른 출처로 전송 가능,
        //   // none는 모든 경우 허용(sameSite)
        //   maxAge: 60 * 60 * 1000, // 쿠키 유효기간 이 경우는 1시간
        // }); // 쿠키 전송
        // res.setHeader("Authorization", token); // 헤더 설정

        res.status(200).json({ token, user });
        // res.status(200).end();
      });
    })(req, res);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 유저 회원가입
router.post("/signup", async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // 공백 입력시 에러 발생
    if (!email || !name || !password) {
      return res.status(400).end();
    }

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "해당 이메일은 이미 사용 중입니다." });
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

// //유저 로그아웃 - 세션 방식으로 변경해서 사용하지 않는다.
// router.post("/logout", (req, res) => {
//   try {
//     res.clearCookie("jwt", {
//       path: "/",
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//     });
//     res.send("success");
//   } catch (error) {
//     console.error(error);
//   }
// });

// 메인 페이지 유저 리스트
router.get("/", async (req, res, next) => {
  try {
    const user = await User.find(
      {},
      { email: 1, name: 1, introduce: 1, isDeleted: 1 }
    ).lean();

    // console.log(user);
    res.json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 유저 상세 포트폴리오
router.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectUserId = new ObjectId(userId);

    const user = await User.find(
      { _id: objectUserId },
      { email: 1, name: 1, introduce: 1, isDeleted: 1 }
    );

    const education = await Education.find({ user: objectUserId }).lean();
    const award = await Award.find({ user: objectUserId }).lean();
    const certificate = await Certificate.find({ user: objectUserId }).lean();
    const project = await Project.find({ user: objectUserId }).lean();

    res.json({ user, education, award, certificate, project });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 비밀번호 변경
router.patch(
  "/changepassword/:userId",
  loginRequired,
  async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const { userId } = req.params;

      const user = await User.findById(userId);
      // console.log("유저", user);

      // 현재 비밀번호가 맞는지 확인
      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );
      // console.log("비번 확인", passwordMatch);
      if (!passwordMatch) {
        return res
          .status(400)
          .json({ message: "현재 비밀번호가 일치하지 않습니다." });
      }

      // 새 비밀번호로 변경
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            password: hashedNewPassword,
          },
        }
      );

      res
        .status(200)
        .json({ message: "비밀번호가 성공적으로 변경되었습니다." });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

// 자기소개 변경
router.patch(
  "/changeIntroduce/:userId",
  loginRequired,
  async (req, res, next) => {
    try {
      const { newIntroduce } = req.body;
      const { userId } = req.params;
      const user = await User.findById(userId);
      // console.log("유저", user);

      // 자기소개 문구 변경
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            introduce: newIntroduce,
          },
        }
      );

      res
        .status(200)
        .json({ message: "자기소개가 성공적으로 변경되었습니다." });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

// 유저 임시 삭제
router.post("/softdelete/:userId", async (req, res, next) => {
  try {
    const { currentPassword } = req.body;
    const { userId } = req.params;

    const objectUserId = new ObjectId(userId);
    const user = await User.findById(userId);

    // 현재 비밀번호가 맞는지 확인
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    // console.log("비번 확인", passwordMatch);
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "현재 비밀번호가 일치하지 않습니다." });
    }

    const delete_user = await User.findOneAndUpdate(
      { _id: objectUserId._id },
      { isDeleted: true }
    );
    res.json(delete_user);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
