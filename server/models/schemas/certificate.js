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
  },
  {
    timestamps: true,
  }
);

module.exports = CertificateSchema;
