/**
 * @file appError.js
 * @description
 * Defines a reusable custom error class for operational (expected) errors in the application.
 * This allows throwing meaningful, structured errors from services, controllers, or middlewares,
 * which are then handled consistently by the global error handler.
 *
 * @example
 * import { appError } from "../utils/appError.js";
 *
 *  Example usage inside a controller
 * if (!user) {
 *   throw appError("User not found", 404);
 * }
 */

/**
 * Custom application error class extending the native Error object.
 * Marks the error as "operational" to distinguish it from programming errors.
 *
 * @class AppError
 * @extends Error
 *
 * @param {string} message - A human-readable error message describing what went wrong.
 * @param {number} statusCode - HTTP status code representing the error (e.g., 400, 404, 500).
 *
 * @property {boolean} isOperational - Flag indicating whether the error is operational
 * (expected and handled gracefully) or a programming error.
 *
 * @example
 * throw new AppError("Invalid credentials", 401);
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    /** @type {number} */
    this.statusCode = statusCode;

    /** @type {boolean} Indicates if the error is safe to expose to clients */
    this.isOperational = true;

    // Captures the stack trace excluding the constructor call
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Factory helper that returns a new instance of AppError.
 *
 * @function appError
 * @param {string} message - The error message.
 * @param {number} statusCode - HTTP status code to send to the client.
 * @returns {AppError} A new AppError instance.
 *
 * @example
 * return next(appError("Unauthorized access", 401));
 */
const appError = (message, statusCode) => new AppError(message, statusCode);

export { appError };
export default AppError;
