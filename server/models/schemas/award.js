/** @format */

const { Schema } = require("mongoose");

const AwardSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
    agency: {
      type: String,
    },
    awardDate: {
      type: String,
    },
    // 소프트 삭제를 위한 isDeleted 필드 추가
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = AwardSchema;
