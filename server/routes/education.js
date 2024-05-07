const { Router } = require("express");
const { User, Education } = require("../models");
const ObjectId = require("mongoose").Types.ObjectId;

const router = Router();

// 학력 조회
router.get("/:user_id", async (req, res, next) => {
  try {
    const { user_id } = req.params; // 유저 아이디 받아온다.
    // console.log(user_id);
    const objectUserId = new ObjectId(user_id); // find 하기 위해서 objectId 형식으로 변경해야됨
    // console.log(objectUserId);
    const get_education = await Education.find({ user: objectUserId }).lean(); // lean() 사용시 간략하게 출력
    res.json(get_education);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 학력 추가
router.post("/:user_id", async (req, res, next) => {
  try {
    const { user_id } = req.params; // 유저 아이디 받아온다.
    const { school, major, periodStart, periodEnd } = req.body; // 프론트에서 받아온 데이터
    // console.log(user_id);
    const user = await User.findById(user_id).lean(); // lean() 사용시 간략하게 출력, findById는 _id 받아올 때 사용
    // console.log(user);
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
router.patch("/:education_id", async (req, res, next) => {
  try {
    const { education_id } = req.params; // 학력 아이디 받아온다.
    const { school, major, periodStart, periodEnd } = req.body; // 프론트에서 받아온 데이터

    const education = await Education.findById(education_id).lean(); // lean() 사용시 간략하게 출력, findById는 _id 받아올 때 사용
    console.log(education);
    const update_education = await Education.updateOne(
      { _id: education._id }, // 학력 아이디를 찾아서
      {
        $set: {
          //학교, 전공, 기간(시작,끝) 업데이트
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
router.delete("/:education_id", async (req, res, next) => {
  try {
    const { education_id } = req.params; // 학력 아이디 받아온다.

    const education = await Education.findById(education_id).lean(); // lean() 사용시 간략하게 출력, findById는 _id 받아올 때 사용
    console.log(education);
    const delete_education = await Education.deleteOne({
      _id: education._id,
    }); // 학력 아이디를 찾아서 삭제
    res.json(delete_education);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
