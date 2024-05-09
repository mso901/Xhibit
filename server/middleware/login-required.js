const jwt = require("jsonwebtoken");

// 사용자 인증 미들웨어
function jwtAuthenticationMiddleware(req, res, next) {
  let authCookie = "";
  authCookie = req.cookies["jwt"];
  if (!authCookie) {
    return res.sendStatus(401);
  }

  // JWT 토큰의 유효성을 검사
  jwt.verify(authCookie, "elice", (err, user) => {
    if (err) return res.sendStatus(403);
    next();
  });
}

module.exports = jwtAuthenticationMiddleware;
