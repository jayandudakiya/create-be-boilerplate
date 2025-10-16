/**
 * @file jwt.js
 * @description Utility functions for generating and verifying JWT tokens.
 */

import jwt from 'jsonwebtoken';
import AppError from './appError';
import HTTP_STATUS from './httpStatus';

/**
 * Generates a signed JWT token.
 *
 * @async
 * @function generateToken
 * @param {Object} options
 * @param {Object} options.payload - Data to encode inside the JWT.
 * @param {Object} [options.signOptions] - Additional jwt.sign options (e.g., expiresIn).
 * @returns {Promise<string>} The generated JWT token.
 * @throws {AppError} If JWT_SECRET is missing or token creation fails.
 */
export const generateToken = async ({ payload, signOptions = {} }) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = signOptions.expiresIn || process.env.JWT_EXPIRES_IN || '1d';

  if (!secret) {
    throw new AppError(
      'JWT_SECRET is not defined in environment',
      HTTP_STATUS['500_MESSAGE']
    );
  }

  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn }, (err, token) => {
      if (err) {
        console.error('❌ Token generation failed:', err.message);
        return reject(
          new AppError('Failed to generate token', HTTP_STATUS['500_MESSAGE'])
        );
      }
      resolve(token);
    });
  });
};

/**
 * Verifies and decodes a JWT token.
 *
 * @async
 * @function verifyToken
 * @param {Object} options
 * @param {string} options.token - The JWT token to verify.
 * @returns {Promise<Object>} The decoded JWT payload.
 * @throws {AppError} If the token is invalid or expired.
 */
export const verifyToken = async ({ token }) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError(
      'JWT_SECRET is not defined in environment',
      HTTP_STATUS['500_MESSAGE']
    );
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.error('❌ Token verification failed:', err.message);
        return reject(
          new AppError('Invalid or expired token', HTTP_STATUS['500_MESSAGE'])
        );
      }
      resolve(decoded);
    });
  });
};
