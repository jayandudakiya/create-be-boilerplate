/**
 * Set authentication cookie
 * @param {Object} params
 * @param {import('express').Response} params.res - Express response object
 * @param {string} params.accessToken - JWT or session token
 * @param {boolean} [params.isProd] - Whether environment is production
 * @param {number} [params.maxAge] - Cookie expiration in milliseconds
 */
export const setAuthCookies = ({
  res,
  accessToken,
  isProd = process.env.NODE_ENV === 'production',
  maxAge = 24 * 60 * 60 * 1000, // 1 day
}) => {
  res.cookie('AUTH_TOKEN', accessToken, {
    httpOnly: true, // Not accessible via JS (protects against XSS)
    secure: isProd, // HTTPS only in production
    sameSite: 'strict', // Prevent CSRF
    maxAge,
    path: '/', // Ensure cookie is available site-wide
  });
};
