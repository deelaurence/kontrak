const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name cannot be empty"],
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: [true, "email cannot be empty"],
    unique: [true, "email already registered"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ],
  },
  password: {
    type: String,
    required: [true, "name cannot be empty"],
    minlength: 6,
  },
});
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.generateJWT = function (signature) {
  return jwt.sign({ id: this._id, name: this.name }, signature);
};
UserSchema.methods.comparePassword = async function (passwordInput) {
  return await bcrypt.compare(passwordInput, this.password);
};
module.exports = mongoose.model("user", UserSchema);
