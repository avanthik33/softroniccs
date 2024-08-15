const mongoose = require("mongoose");

const UserModel = new mongoose.Schema({
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
    default: "user",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
});

module.exports = mongoose.model("Users", UserModel);
