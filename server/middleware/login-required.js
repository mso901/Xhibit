const passport = require("passport");

function jwtAuthenticationMiddleware(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).end();
    }
    // 인증된 사용자가 있으면 요청 객체에 사용자 정보를 추가합니다.
    req.user = user;
    next();
  })(req, res, next);
}

module.exports = jwtAuthenticationMiddleware;
