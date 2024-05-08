const jwt = require("jsonwebtoken");

function jwtAuthenticationMiddleware(req, res, next) {
	console.log("쿠키 확인", req.cookies);
	let authCookie = "";
	console.log(authCookie);
	authCookie = req.cookies["jwt"];
	console.log("쿠키 다시 확인", authCookie);
	if (!authCookie) {
		console.log("헬로우");
		return res.sendStatus(401);
	}

	jwt.verify(authCookie, "elice", (err, user) => {
		if (err) return res.sendStatus(403);
		next();
	});
	// passport.authenticate("jwt", { session: false }, (err, user) => {
	//   if (err) {
	//     console.log("에러");
	//     return next(err);
	//   }
	//   if (!user) {
	//     console.log("유저 없음");
	//     return res.status(401).end();
	//   }
	//   // 인증된 사용자가 있으면 요청 객체에 사용자 정보를 추가합니다.
	//   req.user = user;
	//   next();
	// })(req, res, next);
}

module.exports = jwtAuthenticationMiddleware;
