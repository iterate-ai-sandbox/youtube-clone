require("dotenv").config();
require("../Database/database");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userData = require("../Models/user");
const auth = express.Router();
const nodemailer = require("nodemailer");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
} = require("../lib/tokens");

auth.use(cookieParser());

auth.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const availableAccessToken = req.cookies?.accessToken;
    const availableRefreshToken = req.cookies?.refreshToken;

    if (availableAccessToken || availableRefreshToken) {
      return res.status(400).json({
        message: "You are already logged in",
      });
    }

    const user = await userData.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "USER ALREADY EXISTS",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 11);
    const saveData = new userData({
      name,
      email,
      password: hashedPassword,
    });
    await saveData.save();

    //Create access token
    const accessToken = generateAccessToken(saveData);
    const refreshToken = generateRefreshToken(saveData);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: false,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        partitioned: true,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: false,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        partitioned: true,
      })
      .status(201)
      .json({
        message: "REGISTRATION SUCCESSFUL",
      });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

auth.post("/login", async (req, res) => {
  try {
    const { email1, password1 } = req.body;
    const availableAccessToken = req.cookies?.accessToken;
    const availableRefreshToken = req.cookies?.refreshToken;

    if (availableAccessToken || availableRefreshToken) {
      return res.status(400).json({
        message: "You are already logged in",
      });
    }

    const user = await userData.findOne({ email: email1 });
    if (!user) {
      return res.status(404).json({
        message: "USER DOESN'T EXIST",
      });
    }

    const userPassword = user.password;
    const checkPassword = await bcrypt.compare(password1, userPassword);
    if (checkPassword) {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        const newRefreshToken = generateRefreshToken(user);
        const accessToken = generateAccessToken(user);
        res
          .cookie("refreshToken", newRefreshToken, {
            httpOnly: false,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
            partitioned: true,
          })
          .cookie("accessToken", accessToken, {
            httpOnly: false,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
            partitioned: true,
          });
        user.refreshToken = newRefreshToken;
        await user.save();
      } else {
        const accessToken = generateAccessToken(user);
        res.cookie("accessToken", accessToken, {
          httpOnly: false,
          sameSite: "none",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
          partitioned: true,
        });
      }
      return res.status(200).json({
        message: "LOGIN SUCCESSFUL",
      });
    } else {
      res.status(401).json({
        message: "INVALID CREDENTIALS",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

auth.post("/resetlink", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userData.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "USER DOESN'T EXIST",
      });
    }

    const resetToken = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "30m",
    });
    const resetLink = `${process.env.BACKEND_URL}/${user?._id}/${resetToken}`;
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

auth.get("/logout", (req, res) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;
    if (!accessToken || !refreshToken) {
      return res.status(400).json({
        success: false,
        message: "You are not logged in",
      });
    }

    res.clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
      partitioned: true,
    });
    res.clearCookie("refreshToken", {
      sameSite: "none",
      secure: true,
      partitioned: true,
    });
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

auth.get("/userdata", async (req, res) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;
    if (!accessToken || !refreshToken) {
      return res.status(400).json({
        success: false,
        message: "You are not logged in",
      });
    }

    const userdata = verifyAccessToken(accessToken);
    const user = await userData.findById(userdata?.id).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = auth;
