import bcrypt from 'bcrypt';

// Use environment variable or default to 10 rounds
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;

/**
 * Hash a plain text password
 * @param {Object} params
 * @param {string} params.value - Plain password
 * @returns {Promise<string>} - Hashed password
 */
export const hashPassword = async ({ value }) => {
  try {
    if (!value) throw new Error('Password is required for hashing');
    return await bcrypt.hash(value, SALT_ROUNDS);
  } catch (err) {
    console.error('hashPassword error:', err.message);
    throw new Error('Password hashing failed');
  }
};

/**
 * Compare raw password with hashed password
 * @param {Object} params
 * @param {string} params.rawValue - Plain password
 * @param {string} params.hashedValue - Hashed password from DB
 * @returns {Promise<boolean>} - True if match, false otherwise
 */
export const comparePassword = async ({ rawValue, hashedValue }) => {
  try {
    if (!rawValue || !hashedValue) return false;
    return await bcrypt.compare(rawValue, hashedValue);
  } catch (err) {
    console.error('comparePassword error:', err.message);
    return false; // Fail safe: return false instead of throwing
  }
};
