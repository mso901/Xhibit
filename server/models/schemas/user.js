/** @format */

const { Schema } = require("mongoose");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    introduce: {
      type: String,
      default: "자기소개를 적어주세요!",
    },
    // 소프트 삭제를 위한 isDeleted 필드 추가
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = UserSchema;
