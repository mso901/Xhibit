const { Router } = require("express");
const { User, Certificate } = require("../models");
const ObjectId = require("mongoose").Types.ObjectId;

const router = Router();

// 자격증 조회
router.get("/:user_id", async (req, res, next) => {
  try {
    const { user_id } = req.params; // 유저 아이디 받아온다.
    // console.log(user_id);
    const objectUserId = new ObjectId(user_id); // find 하기 위해서 objectId 형식으로 변경해야됨
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
router.post("/:user_id", async (req, res, next) => {
  try {
    const { user_id } = req.params; // 유저 아이디 받아온다.
    const { name, agency, licenseDate } = req.body; // 프론트에서 받아온 데이터
    // console.log(user_id);
    const user = await User.findById(user_id).lean(); // lean() 사용시 간략하게 출력, findById는 _id 받아올 때 사용
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
router.patch("/:certificate_id", async (req, res, next) => {
  try {
    const { certificate_id } = req.params; // 자격증 아이디 받아온다.
    const { name, agency, licenseDate } = req.body; // 프론트에서 받아온 데이터

    const certificate = await Certificate.findById(certificate_id).lean(); // lean() 사용시 간략하게 출력, findById는 _id 받아올 때 사용
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
router.delete("/:certificate_id", async (req, res, next) => {
  try {
    const { certificate_id } = req.params; // 자격증 아이디 받아온다.

    const certificate = await Certificate.findById(certificate_id).lean(); // lean() 사용시 간략하게 출력, findById는 _id 받아올 때 사용
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
