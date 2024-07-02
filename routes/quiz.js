const express = require("express");
const router = express.Router();
const quizModel = require("../models/quiz");

router.get("/getQuiz", (req, res) => {
  quizModel.aggregate([{ $sample: { size: 5 } }])
    .exec()
    .then(data => {
      console.log("Get quiz data:", data);
      res.json({ result: data });
    })
    .catch(err => {
      console.error("Error fetching quiz data:", err);
      res.status(500).json({ message: "Failed to fetch quiz data" });
    });
});

router.post("/postQuiz", (req, res) => {
  const quizData = new quizModel(req.body);
  quizData.save()
    .then(() => {
      console.log("Data saved successfully");
      res.send("Data sent successfully");
    })
    .catch(err => {
      console.error("Failed to save quiz data:", err);
      res.status(400).json({ message: "Failed to save quiz data" });
    });
});

module.exports = router;
