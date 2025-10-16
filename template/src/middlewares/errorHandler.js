/**
 * @file errorHandler.js
 * @description
 * Centralized Express error-handling middleware that catches all errors thrown in routes,
 * controllers, or services. It gracefully handles:
 *  - Mongoose/MongoDB validation, cast, and duplicate key errors.
 *  - Custom application errors with `statusCode` and `message` fields.
 *  - Fallback to a generic internal server error if the error type is unknown.
 *
 * This middleware ensures consistent error responses across the API.
 *
 * @module middlewares/errorHandler
 */

import formatMongoError from '../utils/mongoErrorFormatter.js';

/**
 * Express Error Handling Middleware
 *
 * @function errorHandler
 * @param {Error} err - The error object passed by `next(err)` from any controller/service.
 * @param {import('express').Request} req - The Express Request object.
 * @param {import('express').Response} res - The Express Response object.
 * @param {import('express').NextFunction} next - The next middleware function (for chaining).
 *
 * @returns {void} Sends a JSON response with the appropriate HTTP status and error message.
 *
 * @example
 *  Example usage in a controller:
 * import AppError from '../utils/appError.js';
 *
 * export const getUser = async (req, res, next) => {
 *   try {
 *     const user = await User.findById(req.params.id);
 *     if (!user) throw new AppError('User not found', 404);
 *     res.json(user);
 *   } catch (error) {
 *     next(error); // Handled by errorHandler
 *   }
 * };
 *
 *  The errorHandler middleware will automatically catch and format the error.
 */
const errorHandler = (err, req, res) => {
  console.error('> ==== errorHandler', err);

  // Default status and message
  let statusCode = err.statusCode || 500;
  let message;

  //  Handle MongoDB/Mongoose-specific errors
  if (
    err?.code === 11000 || // Duplicate key error
    err?.name === 'ValidationError' ||
    err?.name === 'CastError'
  ) {
    const formatted = formatMongoError(err);
    statusCode = formatted.statusCode;
    message = formatted.message;
  } else {
    // Fallback logic for general errors
    const defaultMessage = 'Something went wrong!';
    message = err.message
      ? err.message
      : err.stack
        ? err.stack
        : err?.toString?.()
          ? err.toString()
          : defaultMessage;
  }

  //  Standardized error response
  const errorResponse = {
    success: false,
    message,
  };

  res.status(statusCode).json(errorResponse);
};

export default errorHandler;
