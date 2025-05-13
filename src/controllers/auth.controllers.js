import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
import bcrypt, { compare } from "bcryptjs";
import crypto from "crypto";
import { emailverificationMailGenContent, sendMail } from "../utils/mail.js";
import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";
import Mailgen from "mailgen";

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, username, fullname } = req.body;

  if (!email || !password || !username || !fullname) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  try {
    // if user is already exist?
    const axistingUser = await User.findOne({ email });
    if (axistingUser) {
      return res.status(400).json({
        message: "User already is exist",
      });
    }

    // const hashPassword = await bcrypt.hash(password, 10);

    const token = crypto.randomBytes(32).toString("hex");

    const verificationUrl = `${process.env.BASE_URL}api/v1/verify/${token}`;
    const user = await User.create({
      username,
      email,
      fullname,
      password,
      emailVerificationToken: token,
      isEmailVerified: false,
      emailVerificationExpiry: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    });

    if (!user) {
      return res.status(400).json({
        message: "User not registered",
      });
    }

    await user.save();

    await sendMail({
      email: user.email,
      subject: "Verify your Task Manager account",
      mailGenContent: emailverificationMailGenContent(
        username,
        verificationUrl,
      ),
    });

    res.status(200).json({
      user,
      success: true,
      token,
      verificationUrl,
      message: "User register successfully",
    });
  } catch (error) {
    throw new ApiError(500, " Registration Error", (error = error.message));
  }
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid  password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 100,
    };
    res.cookie("token", token, cookieOptions);

    // Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

const userEmailVerification = asyncHandler(async (req, res) => {
  const { token } = req.params;
  if (!token) {
    return res.status(400).json({
      message: "Invalid Token",
    });
  }

  try {
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(401).json({
        message: "User token is Invalid",
      });
    }

    if (user.emailVerificationExpiry < Date.now()) {
      return res.status(403).json({
        message: "Verification token is expire",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;

    user.save();

    res.status(200).json({
      user,
      success: true,
      message: "User verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

const getProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

const userLogOut = asyncHandler(async (req, res) => {
  try {
    res.cookie("token", "", {});
    res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Logout failed",
      error,
      success: false,
    });
  }
});

const refreshVerificationToken = asyncHandler(async (req, res) => {
  // find email
  // verifiy email is exist or not
  // fetch email in data base
  //  check isEmailVerified
  //  Generate new token and expiry
  // save in db
  // send mail

  const { email } = req.body;
  if (!email) {
    return res.status(401).json({
      message: "Email is required",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({
      message: "User not found",
    });
  }
  if (user.isEmailVerified) {
    res.status(400).json({
      message: "Email is already verified",
    });
  }

  const newToken = crypto.randomBytes(32).toString("hex");
  const newExpiry = Date.now() + 1000 * 60 * 60 * 24;

  user.emailVerificationToken = newToken;
  user.emailVerificationExpiry = newExpiry;

  await user.save();

  const verificationUrl = `${process.env.BASE_URL}api/v1/verify/${newToken}`;

  sendMail({
    email: user.email,
    subject: "Resent email Verification - Task Manager",
    Mailgen: emailverificationMailGenContent(user.username, verificationUrl),
  });

  res.status(200).json({
    message: "New verification email sent",
    success: true,
    verificationUrl, // you can hide this in prod
  });
  try {
  } catch (error) {
    res.status(400).json({
      success: true,
      message: "Inernal error",
      error,
    });
  }
});

export {
  registerUser,
  userEmailVerification,
  userLogin,
  userLogOut,
  getProfile,
  refreshVerificationToken,
};
