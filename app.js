const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const logger = require("morgan");
const passport = require("passport");
const passportConfig = require("./passport");
const cors = require("cors"); // cors 설정을 편안하게 하는 패키지

const viewsRouter = require("./routes/views");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const mainRouter = require("./routes/main");
const eduRouter = require("./routes/education");
const awardRouter = require("./routes/award");
const certificateRouter = require("./routes/certificate");
const projectRouter = require("./routes/project");

const app = express();
const url = "mongodb://localhost:27017";
const dbName = "portfolio_user";

let corsOptions = {
  origin: true, // 출처 허용 옵션
  credentials: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
};
app.use(cors(corsOptions)); // cors 적용

mongoose.connect("mongodb://localhost:27017");
mongoose.set("strictQuery", false);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(viewsRouter);

app.use(passport.initialize());
passportConfig();

// db 저장
app.post("/saveData", async (req, res) => {
  try {
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db(dbName);
    const collection = db.collection("data");
    const jsonData = req.body;
    await collection.insertOne(jsonData);
    client.close();
    res.status(200).send("Data saved successfully");
  } catch (err) {
    console.error("Error occurred while processing request:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/main", mainRouter);
app.use("/education", eduRouter);
app.use("/award", awardRouter);
app.use("/certificate", certificateRouter);
app.use("/project", projectRouter);

app.listen(8080);

module.exports = app;
