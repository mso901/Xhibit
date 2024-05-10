const { Router } = require("express");
const { User, Certificate } = require("../models");
const ObjectId = require("mongoose").Types.ObjectId;
const loginRequired = require("../middleware/login-required");
const router = Router();

// 자격증 조회
router.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectUserId = new ObjectId(userId);

    const get_certificate = await Certificate.find({
      user: objectUserId,
    }).lean();
    res.json(get_certificate);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 자격증 추가
router.post("/:userId", loginRequired, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, agency, licenseDate } = req.body;

    const user = await User.findById(userId);
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
    const { certificateId } = req.params;
    const { name, agency, licenseDate } = req.body;

    const certificate = await Certificate.findById(certificateId);

    const update_certificate = await Certificate.updateOne(
      { _id: certificate._id },
      {
        $set: {
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
router.post(
  "/softdelete/:certificateId",
  loginRequired,
  async (req, res, next) => {
    try {
      const { certificateId } = req.params;

      const certificate = await Certificate.findById(certificateId);

      const delete_certificate = await Certificate.findOneAndUpdate(
        { _id: certificate._id },
        { isDeleted: true }
      );
      res.json(delete_certificate);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

module.exports = router;
