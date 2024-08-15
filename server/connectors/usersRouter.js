const express = require("express");
const UserModel = require("../models/UserModel");

const router = express.Router();

router.get("/viewAllUsers", async (req, res) => {
  try {
    const data = await UserModel.find();
    if (!data) {
      return res.json({
        status: "error",
        message: "no data found",
      });
    }
    return res.json({
      status: "success",
      message: "successfully fetched the datas",
      data: data,
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
