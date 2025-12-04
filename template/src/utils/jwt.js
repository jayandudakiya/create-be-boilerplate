/**
 * @file jwt.js
 * @description Utility functions for generating and verifying JWT tokens,
 *              now with access / refresh token support, detailed errors,
 *              and helpful metadata useful for storing token expiry in DB.
 *
 * Env variables expected (defaults shown):
 * - JWT_SECRET                 -> used for access tokens (required by default)
 * - JWT_REFRESH_SECRET         -> used for refresh tokens (required for refresh flow)
 * - JWT_ACCESS_EXPIRES_IN      -> e.g. '15m' (default '15m')
 * - JWT_REFRESH_EXPIRES_IN     -> e.g. '7d'  (default '7d')
 *
 * Usage examples:
 *  const { generateAuthTokens, verifyToken, verifyRefreshToken } = require('./jwt');
 *  const tokens = await generateAuthTokens({ payload: { userId: '123' } });
 *  const decoded = await verifyToken({ token: tokens.accessToken });
 */

import jwt from 'jsonwebtoken';
import AppError from './appError.js';
import HTTP_STATUS from './httpStatus.js';

/**
 * Create a signed JWT.
 *
 * @async
 * @function generateToken
 * @param {Object} options
 * @param {Object} options.payload - Data to encode inside the JWT.
 * @param {string} [options.secret] - Secret to sign token. Falls back to process.env.JWT_SECRET.
 * @param {string|number} [options.expiresIn] - Expiration passed to jwt.sign (e.g. '15m', '7d').
 * @param {Object} [options.signOptions] - Additional jwt.sign options (e.g. algorithm).
 * @returns {Promise<string>} The generated JWT token.
 * @throws {AppError} When secret is missing or token generation fails.
 */
export const generateToken = async ({
  payload = {},
  secret = process.env.JWT_SECRET,
  expiresIn = process.env.JWT_EXPIRES_IN || '1d',
  signOptions = {},
} = {}) => {
  if (!secret) {
    throw new AppError('JWT secret is not defined in environment or call', HTTP_STATUS['500_MESSAGE']);
  }

  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn, ...signOptions }, (err, token) => {
      if (err) {
        console.error('❌ Token generation failed:', err.message);
        return reject(new AppError('Failed to generate token', HTTP_STATUS['500_MESSAGE']));
      }
      resolve(token);
    });
  });
};

/**
 * Verify and decode a JWT.
 *
 * @async
 * @function verifyToken
 * @param {Object} options
 * @param {string} options.token - The JWT token to verify.
 * @param {string} [options.secret] - Secret to verify token. Falls back to process.env.JWT_SECRET.
 * @param {boolean} [options.ignoreExpiration=false] - Pass to jwt.verify options.
 * @returns {Promise<Object>} The decoded JWT payload.
 * @throws {AppError} If verification fails.
 */
export const verifyToken = async ({
  token,
  secret = process.env.JWT_SECRET,
  ignoreExpiration = false,
} = {}) => {
  if (!secret) {
    throw new AppError('JWT secret is not defined in environment or call', HTTP_STATUS['500_MESSAGE']);
  }

  if (!token) {
    throw new AppError('Token is required', HTTP_STATUS['400_MESSAGE']);
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, { ignoreExpiration }, (err, decoded) => {
      if (err) {
        console.error('❌ Token verification failed:', err.message);
        // Use 401 for invalid/expired token as it is an auth failure
        return reject(new AppError('Invalid or expired token', HTTP_STATUS['401_UNAUTHORIZED']));
      }
      resolve(decoded);
    });
  });
};

/**
 * Convenience: generate an access token and a refresh token together.
 *
 * @async
 * @function generateAuthTokens
 * @param {Object} options
 * @param {Object} options.payload - Data to encode inside both tokens (keep minimal, e.g. userId).
 * @param {string} [options.accessSecret] - override access secret (defaults to process.env.JWT_SECRET)
 * @param {string} [options.refreshSecret] - override refresh secret (defaults to process.env.JWT_REFRESH_SECRET)
 * @param {string} [options.accessExpiresIn] - override access expiresIn (defaults to process.env.JWT_ACCESS_EXPIRES_IN || '15m')
 * @param {string} [options.refreshExpiresIn] - override refresh expiresIn (defaults to process.env.JWT_REFRESH_EXPIRES_IN || '7d')
 * @returns {Promise<Object>} { accessToken, refreshToken, accessExpiresAt, refreshExpiresAt }
 * @throws {AppError} If required secrets are missing or generation fails.
 */
export const generateAuthTokens = async ({
  payload = {},
  accessSecret = process.env.JWT_SECRET,
  refreshSecret = process.env.JWT_REFRESH_SECRET,
  accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  accessSignOptions = {},
  refreshSignOptions = {},
} = {}) => {
  if (!accessSecret) {
    throw new AppError('Access token secret is not defined', HTTP_STATUS['500_MESSAGE']);
  }
  if (!refreshSecret) {
    throw new AppError('Refresh token secret is not defined', HTTP_STATUS['500_MESSAGE']);
  }

  // generate tokens in parallel
  try {
    const [accessToken, refreshToken] = await Promise.all([
      generateToken({ payload, secret: accessSecret, expiresIn: accessExpiresIn, signOptions: accessSignOptions }),
      generateToken({ payload, secret: refreshSecret, expiresIn: refreshExpiresIn, signOptions: refreshSignOptions }),
    ]);

    // derive expiry timestamps (best effort): jwt.decode does not verify expiration but returns exp if present
    const decodedAccess = jwt.decode(accessToken) || {};
    const decodedRefresh = jwt.decode(refreshToken) || {};

    const accessExpiresAt = decodedAccess.exp ? new Date(decodedAccess.exp * 1000).toISOString() : null;
    const refreshExpiresAt = decodedRefresh.exp ? new Date(decodedRefresh.exp * 1000).toISOString() : null;

    return { accessToken, refreshToken, accessExpiresAt, refreshExpiresAt };
  } catch (err) {
    console.error('❌ Failed to generate auth tokens:', err.message || err);
    // wrap if it's not an AppError
    if (err instanceof AppError) throw err;
    throw new AppError('Failed to generate auth tokens', HTTP_STATUS['500_MESSAGE']);
  }
};

/**
 * Verify a refresh token specifically (helper).
 *
 * @async
 * @function verifyRefreshToken
 * @param {Object} options
 * @param {string} options.token - Refresh token to verify.
 * @param {string} [options.secret] - Secret to verify refresh tokens. Defaults to process.env.JWT_REFRESH_SECRET.
 * @returns {Promise<Object>} The decoded payload.
 * @throws {AppError} If verification fails.
 */
export const verifyRefreshToken = async ({ token, secret = process.env.JWT_REFRESH_SECRET } = {}) => {
  return verifyToken({ token, secret });
};

/**
 * Lightweight decode WITHOUT verification (useful for reading `exp` or `iat`).
 * WARNING: do not use decode for auth decisions — always verify the token.
 *
 * @function decodeToken
 * @param {string} token
 * @returns {Object|null} decoded payload or null
 */
export const decodeToken = (token) => {
  if (!token) return null;
  try {
    return jwt.decode(token) || null;
  } catch (err) {
    console.error('❌ Token decode failed:', err.message || err);
    return null;
  }
};

export default {
  generateToken,
  verifyToken,
  generateAuthTokens,
  verifyRefreshToken,
  decodeToken,
};
