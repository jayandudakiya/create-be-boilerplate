/**
 * @file mongoErrorFormatter.js
 * @description
 * Utility to standardize and format MongoDB/Mongoose errors into
 * a consistent structure used across the backend.
 *
 * It handles:
 * - Duplicate key errors (code 11000)
 * - Validation errors (Mongoose schema validation)
 * - Cast errors (invalid ObjectId)
 * - Fallback for any unknown MongoDB-related error
 *
 * @example
 * import formatMongoError from "../utils/mongoErrorFormatter.js";
 *
 * try {
 *   await User.create(userData);
 * } catch (error) {
 *   const formatted = formatMongoError(error);
 *   res.status(formatted.statusCode).json(formatted);
 * }
 */

/**
 * Formats MongoDB/Mongoose errors into a standardized response object.
 *
 * @function formatMongoError
 * @param {Error} err - The raw MongoDB or Mongoose error object.
 * @returns {{
 *   statusCode: number,
 *   success: boolean,
 *   message: string
 * }} Standardized error response.
 */
export default function formatMongoError(err) {
  // ✅ Duplicate key error (E11000)
  if (err?.code === 11000 && err?.keyPattern) {
    const field = Object.keys(err.keyPattern)[0] || 'field';
    const value = err?.keyValue?.[field] || '';

    const fieldMap = {
      user_name: 'Username',
      email: 'Email address',
    };

    const friendlyName = fieldMap[field] || field;

    return {
      statusCode: 400,
      success: false,
      message: `${friendlyName} "${value}" already exists.`,
    };
  }

  // ✅ Validation error (Schema validation)
  if (err?.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return {
      statusCode: 400,
      success: false,
      message: messages.join(', '),
    };
  }

  // ✅ CastError (Invalid ObjectId or wrong type)
  if (err?.name === 'CastError') {
    return {
      statusCode: 400,
      success: false,
      message: `Invalid ${err.path} format.`,
    };
  }

  // ⚙️ Default fallback for unknown Mongo errors
  return {
    statusCode: 500,
    success: false,
    message: 'An unexpected database error occurred.',
  };
}
