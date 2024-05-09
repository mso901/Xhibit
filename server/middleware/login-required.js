const jwt = require("jsonwebtoken");

function jwtAuthenticationMiddleware(req, res, next) {
  let authCookie = req.cookies["jwt"];
  console.log("쿠키인증", authCookie);
  if (!authCookie) {
    return res.sendStatus(401);
  }

  jwt.verify(authCookie, "elice", (err, user) => {
    if (err) return res.sendStatus(403);
    next();
  });
}

module.exports = jwtAuthenticationMiddleware;
