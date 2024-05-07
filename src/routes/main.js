const { Router } = require("express");
const { User } = require("../models");
const { Education } = require("../models");
const { Award } = require("../models");
const { Certificate } = require("../models");
const { Project } = require("../models");


const router = Router();

// 메인 페이지
router.get("/", async (req, res, next) => {
  try {
    const user = await User.find({}, { email: 1, name: 1, introduce: 1 });
    res.json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 유저 상세 포트폴리오
router.get("/:user_id", async (req, res, next) => {
  try {
    const { user_id } = req.params;
    console.log(user_id);
    const user = await User.find({}, { email: 1, name: 1, introduce: 1 });
    const education = await Education.find({}, { school: 1, major: 1, periodStart: 1, periodEnd: 1 });
    const award = await Award.find({}, { name: 1, agency: 1, awardDate: 1 });
    const certificate = await Certificate.find({}, { name: 1, agency: 1, licenseDate: 1 });
    const project = await Project.find({}, { link: 1, name: 1, contentTitle: 1, contentDetail: 1, techStack: 1, periodStart: 1, periodEnd: 1 });
    res.json([user,education,award,certificate,project]);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
