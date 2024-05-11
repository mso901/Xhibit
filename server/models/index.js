const mongoose = require("mongoose");
const UserSchema = require("./schemas/user");
const EducationSchema = require("./schemas/education");
const AwardSchema = require("./schemas/award");
const CertificateSchema = require("./schemas/certificate");
const ProjectSchema = require("./schemas/project");

exports.User = mongoose.model("User", UserSchema);
exports.Education = mongoose.model("Education", EducationSchema);
exports.Award = mongoose.model("Award", AwardSchema);
exports.Certificate = mongoose.model("Certificate", CertificateSchema);
exports.Project = mongoose.model("Project", ProjectSchema);
