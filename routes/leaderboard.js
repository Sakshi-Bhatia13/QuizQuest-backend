const express = require("express");
const router = express.Router();
const lboardModel = require("../models/leaderboard");

router.post("/postleader", async (req, res) => {
  try {
    const userData = new lboardModel(req.body);
    await userData.save();
    console.log("Successfully saved data");
    res.send("Data sent successfully");
  } catch (err) {
    console.error("Data loading to database failed for:", err);
    res.status(400).send({ message: "Error saving data" });
  }
});

router.get("/getleader", async (req, res) => {
  try {
    const data = await lboardModel.find({});
    console.log("Successfully fetched data:", data);
    res.send({ result: data });
  } catch (err) {
    console.error("Error fetching leaderboard data:", err);
    res.status(400).send({ message: "Error fetching data" });
  }
});

module.exports = router;
