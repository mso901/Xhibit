//로그인 기능을 구현하기 위해 우선 passport에 구현할 인증 기능을 설정 후 등록해줘야 한다.
const passport = require("passport"); //passport 미들웨어 등록하기 위한 passport 모듈
const { Strategy: LocalStrategy } = require("passport-local"); // 사용자 인증 구현할 Strategy(나중에 JWT의 Strategy와 이름이 겹쳐서 다른이름 선언)
const bcrypt = require("bcrypt"); // 해쉬된 비밀번호 비교

// const mongoose = require("mongoose");

const { User } = require("../models"); // sequelize의 user 모델

const { ExtractJwt, Strategy: JWTStrategy } = require("passport-jwt"); // JWT를 사용하기 위해 아까 작성한 passport파일에 다음 모듈을 추가한다.

// {"email": "test@test.com", "password": "test123@"}
const passportConfig = { usernameField: "email", passwordField: "password" }; //나중에 email ,password로 변경

const passportVerify = async (email, password, done) => {
  try {
    // 유저 아이디로 일치하는 유저 데이터 검색
    const user = await User.findOne({ email });
    console.log("유저 값 디비에서 가져옴 : ", user);
    // 검색된 유저 데이터가 없다면 에러 표시
    if (!user) {
      done(null, false, { reason: "존재하지 않는 사용자 입니다." });
      return;
    }
    // 검색된 유저 데이터가 있다면 유저 해쉬된 비밀번호 비교
    const compareResult = await bcrypt.compare(password, user.password);
    console.log("비번 일치시 : (true, false)", compareResult);

    // 해쉬된 비밀번호가 같다면 유저 데이터 객체 전송
    if (compareResult) {
      done(null, user);
      return;
    }
    // 비밀번호가 다를경우 에러 표시
    done(null, false, { reason: "올바르지 않은 비밀번호 입니다." });
  } catch (error) {
    console.error(error);
    done(error);
  }
};
//그리고 사용자의 인증정보를 확인하는 함수를 구현했다. 이 함수는 매개변수로 3개를 받는데 사용자의 아이디,
//비밀번호, 그리고 인증의 결과를 호출할 done이라는 함수를 받는다. done은 인자를 3개까지 받는데 첫 번째 인자는 서버에서
//발생한 에러를 넣고 두 번째 인자는 성공했을 때 반환할 값을 넣어준다.
//그리고 마지막 세 번째 인자는 사용자가 임의로 인증 실패를 만들고 싶을 때 사용하며 인증 실패한 이유를 함께 넣어줄 수 있다.

//그러니 다음 코드는 처음에 유저 아이디로 일치하는 유저 데이터를 검색한 후 검색된 유저 데이터가 없다면
//임의로 인증을 실패하도록 설정했고 검색된 유저 데이터가 있다면 받아온 비밀번호와 DB에 저장된 유저의 해쉬된 비밀번호를 비교해
//같을 경우에만 done함수의 두 번째 인자로 유저 데이터를 넣어줘서 인증에 성공시켰다.

// 똑같은 코드임
// var opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = "secret";

const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "elice",
};
//  audience: "localhost:8080",

//그리고 JWT토큰을 읽기 위해 다음 설정을 추가한다.
//jwtFromRequest는 request에서 JWT를 위치를 설정하는 명령인데 ExtractJwt의 fromHeader명령어를 통해
//header의 authorization에서 JWT를 가져올 수 있도록 설정했다.
//그리고 secretOrKey에 JWT를 복호화하기 위한 암호 키를 입력했다. (jwt-secret-key는 JWT를 생성할 때 사용한 키와 동일한 키여야 한다.)

const JWTVerify = async (jwt_payload, done) => {
  try {
    // payload의 id값으로 유저의 데이터 조회
    // const payload = "ObjectId('" + jwtPayload.id + "')";
    // console.log(payload);
    // const user = await User.findOne({
    //   where: { _id: payload },
    // });

    console.log(jwt_payload);
    console.log(typeof jwt_payload._id, jwt_payload._id);
    console.log(jwt_payload.name);
    const userId = jwt_payload._id;
    const user = await User.findById(userId);
    console.log("유저 : ", user);
    // 유저 데이터가 있다면 유저 데이터 객체 전송
    if (user) {
      done(null, user);
      return;
    }
    console.log("유저 체크 : ", user);
    // 유저 데이터가 없을 경우 에러 표시
    done(null, false, { reason: "올바르지 않은 인증정보 입니다." });
  } catch (error) {
    console.error(error);
    done(error);
  }
};

// 이제 복호화된 JWT에서 Payload(토큰의 데이터 부분)를 받아 유저의 정보를 확인하는 함수를 구현했다.
// Payload에서 가져온 유저의 id로 유저의 데이터를 조회한 후 유저 데이터가 있다면 done함수를 통해 인증을 완료했고
// 유저 데이터가 없다면 인증을 실패하도록 구현했다.

// 위에서 opts 쓴경우
// module.exports = () => {
//   passport.use("local", new LocalStrategy(passportConfig, passportVerify));
//   passport.use(
//     "jwt",
//     new JWTStrategy(opts, async (jwtPayload, done) => {
//       try {
//         // payload의 id값으로 유저의 데이터 조회
//         const user = await User.findOne({ where: { id: jwtPayload.id } });
//         // 유저 데이터가 있다면 유저 데이터 객체 전송
//         if (user) {
//           done(null, user);
//           return;
//         }
//         // 유저 데이터가 없을 경우 에러 표시
//         done(null, false, { reason: "올바르지 않은 인증정보 입니다." });
//       } catch (error) {
//         console.error(error);
//         done(error);
//       }
//     })
//   );
// };

module.exports = () => {
  passport.use("local", new LocalStrategy(passportConfig, passportVerify));
  passport.use("jwt", new JWTStrategy(JWTConfig, JWTVerify));
};
//마지막으로 LocalStrategy에 방금 생성한 passportConfig와 passportVerify를 인자로 넣어
//생성에 passport에 local이란 이름으로 등록해줬다.
