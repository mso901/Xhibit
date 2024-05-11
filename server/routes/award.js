const { Router } = require("express");
const { User, Award } = require("../models");
const ObjectId = require("mongoose").Types.ObjectId;
const loginRequired = require("../middleware/login-required");
const router = Router();

// 상 조회
router.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectUserId = new ObjectId(userId); // find 하기 위해서 objectId 형식으로 변경해야됨

    const get_award = await Award.find({ user: objectUserId }).lean();
    res.json(get_award);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 상 추가
router.post("/:userId", loginRequired, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, agency, awardDate } = req.body;

    const user = await User.findById(userId);

    const add_award = await Award.create({
      user: user._id,
      name,
      agency,
      awardDate,
    });
    res.json(add_award);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 상 수정
router.patch("/:awardId", loginRequired, async (req, res, next) => {
  try {
    const { awardId } = req.params;
    const { name, agency, awardDate } = req.body;

    const award = await Award.findById(awardId);

    const update_award = await Award.updateOne(
      { _id: award._id },
      {
        $set: {
          name,
          agency,
          awardDate,
        },
      }
    );
    res.json(update_award);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 상 삭제
router.post("/softdelete/:awardId", loginRequired, async (req, res, next) => {
  try {
    const { awardId } = req.params;

    const award = await Award.findById(awardId);

    const delete_award = await Award.findOneAndUpdate(
      { _id: award._id },
      { isDeleted: true }
    );
    res.json(delete_award);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
