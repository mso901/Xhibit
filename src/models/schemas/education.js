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
  },
  {
    timestamps: true,
  }
);

module.exports = EducationSchema;
