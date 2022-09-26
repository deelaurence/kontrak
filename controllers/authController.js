require("dotenv").config();
const User = require("../models/UserModel");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequest,
  NotFound,
  Unauthenticated,
} = require("../errors/customErrors");
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await User.create(req.body);
    const token = newUser.generateJWT(process.env.JWT_SECRET);
    res
      .status(StatusCodes.CREATED)
      .json({ token, owner: newUser.name, email: newUser.email });
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(StatusCodes.CONFLICT)
        .json({ error: "email already registered" });
      return;
    }
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    console.log(StatusCodes.BAD_REQUEST, error.message);
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequest("name, email and password cannot be empty");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new NotFound("email not registered");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Unauthenticated("invalid credentials");
    }
    const token = user.generateJWT(process.env.JWT_SECRET);
    res.status(StatusCodes.OK).json({ user, token: token });
  } catch (error) {
    const { message, statusCode } = error;
    console.log(statusCode, message);
    if (statusCode) {
      res.status(statusCode).json(message);
      console.log(statusCode, message);
      return;
    }
    res.status(StatusCodes.UNAUTHORIZED).json(message);
    console.log(message);
  }
};

module.exports = { register, login };
