const { Router } = require("express");
const { User, Project } = require("../models");
const ObjectId = require("mongoose").Types.ObjectId;
const loginRequired = require("../middleware/login-required");

const router = Router();

// 프로젝트 조회
router.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectUserId = new ObjectId(userId);

    const get_project = await Project.find({ user: objectUserId }).lean();
    res.json(get_project);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 프로젝트 추가
router.post("/:userId", loginRequired, async (req, res, next) => {
  try {
    const { userId } = req.params;

    const {
      name,
      link,
      contentTitle,
      contentDetail,
      techStack,
      periodStart,
      periodEnd,
    } = req.body;

    const user = await User.findById(userId);

    const add_project = await Project.create({
      user: user._id,
      name,
      link,
      contentTitle,
      contentDetail,
      techStack,
      periodStart,
      periodEnd,
    });
    res.json(add_project);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 프로젝트 수정
router.patch("/:projectId", loginRequired, async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const {
      name,
      link,
      contentTitle,
      contentDetail,
      techStack,
      periodStart,
      periodEnd,
    } = req.body;

    const project = await Project.findById(projectId);
    // console.log(project);

    const update_project = await Project.updateOne(
      { _id: project._id },
      {
        $set: {
          name,
          link,
          contentTitle,
          contentDetail,
          techStack,
          periodStart,
          periodEnd,
        },
      }
    );
    res.json(update_project);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 학력 삭제
router.post("/softdelete/:projectId", loginRequired, async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    const delete_project = await Project.findOneAndUpdate(
      { _id: project._id },
      { isDeleted: true }
    );
    res.json(delete_project);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
