const { Router } = require("express");
const { User, Education } = require("../models");
const ObjectId = require("mongoose").Types.ObjectId;
const loginRequired = require("../middleware/login-required");
const router = Router();

// 학력 조회
router.get("/:userId", async (req, res, next) => {
	try {
		const { userId } = req.params;
		const objectUserId = new ObjectId(userId);

		const get_education = await Education.find({ user: objectUserId }).lean();
		res.json(get_education);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// 학력 추가
router.post("/:userId", loginRequired, async (req, res, next) => {
	try {
		const { userId } = req.params;
		const { school, major, periodStart, periodEnd } = req.body;
		// console.log(userId);
		const user = await User.findById(userId);

		const add_education = await Education.create({
			user: user._id,
			school,
			major,
			periodStart,
			periodEnd,
		});
		res.json(add_education);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// 학력 수정
router.patch("/:educationId", loginRequired, async (req, res, next) => {
	try {
		const { educationId } = req.params;
		const { school, major, periodStart, periodEnd } = req.body;

		const education = await Education.findById(educationId);

		const update_education = await Education.updateOne(
			{ _id: education._id },
			{
				$set: {
					school,
					major,
					periodStart,
					periodEnd,
				},
			}
		);
		res.json(update_education);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// 학력 삭제
router.post(
	"/softdelete/:educationId",
	loginRequired,
	async (req, res, next) => {
		try {
			const { educationId } = req.params;

			const education = await Education.findById(educationId);
			// console.log(education);
			const delete_education = await Education.findOneAndUpdate(
				{ _id: education._id },
				{ isDeleted: true }
			);
			res.json(delete_education);
		} catch (error) {
			console.error(error);
			next(error);
		}
	}
);

module.exports = router;
