/** @format */

const { Schema } = require("mongoose");

const ProjectSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    link: {
      type: String,
    },
    name: {
      type: String,
    },
    contentTitle: {
      type: String,
    },
    contentDetail: {
      type: [String],
    },
    techStack: {
      type: [String],
    },
    periodStart: {
      type: String,
    },
    periodEnd: {
      type: String,
    },
    // 소프트 삭제를 위한 isDeleted 필드 추가
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = ProjectSchema;
