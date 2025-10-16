import { appError } from '../utils/appError';
import HTTP_STATUS from '../utils/httpStatus';

/**
 * Middleware to authorize users based on role(s)
 * @param  {...string} allowedRoles - list of roles allowed to access the route
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user; // Must be set by previous auth middleware

    // No user found
    if (!user) {
      return next(
        appError(HTTP_STATUS['401_MESSAGE'] || 'Unauthorized access', 401)
      );
    }

    const { role, user_name } = user;

    // Check if user role is allowed
    if (!role || !allowedRoles.includes(role)) {
      const message = role
        ? `Access denied for role "${role}". Insufficient permissions.`
        : `Access denied for user "${user_name || 'Unknown'}". Role is missing.`;

      return next(appError(message, 403));
    }

    // User authorized
    next();
  };
};
