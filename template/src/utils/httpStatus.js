/**
 * @file httpStatus.js
 * @description
 * Centralized collection of HTTP status codes, their standard names, messages,
 * and classification groups (1xx–5xx).
 *
 * Designed to provide descriptive context for building API responses,
 * logging, and consistent error handling throughout the backend.
 *
 * @example
 * import HTTP_STATUS from "../utils/httpStatus.js";
 *
 * res.status(HTTP_STATUS.OK).json({
 *   status: HTTP_STATUS["200_NAME"], // "OK"
 *   message: HTTP_STATUS["200_MESSAGE"], // "Request completed successfully."
 * });
 */

/**
 * HTTP status codes and metadata.
 *
 * @constant
 * @type {Record<string|number, string>}
 */
const HTTP_STATUS = {
  // ===== Informational (1xx) =====
  '1xx': 'Informational',
  '1xx_NAME': 'INFORMATIONAL',
  '1xx_MESSAGE':
    'Indicates an interim response for communicating connection status or request progress.',

  // ===== Success (2xx) =====
  '2xx': 'Successful',
  '2xx_NAME': 'SUCCESSFUL',
  '2xx_MESSAGE': 'The request was successfully processed.',

  200: 'OK',
  '200_NAME': 'OK',
  '200_MESSAGE': 'Request completed successfully.',
  '200_CLASS': '2xx',

  201: 'Created',
  '201_NAME': 'CREATED',
  '201_MESSAGE': 'Resource created successfully.',
  '201_CLASS': '2xx',

  202: 'Accepted',
  '202_NAME': 'ACCEPTED',
  '202_MESSAGE': 'Request accepted but not yet processed.',
  '202_CLASS': '2xx',

  // ===== Redirection (3xx) =====
  '3xx': 'Redirection',
  '3xx_NAME': 'REDIRECTION',
  '3xx_MESSAGE': 'Further action must be taken to complete the request.',

  // ===== Client Error (4xx) =====
  '4xx': 'Client Error',
  '4xx_NAME': 'CLIENT_ERROR',
  '4xx_MESSAGE': 'The request contains invalid data or cannot be processed.',

  400: 'Bad Request',
  '400_NAME': 'BAD_REQUEST',
  '400_MESSAGE': 'Invalid request. Please check your input.',
  '400_CLASS': '4xx',

  401: 'Unauthorized',
  '401_NAME': 'UNAUTHORIZED',
  '401_MESSAGE': 'Authentication required or session expired.',
  '401_CLASS': '4xx',

  403: 'Forbidden',
  '403_NAME': 'FORBIDDEN',
  '403_MESSAGE': 'You do not have permission to access this resource.',
  '403_CLASS': '4xx',

  404: 'Not Found',
  '404_NAME': 'NOT_FOUND',
  '404_MESSAGE': 'Requested resource not found.',
  '404_CLASS': '4xx',

  409: 'Conflict',
  '409_NAME': 'CONFLICT',
  '409_MESSAGE': 'Request could not be completed due to a conflict.',
  '409_CLASS': '4xx',

  422: 'Unprocessable Entity',
  '422_NAME': 'UNPROCESSABLE_ENTITY',
  '422_MESSAGE': 'Request was well-formed but could not be processed.',
  '422_CLASS': '4xx',

  // ===== Server Error (5xx) =====
  '5xx': 'Server Error',
  '5xx_NAME': 'SERVER_ERROR',
  '5xx_MESSAGE': 'The server encountered an unexpected error.',

  500: 'Internal Server Error',
  '500_NAME': 'INTERNAL_SERVER_ERROR',
  '500_MESSAGE': 'An unexpected server error occurred.',
  '500_CLASS': '5xx',

  501: 'Not Implemented',
  '501_NAME': 'NOT_IMPLEMENTED',
  '501_MESSAGE':
    'The server does not support the functionality required to fulfill the request.',
  '501_CLASS': '5xx',

  503: 'Service Unavailable',
  '503_NAME': 'SERVICE_UNAVAILABLE',
  '503_MESSAGE': 'The server is not ready to handle the request.',
  '503_CLASS': '5xx',

  504: 'Gateway Timeout',
  '504_NAME': 'GATEWAY_TIMEOUT',
  '504_MESSAGE':
    'The server was acting as a gateway and did not receive a timely response.',
  '504_CLASS': '5xx',
};

export default HTTP_STATUS;
