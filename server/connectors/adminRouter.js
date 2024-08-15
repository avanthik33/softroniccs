const express = require("express");
const AdminModel = require("../models/AdminModel");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const router = express.Router();

router.put("/isactive/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.json({
        status: "error",
        message: "no user found",
      });
    }
    user.isActive = !user.isActive;
    user.save();
    return res.json({
      status: "success",
      message: "successfully changed is active",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
