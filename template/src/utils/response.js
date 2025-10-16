/**
 * @file response.js
 * @description
 * Utility module for sending consistent API responses across the application.
 * Provides helper functions for success and error responses with clear structure.
 *
 * @example
 * import { sendSuccess, sendError } from "../utils/response.js";
 * import HTTP_STATUS from "../utils/httpStatus.js";
 *
 * // Example in controller:
 * sendSuccess(res, { user }, "User retrieved successfully", HTTP_STATUS.OK);
 *
 * // Example in error handler:
 * sendError(res, "User not found", HTTP_STATUS.NOT_FOUND);
 */

import HTTP_STATUS from './httpStatus.js';

/**
 * Sends a standardized success response.
 *
 * @function sendSuccess
 * @param {import('express').Response} res - Express response object.
 * @param {any} [data={}] - Response payload (object, array, or primitive).
 * @param {string} [message="Success"] - Custom success message.
 * @param {number} [statusCode=HTTP_STATUS.OK] - HTTP status code (default: 200).
 * @param {Object} [meta] - Optional metadata (e.g., pagination info, totals).
 * @returns {import('express').Response} Formatted JSON response.
 *
 * @example
 * sendSuccess(res, { id: 1 }, "Created successfully", HTTP_STATUS.CREATED);
 */
export const sendSuccess = (
  res,
  data = {},
  message = 'Success',
  statusCode = HTTP_STATUS.OK,
  meta = null
) => {
  const response = {
    success: true,
    statusCode,
    message,
    data,
  };

  if (meta) response.meta = meta;

  return res.status(statusCode).json(response);
};

/**
 * Sends a standardized error response.
 *
 * @function sendError
 * @param {import('express').Response} res - Express response object.
 * @param {string|Error} error - Error message or Error instance.
 * @param {number} [statusCode=HTTP_STATUS.INTERNAL_SERVER_ERROR] - HTTP status code.
 * @param {any} [details=null] - Optional additional error details (validation, stack, etc.).
 * @returns {import('express').Response} Formatted JSON error response.
 *
 * @example
 * sendError(res, "Invalid credentials", HTTP_STATUS.UNAUTHORIZED);
 */
export const sendError = (
  res,
  error,
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  details = null
) => {
  const message = error instanceof Error ? error.message : error;

  const response = {
    success: false,
    statusCode,
    message,
  };

  if (details) response.details = details;

  return res.status(statusCode).json(response);
};

/**
 * Generic response handler that chooses between success or error automatically.
 *
 * @function sendResponse
 * @param {import('express').Response} res - Express response object.
 * @param {boolean} success - Indicates if the response is a success.
 * @param {any} payload - Data or error message.
 * @param {number} [statusCode] - HTTP status code.
 * @param {string} [message] - Optional custom message.
 * @returns {import('express').Response}
 *
 * @example
 * sendResponse(res, true, { user }, 200, "OK");
 * sendResponse(res, false, "Not found", 404);
 */
export const sendResponse = (res, success, payload, statusCode, message) => {
  return success
    ? sendSuccess(res, payload, message, statusCode)
    : sendError(res, payload, statusCode);
};

export default {
  sendSuccess,
  sendError,
  sendResponse,
};
