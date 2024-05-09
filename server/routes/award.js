const { Router } = require("express");
const { User, Award } = require("../models");
const ObjectId = require("mongoose").Types.ObjectId;
const loginRequired = require("../middleware/login-required");
const router = Router();

// 상 조회
router.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params; // 유저 아이디 받아온다.
    // console.log(userId);
    const objectUserId = new ObjectId(userId); // find 하기 위해서 objectId 형식으로 변경해야됨
    // console.log(objectUserId);
    const get_award = await Award.find({ user: objectUserId }).lean(); // lean() 사용시 간략하게 출력
    res.json(get_award);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 상 추가
router.post("/:userId", loginRequired, async (req, res, next) => {
  try {
    const { userId } = req.params; // 유저 아이디 받아온다.
    const { name, agency, awardDate } = req.body; // 프론트에서 받아온 데이터
    // console.log(userId);
    const user = await User.findById(userId).lean(); // lean() 사용시 간략하게 출력, findById는 _id 받아올 때 사용
    // console.log(user);
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
    const { awardId } = req.params; // 상 아이디 받아온다.
    const { name, agency, awardDate } = req.body; // 프론트에서 받아온 데이터

    const award = await Award.findById(awardId).lean(); // lean() 사용시 간략하게 출력, findById는 _id 받아올 때 사용
    console.log(award);
    const update_award = await Award.updateOne(
      { _id: award._id }, // 어워드 아이디를 찾아서
      {
        $set: {
          //네임, 에이전시, 어워드 날짜 업데이트
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
router.delete("/:awardId", loginRequired, async (req, res, next) => {
  try {
    const { awardId } = req.params; // 상 아이디 받아온다.

    const award = await Award.findById(awardId).lean(); // lean() 사용시 간략하게 출력, findById는 _id 받아올 때 사용
    console.log(award);
    const delete_award = await Award.deleteOne({ _id: award._id }); // 어워드 아이디를 찾아서 삭제
    res.json(delete_award);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
