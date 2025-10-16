/**
 * @file auth.middleware.js
 * @description Express middleware for authenticating routes using JWT tokens.
 */

import { appError } from '../utils/appError';
import HTTP_STATUS from '../utils/httpStatus';
import { verifyToken } from '../utils/jwt';

/**
 * Middleware to authenticate incoming requests using Bearer JWT.
 *
 * @async
 * @function authenticateRoute
 * @param {import("express").Request} req - Express request.
 * @param {import("express").Response} res - Express response.
 * @param {import("express").NextFunction} next - Express next function.
 *
 * @throws {AppError} If the token is missing, invalid, or user not found.
 *
 * @example
 * app.use("/api/private", authenticateRoute, privateRoutes);
 */
export const authenticateRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      return next(
        appError('Authorization header missing or malformed', HTTP_STATUS[401])
      );
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken({ token });

    if (!payload?.uid) {
      return next(appError('Invalid token payload', HTTP_STATUS[401]));
    }

    // TODO : Replace with actual user lookup logic, e.g., from a database
    const user = {};
    if (!user) {
      return next(appError('User not found', HTTP_STATUS[401]));
    }

    // Remove sensitive fields before attaching to req
    // const { password, ...userWithoutPassword } = user.toObject();
    req.user = user;

    next();
  } catch (error) {
    console.error('⚠️ Auth middleware error:', error.message);
    return next(appError('Authentication failed', HTTP_STATUS[401]));
  }
};
