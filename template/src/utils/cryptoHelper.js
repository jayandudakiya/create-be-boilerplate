import CryptoJS from 'crypto-js';
import AppError from './appError';

const SECRET_KEY = process.env.ENCRYPT_SECRET_KEY;

if (!SECRET_KEY) {
  throw new AppError(
    'Encryption secret key is not set in environment variables',
    500
  );
}

/**
 * Encrypts data with AES
 * @param {Object} params
 * @param {string} params.keyName - Name of the key to prefix
 * @param {string|number|boolean} params.data - Data to encrypt
 * @returns {string} - Encrypted string
 */
export const encryptData = ({ keyName, data }) => {
  try {
    const dataToEncrypt = JSON.stringify({ [keyName]: data });
    const encrypted = CryptoJS.AES.encrypt(
      dataToEncrypt,
      SECRET_KEY
    ).toString();
    return encrypted;
  } catch (error) {
    console.error('encryptData error:', error);
    throw new AppError('Data encryption failed', 500);
  }
};

/**
 * Decrypts AES encrypted data
 * @param {Object} params
 * @param {string} params.encryptedData - Encrypted string
 * @returns {Object} - Decrypted object { keyName: value }
 */
export const decryptData = ({ encryptedData }) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      throw new AppError('Invalid encrypted data', 400);
    }

    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('decryptData error:', error);
    throw new AppError('Data decryption failed', 500);
  }
};
