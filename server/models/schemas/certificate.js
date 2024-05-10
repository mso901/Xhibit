/** @format */

const { Schema } = require("mongoose");

const CertificateSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    agency: {
      type: String,
      required: true,
    },
    licenseDate: {
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

module.exports = CertificateSchema;
