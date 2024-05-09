const { Router } = require("express");
const { User, Certificate } = require("../models");
const ObjectId = require("mongoose").Types.ObjectId;
const loginRequired = require("../middleware/login-required");
const router = Router();

// 자격증 조회
router.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params; // 유저 아이디 받아온다.
    // console.log(userId);
    const objectUserId = new ObjectId(userId); // find 하기 위해서 objectId 형식으로 변경해야됨
    // console.log(objectUserId);
    const get_certificate = await Certificate.find({
      user: objectUserId,
    }).lean(); // lean() 사용시 간략하게 출력
    res.json(get_certificate);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 자격증 추가
router.post("/:userId", loginRequired, async (req, res, next) => {
  try {
    const { userId } = req.params; // 유저 아이디 받아온다.
    const { name, agency, licenseDate } = req.body; // 프론트에서 받아온 데이터
    // console.log(userId);
    const user = await User.findById(userId).lean(); // lean() 사용시 간략하게 출력, findById는 _id 받아올 때 사용
    // console.log(user);
    const add_certificate = await Certificate.create({
      user: user._id,
      name,
      agency,
      licenseDate,
    });
    res.json(add_certificate);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 자격증 수정
router.patch("/:certificateId", loginRequired, async (req, res, next) => {
  try {
    const { certificateId } = req.params; // 자격증 아이디 받아온다.
    const { name, agency, licenseDate } = req.body; // 프론트에서 받아온 데이터

    const certificate = await Certificate.findById(certificateId).lean(); // lean() 사용시 간략하게 출력, findById는 _id 받아올 때 사용
    console.log(certificate);
    const update_certificate = await Certificate.updateOne(
      { _id: certificate._id }, // 자격증 아이디를 찾아서
      {
        $set: {
          //네임, 에이전시, 자격증 날짜 업데이트
          name,
          agency,
          licenseDate,
        },
      }
    );
    res.json(update_certificate);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 자격증 삭제
router.delete("/:certificateId", loginRequired, async (req, res, next) => {
  try {
    const { certificateId } = req.params; // 자격증 아이디 받아온다.

    const certificate = await Certificate.findById(certificateId).lean(); // lean() 사용시 간략하게 출력, findById는 _id 받아올 때 사용
    console.log(certificate);
    const delete_certificate = await Certificate.deleteOne({
      _id: certificate._id,
    }); // 자격증 아이디를 찾아서 삭제
    res.json(delete_certificate);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
