const mongoose = require("mongoose");

const AdminModel = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  },
});

module.exports = mongoose.model("Admins", AdminModel);
