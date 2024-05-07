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
  },
  {
    timestamps: true,
  }
);

module.exports = UserSchema;
