/**
 * @file auth.controller.js
 * @description Minimal auth controller exposing only:
 *   - register
 *   - login
 *   - logout
 *   - refreshAccessToken
 *
 * This version uses your local defaults (no DI). If you later want DI,
 * convert top-level constants to use injected deps.
 *
 * Expected userService shape:
 * - findUser({ filter })
 * - createUser({ newUserData })
 * - updateUser({ id, updateBody })
 *
 * Expected jwt util exports:
 * - generateAuthTokens({ payload }) -> { accessToken, refreshToken, accessExpiresAt, refreshExpiresAt }
 * - generateToken({ payload }) -> token
 * - verifyToken({ token, secret }) -> decodedPayload
 *
 * Environment variables:
 * - JWT_REFRESH_SECRET (for refresh token verification)
 * - JWT_SECRET (used by generateToken fallback)
 */

import { userServiceInstance } from "../services/user.service.js";
import { appError } from "../utils/appError.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import status from "../utils/httpStatus.js";
import { generateAuthTokens, generateToken, verifyToken } from "../utils/jwt.js";

/* Local aliases for clarity (previously used DI names) */
const userService = userServiceInstance;
const makeAppError = appError;
const hashPasswordFn = hashPassword;
const comparePasswordFn = comparePassword;
const httpStatus = status;
const generateAuthTokensFn = generateAuthTokens;
const generateTokenFn = generateToken;
const verifyTokenFn = verifyToken;

/**
 * register
 * - Creates a new user and returns a single token (useful for signup flows).
 * - Keep payload minimal (uid) in token.
 */
const register = async (req, res, next) => {
  try {
    const { email, user_name, password } = req.body;

    if (!email || !user_name || !password) {
      return next(makeAppError("email, user_name and password are required.", 400));
    }

    // Check existing user by email or username
    const existingUser = await userService.findUser({
      filter: { $or: [{ email }, { user_name }] },
    });

    if (existingUser) {
      return next(makeAppError("A user with this email or user name already exists.", 409));
    }

    const hashed = await hashPasswordFn({ value: password });

    const newUserBody = {
      ...req.body,
      password: hashed,
    };

    const newUser = await userService.createUser({ newUserData: newUserBody });

    if (!newUser) {
      return next(makeAppError(httpStatus["500_MESSAGE"] + " Failed to create user.", 500));
    }

    // Return a simple token (not full auth tokens). Consumers can call login to get access/refresh.
    const token = await generateTokenFn({ payload: { uid: newUser._id } , secret: process.env.JWT_SECRET });

    if (!token) {
      return next(makeAppError(httpStatus["500_MESSAGE"] + " Failed to generate token.", 500));
    }

    return res.status(201).json({
      message: httpStatus["201_MESSAGE"],
      token,
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    return next(error);
  }
};

/**
 * login
 * - Validates credentials
 * - Issues access + refresh tokens via jwtUtil.generateAuthTokens
 * - Stores refresh token on user record (rotation)
 */
const login = async (req, res, next) => {
  try {
    const { email, user_name, password } = req.body;

    if (!password) {
      return next(makeAppError("Password is required.", 400));
    }
    if (!email && !user_name) {
      return next(makeAppError("Email or username is required.", 400));
    }

    const user = await userService.findUser({
      filter: {
        $or: [
          email ? { email } : null,
          user_name ? { user_name } : null,
        ].filter(Boolean),
      },
    });

    if (!user) {
      return next(makeAppError("Invalid email, username or password credentials.", 401));
    }

    const isMatch = await comparePasswordFn({ rawValue: password, hashedValue: user.password });
    if (!isMatch) {
      return next(makeAppError("Invalid email, username or password credentials.", 401));
    }

    // Generate tokens
    const tokens = await generateAuthTokensFn({
      payload: { uid: user._id },
      accessSecret:process.env.JWT_SECRET,
      refreshSecret:process.env.JWT_REFRESH_SECRET,
    });

    if (!tokens?.accessToken || !tokens?.refreshToken) {
      return next(makeAppError(httpStatus["500_MESSAGE"] + " Failed to generate token.", 500));
    }

    // Save refresh token (rotation)
    await userService.updateUser({
      id: user._id,
      updateBody: { refreshToken: tokens.refreshToken },
    });

    return res.status(200).json({
      message: httpStatus["200_MESSAGE"] + " Login successful.",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return next(error);
  }
};

/**
 * logout
 * - Clears refreshToken from user record (server-side logout)
 */
const logout = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return next(makeAppError("Not authenticated.", 401));

    await userService.updateUser({
      id: user._id,
      updateBody: { refreshToken: null },
    });

    return res.status(200).json({
      message: httpStatus["200_MESSAGE"] + " Logout successful.",
    });
  } catch (error) {
    console.error("logout error:", error);
    return next(error);
  }
};

/**
 * refreshAccessToken
 * - Accepts refreshToken in body (or cookie if consumer chooses)
 * - Verifies refresh token and ensures it matches stored refreshToken on user
 * - Issues new access + refresh tokens, persists rotated refresh token
 */
const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(makeAppError("Refresh token required.", 400));

    // Verify refresh token
    const decoded = await verifyTokenFn({ token: refreshToken, secret: process.env.JWT_REFRESH_SECRET });

    const user = await userService.findUser({ filter: { _id: decoded.uid } });
    if (!user || user.refreshToken !== refreshToken) {
      return next(makeAppError("Invalid refresh token.", 403));
    }

    // Generate new tokens (rotation)
    const tokens = await generateAuthTokensFn({
      payload: { uid: user._id },
      accessSecret:process.env.JWT_SECRET,
      refreshSecret:process.env.JWT_REFRESH_SECRET,
    });

    if (!tokens?.accessToken || !tokens?.refreshToken) {
      return next(makeAppError(httpStatus["500_MESSAGE"] + " Failed to generate token.", 500));
    }

    // Rotate stored refresh token
    await userService.updateUser({ id: user._id, updateBody: { refreshToken: tokens.refreshToken } });

    return res.status(200).json({
      message: "Access token refreshed successfully.",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return next(makeAppError("Invalid or expired refresh token.", 401));
  }
};

export {
  register,
  login,
  logout,
  refreshAccessToken,
};
