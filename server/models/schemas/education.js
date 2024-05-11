/** @format */

const { Schema, Types } = require("mongoose");

const EducationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    school: {
      type: String,
      required: true,
    },
    major: {
      type: String,
    },
    periodStart: {
      type: String,
      required: true,
    },
    periodEnd: {
      type: String,
      required: true,
    },
    // 소프트 삭제를 위한 isDeleted 필드 추가
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = EducationSchema;
