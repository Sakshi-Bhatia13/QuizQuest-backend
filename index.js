const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const app = express();

const indexRouter = require("./routes/home");
const usersRouter = require("./routes/user");
const authRouter = require("./routes/auth/userAuth");
const quizRouter = require("./routes/quiz");
const lboardRouter = require("./routes/leaderboard");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port : ${PORT}`));
  })
  .catch((error) => console.error(`MongoDB connection error: ${error}`));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/userAuth", authRouter);
app.use("/quiz", quizRouter);
app.use("/lboard", lboardRouter);