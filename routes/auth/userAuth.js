const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../../models/User");
const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

//signup user
router.post("/register", async (req, res) => {
  const emailExist = await userModel.findOne({ email: req.body.email });
  if (emailExist) {
    res.status(400).send("Email already exists!");
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new userModel({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const { error } = await registerSchema.validateAsync(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    } else {
      const saveUser = await user.save();
      res.status(200).send("User Created Successfully!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

//Login
router.post("/login", async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email doesn't exist!");
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Password isn't matching!");

  try {
    const { error } = await loginSchema.validateAsync(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    else {
      const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);
      res.header("authentication_token", token).send({ authentication_token: token, user });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
