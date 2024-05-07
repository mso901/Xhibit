const { Router } = require("express");
const { User, Project } = require("../models");
const ObjectId = require("mongoose").Types.ObjectId;

const router = Router();

// 프로젝트 조회
router.get("/:user_id", async (req, res, next) => {
  try {
    const { user_id } = req.params; // 유저 아이디 받아온다.
    // console.log(user_id);
    const objectUserId = new ObjectId(user_id); // find 하기 위해서 objectId 형식으로 변경해야됨
    // console.log(objectUserId);
    const get_project = await Project.find({ user: objectUserId }).lean(); // lean() 사용시 간략하게 출력
    res.json(get_project);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 프로젝트 추가
router.post("/:user_id", async (req, res, next) => {
  try {
    const { user_id } = req.params; // 유저 아이디 받아온다.
    const {
      name,
      link,
      contentTitle,
      contentDetail,
      techStack,
      periodStart,
      periodEnd,
    } = req.body; // 프론트에서 받아온 데이터
    // console.log(user_id);
    const user = await User.findById(user_id).lean(); // lean() 사용시 간략하게 출력, findById는 _id 받아올 때 사용
    // console.log(user);
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
router.patch("/:project_id", async (req, res, next) => {
  try {
    const { project_id } = req.params; // 프로젝트 아이디 받아온다.
    const {
      name,
      link,
      contentTitle,
      contentDetail,
      techStack,
      periodStart,
      periodEnd,
    } = req.body; // 프론트에서 받아온 데이터

    const project = await Project.findById(project_id).lean(); // lean() 사용시 간략하게 출력, findById는 _id 받아올 때 사용
    console.log(project);
    const update_project = await Project.updateOne(
      { _id: project._id }, // 프로젝트 아이디를 찾아서
      {
        $set: {
          //프로젝트명, 링크, 상세제목, 상세 설명, 기술 스택,기간(시작,끝) 업데이트
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
router.delete("/:project_id", async (req, res, next) => {
  try {
    const { project_id } = req.params; // 학력 아이디 받아온다.

    const project = await Project.findById(project_id).lean(); // lean() 사용시 간략하게 출력, findById는 _id 받아올 때 사용
    console.log(project);
    const delete_project = await Project.deleteOne({
      _id: project._id,
    }); // 학력 아이디를 찾아서 삭제
    res.json(delete_project);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
