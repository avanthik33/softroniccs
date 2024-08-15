const express = require("express");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validatePassword, hashPassword } = require("../utils");
const AdminModel = require("../models/AdminModel");

const router = express.Router();

//user singup
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.json({
        status: "error",
        message: "missing input field",
      });
    }

    existingUser = await UserModel.findOne({
      username: username,
    });
    if (existingUser) {
      return res.json({
        status: "error",
        message: "user already exists",
      });
    }
    const validatePass = await validatePassword(password);
    if (validatePass !== true) {
      return res.json({
        status: "error",
        message: validatePass,
      });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new UserModel({
      username,
      password: hashedPassword,
    });
    await newUser.save();
    return res.json({
      status: "success",
      message: "successfully created account",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "internal server error",
      error: error.message,
    });
  }
});

//user/admin singin
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.json({
        status: "error",
        message: "missing input field",
      });
    }
    const existingAdmin = await AdminModel.findOne({ username: username });
    if (existingAdmin) {
      const adminPassword = existingAdmin.password;
      if (adminPassword !== password) {
        return res.json({
          status: "error",
          message: "password Error",
        });
      } else {
        jwt.sign(
          {
            username: existingAdmin.username,
            id: existingAdmin._id,
            role: existingAdmin.role,
          },
          "softroniics",
          {
            expiresIn: "1d",
          },
          (error, token) => {
            if (error) {
              return res.json({
                status: "error",
                message: "token generation error",
                error: error.message,
              });
            } else {
              return res.json({
                status: "success",
                message: "successfully loged in",
                data: existingAdmin,
                token: token,
              });
            }
          }
        );
      }
    } else {
      const existingUser = await UserModel.findOne({ username: username });
      if (!existingUser) {
        return res.json({
          status: "error",
          message: "no user found",
        });
      }
      const dbPassword = existingUser.password;
      const match = await bcrypt.compare(password, dbPassword);
      if (!match) {
        return res.json({
          status: "error",
          message: "incorrect password",
        });
      }
      jwt.sign(
        {
          username: existingUser.username,
          id: existingUser._id,
          role: existingUser.role,
        },
        "softroniics",
        { expiresIn: "1d" },
        (error, token) => {
          if (error) {
            return res.json({
              status: "error",
              message: "token generation error",
            });
          } else {
            return res.json({
              status: "success",
              message: "successfully signed in",
              data: existingUser,
              token: token,
            });
          }
        }
      );
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "internal server error",
    });
  }
});

module.exports = router;
